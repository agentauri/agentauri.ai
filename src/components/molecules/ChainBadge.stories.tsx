import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChainBadge } from './ChainBadge'
import { SUPPORTED_CHAINS } from '@/lib/constants'

const meta: Meta<typeof ChainBadge> = {
  title: 'Molecules/ChainBadge',
  component: ChainBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    chainId: {
      control: 'select',
      options: Object.values(SUPPORTED_CHAINS),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Mainnet: Story = {
  args: {
    chainId: SUPPORTED_CHAINS.MAINNET,
  },
}

export const Base: Story = {
  args: {
    chainId: SUPPORTED_CHAINS.BASE,
  },
}

export const Sepolia: Story = {
  args: {
    chainId: SUPPORTED_CHAINS.SEPOLIA,
  },
}

export const AllChains: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChainBadge chainId={SUPPORTED_CHAINS.MAINNET} />
      <ChainBadge chainId={SUPPORTED_CHAINS.BASE} />
      <ChainBadge chainId={SUPPORTED_CHAINS.SEPOLIA} />
      <ChainBadge chainId={SUPPORTED_CHAINS.BASE_SEPOLIA} />
      <ChainBadge chainId={SUPPORTED_CHAINS.LINEA_SEPOLIA} />
      <ChainBadge chainId={SUPPORTED_CHAINS.POLYGON_AMOY} />
    </div>
  ),
}

export const UnknownChain: Story = {
  args: {
    chainId: 999999,
  },
}
