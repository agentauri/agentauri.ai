import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { authApi } from '../auth'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('authApi', () => {
  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('getNonce', () => {
    const testAddress = '0x1234567890123456789012345678901234567890'

    it('should fetch nonce with address', async () => {
      const mockResponse = {
        nonce: '550e8400-e29b-41d4-a716-446655440000',
        expires_at: '2025-01-01T00:05:00Z',
        message: 'Sign this message to authenticate with AgentAuri.\n\nNonce: 550e8400-...',
      }

      server.use(
        http.post(`${baseUrl}/auth/nonce`, async ({ request }) => {
          const body = await request.json() as { address: string }
          expect(body.address).toBe(testAddress)
          return HttpResponse.json(mockResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await authApi.getNonce(testAddress)

      expect(result.nonce).toBe(mockResponse.nonce)
      expect(result.expires_at).toBe(mockResponse.expires_at)
      expect(result.message).toBe(mockResponse.message)
    })

    it('should validate response with schema', async () => {
      server.use(
        http.post(`${baseUrl}/auth/nonce`, () => {
          return HttpResponse.json({
            nonce: 'not-a-uuid', // Invalid UUID format
            expires_at: '2025-01-01T00:05:00Z',
            message: 'Some message',
          })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(authApi.getNonce(testAddress)).rejects.toThrow()
    })
  })

  describe('loginWithWallet', () => {
    const validRequest = {
      address: '0x1234567890123456789012345678901234567890',
      message: 'Sign in with Ethereum to AgentAuri',
      signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    }

    it('should login successfully', async () => {
      const mockResponse = {
        token: 'jwt-token-here',
        refresh_token: 'refresh-token-here',
        expires_in: 3600,
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'wallet_1234abcd',
          email: 'test@example.com',
          name: null,
          avatar: null,
          created_at: '2025-01-01T00:00:00Z',
          is_active: true,
        },
      }

      server.use(
        http.post(`${baseUrl}/auth/wallet`, async ({ request }) => {
          const body = await request.json() as { address: string; message: string; signature: string }
          expect(body.address).toBe(validRequest.address)
          expect(body.message).toBe(validRequest.message)
          expect(body.signature).toBe(validRequest.signature)
          return HttpResponse.json(mockResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await authApi.loginWithWallet(validRequest)

      expect(result.token).toBe(mockResponse.token)
      expect(result.user.id).toBe(mockResponse.user.id)
    })

    it('should handle login error', async () => {
      server.use(
        http.post(`${baseUrl}/auth/wallet`, () => {
          return HttpResponse.json({ message: 'Invalid signature' }, { status: 401 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(authApi.loginWithWallet(validRequest)).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Logged out successfully',
      }

      server.use(
        http.post(`${baseUrl}/auth/logout`, () => {
          return HttpResponse.json(mockResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await authApi.logout()
      expect(result.success).toBe(true)
    })

    it('should handle logout error', async () => {
      server.use(
        http.post(`${baseUrl}/auth/logout`, () => {
          return HttpResponse.json({ message: 'Session not found' }, { status: 401 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(authApi.logout()).rejects.toThrow()
    })
  })

  describe('getSession', () => {
    it('should fetch current session', async () => {
      const mockSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.png',
        wallets: [
          { address: '0x1234567890123456789012345678901234567890', chain_id: 1 },
        ],
        providers: ['google'],
        organizations: [
          { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Test Org', slug: 'test-org', role: 'owner' },
        ],
        created_at: '2025-01-01T00:00:00Z',
      }

      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json(mockSession)
        })
      )

      const result = await authApi.getSession()

      expect(result.id).toBe(mockSession.id)
      expect(result.username).toBe(mockSession.username)
      expect(result.email).toBe(mockSession.email)
      expect(result.wallets).toHaveLength(1)
      expect(result.providers).toContain('google')
    })

    it('should handle unauthorized error', async () => {
      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        })
      )

      await expect(authApi.getSession()).rejects.toThrow()
    })

    it('should validate session with schema', async () => {
      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json({
            id: 'not-a-uuid', // Invalid UUID
            username: 'testuser',
            email: 'test@example.com',
            name: null,
            avatar: null,
            created_at: '2025-01-01T00:00:00Z',
          })
        })
      )

      await expect(authApi.getSession()).rejects.toThrow()
    })
  })

  describe('getOAuthUrl', () => {
    it('should generate correct Google OAuth URL', () => {
      const url = authApi.getOAuthUrl('google', '/dashboard')
      expect(url).toContain('/auth/google')
      expect(url).toContain('redirect_after=%2Fdashboard')
    })

    it('should generate correct GitHub OAuth URL', () => {
      const url = authApi.getOAuthUrl('github')
      expect(url).toContain('/auth/github')
      expect(url).not.toContain('redirect_after')
    })
  })

  describe('getLinkUrl', () => {
    it('should generate correct account linking URL', () => {
      const url = authApi.getLinkUrl('google', '/settings')
      expect(url).toContain('/auth/link/google')
      expect(url).toContain('redirect_after=%2Fsettings')
    })
  })
})
