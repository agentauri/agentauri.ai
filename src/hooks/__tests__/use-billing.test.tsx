import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import {
  useCreditBalance,
  useCreditTransactions,
  useCreateCheckout,
  useSubscriptions,
  useCancelSubscription,
} from '../use-billing'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock window.location
const mockLocation = { href: '' }
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('use-billing hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'

  const mockBalance = {
    balance: 1000,
    currency: 'USD',
    updatedAt: '2025-01-01T00:00:00Z',
  }

  const mockTransaction = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    organizationId: mockOrgId,
    type: 'credit',
    amount: 100,
    description: 'Monthly credit allocation',
    createdAt: '2025-01-01T00:00:00Z',
  }

  const mockSubscription = {
    id: 'sub_123',
    organizationId: mockOrgId,
    plan: 'pro',
    status: 'active',
    currentPeriodEnd: '2025-02-01T00:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
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
    mockLocation.href = ''
  })

  afterEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  describe('useCreditBalance', () => {
    it('should fetch credit balance successfully', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/credits/balance`, () => {
          return HttpResponse.json(mockBalance)
        })
      )

      const { result } = renderHook(() => useCreditBalance(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.balance).toBe(1000)
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useCreditBalance(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCreditTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockResponse = {
        data: [mockTransaction],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/credits/transactions`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useCreditTransactions(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].amount).toBe(100)
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useCreditTransactions(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCreateCheckout', () => {
    it('should create checkout and redirect', async () => {
      const checkoutUrl = 'https://checkout.stripe.com/test'

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, async () => {
          return HttpResponse.json({ checkoutUrl })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateCheckout(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        amount: 100,
        currency: 'USD',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockLocation.href).toBe(checkoutUrl)
    })

    it('should handle checkout error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, () => {
          return HttpResponse.json({ message: 'Payment failed' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateCheckout(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        amount: 100,
        currency: 'USD',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useSubscriptions', () => {
    it('should fetch subscriptions successfully', async () => {
      const mockResponse = {
        data: [mockSubscription],
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/subscriptions`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useSubscriptions(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].plan).toBe('pro')
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useSubscriptions(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/subscriptions/${mockSubscription.id}`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCancelSubscription(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockSubscription.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })
})
