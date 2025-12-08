'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { Icon } from '@/components/atoms/icon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { useDeleteTrigger, useToggleTrigger } from '@/hooks'
import { sanitizeHtml } from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import type { Trigger } from '@/types/models'
import { ChainBadge } from './ChainBadge'
import { RegistryBadge } from './RegistryBadge'
import { StatusBadge } from './StatusBadge'

interface TriggerCardProps {
  trigger: Trigger
  className?: string
}

export function TriggerCard({ trigger, className }: TriggerCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toggle: toggleTrigger, isPending: isToggling } = useToggleTrigger()
  const deleteMutation = useDeleteTrigger()

  const handleToggle = async () => {
    await toggleTrigger(trigger)
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(trigger.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      // Dialog stays open, error is shown via toast from mutation
      console.error('Failed to delete trigger:', error)
    }
  }

  const lastExecuted = trigger.lastExecutedAt
    ? new Date(trigger.lastExecutedAt).toLocaleString()
    : 'NEVER'

  return (
    <>
      <Card
        className={cn(
          'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
          'hover:glow-sm min-w-[320px]',
          className
        )}
      >
        <CardHeader className="border-b-2 border-terminal-dim pb-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="typo-ui text-terminal-green glow mb-2 truncate">
              {sanitizeHtml(trigger.name)}
            </CardTitle>
            {trigger.description && (
              <CardDescription className="typo-ui text-terminal-dim">
                {sanitizeHtml(trigger.description)}
              </CardDescription>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <StatusBadge enabled={trigger.enabled} />
            <ChainBadge chainId={trigger.chainId} />
            <RegistryBadge registry={trigger.registry} />
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; EXECUTIONS</div>
              <div className="typo-ui text-terminal-green">
                {trigger.executionCount}
              </div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; LAST RUN</div>
              <div className="typo-ui text-terminal-green">{lastExecuted}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; CONDITIONS</div>
              <div className="typo-ui text-terminal-green">
                {trigger.conditions?.length ?? 0}
              </div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; ACTIONS</div>
              <div className="typo-ui text-terminal-green">
                {trigger.actions?.length ?? 0}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild className="typo-ui">
              <Link href={`/dashboard/triggers/${trigger.id}`}>[VIEW]</Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              disabled={isToggling}
              className="typo-ui"
              aria-label={`${trigger.enabled ? 'Disable' : 'Enable'} trigger ${trigger.name}`}
            >
              {isToggling ? '[...]' : trigger.enabled ? '[DISABLE]' : '[ENABLE]'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="typo-ui text-destructive hover:text-destructive"
              aria-label={`Delete trigger ${trigger.name}`}
            >
              [DELETE]
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-2 border-terminal bg-terminal">
          <DialogHeader>
            <DialogTitle className="typo-ui text-terminal-green glow flex items-center gap-2">
              <Icon name="warning" size="sm" />
              DELETE TRIGGER
            </DialogTitle>
            <DialogDescription className="typo-ui text-terminal-dim">
              Are you sure you want to delete "{sanitizeHtml(trigger.name)}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              className="typo-ui"
            >
              [CANCEL]
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="typo-ui"
            >
              {deleteMutation.isPending ? '[DELETING...]' : '[CONFIRM DELETE]'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
