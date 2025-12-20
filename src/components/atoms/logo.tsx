'use client'

import { cn } from '@/lib/utils'
import { PixelLogo, type PixelLogoAnimation } from './pixel-logo'

export type LogoVariant = 'hero' | 'compact' | 'icon'

export interface LogoProps {
  /** Logo variant */
  variant?: LogoVariant
  /** Animation type (default: 'boot' for hero, 'none' for others) */
  animation?: PixelLogoAnimation
  /** Whether animation should play on mount (default: true) */
  autoPlay?: boolean
  /** Boot animation duration in ms (default: 2000) */
  bootDuration?: number
  /** Whether to show glow effect (default: true for hero/compact, false for icon) */
  glow?: boolean
  /** Additional CSS classes */
  className?: string
  /** Callback when animation completes */
  onAnimationComplete?: () => void
}

const LOGO_TEXT: Record<LogoVariant, string> = {
  hero: 'AGENTAURI.AI',
  compact: '[AGENTAURI.AI]',
  icon: 'A',
}

const LOGO_SIZE: Record<LogoVariant, string> = {
  hero: 'max-w-4xl',
  compact: 'max-w-[280px]',
  icon: 'max-w-[32px]',
}

export function Logo({
  variant = 'compact',
  animation,
  autoPlay = true,
  bootDuration = 2000,
  glow,
  className,
  onAnimationComplete,
}: LogoProps) {
  const text = LOGO_TEXT[variant]
  const sizeClass = LOGO_SIZE[variant]

  // Default animation: boot for hero, none for others
  const defaultAnimation: PixelLogoAnimation = variant === 'hero' ? 'boot' : 'none'
  const resolvedAnimation = animation ?? defaultAnimation

  // Default glow: true for hero/compact, false for icon
  const defaultGlow = variant !== 'icon'
  const resolvedGlow = glow ?? defaultGlow

  return (
    <div data-slot="logo">
      <PixelLogo
        text={text}
        animation={resolvedAnimation}
        autoPlay={autoPlay}
        bootDuration={bootDuration}
        glow={resolvedGlow}
        className={cn(sizeClass, className)}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  )
}
