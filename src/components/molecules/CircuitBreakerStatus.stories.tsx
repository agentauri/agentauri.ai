import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { CircuitBreakerStatus } from './CircuitBreakerStatus'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof CircuitBreakerStatus> = {
  title: 'Molecules/CircuitBreakerStatus',
  component: CircuitBreakerStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-80">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    compact: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Healthy: Story = {
  args: {
    compact: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => {
          return HttpResponse.json({
            status: 'healthy',
            services: {
              database: 'up',
              indexer: 'connected',
              cache: 'up',
            },
          })
        }),
      ],
    },
  },
}

export const Degraded: Story = {
  args: {
    compact: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => {
          return HttpResponse.json({
            status: 'degraded',
            services: {
              database: 'up',
              indexer: 'disconnected',
              cache: 'up',
            },
          })
        }),
      ],
    },
  },
}

export const Unhealthy: Story = {
  args: {
    compact: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => {
          return HttpResponse.json({
            status: 'unhealthy',
            services: {
              database: 'down',
              indexer: 'disconnected',
              cache: 'down',
            },
          })
        }),
      ],
    },
  },
}

export const CompactHealthy: Story = {
  args: {
    compact: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => {
          return HttpResponse.json({
            status: 'healthy',
            services: {},
          })
        }),
      ],
    },
  },
}

export const CompactDegraded: Story = {
  args: {
    compact: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => {
          return HttpResponse.json({
            status: 'degraded',
            services: {},
          })
        }),
      ],
    },
  },
}

export const CompactUnhealthy: Story = {
  args: {
    compact: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => {
          return HttpResponse.json({
            status: 'unhealthy',
            services: {},
          })
        }),
      ],
    },
  },
}
