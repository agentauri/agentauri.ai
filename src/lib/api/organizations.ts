import { apiClient } from '@/lib/api-client'
import {
  type CreateOrganizationRequest,
  type InviteMemberRequest,
  memberListResponseSchema,
  type Organization,
  type OrganizationMember,
  type OrganizationWithRole,
  organizationListResponseSchema,
  organizationMemberSchema,
  organizationSchema,
  organizationWithRoleSchema,
  type UpdateMemberRoleRequest,
  type UpdateOrganizationRequest,
} from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * Organizations API client
 */
export const organizationsApi = {
  /**
   * List user's organizations
   */
  async list(
    params?: PaginationParams
  ): Promise<{ data: OrganizationWithRole[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get('/organizations', { params })
    return organizationListResponseSchema.parse(data)
  },

  /**
   * Get organization by ID
   */
  async get(id: string): Promise<OrganizationWithRole> {
    const data = await apiClient.get<OrganizationWithRole>(`/organizations/${id}`)
    return organizationWithRoleSchema.parse(data)
  },

  /**
   * Create new organization
   */
  async create(request: CreateOrganizationRequest): Promise<Organization> {
    const data = await apiClient.post<Organization>('/organizations', request)
    return organizationSchema.parse(data)
  },

  /**
   * Update organization
   */
  async update(id: string, request: UpdateOrganizationRequest): Promise<Organization> {
    const data = await apiClient.patch<Organization>(`/organizations/${id}`, request)
    return organizationSchema.parse(data)
  },

  /**
   * Delete organization
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/organizations/${id}`)
  },

  /**
   * List organization members
   */
  async listMembers(
    orgId: string,
    params?: PaginationParams
  ): Promise<{ data: OrganizationMember[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get(`/organizations/${orgId}/members`, { params })
    return memberListResponseSchema.parse(data)
  },

  /**
   * Invite member to organization
   */
  async inviteMember(orgId: string, request: InviteMemberRequest): Promise<OrganizationMember> {
    const data = await apiClient.post<OrganizationMember>(
      `/organizations/${orgId}/members/invite`,
      request
    )
    return organizationMemberSchema.parse(data)
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    orgId: string,
    memberId: string,
    request: UpdateMemberRoleRequest
  ): Promise<OrganizationMember> {
    const data = await apiClient.patch<OrganizationMember>(
      `/organizations/${orgId}/members/${memberId}`,
      request
    )
    return organizationMemberSchema.parse(data)
  },

  /**
   * Remove member from organization
   */
  async removeMember(orgId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgId}/members/${memberId}`)
  },

  /**
   * Leave organization
   */
  async leave(orgId: string): Promise<void> {
    await apiClient.post(`/organizations/${orgId}/leave`)
  },
}
