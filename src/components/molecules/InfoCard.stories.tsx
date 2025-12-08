import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InfoCard, InfoCardItem, InfoCardList } from './InfoCard'
import { ChainBadge } from '@/components/organisms/ChainBadge'
import { StatusBadge } from '@/components/organisms/StatusBadge'

const meta = {
  title: 'Shared/InfoCard',
  component: InfoCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InfoCard>

export default meta
type Story = StoryObj<typeof InfoCard>

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="TRIGGER INFORMATION">
        <InfoCardItem label="Name" value="High Reputation Alert" />
        <InfoCardItem label="Chain" value="Ethereum Mainnet" />
        <InfoCardItem label="Registry" value="Reputation" />
        <InfoCardItem label="Created" value="2024-01-15 14:30:00 UTC" />
      </InfoCard>
    </div>
  ),
}

export const Highlight: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="IMPORTANT NOTICE" variant="highlight">
        <InfoCardItem value="This trigger is currently processing events." />
        <InfoCardItem label="Status" value="Active" />
        <InfoCardItem label="Events Processed" value="1,234" />
      </InfoCard>
    </div>
  ),
}

export const Subtle: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="METADATA" variant="subtle">
        <InfoCardItem label="Last Updated" value="2 hours ago" />
        <InfoCardItem label="Updated By" value="admin@agentauri.ai" />
      </InfoCard>
    </div>
  ),
}

export const WithList: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="CONDITIONS">
        <InfoCardList
          items={[
            'reputation_score > 800',
            'agent_address in whitelist',
            'event_type = ReputationUpdated',
          ]}
        />
      </InfoCard>
    </div>
  ),
}

export const WithUnorderedList: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="FEATURES">
        <InfoCardList
          numbered={false}
          items={[
            'Real-time event monitoring',
            'Multi-chain support',
            'Custom alert rules',
            'Webhook integration',
          ]}
        />
      </InfoCard>
    </div>
  ),
}

export const WithComponents: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="TRIGGER DETAILS">
        <InfoCardItem label="Name" value="Agent Monitor" />
        <div className="flex gap-2 items-center typo-ui">
          <span className="text-terminal-dim">Chain:</span>
          <ChainBadge chainId={1} />
        </div>
        <div className="flex gap-2 items-center typo-ui">
          <span className="text-terminal-dim">Status:</span>
          <StatusBadge enabled={true} />
        </div>
      </InfoCard>
    </div>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background space-y-4">
      <InfoCard title="BASIC INFO" variant="default">
        <InfoCardItem label="Trigger ID" value="trg_1234567890" />
        <InfoCardItem label="Organization" value="Acme Corp" />
        <InfoCardItem label="Created" value="2024-01-15" />
      </InfoCard>

      <InfoCard title="ACTIVE CONDITIONS" variant="highlight">
        <InfoCardList
          items={[
            'Reputation score threshold: > 800',
            'Event type filter: ReputationUpdated',
          ]}
        />
      </InfoCard>

      <InfoCard title="STATISTICS" variant="subtle">
        <InfoCardItem label="Total Triggers" value="42" />
        <InfoCardItem label="Events Processed" value="12,345" />
        <InfoCardItem label="Success Rate" value="99.8%" />
      </InfoCard>
    </div>
  ),
}

export const ComplexContent: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <InfoCard title="AGENT DETAILS">
        <InfoCardItem label="Address" value="0x1234567890abcdef1234567890abcdef12345678" />
        <InfoCardItem label="Reputation Score" value="850 / 1000" />

        <div className="border-t border-terminal-dim pt-2 mt-2">
          <div className="typo-ui text-terminal-green mb-2">Recent Events:</div>
          <InfoCardList
            items={[
              'ReputationUpdated: +50 points',
              'AgentRegistered: New agent joined',
              'ValidationComplete: All checks passed',
            ]}
          />
        </div>

        <div className="border-t border-terminal-dim pt-2 mt-2">
          <div className="typo-ui text-terminal-green mb-2">Actions:</div>
          <InfoCardList
            numbered={false}
            items={[
              'Telegram notification sent',
              'Webhook POST to https://api.example.com',
            ]}
          />
        </div>
      </InfoCard>
    </div>
  ),
}
