import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Icon } from '@/components/atoms/icon'
import { ChainBadge, RegistryBadge } from '@/components/molecules'
import { EventTypeBadge } from '@/components/molecules/EventTypeBadge'
import { cn } from '@/lib/utils'
import type { BlockchainEvent } from '@/types/models'

// Mock component for Storybook (the real one uses hooks for clipboard)
interface EventCardMockProps {
  event: BlockchainEvent
  compact?: boolean
  className?: string
}

function EventCardMock({ event, compact = false, className }: EventCardMockProps) {
  const truncatedHash = `${event.transactionHash.slice(0, 10)}...${event.transactionHash.slice(-8)}`
  const eventTime = new Date(event.timestamp).toLocaleString()

  if (compact) {
    return (
      <div
        data-slot="event-card-compact"
        className={cn(
          'flex items-center justify-between gap-3 p-3 cursor-pointer',
          'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
          'hover:glow-sm',
          className
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <EventTypeBadge eventType={event.eventType} />
          <span className="typo-ui text-terminal-green text-sm truncate">
            BLOCK #{event.blockNumber.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="typo-ui text-terminal-dim text-xs">
            {new Date(event.timestamp).toLocaleDateString()}
          </span>
          <Icon name="chevron-right" size="sm" className="text-terminal-dim" />
        </div>
      </div>
    )
  }

  return (
    <Card
      data-slot="event-card"
      className={cn(
        'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
        'hover:glow-sm min-w-[320px]',
        className
      )}
    >
      <CardHeader className="border-b-2 border-terminal-dim pb-4">
        <div className="flex items-start justify-between gap-2">
          <EventTypeBadge eventType={event.eventType} />
          <div className="flex gap-2">
            <ChainBadge chainId={event.chainId} />
            <RegistryBadge registry={event.registry} />
          </div>
        </div>
        <CardTitle className="typo-ui text-terminal-green glow mt-3 text-sm">
          BLOCK #{event.blockNumber.toLocaleString()}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; TX HASH</div>
            <button
              type="button"
              className="typo-ui text-terminal-green hover:text-terminal-bright flex items-center gap-1 transition-colors"
              aria-label="Copy transaction hash"
            >
              {truncatedHash}
              <Icon name="copy" size="xs" />
            </button>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; TIME</div>
            <div className="typo-ui text-terminal-green text-xs">{eventTime}</div>
          </div>
        </div>

        {event.agentId !== null && (
          <div className="mb-4">
            <div className="typo-ui text-terminal-dim mb-1">&gt; AGENT ID</div>
            <div className="typo-ui text-terminal-green">#{event.agentId}</div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="typo-ui">
            [VIEW DETAILS]
          </Button>
          {event.agentId !== null && (
            <Button variant="outline" size="sm" className="typo-ui">
              [VIEW AGENT]
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const meta: Meta<typeof EventCardMock> = {
  title: 'Organisms/EventCard',
  component: EventCardMock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    compact: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-terminal">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EventCardMock>

const mockEvent: BlockchainEvent = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  eventType: 'ReputationUpdated',
  agentId: 42,
  chainId: 1,
  registry: 'reputation',
  blockNumber: 19542678,
  transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  data: {
    score: 95,
    previousScore: 90,
  },
  timestamp: '2025-01-15T14:30:00Z',
  createdAt: '2025-01-15T14:30:00Z',
}

export const Default: Story = {
  args: {
    event: mockEvent,
  },
}

export const Compact: Story = {
  args: {
    event: mockEvent,
    compact: true,
  },
}

export const AgentRegistered: Story = {
  args: {
    event: {
      ...mockEvent,
      eventType: 'AgentRegistered',
      registry: 'identity',
    },
  },
}

export const AgentUnregistered: Story = {
  args: {
    event: {
      ...mockEvent,
      eventType: 'AgentUnregistered',
      registry: 'identity',
    },
  },
}

export const NoAgent: Story = {
  args: {
    event: {
      ...mockEvent,
      agentId: null,
    },
  },
}

export const BaseChain: Story = {
  args: {
    event: {
      ...mockEvent,
      chainId: 8453,
    },
  },
}

export const CompactList: Story = {
  render: () => (
    <div className="space-y-2 w-[500px]">
      <EventCardMock event={mockEvent} compact />
      <EventCardMock
        event={{
          ...mockEvent,
          id: '2',
          eventType: 'AgentRegistered',
          blockNumber: 19542679,
        }}
        compact
      />
      <EventCardMock
        event={{
          ...mockEvent,
          id: '3',
          eventType: 'AgentUnregistered',
          blockNumber: 19542680,
        }}
        compact
      />
    </div>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EventCardMock event={mockEvent} />
      <EventCardMock
        event={{
          ...mockEvent,
          id: '2',
          eventType: 'AgentRegistered',
          chainId: 8453,
        }}
      />
    </div>
  ),
}
