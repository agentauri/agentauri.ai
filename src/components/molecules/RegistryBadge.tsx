import { Badge } from '@/components/atoms/badge'
import { Icon, type IconName } from '@/components/atoms/icon'
import type { Registry } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface RegistryBadgeProps {
  registry: Registry
  className?: string
}

const REGISTRY_LABELS: Record<Registry, string> = {
  identity: 'IDENTITY',
  reputation: 'REPUTATION',
  validation: 'VALIDATION',
}

const REGISTRY_ICONS: Record<Registry, IconName> = {
  identity: 'agents',
  reputation: 'star',
  validation: 'check',
}

const REGISTRY_COLORS: Record<Registry, string> = {
  identity: 'bg-blue-500/20 text-blue-400 border-blue-500',
  reputation: 'bg-terminal-green/20 text-terminal-bright border-terminal-green',
  validation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
}

export function RegistryBadge({ registry, className }: RegistryBadgeProps) {
  const label = REGISTRY_LABELS[registry]
  const icon = REGISTRY_ICONS[registry]
  const colorClass = REGISTRY_COLORS[registry]

  return (
    <Badge variant="outline" className={cn('typo-ui border-2 flex items-center gap-1', colorClass, className)}>
      <Icon name={icon} size="xs" />
      {label}
    </Badge>
  )
}
