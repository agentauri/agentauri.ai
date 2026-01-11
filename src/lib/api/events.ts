import { apiClient } from '@/lib/api-client'
import {
  type BlockchainEvent,
  blockchainEventSchema,
  type EventFilters,
  eventListResponseSchema,
} from '@/lib/validations/event'
import type { PaginationParams } from '@/types/api'

/**
 * Blockchain Events API client
 *
 * Events are indexed from ERC-8004 registries (Identity, Reputation, Validation)
 * via Ponder indexers. Events are immutable once indexed.
 *
 * @see https://docs.agentauri.ai/api/events
 */
export const eventsApi = {
  /**
   * List blockchain events with filters
   *
   * Returns paginated list of events from linked agents.
   * Requires X-Organization-ID header.
   *
   * @param organizationId - Organization UUID (sent as header)
   * @param params - Filter and pagination parameters
   * @returns Paginated list of blockchain events
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member of organization)
   *
   * @example
   * ```ts
   * const { data: events } = await eventsApi.list('org-uuid', {
   *   eventType: 'ReputationUpdated',
   *   chainId: 1,
   *   limit: 50,
   * })
   * ```
   */
  async list(
    organizationId: string,
    params?: PaginationParams & EventFilters
  ): Promise<{ data: BlockchainEvent[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get('/events', {
      params,
      headers: { 'X-Organization-ID': organizationId },
    })
    return eventListResponseSchema.parse(data)
  },

  /**
   * Get event by ID
   *
   * Retrieves a single blockchain event with full details.
   *
   * @param organizationId - Organization UUID (sent as header)
   * @param eventId - Event ID (format: chainId-txHash-logIndex)
   * @returns Blockchain event details
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden
   * @throws {ApiError} 404 - Event not found
   *
   * @example
   * ```ts
   * const event = await eventsApi.get('org-uuid', '1-0xabc...-42')
   * console.log(`Event: ${event.eventType} at block ${event.blockNumber}`)
   * ```
   */
  async get(organizationId: string, eventId: string): Promise<BlockchainEvent> {
    const data = await apiClient.get<BlockchainEvent>(`/events/${eventId}`, {
      headers: { 'X-Organization-ID': organizationId },
    })
    return blockchainEventSchema.parse(data)
  },

  /**
   * List events for a specific agent
   *
   * Convenience method to filter events by agent ID.
   *
   * @param organizationId - Organization UUID (sent as header)
   * @param agentId - Agent ID to filter by
   * @param chainId - Optional chain ID filter
   * @param params - Pagination parameters
   * @returns Paginated list of events for the agent
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden
   *
   * @example
   * ```ts
   * const { data: events } = await eventsApi.listByAgent(
   *   'org-uuid',
   *   12345, // agentId
   *   1,     // chainId
   *   { limit: 20 }
   * )
   * ```
   */
  async listByAgent(
    organizationId: string,
    agentId: number,
    chainId?: number,
    params?: PaginationParams
  ): Promise<{ data: BlockchainEvent[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get('/events', {
      params: {
        ...params,
        agentId,
        chainId,
      },
      headers: { 'X-Organization-ID': organizationId },
    })
    return eventListResponseSchema.parse(data)
  },
}
