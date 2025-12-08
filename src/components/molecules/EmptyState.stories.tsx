import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { EmptyState, NoResultsState, EmptyListState, ErrorState } from './EmptyState'

const meta = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState title="NO DATA AVAILABLE" description="There is no data to display at the moment." />
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState
        title="NO TRIGGERS YET"
        description="Get started by creating your first trigger to monitor blockchain events."
        action={{
          label: 'CREATE TRIGGER',
          icon: 'add',
          onClick: () => console.log('Create trigger'),
        }}
      />
    </div>
  ),
}

export const WithSecondaryAction: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState
        icon="warning"
        title="SUBSCRIPTION REQUIRED"
        description="Upgrade your plan to access this feature."
        action={{
          label: 'UPGRADE NOW',
          icon: 'arrow-up',
          onClick: () => console.log('Upgrade'),
        }}
        secondaryAction={{
          label: 'LEARN MORE',
          icon: 'help',
          onClick: () => console.log('Learn more'),
        }}
      />
    </div>
  ),
}

export const CustomIcon: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background space-y-6">
      <EmptyState icon="events" title="NO EVENTS" description="No events recorded yet." />
      <EmptyState icon="agents" title="NO AGENTS" description="No agents registered." />
      <EmptyState icon="triggers" title="NO ACTIVITY" description="No recent activity." />
    </div>
  ),
}

export const SubtleVariant: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState variant="subtle" title="NOTHING TO SHOW" description="This section is currently empty." />
    </div>
  ),
}

export const ErrorVariant: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState
        variant="error"
        icon="warning"
        title="FAILED TO LOAD"
        description="Unable to fetch data. Please try again later."
        action={{
          label: 'RETRY',
          icon: 'retry',
          onClick: () => console.log('Retry'),
          variant: 'outline',
        }}
      />
    </div>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <div className="max-w-xl mx-auto p-8 bg-background">
      <EmptyState
        size="sm"
        title="EMPTY"
        description="No content here."
        action={{
          label: 'ADD',
          icon: 'add',
          onClick: () => console.log('Add'),
        }}
      />
    </div>
  ),
}

export const MediumSize: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState size="md" title="NO ITEMS FOUND" description="Try adjusting your search or filters." />
    </div>
  ),
}

export const LargeSize: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <EmptyState
        size="lg"
        title="WELCOME TO AGENTAURI.AI"
        description="Start by creating your first trigger to monitor blockchain events in real-time."
        action={{
          label: 'GET STARTED',
          icon: 'arrow-right',
          onClick: () => console.log('Get started'),
        }}
      />
    </div>
  ),
}

export const WithCustomChildren: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <EmptyState title="CUSTOM CONTENT" description="You can add custom content below:">
        <Box variant="subtle" padding="md" className="max-w-md mx-auto">
          <p className="typo-ui text-terminal-dim mb-2">Custom instructions:</p>
          <ul className="typo-ui text-terminal-dim/80 space-y-1 text-left">
            <li>• Step 1: Do this</li>
            <li>• Step 2: Then do that</li>
            <li>• Step 3: Finally this</li>
          </ul>
        </Box>
      </EmptyState>
    </div>
  ),
}

// Specialized variants

export const NoResults: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background space-y-6">
      <NoResultsState />
      <NoResultsState searchQuery="ethereum" />
      <NoResultsState searchQuery="test query" onClear={() => console.log('Clear filters')} />
    </div>
  ),
}

export const EmptyList: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background space-y-6">
      <EmptyListState />
      <EmptyListState itemName="trigger" onCreate={() => console.log('Create trigger')} />
      <EmptyListState itemName="agent" onCreate={() => console.log('Create agent')} />
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background space-y-6">
      <ErrorState />
      <ErrorState
        title="NETWORK ERROR"
        message="Failed to connect to the server. Check your internet connection."
        onRetry={() => console.log('Retry')}
      />
      <ErrorState title="PERMISSION DENIED" message="You don't have permission to access this resource." />
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <Box variant="default" padding="md" className="mb-6 typo-ui text-terminal-green">
        &gt; TRIGGERS LIST
      </Box>

      {/* Search/Filter bar */}
      <Box variant="default" padding="md" className="mb-6">
        <input
          type="text"
          placeholder="> SEARCH TRIGGERS..."
          className="w-full bg-transparent border-2 border-terminal-dim p-2 typo-ui text-terminal-bright"
        />
        <div className="typo-ui text-terminal-dim mt-4">&gt; SHOWING 0 RESULTS</div>
      </Box>

      {/* Empty state */}
      <EmptyListState itemName="trigger" onCreate={() => console.log('Create trigger')} />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background space-y-8">
      <Box variant="default" padding="md" className="typo-ui text-terminal-green">
        &gt; ALL EMPTY STATE VARIANTS
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="typo-ui text-terminal-dim mb-2">Default</div>
          <EmptyState title="DEFAULT" size="sm" />
        </div>

        <div>
          <div className="typo-ui text-terminal-dim mb-2">Subtle</div>
          <EmptyState variant="subtle" title="SUBTLE" size="sm" />
        </div>

        <div>
          <div className="typo-ui text-terminal-dim mb-2">Error</div>
          <ErrorState title="ERROR" />
        </div>

        <div>
          <div className="typo-ui text-terminal-dim mb-2">No Results</div>
          <NoResultsState searchQuery="test" />
        </div>

        <div>
          <div className="typo-ui text-terminal-dim mb-2">Empty List</div>
          <EmptyListState itemName="item" onCreate={() => {}} />
        </div>

        <div>
          <div className="typo-ui text-terminal-dim mb-2">With Actions</div>
          <EmptyState
            title="ACTIONS"
            size="sm"
            action={{ label: 'DO', icon: 'chevron-right', onClick: () => {} }}
            secondaryAction={{ label: 'HELP', icon: 'help', onClick: () => {} }}
          />
        </div>
      </div>
    </div>
  ),
}
