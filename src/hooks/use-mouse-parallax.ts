'use client'

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react'

export interface UseMouseParallaxOptions {
  /** Sensitivity of parallax effect (0-1, default: 0.5) */
  sensitivity?: number
  /** Smoothing factor for lerp (0-1, default: 0.1) */
  smoothing?: number
  /** Whether parallax is enabled (default: true) */
  enabled?: boolean
}

export interface UseMouseParallaxReturn {
  /** Normalized X offset (-1 to 1) */
  offsetX: number
  /** Normalized Y offset (-1 to 1) */
  offsetY: number
  /** Combined offset object */
  offset: { x: number; y: number }
  /** Ref to attach to container element */
  containerRef: RefObject<HTMLElement | null>
}

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function useMouseParallax({
  sensitivity = 0.5,
  smoothing = 0.1,
  enabled = true,
}: UseMouseParallaxOptions = {}): UseMouseParallaxReturn {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLElement | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  const updateOffset = useCallback(() => {
    // Lerp toward target
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, smoothing)
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, smoothing)

    // Update state only if changed significantly
    const newX = Math.round(currentRef.current.x * 1000) / 1000
    const newY = Math.round(currentRef.current.y * 1000) / 1000

    setOffset(prev => {
      if (Math.abs(prev.x - newX) > 0.001 || Math.abs(prev.y - newY) > 0.001) {
        return { x: newX, y: newY }
      }
      return prev
    })

    animationRef.current = requestAnimationFrame(updateOffset)
  }, [smoothing])

  useEffect(() => {
    if (!enabled) {
      setOffset({ x: 0, y: 0 })
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) {
        // Use window center as fallback
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        targetRef.current.x = ((e.clientX - centerX) / centerX) * sensitivity
        targetRef.current.y = ((e.clientY - centerY) / centerY) * sensitivity
      } else {
        const rect = container.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        targetRef.current.x = ((e.clientX - centerX) / (rect.width / 2)) * sensitivity
        targetRef.current.y = ((e.clientY - centerY) / (rect.height / 2)) * sensitivity
      }

      // Clamp values
      targetRef.current.x = Math.max(-1, Math.min(1, targetRef.current.x))
      targetRef.current.y = Math.max(-1, Math.min(1, targetRef.current.y))
    }

    const handleMouseLeave = () => {
      // Gradually return to center
      targetRef.current = { x: 0, y: 0 }
    }

    // Start animation loop
    animationRef.current = requestAnimationFrame(updateOffset)

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [enabled, sensitivity, updateOffset])

  return {
    offsetX: offset.x,
    offsetY: offset.y,
    offset,
    containerRef,
  }
}
