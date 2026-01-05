import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WarpNavMenu } from './WarpNavMenu'

const meta: Meta<typeof WarpNavMenu> = {
  title: 'Molecules/WarpNavMenu',
  component: WarpNavMenu,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-48 flex items-center justify-center bg-terminal p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    visible: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {
  args: {
    visible: true,
  },
}

export const Hidden: Story = {
  args: {
    visible: false,
  },
}

export const CustomItems: Story = {
  args: {
    visible: true,
    items: [
      { label: 'HOME', href: '/' },
      { label: 'ABOUT', href: '/about' },
      { label: 'CONTACT', href: '/contact' },
    ],
  },
}

export const ManyItems: Story = {
  args: {
    visible: true,
    items: [
      { label: 'FEATURES', href: '/features' },
      { label: 'PRICING', href: '/pricing' },
      { label: 'DOCS', href: '/docs' },
      { label: 'BLOG', href: '/blog' },
      { label: 'CHANGELOG', href: '/changelog' },
      { label: 'LOGIN', href: '/login' },
    ],
  },
}

export const MinimalItems: Story = {
  args: {
    visible: true,
    items: [
      { label: 'HOME', href: '/' },
      { label: 'LOGIN', href: '/login' },
    ],
  },
}
