import { QueryClient } from '@tanstack/react-query'

/**
 * TanStack Query client configuration
 *
 * Provides a singleton QueryClient instance with sensible defaults:
 * - 1 minute stale time for queries
 * - 5 minute garbage collection time
 * - Smart retry logic (no retry for 4xx errors)
 * - No refetch on window focus (prevents unnecessary requests)
 *
 * @module lib/query-client
 */

/**
 * Create a new QueryClient instance with default configuration
 *
 * @returns Configured QueryClient instance
 * @internal
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof Error && 'status' in error) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) {
              return false
            }
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

/** Cached browser QueryClient instance */
let browserQueryClient: QueryClient | undefined

/**
 * Get or create the QueryClient instance
 *
 * Implements singleton pattern for browser environments while
 * creating fresh instances for server-side rendering.
 *
 * - **Server**: Always creates new instance (prevents data leakage)
 * - **Browser**: Reuses single instance (maintains cache)
 *
 * @returns QueryClient instance
 *
 * @example
 * ```tsx
 * // In your QueryProvider
 * function Providers({ children }: { children: React.ReactNode }) {
 *   const queryClient = getQueryClient()
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       {children}
 *     </QueryClientProvider>
 *   )
 * }
 * ```
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}
