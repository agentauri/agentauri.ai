import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { billingApi } from '../billing'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('billingApi', () => {
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
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('getBalance', () => {
    it('should get credit balance successfully', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/credits/balance`, () => {
          return HttpResponse.json(mockBalance)
        })
      )

      const result = await billingApi.getBalance(mockOrgId)

      expect(result.balance).toBe(1000)
      expect(result.organizationId).toBe(mockOrgId)
    })

    it('should handle error', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/credits/balance`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        })
      )

      await expect(billingApi.getBalance(mockOrgId)).rejects.toThrow()
    })
  })

  describe('listTransactions', () => {
    it('should list transactions successfully', async () => {
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

      const result = await billingApi.listTransactions(mockOrgId)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].amount).toBe(100)
    })

    it('should pass pagination parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/credits/transactions`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 50, offset: 10, has_more: false },
          })
        })
      )

      await billingApi.listTransactions(mockOrgId, { limit: 50, offset: 10 })

      expect(capturedUrl?.searchParams.get('limit')).toBe('50')
      expect(capturedUrl?.searchParams.get('offset')).toBe('10')
    })
  })

  describe('createCheckout', () => {
    it('should create checkout session successfully', async () => {
      const checkoutUrl = 'https://checkout.stripe.com/test'
      const sessionId = 'cs_test_123'

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject({ priceId: 'price_123' })
          return HttpResponse.json({ checkoutUrl, sessionId })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await billingApi.createCheckout(mockOrgId, { priceId: 'price_123' })

      expect(result.checkoutUrl).toBe(checkoutUrl)
      expect(result.sessionId).toBe(sessionId)
    })

    it('should handle checkout error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, () => {
          return HttpResponse.json({ message: 'Invalid price ID' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(billingApi.createCheckout(mockOrgId, { priceId: 'invalid' })).rejects.toThrow()
    })
  })

  describe('listSubscriptions', () => {
    it('should list subscriptions successfully', async () => {
      // subscriptionListResponseSchema expects an array directly
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/subscriptions`, () => {
          return HttpResponse.json([mockSubscription])
        })
      )

      const result = await billingApi.listSubscriptions(mockOrgId)

      expect(result).toHaveLength(1)
      expect(result[0].planName).toBe('Pro Plan')
    })

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/subscriptions`, () => {
          return HttpResponse.json([])
        })
      )

      const result = await billingApi.listSubscriptions(mockOrgId)

      expect(result).toHaveLength(0)
    })
  })

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/subscriptions/${mockSubscription.id}`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(billingApi.cancelSubscription(mockSubscription.id)).resolves.toBeUndefined()
    })

    it('should handle cancel error', async () => {
      server.use(
        http.delete(`${baseUrl}/subscriptions/${mockSubscription.id}`, () => {
          return HttpResponse.json({ message: 'Cannot cancel' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(billingApi.cancelSubscription(mockSubscription.id)).rejects.toThrow()
    })
  })
})
