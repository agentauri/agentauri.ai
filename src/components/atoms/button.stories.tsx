import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
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
    children: 'EXECUTE',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'SECONDARY',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'OUTLINE',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: 'GHOST',
    variant: 'ghost',
  },
}

export const Destructive: Story = {
  args: {
    children: 'TERMINATE',
    variant: 'destructive',
  },
}

export const Link: Story = {
  args: {
    children: 'LINK',
    variant: 'link',
  },
}

export const Small: Story = {
  args: {
    children: 'SMALL',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'LARGE',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'DISABLED',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">DEFAULT</Button>
      <Button variant="secondary">SECONDARY</Button>
      <Button variant="outline">OUTLINE</Button>
      <Button variant="ghost">GHOST</Button>
      <Button variant="destructive">DESTRUCT</Button>
      <Button variant="link">LINK</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">SMALL</Button>
      <Button size="default">DEFAULT</Button>
      <Button size="lg">LARGE</Button>
    </div>
  ),
}
