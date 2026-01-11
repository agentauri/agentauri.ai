/**
 * Logout API route
 *
 * Clears authentication cookies to log out the user.
 * Required because httpOnly cookies cannot be cleared from client-side JavaScript.
 *
 * @module app/api/auth/logout
 *
 * @remarks
 * Security features:
 * - Rate limiting per IP address (prevents logout bombing)
 * - Clears both access and refresh token cookies
 * - Returns success even if user wasn't logged in (idempotent)
 *
 * @example
 * ```ts
 * // Logout the user
 * await fetch('/api/auth/logout', {
 *   method: 'POST',
 *   credentials: 'include',
 * })
 *
 * // Redirect to login page
 * window.location.href = '/login'
 * ```
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth-cookies'
import { AUTH_RATE_LIMITS, checkRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/logout
 *
 * Clears all httpOnly auth cookies.
 *
 * @param request - Next.js request object
 * @returns JSON response with success status, cookies cleared
 */
export async function POST(request: NextRequest) {
  // Rate limiting (prevent logout bombing)
  const clientIp = getClientIp(request.headers)
  const rateLimitResult = checkRateLimit(`logout:${clientIp}`, AUTH_RATE_LIMITS.logout)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000)),
        },
      }
    )
  }

  const response = NextResponse.json({ success: true })
  clearAuthCookies(response)
  return response
}
