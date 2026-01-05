import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { CreditBalanceCard } from './CreditBalanceCard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof CreditBalanceCard> = {
  title: 'Organisms/CreditBalanceCard',
  component: CreditBalanceCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="bg-terminal p-4 w-96">
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
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/balance', () => {
          return HttpResponse.json({
            balance: 15000,
            lifetimePurchased: 50000,
            lifetimeUsed: 35000,
          })
        }),
      ],
    },
  },
}

export const LowBalance: Story = {
  args: {
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/balance', () => {
          return HttpResponse.json({
            balance: 100,
            lifetimePurchased: 5000,
            lifetimeUsed: 4900,
          })
        }),
      ],
    },
  },
}

export const HighBalance: Story = {
  args: {
    organizationId: 'org-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/balance', () => {
          return HttpResponse.json({
            balance: 1500000,
            lifetimePurchased: 2000000,
            lifetimeUsed: 500000,
          })
        }),
      ],
    },
  },
}

export const WithBuyButton: Story = {
  args: {
    organizationId: 'org-123',
    onBuyCredits: () => console.log('Buy credits clicked'),
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/balance', () => {
          return HttpResponse.json({
            balance: 5000,
            lifetimePurchased: 10000,
            lifetimeUsed: 5000,
          })
        }),
      ],
    },
  },
}

export const ZeroBalance: Story = {
  args: {
    organizationId: 'org-123',
    onBuyCredits: () => console.log('Buy credits clicked'),
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/billing/balance', () => {
          return HttpResponse.json({
            balance: 0,
            lifetimePurchased: 1000,
            lifetimeUsed: 1000,
          })
        }),
      ],
    },
  },
}
