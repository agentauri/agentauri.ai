/**
 * Organization hooks
 *
 * React hooks for managing organizations, memberships, and team switching.
 * Provides CRUD operations for organizations and member management.
 *
 * @module hooks/use-organizations
 */

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { organizationsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type {
  CreateOrganizationRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  UpdateOrganizationRequest,
} from '@/lib/validations'
import { useOrganizationStore } from '@/stores/organization-store'

/**
 * Hook for listing user's organizations
 *
 * Returns all organizations the authenticated user belongs to.
 * Data is cached for 5 minutes.
 *
 * @returns TanStack Query result with organizations list
 *
 * @example
 * ```tsx
 * function OrgSelector() {
 *   const { data, isLoading } = useOrganizations()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <select>
 *       {data?.data.map(org => (
 *         <option key={org.id}>{org.name}</option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 */
export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: () => organizationsApi.list(),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook for getting organization by ID
 *
 * Fetches detailed information about a specific organization.
 *
 * @param id - Organization UUID. Query disabled if null.
 * @returns TanStack Query result with organization details
 *
 * @example
 * ```tsx
 * function OrgDetails({ orgId }: { orgId: string }) {
 *   const { data: org } = useOrganization(orgId)
 *   return <h1>{org?.name}</h1>
 * }
 * ```
 */
export function useOrganization(id: string | null) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id ?? ''),
    queryFn: () => organizationsApi.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook for current organization (from store + query)
 *
 * Uses the organization ID from Zustand store and fetches
 * full organization details. Waits for store hydration.
 *
 * @returns TanStack Query result with current organization
 *
 * @example
 * ```tsx
 * function CurrentOrgBadge() {
 *   const { data: org } = useCurrentOrganization()
 *   return <Badge>{org?.name || 'No org selected'}</Badge>
 * }
 * ```
 */
export function useCurrentOrganization() {
  const { currentOrganizationId, isHydrated } = useOrganizationStore()

  return useQuery({
    queryKey: queryKeys.organizations.detail(currentOrganizationId ?? ''),
    queryFn: () => organizationsApi.get(currentOrganizationId!),
    enabled: isHydrated && !!currentOrganizationId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook for creating organization
 *
 * Creates a new organization with the current user as owner.
 * Invalidates organizations list on success.
 *
 * @returns TanStack Mutation for organization creation
 *
 * @example
 * ```tsx
 * function CreateOrgForm() {
 *   const createOrg = useCreateOrganization()
 *
 *   const handleSubmit = (data: CreateOrganizationRequest) => {
 *     createOrg.mutate(data, {
 *       onSuccess: (org) => router.push(`/org/${org.id}`)
 *     })
 *   }
 * }
 * ```
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateOrganizationRequest) => organizationsApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all })
    },
  })
}

/**
 * Hook for updating organization
 *
 * Updates organization name or description.
 * Invalidates both detail and list queries on success.
 *
 * @param orgId - Organization UUID to update
 * @returns TanStack Mutation for organization update
 *
 * @example
 * ```tsx
 * function EditOrgForm({ orgId }: { orgId: string }) {
 *   const updateOrg = useUpdateOrganization(orgId)
 *
 *   const handleSubmit = (data: UpdateOrganizationRequest) => {
 *     updateOrg.mutate(data)
 *   }
 * }
 * ```
 */
export function useUpdateOrganization(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateOrganizationRequest) => organizationsApi.update(orgId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(orgId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.list() })
    },
  })
}

/**
 * Hook for deleting organization
 *
 * Permanently deletes an organization and all associated resources.
 * Clears current organization from store if it was deleted.
 *
 * @returns TanStack Mutation for organization deletion
 *
 * @example
 * ```tsx
 * function DeleteOrgButton({ orgId }: { orgId: string }) {
 *   const deleteOrg = useDeleteOrganization()
 *
 *   return (
 *     <Button
 *       variant="danger"
 *       onClick={() => deleteOrg.mutate(orgId)}
 *       disabled={deleteOrg.isPending}
 *     >
 *       Delete Organization
 *     </Button>
 *   )
 * }
 * ```
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient()
  const { currentOrganizationId, setCurrentOrganization } = useOrganizationStore()

  return useMutation({
    mutationFn: (orgId: string) => organizationsApi.delete(orgId),
    onSuccess: (_, deletedOrgId) => {
      // Clear current org if it was deleted
      if (currentOrganizationId === deletedOrgId) {
        setCurrentOrganization(null)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all })
    },
  })
}

/**
 * Hook for listing organization members
 *
 * Returns all members of an organization with their roles.
 * Data is cached for 2 minutes.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @returns TanStack Query result with members list
 *
 * @example
 * ```tsx
 * function MembersList({ orgId }: { orgId: string }) {
 *   const { data } = useOrganizationMembers(orgId)
 *
 *   return (
 *     <ul>
 *       {data?.data.map(member => (
 *         <li key={member.id}>{member.user.email} - {member.role}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useOrganizationMembers(orgId: string | null) {
  return useQuery({
    queryKey: queryKeys.organizations.members(orgId ?? ''),
    queryFn: () => organizationsApi.listMembers(orgId!),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Hook for inviting member to organization
 *
 * Sends an invitation email to join the organization.
 * Invalidates members list on success.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for member invitation
 *
 * @example
 * ```tsx
 * function InviteForm({ orgId }: { orgId: string }) {
 *   const invite = useInviteMember(orgId)
 *
 *   const handleInvite = (email: string, role: string) => {
 *     invite.mutate({ email, role })
 *   }
 * }
 * ```
 */
export function useInviteMember(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: InviteMemberRequest) => organizationsApi.inviteMember(orgId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.members(orgId) })
    },
  })
}

/**
 * Hook for updating member role
 *
 * Changes the role of an existing organization member.
 * Cannot demote the last owner.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for role update
 *
 * @example
 * ```tsx
 * function RoleSelect({ orgId, memberId }: Props) {
 *   const updateRole = useUpdateMemberRole(orgId)
 *
 *   const handleChange = (newRole: string) => {
 *     updateRole.mutate({ memberId, request: { role: newRole } })
 *   }
 * }
 * ```
 */
export function useUpdateMemberRole(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, request }: { memberId: string; request: UpdateMemberRoleRequest }) =>
      organizationsApi.updateMemberRole(orgId, memberId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.members(orgId) })
    },
  })
}

/**
 * Hook for removing member from organization
 *
 * Removes a member from the organization.
 * Cannot remove the last owner.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for member removal
 *
 * @example
 * ```tsx
 * function RemoveMemberButton({ orgId, memberId }: Props) {
 *   const removeMember = useRemoveMember(orgId)
 *
 *   return (
 *     <Button onClick={() => removeMember.mutate(memberId)}>
 *       Remove
 *     </Button>
 *   )
 * }
 * ```
 */
export function useRemoveMember(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => organizationsApi.removeMember(orgId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.members(orgId) })
    },
  })
}

/**
 * Hook for switching organization
 *
 * Changes the current organization context.
 * Updates store and invalidates organization-specific queries.
 *
 * @returns TanStack Mutation for organization switching
 *
 * @example
 * ```tsx
 * function OrgSwitcher() {
 *   const switchOrg = useSwitchOrganization()
 *   const { data } = useOrganizations()
 *
 *   return (
 *     <select onChange={(e) => switchOrg.mutate(e.target.value)}>
 *       {data?.data.map(org => (
 *         <option key={org.id} value={org.id}>{org.name}</option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 */
export function useSwitchOrganization() {
  const { setCurrentOrganization } = useOrganizationStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orgId: string) => {
      const org = await organizationsApi.get(orgId)
      return org
    },
    onSuccess: (org) => {
      setCurrentOrganization(org.id, org.my_role)
      // Invalidate org-specific queries
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
    },
  })
}
