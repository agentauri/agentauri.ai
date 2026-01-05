import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { AgentsList } from './AgentsList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockAgents = [
  {
    id: 'linked-1',
    agentId: 42,
    chainId: 1,
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    linkedAt: '2024-01-15T10:30:00Z',
    organizationId: 'org-123',
  },
  {
    id: 'linked-2',
    agentId: 123,
    chainId: 84532,
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    linkedAt: '2024-01-10T08:00:00Z',
    organizationId: 'org-123',
  },
  {
    id: 'linked-3',
    agentId: 456,
    chainId: 11155111,
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    linkedAt: '2024-01-05T15:45:00Z',
    organizationId: 'org-123',
  },
]

const meta: Meta<typeof AgentsList> = {
  title: 'Organisms/AgentsList',
  component: AgentsList,
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
  argTypes: {
    showLinkButton: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const WithAgents: Story = {
  args: {
    organizationId: 'org-123',
    showLinkButton: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/agents', () => {
          return HttpResponse.json({
            data: mockAgents,
            pagination: { total: 3, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const EmptyList: Story = {
  args: {
    organizationId: 'org-123',
    showLinkButton: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/agents', () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const NoLinkButton: Story = {
  args: {
    organizationId: 'org-123',
    showLinkButton: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/agents', () => {
          return HttpResponse.json({
            data: mockAgents,
            pagination: { total: 3, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const WithPagination: Story = {
  args: {
    organizationId: 'org-123',
    showLinkButton: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/agents', () => {
          return HttpResponse.json({
            data: mockAgents,
            pagination: { total: 10, hasMore: true },
          })
        }),
      ],
    },
  },
}
