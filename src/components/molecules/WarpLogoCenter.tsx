'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { LogoBull } from '@/components/atoms/BullLogo'

type WarpLogoAnimation = 'emerge' | 'pulse' | 'none'

interface WarpLogoCenterProps {
  /** Text to display (default: "AGENTAURI.AI") */
  text?: string
  /** Animation type */
  animation?: WarpLogoAnimation
  /** Emergence animation duration in ms (default: 2000) */
  emergeDuration?: number
  /** Callback when emergence animation completes */
  onEmergenceComplete?: () => void
  /** Additional CSS classes */
  className?: string
}

export function WarpLogoCenter({
  text = 'AGENTAURI.AI',
  animation = 'emerge',
  emergeDuration = 2000,
  onEmergenceComplete,
  className,
}: WarpLogoCenterProps) {
  const [phase, setPhase] = useState<'hidden' | 'emerging' | 'visible'>(
    animation === 'none' ? 'visible' : 'hidden'
  )

  useEffect(() => {
    if (animation === 'none') {
      setPhase('visible')
      return
    }

    // Small delay before starting emergence
    const startTimer = setTimeout(() => {
      setPhase('emerging')
    }, 500)

    // Complete emergence after duration
    const completeTimer = setTimeout(() => {
      setPhase('visible')
      onEmergenceComplete?.()
    }, 500 + emergeDuration)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(completeTimer)
    }
  }, [animation, emergeDuration, onEmergenceComplete])

  return (
    <div
      data-slot="warp-logo-center"
      className={cn(
        'relative flex flex-col items-center justify-center',
        className
      )}
    >
      {/* Bull Logo Icon */}
      <div
        className={cn(
          'mb-6',
          phase === 'hidden' && 'opacity-0',
          phase === 'emerging' && 'animate-emerge',
          phase === 'visible' && 'pixel-pulse'
        )}
        style={{ animationDuration: `${emergeDuration}ms` }}
      >
        <LogoBull size={80} glow={phase === 'visible'} />
      </div>

      {/* Main logo text */}
      <h1
        className={cn(
          'text-terminal-green text-center select-none tracking-wider',
          phase === 'hidden' && 'opacity-0',
          phase === 'emerging' && 'animate-emerge',
          phase === 'visible' && 'glow-sm pixel-pulse'
        )}
        style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 'clamp(2rem, 7vw, 5rem)',
          lineHeight: 1.2,
          animationDuration: `${emergeDuration}ms`,
        }}
        aria-label={text}
      >
        {text}
      </h1>

      {/* Subtitle */}
      <p
        className={cn(
          'typo-ui text-terminal-dim mt-6 text-center',
          'transition-opacity duration-1000',
          phase === 'visible' ? 'opacity-100' : 'opacity-0'
        )}
      >
        REPUTATION INFRASTRUCTURE FOR AUTONOMOUS AI AGENTS
      </p>
    </div>
  )
}
