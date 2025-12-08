import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TriggerJsonEditor } from './TriggerJsonEditor'
import type { CreateTriggerRequest } from '@/lib/validations/trigger'

const meta = {
  title: 'Triggers/TriggerJsonEditor',
  component: TriggerJsonEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TriggerJsonEditor>

export default meta
type Story = StoryObj<typeof TriggerJsonEditor>

const defaultTrigger: CreateTriggerRequest = {
  name: 'High Reputation Alert',
  description: 'Alert when reputation exceeds threshold',
  chainId: 1,
  registry: 'reputation',
  enabled: true,
  isStateful: true,
  conditions: [
    {
      conditionType: 'reputation_threshold',
      field: 'reputation_score',
      operator: 'gt',
      value: '800',
      config: {},
    },
  ],
  actions: [
    {
      actionType: 'telegram',
      priority: 0,
      config: {
        chatId: '123456789',
        message: 'Alert: {{agentAddress}} reputation is {{reputationScore}}',
      },
    },
  ],
}

const complexTrigger: CreateTriggerRequest = {
  name: 'Multi-Condition Agent Monitor',
  description: 'Monitor specific agents with multiple conditions',
  chainId: 8453,
  registry: 'identity',
  enabled: true,
  isStateful: false,
  conditions: [
    {
      conditionType: 'agent_filter',
      field: 'agent_address',
      operator: 'in',
      value: '0x1234567890abcdef,0xfedcba0987654321',
      config: {},
    },
    {
      conditionType: 'event_filter',
      field: 'event_type',
      operator: 'eq',
      value: 'ReputationUpdated',
      config: {},
    },
  ],
  actions: [
    {
      actionType: 'telegram',
      priority: 10,
      config: {
        chatId: '123456789',
        message: 'Agent {{agentAddress}} updated',
      },
    },
    {
      actionType: 'rest',
      priority: 5,
      config: {
        url: 'https://api.example.com/webhook',
        method: 'POST',
        headers: '{"Content-Type": "application/json"}',
        body: '{"event": "{{eventType}}", "agent": "{{agentAddress}}"}',
      },
    },
  ],
}

// Wrapper component to handle state
function TriggerJsonEditorWithState({ initialValue }: { initialValue: CreateTriggerRequest }) {
  const [value, setValue] = useState<CreateTriggerRequest>(initialValue)

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <div className="space-y-4">
        <div className="typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
          &gt; INTERACTIVE JSON EDITOR
        </div>
        <TriggerJsonEditor value={value} onChange={setValue} />
        <div className="border-2 border-terminal-dim bg-terminal/20 p-4">
          <div className="typo-ui text-terminal-green mb-2">&gt; Current State:</div>
          <pre className="typo-code text-terminal-dim overflow-x-auto">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <TriggerJsonEditorWithState initialValue={defaultTrigger} />,
}

export const ComplexTrigger: Story = {
  render: () => <TriggerJsonEditorWithState initialValue={complexTrigger} />,
}

export const MinimalTrigger: Story = {
  render: () => (
    <TriggerJsonEditorWithState
      initialValue={{
        name: 'Simple Trigger',
        chainId: 1,
        registry: 'reputation',
        enabled: true,
        isStateful: false,
        conditions: [
          {
            conditionType: 'reputation_threshold',
            field: 'reputation_score',
            operator: 'gt',
            value: '500',
            config: {},
          },
        ],
        actions: [
          {
            actionType: 'telegram',
            priority: 0,
            config: {},
          },
        ],
      }}
    />
  ),
}
