'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { PixelLogo } from './pixel-logo'
import { Button } from './button'

const meta: Meta<typeof PixelLogo> = {
  title: 'UI/PixelLogo',
  component: PixelLogo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
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

// Default with boot animation
export const Default: Story = {
  args: {
    animation: 'boot',
    bootDuration: 2000,
  },
}

// No animation - static display
export const Static: Story = {
  args: {
    animation: 'none',
  },
}

// Fast boot
export const FastBoot: Story = {
  args: {
    animation: 'boot',
    bootDuration: 800,
  },
}

// Slow boot
export const SlowBoot: Story = {
  args: {
    animation: 'boot',
    bootDuration: 4000,
  },
}

// Without glow
export const NoGlow: Story = {
  args: {
    animation: 'none',
    glow: false,
  },
}

// Custom text
export const CustomText: Story = {
  args: {
    text: 'AGENT',
    animation: 'boot',
    bootDuration: 1500,
  },
}

// Interactive demo with replay
export const InteractiveDemo: Story = {
  render: function InteractiveDemoRender() {
    const [key, setKey] = useState(0)
    return (
      <div className="flex flex-col items-center gap-8">
        <PixelLogo key={key} animation="boot" bootDuration={2000} />
        <Button variant="outline" onClick={() => setKey((k) => k + 1)}>
          REPLAY BOOT
        </Button>
      </div>
    )
  },
}

// Full hero context
export const InHero: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: function InHeroRender() {
    const [key, setKey] = useState(0)
    return (
      <div className="min-h-screen bg-terminal-bg p-8 flex flex-col items-center justify-center scanlines">
        <div className="crt-screen screen-glow p-8">
          <PixelLogo key={key} animation="boot" bootDuration={2000} />
          <p className="typo-ui text-terminal-dim mt-8 text-center">
            Agent Reputation Protocol
          </p>
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setKey((k) => k + 1)}
            >
              REPLAY ANIMATION
            </Button>
          </div>
        </div>
      </div>
    )
  },
}

// Comparison of different texts
export const TextComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-8">
      <div>
        <h3 className="typo-ui text-terminal-dim mb-4">FULL NAME</h3>
        <PixelLogo text="AGENTAURI.AI" animation="none" />
      </div>
      <div>
        <h3 className="typo-ui text-terminal-dim mb-4">SHORT</h3>
        <PixelLogo text="AGENT" animation="none" />
      </div>
      <div>
        <h3 className="typo-ui text-terminal-dim mb-4">INITIALS</h3>
        <PixelLogo text="A.I" animation="none" />
      </div>
    </div>
  ),
}
