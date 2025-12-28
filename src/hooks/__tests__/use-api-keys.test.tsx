import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import {
  useApiKeys,
  useApiKey,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
  useRegenerateApiKey,
} from '../use-api-keys'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('use-api-keys hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'

  // Match apiKeySchema
  const mockApiKey = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    organizationId: mockOrgId,
    name: 'Production API Key',
    keyPrefix: '8004_prod123',
    tier: 'basic' as const,
    enabled: true,
    expiresAt: null,
    lastUsedAt: '2025-01-01T00:00:00Z',
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
    vi.restoreAllMocks()
  })

  describe('useApiKeys', () => {
    it('should fetch API keys list successfully', async () => {
      const mockResponse = {
        data: [mockApiKey],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/api-keys`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useApiKeys(mockOrgId), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].name).toBe('Production API Key')
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useApiKeys(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useApiKey', () => {
    it('should fetch single API key', async () => {
      server.use(
        http.get(`${baseUrl}/api-keys/${mockApiKey.id}`, () => {
          return HttpResponse.json(mockApiKey)
        })
      )

      const { result } = renderHook(() => useApiKey(mockApiKey.id), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.name).toBe('Production API Key')
    })

    it('should not fetch when keyId is null', () => {
      const { result } = renderHook(() => useApiKey(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCreateApiKey', () => {
    it('should create API key successfully', async () => {
      // Match createApiKeyResponseSchema
      const createdKey = {
        apiKey: mockApiKey,
        key: '8004_prod123.secretkey456',
      }

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/api-keys`, async () => {
          return HttpResponse.json(createdKey)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateApiKey(mockOrgId), {
        wrapper: createWrapper(),
      })

      // Match createApiKeyRequestSchema
      result.current.mutate({
        name: 'New API Key',
        tier: 'basic',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.key).toBe('8004_prod123.secretkey456')
    })

    it('should handle create error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/api-keys`, () => {
          return HttpResponse.json({ message: 'Limit exceeded' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateApiKey(mockOrgId), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        name: 'New API Key',
        tier: 'basic',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useUpdateApiKey', () => {
    it('should update API key successfully', async () => {
      const updatedKey = { ...mockApiKey, name: 'Updated Key Name' }

      server.use(
        http.patch(`${baseUrl}/api-keys/${mockApiKey.id}`, async () => {
          return HttpResponse.json(updatedKey)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useUpdateApiKey(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        keyId: mockApiKey.id,
        request: { name: 'Updated Key Name' },
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.name).toBe('Updated Key Name')
    })
  })

  describe('useDeleteApiKey', () => {
    it('should delete API key successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/api-keys/${mockApiKey.id}`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useDeleteApiKey(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockApiKey.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useRegenerateApiKey', () => {
    it('should regenerate API key successfully', async () => {
      // Match createApiKeyResponseSchema (same format)
      const regeneratedKey = {
        apiKey: mockApiKey,
        key: '8004_prod123.newkey789',
      }

      server.use(
        http.post(`${baseUrl}/api-keys/${mockApiKey.id}/regenerate`, () => {
          return HttpResponse.json(regeneratedKey)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useRegenerateApiKey(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockApiKey.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })
})
