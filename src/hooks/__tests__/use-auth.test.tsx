import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { useAuth, useLogin, useLogout, useNonce, useSession } from '../use-auth'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

// Mock stores
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    isHydrated: true,
    setAuthenticated: vi.fn(),
    setLoading: vi.fn(),
    logout: vi.fn(),
  })),
}))

vi.mock('@/stores/organization-store', () => ({
  useOrganizationStore: vi.fn(() => ({
    reset: vi.fn(),
  })),
}))

describe('use-auth hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
  })

  afterEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  describe('useSession', () => {
    const mockSession = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'testuser',
      email: 'test@example.com',
      currentOrganizationId: null,
      walletAddresses: ['0x1234567890123456789012345678901234567890'],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    }

    it('should fetch session successfully', async () => {
      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json(mockSession)
        })
      )

      const { result } = renderHook(() => useSession(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockSession)
    })

    it('should handle unauthorized error', async () => {
      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        })
      )

      const { result } = renderHook(() => useSession(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useNonce', () => {
    const mockNonceResponse = {
      nonce: 'abc12345678901234567890',
      expiresAt: '2025-01-01T00:05:00Z',
    }

    it('should fetch nonce when address is provided', async () => {
      const address = '0x1234567890123456789012345678901234567890'

      server.use(
        http.post(`${baseUrl}/auth/nonce`, async ({ request }) => {
          const body = await request.json() as { address: string }
          expect(body.address).toBe(address)
          return HttpResponse.json(mockNonceResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useNonce(address), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockNonceResponse)
    })

    it('should not fetch nonce when address is undefined', () => {
      const { result } = renderHook(() => useNonce(undefined), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useLogin', () => {
    const mockLoginResponse = {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
      },
      expiresAt: '2025-01-01T01:00:00Z',
    }

    it('should login successfully', async () => {
      server.use(
        http.post(`${baseUrl}/auth/login`, async () => {
          return HttpResponse.json(mockLoginResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        message: 'Sign in message',
        signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
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

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        message: 'Sign in message',
        signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useLogout', () => {
    it('should logout successfully', async () => {
      server.use(
        http.post(`${baseUrl}/auth/logout`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should clear state even on error', async () => {
      server.use(
        http.post(`${baseUrl}/auth/logout`, () => {
          return HttpResponse.json({ message: 'Error' }, { status: 500 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      })

      result.current.mutate()

      await waitFor(() => {
        // Even on error, logout should complete (error handler clears state)
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useAuth', () => {
    it('should return combined auth state', async () => {
      const mockSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        currentOrganizationId: null,
        walletAddresses: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }

      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json(mockSession)
        })
      )

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.session).toBeDefined()
      })

      expect(result.current.session).toEqual(mockSession)
      expect(result.current.login).toBeDefined()
      expect(result.current.logout).toBeDefined()
    })

    it('should expose login and logout mutations', () => {
      server.use(
        http.get(`${baseUrl}/auth/me`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        })
      )

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      expect(result.current.login).toBeDefined()
      expect(result.current.logout).toBeDefined()
      expect(typeof result.current.login.mutate).toBe('function')
      expect(typeof result.current.logout.mutate).toBe('function')
    })
  })
})
