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
 * Uses TanStack Query for server state, Zustand only for auth status
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
 * Hook for getting nonce for SIWE authentication
 * Returns a pre-formatted message to sign
 * @param address - The wallet address to get nonce for (required to fetch)
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
 * Refreshes the access token before it expires to maintain seamless session
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
