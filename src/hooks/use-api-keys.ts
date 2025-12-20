'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiKeysApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CreateApiKeyRequest, UpdateApiKeyRequest } from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing API keys for an organization
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
 * Hook for getting a single API key
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
