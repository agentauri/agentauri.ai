/**
 * EmptyState
 *
 * Generic empty state component for displaying empty lists, no search results,
 * or error states with terminal/brutalist aesthetic. Includes primary and secondary actions.
 *
 * @module components/molecules/EmptyState
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="events"
 *   title="NO TRIGGERS YET"
 *   description="Create your first trigger to get started"
 *   action={{ label: 'CREATE TRIGGER', onClick: handleCreate }}
 * />
 * ```
 */

import type { ReactNode } from 'react'
import { Button } from '@/components/atoms/button'
import { Icon, type IconName } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Props for the EmptyState component */
interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
    icon?: IconName
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: IconName
  }
  children?: ReactNode
  variant?: 'default' | 'subtle' | 'error'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Renders a centered empty state with icon, title, description, and optional actions.
 */
export function EmptyState({
  icon = 'events',
  title,
  description,
  action,
  secondaryAction,
  children,
  variant = 'default',
  className,
  size = 'md',
}: EmptyStateProps) {
  const variantStyles = {
    default: {
      border: 'border-terminal-dim',
      bg: 'bg-terminal/30',
      title: 'text-terminal-dim',
      desc: 'text-terminal-dim/80',
    },
    subtle: {
      border: 'border-terminal-dim/50',
      bg: 'bg-terminal/10',
      title: 'text-terminal-dim/80',
      desc: 'text-terminal-dim/60',
    },
    error: {
      border: 'border-destructive/30',
      bg: 'bg-destructive/5',
      title: 'text-destructive',
      desc: 'text-destructive/80',
    },
  }

  const sizeStyles = {
    sm: {
      padding: 'p-6',
      iconSize: 'lg' as const,
      titleSize: 'typo-ui',
      descSize: 'typo-ui',
    },
    md: {
      padding: 'p-12',
      iconSize: 'xl' as const,
      titleSize: 'typo-header',
      descSize: 'typo-ui',
    },
    lg: {
      padding: 'p-16',
      iconSize: 'xl' as const,
      titleSize: 'typo-header',
      descSize: 'typo-ui',
    },
  }

  const styles = variantStyles[variant]
  const sizes = sizeStyles[size]

  return (
    <div
      className={cn(
        'border-2 text-center',
        styles.border,
        styles.bg,
        sizes.padding,
        className
      )}
    >
      {/* Icon */}
      <div className={cn('mb-4', styles.title)}>
        <Icon name={icon} size={sizes.iconSize} />
      </div>

      {/* Title */}
      <h3 className={cn('mb-2', sizes.titleSize, styles.title)}>{title}</h3>

      {/* Description */}
      {description && (
        <p className={cn('mb-6 max-w-md mx-auto', sizes.descSize, styles.desc)}>
          {description}
        </p>
      )}

      {/* Custom children */}
      {children && <div className="mb-6">{children}</div>}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant ?? 'default'}
              className="typo-ui"
            >
              {action.icon && <Icon name={action.icon} size="sm" className="mr-1" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="typo-ui"
            >
              {secondaryAction.icon && <Icon name={secondaryAction.icon} size="sm" className="mr-1" />}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * NoResultsState
 *
 * Pre-configured empty state for search results with optional clear filters action.
 */
export function NoResultsState({
  searchQuery,
  onClear,
  className,
}: {
  searchQuery?: string
  onClear?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon="help"
      title="NO RESULTS FOUND"
      description={
        searchQuery
          ? `No results for "${searchQuery}". Try adjusting your filters or search query.`
          : 'No results match your current filters. Try adjusting your search criteria.'
      }
      action={
        onClear
          ? {
              label: 'CLEAR FILTERS',
              onClick: onClear,
              variant: 'outline',
              icon: 'close',
            }
          : undefined
      }
      variant="subtle"
      size="md"
      className={className}
    />
  )
}

/**
 * EmptyListState
 *
 * Pre-configured empty state for empty lists with optional create action.
 */
export function EmptyListState({
  itemName = 'items',
  onCreate,
  className,
}: {
  itemName?: string
  onCreate?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon="events"
      title={`NO ${itemName.toUpperCase()} YET`}
      description={`Get started by creating your first ${itemName}.`}
      action={
        onCreate
          ? {
              label: `CREATE ${itemName.toUpperCase()}`,
              onClick: onCreate,
              icon: 'add',
            }
          : undefined
      }
      size="md"
      className={className}
    />
  )
}

/**
 * ErrorState
 *
 * Pre-configured empty state for error conditions with optional retry action.
 */
export function ErrorState({
  title = 'SOMETHING WENT WRONG',
  message,
  onRetry,
  className,
}: {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon="warning"
      title={title}
      description={message ?? 'An unexpected error occurred. Please try again.'}
      action={
        onRetry
          ? {
              label: 'RETRY',
              onClick: onRetry,
              variant: 'outline',
              icon: 'retry',
            }
          : undefined
      }
      variant="error"
      size="md"
      className={className}
    />
  )
}
