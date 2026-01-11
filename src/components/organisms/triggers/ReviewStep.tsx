/**
 * ReviewStep
 *
 * Step 4 of the trigger creation wizard. Displays a summary of all
 * configured trigger settings for review before submission.
 *
 * @module components/organisms/triggers/ReviewStep
 *
 * @example
 * ```tsx
 * <ReviewStep form={form} />
 * ```
 */
'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Box } from '@/components/atoms/box'
import type { Registry } from '@/lib/constants'
import { ChainBadge, RegistryBadge } from '@/components/molecules'
import type { CreateTriggerFormValues } from '@/lib/validations/trigger'

/**
 * Props for the ReviewStep component.
 */
interface ReviewStepProps {
  /** React Hook Form instance for the trigger form */
  form: UseFormReturn<CreateTriggerFormValues>
}

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues()

  return (
    <Box variant="secondary" padding="md" className="space-y-6">
      <div className="typo-ui text-terminal-green glow mb-4">
        [4] REVIEW & SUBMIT
      </div>

      <div className="space-y-4">
        <Box variant="subtle" padding="md">
          <div className="typo-ui text-terminal-green mb-2">&gt; BASIC INFO</div>
          <div className="typo-ui text-terminal-bright mb-2">{values.name}</div>
          {values.description && (
            <div className="typo-ui text-terminal-dim mb-2">
              {values.description}
            </div>
          )}
          <div className="flex gap-2">
            <ChainBadge chainId={values.chainId as number} />
            <RegistryBadge registry={values.registry as Registry} />
          </div>
        </Box>

        <Box variant="subtle" padding="md">
          <div className="typo-ui text-terminal-green mb-2">
            &gt; CONDITIONS ({values.conditions.length})
          </div>
          {values.conditions.map((condition: Record<string, unknown>, index: number) => (
            <div key={index} className="typo-ui text-terminal-dim mb-1">
              [{index + 1}] {String(condition.field)} {String(condition.operator)} {String(condition.value)}
            </div>
          ))}
        </Box>

        <Box variant="subtle" padding="md">
          <div className="typo-ui text-terminal-green mb-2">
            &gt; ACTIONS ({values.actions.length})
          </div>
          {values.actions.map((action: Record<string, unknown>, index: number) => (
            <div key={index} className="typo-ui text-terminal-dim mb-1">
              [{index + 1}] {String(action.actionType).toUpperCase()} (Priority: {String(action.priority)})
            </div>
          ))}
        </Box>
      </div>
    </Box>
  )
}
