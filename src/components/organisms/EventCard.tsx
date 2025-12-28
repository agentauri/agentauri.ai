'use client'

import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Icon } from '@/components/atoms/icon'
import { ChainBadge, RegistryBadge } from '@/components/molecules'
import { EventTypeBadge } from '@/components/molecules/EventTypeBadge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { formatDateTime, formatTxHash } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BlockchainEvent } from '@/types/models'

interface EventCardProps {
  event: BlockchainEvent
  className?: string
  /** Compact mode for inline lists */
  compact?: boolean
}

export function EventCard({ event, className, compact = false }: EventCardProps) {
  const { copied, copy } = useCopyToClipboard({ successMessage: 'Transaction hash copied' })

  const truncatedHash = formatTxHash(event.transactionHash)
  const eventTime = formatDateTime(event.timestamp)

  // Compact mode for inline lists
  if (compact) {
    return (
      <Link
        href={`/dashboard/events/${event.id}`}
        data-slot="event-card-compact"
        className={cn(
          'flex items-center justify-between gap-3 p-3',
          'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
          'hover:glow-sm',
          className
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <EventTypeBadge eventType={event.eventType} />
          <span className="typo-ui text-terminal-green text-sm truncate">
            BLOCK #{event.blockNumber.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="typo-ui text-terminal-dim text-xs">
            {new Date(event.timestamp).toLocaleDateString()}
          </span>
          <Icon name="chevron-right" size="sm" className="text-terminal-dim" />
        </div>
      </Link>
    )
  }

  return (
    <Card
      data-slot="event-card"
      className={cn(
        'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
        'hover:glow-sm min-w-[320px]',
        className
      )}
    >
      <CardHeader className="border-b-2 border-terminal-dim pb-4">
        <div className="flex items-start justify-between gap-2">
          <EventTypeBadge eventType={event.eventType} />
          <div className="flex gap-2">
            <ChainBadge chainId={event.chainId} />
            <RegistryBadge registry={event.registry} />
          </div>
        </div>
        <CardTitle className="typo-ui text-terminal-green glow mt-3 text-sm">
          BLOCK #{event.blockNumber.toLocaleString()}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; TX HASH</div>
            <button
              type="button"
              onClick={() => copy(event.transactionHash)}
              className="typo-ui text-terminal-green hover:text-terminal-bright flex items-center gap-1 transition-colors"
              aria-label="Copy transaction hash"
            >
              {truncatedHash}
              <Icon name={copied ? 'check' : 'copy'} size="xs" />
            </button>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; TIME</div>
            <div className="typo-ui text-terminal-green text-xs">{eventTime}</div>
          </div>
        </div>

        {event.agentId !== null && (
          <div className="mb-4">
            <div className="typo-ui text-terminal-dim mb-1">&gt; AGENT ID</div>
            <div className="typo-ui text-terminal-green">#{event.agentId}</div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild className="typo-ui">
            <Link href={`/dashboard/events/${event.id}`}>[VIEW DETAILS]</Link>
          </Button>
          {event.agentId !== null && (
            <Button variant="outline" size="sm" asChild className="typo-ui">
              <Link href={`/dashboard/agents/${event.agentId}`}>[VIEW AGENT]</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
