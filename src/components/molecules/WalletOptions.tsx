/**
 * WalletOptions
 *
 * Displays available Web3 wallet connectors (MetaMask, WalletConnect, Coinbase) with icons.
 * Handles wallet connection flow with loading states.
 *
 * @module components/molecules/WalletOptions
 *
 * @example
 * ```tsx
 * <WalletOptions
 *   onSelect={() => setDialogOpen(false)}
 *   className="mt-4"
 * />
 * ```
 */

'use client'

import { useState } from 'react'
import { useConnect } from 'wagmi'
import { Button } from '@/components/atoms/button'
import { Spinner } from '@/components/atoms/spinner'
import { getWalletIcon } from '@/components/atoms/wallet-icons'
import { cn } from '@/lib/utils'

/** Props for the WalletOptions component */
interface WalletOptionsProps {
  /** Callback when a wallet is selected */
  onSelect?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Returns display name and description for each wallet connector type.
 */
function getConnectorInfo(connectorId: string) {
  switch (connectorId) {
    case 'injected':
      return {
        name: 'Browser Wallet',
        description: 'MetaMask or injected wallet',
      }
    case 'walletConnect':
      return {
        name: 'WalletConnect',
        description: 'Scan with mobile wallet',
      }
    case 'coinbaseWalletSDK':
      return {
        name: 'Coinbase Wallet',
        description: 'Connect with Coinbase',
      }
    default:
      return {
        name: connectorId,
        description: 'Connect wallet',
      }
  }
}

/**
 * Renders a list of available wallet connectors with connection handling.
 */
export function WalletOptions({ onSelect, className }: WalletOptionsProps) {
  const { connect, connectors, isPending } = useConnect()
  const [connectingId, setConnectingId] = useState<string | null>(null)

  const handleConnect = (connector: (typeof connectors)[0]) => {
    setConnectingId(connector.id)
    connect(
      { connector },
      {
        onSettled: () => {
          setConnectingId(null)
        },
      }
    )
    onSelect?.()
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="typo-ui text-terminal-dim text-center text-sm mb-4">
        Select a wallet to connect
      </p>
      {connectors.map((connector) => {
        const info = getConnectorInfo(connector.id)
        const IconComponent = getWalletIcon(connector.id)
        const isLoading = isPending && connectingId === connector.id

        return (
          <Button
            key={connector.id}
            variant="outline"
            className={cn(
              'w-full justify-start gap-3 h-auto py-3 px-4',
              'border-terminal-dim hover:border-terminal-green',
              'hover:bg-terminal-green/10 transition-all'
            )}
            onClick={() => handleConnect(connector)}
            disabled={isPending}
          >
            <IconComponent size={24} className="shrink-0" />
            <div className="flex-1 text-left">
              <div className="typo-ui text-terminal-green">
                {isLoading ? 'Connecting...' : info.name}
              </div>
              <div className="typo-ui text-terminal-dim text-xs">
                {info.description}
              </div>
            </div>
            {isLoading && <Spinner size="sm" />}
          </Button>
        )
      })}
    </div>
  )
}
