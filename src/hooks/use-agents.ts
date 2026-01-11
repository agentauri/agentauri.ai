'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { agentsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { AgentFilters, LinkAgentRequest } from '@/lib/validations/agent'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing linked agents for an organization
 *
 * Returns paginated list of ERC-8004 agents linked to the organization.
 * Data is cached for 30 seconds.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @param params - Optional pagination and filter parameters
 * @returns TanStack Query result with agents list
 *
 * @example
 * ```tsx
 * function AgentsList({ orgId }: { orgId: string }) {
 *   const { data, isLoading } = useAgents(orgId, { limit: 10 })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <ul>
 *       {data?.data.map(agent => (
 *         <li key={agent.agentAddress}>Agent #{agent.agentId}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
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
 *
 * Fetches detailed information about a specific agent.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @param agentAddress - Agent's Ethereum address (0x...). Query disabled if null.
 * @returns TanStack Query result with agent details
 *
 * @example
 * ```tsx
 * function AgentDetail({ orgId, address }: Props) {
 *   const { data: agent } = useAgent(orgId, address)
 *
 *   return (
 *     <div>
 *       <h1>Agent #{agent?.agentId}</h1>
 *       <p>Chain: {agent?.chainId}</p>
 *     </div>
 *   )
 * }
 * ```
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
 *
 * Associates an ERC-8004 agent NFT with the organization for monitoring.
 * Shows success/error toast notifications.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for agent linking
 *
 * @example
 * ```tsx
 * function LinkAgentForm({ orgId }: { orgId: string }) {
 *   const linkAgent = useLinkAgent(orgId)
 *
 *   const handleLink = (address: string, chainId: number) => {
 *     linkAgent.mutate({
 *       agentAddress: address,
 *       chainId,
 *       name: 'My Agent',
 *     })
 *   }
 * }
 * ```
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
 *
 * Removes the association between an agent and the organization.
 * Historical events are preserved.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for agent unlinking
 *
 * @example
 * ```tsx
 * function UnlinkButton({ orgId, address }: Props) {
 *   const unlinkAgent = useUnlinkAgent(orgId)
 *
 *   return (
 *     <Button
 *       variant="danger"
 *       onClick={() => unlinkAgent.mutate(address)}
 *       disabled={unlinkAgent.isPending}
 *     >
 *       Unlink Agent
 *     </Button>
 *   )
 * }
 * ```
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
