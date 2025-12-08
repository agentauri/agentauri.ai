import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ConditionBuilder } from './ConditionBuilder'
import type { TriggerCondition } from '@/lib/validations/trigger'

const meta = {
  title: 'Triggers/ConditionBuilder',
  component: ConditionBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Builder component for creating trigger conditions. Supports various operators and condition types for flexible event filtering.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ConditionBuilder>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty condition ready to be configured.
 * Shows the default state with all fields blank.
 */
export const Empty: Story = {
  args: {
    condition: {
      tempId: 'condition-1',
      conditionType: '',
      field: '',
      operator: 'eq',
      value: '',
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Reputation threshold condition.
 * Triggers when reputation score exceeds a value.
 */
export const ReputationThreshold: Story = {
  args: {
    condition: {
      tempId: 'condition-1',
      conditionType: 'reputation_threshold',
      field: 'reputation_score',
      operator: 'gt',
      value: '800',
      config: { threshold: 800 },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Agent filter condition.
 * Matches specific agent addresses from a whitelist.
 */
export const AgentFilter: Story = {
  args: {
    condition: {
      tempId: 'condition-2',
      conditionType: 'agent_filter',
      field: 'agent_address',
      operator: 'in',
      value: '0x123...,0x456...,0x789...',
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Event filter condition.
 * Filters events by type or name.
 */
export const EventFilter: Story = {
  args: {
    condition: {
      tempId: 'condition-3',
      conditionType: 'event_filter',
      field: 'event_type',
      operator: 'eq',
      value: 'ReputationUpdated',
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Field comparison with "contains" operator.
 * Useful for text matching in metadata fields.
 */
export const TextContains: Story = {
  args: {
    condition: {
      tempId: 'condition-4',
      conditionType: 'field_comparison',
      field: 'metadata.description',
      operator: 'contains',
      value: 'critical',
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Range condition with "less than" operator.
 * For monitoring low reputation scores.
 */
export const LowReputationWarning: Story = {
  args: {
    condition: {
      tempId: 'condition-5',
      conditionType: 'reputation_threshold',
      field: 'reputation_score',
      operator: 'lt',
      value: '100',
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Condition that cannot be removed.
 * Shows disabled remove button when it's the last condition.
 */
export const CannotRemove: Story = {
  args: {
    condition: {
      tempId: 'condition-6',
      conditionType: 'reputation_threshold',
      field: 'reputation_score',
      operator: 'gte',
      value: '500',
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: false,
  },
}

/**
 * Interactive example with state management.
 * Demonstrates real-time updates as fields are edited.
 */
export const Interactive = {
  render: () => {
    const [condition, setCondition] = useState<Partial<TriggerCondition> & { tempId?: string }>({
      tempId: 'interactive-1',
      conditionType: 'reputation_threshold',
      field: 'reputation_score',
      operator: 'gt',
      value: '750',
      config: {},
    })

    return (
      <div className="space-y-4">
        <ConditionBuilder
          condition={condition}
          onChange={setCondition}
          onRemove={() => console.log('Remove clicked')}
          canRemove={true}
        />

        <div className="border-2 border-terminal bg-terminal/30 p-4">
          <div className="typo-ui text-terminal-green mb-2">&gt; Current State:</div>
          <pre className="typo-code text-terminal-dim">
            {JSON.stringify(condition, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

/**
 * Multiple conditions in a list.
 * Shows how conditions would appear in a form.
 */
export const MultipleConditions = {
  render: () => {
    const [conditions, setConditions] = useState<
      Array<Partial<TriggerCondition> & { tempId?: string }>
    >([
      {
        tempId: 'multi-1',
        conditionType: 'reputation_threshold',
        field: 'reputation_score',
        operator: 'gt',
        value: '500',
        config: {},
      },
      {
        tempId: 'multi-2',
        conditionType: 'agent_filter',
        field: 'agent_address',
        operator: 'eq',
        value: '0x1234567890abcdef',
        config: {},
      },
      {
        tempId: 'multi-3',
        conditionType: 'event_filter',
        field: 'event_type',
        operator: 'in',
        value: 'ReputationUpdated,ReputationCreated',
        config: {},
      },
    ])

    return (
      <div className="space-y-4">
        <div className="typo-ui text-terminal-green glow mb-4">
          [CONDITIONS] ({conditions.length})
        </div>

        {conditions.map((condition, index) => (
          <ConditionBuilder
            key={condition.tempId}
            condition={condition}
            onChange={(updated) => {
              const newConditions = [...conditions]
              newConditions[index] = updated
              setConditions(newConditions)
            }}
            onRemove={() => {
              setConditions(conditions.filter((_, i) => i !== index))
            }}
            canRemove={conditions.length > 1}
          />
        ))}
      </div>
    )
  },
}
