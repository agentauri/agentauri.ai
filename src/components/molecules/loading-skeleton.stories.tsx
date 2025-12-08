import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageSkeleton, CardSkeleton, TableSkeleton, FormSkeleton, LoadingSkeleton } from './loading-skeleton'

const meta = {
  title: 'Utility/LoadingSkeleton',
  component: PageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {
  render: () => <PageSkeleton />,
}

export const Card: Story = {
  render: () => (
    <div className="max-w-sm p-8 bg-background">
      <CardSkeleton />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const MultipleCards: Story = {
  render: () => (
    <div className="max-w-4xl p-8 bg-background grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const Table: Story = {
  render: () => (
    <div className="max-w-4xl p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; LOADING TABLE DATA
      </div>
      <TableSkeleton rows={5} />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const TableWithManyRows: Story = {
  render: () => (
    <div className="max-w-4xl p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; LOADING LARGE TABLE
      </div>
      <TableSkeleton rows={10} />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const Form: Story = {
  render: () => (
    <div className="max-w-md p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; LOADING FORM
      </div>
      <FormSkeleton />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const Custom: Story = {
  render: () => (
    <div className="max-w-2xl p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; LOADING CUSTOM CONTENT
      </div>
      <LoadingSkeleton count={3} height={100} />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const CustomTall: Story = {
  render: () => (
    <div className="max-w-2xl p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; LOADING TALL ITEMS
      </div>
      <LoadingSkeleton count={5} height={200} />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const DashboardLayout: Story = {
  render: () => (
    <div className="max-w-6xl p-8 bg-background space-y-6">
      <div className="typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; LOADING DASHBOARD
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-2 typo-ui text-terminal-dim">Recent Activity</div>
          <TableSkeleton rows={5} />
        </div>
        <div>
          <div className="mb-2 typo-ui text-terminal-dim">Details</div>
          <LoadingSkeleton count={3} height={150} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const TriggerListLayout: Story = {
  render: () => (
    <div className="max-w-6xl p-8 bg-background space-y-6">
      <div className="typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; LOADING TRIGGERS
      </div>

      {/* Filters */}
      <div className="border-2 border-terminal bg-terminal/30 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LoadingSkeleton count={4} height={40} />
        </div>
      </div>

      {/* Trigger Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LoadingSkeleton count={6} height={200} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const FormWizardLayout: Story = {
  render: () => (
    <div className="max-w-4xl p-8 bg-background space-y-6">
      <div className="typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-4">
        &gt; LOADING FORM WIZARD
      </div>

      {/* Progress */}
      <LoadingSkeleton count={1} height={60} />

      {/* Form */}
      <div className="border-2 border-terminal bg-terminal/30 p-6">
        <FormSkeleton />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <LoadingSkeleton count={2} height={40} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}
