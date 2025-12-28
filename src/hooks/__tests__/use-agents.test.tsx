import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { useAgents, useAgent, useLinkAgent, useUnlinkAgent } from '../use-agents'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('use-agents hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'

  const mockAgent = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    organizationId: mockOrgId,
    agentId: 123,
    agentAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    registry: 'reputation',
    alias: 'Test Agent',
    linkedAt: '2025-01-01T00:00:00Z',
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

  describe('useAgents', () => {
    it('should fetch agents list successfully', async () => {
      const mockResponse = {
        data: [mockAgent],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useAgents(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].agentId).toBe(123)
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useAgents(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })

    it('should pass filter params', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, has_more: false },
          })
        })
      )

      const { result } = renderHook(
        () => useAgents(mockOrgId, { chainId: 1, registry: 'reputation' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('registry')).toBe('reputation')
    })
  })

  describe('useAgent', () => {
    it('should fetch single agent', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents/${mockAgent.agentAddress}`, () => {
          return HttpResponse.json(mockAgent)
        })
      )

      const { result } = renderHook(() => useAgent(mockOrgId, mockAgent.agentAddress), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.agentId).toBe(123)
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useAgent(null, mockAgent.agentAddress), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })

    it('should not fetch when agentAddress is null', () => {
      const { result } = renderHook(() => useAgent(mockOrgId, null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useLinkAgent', () => {
    it('should link agent successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/agents`, async () => {
          return HttpResponse.json(mockAgent)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useLinkAgent(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        agentAddress: mockAgent.agentAddress,
        chainId: 1,
        registry: 'reputation',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should handle link error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/agents`, () => {
          return HttpResponse.json({ message: 'Agent already linked' }, { status: 409 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useLinkAgent(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        agentAddress: mockAgent.agentAddress,
        chainId: 1,
        registry: 'reputation',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useUnlinkAgent', () => {
    it('should unlink agent successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}/agents/${mockAgent.agentAddress}`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useUnlinkAgent(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockAgent.agentAddress)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })
})
