import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { Trigger } from '@/lib/validations/trigger'

const meta = {
  title: 'Triggers/TriggersList',
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard/triggers',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

// Mock trigger data
const mockTriggers: Trigger[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    organizationId: 'org-123',
    name: 'High Reputation Alert',
    description: 'Triggers when agent reputation exceeds 800 points',
    chainId: 1,
    registry: 'reputation',
    enabled: true,
    isStateful: true,
    executionCount: 42,
    lastExecutedAt: '2024-12-01T10:30:00Z',
    createdAt: '2024-11-15T08:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
    conditions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        triggerId: '550e8400-e29b-41d4-a716-446655440001',
        conditionType: 'reputation_threshold',
        field: 'reputation_score',
        operator: 'gt',
        value: '800',
        config: {},
        createdAt: '2024-11-15T08:00:00Z',
      },
    ],
    actions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        triggerId: '550e8400-e29b-41d4-a716-446655440001',
        actionType: 'telegram',
        priority: 10,
        config: { chatId: '123456789', message: 'Alert: {{agentAddress}}' },
        createdAt: '2024-11-15T08:00:00Z',
      },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    organizationId: 'org-123',
    name: 'Agent Registration Monitor',
    description: 'Monitors new agent registrations on Base',
    chainId: 8453,
    registry: 'identity',
    enabled: true,
    isStateful: false,
    executionCount: 128,
    lastExecutedAt: '2024-12-01T12:15:00Z',
    createdAt: '2024-11-10T14:00:00Z',
    updatedAt: '2024-12-01T12:15:00Z',
    conditions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        triggerId: '550e8400-e29b-41d4-a716-446655440002',
        conditionType: 'event_filter',
        field: 'event_type',
        operator: 'eq',
        value: 'AgentRegistered',
        config: {},
        createdAt: '2024-11-10T14:00:00Z',
      },
    ],
    actions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        triggerId: '550e8400-e29b-41d4-a716-446655440002',
        actionType: 'rest',
        priority: 5,
        config: {
          url: 'https://api.example.com/webhook',
          method: 'POST',
        },
        createdAt: '2024-11-10T14:00:00Z',
      },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    organizationId: 'org-123',
    name: 'Validation Failed Alert',
    description: null,
    chainId: 11155111,
    registry: 'validation',
    enabled: false,
    isStateful: true,
    executionCount: 0,
    lastExecutedAt: null,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    conditions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        triggerId: '550e8400-e29b-41d4-a716-446655440003',
        conditionType: 'field_comparison',
        field: 'validation_status',
        operator: 'eq',
        value: 'failed',
        config: {},
        createdAt: '2024-12-01T09:00:00Z',
      },
    ],
    actions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440023',
        triggerId: '550e8400-e29b-41d4-a716-446655440003',
        actionType: 'mcp',
        priority: 0,
        config: { command: 'log_event' },
        createdAt: '2024-12-01T09:00:00Z',
      },
    ],
  },
]

// Simple wrapper component that displays triggers without hooks
import { TriggerCard } from './TriggerCard'
import { LoadingSkeleton } from '@/components/molecules'

function TriggersListDisplay({
  triggers = [],
  isLoading = false,
  error = null,
}: {
  triggers?: Trigger[]
  isLoading?: boolean
  error?: Error | null
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton count={3} height={200} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-2 border-destructive bg-destructive/10 p-6 text-center">
        <p className="typo-ui text-destructive">[!] ERROR LOADING TRIGGERS</p>
        <p className="typo-ui text-destructive/80 mt-2">{error.message}</p>
      </div>
    )
  }

  if (triggers.length === 0) {
    return (
      <div className="border-2 border-terminal-dim bg-terminal/30 p-12 text-center">
        <p className="typo-ui text-terminal-dim mb-2">[~] NO TRIGGERS FOUND</p>
        <p className="typo-ui text-terminal-dim/80">
          Create your first trigger to start monitoring blockchain events
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {triggers.map((trigger) => (
        <TriggerCard key={trigger.id} trigger={trigger} />
      ))}
    </div>
  )
}

export const WithTriggers: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; TRIGGERS LIST
      </div>
      <TriggersListDisplay triggers={mockTriggers} />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; LOADING TRIGGERS
      </div>
      <TriggersListDisplay isLoading={true} />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; NO TRIGGERS
      </div>
      <TriggersListDisplay triggers={[]} />
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; ERROR STATE
      </div>
      <TriggersListDisplay error={new Error('Network request failed: Unable to fetch triggers')} />
    </div>
  ),
}

export const SingleTrigger: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; SINGLE TRIGGER
      </div>
      <TriggersListDisplay triggers={[mockTriggers[0]!]} />
    </div>
  ),
}

export const ManyTriggers: Story = {
  render: () => {
    // Create 10 triggers
    const manyTriggers: Trigger[] = Array.from({ length: 10 }, (_, i) => ({
      ...mockTriggers[i % mockTriggers.length]!,
      id: `trigger-${i}`,
      name: `Trigger ${i + 1}`,
    }))

    return (
      <div className="max-w-6xl mx-auto p-8 bg-background">
        <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
          &gt; MANY TRIGGERS
        </div>
        <div className="mb-4 typo-ui text-terminal-dim border-2 border-terminal-dim bg-terminal/20 p-3">
          Showing {manyTriggers.length} triggers
        </div>
        <TriggersListDisplay triggers={manyTriggers} />
      </div>
    )
  },
}

export const MixedStates: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <div className="mb-6 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; MIXED STATES (ENABLED & DISABLED)
      </div>
      <TriggersListDisplay triggers={mockTriggers} />
      <div className="mt-4 typo-ui text-terminal-dim border-2 border-terminal-dim bg-terminal/20 p-3">
        • {mockTriggers.filter(t => t.enabled).length} enabled triggers
        <br />
        • {mockTriggers.filter(t => !t.enabled).length} disabled triggers
      </div>
    </div>
  ),
}
