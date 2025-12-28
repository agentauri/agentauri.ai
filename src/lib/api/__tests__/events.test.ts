import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { eventsApi } from '../events'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('eventsApi', () => {
  // Match blockchainEventSchema
  const mockEvent = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    eventType: 'ReputationUpdated',
    agentId: 123,
    chainId: 1,
    registry: 'reputation' as const,
    blockNumber: 12345678,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    data: {
      score: 95,
      previousScore: 90,
    },
    timestamp: '2025-01-01T00:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
  }

  describe('list', () => {
    it('should list events successfully', async () => {
      const mockResponse = {
        data: [mockEvent],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/events`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await eventsApi.list()

      expect(result.data).toHaveLength(1)
      expect(result.data[0].eventType).toBe('ReputationUpdated')
    })

    it('should pass filter parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/events`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, has_more: false },
          })
        })
      )

      await eventsApi.list({ chainId: 1, eventType: 'ReputationUpdated', limit: 50 })

      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('eventType')).toBe('ReputationUpdated')
      expect(capturedUrl?.searchParams.get('limit')).toBe('50')
    })
  })

  describe('get', () => {
    it('should get event by id', async () => {
      server.use(
        http.get(`${baseUrl}/events/${mockEvent.id}`, () => {
          return HttpResponse.json(mockEvent)
        })
      )

      const result = await eventsApi.get(mockEvent.id)

      expect(result.id).toBe(mockEvent.id)
      expect(result.eventType).toBe('ReputationUpdated')
    })

    it('should handle not found error', async () => {
      server.use(
        http.get(`${baseUrl}/events/${mockEvent.id}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        })
      )

      await expect(eventsApi.get(mockEvent.id)).rejects.toThrow()
    })
  })

  describe('listByAgent', () => {
    it('should list events for agent', async () => {
      const mockResponse = {
        data: [mockEvent],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/events`, ({ request }) => {
          const url = new URL(request.url)
          if (url.searchParams.get('agentId') === '123') {
            return HttpResponse.json(mockResponse)
          }
          return HttpResponse.json({ data: [], pagination: { total: 0, has_more: false } })
        })
      )

      const result = await eventsApi.listByAgent(123, 1)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].agentId).toBe(123)
    })

    it('should pass chainId filter', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/events`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, has_more: false },
          })
        })
      )

      await eventsApi.listByAgent(123, 1, { limit: 10 })

      expect(capturedUrl?.searchParams.get('agentId')).toBe('123')
      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('limit')).toBe('10')
    })
  })
})
