import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'ONLINE',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'PENDING',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'ERROR',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'INACTIVE',
    variant: 'outline',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">ONLINE</Badge>
      <Badge variant="secondary">PENDING</Badge>
      <Badge variant="destructive">ERROR</Badge>
      <Badge variant="outline">INACTIVE</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant="default">OK</Badge>
        <span className="typo-ui">System operational</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">SYNC</Badge>
        <span className="typo-ui">Synchronizing...</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive">FAIL</Badge>
        <span className="typo-ui">Connection lost</span>
      </div>
    </div>
  ),
}
