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

// Lazy load devtools - only imported in development
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
)

interface ProvidersProps {
  children: ReactNode
}

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
