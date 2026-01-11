/**
 * WarpHomepage
 *
 * Animated landing page with warp star field effect, logo emergence animation,
 * and navigation menu. Supports reduced motion preferences and responsive design.
 *
 * @module components/organisms/WarpHomepage
 *
 * @example
 * ```tsx
 * // Default with all animations
 * <WarpHomepage />
 *
 * // Custom star count and nav delay
 * <WarpHomepage starCount={300} navDelay={1000} />
 * ```
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { WarpStarField } from '@/components/atoms/WarpStarField'
import { WarpLogoCenter } from '@/components/molecules/WarpLogoCenter'
import { WarpNavMenu } from '@/components/molecules/WarpNavMenu'
import { useWarpAnimation } from '@/hooks/use-warp-animation'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'
import { cn } from '@/lib/utils'

/**
 * Props for the WarpHomepage component.
 */
interface WarpHomepageProps {
  /** Show navigation after logo emerges */
  showNav?: boolean
  /** Delay before nav appears after logo emergence (ms) */
  navDelay?: number
  /** Number of stars (reduced on mobile) */
  starCount?: number
  /** Additional CSS classes */
  className?: string
}

export function WarpHomepage({
  showNav: initialShowNav = true,
  navDelay = 500,
  starCount: initialStarCount,
  className,
}: WarpHomepageProps) {
  const [navVisible, setNavVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const checkReducedMotion = () =>
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )

    checkMobile()
    checkReducedMotion()

    window.addEventListener('resize', checkMobile)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkReducedMotion)

    return () => {
      window.removeEventListener('resize', checkMobile)
      mediaQuery.removeEventListener('change', checkReducedMotion)
    }
  }, [])

  // Determine star count based on device
  const starCount = initialStarCount ?? (isMobile ? 200 : 400)

  // Initialize warp animation
  const { stars } = useWarpAnimation({
    starCount,
    autoPlay: !prefersReducedMotion,
    baseSpeed: prefersReducedMotion ? 0 : 0.015,
  })


  // Initialize mouse parallax (disabled on mobile)
  const { offset } = useMouseParallax({
    enabled: !isMobile && !prefersReducedMotion,
    sensitivity: 0.8,
    smoothing: 0.06,
  })

  // Handle logo emergence complete
  const handleEmergenceComplete = useCallback(() => {
    if (initialShowNav) {
      setTimeout(() => {
        setNavVisible(true)
      }, navDelay)
    }
  }, [initialShowNav, navDelay])

  // Skip animation handler
  const handleSkip = useCallback(() => {
    setNavVisible(true)
  }, [])

  // Keyboard handler for skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!navVisible && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
        e.preventDefault()
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navVisible, handleSkip])

  return (
    <div
      data-slot="warp-homepage"
      className={cn(
        'relative h-screen w-screen overflow-hidden bg-terminal',
        className
      )}
    >
      {/* Star Field Layer */}
      <WarpStarField
        stars={stars}
        parallaxOffset={offset}
        className="absolute inset-0 z-0"
      />

      {/* Scanlines Overlay */}
      <div className="scanlines absolute inset-0 z-10 pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
        {/* Logo */}
        <WarpLogoCenter
          animation={prefersReducedMotion ? 'none' : 'emerge'}
          onEmergenceComplete={handleEmergenceComplete}
          className="mb-8"
        />

        {/* Navigation */}
        <WarpNavMenu visible={navVisible} className="mt-4" />

        {/* Skip hint (shown before nav appears) */}
        {!navVisible && (
          <button
            type="button"
            onClick={handleSkip}
            className={cn(
              'absolute bottom-8 left-1/2 -translate-x-1/2',
              'typo-ui text-terminal-dim',
              'hover:text-terminal-green transition-colors',
              'cursor-pointer'
            )}
            aria-label="Skip animation"
          >
            PRESS ANY KEY TO CONTINUE
          </button>
        )}
      </div>

      {/* Footer */}
      {navVisible && (
        <div className="absolute bottom-4 left-0 right-0 z-20">
          <div className="flex justify-center typo-ui text-terminal-dim">
            <span>AGENTAURI.AI {'//'} {new Date().getFullYear()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
