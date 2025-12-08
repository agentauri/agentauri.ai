'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { triggersApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type {
  CreateTriggerRequest,
  Trigger,
  TriggerFilters,
  UpdateTriggerRequest,
} from '@/lib/validations'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for listing triggers for an organization
 */
export function useTriggers(
  orgId: string | null,
  params?: PaginationParams & TriggerFilters
) {
  return useQuery({
    queryKey: queryKeys.triggers.list(orgId ?? '', params),
    queryFn: () => triggersApi.list(orgId!, params),
    enabled: !!orgId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for getting a single trigger by ID
 */
export function useTrigger(triggerId: string | null) {
  return useQuery({
    queryKey: queryKeys.triggers.detail(triggerId ?? ''),
    queryFn: () => triggersApi.get(triggerId!),
    enabled: !!triggerId,
    staleTime: 30 * 1000,
  })
}

/**
 * Hook for creating a new trigger
 */
export function useCreateTrigger(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateTriggerRequest) => triggersApi.create(orgId, request),
    onSuccess: (trigger) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
      toast.success(`Trigger "${trigger.name}" created successfully`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create trigger')
    },
  })
}

/**
 * Hook for updating a trigger
 */
export function useUpdateTrigger(triggerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateTriggerRequest) => triggersApi.update(triggerId, request),
    onSuccess: (trigger) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.detail(triggerId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      toast.success(`Trigger "${trigger.name}" updated successfully`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update trigger')
    },
  })
}

/**
 * Hook for deleting a trigger
 */
export function useDeleteTrigger() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (triggerId: string) => triggersApi.delete(triggerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
      toast.success('Trigger deleted successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete trigger')
    },
  })
}

/**
 * Hook for enabling a trigger
 */
export function useEnableTrigger() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (triggerId: string) => triggersApi.enable(triggerId),
    onSuccess: (trigger) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.detail(trigger.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      toast.success(`Trigger "${trigger.name}" enabled`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to enable trigger')
    },
  })
}

/**
 * Hook for disabling a trigger
 */
export function useDisableTrigger() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (triggerId: string) => triggersApi.disable(triggerId),
    onSuccess: (trigger) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.detail(trigger.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.triggers.all })
      toast.success(`Trigger "${trigger.name}" disabled`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to disable trigger')
    },
  })
}

/**
 * Hook for testing a trigger (dry run)
 */
export function useTestTrigger() {
  return useMutation({
    mutationFn: (triggerId: string) => triggersApi.test(triggerId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Trigger test passed')
      } else {
        toast.error(`Trigger test failed: ${result.error ?? 'Unknown error'}`)
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to test trigger')
    },
  })
}

/**
 * Hook for toggling trigger enabled state
 */
export function useToggleTrigger() {
  const enableMutation = useEnableTrigger()
  const disableMutation = useDisableTrigger()

  return {
    toggle: (trigger: Trigger) => {
      if (trigger.enabled) {
        return disableMutation.mutateAsync(trigger.id)
      }
      return enableMutation.mutateAsync(trigger.id)
    },
    isPending: enableMutation.isPending || disableMutation.isPending,
  }
}
