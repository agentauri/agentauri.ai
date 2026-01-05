import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusBadge } from './StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Molecules/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    enabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Enabled: Story = {
  args: {
    enabled: true,
  },
}

export const Disabled: Story = {
  args: {
    enabled: false,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatusBadge enabled={true} />
      <StatusBadge enabled={false} />
    </div>
  ),
}
