import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { organizationsApi } from '../organizations'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('organizationsApi', () => {
  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'
  const mockMemberId = '550e8400-e29b-41d4-a716-446655440001'

  const mockOrganization = {
    id: mockOrgId,
    name: 'Test Organization',
    slug: 'test-org',
    description: 'A test organization',
    isPersonal: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }

  const mockOrgWithRole = {
    organization: mockOrganization,
    myRole: 'owner',
  }

  const mockMember = {
    id: mockMemberId,
    userId: '550e8400-e29b-41d4-a716-446655440002',
    organizationId: mockOrgId,
    role: 'member',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2025-01-01T00:00:00Z',
  }

  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('list', () => {
    it('should list organizations', async () => {
      const mockResponse = {
        data: [mockOrgWithRole],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await organizationsApi.list()

      expect(result.data).toHaveLength(1)
      expect(result.data[0].organization.id).toBe(mockOrgId)
      expect(result.data[0].myRole).toBe('owner')
    })

    it('should pass pagination parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 50, offset: 10, hasMore: false },
          })
        })
      )

      await organizationsApi.list({ limit: 50, offset: 10 })

      expect(capturedUrl?.searchParams.get('limit')).toBe('50')
      expect(capturedUrl?.searchParams.get('offset')).toBe('10')
    })

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/organizations`, () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
          })
        })
      )

      const result = await organizationsApi.list()

      expect(result.data).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })
  })

  describe('get', () => {
    it('should get organization by id', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}`, () => {
          return HttpResponse.json(mockOrgWithRole)
        })
      )

      const result = await organizationsApi.get(mockOrgId)

      expect(result.organization.id).toBe(mockOrgId)
      expect(result.organization.name).toBe('Test Organization')
      expect(result.myRole).toBe('owner')
    })

    it('should handle not found error', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 })
        })
      )

      await expect(organizationsApi.get(mockOrgId)).rejects.toThrow()
    })
  })

  describe('create', () => {
    const createRequest = {
      name: 'New Organization',
      slug: 'new-org',
      description: 'A new organization',
    }

    it('should create organization successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(createRequest)
          return HttpResponse.json({ ...mockOrganization, name: 'New Organization' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await organizationsApi.create(createRequest)

      expect(result.name).toBe('New Organization')
    })

    it('should handle slug conflict error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations`, () => {
          return HttpResponse.json({ message: 'Slug already taken' }, { status: 409 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.create(createRequest)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update organization successfully', async () => {
      const updateRequest = { name: 'Updated Name' }

      server.use(
        http.patch(`${baseUrl}/organizations/${mockOrgId}`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(updateRequest)
          return HttpResponse.json({ ...mockOrganization, name: 'Updated Name' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await organizationsApi.update(mockOrgId, updateRequest)

      expect(result.name).toBe('Updated Name')
    })

    it('should handle partial update', async () => {
      server.use(
        http.patch(`${baseUrl}/organizations/${mockOrgId}`, () => {
          return HttpResponse.json({ ...mockOrganization, description: 'Updated description' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await organizationsApi.update(mockOrgId, { description: 'Updated description' })

      expect(result.description).toBe('Updated description')
    })
  })

  describe('delete', () => {
    it('should delete organization successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.delete(mockOrgId)).resolves.toBeUndefined()
    })

    it('should handle delete error', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}`, () => {
          return HttpResponse.json({ message: 'Cannot delete personal organization' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.delete(mockOrgId)).rejects.toThrow()
    })
  })

  describe('listMembers', () => {
    it('should list organization members', async () => {
      const mockResponse = {
        data: [mockMember],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/members`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await organizationsApi.listMembers(mockOrgId)

      expect(result.data).toHaveLength(1)
      expect(result.data[0].username).toBe('testuser')
      expect(result.data[0].role).toBe('member')
    })

    it('should pass pagination parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrgId}/members`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, limit: 50, offset: 10, hasMore: false },
          })
        })
      )

      await organizationsApi.listMembers(mockOrgId, { limit: 50, offset: 10 })

      expect(capturedUrl?.searchParams.get('limit')).toBe('50')
      expect(capturedUrl?.searchParams.get('offset')).toBe('10')
    })
  })

  describe('inviteMember', () => {
    const inviteRequest = {
      email: 'newmember@example.com',
      role: 'member' as const,
    }

    it('should invite member successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/members/invite`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(inviteRequest)
          return HttpResponse.json({ ...mockMember, email: 'newmember@example.com' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await organizationsApi.inviteMember(mockOrgId, inviteRequest)

      expect(result.email).toBe('newmember@example.com')
    })

    it('should handle already member error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/members/invite`, () => {
          return HttpResponse.json({ message: 'User is already a member' }, { status: 409 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.inviteMember(mockOrgId, inviteRequest)).rejects.toThrow()
    })
  })

  describe('updateMemberRole', () => {
    it('should update member role successfully', async () => {
      const roleRequest = { role: 'admin' as const }

      server.use(
        http.patch(`${baseUrl}/organizations/${mockOrgId}/members/${mockMemberId}`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject(roleRequest)
          return HttpResponse.json({ ...mockMember, role: 'admin' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await organizationsApi.updateMemberRole(mockOrgId, mockMemberId, roleRequest)

      expect(result.role).toBe('admin')
    })

    it('should handle insufficient permissions error', async () => {
      server.use(
        http.patch(`${baseUrl}/organizations/${mockOrgId}/members/${mockMemberId}`, () => {
          return HttpResponse.json({ message: 'Insufficient permissions' }, { status: 403 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(
        organizationsApi.updateMemberRole(mockOrgId, mockMemberId, { role: 'admin' })
      ).rejects.toThrow()
    })
  })

  describe('removeMember', () => {
    it('should remove member successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}/members/${mockMemberId}`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.removeMember(mockOrgId, mockMemberId)).resolves.toBeUndefined()
    })

    it('should handle remove owner error', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrgId}/members/${mockMemberId}`, () => {
          return HttpResponse.json({ message: 'Cannot remove organization owner' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.removeMember(mockOrgId, mockMemberId)).rejects.toThrow()
    })
  })

  describe('leave', () => {
    it('should leave organization successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/leave`, () => {
          return new Response(null, { status: 204 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.leave(mockOrgId)).resolves.toBeUndefined()
    })

    it('should handle owner leave error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/leave`, () => {
          return HttpResponse.json({ message: 'Owner cannot leave organization' }, { status: 400 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(organizationsApi.leave(mockOrgId)).rejects.toThrow()
    })
  })
})
