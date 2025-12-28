import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { useAuth, useLogin, useLogout, useSession } from '../use-auth'

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
      name: 'Test User',
      avatar: null,
      wallets: [
        { address: '0x1234567890123456789012345678901234567890', chain_id: 1 },
      ],
      providers: ['google'],
      organizations: [],
      created_at: '2025-01-01T00:00:00Z',
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

      expect(result.current.data?.id).toBe(mockSession.id)
      expect(result.current.data?.wallets).toHaveLength(1)
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

  describe('useLogin', () => {
    // Match walletLoginResponseSchema
    const mockLoginResponse = {
      token: 'jwt-token-here',
      refresh_token: 'refresh-token-here',
      expires_in: 3600,
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        name: null,
        avatar: null,
        created_at: '2025-01-01T00:00:00Z',
      },
    }

    it('should login successfully', async () => {
      server.use(
        http.post(`${baseUrl}/auth/wallet`, async () => {
          return HttpResponse.json(mockLoginResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        }),
        // Mock the local Next.js API route for storing tokens
        http.post('/api/auth/set-tokens', () => {
          return HttpResponse.json({ success: true })
        })
      )

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        address: '0x1234567890123456789012345678901234567890',
        message: 'Sign in message',
        signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
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

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        address: '0x1234567890123456789012345678901234567890',
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
        }),
        // Mock the local Next.js API route for clearing cookies
        http.post('/api/auth/logout', () => {
          return HttpResponse.json({ success: true })
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
        }),
        // Mock the local Next.js API route for clearing cookies
        http.post('/api/auth/logout', () => {
          return HttpResponse.json({ success: true })
        })
      )

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      })

      result.current.mutate()

      await waitFor(() => {
        // Logout still succeeds because the hook catches backend errors
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useAuth', () => {
    it('should return combined auth state', async () => {
      const mockSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        name: null,
        avatar: null,
        wallets: [],
        providers: [],
        organizations: [],
        created_at: '2025-01-01T00:00:00Z',
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

      expect(result.current.session?.id).toBe(mockSession.id)
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
