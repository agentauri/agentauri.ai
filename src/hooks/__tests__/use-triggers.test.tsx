import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import {
  useCreateTrigger,
  useDeleteTrigger,
  useDisableTrigger,
  useEnableTrigger,
  useTestTrigger,
  useToggleTrigger,
  useTrigger,
  useTriggers,
  useUpdateTrigger,
} from '../use-triggers'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('use-triggers hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const mockTrigger = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    organizationId: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Test Trigger',
    description: 'A test trigger',
    chainId: 1,
    registry: 'identity',
    enabled: true,
    isStateful: false,
    executionCount: 0,
    lastExecutedAt: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    conditions: [],
    actions: [],
  }

  const mockOrgId = '550e8400-e29b-41d4-a716-446655440002'

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

  describe('useTriggers', () => {
    it('should fetch triggers list successfully', async () => {
      const mockResponse = {
        data: [mockTrigger],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/triggers`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useTriggers(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useTriggers(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })

    it('should pass filter params', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/triggers`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
          })
        })
      )

      const { result } = renderHook(
        () => useTriggers(mockOrgId, { chainId: 1, enabled: true, search: 'test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('enabled')).toBe('true')
      expect(capturedUrl?.searchParams.get('search')).toBe('test')
    })
  })

  describe('useTrigger', () => {
    it('should fetch single trigger', async () => {
      server.use(
        http.get(`${baseUrl}/triggers/${mockTrigger.id}`, () => {
          return HttpResponse.json(mockTrigger)
        })
      )

      const { result } = renderHook(() => useTrigger(mockTrigger.id), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTrigger)
    })

    it('should not fetch when triggerId is null', () => {
      const { result } = renderHook(() => useTrigger(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCreateTrigger', () => {
    it('should create trigger successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/triggers`, async () => {
          return HttpResponse.json(mockTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateTrigger(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        name: 'New Trigger',
        chainId: 1,
        registry: 'identity',
        conditions: [
          {
            conditionType: 'event_filter',
            field: 'eventType',
            operator: 'eq',
            value: 'transfer',
          },
        ],
        actions: [
          {
            actionType: 'telegram',
            config: { chatId: '123' },
          },
        ],
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should handle create error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/triggers`, () => {
          return HttpResponse.json({ message: 'Validation error' }, { status: 422 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateTrigger(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        name: 'Invalid',
        chainId: 1,
        registry: 'identity',
        conditions: [],
        actions: [],
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useUpdateTrigger', () => {
    it('should update trigger successfully', async () => {
      const updatedTrigger = { ...mockTrigger, name: 'Updated Trigger' }

      server.use(
        http.patch(`${baseUrl}/triggers/${mockTrigger.id}`, async () => {
          return HttpResponse.json(updatedTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useUpdateTrigger(mockTrigger.id), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ name: 'Updated Trigger' })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.name).toBe('Updated Trigger')
    })
  })

  describe('useDeleteTrigger', () => {
    it('should delete trigger successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/triggers/${mockTrigger.id}`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useDeleteTrigger(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockTrigger.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useEnableTrigger', () => {
    it('should enable trigger successfully', async () => {
      const enabledTrigger = { ...mockTrigger, enabled: true }

      server.use(
        http.post(`${baseUrl}/triggers/${mockTrigger.id}/enable`, () => {
          return HttpResponse.json(enabledTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useEnableTrigger(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockTrigger.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.enabled).toBe(true)
    })
  })

  describe('useDisableTrigger', () => {
    it('should disable trigger successfully', async () => {
      const disabledTrigger = { ...mockTrigger, enabled: false }

      server.use(
        http.post(`${baseUrl}/triggers/${mockTrigger.id}/disable`, () => {
          return HttpResponse.json(disabledTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useDisableTrigger(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockTrigger.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.enabled).toBe(false)
    })
  })

  describe('useTestTrigger', () => {
    it('should test trigger successfully', async () => {
      server.use(
        http.post(`${baseUrl}/triggers/${mockTrigger.id}/test`, () => {
          return HttpResponse.json({ success: true, result: 'Trigger would fire' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useTestTrigger(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockTrigger.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.success).toBe(true)
    })

    it('should handle failed test', async () => {
      server.use(
        http.post(`${baseUrl}/triggers/${mockTrigger.id}/test`, () => {
          return HttpResponse.json({ success: false, error: 'Condition not met' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useTestTrigger(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockTrigger.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.success).toBe(false)
      expect(result.current.data?.error).toBe('Condition not met')
    })
  })

  describe('useToggleTrigger', () => {
    it('should disable enabled trigger', async () => {
      const disabledTrigger = { ...mockTrigger, enabled: false }

      server.use(
        http.post(`${baseUrl}/triggers/${mockTrigger.id}/disable`, () => {
          return HttpResponse.json(disabledTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useToggleTrigger(), {
        wrapper: createWrapper(),
      })

      // Trigger is enabled, so toggle should disable
      await result.current.toggle({ ...mockTrigger, enabled: true })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })
    })

    it('should enable disabled trigger', async () => {
      const enabledTrigger = { ...mockTrigger, enabled: true }

      server.use(
        http.post(`${baseUrl}/triggers/${mockTrigger.id}/enable`, () => {
          return HttpResponse.json(enabledTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useToggleTrigger(), {
        wrapper: createWrapper(),
      })

      // Trigger is disabled, so toggle should enable
      await result.current.toggle({ ...mockTrigger, enabled: false })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })
    })
  })
})
