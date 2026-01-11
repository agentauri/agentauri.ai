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
 * Triggers API client for automated event responses
 *
 * Triggers define automated actions in response to blockchain events.
 * Each trigger has conditions (what to match) and actions (what to do).
 * Trigger executions consume credits.
 *
 * @see https://docs.agentauri.ai/api/triggers
 */
export const triggersApi = {
  /**
   * List triggers for organization
   *
   * Returns paginated list of triggers with optional filtering.
   *
   * @param orgId - Organization UUID
   * @param params - Pagination and filter parameters
   * @returns Paginated list of triggers
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member of organization)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const { data: triggers } = await triggersApi.list('org-uuid', {
   *   enabled: true,
   *   limit: 20,
   * })
   * ```
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
   *
   * Retrieves detailed information about a specific trigger.
   *
   * @param triggerId - Trigger UUID
   * @returns Trigger details including conditions and actions
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Trigger not found
   *
   * @example
   * ```ts
   * const trigger = await triggersApi.get('trigger-uuid')
   * console.log(`Trigger: ${trigger.name}, Enabled: ${trigger.enabled}`)
   * ```
   */
  async get(triggerId: string): Promise<Trigger> {
    const data = await apiClient.get<Trigger>(`/triggers/${triggerId}`)
    return triggerSchema.parse(data)
  },

  /**
   * Create new trigger
   *
   * Creates a new automation trigger for the organization.
   * Triggers start in enabled state by default.
   *
   * @param orgId - Organization UUID
   * @param request - Trigger configuration (name, conditions, actions)
   * @returns Newly created trigger
   * @throws {ApiError} 400 - Invalid request (e.g., invalid condition)
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const trigger = await triggersApi.create('org-uuid', {
   *   name: 'Reputation Alert',
   *   conditions: [{ type: 'event', eventType: 'ReputationUpdated' }],
   *   actions: [{ type: 'webhook', url: 'https://...' }],
   * })
   * ```
   */
  async create(orgId: string, request: CreateTriggerRequest): Promise<Trigger> {
    const data = await apiClient.post<Trigger>(`/organizations/${orgId}/triggers`, request)
    return triggerSchema.parse(data)
  },

  /**
   * Update trigger
   *
   * Updates trigger configuration. Can update name, conditions,
   * actions, or enabled state.
   *
   * @param triggerId - Trigger UUID
   * @param request - Fields to update
   * @returns Updated trigger
   * @throws {ApiError} 400 - Invalid request
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Trigger not found
   *
   * @example
   * ```ts
   * const trigger = await triggersApi.update('trigger-uuid', {
   *   name: 'Updated Name',
   *   enabled: false,
   * })
   * ```
   */
  async update(triggerId: string, request: UpdateTriggerRequest): Promise<Trigger> {
    const data = await apiClient.patch<Trigger>(`/triggers/${triggerId}`, request)
    return triggerSchema.parse(data)
  },

  /**
   * Delete trigger
   *
   * Permanently deletes a trigger. This action cannot be undone.
   * Execution history is preserved.
   *
   * @param triggerId - Trigger UUID to delete
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Trigger not found
   *
   * @example
   * ```ts
   * await triggersApi.delete('trigger-uuid')
   * ```
   */
  async delete(triggerId: string): Promise<void> {
    await apiClient.delete(`/triggers/${triggerId}`)
  },

  /**
   * Enable trigger
   *
   * Activates a disabled trigger. Enabled triggers will execute
   * when matching events occur.
   *
   * @param triggerId - Trigger UUID to enable
   * @returns Updated trigger with enabled=true
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Trigger not found
   *
   * @example
   * ```ts
   * const trigger = await triggersApi.enable('trigger-uuid')
   * console.log(trigger.enabled) // true
   * ```
   */
  async enable(triggerId: string): Promise<Trigger> {
    const data = await apiClient.post<Trigger>(`/triggers/${triggerId}/enable`)
    return triggerSchema.parse(data)
  },

  /**
   * Disable trigger
   *
   * Deactivates a trigger. Disabled triggers will not execute
   * even when matching events occur.
   *
   * @param triggerId - Trigger UUID to disable
   * @returns Updated trigger with enabled=false
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Trigger not found
   *
   * @example
   * ```ts
   * const trigger = await triggersApi.disable('trigger-uuid')
   * console.log(trigger.enabled) // false
   * ```
   */
  async disable(triggerId: string): Promise<Trigger> {
    const data = await apiClient.post<Trigger>(`/triggers/${triggerId}/disable`)
    return triggerSchema.parse(data)
  },

  /**
   * Test trigger (dry run)
   *
   * Executes a trigger in test mode without consuming credits
   * or performing actual actions. Useful for validating trigger
   * configuration before enabling.
   *
   * @param triggerId - Trigger UUID to test
   * @returns Test result with success status and optional error
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Trigger not found
   *
   * @example
   * ```ts
   * const result = await triggersApi.test('trigger-uuid')
   * if (result.success) {
   *   console.log('Trigger test passed:', result.result)
   * } else {
   *   console.error('Trigger test failed:', result.error)
   * }
   * ```
   */
  async test(triggerId: string): Promise<{ success: boolean; result?: unknown; error?: string }> {
    return apiClient.post<{ success: boolean; result?: unknown; error?: string }>(
      `/triggers/${triggerId}/test`
    )
  },
}
