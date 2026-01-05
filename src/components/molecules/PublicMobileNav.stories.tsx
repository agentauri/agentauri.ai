import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PublicMobileNav } from './PublicMobileNav'

const meta: Meta<typeof PublicMobileNav> = {
  title: 'Molecules/PublicMobileNav',
  component: PublicMobileNav,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-terminal">
        <div className="p-4">
          <p className="typo-ui text-terminal-green">Page content here</p>
          <p className="typo-ui text-terminal-dim mt-2">
            Click the MENU button at the bottom to open navigation
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isAuthenticated: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
  args: {
    isAuthenticated: false,
  },
}

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
  },
}

export const CustomItems: Story = {
  args: {
    isAuthenticated: false,
    items: [
      { href: '/home', label: 'HOME' },
      { href: '/about', label: 'ABOUT' },
      { href: '/contact', label: 'CONTACT' },
    ],
  },
}

export const CustomCTA: Story = {
  args: {
    isAuthenticated: false,
    ctaText: {
      authenticated: 'MY ACCOUNT',
      guest: 'GET STARTED',
    },
  },
}
