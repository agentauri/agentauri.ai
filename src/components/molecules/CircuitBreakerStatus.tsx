'use client'

import { Box } from '@/components/atoms/box'
import { Icon } from '@/components/atoms/icon'
import { useHealthStatus } from '@/hooks/use-health'
import { cn } from '@/lib/utils'

interface CircuitBreakerStatusProps {
  className?: string
  compact?: boolean
}

/**
 * Circuit breaker status widget showing API health
 */
export function CircuitBreakerStatus({ className, compact = false }: CircuitBreakerStatusProps) {
  const { data, isLoading, isError } = useHealthStatus()

  const status = isError || !data ? 'unhealthy' : data.status
  const isHealthy = status === 'healthy'
  const isDegraded = status === 'degraded'

  const statusConfig = {
    healthy: {
      label: 'OPERATIONAL',
      color: 'text-terminal-green',
      bgColor: 'bg-terminal-green',
      borderColor: 'border-terminal-green',
    },
    degraded: {
      label: 'DEGRADED',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-400',
    },
    unhealthy: {
      label: 'OFFLINE',
      color: 'text-destructive',
      bgColor: 'bg-destructive',
      borderColor: 'border-destructive',
    },
  }

  const config = statusConfig[status]

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('w-2 h-2 rounded-full animate-pulse', config.bgColor)} />
        <span className={cn('typo-ui text-xs', config.color)}>
          {isLoading ? 'CHECKING...' : config.label}
        </span>
      </div>
    )
  }

  return (
    <Box
      variant={isHealthy ? 'success' : isDegraded ? 'default' : 'error'}
      padding="md"
      className={cn('', className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('w-3 h-3 rounded-full animate-pulse', config.bgColor)} />
          <div>
            <div className="typo-ui text-terminal-green">&gt; SYSTEM STATUS</div>
            <div className={cn('typo-ui text-sm', config.color)}>
              {isLoading ? 'CHECKING...' : `[${config.label}]`}
            </div>
          </div>
        </div>
        <Icon
          name={isHealthy ? 'check' : isDegraded ? 'warning' : 'close'}
          size="md"
          className={config.color}
        />
      </div>

      {data?.services && !compact && (
        <div className="mt-4 pt-4 border-t border-terminal-dim">
          <div className="grid grid-cols-3 gap-4">
            {data.services.database && (
              <ServiceStatus name="DATABASE" status={data.services.database} />
            )}
            {data.services.indexer && (
              <ServiceStatus name="INDEXER" status={data.services.indexer} />
            )}
            {data.services.cache && (
              <ServiceStatus name="CACHE" status={data.services.cache} />
            )}
          </div>
        </div>
      )}
    </Box>
  )
}

function ServiceStatus({ name, status }: { name: string; status: 'up' | 'down' }) {
  const isUp = status === 'up'
  return (
    <div className="text-center">
      <div className="typo-ui text-terminal-dim text-xs mb-1">{name}</div>
      <div className={cn('typo-ui text-xs', isUp ? 'text-terminal-green' : 'text-destructive')}>
        [{isUp ? 'UP' : 'DOWN'}]
      </div>
    </div>
  )
}
