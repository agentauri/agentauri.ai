/**
 * ActionLabel component
 *
 * Clickable text button with optional icon.
 * Used for secondary actions like "Add", "Remove", "Edit".
 *
 * @module components/atoms/action-label
 *
 * @example
 * ```tsx
 * <ActionLabel icon="add">Add Item</ActionLabel>
 * <ActionLabel variant="destructive" icon="remove">Remove</ActionLabel>
 * ```
 */

import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from './icon'

/** ActionLabel style variants */
const actionLabelVariants = cva(
  'inline-flex items-center gap-1 cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-50 font-pixel tracking-wide',
  {
    variants: {
      variant: {
        default: 'text-terminal-dim hover:text-terminal-green',
        destructive: 'text-destructive hover:text-destructive/80',
        warning: 'text-yellow-500 hover:text-yellow-400',
        muted: 'text-terminal-dim/60 hover:text-terminal-dim',
      },
      size: {
        sm: 'text-[11px] leading-normal',
        lg: 'text-[13px] leading-relaxed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

/**
 * ActionLabel props
 *
 * @param variant - Visual style: default, destructive, warning, muted
 * @param size - Size preset: sm, lg
 * @param icon - Optional icon name from Icon component
 */
interface ActionLabelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionLabelVariants> {
  icon?: IconName
}

/** Clickable text button with optional icon */
function ActionLabel({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: ActionLabelProps) {
  return (
    <button
      data-slot="action-label"
      type="button"
      className={cn(actionLabelVariants({ variant, size, className }))}
      {...props}
    >
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </button>
  )
}

export { ActionLabel, actionLabelVariants }
