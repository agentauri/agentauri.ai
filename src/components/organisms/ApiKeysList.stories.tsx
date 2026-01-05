import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { ApiKeysList } from './ApiKeysList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockApiKeys = [
  {
    id: 'key-1',
    name: 'Production API',
    prefix: '8004_sk_prod',
    tier: 'full' as const,
    lastUsedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    expiresAt: null,
  },
  {
    id: 'key-2',
    name: 'Development Key',
    prefix: '8004_sk_dev',
    tier: 'standard' as const,
    lastUsedAt: '2024-01-14T15:00:00Z',
    createdAt: '2024-01-05T12:00:00Z',
    expiresAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'key-3',
    name: 'Testing Key',
    prefix: '8004_sk_test',
    tier: 'basic' as const,
    lastUsedAt: null,
    createdAt: '2024-01-10T08:00:00Z',
    expiresAt: null,
  },
]

const meta: Meta<typeof ApiKeysList> = {
  title: 'Organisms/ApiKeysList',
  component: ApiKeysList,
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

export const WithKeys: Story = {
  args: {
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/api-keys', () => {
          return HttpResponse.json({
            data: mockApiKeys,
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
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/api-keys', () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const WithPagination: Story = {
  args: {
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/api-keys', () => {
          return HttpResponse.json({
            data: mockApiKeys,
            pagination: { total: 10, hasMore: true },
          })
        }),
      ],
    },
  },
}
