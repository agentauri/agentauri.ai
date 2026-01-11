/**
 * EventTypeBadge
 *
 * Displays a badge for blockchain event types with type-specific icons and colors.
 * Supports common ERC-8004 events with fallback styling for unknown event types.
 *
 * @module components/molecules/EventTypeBadge
 *
 * @example
 * ```tsx
 * <EventTypeBadge eventType="AgentRegistered" />
 * <EventTypeBadge eventType="ReputationChanged" showIcon={false} />
 * ```
 */

import { Badge } from '@/components/atoms/badge'
import { Icon, type IconName } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Event type configuration mapping with icons, colors, and display labels */
const EVENT_CONFIG: Record<string, { icon: IconName; color: string; label: string }> = {
  AgentRegistered: {
    icon: 'add',
    color: 'bg-terminal-green/20 text-terminal-bright border-terminal-green',
    label: 'REGISTERED',
  },
  AgentUpdated: {
    icon: 'edit',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500',
    label: 'UPDATED',
  },
  AgentDeregistered: {
    icon: 'close',
    color: 'bg-destructive/20 text-destructive border-destructive',
    label: 'DEREGISTERED',
  },
  ReputationChanged: {
    icon: 'star',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    label: 'REPUTATION',
  },
  ValidationCompleted: {
    icon: 'check',
    color: 'bg-terminal-green/20 text-terminal-bright border-terminal-green',
    label: 'VALIDATED',
  },
  Transfer: {
    icon: 'send',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500',
    label: 'TRANSFER',
  },
  Mint: {
    icon: 'add',
    color: 'bg-terminal-green/20 text-terminal-bright border-terminal-green',
    label: 'MINT',
  },
  Burn: {
    icon: 'close',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500',
    label: 'BURN',
  },
}

/** Fallback configuration for unknown event types */
const DEFAULT_CONFIG = {
  icon: 'info' as IconName,
  color: 'bg-terminal-dim/20 text-terminal-dim border-terminal-dim',
  label: 'EVENT',
}

/** Props for the EventTypeBadge component */
interface EventTypeBadgeProps {
  eventType: string
  className?: string
  showIcon?: boolean
}

/**
 * Renders a badge displaying the blockchain event type with appropriate icon and color.
 */
export function EventTypeBadge({ eventType, className, showIcon = true }: EventTypeBadgeProps) {
  const config = EVENT_CONFIG[eventType] ?? {
    ...DEFAULT_CONFIG,
    label: eventType.toUpperCase(),
  }

  return (
    <Badge
      variant="outline"
      className={cn('typo-ui border-2 flex items-center gap-1', config.color, className)}
    >
      {showIcon && <Icon name={config.icon} size="xs" />}
      [{config.label}]
    </Badge>
  )
}
