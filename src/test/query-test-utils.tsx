/**
 * Shared test utilities for React Query hooks
 *
 * Usage:
 * ```tsx
 * import { createTestQueryClient, createQueryWrapper } from '@/test/query-test-utils'
 *
 * describe('useMyHook', () => {
 *   const queryClient = createTestQueryClient()
 *   const wrapper = createQueryWrapper(queryClient)
 *
 *   afterEach(() => {
 *     queryClient.clear()
 *   })
 *
 *   it('should fetch data', async () => {
 *     const { result } = renderHook(() => useMyHook(), { wrapper })
 *     // ...
 *   })
 * })
 * ```
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * Create a QueryClient optimized for testing
 * - No retries (fail fast)
 * - No garbage collection delay
 * - No stale time
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

/**
 * Create a wrapper component for renderHook
 * Can be reused across tests in the same describe block
 */
export function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient || createTestQueryClient()

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

/**
 * Create a fresh wrapper with a new QueryClient
 * Use when you need complete isolation between tests
 */
export function createFreshQueryWrapper() {
  return createQueryWrapper(createTestQueryClient())
}
