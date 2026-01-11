/**
 * Authentication hooks
 *
 * React hooks for managing user authentication state, login/logout flows,
 * and automatic token refresh. Built on TanStack Query for server state
 * and Zustand for client state.
 *
 * @module hooks/use-auth
 */

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { authApi } from '@/lib/api'
import { ApiError } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import type { UserSession, WalletLoginRequest } from '@/lib/validations'
import { useAuthStore } from '@/stores/auth-store'
import { useOrganizationStore } from '@/stores/organization-store'

/**
 * Token refresh configuration
 * Token expires in 60 minutes, refresh 5 minutes before expiration
 */
const TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000 // 55 minutes
const TOKEN_REFRESH_ON_FOCUS_THRESHOLD = 5 * 60 * 1000 // 5 minutes since last refresh

/**
 * Hook for fetching current user session
 *
 * Uses TanStack Query for server state management.
 * Updates Zustand auth store on success/failure.
 *
 * @returns TanStack Query result with session data
 *
 * @example
 * ```tsx
 * function UserInfo() {
 *   const { data: session, isLoading } = useSession()
 *
 *   if (isLoading) return <Spinner />
 *   return <span>Welcome, {session?.user.email}</span>
 * }
 * ```
 */
export function useSession() {
  const { setAuthenticated, isHydrated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      try {
        const session = await authApi.getSession()
        setAuthenticated(true)
        return session
      } catch (error) {
        if (error instanceof ApiError && error.isUnauthorized) {
          setAuthenticated(false)
        }
        throw error
      }
    },
    // Only fetch after hydration to avoid SSR issues
    enabled: isHydrated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof ApiError && (error.isUnauthorized || error.isForbidden)) {
        return false
      }
      return failureCount < 3
    },
  })
}

/**
 * Hook for getting SIWE nonce for wallet authentication
 *
 * Returns a pre-formatted EIP-4361 message to sign with the wallet.
 * Nonce expires after 5 minutes on the server.
 *
 * @param address - Ethereum wallet address (0x...). Query disabled if undefined.
 * @returns TanStack Query result with nonce and message to sign
 *
 * @example
 * ```tsx
 * function WalletLogin() {
 *   const { address } = useAccount()
 *   const { data: nonceData } = useNonce(address)
 *
 *   const handleSign = async () => {
 *     const signature = await signMessage(nonceData.message)
 *     // Use signature for login
 *   }
 * }
 * ```
 */
export function useNonce(address?: string) {
  return useQuery({
    queryKey: queryKeys.auth.nonce(address ?? 'wallet'),
    queryFn: () => authApi.getNonce(address!),
    staleTime: 2 * 60 * 1000, // 2 minutes (nonce has short expiry)
    gcTime: 5 * 60 * 1000,
    // Only fetch when address is provided
    enabled: !!address,
  })
}

/**
 * Hook for wallet login mutation (SIWE)
 *
 * Handles the complete login flow:
 * 1. Verifies signature with backend
 * 2. Stores tokens in httpOnly cookies
 * 3. Updates auth state
 * 4. Redirects to dashboard
 *
 * @returns TanStack Mutation for wallet login
 *
 * @example
 * ```tsx
 * function WalletLoginButton() {
 *   const login = useLogin()
 *
 *   const handleLogin = async (signature: string, message: string) => {
 *     await login.mutateAsync({ signature, message })
 *     // Automatically redirects to /dashboard on success
 *   }
 *
 *   return (
 *     <Button onClick={handleLogin} disabled={login.isPending}>
 *       {login.isPending ? 'Signing in...' : 'Sign In'}
 *     </Button>
 *   )
 * }
 * ```
 */
export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: async (request: WalletLoginRequest) => {
      // 1. Call backend login
      const response = await authApi.loginWithWallet(request)

      // 2. Store tokens in httpOnly cookies via Next.js API route
      const setTokensResponse = await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: response.token,
          refresh_token: response.refresh_token,
          expires_in: response.expires_in,
        }),
        credentials: 'include',
      })

      if (!setTokensResponse.ok) {
        throw new Error('Failed to store authentication tokens')
      }

      return response
    },
    onSuccess: async () => {
      setAuthenticated(true)
      // Invalidate and refetch session
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      // Redirect to dashboard
      router.push('/dashboard')
    },
    onError: (error) => {
      setAuthenticated(false)
      console.error('Login failed:', error)
    },
  })
}

/**
 * Hook for logout mutation
 *
 * Handles the complete logout flow:
 * 1. Invalidates session on server
 * 2. Clears httpOnly cookies
 * 3. Resets all auth and org state
 * 4. Clears query cache
 * 5. Redirects to login page
 *
 * @returns TanStack Mutation for logout
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const logout = useLogout()
 *
 *   return (
 *     <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
 *       Sign Out
 *     </Button>
 *   )
 * }
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { logout: clearAuth } = useAuthStore()
  const { reset: resetOrg } = useOrganizationStore()

  return useMutation({
    mutationFn: async () => {
      // 1. Call backend logout (invalidates session server-side)
      try {
        await authApi.logout()
      } catch {
        // Ignore backend logout errors - we'll clear local state anyway
      }

      // 2. Clear httpOnly cookies via local API route
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    },
    onSuccess: () => {
      // Clear all auth state
      clearAuth()
      resetOrg()
      // Clear all queries
      queryClient.clear()
      // Redirect to login
      router.push('/login')
    },
    onError: () => {
      // Even on error, clear local state and redirect
      clearAuth()
      resetOrg()
      queryClient.clear()
      router.push('/login')
    },
  })
}

/**
 * Hook for proactive token refresh
 *
 * Automatically refreshes the access token before it expires
 * to maintain a seamless session experience. Handles:
 * - Periodic refresh every 55 minutes
 * - Refresh on window focus (if 5+ minutes since last refresh)
 * - Refresh on tab visibility change
 *
 * @returns Object with refreshToken function and lastRefresh timestamp
 *
 * @example
 * ```tsx
 * // Usually used internally by useAuth, but can be used directly
 * function App() {
 *   const { refreshToken, lastRefresh } = useTokenRefresh()
 *
 *   // Token refresh is automatic, but can force refresh if needed
 *   const handleForceRefresh = () => refreshToken()
 * }
 * ```
 */
export function useTokenRefresh() {
  const { isAuthenticated } = useAuthStore()
  const lastRefreshRef = useRef<number>(Date.now())
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        lastRefreshRef.current = Date.now()
        return true
      }

      // If refresh fails with 401, token is invalid
      if (response.status === 401) {
        return false
      }

      return false
    } catch {
      return false
    }
  }, [])

  // Set up periodic refresh timer
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any existing timer when not authenticated
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
      return
    }

    const scheduleRefresh = () => {
      refreshTimeoutRef.current = setTimeout(async () => {
        const success = await refreshToken()
        if (success) {
          // Schedule next refresh
          scheduleRefresh()
        }
        // If refresh fails, the next API call will handle it
      }, TOKEN_REFRESH_INTERVAL)
    }

    scheduleRefresh()

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
    }
  }, [isAuthenticated, refreshToken])

  // Refresh on window focus if enough time has passed
  useEffect(() => {
    if (!isAuthenticated) return

    const handleFocus = async () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshRef.current
      if (timeSinceLastRefresh >= TOKEN_REFRESH_ON_FOCUS_THRESHOLD) {
        await refreshToken()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated, refreshToken])

  // Refresh on visibility change (tab becomes visible)
  useEffect(() => {
    if (!isAuthenticated) return

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastRefresh = Date.now() - lastRefreshRef.current
        if (timeSinceLastRefresh >= TOKEN_REFRESH_ON_FOCUS_THRESHOLD) {
          await refreshToken()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isAuthenticated, refreshToken])

  return { refreshToken, lastRefresh: lastRefreshRef.current }
}

/**
 * Combined auth hook for convenience
 *
 * Provides a unified interface for all authentication operations:
 * - Session data and loading state
 * - Authentication status
 * - Login and logout mutations
 * - Automatic token refresh
 *
 * @returns Combined auth state and mutations
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { session, isLoading, isAuthenticated, logout } = useAuth()
 *
 *   if (isLoading) return <LoadingSpinner />
 *   if (!isAuthenticated) return <Redirect to="/login" />
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {session?.user.email}</h1>
 *       <Button onClick={() => logout.mutate()}>Sign Out</Button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth(): {
  session: UserSession | undefined
  isLoading: boolean
  isAuthenticated: boolean
  isError: boolean
  error: Error | null
  login: ReturnType<typeof useLogin>
  logout: ReturnType<typeof useLogout>
} {
  const sessionQuery = useSession()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const { isAuthenticated, isLoading: isStoreLoading, isHydrated } = useAuthStore()

  // Set up proactive token refresh
  useTokenRefresh()

  return {
    session: sessionQuery.data,
    isLoading: !isHydrated || isStoreLoading || sessionQuery.isLoading,
    isAuthenticated: isAuthenticated && !!sessionQuery.data,
    isError: sessionQuery.isError,
    error: sessionQuery.error,
    login: loginMutation,
    logout: logoutMutation,
  }
}
