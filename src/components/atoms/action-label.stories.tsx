import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ActionLabel } from './action-label'

const meta: Meta<typeof ActionLabel> = {
  title: 'UI/ActionLabel',
  component: ActionLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'muted'],
    },
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
    icon: {
      control: 'select',
      options: [
        'chevron-right',
        'close',
        'add',
        'remove',
        'warning',
        'help',
        'check',
        'retry',
        'arrow-right',
        'arrow-up',
        'arrow-down',
      ],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'ACTION',
    variant: 'default',
    icon: 'chevron-right',
  },
}

export const Destructive: Story = {
  args: {
    children: 'REMOVE',
    variant: 'destructive',
    icon: 'close',
  },
}

export const Warning: Story = {
  args: {
    children: 'WARNING',
    variant: 'warning',
    icon: 'warning',
  },
}

export const Muted: Story = {
  args: {
    children: 'SKIP',
    variant: 'muted',
    icon: 'remove',
  },
}

export const WithoutIcon: Story = {
  args: {
    children: 'CLICK HERE',
    variant: 'default',
  },
}

export const Disabled: Story = {
  args: {
    children: 'DISABLED',
    variant: 'default',
    icon: 'close',
    disabled: true,
  },
}

export const Small: Story = {
  args: {
    children: 'SMALL',
    size: 'sm',
    icon: 'chevron-right',
  },
}

export const Large: Story = {
  args: {
    children: 'LARGE',
    size: 'lg',
    icon: 'chevron-right',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <ActionLabel variant="default" icon="chevron-right">
        DEFAULT
      </ActionLabel>
      <ActionLabel variant="destructive" icon="close">
        DESTRUCTIVE
      </ActionLabel>
      <ActionLabel variant="warning" icon="warning">
        WARNING
      </ActionLabel>
      <ActionLabel variant="muted" icon="remove">
        MUTED
      </ActionLabel>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <ActionLabel size="sm" icon="chevron-right">
          SMALL (11px)
        </ActionLabel>
        <ActionLabel size="lg" icon="chevron-right">
          LARGE (13px)
        </ActionLabel>
      </div>
      <div className="flex items-center gap-4">
        <ActionLabel variant="destructive" size="sm" icon="close">
          REMOVE SM
        </ActionLabel>
        <ActionLabel variant="destructive" size="lg" icon="close">
          REMOVE LG
        </ActionLabel>
      </div>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="border-2 border-terminal p-4 relative w-80">
      <div className="typo-ui text-terminal-dim mb-2">ITEM LABEL</div>
      <div className="typo-ui text-terminal-green">Some content here</div>
      <ActionLabel variant="destructive" icon="close" className="absolute top-4 right-4">
        REMOVE
      </ActionLabel>
    </div>
  ),
}
