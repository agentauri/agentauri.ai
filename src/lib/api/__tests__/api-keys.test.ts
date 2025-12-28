import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { apiKeysApi } from '../api-keys'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('apiKeysApi', () => {
  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'
  const mockKeyId = '550e8400-e29b-41d4-a716-446655440001'

  const mockApiKey = {
    id: mockKeyId,
    organizationId: mockOrgId,
    name: 'Test API Key',
    keyPrefix: '8004_abc123',
    tier: 'basic' as const,
    enabled: true,
    lastUsedAt: null,
    expiresAt: null,
    createdAt: '2025-01-01T00:00:00Z',
  }

  const mockCreateResponse = {
    apiKey: mockApiKey,
    key: '8004_abc123.secretpart456',
  }

  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('list', () => {
    it('should list API keys for organization', async () => {
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

      const result = await apiKeysApi.list(mockOrgId)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(mockKeyId)
      expect(result.data[0].name).toBe('Test API Key')
    })

    it('should pass pagination parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/api-keys`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 50, offset: 10, has_more: false },
          })
        })
      )

      await apiKeysApi.list(mockOrgId, { limit: 50, offset: 10 })

      expect(capturedUrl?.searchParams.get('limit')).toBe('50')
      expect(capturedUrl?.searchParams.get('offset')).toBe('10')
    })

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/api-keys`, () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, has_more: false },
          })
        })
      )

      const result = await apiKeysApi.list(mockOrgId)

      expect(result.data).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })
  })

  describe('get', () => {
    it('should get API key by id', async () => {
      server.use(
        http.get(`${baseUrl}/api-keys/${mockKeyId}`, () => {
          return HttpResponse.json(mockApiKey)
        })
      )

      const result = await apiKeysApi.get(mockKeyId)

      expect(result.id).toBe(mockKeyId)
      expect(result.name).toBe('Test API Key')
      expect(result.keyPrefix).toBe('8004_abc123')
    })

    it('should handle not found error', async () => {
      server.use(
        http.get(`${baseUrl}/api-keys/${mockKeyId}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        })
      )

      await expect(apiKeysApi.get(mockKeyId)).rejects.toThrow()
    })
  })

  describe('create', () => {
    const createRequest = {
      name: 'New API Key',
      tier: 'basic' as const,
    }

    it('should create API key successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/api-keys`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(createRequest)
          return HttpResponse.json(mockCreateResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await apiKeysApi.create(mockOrgId, createRequest)

      expect(result.apiKey.name).toBe('Test API Key')
      expect(result.key).toBe('8004_abc123.secretpart456')
    })

    it('should create API key with expiration', async () => {
      const requestWithExpiry = {
        ...createRequest,
        expiresAt: '2026-01-01T00:00:00Z',
      }

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/api-keys`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(requestWithExpiry)
          return HttpResponse.json({
            apiKey: { ...mockApiKey, expiresAt: '2026-01-01T00:00:00Z' },
            key: '8004_abc123.secretpart456',
          })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await apiKeysApi.create(mockOrgId, requestWithExpiry)

      expect(result.apiKey.expiresAt).toBe('2026-01-01T00:00:00Z')
    })

    it('should handle validation error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/api-keys`, () => {
          return HttpResponse.json({ message: 'Invalid tier' }, { status: 422 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.create(mockOrgId, createRequest)).rejects.toThrow()
    })

    it('should handle quota exceeded error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/api-keys`, () => {
          return HttpResponse.json({ message: 'API key limit reached' }, { status: 429 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.create(mockOrgId, createRequest)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update API key successfully', async () => {
      const updateRequest = { name: 'Updated Key Name' }

      server.use(
        http.patch(`${baseUrl}/api-keys/${mockKeyId}`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(updateRequest)
          return HttpResponse.json({ ...mockApiKey, name: 'Updated Key Name' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await apiKeysApi.update(mockKeyId, updateRequest)

      expect(result.name).toBe('Updated Key Name')
    })

    it('should update API key tier', async () => {
      const updateRequest = { tier: 'advanced' as const }

      server.use(
        http.patch(`${baseUrl}/api-keys/${mockKeyId}`, () => {
          return HttpResponse.json({
            ...mockApiKey,
            tier: 'advanced',
          })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await apiKeysApi.update(mockKeyId, updateRequest)

      expect(result.tier).toBe('advanced')
    })

    it('should handle not found error', async () => {
      server.use(
        http.patch(`${baseUrl}/api-keys/${mockKeyId}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.update(mockKeyId, { name: 'New Name' })).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete API key successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/api-keys/${mockKeyId}`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.delete(mockKeyId)).resolves.toBeUndefined()
    })

    it('should handle delete error', async () => {
      server.use(
        http.delete(`${baseUrl}/api-keys/${mockKeyId}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.delete(mockKeyId)).rejects.toThrow()
    })
  })

  describe('regenerate', () => {
    it('should regenerate API key successfully', async () => {
      const regeneratedResponse = {
        apiKey: {
          ...mockApiKey,
          keyPrefix: '8004_newkey789',
        },
        key: '8004_newkey789.newsecret123',
      }

      server.use(
        http.post(`${baseUrl}/api-keys/${mockKeyId}/regenerate`, () => {
          return HttpResponse.json(regeneratedResponse)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await apiKeysApi.regenerate(mockKeyId)

      expect(result.key).toBe('8004_newkey789.newsecret123')
      expect(result.apiKey.keyPrefix).toBe('8004_newkey789')
    })

    it('should handle not found error', async () => {
      server.use(
        http.post(`${baseUrl}/api-keys/${mockKeyId}/regenerate`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.regenerate(mockKeyId)).rejects.toThrow()
    })

    it('should handle expired key error', async () => {
      server.use(
        http.post(`${baseUrl}/api-keys/${mockKeyId}/regenerate`, () => {
          return HttpResponse.json({ message: 'Cannot regenerate expired key' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(apiKeysApi.regenerate(mockKeyId)).rejects.toThrow()
    })
  })
})
