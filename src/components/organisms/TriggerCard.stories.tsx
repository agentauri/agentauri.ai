import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TriggerCard } from './TriggerCard'
import type { Trigger } from '@/types/models'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const meta = {
  title: 'Triggers/TriggerCard',
  component: TriggerCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Card component displaying trigger information with actions to view, toggle, and delete triggers.',
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="max-w-md">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TriggerCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Active trigger with execution history.
 * Shows a fully configured trigger that's been running.
 */
export const ActiveTrigger: Story = {
  args: {
    trigger: {
      id: 'trigger-123',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'High Reputation Alert',
      description: 'Notify when agent reputation exceeds 800',
      chainId: 1,
      registry: 'reputation',
      enabled: true,
      isStateful: true,
      executionCount: 42,
      lastExecutedAt: new Date('2025-12-01T10:30:00Z').toISOString(),
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-123',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'gt',
          value: '800',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-123',
          actionType: 'telegram',
          priority: 0,
          config: { chatId: '-1001234567890' },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date('2025-11-01T00:00:00Z').toISOString(),
      updatedAt: new Date('2025-12-01T10:30:00Z').toISOString(),
    },
  },
}

/**
 * Disabled trigger.
 * Shows an inactive trigger that's been paused.
 */
export const DisabledTrigger: Story = {
  args: {
    trigger: {
      id: 'trigger-456',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Paused Monitor',
      description: 'Temporarily disabled for maintenance',
      chainId: 8453,
      registry: 'reputation',
      enabled: false,
      isStateful: false,
      executionCount: 15,
      lastExecutedAt: new Date('2025-11-15T08:00:00Z').toISOString(),
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-456',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'lt',
          value: '100',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-456',
          actionType: 'rest',
          priority: 0,
          config: { url: 'https://api.example.com' },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date('2025-10-01T00:00:00Z').toISOString(),
      updatedAt: new Date('2025-11-15T08:00:00Z').toISOString(),
    },
  },
}

/**
 * New trigger never executed.
 * Shows a freshly created trigger with no execution history.
 */
export const NeverExecuted: Story = {
  args: {
    trigger: {
      id: 'trigger-789',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'New Event Monitor',
      description: 'Just created, waiting for events',
      chainId: 11155111,
      registry: 'reputation',
      enabled: true,
      isStateful: true,
      executionCount: 0,
      lastExecutedAt: null,
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-789',
          conditionType: 'event_filter',
          field: 'event_type',
          operator: 'eq',
          value: 'ReputationUpdated',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-789',
          actionType: 'telegram',
          priority: 0,
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

/**
 * Trigger without description.
 * Shows minimal trigger information.
 */
export const NoDescription: Story = {
  args: {
    trigger: {
      id: 'trigger-abc',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Simple Alert',
      description: null,
      chainId: 1,
      registry: 'reputation',
      enabled: true,
      isStateful: false,
      executionCount: 5,
      lastExecutedAt: new Date('2025-11-30T15:00:00Z').toISOString(),
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-abc',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'gte',
          value: '500',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-abc',
          actionType: 'mcp',
          priority: 0,
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date('2025-11-20T00:00:00Z').toISOString(),
      updatedAt: new Date('2025-11-30T15:00:00Z').toISOString(),
    },
  },
}

/**
 * Complex trigger with multiple conditions and actions.
 * Shows a sophisticated monitoring setup.
 */
export const ComplexTrigger: Story = {
  args: {
    trigger: {
      id: 'trigger-complex',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Multi-Condition Multi-Action Monitor',
      description: 'Advanced trigger with 3 conditions and 4 actions for comprehensive monitoring',
      chainId: 8453,
      registry: 'reputation',
      enabled: true,
      isStateful: true,
      executionCount: 128,
      lastExecutedAt: new Date('2025-12-01T11:45:00Z').toISOString(),
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-complex',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'gt',
          value: '750',
          config: {},
          createdAt: new Date().toISOString(),
        },
        {
          id: 'cond-2',
          triggerId: 'trigger-complex',
          conditionType: 'agent_filter',
          field: 'agent',
          operator: 'in',
          value: '0x123,0x456',
          config: {},
          createdAt: new Date().toISOString(),
        },
        {
          id: 'cond-3',
          triggerId: 'trigger-complex',
          conditionType: 'field_comparison',
          field: 'timestamp',
          operator: 'gt',
          value: '1700000000',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-complex',
          actionType: 'telegram',
          priority: 0,
          config: { chatId: '-1001234567890' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'action-2',
          triggerId: 'trigger-complex',
          actionType: 'rest',
          priority: 1,
          config: { url: 'https://api.example.com' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'action-3',
          triggerId: 'trigger-complex',
          actionType: 'mcp',
          priority: 2,
          config: { command: 'log' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'action-4',
          triggerId: 'trigger-complex',
          actionType: 'telegram',
          priority: 3,
          config: { chatId: '-1009876543210' },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date('2025-10-15T00:00:00Z').toISOString(),
      updatedAt: new Date('2025-12-01T11:45:00Z').toISOString(),
    },
  },
}

/**
 * Trigger with long name (truncation test).
 * Tests UI behavior with lengthy trigger names.
 */
export const LongName: Story = {
  args: {
    trigger: {
      id: 'trigger-long',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Very Long Trigger Name That Should Truncate In The UI To Prevent Layout Issues',
      description: 'This trigger has an extremely long name to test truncation behavior',
      chainId: 1,
      registry: 'reputation',
      enabled: true,
      isStateful: false,
      executionCount: 7,
      lastExecutedAt: new Date().toISOString(),
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-long',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'eq',
          value: '1000',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-long',
          actionType: 'telegram',
          priority: 0,
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

/**
 * Multiple trigger cards in a grid.
 * Shows how cards appear in a list view.
 */
export const TriggerGrid = {
  render: () => {
    const triggers: Trigger[] = [
      {
        id: '1',
        userId: 'user-123',
        organizationId: 'org-123',
        name: 'High Rep Alert',
        description: 'Monitor high reputation',
        chainId: 1,
        registry: 'reputation',
        enabled: true,
        isStateful: true,
        executionCount: 10,
        lastExecutedAt: new Date().toISOString(),
        conditions: [{ id: '1', triggerId: '1', conditionType: 'reputation_threshold', field: 'score', operator: 'gt', value: '800', config: {}, createdAt: new Date().toISOString() }],
        actions: [{ id: '1', triggerId: '1', actionType: 'telegram', priority: 0, config: {}, createdAt: new Date().toISOString() }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'user-123',
        organizationId: 'org-123',
        name: 'Low Rep Warning',
        description: null,
        chainId: 8453,
        registry: 'reputation',
        enabled: false,
        isStateful: false,
        executionCount: 0,
        lastExecutedAt: null,
        conditions: [{ id: '2', triggerId: '2', conditionType: 'reputation_threshold', field: 'score', operator: 'lt', value: '100', config: {}, createdAt: new Date().toISOString() }],
        actions: [{ id: '2', triggerId: '2', actionType: 'rest', priority: 0, config: {}, createdAt: new Date().toISOString() }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        userId: 'user-123',
        organizationId: 'org-123',
        name: 'Event Monitor',
        description: 'Track all events',
        chainId: 11155111,
        registry: 'reputation',
        enabled: true,
        isStateful: true,
        executionCount: 50,
        lastExecutedAt: new Date().toISOString(),
        conditions: [{ id: '3', triggerId: '3', conditionType: 'event_filter', field: 'type', operator: 'in', value: 'A,B,C', config: {}, createdAt: new Date().toISOString() }],
        actions: [{ id: '3', triggerId: '3', actionType: 'mcp', priority: 0, config: {}, createdAt: new Date().toISOString() }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        {triggers.map((trigger) => (
          <TriggerCard key={trigger.id} trigger={trigger} />
        ))}
      </div>
    )
  },
}
