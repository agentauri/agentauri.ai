'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export type PixelAnimationPhase = 'idle' | 'boot' | 'glitch' | 'pulse'

export interface UsePixelAnimationOptions {
  /** Total number of pixels to animate */
  totalPixels: number
  /** Boot animation duration in ms (default: 2000) */
  bootDuration?: number
  /** Glitch animation duration in ms (default: 500) */
  glitchDuration?: number
  /** Whether to auto-play on mount (default: true) */
  autoPlay?: boolean
  /** Callback when boot animation completes */
  onBootComplete?: () => void
}

export interface UsePixelAnimationReturn {
  /** Current animation phase */
  phase: PixelAnimationPhase
  /** Set of pixel indices that are currently visible */
  visiblePixels: Set<number>
  /** Set of pixel indices that are currently glitching */
  glitchingPixels: Set<number>
  /** Start the boot animation */
  startBoot: () => void
  /** Trigger a glitch effect */
  triggerGlitch: () => void
  /** Reset to initial state */
  reset: () => void
}

/**
 * Hook for pixel-based boot and glitch animations
 *
 * Creates a boot-up effect where pixels progressively reveal in random
 * order, followed by optional glitch effects. Perfect for retro/terminal
 * UI boot sequences, logo reveals, and cyberpunk aesthetics.
 *
 * Animation phases:
 * - `idle`: Initial state, no pixels visible
 * - `boot`: Pixels revealing progressively
 * - `glitch`: Random pixels flickering
 * - `pulse`: All pixels visible, ready for glitch effects
 *
 * @param options - Animation configuration options
 * @returns Animation state and control functions
 *
 * @example
 * ```tsx
 * function BootScreen() {
 *   const { phase, visiblePixels, startBoot } = usePixelAnimation({
 *     totalPixels: 100,
 *     bootDuration: 3000,
 *     onBootComplete: () => console.log('System ready'),
 *   })
 *
 *   return (
 *     <div className="grid grid-cols-10">
 *       {Array.from({ length: 100 }).map((_, i) => (
 *         <div
 *           key={i}
 *           className={visiblePixels.has(i) ? 'bg-green-500' : 'bg-transparent'}
 *         />
 *       ))}
 *       {phase === 'boot' && <p>Booting...</p>}
 *       {phase === 'pulse' && <p>System Online</p>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Logo with glitch effect on hover
 * function GlitchLogo() {
 *   const { visiblePixels, glitchingPixels, triggerGlitch } = usePixelAnimation({
 *     totalPixels: 64,
 *     bootDuration: 1500,
 *   })
 *
 *   return (
 *     <div onMouseEnter={triggerGlitch} className="grid grid-cols-8">
 *       {Array.from({ length: 64 }).map((_, i) => (
 *         <div
 *           key={i}
 *           className={cn(
 *             visiblePixels.has(i) ? 'bg-green-500' : 'bg-transparent',
 *             glitchingPixels.has(i) && 'bg-red-500 animate-pulse'
 *           )}
 *         />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual boot trigger
 * function ManualBootLogo() {
 *   const { phase, visiblePixels, startBoot, reset } = usePixelAnimation({
 *     totalPixels: 36,
 *     autoPlay: false,
 *   })
 *
 *   return (
 *     <div>
 *       <PixelGrid pixels={36} visible={visiblePixels} />
 *       <button onClick={startBoot} disabled={phase === 'boot'}>
 *         Boot System
 *       </button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePixelAnimation({
  totalPixels,
  bootDuration = 2000,
  glitchDuration = 500,
  autoPlay = true,
  onBootComplete,
}: UsePixelAnimationOptions): UsePixelAnimationReturn {
  const [phase, setPhase] = useState<PixelAnimationPhase>('idle')
  const [visiblePixels, setVisiblePixels] = useState<Set<number>>(new Set())
  const [glitchingPixels, setGlitchingPixels] = useState<Set<number>>(new Set())

  const animationRef = useRef<number | null>(null)
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current)
      glitchTimeoutRef.current = null
    }
    setPhase('idle')
    setVisiblePixels(new Set())
    setGlitchingPixels(new Set())
  }, [])

  const startBoot = useCallback(() => {
    reset()
    setPhase('boot')
    startTimeRef.current = performance.now()

    // Create shuffled array of pixel indices for random reveal
    const pixelOrder: number[] = Array.from({ length: totalPixels }, (_, i) => i)
    for (let i = pixelOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = pixelOrder[i]!
      pixelOrder[i] = pixelOrder[j]!
      pixelOrder[j] = temp
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / bootDuration, 1)

      // Reveal pixels based on progress
      const pixelsToShow = Math.floor(progress * totalPixels)
      const newVisible = new Set(pixelOrder.slice(0, pixelsToShow))
      setVisiblePixels(newVisible)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Boot complete - show all pixels and transition to pulse
        setVisiblePixels(new Set(pixelOrder))
        setPhase('pulse')
        onBootComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [totalPixels, bootDuration, reset, onBootComplete])

  const triggerGlitch = useCallback(() => {
    if (phase !== 'pulse' && phase !== 'idle') return

    // Clear any existing glitch timeout
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current)
    }

    const prevPhase = phase
    setPhase('glitch')

    // Select random pixels to glitch (10-20% of total)
    const glitchCount = Math.floor(totalPixels * (0.1 + Math.random() * 0.1))
    const glitchIndices = new Set<number>()
    while (glitchIndices.size < glitchCount) {
      glitchIndices.add(Math.floor(Math.random() * totalPixels))
    }
    setGlitchingPixels(glitchIndices)

    // Clear glitch after duration
    glitchTimeoutRef.current = setTimeout(() => {
      setGlitchingPixels(new Set())
      setPhase(prevPhase === 'idle' ? 'idle' : 'pulse')
      glitchTimeoutRef.current = null
    }, glitchDuration)
  }, [phase, totalPixels, glitchDuration])

  // Auto-play boot animation on mount
  useEffect(() => {
    if (autoPlay) {
      startBoot()
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [autoPlay, startBoot]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    phase,
    visiblePixels,
    glitchingPixels,
    startBoot,
    triggerGlitch,
    reset,
  }
}
