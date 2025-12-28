import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { agentsApi } from '../agents'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('agentsApi', () => {
  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'
  const mockAgentAddress = '0x1234567890123456789012345678901234567890'

  const mockAgent = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    organizationId: mockOrgId,
    agentId: 123,
    agentAddress: mockAgentAddress,
    chainId: 1,
    registry: 'reputation' as const,
    alias: 'Test Agent',
    linkedAt: '2025-01-01T00:00:00Z',
  }

  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('list', () => {
    it('should list agents for organization', async () => {
      const mockResponse = {
        data: [mockAgent],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await agentsApi.list(mockOrgId)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].agentId).toBe(123)
    })

    it('should pass filter parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
          })
        })
      )

      await agentsApi.list(mockOrgId, { chainId: 1, registry: 'reputation' })

      expect(capturedUrl?.searchParams.get('chainId')).toBe('1')
      expect(capturedUrl?.searchParams.get('registry')).toBe('reputation')
    })
  })

  describe('get', () => {
    it('should get agent by address', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents/${mockAgentAddress}`, () => {
          return HttpResponse.json(mockAgent)
        })
      )

      const result = await agentsApi.get(mockOrgId, mockAgentAddress)

      expect(result.agentId).toBe(123)
      expect(result.agentAddress).toBe(mockAgentAddress)
    })

    it('should handle not found error', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/agents/${mockAgentAddress}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        })
      )

      await expect(agentsApi.get(mockOrgId, mockAgentAddress)).rejects.toThrow()
    })
  })

  describe('link', () => {
    it('should link agent successfully', async () => {
      const linkRequest = {
        agentAddress: mockAgentAddress,
        chainId: 1,
        registry: 'reputation' as const,
      }

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/agents`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(linkRequest)
          return HttpResponse.json(mockAgent)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await agentsApi.link(mockOrgId, linkRequest)

      expect(result.agentId).toBe(123)
    })

    it('should handle duplicate agent error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/agents`, () => {
          return HttpResponse.json({ message: 'Agent already linked' }, { status: 409 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(
        agentsApi.link(mockOrgId, {
          agentAddress: mockAgentAddress,
          chainId: 1,
          registry: 'reputation',
        })
      ).rejects.toThrow()
    })
  })

  describe('unlink', () => {
    it('should unlink agent successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}/agents/${mockAgentAddress}`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(agentsApi.unlink(mockOrgId, mockAgentAddress)).resolves.toBeUndefined()
    })

    it('should handle not found error', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}/agents/${mockAgentAddress}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(agentsApi.unlink(mockOrgId, mockAgentAddress)).rejects.toThrow()
    })
  })
})
