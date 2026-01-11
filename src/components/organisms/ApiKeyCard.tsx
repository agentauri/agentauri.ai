/**
 * ApiKeyCard
 *
 * Displays a summary card for an API key with status and tier badges.
 * Includes actions to enable/disable, regenerate, and delete the key.
 *
 * @module components/organisms/ApiKeyCard
 *
 * @example
 * ```tsx
 * <ApiKeyCard
 *   apiKey={{
 *     id: '123',
 *     name: 'Production Key',
 *     keyPrefix: '8004_abc123',
 *     tier: 'standard',
 *     enabled: true
 *   }}
 *   onRegenerate={(newKey) => console.log('New key:', newKey)}
 * />
 * ```
 */
'use client'

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
import { StatusBadge } from '@/components/molecules/StatusBadge'
import { TierBadge } from '@/components/molecules/TierBadge'
import { useDeleteApiKey, useUpdateApiKey, useRegenerateApiKey, useCopyToClipboard } from '@/hooks'
import { formatDate, formatDateOrDefault } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ApiKey } from '@/types/models'

/**
 * Props for the ApiKeyCard component.
 */
interface ApiKeyCardProps {
  /** The API key data to display */
  apiKey: ApiKey
  /** Additional CSS classes */
  className?: string
  /** Callback when a key is regenerated with the new key value */
  onRegenerate?: (newKey: string) => void
}

export function ApiKeyCard({ apiKey, className, onRegenerate }: ApiKeyCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)

  const { copied, copy } = useCopyToClipboard({ successMessage: 'Key prefix copied' })
  const deleteMutation = useDeleteApiKey()
  const updateMutation = useUpdateApiKey()
  const regenerateMutation = useRegenerateApiKey()

  const handleToggleEnabled = async () => {
    try {
      await updateMutation.mutateAsync({
        keyId: apiKey.id,
        request: { enabled: !apiKey.enabled },
      })
    } catch (error) {
      console.error('Failed to toggle API key:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(apiKey.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  const handleRegenerate = async () => {
    try {
      const response = await regenerateMutation.mutateAsync(apiKey.id)
      setRegenerateDialogOpen(false)
      onRegenerate?.(response.key)
    } catch (error) {
      console.error('Failed to regenerate API key:', error)
    }
  }

  const createdAt = formatDate(apiKey.createdAt)
  const lastUsed = formatDateOrDefault(apiKey.lastUsedAt)
  const expiresAt = formatDateOrDefault(apiKey.expiresAt)

  return (
    <>
      <Card
        data-slot="api-key-card"
        className={cn(
          'border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors',
          'hover:glow-sm min-w-[320px]',
          !apiKey.enabled && 'opacity-60',
          className
        )}
      >
        <CardHeader className="border-b-2 border-terminal-dim pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="typo-header text-terminal-green glow">
              {apiKey.name}
            </CardTitle>
            <div className="flex gap-2">
              <TierBadge tier={apiKey.tier} />
              <StatusBadge enabled={apiKey.enabled} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-4 mb-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; KEY PREFIX</div>
              <button
                type="button"
                onClick={() => copy(apiKey.keyPrefix)}
                className="typo-ui text-terminal-green hover:text-terminal-bright flex items-center gap-1 transition-colors font-mono"
                aria-label="Copy key prefix"
              >
                {apiKey.keyPrefix}...
                <Icon name={copied ? 'check' : 'copy'} size="xs" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; CREATED</div>
                <div className="typo-ui text-terminal-green text-sm">{createdAt}</div>
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; LAST USED</div>
                <div className="typo-ui text-terminal-green text-sm">{lastUsed}</div>
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; EXPIRES</div>
                <div className="typo-ui text-terminal-green text-sm">{expiresAt}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleEnabled}
              disabled={updateMutation.isPending}
              className="typo-ui"
            >
              {apiKey.enabled ? '[DISABLE]' : '[ENABLE]'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegenerateDialogOpen(true)}
              className="typo-ui"
            >
              [REGENERATE]
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="typo-ui text-destructive hover:text-destructive"
              aria-label={`Delete API key ${apiKey.name}`}
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
              DELETE API KEY
            </DialogTitle>
            <DialogDescription className="typo-ui text-terminal-dim">
              Are you sure you want to delete "{apiKey.name}"? This action cannot be undone.
              Any applications using this key will stop working.
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

      {/* Regenerate Confirmation Dialog */}
      <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <DialogContent className="border-2 border-terminal bg-terminal">
          <DialogHeader>
            <DialogTitle className="typo-ui text-terminal-green glow flex items-center gap-2">
              <Icon name="warning" size="sm" />
              REGENERATE API KEY
            </DialogTitle>
            <DialogDescription className="typo-ui text-terminal-dim">
              Regenerating will create a new key and invalidate the current one.
              Any applications using the old key will need to be updated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegenerateDialogOpen(false)}
              className="typo-ui"
            >
              [CANCEL]
            </Button>
            <Button
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerateMutation.isPending}
              className="typo-ui"
            >
              {regenerateMutation.isPending ? '[REGENERATING...]' : '[CONFIRM REGENERATE]'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
