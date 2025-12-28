import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import {
  useCreateOrganization,
  useCurrentOrganization,
  useDeleteOrganization,
  useInviteMember,
  useOrganization,
  useOrganizationMembers,
  useOrganizations,
  useRemoveMember,
  useSwitchOrganization,
  useUpdateMemberRole,
  useUpdateOrganization,
} from '../use-organizations'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock organization store
const mockSetCurrentOrganization = vi.fn()
vi.mock('@/stores/organization-store', () => ({
  useOrganizationStore: vi.fn(() => ({
    currentOrganizationId: '550e8400-e29b-41d4-a716-446655440000',
    currentRole: 'owner',
    isHydrated: true,
    setCurrentOrganization: mockSetCurrentOrganization,
  })),
}))

describe('use-organizations hooks', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  // Backend returns snake_case
  const mockOrganization = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test Organization',
    slug: 'test-org',
    description: 'A test organization',
    is_personal: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }

  // Flat structure with my_role
  const mockOrgWithRole = {
    ...mockOrganization,
    my_role: 'owner',
  }

  const mockMember = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    organizationId: mockOrganization.id,
    role: 'member',
    username: 'testuser',
    email: 'test@example.com',
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
    mockSetCurrentOrganization.mockClear()
  })

  afterEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  describe('useOrganizations', () => {
    it('should fetch organizations list', async () => {
      const mockResponse = {
        data: [mockOrgWithRole],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useOrganizations(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
    })
  })

  describe('useOrganization', () => {
    it('should fetch organization by id', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrganization.id}`, () => {
          return HttpResponse.json(mockOrgWithRole)
        })
      )

      const { result } = renderHook(() => useOrganization(mockOrganization.id), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.id).toBe(mockOrganization.id)
    })

    it('should not fetch when id is null', () => {
      const { result } = renderHook(() => useOrganization(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCurrentOrganization', () => {
    it('should fetch current organization from store', async () => {
      server.use(
        http.get(`${baseUrl}/organizations/${mockOrganization.id}`, () => {
          return HttpResponse.json(mockOrgWithRole)
        })
      )

      const { result } = renderHook(() => useCurrentOrganization(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.id).toBe(mockOrganization.id)
    })
  })

  describe('useCreateOrganization', () => {
    it('should create organization successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations`, async () => {
          return HttpResponse.json(mockOrganization)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateOrganization(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        name: 'New Organization',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should handle create error', async () => {
      server.use(
        http.post(`${baseUrl}/organizations`, () => {
          return HttpResponse.json({ message: 'Name already taken' }, { status: 409 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useCreateOrganization(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        name: 'Duplicate Name',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useUpdateOrganization', () => {
    it('should update organization successfully', async () => {
      const updatedOrg = { ...mockOrganization, name: 'Updated Name' }

      server.use(
        http.patch(`${baseUrl}/organizations/${mockOrganization.id}`, async () => {
          return HttpResponse.json(updatedOrg)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useUpdateOrganization(mockOrganization.id), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ name: 'Updated Name' })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useDeleteOrganization', () => {
    it('should delete organization successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrganization.id}`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useDeleteOrganization(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockOrganization.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useOrganizationMembers', () => {
    it('should fetch organization members', async () => {
      const mockResponse = {
        data: [mockMember],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false,
        },
      }

      server.use(
        http.get(`${baseUrl}/organizations/${mockOrganization.id}/members`, () => {
          return HttpResponse.json(mockResponse)
        })
      )

      const { result } = renderHook(() => useOrganizationMembers(mockOrganization.id), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.data).toHaveLength(1)
    })

    it('should not fetch when orgId is null', () => {
      const { result } = renderHook(() => useOrganizationMembers(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useInviteMember', () => {
    it('should invite member successfully', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrganization.id}/members/invite`, async () => {
          return HttpResponse.json(mockMember)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useInviteMember(mockOrganization.id), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        email: 'newmember@example.com',
        role: 'member',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useUpdateMemberRole', () => {
    it('should update member role successfully', async () => {
      const updatedMember = { ...mockMember, role: 'admin' }

      server.use(
        http.patch(`${baseUrl}/organizations/${mockOrganization.id}/members/${mockMember.id}`, async () => {
          return HttpResponse.json(updatedMember)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useUpdateMemberRole(mockOrganization.id), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        memberId: mockMember.id,
        request: { role: 'admin' },
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useRemoveMember', () => {
    it('should remove member successfully', async () => {
      server.use(
        http.delete(`${baseUrl}/organizations/${mockOrganization.id}/members/${mockMember.id}`, () => {
          return HttpResponse.json({ success: true })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useRemoveMember(mockOrganization.id), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockMember.id)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useSwitchOrganization', () => {
    it('should switch organization and update store', async () => {
      const newOrgId = '550e8400-e29b-41d4-a716-446655440003'
      const newOrg = {
        ...mockOrganization,
        id: newOrgId,
        my_role: 'admin',
      }

      server.use(
        http.get(`${baseUrl}/organizations/${newOrgId}`, () => {
          return HttpResponse.json(newOrg)
        })
      )

      const { result } = renderHook(() => useSwitchOrganization(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(newOrgId)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockSetCurrentOrganization).toHaveBeenCalledWith(newOrgId, 'admin')
    })
  })
})
