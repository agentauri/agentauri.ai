import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { billingApi } from '../billing'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('billingApi', () => {
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
      expect(result.currency).toBe('USD')
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
          hasMore: false,
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
            pagination: { total: 0, limit: 50, offset: 10, hasMore: false },
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

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject({ amount: 100 })
          return HttpResponse.json({ checkoutUrl })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await billingApi.createCheckout(mockOrgId, { amount: 100 })

      expect(result.checkoutUrl).toBe(checkoutUrl)
    })

    it('should handle checkout error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/checkout`, () => {
          return HttpResponse.json({ message: 'Invalid amount' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(billingApi.createCheckout(mockOrgId, { amount: -100 })).rejects.toThrow()
    })
  })

  describe('listSubscriptions', () => {
    it('should list subscriptions successfully', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/subscriptions`, () => {
          return HttpResponse.json({ data: [mockSubscription] })
        })
      )

      const result = await billingApi.listSubscriptions(mockOrgId)

      expect(result).toHaveLength(1)
      expect(result[0].plan).toBe('pro')
    })

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/subscriptions`, () => {
          return HttpResponse.json({ data: [] })
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
