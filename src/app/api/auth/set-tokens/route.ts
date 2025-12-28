import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { setAuthCookies, validateRequestOrigin } from '@/lib/auth-cookies'
import { AUTH_RATE_LIMITS, checkRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/set-tokens
 * Securely stores access and refresh tokens in httpOnly cookies
 * Called after successful login (wallet or OAuth)
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request.headers)
  const rateLimitResult = checkRateLimit(`set-tokens:${clientIp}`, AUTH_RATE_LIMITS.setTokens)
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

  // CSRF protection: validate request origin
  if (!validateRequestOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { token, refresh_token, expires_in } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    if (!refresh_token || typeof refresh_token !== 'string') {
      return NextResponse.json({ error: 'Missing refresh_token' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })
    setAuthCookies(response, token, refresh_token, expires_in)

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
