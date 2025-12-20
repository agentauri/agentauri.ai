import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { MobileMenu } from './mobile-menu'

const meta: Meta<typeof MobileMenu> = {
  title: 'Layout/MobileMenu',
  component: MobileMenu,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof MobileMenu>

// Wrapper component to handle state
function MobileMenuWithState({ activePath }: { activePath?: string }) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-terminal-green typo-ui border-2 border-terminal px-4 py-2 hover:bg-terminal-green hover:text-terminal-bg transition-colors"
        >
          [OPEN MENU]
        </button>
      </div>
    )
  }

  return (
    <MobileMenu
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      activePath={activePath}
    />
  )
}

export const Interactive: Story = {
  render: () => <MobileMenuWithState activePath="/dashboard" />,
}

export const DashboardActive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    activePath: '/dashboard',
  },
}

export const TriggersActive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    activePath: '/dashboard/triggers',
  },
}

export const EventsActive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    activePath: '/dashboard/events',
  },
}

export const AgentsActive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    activePath: '/dashboard/agents',
  },
}

export const ApiKeysActive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    activePath: '/dashboard/api-keys',
  },
}

export const SettingsActive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    activePath: '/dashboard/settings',
  },
}
