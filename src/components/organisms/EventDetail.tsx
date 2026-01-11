/**
 * EventDetail
 *
 * Displays detailed information about a blockchain event including
 * block number, timestamp, transaction hash, agent info, and raw event data.
 *
 * @module components/organisms/EventDetail
 *
 * @example
 * ```tsx
 * <EventDetail event={blockchainEvent} />
 * ```
 */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { ChainBadge, RegistryBadge, CodeBlock } from '@/components/molecules'
import { EventTypeBadge } from '@/components/molecules/EventTypeBadge'
import { cn } from '@/lib/utils'
import type { BlockchainEvent } from '@/types/models'
import { toast } from 'sonner'

/**
 * Props for the EventDetail component.
 */
interface EventDetailProps {
  /** The blockchain event data to display */
  event: BlockchainEvent
  /** Additional CSS classes */
  className?: string
}

export function EventDetail({ event, className }: EventDetailProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      toast.success(`${label} copied`)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const eventTime = new Date(event.timestamp).toLocaleString()
  const createdTime = new Date(event.createdAt).toLocaleString()

  return (
    <div data-slot="event-detail" className={cn('space-y-6', className)}>
      {/* Header with badges */}
      <div className="flex flex-wrap items-center gap-3">
        <EventTypeBadge eventType={event.eventType} />
        <ChainBadge chainId={event.chainId} />
        <RegistryBadge registry={event.registry} />
      </div>

      {/* Basic Information */}
      <Box variant="default" padding="md">
        <h3 className="typo-ui text-terminal-green glow mb-4">&gt; BASIC INFORMATION</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; BLOCK NUMBER</div>
            <div className="typo-ui text-terminal-green">#{event.blockNumber.toLocaleString()}</div>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; TIMESTAMP</div>
            <div className="typo-ui text-terminal-green">{eventTime}</div>
          </div>
          <div className="md:col-span-2">
            <div className="typo-ui text-terminal-dim mb-1">&gt; TRANSACTION HASH</div>
            <button
              type="button"
              onClick={() => copyToClipboard(event.transactionHash, 'TX Hash')}
              className="typo-ui text-terminal-green hover:text-terminal-bright flex items-center gap-2 transition-colors break-all text-left"
            >
              {event.transactionHash}
              <Icon
                name={copied === 'TX Hash' ? 'check' : 'copy'}
                size="sm"
                className="shrink-0"
              />
            </button>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; EVENT ID</div>
            <button
              type="button"
              onClick={() => copyToClipboard(event.id, 'Event ID')}
              className="typo-ui text-terminal-green hover:text-terminal-bright flex items-center gap-1 transition-colors"
            >
              {event.id.slice(0, 8)}...
              <Icon name={copied === 'Event ID' ? 'check' : 'copy'} size="xs" />
            </button>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; INDEXED AT</div>
            <div className="typo-ui text-terminal-green">{createdTime}</div>
          </div>
        </div>
      </Box>

      {/* Agent Information (if present) */}
      {event.agentId !== null && (
        <Box variant="default" padding="md">
          <h3 className="typo-ui text-terminal-green glow mb-4">&gt; AGENT INFORMATION</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; AGENT ID</div>
              <div className="typo-ui text-terminal-green text-lg">#{event.agentId}</div>
            </div>
            <Button variant="outline" size="sm" asChild className="typo-ui">
              <Link href={`/dashboard/agents/${event.agentId}`}>[VIEW AGENT]</Link>
            </Button>
          </div>
        </Box>
      )}

      {/* Event Data */}
      <Box variant="default" padding="md">
        <h3 className="typo-ui text-terminal-green glow mb-4">&gt; EVENT DATA</h3>
        <CodeBlock
          code={JSON.stringify(event.data, null, 2)}
          language="json"
          showLineNumbers
          className="max-h-96 overflow-auto"
        />
      </Box>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild className="typo-ui">
          <Link href="/dashboard/events">[&lt; BACK TO EVENTS]</Link>
        </Button>
        <Button
          variant="outline"
          className="typo-ui"
          onClick={() => copyToClipboard(JSON.stringify(event, null, 2), 'Event JSON')}
        >
          {copied === 'Event JSON' ? '[COPIED!]' : '[COPY RAW JSON]'}
        </Button>
      </div>
    </div>
  )
}
