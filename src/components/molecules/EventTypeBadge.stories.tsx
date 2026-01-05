import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EventTypeBadge } from './EventTypeBadge'

const meta: Meta<typeof EventTypeBadge> = {
  title: 'Molecules/EventTypeBadge',
  component: EventTypeBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    eventType: {
      control: 'select',
      options: [
        'AgentRegistered',
        'AgentUpdated',
        'AgentDeregistered',
        'ReputationChanged',
        'ValidationCompleted',
        'Transfer',
        'Mint',
        'Burn',
        'UnknownEvent',
      ],
    },
    showIcon: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AgentRegistered: Story = {
  args: {
    eventType: 'AgentRegistered',
  },
}

export const AgentUpdated: Story = {
  args: {
    eventType: 'AgentUpdated',
  },
}

export const ReputationChanged: Story = {
  args: {
    eventType: 'ReputationChanged',
  },
}

export const AllEventTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <EventTypeBadge eventType="AgentRegistered" />
      <EventTypeBadge eventType="AgentUpdated" />
      <EventTypeBadge eventType="AgentDeregistered" />
      <EventTypeBadge eventType="ReputationChanged" />
      <EventTypeBadge eventType="ValidationCompleted" />
      <EventTypeBadge eventType="Transfer" />
      <EventTypeBadge eventType="Mint" />
      <EventTypeBadge eventType="Burn" />
    </div>
  ),
}

export const WithoutIcon: Story = {
  args: {
    eventType: 'AgentRegistered',
    showIcon: false,
  },
}

export const UnknownEvent: Story = {
  args: {
    eventType: 'CustomEvent',
  },
}
