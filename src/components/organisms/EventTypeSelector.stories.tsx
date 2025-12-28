import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { EventType } from '@/lib/constants'
import { EventTypeSelector } from './EventTypeSelector'

const meta: Meta<typeof EventTypeSelector> = {
  title: 'Organisms/EventTypeSelector',
  component: EventTypeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showDescription: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4 bg-terminal">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EventTypeSelector>

// Wrapper component to handle state for controlled stories
function EventTypeSelectorWrapper(props: Partial<React.ComponentProps<typeof EventTypeSelector>>) {
  const [value, setValue] = useState<string>(props.value ?? '')
  return (
    <EventTypeSelector
      value={value}
      onChange={setValue as (v: EventType) => void}
      {...props}
    />
  )
}

export const Default: Story = {
  render: (args) => <EventTypeSelectorWrapper {...args} />,
  args: {
    showDescription: true,
  },
}

export const WithoutDescription: Story = {
  render: (args) => <EventTypeSelectorWrapper {...args} />,
  args: {
    showDescription: false,
  },
}

export const PreselectedValue: Story = {
  render: (args) => <EventTypeSelectorWrapper {...args} />,
  args: {
    value: 'ReputationUpdated',
    showDescription: true,
  },
}

export const AllEventTypes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="typo-ui text-terminal-dim mb-2 text-xs">ReputationUpdated</p>
        <EventTypeSelectorWrapper value="ReputationUpdated" showDescription />
      </div>
      <div>
        <p className="typo-ui text-terminal-dim mb-2 text-xs">AgentRegistered</p>
        <EventTypeSelectorWrapper value="AgentRegistered" showDescription />
      </div>
      <div>
        <p className="typo-ui text-terminal-dim mb-2 text-xs">AgentUnregistered</p>
        <EventTypeSelectorWrapper value="AgentUnregistered" showDescription />
      </div>
    </div>
  ),
}
