import { apiClient } from '@/lib/api-client'
import {
  type ApiKey,
  apiKeyListResponseSchema,
  apiKeySchema,
  type CreateApiKeyRequest,
  type CreateApiKeyResponse,
  createApiKeyResponseSchema,
  type UpdateApiKeyRequest,
} from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * API Keys API client
 */
export const apiKeysApi = {
  /**
   * List API keys for organization
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
   */
  async get(keyId: string): Promise<ApiKey> {
    const data = await apiClient.get<ApiKey>(`/api-keys/${keyId}`)
    return apiKeySchema.parse(data)
  },

  /**
   * Create new API key
   */
  async create(orgId: string, request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const data = await apiClient.post<CreateApiKeyResponse>(
      `/organizations/${orgId}/api-keys`,
      request
    )
    return createApiKeyResponseSchema.parse(data)
  },

  /**
   * Update API key
   */
  async update(keyId: string, request: UpdateApiKeyRequest): Promise<ApiKey> {
    const data = await apiClient.patch<ApiKey>(`/api-keys/${keyId}`, request)
    return apiKeySchema.parse(data)
  },

  /**
   * Delete API key
   */
  async delete(keyId: string): Promise<void> {
    await apiClient.delete(`/api-keys/${keyId}`)
  },

  /**
   * Regenerate API key
   */
  async regenerate(keyId: string): Promise<CreateApiKeyResponse> {
    const data = await apiClient.post<CreateApiKeyResponse>(`/api-keys/${keyId}/regenerate`)
    return createApiKeyResponseSchema.parse(data)
  },
}
