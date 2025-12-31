import { apiClient } from '@/lib/api-client'
import {
  type BlockchainEvent,
  blockchainEventSchema,
  type EventFilters,
  eventListResponseSchema,
} from '@/lib/validations/event'
import type { PaginationParams } from '@/types/api'

/**
 * Events API client
 * Note: Events endpoints require X-Organization-ID header
 */
export const eventsApi = {
  /**
   * List blockchain events with filters
   * @param organizationId - Required organization ID for header
   * @param params - Filter and pagination params
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
   * @param organizationId - Required organization ID for header
   * @param eventId - The event ID
   */
  async get(organizationId: string, eventId: string): Promise<BlockchainEvent> {
    const data = await apiClient.get<BlockchainEvent>(`/events/${eventId}`, {
      headers: { 'X-Organization-ID': organizationId },
    })
    return blockchainEventSchema.parse(data)
  },

  /**
   * List events for a specific agent
   * @param organizationId - Required organization ID for header
   * @param agentId - The agent ID to filter by
   * @param chainId - Optional chain ID filter
   * @param params - Pagination params
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
