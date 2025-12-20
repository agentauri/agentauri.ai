import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DashboardSidebar } from './DashboardSidebar'

const meta: Meta<typeof DashboardSidebar> = {
  title: 'Layout/DashboardSidebar',
  component: DashboardSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-terminal flex">
        <Story />
        <div className="flex-1 p-6 text-terminal-green typo-ui">
          {'>'} Main content area
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DashboardSidebar>

export const DashboardActive: Story = {
  args: {
    activePath: '/dashboard',
  },
}

export const TriggersActive: Story = {
  args: {
    activePath: '/dashboard/triggers',
  },
}

export const EventsActive: Story = {
  args: {
    activePath: '/dashboard/events',
  },
}

export const AgentsActive: Story = {
  args: {
    activePath: '/dashboard/agents',
  },
}

export const ApiKeysActive: Story = {
  args: {
    activePath: '/dashboard/api-keys',
  },
}

export const SettingsActive: Story = {
  args: {
    activePath: '/dashboard/settings',
  },
}
