import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { ChainBadge } from '@/components/molecules'
import { AgentAddressBadge } from '@/components/molecules/AgentAddressBadge'
import { cn } from '@/lib/utils'
import type { LinkedAgent } from '@/types/models'

// Mock component for Storybook (the real one uses hooks)
interface AgentCardMockProps {
  agent: LinkedAgent
  className?: string
}

function AgentCardMock({ agent, className }: AgentCardMockProps) {
  const linkedAt = new Date(agent.linkedAt).toLocaleDateString()

  return (
    <Card
      data-slot="agent-card"
      className={cn(
        'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
        'hover:glow-sm min-w-[320px]',
        className
      )}
    >
      <CardHeader className="border-b-2 border-terminal-dim pb-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="typo-header text-terminal-green glow">
            AGENT #{agent.agentId}
          </CardTitle>
          <ChainBadge chainId={agent.chainId} />
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4 mb-4">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; WALLET ADDRESS</div>
            <AgentAddressBadge address={agent.walletAddress} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; AGENT ID</div>
              <div className="typo-ui text-terminal-green">#{agent.agentId}</div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; LINKED</div>
              <div className="typo-ui text-terminal-green">{linkedAt}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="typo-ui">
            [VIEW]
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="typo-ui text-destructive hover:text-destructive"
            aria-label={`Unlink agent ${agent.agentId}`}
          >
            [UNLINK]
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const meta: Meta<typeof AgentCardMock> = {
  title: 'Organisms/AgentCard',
  component: AgentCardMock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4 bg-terminal">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AgentCardMock>

const mockAgent: LinkedAgent = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  organizationId: '550e8400-e29b-41d4-a716-446655440000',
  agentId: 42,
  walletAddress: '0x1234567890123456789012345678901234567890',
  chainId: 1,
  linkedAt: '2025-01-15T10:30:00Z',
}

export const Default: Story = {
  args: {
    agent: mockAgent,
  },
}

export const EthereumMainnet: Story = {
  args: {
    agent: {
      ...mockAgent,
      chainId: 1,
    },
  },
}

export const Base: Story = {
  args: {
    agent: {
      ...mockAgent,
      chainId: 8453,
    },
  },
}

export const Sepolia: Story = {
  args: {
    agent: {
      ...mockAgent,
      chainId: 11155111,
    },
  },
}

export const RecentlyLinked: Story = {
  args: {
    agent: {
      ...mockAgent,
      linkedAt: new Date().toISOString(),
    },
  },
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AgentCardMock
        agent={{
          ...mockAgent,
          agentId: 1,
          walletAddress: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
        }}
      />
      <AgentCardMock
        agent={{
          ...mockAgent,
          agentId: 2,
          chainId: 8453,
          walletAddress: '0x9876543210FEDCBA9876543210FEDCBA98765432',
        }}
      />
      <AgentCardMock
        agent={{
          ...mockAgent,
          agentId: 3,
          chainId: 11155111,
          walletAddress: '0xFEDCBA9876543210FEDCBA9876543210FEDCBA98',
        }}
      />
    </div>
  ),
}
