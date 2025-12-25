import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from './box'

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'subtle', 'success', 'error'],
      description: 'Visual variant of the box',
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Internal padding size',
    },
  },
}

export default meta
type Story = StoryObj<typeof Box>

export const Default: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-green">
        {'>'} DEFAULT BOX CONTENT
      </div>
    ),
    variant: 'default',
    padding: 'md',
  },
}

export const Subtle: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-dim">
        {'>'} SUBTLE BOX - for nested/secondary content
      </div>
    ),
    variant: 'subtle',
    padding: 'md',
  },
}

export const Success: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-green glow">
        [OK] OPERATION COMPLETED SUCCESSFULLY
      </div>
    ),
    variant: 'success',
    padding: 'md',
  },
}

export const ErrorVariant: Story = {
  args: {
    children: (
      <div className="typo-ui text-destructive">
        [!] ERROR: Something went wrong
      </div>
    ),
    variant: 'error',
    padding: 'md',
  },
}

export const SmallPadding: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-green">
        {'>'} COMPACT BOX (p-3)
      </div>
    ),
    variant: 'default',
    padding: 'sm',
  },
}

export const LargePadding: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-green">
        {'>'} SPACIOUS BOX (p-6)
      </div>
    ),
    variant: 'default',
    padding: 'lg',
  },
}

export const NestedBoxes: Story = {
  render: () => (
    <Box variant="default" padding="lg">
      <div className="typo-ui text-terminal-green mb-4">
        {'>'} PARENT BOX
      </div>
      <div className="space-y-4">
        <Box variant="subtle" padding="md">
          <div className="typo-ui text-terminal-dim">
            {'>'} NESTED SUBTLE BOX 1
          </div>
        </Box>
        <Box variant="subtle" padding="md">
          <div className="typo-ui text-terminal-dim">
            {'>'} NESTED SUBTLE BOX 2
          </div>
        </Box>
      </div>
    </Box>
  ),
}

export const Secondary: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-green">
        {'>'} SECONDARY BOX - for form sections
      </div>
    ),
    variant: 'secondary',
    padding: 'md',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Box variant="default" padding="md">
        <div className="typo-ui text-terminal-green">
          {'>'} DEFAULT
        </div>
      </Box>
      <Box variant="secondary" padding="md">
        <div className="typo-ui text-terminal-green">
          {'>'} SECONDARY
        </div>
      </Box>
      <Box variant="subtle" padding="md">
        <div className="typo-ui text-terminal-dim">
          {'>'} SUBTLE
        </div>
      </Box>
      <Box variant="success" padding="md">
        <div className="typo-ui text-terminal-green glow">
          {'>'} SUCCESS
        </div>
      </Box>
      <Box variant="error" padding="md">
        <div className="typo-ui text-destructive">
          {'>'} ERROR
        </div>
      </Box>
    </div>
  ),
}

export const AllPaddingSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Box variant="default" padding="sm">
        <div className="typo-ui text-terminal-green">
          {'>'} SMALL (p-3)
        </div>
      </Box>
      <Box variant="default" padding="md">
        <div className="typo-ui text-terminal-green">
          {'>'} MEDIUM (p-4)
        </div>
      </Box>
      <Box variant="default" padding="lg">
        <div className="typo-ui text-terminal-green">
          {'>'} LARGE (p-6)
        </div>
      </Box>
    </div>
  ),
}

export const WithCustomClassName: Story = {
  args: {
    children: (
      <div className="typo-ui text-terminal-green">
        {'>'} BOX WITH CUSTOM CLASSNAME (space-y-4)
      </div>
    ),
    variant: 'default',
    padding: 'md',
    className: 'space-y-4',
  },
}
