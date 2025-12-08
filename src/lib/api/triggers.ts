import { apiClient } from '@/lib/api-client'
import {
  type CreateTriggerRequest,
  type Trigger,
  type TriggerFilters,
  triggerListResponseSchema,
  triggerSchema,
  type UpdateTriggerRequest,
} from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * Triggers API client
 */
export const triggersApi = {
  /**
   * List triggers for organization
   */
  async list(
    orgId: string,
    params?: PaginationParams & TriggerFilters
  ): Promise<{ data: Trigger[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get(`/organizations/${orgId}/triggers`, { params })
    return triggerListResponseSchema.parse(data)
  },

  /**
   * Get trigger by ID
   */
  async get(triggerId: string): Promise<Trigger> {
    const data = await apiClient.get<Trigger>(`/triggers/${triggerId}`)
    return triggerSchema.parse(data)
  },

  /**
   * Create new trigger
   */
  async create(orgId: string, request: CreateTriggerRequest): Promise<Trigger> {
    const data = await apiClient.post<Trigger>(`/organizations/${orgId}/triggers`, request)
    return triggerSchema.parse(data)
  },

  /**
   * Update trigger
   */
  async update(triggerId: string, request: UpdateTriggerRequest): Promise<Trigger> {
    const data = await apiClient.patch<Trigger>(`/triggers/${triggerId}`, request)
    return triggerSchema.parse(data)
  },

  /**
   * Delete trigger
   */
  async delete(triggerId: string): Promise<void> {
    await apiClient.delete(`/triggers/${triggerId}`)
  },

  /**
   * Enable trigger
   */
  async enable(triggerId: string): Promise<Trigger> {
    const data = await apiClient.post<Trigger>(`/triggers/${triggerId}/enable`)
    return triggerSchema.parse(data)
  },

  /**
   * Disable trigger
   */
  async disable(triggerId: string): Promise<Trigger> {
    const data = await apiClient.post<Trigger>(`/triggers/${triggerId}/disable`)
    return triggerSchema.parse(data)
  },

  /**
   * Test trigger (dry run)
   */
  async test(triggerId: string): Promise<{ success: boolean; result?: unknown; error?: string }> {
    return apiClient.post<{ success: boolean; result?: unknown; error?: string }>(
      `/triggers/${triggerId}/test`
    )
  },
}
