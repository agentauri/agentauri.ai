import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { useEvents, useEvent, useAgentEvents } from '../use-events'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('use-events hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const mockEvent = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    eventType: 'ReputationUpdated',
    agentId: 123,
    chainId: 1,
    registry: 'reputation',
    blockNumber: 12345678,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    data: {
      score: 95,
      previousScore: 90,
    },
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
  })

  afterEach(() => {
    queryClient.clear()
  })

  describe('useEvents', () => {
    it('should fetch events list successfully', async () => {
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

      const { result } = renderHook(() => useEvents(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].eventType).toBe('ReputationUpdated')
    })

    it('should pass filter params', async () => {
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

      const { result } = renderHook(
        () => useEvents({ chainId: 1, eventType: 'ReputationUpdated', limit: 10 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('eventType')).toBe('ReputationUpdated')
      expect(capturedUrl?.searchParams.get('limit')).toBe('10')
    })
  })

  describe('useEvent', () => {
    it('should fetch single event', async () => {
      server.use(
        http.get(`${baseUrl}/events/${mockEvent.id}`, () => {
          return HttpResponse.json(mockEvent)
        })
      )

      const { result } = renderHook(() => useEvent(mockEvent.id), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.eventType).toBe('ReputationUpdated')
      expect(result.current.data?.agentId).toBe(123)
    })

    it('should not fetch when eventId is null', () => {
      const { result } = renderHook(() => useEvent(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useAgentEvents', () => {
    it('should fetch events for specific agent', async () => {
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
        http.get(`${baseUrl}/agents/123/events`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useAgentEvents(123, 1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
    })

    it('should not fetch when agentId is null', () => {
      const { result } = renderHook(() => useAgentEvents(null, 1), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })
})
