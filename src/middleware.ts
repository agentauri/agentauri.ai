import { jwtVerify } from 'jose'
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
 * Paths that should be completely excluded from middleware
 */
const EXCLUDED_PREFIXES = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml']

/**
 * JWT secret for token validation
 * In production, this should come from environment variables
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-for-development-only'
)

interface JwtPayload {
  sub: string
  exp: number
  iat: number
}

/**
 * Validate JWT token structure and expiration
 * Returns true if token is valid, false otherwise
 */
async function isValidToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify<JwtPayload>(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })

    // Check if token has required fields
    if (!payload.sub || !payload.exp) {
      return false
    }

    // Token expiration is automatically checked by jwtVerify
    return true
  } catch {
    // Token is invalid, expired, or malformed
    return false
  }
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
 * Check if path should be excluded from middleware
 */
function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const normalizedPath = normalizePath(pathname)

  // Skip middleware for excluded paths
  if (isExcludedPath(pathname)) {
    const response = NextResponse.next()
    // Add security headers to all responses
    const headers = getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  const token = request.cookies.get('auth-token')?.value

  // Exact match for public and auth paths (prevents /login/../admin attacks)
  const isPublicPath = PUBLIC_PATHS.has(normalizedPath)
  const isAuthPath = AUTH_PATHS.has(normalizedPath)

  // Validate token if present
  const hasValidToken = token ? await isValidToken(token) : false

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
