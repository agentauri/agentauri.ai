'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { agentsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { AgentFilters, LinkAgentRequest } from '@/lib/validations/agent'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing linked agents for an organization
 */
export function useAgents(orgId: string | null, params?: PaginationParams & AgentFilters) {
  return useQuery({
    queryKey: queryKeys.agents.list(orgId ?? '', params),
    queryFn: () => agentsApi.list(orgId!, params),
    enabled: !!orgId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for getting a single linked agent by address
 */
export function useAgent(orgId: string | null, agentAddress: string | null) {
  return useQuery({
    // Use a custom query key that includes the actual address for proper caching
    queryKey: ['agents', 'detail', orgId ?? '', agentAddress ?? ''] as const,
    queryFn: () => agentsApi.get(orgId!, agentAddress!),
    enabled: !!orgId && !!agentAddress,
    staleTime: 30 * 1000,
  })
}

/**
 * Hook for linking an agent to organization
 */
export function useLinkAgent(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LinkAgentRequest) => agentsApi.link(orgId, request),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all })
      toast.success(`Agent #${agent.agentId} linked successfully`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to link agent')
    },
  })
}

/**
 * Hook for unlinking an agent from organization
 */
export function useUnlinkAgent(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (agentAddress: string) => agentsApi.unlink(orgId, agentAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all })
      toast.success('Agent unlinked successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to unlink agent')
    },
  })
}
