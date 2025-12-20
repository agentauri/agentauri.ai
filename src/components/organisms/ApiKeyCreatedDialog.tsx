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
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ApiKeyCreatedDialogProps {
  apiKey: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeyCreatedDialog({
  apiKey,
  open,
  onOpenChange,
}: ApiKeyCreatedDialogProps) {
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const handleCopy = async () => {
    if (!apiKey) return

    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success('API key copied to clipboard')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleClose = () => {
    setCopied(false)
    setRevealed(false)
    onOpenChange(false)
  }

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 15)}${'*'.repeat(apiKey.length - 15)}`
    : ''

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-terminal bg-terminal max-w-lg">
        <DialogHeader>
          <DialogTitle className="typo-ui text-terminal-green glow flex items-center gap-2">
            <Icon name="check" size="sm" />
            API KEY CREATED
          </DialogTitle>
          <DialogDescription className="typo-ui text-terminal-dim">
            Make sure to copy your API key now. You won't be able to see it again!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Banner */}
          <div className="border-2 border-yellow-500/50 bg-yellow-500/10 p-3">
            <div className="flex items-start gap-2">
              <Icon name="warning" size="sm" className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="typo-ui text-yellow-500 font-bold">IMPORTANT</p>
                <p className="typo-ui text-yellow-500/80 text-sm">
                  This is the only time you will see this key. Copy it to a secure location.
                </p>
              </div>
            </div>
          </div>

          {/* Key Display */}
          <div className="space-y-2">
            <div className="typo-ui text-terminal-dim">&gt; YOUR API KEY</div>
            <div
              className={cn(
                'border-2 border-terminal-dim bg-terminal/50 p-4 rounded',
                'font-mono text-sm break-all',
                revealed ? 'text-terminal-green' : 'text-terminal-dim'
              )}
            >
              {revealed ? apiKey : maskedKey}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealed(!revealed)}
                className="typo-ui flex-1"
              >
                {revealed ? '[HIDE]' : '[REVEAL]'}
              </Button>
              <Button
                size="sm"
                onClick={handleCopy}
                className="typo-ui flex-1"
              >
                <Icon name={copied ? 'check' : 'copy'} size="sm" className="mr-1" />
                {copied ? '[COPIED!]' : '[COPY KEY]'}
              </Button>
            </div>
          </div>

          {/* Usage Example */}
          <div className="space-y-2">
            <div className="typo-ui text-terminal-dim">&gt; USAGE</div>
            <div className="border-2 border-terminal-dim bg-terminal/50 p-3 font-mono text-xs text-terminal-green overflow-x-auto">
              <pre>
{`curl -H "Authorization: Bearer ${apiKey?.slice(0, 10) || '8004_xxxx'}..." \\
  https://api.agentauri.ai/api/v1/agents`}
              </pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="typo-ui w-full">
            {copied ? '[DONE]' : '[I HAVE SAVED MY KEY]'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
