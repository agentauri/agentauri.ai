/**
 * StatusBadge
 *
 * Displays an enabled/disabled status indicator with corresponding icon and styling.
 * Uses glow effect for enabled state and muted styling for disabled.
 *
 * @module components/molecules/StatusBadge
 *
 * @example
 * ```tsx
 * <StatusBadge enabled={true} />
 * <StatusBadge enabled={false} className="ml-2" />
 * ```
 */

import { Badge } from '@/components/atoms/badge'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Props for the StatusBadge component */
interface StatusBadgeProps {
  enabled: boolean
  className?: string
}

/**
 * Renders a badge showing enabled/disabled status with appropriate icon and glow effect.
 */
export function StatusBadge({ enabled, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={enabled ? 'default' : 'outline'}
      className={cn(
        'typo-ui border-2 flex items-center gap-1',
        enabled
          ? 'bg-terminal-green/20 text-terminal-bright border-terminal-green glow-sm'
          : 'bg-transparent text-terminal-dim border-terminal-dim',
        className
      )}
    >
      <Icon name={enabled ? 'active' : 'inactive'} size="xs" />
      {enabled ? 'ENABLED' : 'DISABLED'}
    </Badge>
  )
}
