'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface Star {
  /** X position (-1 to 1, normalized from center) */
  x: number
  /** Y position (-1 to 1, normalized from center) */
  y: number
  /** Depth (0 = far, 1 = near) */
  z: number
  /** Individual speed multiplier */
  speed: number
  /** Brightness (0.3 to 1.0) */
  brightness: number
}

export interface UseWarpAnimationOptions {
  /** Number of stars (default: 400) */
  starCount?: number
  /** Base speed for star movement (default: 0.015) */
  baseSpeed?: number
  /** Warp factor multiplier (default: 1.0) */
  warpFactor?: number
  /** Radius around center where stars fade out (default: 0.15) */
  centerDeadzone?: number
  /** Whether to auto-play on mount (default: true) */
  autoPlay?: boolean
  /** Callback when a warp cycle completes */
  onCycleComplete?: () => void
}

export interface UseWarpAnimationReturn {
  /** Array of star objects */
  stars: Star[]
  /** Whether animation is running */
  isWarping: boolean
  /** Set the warp speed factor */
  setWarpFactor: (factor: number) => void
  /** Start the animation */
  start: () => void
  /** Stop the animation */
  stop: () => void
  /** Reset stars to initial positions */
  reset: () => void
}

function createStar(initialZ?: number): Star {
  // Random angle for uniform circular distribution
  const angle = Math.random() * Math.PI * 2
  // Random distance from center (0.1 to 0.8 to avoid exact center and edges)
  const distance = 0.1 + Math.random() * 0.7

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    z: initialZ ?? Math.random() * 0.5, // Start at various depths for initial spread
    speed: 0.5 + Math.random() * 0.5, // Speed variation (0.5 to 1.0)
    brightness: 0.3 + Math.random() * 0.7, // Brightness variation
  }
}

function initializeStars(count: number): Star[] {
  return Array.from({ length: count }, () => createStar())
}

/**
 * Hook for Star Wars-style warp speed star field animation
 *
 * Creates a dynamic star field with stars flying toward the viewer,
 * simulating hyperspace/warp speed travel. Stars spawn in the center
 * and accelerate outward with increasing brightness and size.
 *
 * Features:
 * - Configurable star count and speed
 * - Variable warp factor for speed control
 * - Visibility-aware (pauses when tab hidden)
 * - Auto-restarts on window focus
 * - Cycle completion callbacks
 *
 * @param options - Animation configuration options
 * @returns Star array and animation controls
 *
 * @example
 * ```tsx
 * function StarField() {
 *   const { stars, isWarping } = useWarpAnimation({
 *     starCount: 300,
 *     baseSpeed: 0.02,
 *   })
 *
 *   return (
 *     <canvas ref={canvasRef}>
 *       {stars.map((star, i) => (
 *         // Render star with size/brightness based on z depth
 *       ))}
 *     </canvas>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Interactive warp speed control
 * function WarpDrive() {
 *   const { stars, setWarpFactor, isWarping, start, stop } = useWarpAnimation({
 *     starCount: 500,
 *     autoPlay: false,
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={isWarping ? stop : start}>
 *         {isWarping ? 'Disengage' : 'Engage'} Warp Drive
 *       </button>
 *       <input
 *         type="range"
 *         min={0.5}
 *         max={3}
 *         step={0.1}
 *         onChange={(e) => setWarpFactor(Number(e.target.value))}
 *       />
 *       <StarFieldCanvas stars={stars} />
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Canvas rendering with star properties
 * function renderStars(ctx: CanvasRenderingContext2D, stars: Star[]) {
 *   const centerX = ctx.canvas.width / 2
 *   const centerY = ctx.canvas.height / 2
 *
 *   stars.forEach(star => {
 *     const screenX = centerX + star.x * centerX * (1 + star.z * 2)
 *     const screenY = centerY + star.y * centerY * (1 + star.z * 2)
 *     const size = 1 + star.z * 3
 *
 *     ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`
 *     ctx.beginPath()
 *     ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
 *     ctx.fill()
 *   })
 * }
 * ```
 */
export function useWarpAnimation({
  starCount = 400,
  baseSpeed = 0.015,
  warpFactor: initialWarpFactor = 1.0,
  centerDeadzone = 0.15,
  autoPlay = true,
  onCycleComplete,
}: UseWarpAnimationOptions = {}): UseWarpAnimationReturn {
  const [stars, setStars] = useState<Star[]>(() => initializeStars(starCount))
  const [isWarping, setIsWarping] = useState(false)
  const [warpFactor, setWarpFactor] = useState(initialWarpFactor)

  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const cycleCountRef = useRef<number>(0)

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setStars(initializeStars(starCount))
    setIsWarping(false)
    cycleCountRef.current = 0
  }, [starCount])

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsWarping(false)
  }, [])

  const start = useCallback(() => {
    if (animationRef.current) return // Already running

    setIsWarping(true)
    lastTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 16.67, 2) // Cap at 2x speed
      lastTimeRef.current = currentTime

      setStars(prevStars => {
        let recycledCount = 0

        const newStars = prevStars.map(star => {
          // Update depth
          const newZ = star.z + star.speed * baseSpeed * warpFactor * deltaTime

          if (newZ >= 1) {
            // Star reached the viewer, recycle it
            recycledCount++
            return createStar(0)
          }

          // Calculate perspective scale (stars appear to move faster as they get closer)
          const scale = 1 + newZ * 2

          return {
            ...star,
            z: newZ,
            // X and Y expand from center as Z increases
            x: star.x * (1 + (newZ - star.z) * 0.1),
            y: star.y * (1 + (newZ - star.z) * 0.1),
            // Brightness increases as star gets closer
            brightness: Math.min(0.3 + newZ * 0.7, 1),
          }
        })

        // Track cycles
        if (recycledCount > starCount * 0.1) {
          cycleCountRef.current++
          if (cycleCountRef.current % 10 === 0) {
            onCycleComplete?.()
          }
        }

        return newStars
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [baseSpeed, warpFactor, starCount, onCycleComplete])

  // Auto-play on mount and ensure animation is running
  useEffect(() => {
    if (autoPlay && !animationRef.current) {
      start()
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [autoPlay, start])

  // Handle visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      } else if (isWarping && !animationRef.current) {
        start()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [isWarping, start])

  // Handle page focus (restart animation when navigating back)
  useEffect(() => {
    const handleFocus = () => {
      if (autoPlay && !animationRef.current) {
        start()
      }
    }

    window.addEventListener('focus', handleFocus)
    // Also check immediately in case we're already focused
    if (autoPlay && !animationRef.current && document.hasFocus()) {
      start()
    }

    return () => window.removeEventListener('focus', handleFocus)
  }, [autoPlay, start])

  return {
    stars,
    isWarping,
    setWarpFactor,
    start,
    stop,
    reset,
  }
}
