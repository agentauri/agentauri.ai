import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PublicNav, } from './public-nav'

const meta: Meta<typeof PublicNav> = {
  title: 'Layout/PublicNav',
  component: PublicNav,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-terminal min-h-[300px]">
        <Story />
        <div className="p-6 text-terminal-green typo-ui">{'>'} Page content below navigation</div>
      </div>
    ),
  ],
  argTypes: {
    items: {
      description: 'Navigation items with optional badges and icons',
      control: 'object',
    },
    branding: {
      description: 'Logo text and href',
      control: 'object',
    },
    isAuthenticated: {
      description: 'Whether user is authenticated',
      control: 'boolean',
    },
    showSeparators: {
      description: 'Show vertical separators between sections',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof PublicNav>

/**
 * Default public navigation with standard items
 */
export const Default: Story = {
  args: {
    isAuthenticated: false,
  },
}

/**
 * Navigation when user is authenticated - shows different CTA
 */
export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
  },
}

/**
 * Active state on Features page
 */
export const ActiveFeatures: Story = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/features',
      },
    },
  },
}

/**
 * Active state on Pricing page
 */
export const ActivePricing: Story = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/pricing',
      },
    },
  },
}

/**
 * Navigation with badges highlighting new or beta sections
 */
export const WithBadges: Story = {
  args: {
    isAuthenticated: false,
    items: [
      { href: '/features', label: 'FEATURES' },
      {
        href: '/pricing',
        label: 'PRICING',
        badge: { text: 'NEW', variant: 'default' },
      },
      {
        href: '/docs',
        label: 'DOCS',
        badge: { text: 'BETA', variant: 'destructive' },
      },
      { href: '/changelog', label: 'CHANGELOG' },
    ],
  },
}

/**
 * Navigation with icons preceding each link
 */
export const WithIcons: Story = {
  args: {
    isAuthenticated: false,
    items: [
      { href: '/features', label: 'FEATURES', icon: 'chevron-right' },
      { href: '/pricing', label: 'PRICING', icon: 'star' },
      { href: '/docs', label: 'DOCS', icon: 'help' },
      { href: '/changelog', label: 'CHANGELOG', icon: 'events' },
    ],
  },
}

/**
 * Fully customized navigation with custom items, branding, and CTA text
 */
export const CustomItems: Story = {
  args: {
    isAuthenticated: false,
    items: [
      { href: '/solutions', label: 'SOLUTIONS', icon: 'api-keys' },
      {
        href: '/api',
        label: 'API',
        icon: 'triggers',
        badge: { text: 'v2', variant: 'outline' },
      },
      { href: '/community', label: 'COMMUNITY', icon: 'agents' },
    ],
    branding: {
      text: '[MY-PLATFORM]',
      href: '/',
    },
    ctaText: {
      authenticated: 'CONSOLE',
      guest: 'GET STARTED',
    },
  },
}

/**
 * Navigation without visual separators for cleaner look
 */
export const WithoutSeparators: Story = {
  args: {
    isAuthenticated: false,
    showSeparators: false,
  },
}

/**
 * Custom branding with different logo text
 */
export const CustomBranding: Story = {
  args: {
    isAuthenticated: false,
    branding: {
      text: '[TERMINAL-UI]',
      href: '/',
    },
  },
}

/**
 * Complete example with icons, badges, and custom branding
 */
export const CompleteExample: Story = {
  args: {
    isAuthenticated: true,
    items: [
      {
        href: '/features',
        label: 'FEATURES',
        icon: 'chevron-right',
      },
      {
        href: '/pricing',
        label: 'PRICING',
        icon: 'star',
        badge: { text: 'SALE', variant: 'destructive' },
      },
      {
        href: '/docs',
        label: 'DOCS',
        icon: 'help',
        badge: { text: 'NEW', variant: 'default' },
      },
      {
        href: '/changelog',
        label: 'CHANGELOG',
        icon: 'events',
      },
    ],
    branding: {
      text: '[AGENTAURI.AI]',
      href: '/',
    },
    ctaText: {
      authenticated: 'MY DASHBOARD',
      guest: 'SIGN UP FREE',
    },
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/docs',
      },
    },
  },
}

/**
 * Grid showing all possible states side by side
 */
export const AllStates: Story = {
  render: () => (
    <div className="bg-terminal space-y-8 p-8">
      <div>
        <div className="typo-ui text-terminal-green mb-2">&gt; DEFAULT</div>
        <PublicNav />
      </div>

      <div>
        <div className="typo-ui text-terminal-green mb-2">&gt; WITH BADGES</div>
        <PublicNav
          items={[
            { href: '/features', label: 'FEATURES' },
            {
              href: '/pricing',
              label: 'PRICING',
              badge: { text: 'NEW', variant: 'default' },
            },
            { href: '/docs', label: 'DOCS' },
          ]}
        />
      </div>

      <div>
        <div className="typo-ui text-terminal-green mb-2">&gt; WITH ICONS</div>
        <PublicNav
          items={[
            { href: '/features', label: 'FEATURES', icon: 'chevron-right' },
            { href: '/pricing', label: 'PRICING', icon: 'star' },
            { href: '/docs', label: 'DOCS', icon: 'help' },
          ]}
        />
      </div>

      <div>
        <div className="typo-ui text-terminal-green mb-2">&gt; WITHOUT SEPARATORS</div>
        <PublicNav showSeparators={false} />
      </div>

      <div>
        <div className="typo-ui text-terminal-green mb-2">&gt; AUTHENTICATED</div>
        <PublicNav isAuthenticated={true} />
      </div>
    </div>
  ),
}
