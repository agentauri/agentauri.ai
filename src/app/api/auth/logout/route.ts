import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth-cookies'
import { AUTH_RATE_LIMITS, checkRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/logout
 * Clears all httpOnly auth cookies (can't be cleared from client-side JS)
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
