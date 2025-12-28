import type { NextRequest, NextResponse } from 'next/server'

/**
 * Shared auth cookie configuration
 * Centralizes cookie security settings to ensure consistency
 */

const ACCESS_TOKEN_MAX_AGE_DEFAULT = 60 * 60 // 1 hour
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * Cookie configuration for access token
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
 * Cookie configuration for refresh token
 * Uses stricter sameSite policy
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
 * Set auth cookies on a NextResponse
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
 * Clear auth cookies on a NextResponse
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
