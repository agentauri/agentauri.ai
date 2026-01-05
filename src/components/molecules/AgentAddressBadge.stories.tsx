import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AgentAddressBadge } from './AgentAddressBadge'

const meta: Meta<typeof AgentAddressBadge> = {
  title: 'Molecules/AgentAddressBadge',
  component: AgentAddressBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    truncate: {
      control: 'boolean',
    },
    copyable: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleAddress = '0x1234567890abcdef1234567890abcdef12345678'

export const Default: Story = {
  args: {
    address: sampleAddress,
  },
}

export const Truncated: Story = {
  args: {
    address: sampleAddress,
    truncate: true,
  },
}

export const FullAddress: Story = {
  args: {
    address: sampleAddress,
    truncate: false,
  },
}

export const NotCopyable: Story = {
  args: {
    address: sampleAddress,
    copyable: false,
  },
}

export const MultipleAddresses: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <AgentAddressBadge address="0x1234567890abcdef1234567890abcdef12345678" />
      <AgentAddressBadge address="0xabcdef1234567890abcdef1234567890abcdef12" />
      <AgentAddressBadge address="0x9876543210fedcba9876543210fedcba98765432" />
    </div>
  ),
}
