import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { base, baseSepolia, lineaSepolia, mainnet, polygonAmoy, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

/**
 * Wagmi configuration for Web3 wallet connections.
 *
 * This config is intentionally minimal - we only need:
 * - Wallet connection (get user address)
 * - Message signing (EIP-191 for auth)
 *
 * All blockchain reads (events, reputation, ownership) are handled
 * by the backend via Ponder indexers and API endpoints.
 *
 * RPC endpoints are not configured because:
 * - Event reading → Backend (Ponder Indexers)
 * - Reputation queries → Backend API
 * - Ownership verification → Backend API
 *
 * The wallet provider handles signing without needing RPC.
 */

// Build connectors list - WalletConnect uses indexedDB which requires browser
const connectors =
  typeof window !== 'undefined'
    ? [
        injected(),
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
        }),
        coinbaseWallet({
          appName: 'AgentAuri.AI',
        }),
      ]
    : [injected()] // SSR: only injected (doesn't use indexedDB)

export const wagmiConfig = createConfig({
  chains: [mainnet, base, sepolia, baseSepolia, lineaSepolia, polygonAmoy],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors,
  transports: {
    // Using public RPC endpoints (rate-limited but sufficient for wallet ops)
    // These are only used as fallback - wallet provider handles most operations
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [lineaSepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
