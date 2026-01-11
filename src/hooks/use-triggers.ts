/**
 * Trigger hooks
 *
 * React hooks for managing automation triggers.
 * Provides CRUD operations, enable/disable toggles, and test execution.
 *
 * @module hooks/use-triggers
 */

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
 *
 * Returns paginated list of automation triggers.
 * Data is cached for 30 seconds.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @param params - Optional pagination and filter parameters
 * @returns TanStack Query result with triggers list
 *
 * @example
 * ```tsx
 * function TriggersList({ orgId }: { orgId: string }) {
 *   const { data, isLoading } = useTriggers(orgId, { enabled: true })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <ul>
 *       {data?.data.map(trigger => (
 *         <li key={trigger.id}>{trigger.name}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
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
 *
 * Fetches detailed information including conditions and actions.
 *
 * @param triggerId - Trigger UUID. Query disabled if null.
 * @returns TanStack Query result with trigger details
 *
 * @example
 * ```tsx
 * function TriggerDetail({ triggerId }: { triggerId: string }) {
 *   const { data: trigger } = useTrigger(triggerId)
 *
 *   return (
 *     <div>
 *       <h1>{trigger?.name}</h1>
 *       <p>Enabled: {trigger?.enabled ? 'Yes' : 'No'}</p>
 *       <p>Conditions: {trigger?.conditions.length}</p>
 *     </div>
 *   )
 * }
 * ```
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
 *
 * Creates an automation trigger for the organization.
 * Shows success/error toast notifications.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for trigger creation
 *
 * @example
 * ```tsx
 * function CreateTriggerForm({ orgId }: { orgId: string }) {
 *   const createTrigger = useCreateTrigger(orgId)
 *
 *   const handleSubmit = (data: CreateTriggerRequest) => {
 *     createTrigger.mutate(data, {
 *       onSuccess: (trigger) => router.push(`/triggers/${trigger.id}`)
 *     })
 *   }
 * }
 * ```
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
 *
 * Updates trigger name, conditions, actions, or enabled state.
 * Shows success/error toast notifications.
 *
 * @param triggerId - Trigger UUID to update
 * @returns TanStack Mutation for trigger update
 *
 * @example
 * ```tsx
 * function EditTriggerForm({ triggerId }: { triggerId: string }) {
 *   const updateTrigger = useUpdateTrigger(triggerId)
 *
 *   const handleSubmit = (data: UpdateTriggerRequest) => {
 *     updateTrigger.mutate(data)
 *   }
 * }
 * ```
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
 *
 * Permanently deletes a trigger. Execution history is preserved.
 * Shows success/error toast notifications.
 *
 * @returns TanStack Mutation for trigger deletion
 *
 * @example
 * ```tsx
 * function DeleteTriggerButton({ triggerId }: { triggerId: string }) {
 *   const deleteTrigger = useDeleteTrigger()
 *
 *   return (
 *     <Button
 *       variant="danger"
 *       onClick={() => deleteTrigger.mutate(triggerId)}
 *       disabled={deleteTrigger.isPending}
 *     >
 *       Delete Trigger
 *     </Button>
 *   )
 * }
 * ```
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
 *
 * Activates a disabled trigger so it executes when events match.
 * Shows success/error toast notifications.
 *
 * @returns TanStack Mutation for trigger enabling
 *
 * @example
 * ```tsx
 * function EnableButton({ triggerId }: { triggerId: string }) {
 *   const enableTrigger = useEnableTrigger()
 *
 *   return (
 *     <Button onClick={() => enableTrigger.mutate(triggerId)}>
 *       Enable
 *     </Button>
 *   )
 * }
 * ```
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
 *
 * Deactivates a trigger so it won't execute even when events match.
 * Shows success/error toast notifications.
 *
 * @returns TanStack Mutation for trigger disabling
 *
 * @example
 * ```tsx
 * function DisableButton({ triggerId }: { triggerId: string }) {
 *   const disableTrigger = useDisableTrigger()
 *
 *   return (
 *     <Button onClick={() => disableTrigger.mutate(triggerId)}>
 *       Disable
 *     </Button>
 *   )
 * }
 * ```
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
 *
 * Executes a trigger in test mode without consuming credits
 * or performing actual actions.
 *
 * @returns TanStack Mutation for trigger testing
 *
 * @example
 * ```tsx
 * function TestButton({ triggerId }: { triggerId: string }) {
 *   const testTrigger = useTestTrigger()
 *
 *   return (
 *     <Button
 *       onClick={() => testTrigger.mutate(triggerId)}
 *       disabled={testTrigger.isPending}
 *     >
 *       Test Trigger
 *     </Button>
 *   )
 * }
 * ```
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
 *
 * Convenience hook that enables or disables a trigger based
 * on its current state.
 *
 * @returns Object with toggle function and isPending state
 *
 * @example
 * ```tsx
 * function ToggleSwitch({ trigger }: { trigger: Trigger }) {
 *   const { toggle, isPending } = useToggleTrigger()
 *
 *   return (
 *     <Switch
 *       checked={trigger.enabled}
 *       onChange={() => toggle(trigger)}
 *       disabled={isPending}
 *     />
 *   )
 * }
 * ```
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
