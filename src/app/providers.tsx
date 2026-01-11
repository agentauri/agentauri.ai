/**
 * Application providers wrapper
 *
 * Root provider component that wraps the entire application with
 * necessary context providers for state management, data fetching,
 * and Web3 wallet connections.
 *
 * @module app/providers
 *
 * @remarks
 * Provider hierarchy (outer to inner):
 * 1. ErrorBoundary - Catches React errors
 * 2. WagmiProvider - Web3 wallet connections
 * 3. QueryClientProvider - TanStack Query data fetching
 * 4. StoreHydration - Zustand store rehydration
 * 5. Toaster - Toast notifications
 * 6. ReactQueryDevtools - Dev tools (development only)
 */

'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { lazy, type ReactNode, Suspense, useEffect } from 'react'
import { Toaster } from 'sonner'
import { WagmiProvider } from 'wagmi'
import { ErrorBoundary } from '@/components/organisms'
import { getQueryClient } from '@/lib/query-client'
import { wagmiConfig } from '@/lib/wagmi-config'
import { useAuthStore } from '@/stores/auth-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { initThemeListener, useUIStore } from '@/stores/ui-store'

/**
 * Lazy-loaded React Query Devtools
 *
 * Only imported in development to reduce production bundle size.
 * @internal
 */
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
)

/** Props for the Providers component */
interface ProvidersProps {
  /** Child components to wrap with providers */
  children: ReactNode
}

/**
 * Store hydration component
 *
 * Handles client-side rehydration of all persisted Zustand stores.
 * Must run after initial render to avoid SSR hydration mismatches.
 *
 * @internal
 */
function StoreHydration() {
  useEffect(() => {
    // Hydrate all persisted stores on client mount
    useAuthStore.persist.rehydrate()
    useOrganizationStore.persist.rehydrate()
    useUIStore.persist.rehydrate()

    // Initialize theme listener for system theme changes
    const cleanup = initThemeListener()
    return cleanup
  }, [])

  return null
}

/**
 * Root application providers
 *
 * Wraps the application with all necessary context providers.
 * Should be used in the root layout to provide global state.
 *
 * @param props - Component props
 * @param props.children - Child components to render
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient()

  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <StoreHydration />
          {children}
          <Toaster richColors position="top-right" />
          {process.env.NODE_ENV === 'development' && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
