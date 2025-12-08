import { Badge } from '@/components/atoms/badge'
import { SUPPORTED_CHAINS, type SupportedChainId } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ChainBadgeProps {
  chainId: SupportedChainId | number
  className?: string
}

const CHAIN_NAMES: Record<SupportedChainId, string> = {
  [SUPPORTED_CHAINS.MAINNET]: 'ETH MAIN',
  [SUPPORTED_CHAINS.BASE]: 'BASE',
  [SUPPORTED_CHAINS.SEPOLIA]: 'SEPOLIA',
  [SUPPORTED_CHAINS.BASE_SEPOLIA]: 'BASE SEP',
  [SUPPORTED_CHAINS.LINEA_SEPOLIA]: 'LINEA SEP',
  [SUPPORTED_CHAINS.POLYGON_AMOY]: 'POLYGON',
}

const CHAIN_COLORS: Record<SupportedChainId, string> = {
  [SUPPORTED_CHAINS.MAINNET]: 'bg-terminal-green/20 text-terminal-bright border-terminal-green',
  [SUPPORTED_CHAINS.BASE]: 'bg-blue-500/20 text-blue-400 border-blue-500',
  [SUPPORTED_CHAINS.SEPOLIA]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  [SUPPORTED_CHAINS.BASE_SEPOLIA]: 'bg-blue-400/20 text-blue-300 border-blue-400',
  [SUPPORTED_CHAINS.LINEA_SEPOLIA]: 'bg-purple-500/20 text-purple-400 border-purple-500',
  [SUPPORTED_CHAINS.POLYGON_AMOY]: 'bg-purple-600/20 text-purple-400 border-purple-600',
}

export function ChainBadge({ chainId, className }: ChainBadgeProps) {
  // Type-safe chain ID access with fallback for unsupported chains
  const typedChainId = chainId as SupportedChainId
  const name = CHAIN_NAMES[typedChainId] ?? `CHAIN ${chainId}`
  const colorClass = CHAIN_COLORS[typedChainId] ?? 'bg-terminal-dim/20 text-terminal-dim border-terminal-dim'

  return (
    <Badge variant="outline" className={cn('typo-ui border-2', colorClass, className)}>
      [{name}]
    </Badge>
  )
}
