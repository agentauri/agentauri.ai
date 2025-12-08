'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Logo } from './logo'
import { Button } from './button'

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['hero', 'compact', 'icon'],
    },
    animation: {
      control: 'select',
      options: ['none', 'boot'],
    },
    bootDuration: {
      control: { type: 'range', min: 500, max: 5000, step: 100 },
    },
    glow: {
      control: 'boolean',
    },
    autoPlay: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Hero variant - large, with boot animation
export const Hero: Story = {
  args: {
    variant: 'hero',
    animation: 'boot',
  },
}

// Compact variant - for navigation
export const Compact: Story = {
  args: {
    variant: 'compact',
    animation: 'none',
  },
}

// Icon variant - minimal, for small contexts
export const Icon: Story = {
  args: {
    variant: 'icon',
    animation: 'none',
  },
}

// All variants side by side
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-8 items-center">
      <div className="w-full">
        <h3 className="typo-ui text-terminal-dim mb-4">HERO (Homepage)</h3>
        <Logo variant="hero" animation="none" />
      </div>
      <div>
        <h3 className="typo-ui text-terminal-dim mb-4">COMPACT (Navigation)</h3>
        <Logo variant="compact" animation="none" />
      </div>
      <div>
        <h3 className="typo-ui text-terminal-dim mb-4">ICON (Minimal)</h3>
        <Logo variant="icon" animation="none" />
      </div>
    </div>
  ),
}

// Interactive demo with replay
export const InteractiveDemo: Story = {
  render: function InteractiveDemoRender() {
    const [key, setKey] = useState(0)
    return (
      <div className="flex flex-col items-center gap-8">
        <Logo key={key} variant="hero" animation="boot" />
        <Button variant="outline" onClick={() => setKey((k) => k + 1)}>
          REPLAY BOOT
        </Button>
      </div>
    )
  },
}

// Usage in header context
export const InHeader: Story = {
  render: () => (
    <header className="flex items-center gap-4 border-b border-terminal-green/30 p-4 w-full max-w-4xl">
      <Logo variant="compact" />
      <nav className="flex gap-4 typo-ui text-terminal-dim ml-auto">
        <span>FEATURES</span>
        <span>DOCS</span>
        <span>PRICING</span>
      </nav>
    </header>
  ),
}

// Icon in various contexts
export const IconUsage: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <Logo variant="icon" />
        <span className="typo-ui text-terminal-green">In a row with text</span>
      </div>
      <div className="flex items-center gap-2 border border-terminal-dim p-2">
        <Logo variant="icon" />
        <span className="typo-ui text-terminal-dim">|</span>
        <span className="typo-ui text-terminal-green">AGENTAURI</span>
      </div>
      <div className="flex gap-4">
        <div className="border border-terminal-dim p-2">
          <Logo variant="icon" glow={false} />
        </div>
        <div className="border border-terminal-dim p-2">
          <Logo variant="icon" glow />
        </div>
      </div>
    </div>
  ),
}

// Full hero context with CRT effects
export const InHero: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: function InHeroRender() {
    const [key, setKey] = useState(0)
    return (
      <div className="min-h-screen bg-terminal-bg p-8 flex flex-col items-center justify-center scanlines">
        <div className="crt-screen screen-glow p-8 max-w-4xl w-full">
          <Logo key={key} variant="hero" animation="boot" />
          <p className="typo-ui text-terminal-dim mt-8 text-center">
            Agent Reputation Protocol
          </p>
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setKey((k) => k + 1)}>
              REPLAY ANIMATION
            </Button>
          </div>
        </div>
      </div>
    )
  },
}
