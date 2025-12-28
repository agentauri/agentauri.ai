import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Spinner } from '@/components/atoms/spinner'
import { cn } from '@/lib/utils'

// Mock presentational component for Storybook
// The real WalletOptions uses wagmi hooks that require a provider
interface WalletOptionsMockProps {
  className?: string
  isConnecting?: boolean
  connectingWallet?: string
}

interface MockConnector {
  id: string
  name: string
  description: string
  icon: string
}

const MOCK_CONNECTORS: MockConnector[] = [
  {
    id: 'injected',
    name: 'Browser Wallet',
    description: 'MetaMask or injected wallet',
    icon: '🦊',
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    description: 'Scan with mobile wallet',
    icon: '🔗',
  },
  {
    id: 'coinbaseWalletSDK',
    name: 'Coinbase Wallet',
    description: 'Connect with Coinbase',
    icon: '💎',
  },
]

function WalletOptionsMock({
  className,
  isConnecting = false,
  connectingWallet,
}: WalletOptionsMockProps) {
  const [connectingId, setConnectingId] = useState<string | null>(connectingWallet ?? null)
  const isPending = isConnecting || !!connectingId

  const handleConnect = (connector: MockConnector) => {
    setConnectingId(connector.id)
    // Simulate connection delay
    setTimeout(() => setConnectingId(null), 2000)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="typo-ui text-terminal-dim text-center text-sm mb-4">
        Select a wallet to connect
      </p>
      {MOCK_CONNECTORS.map((connector) => {
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
            <span className="text-xl" aria-hidden>
              {connector.icon}
            </span>
            <div className="flex-1 text-left">
              <div className="typo-ui text-terminal-green">
                {isLoading ? 'Connecting...' : connector.name}
              </div>
              <div className="typo-ui text-terminal-dim text-xs">
                {connector.description}
              </div>
            </div>
            {isLoading && <Spinner size="sm" />}
          </Button>
        )
      })}
    </div>
  )
}

const meta: Meta<typeof WalletOptionsMock> = {
  title: 'Molecules/WalletOptions',
  component: WalletOptionsMock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isConnecting: {
      control: 'boolean',
    },
    connectingWallet: {
      control: 'select',
      options: [undefined, 'injected', 'walletConnect', 'coinbaseWalletSDK'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-terminal border border-terminal-dim rounded">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WalletOptionsMock>

export const Default: Story = {
  args: {},
}

export const ConnectingMetaMask: Story = {
  args: {
    isConnecting: true,
    connectingWallet: 'injected',
  },
}

export const ConnectingWalletConnect: Story = {
  args: {
    isConnecting: true,
    connectingWallet: 'walletConnect',
  },
}

export const ConnectingCoinbase: Story = {
  args: {
    isConnecting: true,
    connectingWallet: 'coinbaseWalletSDK',
  },
}
