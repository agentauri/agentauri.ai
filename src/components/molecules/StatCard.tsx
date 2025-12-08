/**
 * Stat card component for displaying metrics and statistics
 * Terminal/brutalist design
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/atoms/icon'

interface StatCardProps {
  label: string
  value: string | number
  icon?: IconName
  change?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  suffix?: string
  description?: string
  variant?: 'default' | 'highlight' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: ReactNode
}

const variantStyles = {
  default: {
    border: 'border-terminal',
    bg: 'bg-terminal/20',
    label: 'text-terminal-dim',
    value: 'text-terminal-bright',
  },
  highlight: {
    border: 'border-terminal-green',
    bg: 'bg-terminal-green/10',
    label: 'text-terminal-green',
    value: 'text-terminal-green glow',
  },
  subtle: {
    border: 'border-terminal-dim/50',
    bg: 'bg-terminal/10',
    label: 'text-terminal-dim/80',
    value: 'text-terminal-dim',
  },
}

const sizeStyles = {
  sm: {
    padding: 'p-3',
    labelSize: 'typo-ui',
    valueSize: 'typo-header',
  },
  md: {
    padding: 'p-4',
    labelSize: 'typo-ui',
    valueSize: 'typo-header',
  },
  lg: {
    padding: 'p-6',
    labelSize: 'typo-ui',
    valueSize: 'typo-header',
  },
}

export function StatCard({
  label,
  value,
  icon,
  change,
  suffix,
  description,
  variant = 'default',
  size = 'md',
  className,
  children,
}: StatCardProps) {
  const styles = variantStyles[variant]
  const sizes = sizeStyles[size]

  return (
    <div
      className={cn(
        'border-2',
        styles.border,
        styles.bg,
        sizes.padding,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className={cn('uppercase min-w-0 overflow-hidden flex items-center gap-2', sizes.labelSize, styles.label)}>
          {icon && <Icon name={icon} size="sm" />}
          {label}
        </div>

        {/* Change indicator */}
        {change && (
          <div
            className={cn(
              'typo-ui whitespace-nowrap shrink-0',
              change.trend === 'up' && 'text-terminal-green',
              change.trend === 'down' && 'text-destructive',
              change.trend === 'neutral' && 'text-terminal-dim'
            )}
          >
            {change.value}
          </div>
        )}
      </div>

      {/* Value */}
      <div className={cn(sizes.valueSize, styles.value)}>
        {value}
        {suffix && <span className="typo-ui ml-1">{suffix}</span>}
      </div>

      {/* Description */}
      {description && (
        <div className="typo-ui text-terminal-dim/80 mt-2">
          {description}
        </div>
      )}

      {/* Custom children */}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
