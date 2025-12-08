import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ActionBuilder } from './ActionBuilder'
import type { TriggerAction } from '@/lib/validations/trigger'

const meta = {
  title: 'Triggers/ActionBuilder',
  component: ActionBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Builder component for creating trigger actions. Supports multiple action types (Telegram, REST API, MCP) with validation and template variables.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ActionBuilder>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty action ready to be configured.
 * Shows the default state with no action type selected.
 */
export const Empty: Story = {
  args: {
    action: {
      tempId: 'action-1',
      actionType: 'telegram',
      priority: 0,
      config: {},
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Telegram notification action.
 * Sends messages to a Telegram chat with template variables.
 */
export const TelegramNotification: Story = {
  args: {
    action: {
      tempId: 'action-telegram',
      actionType: 'telegram',
      priority: 0,
      config: {
        chatId: '-1001234567890',
        message: '🚨 Alert: Agent {{agentAddress}} reputation changed to {{reputationScore}}!',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * REST API webhook action.
 * Makes HTTP requests to external APIs with custom headers and body.
 */
export const RestApiWebhook: Story = {
  args: {
    action: {
      tempId: 'action-rest',
      actionType: 'rest',
      priority: 0,
      config: {
        url: 'https://api.example.com/webhook',
        method: 'POST',
        headers: '{"Content-Type": "application/json", "Authorization": "Bearer token123"}',
        body: '{"event": "{{eventType}}", "agent": "{{agentAddress}}", "score": {{reputationScore}}}',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * REST API GET request.
 * Shows a simpler webhook with minimal configuration.
 */
export const RestApiGet: Story = {
  args: {
    action: {
      tempId: 'action-rest-get',
      actionType: 'rest',
      priority: 1,
      config: {
        url: 'https://api.example.com/notify?agent={{agentAddress}}',
        method: 'GET',
        headers: '{"X-API-Key": "secret123"}',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * MCP (Model Context Protocol) action.
 * Executes commands via MCP with parameters.
 */
export const McpAction: Story = {
  args: {
    action: {
      tempId: 'action-mcp',
      actionType: 'mcp',
      priority: 2,
      config: {
        command: 'log_reputation_event',
        parameters: '{"agent": "{{agentAddress}}", "event": "{{eventType}}", "timestamp": "{{timestamp}}"}',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * High priority action.
 * Shows action with priority 100 (executes first).
 */
export const HighPriority: Story = {
  args: {
    action: {
      tempId: 'action-priority',
      actionType: 'telegram',
      priority: 100,
      config: {
        chatId: '-1001234567890',
        message: '🔴 CRITICAL: Immediate action required for {{agentAddress}}',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Action that cannot be removed.
 * Shows disabled remove button when it's the last action.
 */
export const CannotRemove: Story = {
  args: {
    action: {
      tempId: 'action-locked',
      actionType: 'telegram',
      priority: 0,
      config: {
        chatId: '-1001234567890',
        message: 'Event notification',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: false,
  },
}

/**
 * Action with invalid JSON (validation error).
 * Shows error state for malformed JSON in headers.
 */
export const WithValidationError: Story = {
  args: {
    action: {
      tempId: 'action-error',
      actionType: 'rest',
      priority: 0,
      config: {
        url: 'https://api.example.com/webhook',
        method: 'POST',
        headers: '{invalid json}',
        body: '{"valid": "json"}',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Action with unsafe URL.
 * Demonstrates URL validation (private IPs blocked).
 */
export const WithUnsafeUrl: Story = {
  args: {
    action: {
      tempId: 'action-unsafe',
      actionType: 'rest',
      priority: 0,
      config: {
        url: 'http://localhost:3000/webhook',
        method: 'POST',
      },
    },
    onChange: () => {},
    onRemove: () => {},
    canRemove: true,
  },
}

/**
 * Interactive example with state management.
 * Demonstrates real-time updates and validation.
 */
export const Interactive = {
  render: () => {
    const [action, setAction] = useState<Partial<TriggerAction> & { tempId?: string }>({
      tempId: 'interactive-1',
      actionType: 'telegram',
      priority: 5,
      config: {
        chatId: '-1001234567890',
        message: 'Reputation alert for {{agentAddress}}',
      },
    })

    return (
      <div className="space-y-4">
        <ActionBuilder
          action={action}
          onChange={setAction}
          onRemove={() => console.log('Remove clicked')}
          canRemove={true}
        />

        <div className="border-2 border-terminal bg-terminal/30 p-4">
          <div className="typo-ui text-terminal-green mb-2">&gt; Current State:</div>
          <pre className="typo-code text-terminal-dim">
            {JSON.stringify(action, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

/**
 * Multiple actions in a list.
 * Shows how actions would appear with different priorities.
 */
export const MultipleActions = {
  render: () => {
    const [actions, setActions] = useState<Array<Partial<TriggerAction> & { tempId?: string }>>([
      {
        tempId: 'multi-1',
        actionType: 'telegram',
        priority: 0,
        config: {
          chatId: '-1001234567890',
          message: 'Low priority notification',
        },
      },
      {
        tempId: 'multi-2',
        actionType: 'rest',
        priority: 50,
        config: {
          url: 'https://api.example.com/webhook',
          method: 'POST',
          body: '{"event": "{{eventType}}"}',
        },
      },
      {
        tempId: 'multi-3',
        actionType: 'mcp',
        priority: 100,
        config: {
          command: 'log_critical',
          parameters: '{"level": "critical"}',
        },
      },
    ])

    return (
      <div className="space-y-4">
        <div className="typo-ui text-terminal-green glow mb-4">
          [ACTIONS] ({actions.length}) - Sorted by Priority
        </div>

        {actions
          .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
          .map((action, index) => (
            <ActionBuilder
              key={action.tempId}
              action={action}
              onChange={(updated) => {
                const originalIndex = actions.findIndex((a) => a.tempId === action.tempId)
                const newActions = [...actions]
                newActions[originalIndex] = updated
                setActions(newActions)
              }}
              onRemove={() => {
                setActions(actions.filter((a) => a.tempId !== action.tempId))
              }}
              canRemove={actions.length > 1}
            />
          ))}

        <div className="typo-ui text-terminal-dim">
          &gt; Higher priority actions execute first (100 → 0)
        </div>
      </div>
    )
  },
}
