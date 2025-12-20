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
 */
export const eventsApi = {
  /**
   * List blockchain events with filters
   */
  async list(
    params?: PaginationParams & EventFilters
  ): Promise<{ data: BlockchainEvent[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get('/events', { params })
    return eventListResponseSchema.parse(data)
  },

  /**
   * Get event by ID
   */
  async get(eventId: string): Promise<BlockchainEvent> {
    const data = await apiClient.get<BlockchainEvent>(`/events/${eventId}`)
    return blockchainEventSchema.parse(data)
  },

  /**
   * List events for a specific agent
   */
  async listByAgent(
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
    })
    return eventListResponseSchema.parse(data)
  },
}
