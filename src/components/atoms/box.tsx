import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

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

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  children: React.ReactNode
}

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
