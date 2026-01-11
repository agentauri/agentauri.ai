/**
 * Shared auth cookie configuration
 *
 * Centralizes cookie security settings to ensure consistency
 * across all authentication-related operations:
 * - httpOnly cookies for XSS protection
 * - Secure flag in production
 * - Appropriate SameSite policies
 *
 * @module lib/auth-cookies
 */

import type { NextRequest, NextResponse } from 'next/server'

/** Default access token lifetime: 1 hour */
const ACCESS_TOKEN_MAX_AGE_DEFAULT = 60 * 60

/** Refresh token lifetime: 30 days */
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

/**
 * Get cookie options for access token
 *
 * Returns secure cookie configuration with:
 * - httpOnly: true (prevents XSS access)
 * - secure: true in production (HTTPS only)
 * - sameSite: 'lax' (allows top-level navigation)
 *
 * @param expiresIn - Custom expiration in seconds (default: 1 hour)
 * @returns Cookie options object
 *
 * @example
 * ```ts
 * response.cookies.set('auth-token', token, getAccessTokenCookieOptions())
 * response.cookies.set('auth-token', token, getAccessTokenCookieOptions(1800)) // 30 min
 * ```
 */
export function getAccessTokenCookieOptions(expiresIn?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: typeof expiresIn === 'number' ? expiresIn : ACCESS_TOKEN_MAX_AGE_DEFAULT,
  }
}

/**
 * Get cookie options for refresh token
 *
 * Returns secure cookie configuration with stricter settings:
 * - httpOnly: true (prevents XSS access)
 * - secure: true in production (HTTPS only)
 * - sameSite: 'strict' (more restrictive than access token)
 * - maxAge: 30 days
 *
 * @returns Cookie options object
 *
 * @example
 * ```ts
 * response.cookies.set('refresh-token', token, getRefreshTokenCookieOptions())
 * ```
 */
export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  }
}

/**
 * Set authentication cookies on a NextResponse
 *
 * Sets both access and refresh tokens with appropriate security options.
 *
 * @param response - NextResponse to set cookies on
 * @param token - Access token value
 * @param refreshToken - Refresh token value
 * @param expiresIn - Optional custom access token expiration (seconds)
 *
 * @example
 * ```ts
 * // In API route handler
 * const response = NextResponse.json({ success: true })
 * setAuthCookies(response, accessToken, refreshToken)
 * return response
 * ```
 */
export function setAuthCookies(
  response: NextResponse,
  token: string,
  refreshToken: string,
  expiresIn?: number
): void {
  response.cookies.set('auth-token', token, getAccessTokenCookieOptions(expiresIn))
  response.cookies.set('refresh-token', refreshToken, getRefreshTokenCookieOptions())
}

/**
 * Clear authentication cookies on a NextResponse
 *
 * Removes both access and refresh tokens by setting them to
 * empty strings with maxAge: 0.
 *
 * @param response - NextResponse to clear cookies on
 *
 * @example
 * ```ts
 * // In logout handler
 * const response = NextResponse.json({ success: true })
 * clearAuthCookies(response)
 * return response
 * ```
 */
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set('refresh-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}

/**
 * Validate that request is from same origin (CSRF protection)
 *
 * Checks request headers to verify the request originated from
 * the same site, providing CSRF protection for state-changing requests.
 *
 * Validates:
 * - sec-fetch-site header equals 'same-origin'
 * - origin header hostname matches host header
 *
 * @param request - NextRequest to validate
 * @returns True if request appears to be from same origin
 *
 * @example
 * ```ts
 * // In API route middleware
 * if (request.method !== 'GET' && !validateRequestOrigin(request)) {
 *   return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
 * }
 * ```
 */
export function validateRequestOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  // Verify it's a fetch/XHR request (not form submission)
  const secFetchSite = request.headers.get('sec-fetch-site')
  if (secFetchSite && secFetchSite !== 'same-origin') {
    return false
  }

  // If origin header is present, verify it matches host
  if (origin && host) {
    try {
      const originUrl = new URL(origin)
      // Compare hostnames (without port for flexibility in dev)
      if (originUrl.hostname !== host.split(':')[0]) {
        return false
      }
    } catch {
      return false
    }
  }

  return true
}
