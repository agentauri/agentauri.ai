import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { useHealthStatus } from '../use-health'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('use-health hooks', () => {
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
  })

  describe('useHealthStatus', () => {
    it('should fetch health status successfully when healthy', async () => {
      const mockHealthy = {
        status: 'healthy',
        timestamp: '2025-01-01T00:00:00Z',
        services: {
          database: 'connected',
          indexer: 'up',
          cache: 'up',
        },
      }

      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json(mockHealthy)
        })
      )

      const { result } = renderHook(() => useHealthStatus(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.status).toBe('healthy')
      expect(result.current.data?.services?.database).toBe('connected')
    })

    it('should fetch health status successfully when degraded', async () => {
      const mockDegraded = {
        status: 'degraded',
        timestamp: '2025-01-01T00:00:00Z',
        services: {
          database: 'connected',
          indexer: 'down',
          cache: 'up',
        },
      }

      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json(mockDegraded)
        })
      )

      const { result } = renderHook(() => useHealthStatus(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.status).toBe('degraded')
      expect(result.current.data?.services?.indexer).toBe('down')
    })

    it('should handle unhealthy status', async () => {
      const mockUnhealthy = {
        status: 'unhealthy',
        timestamp: '2025-01-01T00:00:00Z',
        services: {
          database: 'disconnected',
          indexer: 'down',
          cache: 'down',
        },
      }

      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json(mockUnhealthy)
        })
      )

      const { result } = renderHook(() => useHealthStatus(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.status).toBe('unhealthy')
    })

    it('should handle API error gracefully', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json({ error: 'Service unavailable' }, { status: 503 })
        })
      )

      const { result } = renderHook(() => useHealthStatus(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('should handle network error gracefully', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.error()
        })
      )

      const { result } = renderHook(() => useHealthStatus(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
