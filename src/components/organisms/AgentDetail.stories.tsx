import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { AgentDetail } from './AgentDetail'
import type { LinkedAgent } from '@/types/models'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockAgent: LinkedAgent = {
  id: 'linked-agent-1',
  agentId: 42,
  chainId: 1,
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  linkedAt: '2024-01-15T10:30:00Z',
  organizationId: 'org-123',
}

const meta: Meta<typeof AgentDetail> = {
  title: 'Organisms/AgentDetail',
  component: AgentDetail,
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
      <QueryClientProvider client={queryClient}>
        <div className="bg-terminal p-4 max-w-4xl">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    agent: mockAgent,
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/events', () => {
          return HttpResponse.json({
            data: [
              {
                id: 'event-1',
                eventType: 'AgentRegistered',
                chainId: 1,
                blockNumber: 12345678,
                transactionHash: '0xabc123...',
                timestamp: '2024-01-15T10:00:00Z',
                createdAt: '2024-01-15T10:00:00Z',
                agentId: 42,
                registry: 'identity',
                data: {},
              },
              {
                id: 'event-2',
                eventType: 'ReputationChanged',
                chainId: 1,
                blockNumber: 12345680,
                transactionHash: '0xdef456...',
                timestamp: '2024-01-15T11:00:00Z',
                createdAt: '2024-01-15T11:00:00Z',
                agentId: 42,
                registry: 'reputation',
                data: { oldScore: 50, newScore: 75 },
              },
            ],
            pagination: { total: 2, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const NoEvents: Story = {
  args: {
    agent: mockAgent,
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/events', () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const BaseSepolia: Story = {
  args: {
    agent: {
      ...mockAgent,
      chainId: 84532,
    },
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/events', () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, hasMore: false },
          })
        }),
      ],
    },
  },
}
