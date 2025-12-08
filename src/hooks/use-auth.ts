'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { ApiError } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import type { LoginRequest, UserSession } from '@/lib/validations'
import { useAuthStore } from '@/stores/auth-store'
import { useOrganizationStore } from '@/stores/organization-store'

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
 */
export function useNonce(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.auth.nonce(address ?? ''),
    queryFn: () => authApi.getNonce(address!),
    enabled: !!address,
    staleTime: 2 * 60 * 1000, // 2 minutes (nonce has short expiry)
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
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
    mutationFn: () => authApi.logout(),
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
