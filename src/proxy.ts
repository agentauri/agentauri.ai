import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSecurityHeaders } from '@/lib/security-headers'

/**
 * Public paths that don't require authentication
 * Uses exact matching to prevent path traversal attacks
 */
const PUBLIC_PATHS = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/callback', // OAuth callback - handles code exchange
  '/home-warp',
  '/features',
  '/pricing',
  '/docs',
  '/changelog',
])

/**
 * Auth paths where authenticated users should be redirected away
 */
const AUTH_PATHS = new Set(['/login', '/register'])

/**
 * Paths that should be completely excluded from proxy
 */
const EXCLUDED_PREFIXES = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml']

/**
 * Check if token has valid JWT structure
 *
 * The proxy only checks token structure, NOT validity.
 * The backend is the single source of truth for authentication.
 * This approach:
 * - Avoids JWT_SECRET sync issues between frontend/backend
 * - Backend validates tokens on every API call
 * - Proxy just manages cookie/redirect flow
 */
function hasValidTokenStructure(token: string): boolean {
  // JWT has 3 base64url parts separated by dots: header.payload.signature
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }

  // Each part should be non-empty and look like base64url
  const base64urlRegex = /^[A-Za-z0-9_-]+$/
  return parts.every((part) => part.length > 0 && base64urlRegex.test(part))
}

/**
 * Normalize pathname for consistent matching
 * Removes trailing slashes and converts to lowercase
 */
function normalizePath(pathname: string): string {
  // Remove trailing slash (except for root)
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  return normalized.toLowerCase()
}

/**
 * Check if path should be excluded from proxy
 */
function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const normalizedPath = normalizePath(pathname)

  // Skip proxy for excluded paths
  if (isExcludedPath(pathname)) {
    const response = NextResponse.next()
    // Add security headers to all responses
    const headers = getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // OAuth now uses Authorization Code Flow:
  // Backend redirects to /callback?code=oac_xxx
  // The /callback page exchanges the code for tokens via /api/auth/exchange
  // No token handling needed in proxy - the callback page handles everything

  const token = request.cookies.get('auth-token')?.value

  // Exact match for public and auth paths (prevents /login/../admin attacks)
  const isPublicPath = PUBLIC_PATHS.has(normalizedPath)
  const isAuthPath = AUTH_PATHS.has(normalizedPath)

  // Check if token exists and has valid structure
  // Actual validation happens on the backend for every API call
  const hasValidToken = token ? hasValidTokenStructure(token) : false

  // Redirect authenticated users away from auth pages
  if (hasValidToken && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow access to root and public paths without authentication
  if (normalizedPath === '/' || isPublicPath) {
    const response = NextResponse.next()
    // Add security headers
    const headers = getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Redirect unauthenticated users to login for protected routes
  if (!hasValidToken) {
    // Clear invalid token cookie if present
    const response = NextResponse.redirect(new URL('/login', request.url))

    if (token && !hasValidToken) {
      response.cookies.delete('auth-token')
    }

    // Store the original URL for redirect after login
    const callbackUrl = encodeURIComponent(pathname)
    response.cookies.set('auth-callback', callbackUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
    })

    // Add security headers to redirect response
    const headers = getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  // Add security headers to authenticated responses
  const response = NextResponse.next()
  const headers = getSecurityHeaders()
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (files with extensions)
     * - api/webhooks (webhook endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
  ],
}
