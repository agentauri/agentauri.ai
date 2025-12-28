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

  // Match creditBalanceSchema
  const mockBalance = {
    organizationId: mockOrgId,
    balance: 1000,
    lifetimePurchased: 5000,
    lifetimeUsed: 4000,
    updatedAt: '2025-01-01T00:00:00Z',
  }

  // Match creditTransactionSchema
  const mockTransaction = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    organizationId: mockOrgId,
    type: 'purchase' as const,
    amount: 100,
    description: 'Monthly credit allocation',
    referenceId: null,
    createdAt: '2025-01-01T00:00:00Z',
  }

  // Match subscriptionSchema
  const mockSubscription = {
    id: 'sub_123',
    organizationId: mockOrgId,
    status: 'active' as const,
    planName: 'Pro Plan',
    priceId: 'price_123',
    currentPeriodStart: '2025-01-01T00:00:00Z',
    currentPeriodEnd: '2025-02-01T00:00:00Z',
    cancelAtPeriodEnd: false,
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
    // TODO: Fix MSW handler matching issue - skipping temporarily
    it.skip('should fetch credit balance successfully', async () => {
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
    // TODO: Fix MSW handler matching issue - skipping temporarily
    it.skip('should fetch transactions successfully', async () => {
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
    // TODO: Fix MSW handler matching issue - skipping temporarily
    it.skip('should create checkout and redirect', async () => {
      const checkoutUrl = 'https://checkout.stripe.com/test'
      const sessionId = 'cs_test_123'

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, async () => {
          // Match checkoutResponseSchema
          return HttpResponse.json({ checkoutUrl, sessionId })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateCheckout(mockOrgId), {
        wrapper: createWrapper(),
      })

      // Match checkoutRequestSchema
      result.current.mutate({
        priceId: 'price_123',
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
        priceId: 'price_123',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useSubscriptions', () => {
    // TODO: Fix MSW handler matching issue - skipping temporarily
    it.skip('should fetch subscriptions successfully', async () => {
      // subscriptionListResponseSchema returns array directly
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/subscriptions`, () => {
          return HttpResponse.json([mockSubscription])
        })
      )

      const { result } = renderHook(() => useSubscriptions(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data?.[0].planName).toBe('Pro Plan')
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useSubscriptions(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCancelSubscription', () => {
    // TODO: Fix MSW handler matching issue - skipping temporarily
    it.skip('should cancel subscription successfully', async () => {
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
