/**
 * ConditionTypeSelector
 *
 * A dropdown selector for choosing condition types in trigger configuration.
 * Displays available condition types with icons, descriptions, and usage examples.
 *
 * @module components/organisms/ConditionTypeSelector
 *
 * @example
 * ```tsx
 * <ConditionTypeSelector
 *   value="reputation_threshold"
 *   onChange={(type) => console.log('Selected:', type)}
 *   showPreview={true}
 * />
 * ```
 */
'use client'

import { Box } from '@/components/atoms/box'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Icon, type IconName } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Available condition types for trigger configuration */
export type ConditionType = 'event_filter' | 'agent_filter' | 'reputation_threshold' | 'field_comparison' | 'time_condition'

/**
 * Information about a condition type including label, description, and example.
 */
interface ConditionTypeInfo {
  value: ConditionType
  label: string
  description: string
  exampleField: string
  exampleOperator: string
  exampleValue: string
  icon: IconName
}

const CONDITION_TYPES: ConditionTypeInfo[] = [
  {
    value: 'reputation_threshold',
    label: 'Reputation Threshold',
    description: 'Trigger when reputation score meets a condition',
    exampleField: 'reputation_score',
    exampleOperator: 'gt',
    exampleValue: '800',
    icon: 'chart',
  },
  {
    value: 'agent_filter',
    label: 'Agent Filter',
    description: 'Filter events by specific agent address(es)',
    exampleField: 'agent_address',
    exampleOperator: 'in',
    exampleValue: '0x123...,0x456...',
    icon: 'robot',
  },
  {
    value: 'event_filter',
    label: 'Event Filter',
    description: 'Filter by event type or name',
    exampleField: 'event_type',
    exampleOperator: 'eq',
    exampleValue: 'ReputationUpdated',
    icon: 'lightning',
  },
  {
    value: 'field_comparison',
    label: 'Field Comparison',
    description: 'Compare any field value with a condition',
    exampleField: 'metadata.score',
    exampleOperator: 'gte',
    exampleValue: '500',
    icon: 'search',
  },
  {
    value: 'time_condition',
    label: 'Time Condition',
    description: 'Filter events by timestamp',
    exampleField: 'event_timestamp',
    exampleOperator: 'gt',
    exampleValue: '1704067200',
    icon: 'clock',
  },
]

/**
 * Props for the ConditionTypeSelector component.
 */
interface ConditionTypeSelectorProps {
  /** Currently selected condition type value */
  value: string
  /** Callback when a condition type is selected */
  onChange: (value: ConditionType) => void
  /** Additional CSS classes */
  className?: string
  /** Whether to show the preview/help box below the selector */
  showPreview?: boolean
}

export function ConditionTypeSelector({
  value,
  onChange,
  className,
  showPreview = true,
}: ConditionTypeSelectorProps) {
  const selectedType = CONDITION_TYPES.find((t) => t.value === value)

  return (
    <div className={cn('space-y-3', className)}>
      <Select value={value} onValueChange={(v) => onChange(v as ConditionType)}>
        <SelectTrigger className="typo-ui">
          <SelectValue placeholder="Select condition type..." />
        </SelectTrigger>
        <SelectContent>
          {CONDITION_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value} className="typo-ui">
              <div className="flex items-center gap-2">
                <Icon name={type.icon} size="sm" />
                <span>{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Preview/Help */}
      {showPreview && selectedType && (
        <Box variant="subtle" padding="sm" className="space-y-2">
          <div className="flex items-start gap-2">
            <Icon name={selectedType.icon} size="md" />
            <div className="flex-1 space-y-1">
              <div className="typo-ui text-terminal-green">
                {selectedType.label}
              </div>
              <div className="typo-ui text-terminal-dim">
                {selectedType.description}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-terminal-dim/50">
            <div className="typo-ui text-terminal-dim mb-1">&gt; Example:</div>
            <div className="typo-code text-terminal-bright bg-terminal/30 p-2 border border-terminal-dim">
              <span className="text-terminal-green">{selectedType.exampleField}</span>
              {' '}
              <span className="text-terminal-yellow">{selectedType.exampleOperator}</span>
              {' '}
              <span className="text-terminal-blue">"{selectedType.exampleValue}"</span>
            </div>
          </div>
        </Box>
      )}
    </div>
  )
}

/**
 * Helper function to get condition type information by type value.
 * @param type - The condition type to look up
 * @returns The condition type info or undefined if not found
 */
export function getConditionTypeInfo(type: ConditionType): ConditionTypeInfo | undefined {
  return CONDITION_TYPES.find((t) => t.value === type)
}

// Export types list for external use
export { CONDITION_TYPES }
