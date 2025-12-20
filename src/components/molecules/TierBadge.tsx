'use client'

import { Badge } from '@/components/atoms/badge'
import { Icon, type IconName } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'
import type { QueryTier } from '@/lib/constants'

const tierConfig: Record<QueryTier, { label: string; icon: IconName; className: string }> = {
  basic: {
    label: 'BASIC',
    icon: 'star',
    className: 'border-terminal-dim text-terminal-dim',
  },
  standard: {
    label: 'STANDARD',
    icon: 'star',
    className: 'border-terminal-green text-terminal-green',
  },
  advanced: {
    label: 'ADVANCED',
    icon: 'star',
    className: 'border-yellow-500 text-yellow-500',
  },
  full: {
    label: 'FULL',
    icon: 'star',
    className: 'border-purple-500 text-purple-500',
  },
}

interface TierBadgeProps {
  tier: QueryTier
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const config = tierConfig[tier]

  return (
    <Badge
      variant="outline"
      className={cn(
        'typo-ui border-2 bg-transparent',
        config.className,
        className
      )}
    >
      <Icon name={config.icon} size="xs" className="mr-1" />
      {config.label}
    </Badge>
  )
}
