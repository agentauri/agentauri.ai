import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ConditionTypeSelector, type ConditionType } from './ConditionTypeSelector'

const meta = {
  title: 'Triggers/ConditionTypeSelector',
  component: ConditionTypeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConditionTypeSelector>

export default meta
type Story = StoryObj<typeof ConditionTypeSelector>

// Wrapper component to handle state
function ConditionTypeSelectorWithState({
  initialValue = '',
  showPreview = true,
}: {
  initialValue?: string
  showPreview?: boolean
}) {
  const [value, setValue] = useState<string>(initialValue)

  return (
    <div className="w-[600px] p-8 bg-background">
      <div className="space-y-4">
        <div className="typo-ui text-terminal-dim mb-4">
          Selected: <span className="text-terminal-green">{value || 'None'}</span>
        </div>
        <ConditionTypeSelector
          value={value}
          onChange={(v) => setValue(v)}
          showPreview={showPreview}
        />
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ConditionTypeSelectorWithState />,
}

export const WithoutPreview: Story = {
  render: () => <ConditionTypeSelectorWithState showPreview={false} />,
}

export const ReputationThreshold: Story = {
  render: () => <ConditionTypeSelectorWithState initialValue="reputation_threshold" />,
}

export const AgentFilter: Story = {
  render: () => <ConditionTypeSelectorWithState initialValue="agent_filter" />,
}

export const EventFilter: Story = {
  render: () => <ConditionTypeSelectorWithState initialValue="event_filter" />,
}

export const FieldComparison: Story = {
  render: () => <ConditionTypeSelectorWithState initialValue="field_comparison" />,
}

export const TimeCondition: Story = {
  render: () => <ConditionTypeSelectorWithState initialValue="time_condition" />,
}
