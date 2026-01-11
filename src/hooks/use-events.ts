/**
 * Event hooks
 *
 * React hooks for querying blockchain events from linked agents.
 * Supports filtering by event type, agent, and date range.
 *
 * @module hooks/use-events
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { useOrganizationStore } from '@/stores/organization-store'
import type { EventFilters } from '@/lib/validations/event'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing blockchain events with filters
 *
 * Automatically uses current organization from store.
 * Returns paginated list of events from linked agents.
 * Data is cached for 30 seconds.
 *
 * @param params - Optional pagination and filter parameters
 * @returns TanStack Query result with events list
 *
 * @example
 * ```tsx
 * function EventsFeed() {
 *   const { data, isLoading } = useEvents({
 *     eventType: 'ReputationUpdated',
 *     limit: 50,
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <ul>
 *       {data?.data.map(event => (
 *         <li key={event.id}>{event.eventType} at block {event.blockNumber}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
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
 *
 * Automatically uses current organization from store.
 * Events are immutable once indexed, so cached for 1 minute.
 *
 * @param eventId - Event ID (format: chainId-txHash-logIndex). Query disabled if null.
 * @returns TanStack Query result with event details
 *
 * @example
 * ```tsx
 * function EventDetail({ eventId }: { eventId: string }) {
 *   const { data: event } = useEvent(eventId)
 *
 *   return (
 *     <div>
 *       <h1>{event?.eventType}</h1>
 *       <p>Block: {event?.blockNumber}</p>
 *       <p>Transaction: {event?.transactionHash}</p>
 *     </div>
 *   )
 * }
 * ```
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
 *
 * Automatically uses current organization from store.
 * Convenience method to filter events by agent ID.
 *
 * @param agentId - Agent ID to filter by. Query disabled if null.
 * @param chainId - Optional chain ID filter
 * @param params - Optional pagination parameters
 * @returns TanStack Query result with agent events
 *
 * @example
 * ```tsx
 * function AgentEventsList({ agentId, chainId }: Props) {
 *   const { data } = useAgentEvents(agentId, chainId, { limit: 20 })
 *
 *   return (
 *     <ul>
 *       {data?.data.map(event => (
 *         <li key={event.id}>{event.eventType}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
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
