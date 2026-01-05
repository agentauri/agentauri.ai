import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  MetaMaskIcon,
  WalletConnectIcon,
  CoinbaseIcon,
  GoogleIcon,
  GitHubIcon,
  WalletIcon,
} from './wallet-icons'

const meta: Meta = {
  title: 'Atoms/WalletIcons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const AllWalletIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <div className="flex flex-col items-center gap-2">
        <MetaMaskIcon size={32} />
        <span className="typo-ui text-terminal-dim">METAMASK</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WalletConnectIcon size={32} />
        <span className="typo-ui text-terminal-dim">WALLETCONNECT</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CoinbaseIcon size={32} />
        <span className="typo-ui text-terminal-dim">COINBASE</span>
      </div>
    </div>
  ),
}

export const AllOAuthIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col items-center gap-2">
        <GoogleIcon size={32} />
        <span className="typo-ui text-terminal-dim">GOOGLE</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <GitHubIcon size={32} />
        <span className="typo-ui text-terminal-dim">GITHUB</span>
      </div>
    </div>
  ),
}

export const GenericWallet: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-2">
      <WalletIcon size={32} />
      <span className="typo-ui text-terminal-dim">GENERIC WALLET</span>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <MetaMaskIcon size={16} />
        <span className="typo-ui text-terminal-dim text-[8px]">16px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MetaMaskIcon size={24} />
        <span className="typo-ui text-terminal-dim text-[8px]">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MetaMaskIcon size={32} />
        <span className="typo-ui text-terminal-dim text-[8px]">32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MetaMaskIcon size={48} />
        <span className="typo-ui text-terminal-dim text-[8px]">48px</span>
      </div>
    </div>
  ),
}
