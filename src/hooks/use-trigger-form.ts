/**
 * Custom hook for managing trigger form state
 *
 * Encapsulates form logic and reduces component complexity.
 * Manages multi-step wizard flow with validation.
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { handleError } from '@/lib/error-handler'
import { useFormSteps } from './use-form-steps'
import {
  createTriggerRequestSchema,
  type CreateTriggerRequest,
  type Trigger,
} from '@/lib/validations/trigger'
import { useCreateTrigger, useUpdateTrigger } from './use-triggers'

/**
 * Trigger form step identifiers
 */
export type TriggerFormStep = 'basic' | 'conditions' | 'actions' | 'review'

/**
 * Hook for managing trigger creation/edit form
 *
 * Provides complete form state management for the trigger wizard:
 * - React Hook Form integration with Zod validation
 * - Multi-step navigation with per-step validation
 * - Create and edit modes
 * - Automatic navigation on success
 *
 * @param organizationId - Organization UUID for the trigger
 * @param trigger - Existing trigger for edit mode (optional)
 * @param mode - 'create' or 'edit' mode (default: 'create')
 * @returns Form state and control functions
 *
 * @example
 * ```tsx
 * function TriggerWizard({ orgId }: { orgId: string }) {
 *   const {
 *     form,
 *     steps,
 *     onSubmit,
 *     goToNextStep,
 *     isSubmitting,
 *   } = useTriggerForm(orgId)
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       {steps.currentStep === 'basic' && <BasicStep form={form} />}
 *       {steps.currentStep === 'conditions' && <ConditionsStep form={form} />}
 *       {steps.currentStep === 'actions' && <ActionsStep form={form} />}
 *       {steps.currentStep === 'review' && <ReviewStep form={form} />}
 *
 *       <div>
 *         <Button onClick={steps.previous} disabled={steps.isFirst}>
 *           Previous
 *         </Button>
 *         {steps.isLast ? (
 *           <Button type="submit" disabled={isSubmitting}>
 *             Create Trigger
 *           </Button>
 *         ) : (
 *           <Button onClick={goToNextStep}>Next</Button>
 *         )}
 *       </div>
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Edit mode
 * function EditTrigger({ orgId, trigger }: Props) {
 *   const triggerForm = useTriggerForm(orgId, trigger, 'edit')
 *   // ... form renders with trigger values pre-filled
 * }
 * ```
 */
export function useTriggerForm(organizationId: string, trigger?: Trigger, mode: 'create' | 'edit' = 'create') {
  const router = useRouter()
  const createMutation = useCreateTrigger(organizationId)
  const updateMutation = useUpdateTrigger(trigger?.id ?? '')

  // Form state
  const form = useForm({
    resolver: zodResolver(createTriggerRequestSchema),
    defaultValues: {
      name: trigger?.name ?? '',
      description: trigger?.description ?? '',
      chainId: trigger?.chainId ?? SUPPORTED_CHAINS.MAINNET,
      registry: trigger?.registry ?? 'reputation',
      enabled: trigger?.enabled ?? true,
      isStateful: trigger?.isStateful ?? false,
      conditions: trigger?.conditions?.map((c) => ({
        conditionType: c.conditionType,
        field: c.field,
        operator: c.operator,
        value: c.value,
        config: c.config,
      })) ?? [{ conditionType: '', field: '', operator: 'eq', value: '', config: {} }],
      actions: trigger?.actions?.map((a) => ({
        actionType: a.actionType,
        priority: a.priority,
        config: a.config,
      })) ?? [{ actionType: 'telegram', priority: 0, config: {} }],
    },
  })

  // Step management
  const steps = useFormSteps<TriggerFormStep>(['basic', 'conditions', 'actions', 'review'])

  // Submit handler
  const onSubmit = async (data: CreateTriggerRequest) => {
    try {
      if (mode === 'create') {
        const result = await createMutation.mutateAsync(data)
        toast.success('Trigger created successfully')
        router.push(`/dashboard/triggers/${result.id}`)
      } else {
        await updateMutation.mutateAsync(data)
        toast.success('Trigger updated successfully')
        router.push(`/dashboard/triggers/${trigger?.id}`)
      }
    } catch (error) {
      const message = handleError(error, { log: true })
      toast.error(message)
    }
  }

  /**
   * Validate fields for a specific step
   *
   * @param step - Step to validate
   * @returns Promise resolving to true if valid
   */
  const validateStep = async (step: TriggerFormStep): Promise<boolean> => {
    const fieldsMap: Record<TriggerFormStep, Array<keyof CreateTriggerRequest>> = {
      basic: ['name', 'chainId', 'registry'],
      conditions: ['conditions'],
      actions: ['actions'],
      review: [], // No validation needed for review
    }

    const fields = fieldsMap[step]
    const result = await form.trigger(fields)
    return result
  }

  /**
   * Navigate to next step with validation
   *
   * Shows error toast if current step validation fails.
   */
  const goToNextStep = async () => {
    const isValid = await validateStep(steps.currentStep)
    if (isValid) {
      steps.next()
    } else {
      toast.error('Please fix the errors before continuing')
    }
  }

  return {
    /** React Hook Form instance */
    form,
    /** Step navigation state and controls */
    steps,
    /** Form submit handler */
    onSubmit,
    /** Navigate to next step with validation */
    goToNextStep,
    /** Validate a specific step */
    validateStep,
    /** Whether form submission is in progress */
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    /** Current form mode */
    mode,
  }
}
