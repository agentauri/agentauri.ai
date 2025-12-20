import type { Meta, StoryObj } from '@storybook/react'
import {
  LogoBull,
  LogoBullAnimated,
  LogoBullBoot,
  LogoBullGlitch,
  LogoBullWithText,
} from './BullLogo'

const meta: Meta<typeof LogoBull> = {
  title: 'Atoms/Bull Logo',
  component: LogoBull,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0a0a0a' }],
    },
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 128, step: 8 },
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'minimal'],
    },
    glow: {
      control: 'boolean',
    },
    animation: {
      control: 'select',
      options: ['none', 'pulse', 'breathe'],
    },
  },
}

export default meta
type Story = StoryObj<typeof LogoBull>

/**
 * Default filled logo with glow
 */
export const Default: Story = {
  args: {
    size: 64,
    variant: 'filled',
    glow: true,
  },
}

/**
 * All 3 variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <h3 className="typo-ui text-[#33FF33]">LOGO VARIANTS</h3>
      <div className="flex gap-12 items-center">
        <div className="flex flex-col items-center gap-4">
          <LogoBull size={80} variant="filled" />
          <span className="typo-code text-[#1a8c1a]">FILLED</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <LogoBull size={80} variant="outline" />
          <span className="typo-code text-[#1a8c1a]">OUTLINE</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <LogoBull size={80} variant="minimal" />
          <span className="typo-code text-[#1a8c1a]">MINIMAL</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * Multiple sizes from favicon to hero
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <h3 className="typo-ui text-[#33FF33]">SIZE SCALE</h3>
      <div className="flex gap-6 items-end">
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={16} />
          <span className="typo-code text-[#1a8c1a] text-xs">16px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={24} />
          <span className="typo-code text-[#1a8c1a] text-xs">24px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={32} />
          <span className="typo-code text-[#1a8c1a] text-xs">32px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={48} />
          <span className="typo-code text-[#1a8c1a] text-xs">48px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={64} />
          <span className="typo-code text-[#1a8c1a] text-xs">64px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={96} />
          <span className="typo-code text-[#1a8c1a] text-xs">96px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LogoBull size={128} />
          <span className="typo-code text-[#1a8c1a] text-xs">128px</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * Animated logo with pulsing glow
 */
export const Animated: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <h3 className="typo-ui text-[#33FF33]">ANIMATED (PULSE GLOW)</h3>
      <LogoBullAnimated size={96} />
      <p className="typo-code text-[#1a8c1a] max-w-sm text-center">
        Continuous pulsing glow effect.
        Ideal for loading states or hero sections.
      </p>
    </div>
  ),
}

/**
 * Boot animation - reveals logo on load
 */
export const BootAnimation: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <h3 className="typo-ui text-[#33FF33]">BOOT ANIMATION</h3>
      <LogoBullBoot size={96} duration={1500} />
      <p className="typo-code text-[#1a8c1a] max-w-sm text-center">
        Scale + blur reveal animation.
        Refresh to replay.
      </p>
    </div>
  ),
}

/**
 * Glitch effect on hover
 */
export const GlitchOnHover: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <h3 className="typo-ui text-[#33FF33]">GLITCH ON HOVER</h3>
      <LogoBullGlitch size={96} />
      <p className="typo-code text-[#1a8c1a] max-w-sm text-center">
        Hover to trigger glitch shake.
        Color shifts to bright green.
      </p>
    </div>
  ),
}

/**
 * Logo with text branding
 */
export const WithText: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <h3 className="typo-ui text-[#33FF33]">LOGO + TEXT</h3>
      <div className="flex flex-col gap-6">
        <LogoBullWithText size={48} />
        <LogoBullWithText size={32} />
        <LogoBullWithText size={24} />
        <LogoBullWithText size={16} />
      </div>
    </div>
  ),
}

/**
 * Without glow for comparison
 */
export const NoGlow: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <h3 className="typo-ui text-[#33FF33]">GLOW vs NO GLOW</h3>
      <div className="flex gap-12">
        <div className="flex flex-col items-center gap-4">
          <LogoBull size={64} glow={true} />
          <span className="typo-code text-[#1a8c1a]">WITH GLOW</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <LogoBull size={64} glow={false} />
          <span className="typo-code text-[#1a8c1a]">NO GLOW</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * Favicon test at actual size
 */
export const FaviconTest: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <h3 className="typo-ui text-[#33FF33]">FAVICON TEST (16x16)</h3>
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 border border-[#33FF33] flex items-center justify-center">
            <LogoBull size={16} glow={false} variant="filled" />
          </div>
          <span className="typo-code text-[#1a8c1a] text-xs">FILLED</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 border border-[#33FF33] flex items-center justify-center">
            <LogoBull size={16} glow={false} variant="minimal" />
          </div>
          <span className="typo-code text-[#1a8c1a] text-xs">MINIMAL</span>
        </div>
      </div>
      <p className="typo-code text-[#1a8c1a] text-xs">
        Minimal variant recommended for favicon (cleaner at small sizes)
      </p>
    </div>
  ),
}

/**
 * All animations showcase
 */
export const AnimationsShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <h3 className="typo-ui text-[#33FF33]">ALL ANIMATIONS</h3>
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col items-center gap-4 p-6 border-2 border-[#1a8c1a]">
          <LogoBull size={64} />
          <span className="typo-code text-[#1a8c1a]">STATIC</span>
        </div>
        <div className="flex flex-col items-center gap-4 p-6 border-2 border-[#1a8c1a]">
          <LogoBullAnimated size={64} />
          <span className="typo-code text-[#1a8c1a]">PULSE</span>
        </div>
        <div className="flex flex-col items-center gap-4 p-6 border-2 border-[#1a8c1a]">
          <LogoBullGlitch size={64} />
          <span className="typo-code text-[#1a8c1a]">GLITCH</span>
        </div>
      </div>
    </div>
  ),
}

/**
 * Dark vs light background test
 */
export const BackgroundTest: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="p-8 bg-[#0a0a0a] border-2 border-[#33FF33]">
        <LogoBull size={64} />
      </div>
      <div className="p-8 bg-[#1a1a1a] border-2 border-[#33FF33]">
        <LogoBull size={64} />
      </div>
      <div className="p-8 bg-[#0a0a0a] border-2 border-[#33FF33]">
        <LogoBull size={64} glow={false} />
      </div>
    </div>
  ),
}
