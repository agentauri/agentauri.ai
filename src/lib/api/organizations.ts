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
 * Organizations API client for managing workspaces and teams
 *
 * Organizations are the primary resource containers in AgentAuri.
 * All agents, triggers, and billing are scoped to an organization.
 *
 * @see https://docs.agentauri.ai/api/organizations
 */
export const organizationsApi = {
  /**
   * List user's organizations
   *
   * Returns all organizations the authenticated user is a member of,
   * including their role in each organization.
   *
   * @param params - Pagination parameters
   * @returns Paginated list of organizations with user's role
   * @throws {ApiError} 401 - Unauthorized
   *
   * @example
   * ```ts
   * const { data: orgs } = await organizationsApi.list({ limit: 10 })
   * orgs.forEach(org => console.log(`${org.name}: ${org.role}`))
   * ```
   */
  async list(
    params?: PaginationParams
  ): Promise<{ data: OrganizationWithRole[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get('/organizations', { params })
    return organizationListResponseSchema.parse(data)
  },

  /**
   * Get organization by ID
   *
   * Retrieves detailed information about a specific organization.
   *
   * @param id - Organization UUID
   * @returns Organization details with user's role
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const org = await organizationsApi.get('org-uuid')
   * console.log(`Organization: ${org.name}, Role: ${org.role}`)
   * ```
   */
  async get(id: string): Promise<OrganizationWithRole> {
    const response = await apiClient.get<{ data: OrganizationWithRole }>(`/organizations/${id}`)
    // Backend wraps single resource in { data: {...} }
    const data = response.data
    return organizationWithRoleSchema.parse(data)
  },

  /**
   * Create new organization
   *
   * Creates a new organization with the authenticated user as owner.
   * New organizations start with default credit allocation.
   *
   * @param request - Organization creation details (name required)
   * @returns Newly created organization
   * @throws {ApiError} 400 - Invalid request (e.g., duplicate name)
   * @throws {ApiError} 401 - Unauthorized
   *
   * @example
   * ```ts
   * const org = await organizationsApi.create({
   *   name: 'My Trading Team',
   *   description: 'Automated trading agents',
   * })
   * ```
   */
  async create(request: CreateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.post<{ data: Organization }>('/organizations', request)
    // Backend wraps single resource in { data: {...} }
    return organizationSchema.parse(response.data)
  },

  /**
   * Update organization
   *
   * Updates organization name or description.
   * Requires owner or admin role.
   *
   * @param id - Organization UUID
   * @param request - Fields to update
   * @returns Updated organization
   * @throws {ApiError} 400 - Invalid request
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const org = await organizationsApi.update('org-uuid', {
   *   name: 'New Name',
   * })
   * ```
   */
  async update(id: string, request: UpdateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.patch<{ data: Organization }>(`/organizations/${id}`, request)
    // Backend wraps single resource in { data: {...} }
    return organizationSchema.parse(response.data)
  },

  /**
   * Delete organization
   *
   * Permanently deletes an organization and all associated resources.
   * This action cannot be undone. Requires owner role.
   *
   * @param id - Organization UUID to delete
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not owner)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * await organizationsApi.delete('org-uuid')
   * ```
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/organizations/${id}`)
  },

  /**
   * List organization members
   *
   * Returns all members of an organization with their roles.
   *
   * @param orgId - Organization UUID
   * @param params - Pagination parameters
   * @returns Paginated list of organization members
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const { data: members } = await organizationsApi.listMembers('org-uuid')
   * members.forEach(m => console.log(`${m.user.email}: ${m.role}`))
   * ```
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
   *
   * Sends an invitation to join the organization.
   * The invited user will receive an email with a link to accept.
   * Requires owner or admin role.
   *
   * @param orgId - Organization UUID
   * @param request - Invitation details (email and role)
   * @returns Created member invitation
   * @throws {ApiError} 400 - Invalid request (e.g., user already member)
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const member = await organizationsApi.inviteMember('org-uuid', {
   *   email: 'new.user@example.com',
   *   role: 'member',
   * })
   * ```
   */
  async inviteMember(orgId: string, request: InviteMemberRequest): Promise<OrganizationMember> {
    const response = await apiClient.post<{ data: OrganizationMember }>(
      `/organizations/${orgId}/members/invite`,
      request
    )
    // Backend wraps single resource in { data: {...} }
    return organizationMemberSchema.parse(response.data)
  },

  /**
   * Update member role
   *
   * Changes the role of an existing organization member.
   * Cannot demote the last owner. Requires owner or admin role.
   *
   * @param orgId - Organization UUID
   * @param memberId - Member UUID to update
   * @param request - New role assignment
   * @returns Updated member record
   * @throws {ApiError} 400 - Invalid request (e.g., demoting last owner)
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Organization or member not found
   *
   * @example
   * ```ts
   * const member = await organizationsApi.updateMemberRole(
   *   'org-uuid',
   *   'member-uuid',
   *   { role: 'admin' }
   * )
   * ```
   */
  async updateMemberRole(
    orgId: string,
    memberId: string,
    request: UpdateMemberRoleRequest
  ): Promise<OrganizationMember> {
    const response = await apiClient.patch<{ data: OrganizationMember }>(
      `/organizations/${orgId}/members/${memberId}`,
      request
    )
    // Backend wraps single resource in { data: {...} }
    return organizationMemberSchema.parse(response.data)
  },

  /**
   * Remove member from organization
   *
   * Removes a member from the organization.
   * Cannot remove the last owner. Requires owner or admin role.
   *
   * @param orgId - Organization UUID
   * @param memberId - Member UUID to remove
   * @throws {ApiError} 400 - Invalid request (e.g., removing last owner)
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Organization or member not found
   *
   * @example
   * ```ts
   * await organizationsApi.removeMember('org-uuid', 'member-uuid')
   * ```
   */
  async removeMember(orgId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgId}/members/${memberId}`)
  },

  /**
   * Leave organization
   *
   * Allows the current user to leave an organization.
   * Cannot leave if you are the last owner.
   *
   * @param orgId - Organization UUID to leave
   * @throws {ApiError} 400 - Cannot leave (e.g., last owner)
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * await organizationsApi.leave('org-uuid')
   * // Redirect to organization selection
   * ```
   */
  async leave(orgId: string): Promise<void> {
    await apiClient.post(`/organizations/${orgId}/leave`)
  },
}
