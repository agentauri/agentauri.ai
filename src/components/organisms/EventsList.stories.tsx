import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { EventsList } from './EventsList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockEvents = [
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
    data: { owner: '0x1234...' },
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
  {
    id: 'event-3',
    eventType: 'ValidationCompleted',
    chainId: 84532,
    blockNumber: 5678901,
    transactionHash: '0xghi789...',
    timestamp: '2024-01-15T12:00:00Z',
    createdAt: '2024-01-15T12:00:00Z',
    agentId: 123,
    registry: 'validation',
    data: { result: true, score: 95 },
  },
]

const meta: Meta<typeof EventsList> = {
  title: 'Organisms/EventsList',
  component: EventsList,
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
        <div className="bg-terminal p-4">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithEvents: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('/api/events', () => {
          return HttpResponse.json({
            data: mockEvents,
            pagination: { total: 3, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const EmptyList: Story = {
  args: {},
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

export const FilteredByAgent: Story = {
  args: {
    agentId: 42,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/events', () => {
          return HttpResponse.json({
            data: mockEvents.filter((e) => e.agentId === 42),
            pagination: { total: 2, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const WithPagination: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('/api/events', () => {
          return HttpResponse.json({
            data: mockEvents,
            pagination: { total: 50, hasMore: true },
          })
        }),
      ],
    },
  },
}
