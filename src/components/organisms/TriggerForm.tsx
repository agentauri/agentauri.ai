'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { Form } from '@/components/atoms/form'
import { FormStepIndicator } from '@/components/molecules/FormStepIndicator'
import { useCreateTrigger, useUpdateTrigger } from '@/hooks'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import {
  createTriggerRequestSchema,
  type CreateTriggerRequest,
  type Trigger,
} from '@/lib/validations/trigger'
import { JsonEditorToggle, type EditorMode } from './JsonEditorToggle'
import { TriggerJsonEditor } from './TriggerJsonEditor'
import { BasicInfoStep } from './triggers/BasicInfoStep'
import { ConditionsStep } from './triggers/ConditionsStep'
import { ActionsStep } from './triggers/ActionsStep'
import { ReviewStep } from './triggers/ReviewStep'

interface TriggerFormProps {
  organizationId: string
  trigger?: Trigger
  mode?: 'create' | 'edit'
}

type FormStep = 'basic' | 'conditions' | 'actions' | 'review'

const STEPS: FormStep[] = ['basic', 'conditions', 'actions', 'review']

export function TriggerForm({ organizationId, trigger, mode = 'create' }: TriggerFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FormStep>('basic')
  const [editorMode, setEditorMode] = useState<EditorMode>('ui')

  const createMutation = useCreateTrigger(organizationId)
  const updateMutation = useUpdateTrigger(trigger?.id ?? '')

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

  const onSubmit = async (data: CreateTriggerRequest) => {
    try {
      if (mode === 'create') {
        const result = await createMutation.mutateAsync(data)
        router.push(`/dashboard/triggers/${result.id}`)
      } else {
        await updateMutation.mutateAsync(data)
        router.push(`/dashboard/triggers/${trigger?.id}`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const currentStepIndex = STEPS.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === STEPS.length - 1

  const goToNextStep = () => {
    const nextStep = STEPS[currentStepIndex + 1]
    if (nextStep) setCurrentStep(nextStep)
  }

  const goToPreviousStep = () => {
    const prevStep = STEPS[currentStepIndex - 1]
    if (prevStep) setCurrentStep(prevStep)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Editor Mode Toggle */}
        <Box variant="default" padding="md" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="typo-ui text-terminal-green glow">
            &gt; TRIGGER EDITOR
          </div>
          <JsonEditorToggle mode={editorMode} onModeChange={setEditorMode} />
        </Box>

        {/* Progress Indicator - Only show in UI mode */}
        {editorMode === 'ui' && (
          <FormStepIndicator
            steps={[
              { value: 'basic', label: 'Basic Info' },
              { value: 'conditions', label: 'Conditions' },
              { value: 'actions', label: 'Actions' },
              { value: 'review', label: 'Review' }
            ]}
            currentStep={currentStep}
          />
        )}

        {/* UI Mode - Multi-step form */}
        {editorMode === 'ui' && currentStep === 'basic' && <BasicInfoStep form={form} />}
        {editorMode === 'ui' && currentStep === 'conditions' && <ConditionsStep form={form} />}
        {editorMode === 'ui' && currentStep === 'actions' && <ActionsStep form={form} />}
        {editorMode === 'ui' && currentStep === 'review' && <ReviewStep form={form} />}

        {/* JSON Mode - JSON Editor */}
        {editorMode === 'json' && (
          <TriggerJsonEditor
            value={form.getValues() as CreateTriggerRequest}
            onChange={(value) => form.reset(value)}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between border-t-2 border-terminal pt-6">
          {editorMode === 'ui' ? (
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className="typo-ui"
            >
              <Icon name="chevron-left" size="sm" className="mr-1" />
              PREVIOUS
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/triggers')}
              className="typo-ui"
            >
              <Icon name="close" size="sm" className="mr-1" />
              CANCEL
            </Button>

            {editorMode === 'ui' && !isLastStep && (
              <Button type="button" onClick={goToNextStep} className="typo-ui">
                NEXT
                <Icon name="chevron-right" size="sm" className="ml-1" />
              </Button>
            )}

            {(editorMode === 'json' || isLastStep) && (
              <Button type="submit" disabled={isPending} className="typo-ui">
                {isPending
                  ? '[SAVING...]'
                  : mode === 'create'
                    ? '[CREATE TRIGGER]'
                    : '[UPDATE TRIGGER]'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
