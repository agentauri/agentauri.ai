import { apiClient } from '@/lib/api-client'
import {
  type ApiKey,
  type ApiKeyStats,
  apiKeyListResponseSchema,
  apiKeySchema,
  apiKeyStatsSchema,
  type CreateApiKeyRequest,
  type CreateApiKeyResponse,
  createApiKeyResponseSchema,
  type UpdateApiKeyRequest,
} from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * API Keys management client
 *
 * API keys provide programmatic access to the AgentAuri API.
 * Keys can be scoped to specific organizations and have optional expiration.
 *
 * @see https://docs.agentauri.ai/api/api-keys
 */
export const apiKeysApi = {
  /**
   * List API keys for organization
   *
   * Returns paginated list of API keys. Key values are masked except
   * at creation time.
   *
   * @param orgId - Organization UUID
   * @param params - Pagination parameters
   * @returns Paginated list of API keys
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member of organization)
   *
   * @example
   * ```ts
   * const { data: keys } = await apiKeysApi.list('org-uuid', { limit: 10 })
   * ```
   */
  async list(
    orgId: string,
    params?: PaginationParams
  ): Promise<{ data: ApiKey[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get(`/organizations/${orgId}/api-keys`, { params })
    return apiKeyListResponseSchema.parse(data)
  },

  /**
   * Get API key by ID
   *
   * Retrieves API key metadata. The actual key value is not returned.
   *
   * @param keyId - API key UUID
   * @returns API key details (without actual key value)
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Key not found
   *
   * @example
   * ```ts
   * const key = await apiKeysApi.get('key-uuid')
   * console.log(`Key "${key.name}" last used: ${key.lastUsedAt}`)
   * ```
   */
  async get(keyId: string): Promise<ApiKey> {
    const data = await apiClient.get<ApiKey>(`/api-keys/${keyId}`)
    return apiKeySchema.parse(data)
  },

  /**
   * Create new API key
   *
   * Creates a new API key for the organization. The full key value
   * is only returned once at creation time - store it securely.
   *
   * @param orgId - Organization UUID
   * @param request - API key configuration
   * @returns Created API key with full key value
   * @throws {ApiError} 400 - Invalid request
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   *
   * @example
   * ```ts
   * const result = await apiKeysApi.create('org-uuid', {
   *   name: 'Production Key',
   *   expiresAt: '2025-12-31T23:59:59Z',
   * })
   * // IMPORTANT: Store result.key securely - it won't be shown again!
   * console.log(`API Key: ${result.key}`)
   * ```
   */
  async create(orgId: string, request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const data = await apiClient.post<CreateApiKeyResponse>(
      `/organizations/${orgId}/api-keys`,
      request
    )
    return createApiKeyResponseSchema.parse(data)
  },

  /**
   * Update API key metadata
   *
   * Updates the name or expiration of an existing API key.
   * The key value itself cannot be changed.
   *
   * @param keyId - API key UUID
   * @param request - Fields to update
   * @returns Updated API key
   * @throws {ApiError} 400 - Invalid request
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Key not found
   *
   * @example
   * ```ts
   * const key = await apiKeysApi.update('key-uuid', {
   *   name: 'New Name',
   * })
   * ```
   */
  async update(keyId: string, request: UpdateApiKeyRequest): Promise<ApiKey> {
    const data = await apiClient.patch<ApiKey>(`/api-keys/${keyId}`, request)
    return apiKeySchema.parse(data)
  },

  /**
   * Delete API key
   *
   * Permanently revokes an API key. This action cannot be undone.
   * Any requests using this key will immediately fail.
   *
   * @param keyId - API key UUID to delete
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Key not found
   *
   * @example
   * ```ts
   * await apiKeysApi.delete('key-uuid')
   * ```
   */
  async delete(keyId: string): Promise<void> {
    await apiClient.delete(`/api-keys/${keyId}`)
  },

  /**
   * Regenerate API key
   *
   * Creates a new key value while preserving the key's metadata.
   * The old key value is immediately invalidated.
   *
   * @param keyId - API key UUID to regenerate
   * @returns New key with fresh value
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Key not found
   *
   * @example
   * ```ts
   * const result = await apiKeysApi.regenerate('key-uuid')
   * // IMPORTANT: Update your systems with result.key
   * ```
   */
  async regenerate(keyId: string): Promise<CreateApiKeyResponse> {
    const data = await apiClient.post<CreateApiKeyResponse>(`/api-keys/${keyId}/regenerate`)
    return createApiKeyResponseSchema.parse(data)
  },

  /**
   * Get API key usage stats for organization
   *
   * Returns aggregate statistics about API key usage.
   *
   * @param orgId - Organization UUID
   * @returns API key statistics
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden
   *
   * @example
   * ```ts
   * const stats = await apiKeysApi.getStats('org-uuid')
   * console.log(`Total keys: ${stats.total}, Active: ${stats.active}`)
   * ```
   */
  async getStats(orgId: string): Promise<ApiKeyStats> {
    const data = await apiClient.get(`/organizations/${orgId}/api-keys/stats`)
    return apiKeyStatsSchema.parse(data)
  },
}
