import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EventDetail } from './EventDetail'
import type { BlockchainEvent } from '@/types/models'

const mockEvent: BlockchainEvent = {
  id: 'event-123',
  eventType: 'AgentRegistered',
  chainId: 1,
  blockNumber: 12345678,
  transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  timestamp: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-15T10:30:05Z',
  agentId: 42,
  registry: 'identity',
  data: {
    owner: '0x1234567890abcdef1234567890abcdef12345678',
    tier: 'standard',
    metadata: {
      name: 'Test Agent',
      version: '1.0.0',
    },
  },
}

const meta: Meta<typeof EventDetail> = {
  title: 'Organisms/EventDetail',
  component: EventDetail,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-terminal p-4 max-w-4xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const AgentRegistered: Story = {
  args: {
    event: mockEvent,
  },
}

export const ReputationChanged: Story = {
  args: {
    event: {
      ...mockEvent,
      id: 'event-456',
      eventType: 'ReputationChanged',
      registry: 'reputation',
      data: {
        agentId: 42,
        oldScore: 50,
        newScore: 85,
        reason: 'Successful validation',
      },
    },
  },
}

export const ValidationCompleted: Story = {
  args: {
    event: {
      ...mockEvent,
      id: 'event-789',
      eventType: 'ValidationCompleted',
      registry: 'validation',
      data: {
        agentId: 42,
        validatorId: 123,
        result: true,
        score: 95,
      },
    },
  },
}

export const NoAgentId: Story = {
  args: {
    event: {
      ...mockEvent,
      id: 'event-999',
      eventType: 'Transfer',
      agentId: null,
      registry: 'identity',
      data: {
        from: '0x0000000000000000000000000000000000000000',
        to: '0x1234567890abcdef1234567890abcdef12345678',
        tokenId: 42,
      },
    },
  },
}

export const BaseSepolia: Story = {
  args: {
    event: {
      ...mockEvent,
      chainId: 84532,
    },
  },
}
