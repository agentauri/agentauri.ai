import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TierBadge } from './TierBadge'

const meta: Meta<typeof TierBadge> = {
  title: 'Molecules/TierBadge',
  component: TierBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tier: {
      control: 'select',
      options: ['basic', 'standard', 'advanced', 'full'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    tier: 'basic',
  },
}

export const Standard: Story = {
  args: {
    tier: 'standard',
  },
}

export const Advanced: Story = {
  args: {
    tier: 'advanced',
  },
}

export const Full: Story = {
  args: {
    tier: 'full',
  },
}

export const AllTiers: Story = {
  render: () => (
    <div className="flex gap-2">
      <TierBadge tier="basic" />
      <TierBadge tier="standard" />
      <TierBadge tier="advanced" />
      <TierBadge tier="full" />
    </div>
  ),
}
