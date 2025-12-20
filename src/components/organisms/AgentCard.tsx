'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Icon } from '@/components/atoms/icon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { ChainBadge } from '@/components/molecules'
import { AgentAddressBadge } from '@/components/molecules/AgentAddressBadge'
import { useUnlinkAgent } from '@/hooks'
import { cn } from '@/lib/utils'
import type { LinkedAgent } from '@/types/models'

interface AgentCardProps {
  agent: LinkedAgent
  organizationId: string
  className?: string
}

export function AgentCard({ agent, organizationId, className }: AgentCardProps) {
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false)
  const unlinkMutation = useUnlinkAgent(organizationId)

  const handleUnlink = async () => {
    try {
      await unlinkMutation.mutateAsync(agent.walletAddress)
      setUnlinkDialogOpen(false)
    } catch (error) {
      console.error('Failed to unlink agent:', error)
    }
  }

  const linkedAt = new Date(agent.linkedAt).toLocaleDateString()

  return (
    <>
      <Card
        data-slot="agent-card"
        className={cn(
          'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
          'hover:glow-sm min-w-[320px]',
          className
        )}
      >
        <CardHeader className="border-b-2 border-terminal-dim pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="typo-header text-terminal-green glow">
              AGENT #{agent.agentId}
            </CardTitle>
            <ChainBadge chainId={agent.chainId} />
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-4 mb-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; WALLET ADDRESS</div>
              <AgentAddressBadge address={agent.walletAddress} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; AGENT ID</div>
                <div className="typo-ui text-terminal-green">#{agent.agentId}</div>
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; LINKED</div>
                <div className="typo-ui text-terminal-green">{linkedAt}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild className="typo-ui">
              <Link href={`/dashboard/agents/${agent.walletAddress}`}>[VIEW]</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUnlinkDialogOpen(true)}
              className="typo-ui text-destructive hover:text-destructive"
              aria-label={`Unlink agent ${agent.agentId}`}
            >
              [UNLINK]
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </>
  )
}
