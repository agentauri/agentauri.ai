/**
 * Token refresh API route
 *
 * Refreshes expired access tokens using the refresh token.
 * Called automatically by the API client when receiving 401 responses.
 *
 * @module app/api/auth/refresh
 *
 * @remarks
 * Security features:
 * - Rate limiting per IP address
 * - Refresh token read from httpOnly cookie (not exposed to JS)
 * - New tokens stored in httpOnly cookies
 * - Cookies cleared on refresh failure (forces re-login)
 *
 * The API client implements a mutex pattern to prevent multiple
 * concurrent refresh attempts when several requests fail simultaneously.
 *
 * @example
 * ```ts
 * // Called automatically by apiClient on 401
 * const response = await fetch('/api/auth/refresh', {
 *   method: 'POST',
 *   credentials: 'include', // Sends httpOnly cookies
 * })
 *
 * if (response.ok) {
 *   // Retry original request - new tokens are in cookies
 * } else {
 *   // Redirect to login
 * }
 * ```
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { clearAuthCookies, setAuthCookies } from '@/lib/auth-cookies'
import { API_VERSION } from '@/lib/constants'
import { AUTH_RATE_LIMITS, checkRateLimit, getClientIp } from '@/lib/rate-limit'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

/**
 * POST /api/auth/refresh
 *
 * Refreshes the access token using the refresh token from httpOnly cookie.
 *
 * @param request - Next.js request object (refresh token in cookies)
 * @returns JSON response with success status, new tokens in cookies
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request.headers)
  const rateLimitResult = checkRateLimit(`refresh:${clientIp}`, AUTH_RATE_LIMITS.refresh)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', code: 'RATE_LIMITED' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000)),
        },
      }
    )
  }

  const refreshToken = request.cookies.get('refresh-token')?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'No refresh token', code: 'NO_REFRESH_TOKEN' },
      { status: 401 }
    )
  }

  try {
    // Call backend refresh endpoint
    const backendResponse = await fetch(`${API_BASE_URL}/api/${API_VERSION}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!backendResponse.ok) {
      // Refresh token is invalid or expired - clear cookies
      const errorResponse = NextResponse.json(
        { error: 'Refresh token invalid', code: 'REFRESH_FAILED' },
        { status: 401 }
      )
      clearAuthCookies(errorResponse)
      return errorResponse
    }

    const data = await backendResponse.json()
    const { token, refresh_token: newRefreshToken, expires_in } = data

    // Create success response and set new tokens
    const response = NextResponse.json({ success: true })
    setAuthCookies(response, token, newRefreshToken, expires_in)

    return response
  } catch (error) {
    // Log error type without exposing sensitive details
    console.error('Token refresh error:', {
      type: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Token refresh failed',
    })
    return NextResponse.json(
      { error: 'Refresh failed', code: 'REFRESH_ERROR' },
      { status: 500 }
    )
  }
}
