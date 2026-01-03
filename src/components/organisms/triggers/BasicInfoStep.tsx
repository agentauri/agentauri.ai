'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Box } from '@/components/atoms/box'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Textarea } from '@/components/atoms/textarea'
import { CHAIN_NAMES, TESTNET_CHAINS } from '@/lib/constants'
import type { CreateTriggerFormValues } from '@/lib/validations/trigger'

interface BasicInfoStepProps {
  form: UseFormReturn<CreateTriggerFormValues>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <Box variant="secondary" padding="md" className="space-y-6">
      <div className="typo-ui text-terminal-green glow mb-4">
        [1] BASIC INFORMATION
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="typo-ui">TRIGGER NAME</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., High Reputation Alert"
                className="typo-ui"
              />
            </FormControl>
            <FormDescription className="typo-ui">
              A descriptive name for this trigger (2-100 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="typo-ui">DESCRIPTION (OPTIONAL)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ''}
                placeholder="What does this trigger do?"
                className="typo-ui font-mono"
                rows={3}
              />
            </FormControl>
            <FormDescription className="typo-ui">
              Optional description (max 500 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chainId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="typo-ui">BLOCKCHAIN</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number.parseInt(value, 10))}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="typo-ui">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(TESTNET_CHAINS).map(([, id]) => (
                  <SelectItem key={id} value={id.toString()} className="typo-ui">
                    {CHAIN_NAMES[id] ?? `Chain ${id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="typo-ui">
              Select which blockchain to monitor for events
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isStateful"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="w-4 h-4"
              />
            </FormControl>
            <div className="flex-1">
              <FormLabel className="typo-ui">STATEFUL TRIGGER</FormLabel>
              <FormDescription className="typo-ui">
                Remember past events to avoid duplicate processing
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </Box>
  )
}
