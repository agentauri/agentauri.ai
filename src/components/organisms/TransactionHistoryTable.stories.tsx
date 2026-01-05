import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { TransactionHistoryTable } from './TransactionHistoryTable'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockTransactions = [
  {
    id: 'tx-1',
    type: 'purchase' as const,
    amount: 10000,
    description: 'Credit purchase - Starter Pack',
    referenceId: 'stripe_pi_1234567890',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'tx-2',
    type: 'usage' as const,
    amount: -150,
    description: 'API query - Agent reputation lookup',
    referenceId: 'req_abcdef123456',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'tx-3',
    type: 'bonus' as const,
    amount: 500,
    description: 'Welcome bonus credits',
    referenceId: null,
    createdAt: '2024-01-14T09:00:00Z',
  },
  {
    id: 'tx-4',
    type: 'refund' as const,
    amount: 200,
    description: 'Refund for failed transaction',
    referenceId: 'ref_xyz789',
    createdAt: '2024-01-13T16:30:00Z',
  },
  {
    id: 'tx-5',
    type: 'usage' as const,
    amount: -75,
    description: 'API query - Event history',
    referenceId: 'req_ghijkl456789',
    createdAt: '2024-01-12T14:00:00Z',
  },
]

const meta: Meta<typeof TransactionHistoryTable> = {
  title: 'Organisms/TransactionHistoryTable',
  component: TransactionHistoryTable,
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

export const WithTransactions: Story = {
  args: {
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/transactions', () => {
          return HttpResponse.json({
            data: mockTransactions,
            pagination: { total: 5, hasMore: false },
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
        http.get('/api/billing/transactions', () => {
          return HttpResponse.json({
            data: [],
            pagination: { total: 0, hasMore: false },
          })
        }),
      ],
    },
  },
}

export const OnlyPurchases: Story = {
  args: {
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/transactions', () => {
          return HttpResponse.json({
            data: [
              {
                id: 'tx-1',
                type: 'purchase',
                amount: 10000,
                description: 'Credit purchase - Starter Pack',
                referenceId: 'stripe_pi_1234567890',
                createdAt: '2024-01-15T10:30:00Z',
              },
              {
                id: 'tx-2',
                type: 'purchase',
                amount: 50000,
                description: 'Credit purchase - Pro Pack',
                referenceId: 'stripe_pi_0987654321',
                createdAt: '2024-01-10T08:00:00Z',
              },
            ],
            pagination: { total: 2, hasMore: false },
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
        http.get('/api/billing/transactions', () => {
          return HttpResponse.json({
            data: mockTransactions,
            pagination: { total: 100, hasMore: true },
          })
        }),
      ],
    },
  },
}
