import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { setAuthCookies } from '@/lib/auth-cookies'
import { API_VERSION } from '@/lib/constants'
import { AUTH_RATE_LIMITS, checkRateLimit, getClientIp } from '@/lib/rate-limit'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

/**
 * POST /api/auth/exchange
 * Exchanges OAuth authorization code for tokens
 * Called after OAuth callback redirects with ?code=oac_xxx
 *
 * Flow:
 * 1. Frontend receives ?code=oac_xxx from OAuth callback
 * 2. Frontend calls this route with the code
 * 3. This route exchanges code with backend for tokens
 * 4. Tokens stored in httpOnly cookies
 * 5. Returns success + user data to frontend
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request.headers)
  const rateLimitResult = checkRateLimit(`exchange:${clientIp}`, AUTH_RATE_LIMITS.exchange)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000)),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
    }

    // Validate code format (should start with oac_)
    if (!code.startsWith('oac_')) {
      return NextResponse.json({ error: 'Invalid authorization code format' }, { status: 400 })
    }

    // Call backend exchange endpoint
    const backendResponse = await fetch(`${API_BASE_URL}/api/${API_VERSION}/auth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (!backendResponse.ok) {
      // Use generic error message to prevent information disclosure
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    const data = await backendResponse.json()
    const { token, refresh_token, expires_in, user } = data

    if (!token || !refresh_token) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }

    // Create response with user data
    const response = NextResponse.json({ success: true, user })
    setAuthCookies(response, token, refresh_token, expires_in)

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
