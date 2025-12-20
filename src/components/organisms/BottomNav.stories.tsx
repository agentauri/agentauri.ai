import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BottomNav } from './bottom-nav'

const meta: Meta<typeof BottomNav> = {
  title: 'Layout/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-terminal relative">
        <div className="p-4 text-terminal-green typo-ui">
          {'>'} Content area above bottom nav
        </div>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Public: Story = {
  args: {
    variant: 'public',
  },
}

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
    onMoreClick: () => alert('MORE clicked'),
  },
}

export const PublicActive: Story = {
  args: {
    variant: 'public',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/features',
      },
    },
  },
}

export const DashboardActive: Story = {
  args: {
    variant: 'dashboard',
    onMoreClick: () => alert('MORE clicked'),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard/triggers',
      },
    },
  },
}
