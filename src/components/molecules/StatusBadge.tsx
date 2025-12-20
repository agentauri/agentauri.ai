import { Badge } from '@/components/atoms/badge'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  enabled: boolean
  className?: string
}

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
