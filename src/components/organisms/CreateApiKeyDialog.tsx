'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Icon } from '@/components/atoms/icon'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { useCreateApiKey } from '@/hooks'
import { QUERY_TIERS, type QueryTier } from '@/lib/constants'

interface CreateApiKeyDialogProps {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (key: string) => void
}

export function CreateApiKeyDialog({
  organizationId,
  open,
  onOpenChange,
  onSuccess,
}: CreateApiKeyDialogProps) {
  const [name, setName] = useState('')
  const [tier, setTier] = useState<QueryTier>('basic')
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateApiKey(organizationId)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    setError(null)

    try {
      const response = await createMutation.mutateAsync({
        name: name.trim(),
        tier,
      })
      // Success - reset and close
      resetForm()
      onOpenChange(false)
      onSuccess?.(response.key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key')
    }
  }

  const resetForm = () => {
    setName('')
    setTier('basic')
    setError(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-2 border-terminal bg-terminal">
        <DialogHeader>
          <DialogTitle className="typo-ui text-terminal-green glow flex items-center gap-2">
            <Icon name="api-keys" size="sm" />
            CREATE API KEY
          </DialogTitle>
          <DialogDescription className="typo-ui text-terminal-dim">
            Create a new API key to authenticate your applications with the AgentAuri API.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="keyName" className="typo-ui text-terminal-dim">
              &gt; KEY NAME
            </Label>
            <Input
              id="keyName"
              placeholder="Enter a name for this key..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier" className="typo-ui text-terminal-dim">
              &gt; ACCESS TIER
            </Label>
            <Select value={tier} onValueChange={(value) => setTier(value as QueryTier)}>
              <SelectTrigger className="typo-ui border-terminal-dim bg-terminal">
                <SelectValue placeholder="[SELECT TIER]" />
              </SelectTrigger>
              <SelectContent>
                {QUERY_TIERS.map((t) => (
                  <SelectItem key={t} value={t} className="typo-ui">
                    [{t.toUpperCase()}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="typo-ui text-terminal-dim/70 text-xs">
              {tier === 'basic' && 'Limited access to basic agent queries'}
              {tier === 'standard' && 'Standard access with most query capabilities'}
              {tier === 'advanced' && 'Advanced access including historical data'}
              {tier === 'full' && 'Full access to all API capabilities'}
            </p>
          </div>

          {error && (
            <p className="typo-ui text-destructive flex items-center gap-2">
              <Icon name="warning" size="sm" />
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="typo-ui"
          >
            [CANCEL]
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={createMutation.isPending || !name.trim()}
            className="typo-ui"
          >
            {createMutation.isPending ? '[CREATING...]' : '[CREATE KEY]'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
