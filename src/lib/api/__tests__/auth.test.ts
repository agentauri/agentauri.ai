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
    const validAddress = '0x1234567890123456789012345678901234567890'

    it('should fetch nonce for address', async () => {
      const mockResponse = {
        nonce: 'abc12345678901234567890',
        expiresAt: '2025-01-01T00:05:00Z',
      }

      server.use(
        http.post(`${baseUrl}/auth/nonce`, async ({ request }) => {
          const body = await request.json() as { address: string }
          expect(body.address).toBe(validAddress)
          return HttpResponse.json(mockResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await authApi.getNonce(validAddress)

      expect(result.nonce).toBe(mockResponse.nonce)
      expect(result.expiresAt).toBe(mockResponse.expiresAt)
    })

    it('should validate response with schema', async () => {
      server.use(
        http.post(`${baseUrl}/auth/nonce`, () => {
          return HttpResponse.json({
            nonce: 'short', // Too short, should fail validation
            expiresAt: '2025-01-01T00:05:00Z',
          })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(authApi.getNonce(validAddress)).rejects.toThrow()
    })
  })

  describe('login', () => {
    const validRequest = {
      message: 'Sign in with Ethereum to Example App',
      signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    }

    it('should login successfully', async () => {
      const mockResponse = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          email: 'test@example.com',
          walletAddresses: ['0x1234567890123456789012345678901234567890'],
        },
        expiresAt: '2025-01-01T01:00:00Z',
      }

      server.use(
        http.post(`${baseUrl}/auth/login`, async ({ request }) => {
          const body = await request.json() as { message: string; signature: string }
          expect(body.message).toBe(validRequest.message)
          expect(body.signature).toBe(validRequest.signature)
          return HttpResponse.json(mockResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await authApi.login(validRequest)

      expect(result.user.id).toBe(mockResponse.user.id)
      expect(result.expiresAt).toBe(mockResponse.expiresAt)
    })

    it('should handle login error', async () => {
      server.use(
        http.post(`${baseUrl}/auth/login`, () => {
          return HttpResponse.json({ message: 'Invalid signature' }, { status: 401 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(authApi.login(validRequest)).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      server.use(
        http.post(`${baseUrl}/auth/logout`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      // Should not throw
      await expect(authApi.logout()).resolves.toBeUndefined()
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
        currentOrganizationId: '550e8400-e29b-41d4-a716-446655440001',
        walletAddresses: ['0x1234567890123456789012345678901234567890'],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
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
      expect(result.walletAddresses).toHaveLength(1)
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
            currentOrganizationId: null,
            walletAddresses: [],
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          })
        })
      )

      await expect(authApi.getSession()).rejects.toThrow()
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        expiresAt: '2025-01-01T02:00:00Z',
      }

      server.use(
        http.post(`${baseUrl}/auth/refresh`, () => {
          return HttpResponse.json(mockResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await authApi.refreshToken()

      expect(result.expiresAt).toBe(mockResponse.expiresAt)
    })

    it('should handle refresh error', async () => {
      server.use(
        http.post(`${baseUrl}/auth/refresh`, () => {
          return HttpResponse.json({ message: 'Token expired' }, { status: 401 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(authApi.refreshToken()).rejects.toThrow()
    })
  })
})
