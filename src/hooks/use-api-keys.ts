'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiKeysApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CreateApiKeyRequest, UpdateApiKeyRequest } from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing API keys for an organization
 *
 * Returns paginated list of API keys. Key values are masked.
 * Data is cached for 30 seconds.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @param params - Optional pagination parameters
 * @returns TanStack Query result with API keys list
 *
 * @example
 * ```tsx
 * function ApiKeysList({ orgId }: { orgId: string }) {
 *   const { data, isLoading } = useApiKeys(orgId)
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <ul>
 *       {data?.data.map(key => (
 *         <li key={key.id}>{key.name} - {key.maskedKey}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useApiKeys(orgId: string | null, params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.apiKeys.list(orgId ?? ''),
    queryFn: () => apiKeysApi.list(orgId!, params),
    enabled: !!orgId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for getting API key stats for an organization
 *
 * Returns aggregate statistics about API key usage.
 * Data is cached for 1 minute.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @returns TanStack Query result with API key statistics
 *
 * @example
 * ```tsx
 * function ApiKeyStats({ orgId }: { orgId: string }) {
 *   const { data: stats } = useApiKeyStats(orgId)
 *
 *   return (
 *     <div>
 *       <p>Total keys: {stats?.total}</p>
 *       <p>Active: {stats?.active}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useApiKeyStats(orgId: string | null) {
  return useQuery({
    queryKey: queryKeys.apiKeys.stats(orgId ?? ''),
    queryFn: () => apiKeysApi.getStats(orgId!),
    enabled: !!orgId,
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook for getting a single API key
 *
 * Fetches metadata about a specific API key (not the actual key value).
 *
 * @param keyId - API key UUID. Query disabled if null.
 * @returns TanStack Query result with API key details
 *
 * @example
 * ```tsx
 * function ApiKeyDetail({ keyId }: { keyId: string }) {
 *   const { data: key } = useApiKey(keyId)
 *
 *   return (
 *     <div>
 *       <h1>{key?.name}</h1>
 *       <p>Last used: {key?.lastUsedAt}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useApiKey(keyId: string | null) {
  return useQuery({
    queryKey: queryKeys.apiKeys.detail(keyId ?? ''),
    queryFn: () => apiKeysApi.get(keyId!),
    enabled: !!keyId,
    staleTime: 30 * 1000,
  })
}

/**
 * Hook for creating an API key
 *
 * Creates a new API key for the organization.
 * The full key value is only returned once at creation.
 * Shows success/error toast notifications.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for API key creation
 *
 * @example
 * ```tsx
 * function CreateKeyForm({ orgId }: { orgId: string }) {
 *   const createKey = useCreateApiKey(orgId)
 *
 *   const handleCreate = async (name: string) => {
 *     const result = await createKey.mutateAsync({ name })
 *     // IMPORTANT: Store result.key - it won't be shown again!
 *     showKeyModal(result.key)
 *   }
 * }
 * ```
 */
export function useCreateApiKey(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateApiKeyRequest) => apiKeysApi.create(orgId, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
      toast.success(`API key "${response.apiKey.name}" created successfully`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key')
    },
  })
}

/**
 * Hook for updating an API key
 *
 * Updates the name or expiration of an existing API key.
 * The key value itself cannot be changed.
 *
 * @returns TanStack Mutation for API key update
 *
 * @example
 * ```tsx
 * function EditKeyForm({ keyId }: { keyId: string }) {
 *   const updateKey = useUpdateApiKey()
 *
 *   const handleUpdate = (name: string) => {
 *     updateKey.mutate({ keyId, request: { name } })
 *   }
 * }
 * ```
 */
export function useUpdateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ keyId, request }: { keyId: string; request: UpdateApiKeyRequest }) =>
      apiKeysApi.update(keyId, request),
    onSuccess: (apiKey) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
      toast.success(`API key "${apiKey.name}" updated successfully`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update API key')
    },
  })
}

/**
 * Hook for deleting an API key
 *
 * Permanently revokes an API key. This action cannot be undone.
 * Any requests using this key will immediately fail.
 *
 * @returns TanStack Mutation for API key deletion
 *
 * @example
 * ```tsx
 * function DeleteKeyButton({ keyId }: { keyId: string }) {
 *   const deleteKey = useDeleteApiKey()
 *
 *   return (
 *     <Button
 *       variant="danger"
 *       onClick={() => deleteKey.mutate(keyId)}
 *       disabled={deleteKey.isPending}
 *     >
 *       Revoke Key
 *     </Button>
 *   )
 * }
 * ```
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (keyId: string) => apiKeysApi.delete(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
      toast.success('API key deleted successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key')
    },
  })
}

/**
 * Hook for regenerating an API key
 *
 * Creates a new key value while preserving the key's metadata.
 * The old key value is immediately invalidated.
 *
 * @returns TanStack Mutation for API key regeneration
 *
 * @example
 * ```tsx
 * function RegenerateKeyButton({ keyId }: { keyId: string }) {
 *   const regenerateKey = useRegenerateApiKey()
 *
 *   const handleRegenerate = async () => {
 *     const result = await regenerateKey.mutateAsync(keyId)
 *     // IMPORTANT: Update your systems with result.key
 *     showKeyModal(result.key)
 *   }
 * }
 * ```
 */
export function useRegenerateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (keyId: string) => apiKeysApi.regenerate(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
      toast.success('API key regenerated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to regenerate API key')
    },
  })
}
