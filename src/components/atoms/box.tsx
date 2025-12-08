import type * as React from 'react'
import { cn } from '@/lib/utils'

export type BoxVariant = 'default' | 'secondary' | 'subtle' | 'success' | 'error'
export type BoxPadding = 'sm' | 'md' | 'lg'

export interface BoxProps {
  children: React.ReactNode
  variant?: BoxVariant
  padding?: BoxPadding
  className?: string
}

const variantStyles: Record<BoxVariant, string> = {
  default: 'border-terminal bg-terminal/50',
  secondary: 'border-terminal bg-terminal/30',
  subtle: 'border-terminal-dim bg-terminal/20',
  success: 'border-terminal-green bg-terminal-green/10',
  error: 'border-destructive bg-destructive/10',
}

const paddingStyles: Record<BoxPadding, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Box({
  children,
  variant = 'default',
  padding = 'md',
  className,
}: BoxProps) {
  return (
    <div
      className={cn(
        'border-2',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
