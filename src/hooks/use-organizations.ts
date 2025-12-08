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
 * Hook for inviting member
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
 * Hook for removing member
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
      setCurrentOrganization(org.organization.id, org.myRole)
      // Invalidate org-specific queries
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
    },
  })
}
