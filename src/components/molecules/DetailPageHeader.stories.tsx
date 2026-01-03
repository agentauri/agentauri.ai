import type { Meta, StoryObj } from '@storybook/react'
import { DetailPageHeader } from './DetailPageHeader'
import { StatusBadge } from './StatusBadge'

const meta: Meta<typeof DetailPageHeader> = {
  title: 'Molecules/DetailPageHeader',
  component: DetailPageHeader,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    backHref: {
      control: 'text',
      description: 'URL to navigate back to',
    },
    backLabel: {
      control: 'text',
      description: 'Custom back button label',
    },
    title: {
      control: 'text',
      description: 'Page title',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or description',
    },
  },
}

export default meta
type Story = StoryObj<typeof DetailPageHeader>

export const Default: Story = {
  args: {
    backHref: '/dashboard/triggers',
    title: '[+] CREATE NEW TRIGGER',
    subtitle: 'Set up automated monitoring and actions for blockchain events',
  },
}

export const WithAction: Story = {
  args: {
    backHref: '/dashboard/triggers',
    title: 'High Reputation Alert',
    subtitle: 'Triggers when agent reputation exceeds threshold',
    action: <StatusBadge enabled={true} />,
  },
}

export const Disabled: Story = {
  args: {
    backHref: '/dashboard/triggers',
    title: 'Inactive Trigger',
    subtitle: 'This trigger is currently disabled',
    action: <StatusBadge enabled={false} />,
  },
}

export const NoSubtitle: Story = {
  args: {
    backHref: '/dashboard/agents',
    title: 'AGENT #1234',
  },
}

export const CustomBackLabel: Story = {
  args: {
    backHref: '/dashboard/events',
    backLabel: 'BACK TO EVENTS',
    title: 'EVENT #18,234,567',
    subtitle: 'ReputationUpdated',
  },
}

export const LongTitle: Story = {
  args: {
    backHref: '/dashboard/triggers',
    title: 'Very Long Trigger Name That Might Wrap To Multiple Lines',
    subtitle: 'This is a very long description that explains what this trigger does in great detail',
    action: <StatusBadge enabled={true} />,
  },
}
