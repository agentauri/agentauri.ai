'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { FormField, FormItem, FormMessage } from '@/components/atoms/form'
import { ActionBuilder } from '../ActionBuilder'
import type { CreateTriggerFormValues } from '@/lib/validations/trigger'

interface ActionsStepProps {
  form: UseFormReturn<CreateTriggerFormValues>
}

export function ActionsStep({ form }: ActionsStepProps) {
  return (
    <Box variant="secondary" padding="md" className="space-y-6">
      <div className="typo-ui text-terminal-green glow mb-4">
        [3] ACTIONS
      </div>
      <p className="typo-ui text-terminal-dim">
        Define actions to execute when conditions match (minimum 1 required)
      </p>

      <FormField
        control={form.control}
        name="actions"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-4">
              {field.value?.map((action: Record<string, unknown>, index: number) => (
                <ActionBuilder
                  key={index}
                  action={{ ...action, tempId: `action-${index}` }}
                  onChange={(updated) => {
                    const newActions = [...(field.value ?? [])]
                    const { tempId, id, triggerId, createdAt, ...actionData } = updated
                    newActions[index] = {
                      actionType: actionData.actionType ?? 'telegram',
                      priority: actionData.priority ?? 0,
                      config: actionData.config ?? {},
                    }
                    field.onChange(newActions)
                  }}
                  onRemove={() => {
                    const newActions = field.value?.filter((_: unknown, i: number) => i !== index) ?? []
                    field.onChange(newActions)
                  }}
                  canRemove={(field.value?.length ?? 0) > 1}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                field.onChange([
                  ...(field.value ?? []),
                  { actionType: 'telegram', priority: 0, config: {} },
                ])
              }}
              className="typo-ui mt-4"
            >
              <Icon name="add" size="sm" className="mr-1" />
              ADD ACTION
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </Box>
  )
}
