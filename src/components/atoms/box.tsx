/**
 * Box component
 *
 * Generic container with terminal-styled borders.
 * Supports multiple visual variants and padding sizes.
 *
 * @module components/atoms/box
 *
 * @example
 * ```tsx
 * <Box>Default content</Box>
 * <Box variant="success" padding="lg">Success message</Box>
 * <Box variant="error">Error content</Box>
 * ```
 */

import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/** Box style variants using class-variance-authority */
const boxVariants = cva('border-2', {
  variants: {
    variant: {
      default: 'border-terminal bg-terminal/50',
      secondary: 'border-terminal bg-terminal/30',
      subtle: 'border-terminal-dim bg-terminal/20',
      success: 'border-terminal-green bg-terminal-green/10',
      error: 'border-destructive bg-destructive/10',
    },
    padding: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

/**
 * Box component props
 *
 * @param variant - Visual style: default, secondary, subtle, success, error
 * @param padding - Padding size: sm, md, lg
 */
export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  children: React.ReactNode
}

/** Container with terminal-styled borders and variants */
export function Box({
  children,
  variant,
  padding,
  className,
  ...props
}: BoxProps) {
  return (
    <div
      data-slot="box"
      className={cn(boxVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { boxVariants }

// Export variant type for components that need it
export type BoxVariant = NonNullable<VariantProps<typeof boxVariants>['variant']>
