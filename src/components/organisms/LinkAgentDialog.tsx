/**
 * LinkAgentDialog
 *
 * A multi-step dialog for linking an ERC-8004 agent to an organization.
 * Handles wallet connection, message signing, and agent linking verification.
 *
 * @module components/organisms/LinkAgentDialog
 *
 * @example
 * ```tsx
 * <LinkAgentDialog
 *   organizationId="org_123"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSuccess={() => console.log('Agent linked!')}
 * />
 * ```
 */
'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
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
import { useLinkAgent } from '@/hooks'
import { SUPPORTED_CHAINS, type SupportedChainId } from '@/lib/constants'

/**
 * Props for the LinkAgentDialog component.
 */
interface LinkAgentDialogProps {
  /** The organization ID to link the agent to */
  organizationId: string
  /** Whether the dialog is open */
  open: boolean
  /** Callback to control dialog open state */
  onOpenChange: (open: boolean) => void
  /** Callback when agent is successfully linked */
  onSuccess?: () => void
}

export function LinkAgentDialog({
  organizationId,
  open,
  onOpenChange,
  onSuccess,
}: LinkAgentDialogProps) {
  const [step, setStep] = useState<'form' | 'connect' | 'sign'>('form')
  const [agentId, setAgentId] = useState('')
  const [chainId, setChainId] = useState<SupportedChainId | ''>('')
  const [error, setError] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync, isPending: isSigning } = useSignMessage()

  const linkMutation = useLinkAgent(organizationId)

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  const handleSubmit = async () => {
    if (!agentId || !chainId) {
      setError('Please fill in all fields')
      return
    }

    setError(null)

    // If not connected, show connect step
    if (!isConnected) {
      setStep('connect')
      return
    }

    // Proceed to signing
    setStep('sign')
    await handleSign()
  }

  const handleSign = async () => {
    if (!address || !agentId || !chainId) return

    try {
      // Create link message
      const domain = window.location.host
      const issuedAt = new Date().toISOString()

      const message = `${domain} wants you to link Agent #${agentId} on chain ${chainId}:
${address}

I confirm that I am the owner of Agent #${agentId} and authorize agentauri.ai to track its events.

Chain ID: ${chainId}
Issued At: ${issuedAt}`

      // Sign message
      const signature = await signMessageAsync({ message })

      // Link agent
      await linkMutation.mutateAsync({
        agentId: Number.parseInt(agentId, 10),
        chainId: chainId as SupportedChainId,
        signature,
        message,
      })

      // Success - reset and close
      resetForm()
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link agent')
      setStep('form')
    }
  }

  const resetForm = () => {
    setStep('form')
    setAgentId('')
    setChainId('')
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
            <Icon name="add" size="sm" />
            LINK AGENT
          </DialogTitle>
          <DialogDescription className="typo-ui text-terminal-dim">
            Link an ERC-8004 agent to your organization by signing a message with the agent wallet.
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agentId" className="typo-ui text-terminal-dim">
                &gt; AGENT ID
              </Label>
              <Input
                id="agentId"
                type="number"
                placeholder="Enter agent ID..."
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chainId" className="typo-ui text-terminal-dim">
                &gt; CHAIN
              </Label>
              <Select
                value={chainId.toString()}
                onValueChange={(value) => setChainId(Number.parseInt(value, 10) as SupportedChainId)}
              >
                <SelectTrigger className="typo-ui border-terminal-dim bg-terminal">
                  <SelectValue placeholder="[SELECT CHAIN]" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_CHAINS).map(([name, id]) => (
                    <SelectItem key={id} value={id.toString()} className="typo-ui">
                      [{name}]
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="typo-ui text-destructive flex items-center gap-2">
                <Icon name="warning" size="sm" />
                {error}
              </p>
            )}
          </div>
        )}

        {step === 'connect' && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <Icon name="agents" size="lg" className="text-terminal-green mx-auto mb-3" />
              <p className="typo-ui text-terminal-green mb-2">CONNECT YOUR WALLET</p>
              <p className="typo-ui text-terminal-dim text-sm">
                Connect the wallet that owns Agent #{agentId} to sign the linking message.
              </p>
            </div>

            {isConnected ? (
              <div className="space-y-3">
                <div className="rounded border-2 border-terminal-dim p-3">
                  <p className="typo-ui text-terminal-dim mb-1">&gt; CONNECTED AS</p>
                  <p className="typo-ui text-terminal-green font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <Button
                  className="w-full typo-ui"
                  onClick={handleSign}
                  disabled={isSigning || linkMutation.isPending}
                >
                  {isSigning || linkMutation.isPending ? '[SIGNING...]' : '[SIGN & LINK]'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full typo-ui"
                  onClick={() => disconnect()}
                >
                  [DISCONNECT]
                </Button>
              </div>
            ) : (
              <Button
                className="w-full typo-ui"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? '[CONNECTING...]' : '[CONNECT WALLET]'}
              </Button>
            )}

            {error && (
              <p className="typo-ui text-destructive flex items-center gap-2 justify-center">
                <Icon name="warning" size="sm" />
                {error}
              </p>
            )}
          </div>
        )}

        {step === 'sign' && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <Icon name="check" size="lg" className="text-terminal-green mx-auto mb-3 animate-pulse" />
              <p className="typo-ui text-terminal-green mb-2">SIGNING MESSAGE</p>
              <p className="typo-ui text-terminal-dim text-sm">
                Please sign the message in your wallet to confirm ownership of Agent #{agentId}.
              </p>
            </div>

            {error && (
              <p className="typo-ui text-destructive flex items-center gap-2 justify-center">
                <Icon name="warning" size="sm" />
                {error}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="typo-ui"
          >
            [CANCEL]
          </Button>
          {step === 'form' && (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!agentId || !chainId}
              className="typo-ui"
            >
              [CONTINUE]
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
