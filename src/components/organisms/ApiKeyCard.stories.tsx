import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Icon } from '@/components/atoms/icon'
import { StatusBadge } from '@/components/molecules/StatusBadge'
import { TierBadge } from '@/components/molecules/TierBadge'
import { cn } from '@/lib/utils'
import type { ApiKey } from '@/types/models'

// Mock component for Storybook (the real one uses hooks)
interface ApiKeyCardMockProps {
  apiKey: ApiKey
  className?: string
}

function ApiKeyCardMock({ apiKey, className }: ApiKeyCardMockProps) {
  const createdAt = new Date(apiKey.createdAt).toLocaleDateString()
  const lastUsed = apiKey.lastUsedAt
    ? new Date(apiKey.lastUsedAt).toLocaleDateString()
    : 'Never'
  const expiresAt = apiKey.expiresAt
    ? new Date(apiKey.expiresAt).toLocaleDateString()
    : 'Never'

  return (
    <Card
      data-slot="api-key-card"
      className={cn(
        'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
        'hover:glow-sm min-w-[320px]',
        !apiKey.enabled && 'opacity-60',
        className
      )}
    >
      <CardHeader className="border-b-2 border-terminal-dim pb-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="typo-header text-terminal-green glow">
            {apiKey.name}
          </CardTitle>
          <div className="flex gap-2">
            <TierBadge tier={apiKey.tier} />
            <StatusBadge enabled={apiKey.enabled} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4 mb-4">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; KEY PREFIX</div>
            <button
              type="button"
              className="typo-ui text-terminal-green hover:text-terminal-bright flex items-center gap-1 transition-colors font-mono"
              aria-label="Copy key prefix"
            >
              {apiKey.keyPrefix}...
              <Icon name="copy" size="xs" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; CREATED</div>
              <div className="typo-ui text-terminal-green text-sm">{createdAt}</div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; LAST USED</div>
              <div className="typo-ui text-terminal-green text-sm">{lastUsed}</div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; EXPIRES</div>
              <div className="typo-ui text-terminal-green text-sm">{expiresAt}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="typo-ui">
            {apiKey.enabled ? '[DISABLE]' : '[ENABLE]'}
          </Button>
          <Button variant="outline" size="sm" className="typo-ui">
            [REGENERATE]
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="typo-ui text-destructive hover:text-destructive"
            aria-label={`Delete API key ${apiKey.name}`}
          >
            [DELETE]
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const meta: Meta<typeof ApiKeyCardMock> = {
  title: 'Organisms/ApiKeyCard',
  component: ApiKeyCardMock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4 bg-terminal">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ApiKeyCardMock>

const mockApiKey: ApiKey = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  organizationId: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Production API Key',
  keyPrefix: 'auri_live_abc123',
  tier: 'standard',
  enabled: true,
  createdAt: '2025-01-01T00:00:00Z',
  lastUsedAt: '2025-01-15T10:30:00Z',
  expiresAt: null,
}

export const Default: Story = {
  args: {
    apiKey: mockApiKey,
  },
}

export const StandardTier: Story = {
  args: {
    apiKey: {
      ...mockApiKey,
      tier: 'standard',
    },
  },
}

export const BasicTier: Story = {
  args: {
    apiKey: {
      ...mockApiKey,
      name: 'Development Key',
      tier: 'basic',
    },
  },
}

export const FullTier: Story = {
  args: {
    apiKey: {
      ...mockApiKey,
      name: 'Enterprise Key',
      tier: 'full',
    },
  },
}

export const Disabled: Story = {
  args: {
    apiKey: {
      ...mockApiKey,
      enabled: false,
    },
  },
}

export const NeverUsed: Story = {
  args: {
    apiKey: {
      ...mockApiKey,
      name: 'New Key',
      lastUsedAt: null,
    },
  },
}

export const WithExpiration: Story = {
  args: {
    apiKey: {
      ...mockApiKey,
      expiresAt: '2025-12-31T23:59:59Z',
    },
  },
}

export const AllTiers: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ApiKeyCardMock
        apiKey={{
          ...mockApiKey,
          name: 'Basic Tier Key',
          tier: 'basic',
        }}
      />
      <ApiKeyCardMock
        apiKey={{
          ...mockApiKey,
          name: 'Standard Tier Key',
          tier: 'standard',
        }}
      />
      <ApiKeyCardMock
        apiKey={{
          ...mockApiKey,
          name: 'Full Tier Key',
          tier: 'full',
        }}
      />
      <ApiKeyCardMock
        apiKey={{
          ...mockApiKey,
          name: 'Disabled Key',
          tier: 'standard',
          enabled: false,
        }}
      />
    </div>
  ),
}
