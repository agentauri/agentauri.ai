import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { StatCard } from './StatCard'

const meta = {
  title: 'Shared/StatCard',
  component: StatCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  args: {
    label: 'Total Triggers',
    value: '42',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Active Triggers',
    value: '28',
    icon: 'triggers',
  },
}

export const WithChange: Story = {
  args: {
    label: 'Events Processed',
    value: '12,345',
    change: {
      value: '+15%',
      trend: 'up',
    },
  },
}

export const Highlight: Story = {
  args: {
    label: 'Success Rate',
    value: '99.8',
    suffix: '%',
    variant: 'highlight',
    change: {
      value: '+2.3%',
      trend: 'up',
    },
  },
}

export const Subtle: Story = {
  args: {
    label: 'Total Cost',
    value: '$24.50',
    variant: 'subtle',
    description: 'Last 30 days',
  },
}

export const DashboardGrid: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <Box variant="default" padding="md" className="mb-6 typo-ui text-terminal-green">
        &gt; DASHBOARD METRICS
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Triggers"
          value="42"
          icon="triggers"
          change={{ value: '+5', trend: 'up' }}
        />
        <StatCard label="Active Now" value="28" icon="active" variant="highlight" />
        <StatCard
          label="Events/Day"
          value="1.2K"
          icon="events"
          change={{ value: '+12%', trend: 'up' }}
        />
        <StatCard
          label="Success Rate"
          value="99.8"
          suffix="%"
          icon="check"
          change={{ value: '+0.3%', trend: 'up' }}
        />
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background space-y-4">
      <StatCard size="sm" label="Small" value="42" />
      <StatCard size="md" label="Medium" value="1,234" />
      <StatCard size="lg" label="Large" value="99.8%" />
    </div>
  ),
}
