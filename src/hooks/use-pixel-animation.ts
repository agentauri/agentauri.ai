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
  const startTimeRef = useRef<number>(0)

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
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
    setTimeout(() => {
      setGlitchingPixels(new Set())
      setPhase(prevPhase === 'idle' ? 'idle' : 'pulse')
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
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    phase,
    visiblePixels,
    glitchingPixels,
    startBoot,
    triggerGlitch,
    reset,
  }
}
