/**
 * AgentDetail
 *
 * Displays detailed information about a linked agent including wallet address,
 * chain, linked date, and recent events. Provides actions to unlink the agent.
 *
 * @module components/organisms/AgentDetail
 *
 * @example
 * ```tsx
 * <AgentDetail
 *   agent={{
 *     id: '123',
 *     agentId: 42,
 *     walletAddress: '0x1234...',
 *     chainId: 1,
 *     linkedAt: '2024-01-01T00:00:00Z',
 *     organizationId: 'org_123'
 *   }}
 *   organizationId="org_123"
 * />
 * ```
 */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { ChainBadge, LoadingSkeleton } from '@/components/molecules'
import { AgentAddressBadge } from '@/components/molecules/AgentAddressBadge'
import { useAgentEvents, useUnlinkAgent } from '@/hooks'
import { cn } from '@/lib/utils'
import type { LinkedAgent } from '@/types/models'
import { EventCard } from './EventCard'

/**
 * Props for the AgentDetail component.
 */
interface AgentDetailProps {
  /** The linked agent data to display */
  agent: LinkedAgent
  /** The organization ID the agent is linked to */
  organizationId: string
  /** Additional CSS classes */
  className?: string
}

export function AgentDetail({ agent, organizationId, className }: AgentDetailProps) {
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false)
  const unlinkMutation = useUnlinkAgent(organizationId)

  // Fetch recent events for this agent
  const { data: eventsData, isLoading: eventsLoading } = useAgentEvents(
    agent.agentId,
    agent.chainId,
    { limit: 5 }
  )

  const handleUnlink = async () => {
    try {
      await unlinkMutation.mutateAsync(agent.walletAddress)
      setUnlinkDialogOpen(false)
      // Redirect handled by the page after successful unlink
    } catch (error) {
      console.error('Failed to unlink agent:', error)
    }
  }

  const linkedAt = new Date(agent.linkedAt).toLocaleString()
  const recentEvents = eventsData?.data ?? []

  return (
    <div data-slot="agent-detail" className={cn('space-y-6', className)}>
      {/* Header with badges */}
      <div className="flex flex-wrap items-center gap-3">
        <ChainBadge chainId={agent.chainId} />
        <span className="typo-header text-terminal-green glow">AGENT #{agent.agentId}</span>
      </div>

      {/* Basic Information */}
      <Box variant="default" padding="md">
        <h3 className="typo-ui text-terminal-green glow mb-4">&gt; AGENT INFORMATION</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; AGENT ID</div>
            <div className="typo-ui text-terminal-green text-lg">#{agent.agentId}</div>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; CHAIN</div>
            <ChainBadge chainId={agent.chainId} />
          </div>
          <div className="md:col-span-2">
            <div className="typo-ui text-terminal-dim mb-1">&gt; WALLET ADDRESS</div>
            <AgentAddressBadge address={agent.walletAddress} truncate={false} />
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; LINKED AT</div>
            <div className="typo-ui text-terminal-green">{linkedAt}</div>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; ORGANIZATION ID</div>
            <div className="typo-ui text-terminal-green font-mono text-sm">
              {agent.organizationId.slice(0, 8)}...
            </div>
          </div>
        </div>
      </Box>

      {/* Recent Events */}
      <Box variant="default" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="typo-ui text-terminal-green glow">&gt; RECENT EVENTS</h3>
          <Button variant="outline" size="sm" asChild className="typo-ui">
            <Link href={`/dashboard/events?agentId=${agent.agentId}`}>[VIEW ALL]</Link>
          </Button>
        </div>

        {eventsLoading ? (
          <LoadingSkeleton count={3} height={100} />
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="events" size="lg" className="text-terminal-dim mx-auto mb-2" />
            <p className="typo-ui text-terminal-dim">NO EVENTS RECORDED YET</p>
            <p className="typo-ui text-terminal-dim/70 text-sm mt-1">
              Events will appear here as they occur on-chain
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        )}
      </Box>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild className="typo-ui">
          <Link href="/dashboard/agents">[&lt; BACK TO AGENTS]</Link>
        </Button>
        <Button
          variant="outline"
          className="typo-ui text-destructive hover:text-destructive"
          onClick={() => setUnlinkDialogOpen(true)}
        >
          [UNLINK AGENT]
        </Button>
      </div>

      {/* Unlink Confirmation Dialog */}
      <Dialog open={unlinkDialogOpen} onOpenChange={setUnlinkDialogOpen}>
        <DialogContent className="border-2 border-terminal bg-terminal">
          <DialogHeader>
            <DialogTitle className="typo-ui text-terminal-green glow flex items-center gap-2">
              <Icon name="warning" size="sm" />
              UNLINK AGENT
            </DialogTitle>
            <DialogDescription className="typo-ui text-terminal-dim">
              Are you sure you want to unlink Agent #{agent.agentId}? You can link it again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUnlinkDialogOpen(false)}
              className="typo-ui"
            >
              [CANCEL]
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleUnlink}
              disabled={unlinkMutation.isPending}
              className="typo-ui"
            >
              {unlinkMutation.isPending ? '[UNLINKING...]' : '[CONFIRM UNLINK]'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
