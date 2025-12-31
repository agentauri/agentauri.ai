'use client'

import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { useOrganizationStore } from '@/stores/organization-store'
import type { EventFilters } from '@/lib/validations/event'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing blockchain events with filters
 * Automatically uses current organization from store
 */
export function useEvents(params?: PaginationParams & EventFilters) {
  const { currentOrganizationId, isHydrated } = useOrganizationStore()

  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => eventsApi.list(currentOrganizationId!, params),
    enabled: isHydrated && !!currentOrganizationId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for getting a single event by ID
 * Automatically uses current organization from store
 */
export function useEvent(eventId: string | null) {
  const { currentOrganizationId, isHydrated } = useOrganizationStore()

  return useQuery({
    queryKey: queryKeys.events.detail(eventId ?? ''),
    queryFn: () => eventsApi.get(currentOrganizationId!, eventId!),
    enabled: isHydrated && !!currentOrganizationId && !!eventId,
    staleTime: 60 * 1000, // 1 minute - events are immutable
  })
}

/**
 * Hook for listing events for a specific agent
 * Automatically uses current organization from store
 */
export function useAgentEvents(
  agentId: number | null,
  chainId: number | null,
  params?: PaginationParams
) {
  const { currentOrganizationId, isHydrated } = useOrganizationStore()

  return useQuery({
    queryKey: queryKeys.events.byAgent(agentId ?? 0, chainId ?? 0, params),
    queryFn: () => eventsApi.listByAgent(currentOrganizationId!, agentId!, chainId ?? undefined, params),
    enabled: isHydrated && !!currentOrganizationId && !!agentId,
    staleTime: 30 * 1000,
  })
}
