'use client'

import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { FormField, FormItem, FormMessage } from '@/components/atoms/form'
import { ConditionBuilder } from '../ConditionBuilder'

interface ConditionsStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
}

export function ConditionsStep({ form }: ConditionsStepProps) {
  return (
    <Box variant="secondary" padding="md" className="space-y-6">
      <div className="typo-ui text-terminal-green glow mb-4">
        [2] CONDITIONS
      </div>
      <p className="typo-ui text-terminal-dim">
        Define conditions that events must match to trigger actions (minimum 1 required)
      </p>

      <FormField
        control={form.control}
        name="conditions"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-4">
              {field.value?.map((condition: Record<string, unknown>, index: number) => (
                <ConditionBuilder
                  key={index}
                  condition={{ ...condition, tempId: `condition-${index}` }}
                  onChange={(updated) => {
                    const newConditions = [...(field.value ?? [])]
                    const { tempId, id, triggerId, createdAt, ...conditionData } = updated
                    newConditions[index] = {
                      conditionType: conditionData.conditionType ?? '',
                      field: conditionData.field ?? '',
                      operator: conditionData.operator ?? 'eq',
                      value: conditionData.value ?? '',
                      config: conditionData.config ?? {},
                    }
                    field.onChange(newConditions)
                  }}
                  onRemove={() => {
                    const newConditions = field.value?.filter((_: unknown, i: number) => i !== index) ?? []
                    field.onChange(newConditions)
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
                  { conditionType: '', field: '', operator: 'eq', value: '', config: {} },
                ])
              }}
              className="typo-ui mt-4"
            >
              <Icon name="add" size="sm" className="mr-1" />
              ADD CONDITION
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </Box>
  )
}
