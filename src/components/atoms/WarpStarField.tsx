/**
 * WarpStarField component
 *
 * Canvas-based animated star field with warp speed effect.
 * Renders stars with depth-based sizing and parallax movement.
 * Uses terminal green color palette from CSS variables.
 *
 * @module components/atoms/WarpStarField
 *
 * @example
 * ```tsx
 * const { stars, parallaxOffset } = useWarpAnimation()
 *
 * <WarpStarField
 *   stars={stars}
 *   parallaxOffset={parallaxOffset}
 *   centerDeadzone={0.15}
 * />
 * ```
 */

'use client'

import { useRef, useEffect, useCallback } from 'react'
import type { Star } from '@/hooks/use-warp-animation'
import { cn } from '@/lib/utils'

/** Default terminal colors (fallback for SSR) */
// Default terminal colors (fallback for SSR)
const DEFAULT_COLORS = {
  green: '#33FF33',
  greenDim: '#1FA91F',
  greenBright: '#66FF66',
  bg: '#0a0a0a',
}

/** Gets terminal colors from CSS custom properties with SSR fallbacks */
function getTerminalColors() {
  if (typeof window === 'undefined') {
    return DEFAULT_COLORS
  }

  const root = document.documentElement
  const style = getComputedStyle(root)

  return {
    green: style.getPropertyValue('--terminal-green').trim() || DEFAULT_COLORS.green,
    greenDim: style.getPropertyValue('--terminal-green-dim').trim() || DEFAULT_COLORS.greenDim,
    greenBright: style.getPropertyValue('--terminal-green-bright').trim() || DEFAULT_COLORS.greenBright,
    bg: style.getPropertyValue('--terminal-bg').trim() || DEFAULT_COLORS.bg,
  }
}

interface WarpStarFieldProps {
  /** Array of star objects to render */
  stars: Star[]
  /** Mouse parallax offset (-1 to 1) */
  parallaxOffset?: { x: number; y: number }
  /** Radius around center where stars fade (0-1) */
  centerDeadzone?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Canvas-rendered star field with warp speed animation
 * @param stars - Array of star objects from useWarpAnimation
 * @param parallaxOffset - Mouse-based offset for parallax effect
 * @param centerDeadzone - Radius around center where stars fade (0-1)
 */
export function WarpStarField({
  stars,
  parallaxOffset = { x: 0, y: 0 },
  centerDeadzone = 0.15,
  className,
}: WarpStarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get terminal colors from CSS variables
    const colors = getTerminalColors()

    // Get actual size
    const rect = container.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Set canvas size (handle DPR for sharpness)
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, width, height)

    // Calculate center with parallax offset
    const centerX = width / 2 + parallaxOffset.x * width * 0.15
    const centerY = height / 2 + parallaxOffset.y * height * 0.15

    // Draw each star
    for (const star of stars) {
      // Calculate screen position (perspective projection)
      const scale = 1 / (1 - star.z * 0.9)
      const screenX = centerX + star.x * scale * Math.min(width, height) * 0.5
      const screenY = centerY + star.y * scale * Math.min(width, height) * 0.5

      // Skip if outside canvas
      if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
        continue
      }

      // Calculate distance from center for deadzone fade
      const distFromCenter = Math.sqrt(
        ((screenX - centerX) / width) ** 2 + ((screenY - centerY) / height) ** 2
      )
      const centerFade = Math.min(distFromCenter / centerDeadzone, 1)

      // Skip stars in deadzone
      if (centerFade < 0.1) continue

      // Calculate star properties based on depth (z)
      const alpha = star.brightness * centerFade
      const baseSize = 1 + star.z * 3

      // Color based on brightness
      let color: string
      if (star.brightness > 0.8) {
        color = colors.greenBright
      } else if (star.brightness > 0.5) {
        color = colors.green
      } else {
        color = colors.greenDim
      }

      ctx.save()

      // Set glow effect
      ctx.shadowColor = colors.green
      ctx.shadowBlur = star.z * 15

      if (star.z < 0.6) {
        // Far stars: Draw as dots
        ctx.beginPath()
        ctx.arc(screenX, screenY, baseSize, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = alpha * 0.7
        ctx.fill()
      } else {
        // Near stars: Draw as speed lines
        const angle = Math.atan2(screenY - centerY, screenX - centerX)
        const lineLength = (star.z - 0.5) * 60 * star.speed
        const lineWidth = baseSize * 0.8

        ctx.beginPath()
        ctx.moveTo(screenX, screenY)
        ctx.lineTo(
          screenX - Math.cos(angle) * lineLength,
          screenY - Math.sin(angle) * lineLength
        )
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.lineCap = 'round'
        ctx.globalAlpha = alpha
        ctx.stroke()

        // Add bright tip
        ctx.beginPath()
        ctx.arc(screenX, screenY, baseSize * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = colors.greenBright
        ctx.globalAlpha = alpha * 0.9
        ctx.fill()
      }

      ctx.restore()
    }
  }, [stars, parallaxOffset, centerDeadzone])

  // Redraw on star changes
  useEffect(() => {
    draw()
  }, [draw])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      draw()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [draw])

  return (
    <div
      ref={containerRef}
      data-slot="warp-star-field"
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
