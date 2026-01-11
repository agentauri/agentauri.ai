/**
 * Custom hook for managing trigger form state
 * Encapsulates form logic and reduces component complexity
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

export type TriggerFormStep = 'basic' | 'conditions' | 'actions' | 'review'

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

  // Validation for each step
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

  // Navigate to next step with validation
  const goToNextStep = async () => {
    const isValid = await validateStep(steps.currentStep)
    if (isValid) {
      steps.next()
    } else {
      toast.error('Please fix the errors before continuing')
    }
  }

  return {
    form,
    steps,
    onSubmit,
    goToNextStep,
    validateStep,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    mode,
  }
}
