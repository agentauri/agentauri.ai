import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RegistryBadge } from './RegistryBadge'

const meta: Meta<typeof RegistryBadge> = {
  title: 'Molecules/RegistryBadge',
  component: RegistryBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    registry: {
      control: 'select',
      options: ['identity', 'reputation', 'validation'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Identity: Story = {
  args: {
    registry: 'identity',
  },
}

export const Reputation: Story = {
  args: {
    registry: 'reputation',
  },
}

export const Validation: Story = {
  args: {
    registry: 'validation',
  },
}

export const AllRegistries: Story = {
  render: () => (
    <div className="flex gap-2">
      <RegistryBadge registry="identity" />
      <RegistryBadge registry="reputation" />
      <RegistryBadge registry="validation" />
    </div>
  ),
}
