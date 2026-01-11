/**
 * Spinner component
 *
 * Circular loading indicator with terminal colors.
 * Includes proper ARIA attributes for accessibility.
 *
 * @module components/atoms/spinner
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="sm" />
 * <Spinner size="lg" />
 * ```
 */

'use client'

import { cn } from '@/lib/utils'

/**
 * Spinner props
 *
 * @param size - Size preset: sm (16px), md (24px), lg (32px)
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

/** Circular loading indicator with terminal styling */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="status" is correct for live regions (loading indicators)
    <div
      data-slot="spinner"
      className={cn(
        'animate-spin border-2 border-terminal-dim border-t-terminal-green rounded-full',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
