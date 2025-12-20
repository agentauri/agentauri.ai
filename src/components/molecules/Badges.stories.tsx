import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { ChainBadge } from './ChainBadge'
import { RegistryBadge } from './RegistryBadge'
import { StatusBadge } from './StatusBadge'

/**
 * Badge components for displaying trigger metadata.
 * Includes status, chain, and registry type indicators with color-coded styling.
 */
const meta = {
  title: 'Triggers/Badges',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Collection of badge components used throughout the trigger interface to display status, blockchain, and registry information.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

/**
 * Status badges show whether a trigger is enabled or disabled.
 */
export const StatusBadges: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Enabled State</div>
        <StatusBadge enabled={true} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Disabled State</div>
        <StatusBadge enabled={false} />
      </div>
    </div>
  ),
}

/**
 * Chain badges display the blockchain network.
 * Each chain has a unique color scheme for easy identification.
 */
export const ChainBadges: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Ethereum Mainnet</div>
        <ChainBadge chainId={SUPPORTED_CHAINS.MAINNET} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Base</div>
        <ChainBadge chainId={SUPPORTED_CHAINS.BASE} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Sepolia Testnet</div>
        <ChainBadge chainId={SUPPORTED_CHAINS.SEPOLIA} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Base Sepolia</div>
        <ChainBadge chainId={SUPPORTED_CHAINS.BASE_SEPOLIA} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Linea Sepolia</div>
        <ChainBadge chainId={SUPPORTED_CHAINS.LINEA_SEPOLIA} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Polygon Amoy</div>
        <ChainBadge chainId={SUPPORTED_CHAINS.POLYGON_AMOY} />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Unsupported Chain (9999)</div>
        <ChainBadge chainId={9999} />
      </div>
    </div>
  ),
}

/**
 * Registry badges indicate the ERC-8004 registry type.
 * Each registry type has its own icon and color.
 */
export const RegistryBadges: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Identity Registry</div>
        <RegistryBadge registry="identity" />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Reputation Registry</div>
        <RegistryBadge registry="reputation" />
      </div>

      <div>
        <div className="typo-ui text-terminal-dim mb-2">&gt; Validation Registry</div>
        <RegistryBadge registry="validation" />
      </div>
    </div>
  ),
}

/**
 * All badges together showing typical usage in trigger cards.
 */
export const AllBadges: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div className="border-2 border-terminal bg-terminal/30 p-4">
        <div className="typo-ui text-terminal-green glow mb-4">
          [TRIGGER: High Reputation Alert]
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge enabled={true} />
        </div>

        <div className="flex flex-wrap gap-2">
          <ChainBadge chainId={SUPPORTED_CHAINS.MAINNET} />
          <RegistryBadge registry="reputation" />
        </div>
      </div>

      <div className="border-2 border-terminal bg-terminal/30 p-4">
        <div className="typo-ui text-terminal-green glow mb-4">
          [TRIGGER: Identity Validator]
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge enabled={false} />
        </div>

        <div className="flex flex-wrap gap-2">
          <ChainBadge chainId={SUPPORTED_CHAINS.BASE} />
          <RegistryBadge registry="identity" />
        </div>
      </div>

      <div className="border-2 border-terminal bg-terminal/30 p-4">
        <div className="typo-ui text-terminal-green glow mb-4">
          [TRIGGER: Validation Check]
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge enabled={true} />
        </div>

        <div className="flex flex-wrap gap-2">
          <ChainBadge chainId={SUPPORTED_CHAINS.SEPOLIA} />
          <RegistryBadge registry="validation" />
        </div>
      </div>
    </div>
  ),
}

/**
 * Compact badge layout for lists.
 */
export const CompactLayout: StoryObj = {
  render: () => (
    <div className="space-y-2">
      {[
        { name: 'Trigger A', chainId: SUPPORTED_CHAINS.MAINNET, registry: 'reputation', enabled: true },
        { name: 'Trigger B', chainId: SUPPORTED_CHAINS.BASE, registry: 'identity', enabled: true },
        { name: 'Trigger C', chainId: SUPPORTED_CHAINS.SEPOLIA, registry: 'validation', enabled: false },
        { name: 'Trigger D', chainId: SUPPORTED_CHAINS.BASE_SEPOLIA, registry: 'reputation', enabled: true },
        { name: 'Trigger E', chainId: SUPPORTED_CHAINS.LINEA_SEPOLIA, registry: 'identity', enabled: false },
      ].map((trigger) => (
        <div key={trigger.name} className="border-2 border-terminal bg-terminal/20 p-2 flex items-center justify-between">
          <span className="typo-ui text-terminal-bright">{trigger.name}</span>
          <div className="flex gap-1">
            <StatusBadge enabled={trigger.enabled} />
            <ChainBadge chainId={trigger.chainId} />
            <RegistryBadge registry={trigger.registry as 'reputation' | 'identity' | 'validation'} />
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * Badge color comparison chart.
 * Shows all color variations side by side.
 */
export const ColorChart: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="typo-ui text-terminal-green glow mb-3">
          [STATUS COLORS]
        </div>
        <div className="flex gap-2">
          <StatusBadge enabled={true} />
          <StatusBadge enabled={false} />
        </div>
      </div>

      <div>
        <div className="typo-ui text-terminal-green glow mb-3">
          [CHAIN COLORS]
        </div>
        <div className="flex flex-wrap gap-2">
          <ChainBadge chainId={SUPPORTED_CHAINS.MAINNET} />
          <ChainBadge chainId={SUPPORTED_CHAINS.BASE} />
          <ChainBadge chainId={SUPPORTED_CHAINS.SEPOLIA} />
          <ChainBadge chainId={SUPPORTED_CHAINS.BASE_SEPOLIA} />
          <ChainBadge chainId={SUPPORTED_CHAINS.LINEA_SEPOLIA} />
          <ChainBadge chainId={SUPPORTED_CHAINS.POLYGON_AMOY} />
        </div>
      </div>

      <div>
        <div className="typo-ui text-terminal-green glow mb-3">
          [REGISTRY COLORS]
        </div>
        <div className="flex gap-2">
          <RegistryBadge registry="identity" />
          <RegistryBadge registry="reputation" />
          <RegistryBadge registry="validation" />
        </div>
      </div>
    </div>
  ),
}
