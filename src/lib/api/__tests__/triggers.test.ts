import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { triggersApi } from '../triggers'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('triggersApi', () => {
  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'
  const mockTriggerId = '550e8400-e29b-41d4-a716-446655440001'

  const mockTrigger = {
    id: mockTriggerId,
    userId: '550e8400-e29b-41d4-a716-446655440002',
    organizationId: mockOrgId,
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

  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('list', () => {
    it('should list triggers for organization', async () => {
      const mockResponse = {
        data: [mockTrigger],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/triggers`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await triggersApi.list(mockOrgId)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(mockTriggerId)
      expect(result.pagination.total).toBe(1)
    })

    it('should pass filter parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/triggers`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, has_more: false },
          })
        })
      )

      await triggersApi.list(mockOrgId, {
        chainId: 1,
        enabled: true,
        search: 'test',
        limit: 50,
        offset: 10,
      })

      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('enabled')).toBe('true')
      expect(capturedUrl?.searchParams.get('search')).toBe('test')
      expect(capturedUrl?.searchParams.get('limit')).toBe('50')
      expect(capturedUrl?.searchParams.get('offset')).toBe('10')
    })

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/triggers`, () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, has_more: false },
          })
        })
      )

      const result = await triggersApi.list(mockOrgId)

      expect(result.data).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })
  })

  describe('get', () => {
    it('should get trigger by id', async () => {
      server.use(
        http.get(`${baseUrl}/triggers/${mockTriggerId}`, () => {
          return HttpResponse.json(mockTrigger)
        })
      )

      const result = await triggersApi.get(mockTriggerId)

      expect(result.id).toBe(mockTriggerId)
      expect(result.name).toBe('Test Trigger')
    })

    it('should handle not found error', async () => {
      server.use(
        http.get(`${baseUrl}/triggers/${mockTriggerId}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        })
      )

      await expect(triggersApi.get(mockTriggerId)).rejects.toThrow()
    })
  })

  describe('create', () => {
    const createRequest = {
      name: 'New Trigger',
      chainId: 1,
      registry: 'identity' as const,
      conditions: [
        {
          conditionType: 'event_filter',
          field: 'eventType',
          operator: 'eq' as const,
          value: 'transfer',
        },
      ],
      actions: [
        {
          actionType: 'telegram' as const,
          config: { chatId: '123' },
        },
      ],
    }

    it('should create trigger successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/triggers`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(createRequest)
          return HttpResponse.json({ ...mockTrigger, name: 'New Trigger' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.create(mockOrgId, createRequest)

      expect(result.name).toBe('New Trigger')
    })

    it('should handle validation error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/triggers`, () => {
          return HttpResponse.json({ message: 'Validation failed' }, { status: 422 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(triggersApi.create(mockOrgId, createRequest)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update trigger successfully', async () => {
      const updateRequest = { name: 'Updated Name' }

      server.use(
        http.patch(`${baseUrl}/triggers/${mockTriggerId}`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(updateRequest)
          return HttpResponse.json({ ...mockTrigger, name: 'Updated Name' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.update(mockTriggerId, updateRequest)

      expect(result.name).toBe('Updated Name')
    })

    it('should handle partial update', async () => {
      server.use(
        http.patch(`${baseUrl}/triggers/${mockTriggerId}`, () => {
          return HttpResponse.json({ ...mockTrigger, enabled: false })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.update(mockTriggerId, { enabled: false })

      expect(result.enabled).toBe(false)
    })
  })

  describe('delete', () => {
    it('should delete trigger successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/triggers/${mockTriggerId}`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(triggersApi.delete(mockTriggerId)).resolves.toBeUndefined()
    })

    it('should handle delete error', async () => {
      server.use(
        http.delete(`${baseUrl}/triggers/${mockTriggerId}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(triggersApi.delete(mockTriggerId)).rejects.toThrow()
    })
  })

  describe('enable', () => {
    it('should enable trigger successfully', async () => {
      server.use(
        http.post(`${baseUrl}/triggers/${mockTriggerId}/enable`, () => {
          return HttpResponse.json({ ...mockTrigger, enabled: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.enable(mockTriggerId)

      expect(result.enabled).toBe(true)
    })
  })

  describe('disable', () => {
    it('should disable trigger successfully', async () => {
      server.use(
        http.post(`${baseUrl}/triggers/${mockTriggerId}/disable`, () => {
          return HttpResponse.json({ ...mockTrigger, enabled: false })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.disable(mockTriggerId)

      expect(result.enabled).toBe(false)
    })
  })

  describe('test', () => {
    it('should test trigger successfully', async () => {
      server.use(
        http.post(`${baseUrl}/triggers/${mockTriggerId}/test`, () => {
          return HttpResponse.json({ success: true, result: 'Trigger would fire' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.test(mockTriggerId)

      expect(result.success).toBe(true)
      expect(result.result).toBe('Trigger would fire')
    })

    it('should return failure result', async () => {
      server.use(
        http.post(`${baseUrl}/triggers/${mockTriggerId}/test`, () => {
          return HttpResponse.json({ success: false, error: 'Condition not met' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await triggersApi.test(mockTriggerId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Condition not met')
    })
  })
})
