import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TriggerForm } from './TriggerForm'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const meta = {
  title: 'Triggers/TriggerForm',
  component: TriggerForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Multi-step form for creating and editing triggers. Features validation, step navigation, and review summary.',
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TriggerForm>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty form for creating a new trigger.
 * Starts at the "Basic Info" step with default values.
 */
export const CreateNew: Story = {
  args: {
    organizationId: 'org-123',
    mode: 'create',
  },
}

/**
 * Form pre-filled with existing trigger data for editing.
 * All fields populated with realistic values.
 */
export const EditExisting: Story = {
  args: {
    organizationId: 'org-123',
    mode: 'edit',
    trigger: {
      id: 'trigger-456',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'High Reputation Alert',
      description: 'Notify when agent reputation exceeds threshold',
      chainId: 1,
      registry: 'reputation',
      enabled: true,
      isStateful: true,
      executionCount: 0,
      lastExecutedAt: null,
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-456',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'gt',
          value: '800',
          config: { threshold: 800 },
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-456',
          actionType: 'telegram',
          priority: 0,
          config: {
            chatId: '-1001234567890',
            message: 'Agent {{agentAddress}} exceeded reputation threshold!',
          },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

/**
 * Form with multiple conditions configured.
 * Shows how complex condition logic can be built.
 */
export const MultipleConditions: Story = {
  args: {
    organizationId: 'org-123',
    mode: 'edit',
    trigger: {
      id: 'trigger-789',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Complex Reputation Monitor',
      description: 'Multiple conditions for fine-grained control',
      chainId: 8453,
      registry: 'reputation',
      enabled: true,
      isStateful: false,
      executionCount: 0,
      lastExecutedAt: null,
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-789',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'gt',
          value: '500',
          config: {},
          createdAt: new Date().toISOString(),
        },
        {
          id: 'cond-2',
          triggerId: 'trigger-789',
          conditionType: 'time_condition',
          field: 'event_timestamp',
          operator: 'gt',
          value: '1704067200',
          config: {},
          createdAt: new Date().toISOString(),
        },
        {
          id: 'cond-3',
          triggerId: 'trigger-789',
          conditionType: 'agent_address',
          field: 'agent',
          operator: 'in',
          value: '0x123,0x456,0x789',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-789',
          actionType: 'rest',
          priority: 0,
          config: {
            url: 'https://api.example.com/webhook',
            method: 'POST',
          },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

/**
 * Form with multiple actions configured.
 * Shows priority ordering and different action types.
 */
export const MultipleActions: Story = {
  args: {
    organizationId: 'org-123',
    mode: 'edit',
    trigger: {
      id: 'trigger-abc',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Multi-Channel Alert',
      description: 'Send notifications via multiple channels',
      chainId: 1,
      registry: 'reputation',
      enabled: true,
      isStateful: true,
      executionCount: 0,
      lastExecutedAt: null,
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-abc',
          conditionType: 'reputation_threshold',
          field: 'reputation_score',
          operator: 'gt',
          value: '900',
          config: {},
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          triggerId: 'trigger-abc',
          actionType: 'telegram',
          priority: 0,
          config: {
            chatId: '-1001234567890',
            message: 'Critical: High reputation detected!',
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'action-2',
          triggerId: 'trigger-abc',
          actionType: 'rest',
          priority: 1,
          config: {
            url: 'https://api.example.com/alerts',
            method: 'POST',
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'action-3',
          triggerId: 'trigger-abc',
          actionType: 'mcp',
          priority: 2,
          config: {
            command: 'send_email',
            to: 'alerts@example.com',
            subject: 'High Reputation Alert',
          },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

/**
 * Form showing a disabled (inactive) trigger.
 * Can be edited but won't execute until enabled.
 */
export const DisabledTrigger: Story = {
  args: {
    organizationId: 'org-123',
    mode: 'edit',
    trigger: {
      id: 'trigger-disabled',
      userId: 'user-123',
      organizationId: 'org-123',
      name: 'Paused Monitor',
      description: 'Temporarily disabled trigger',
      chainId: 1,
      registry: 'reputation',
      enabled: false,
      isStateful: false,
      executionCount: 0,
      lastExecutedAt: null,
      conditions: [
        {
          id: 'cond-1',
          triggerId: 'trigger-disabled',
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
          triggerId: 'trigger-disabled',
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
