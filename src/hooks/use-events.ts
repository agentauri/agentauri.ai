'use client'

import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { EventFilters } from '@/lib/validations/event'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing blockchain events with filters
 */
export function useEvents(params?: PaginationParams & EventFilters) {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => eventsApi.list(params),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for getting a single event by ID
 */
export function useEvent(eventId: string | null) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId ?? ''),
    queryFn: () => eventsApi.get(eventId!),
    enabled: !!eventId,
    staleTime: 60 * 1000, // 1 minute - events are immutable
  })
}

/**
 * Hook for listing events for a specific agent
 */
export function useAgentEvents(
  agentId: number | null,
  chainId: number | null,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: queryKeys.events.byAgent(agentId ?? 0, chainId ?? 0, params),
    queryFn: () => eventsApi.listByAgent(agentId!, chainId ?? undefined, params),
    enabled: !!agentId,
    staleTime: 30 * 1000,
  })
}
