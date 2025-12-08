import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { clearCsrfToken } from '@/lib/api-client'

/**
 * Minimal auth state - only authentication status.
 * User data should be fetched via TanStack Query, not stored here.
 * Sensitive data (email, wallets) is NEVER persisted client-side.
 */

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean

  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setHydrated: (hydrated: boolean) => void
  logout: () => void
}

/**
 * SSR-safe storage that returns empty values on server
 */
const createSafeStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }
  }
  return localStorage
}

/**
 * Clear auth cookie on logout
 */
const clearAuthCookie = () => {
  if (typeof document !== 'undefined') {
    // Clear with all possible path/domain combinations
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported yet
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported yet
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,

      setAuthenticated: (isAuthenticated) =>
        set({
          isAuthenticated,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      logout: () => {
        clearAuthCookie()
        clearCsrfToken()
        set({
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(createSafeStorage),
      skipHydration: true, // Manual hydration for SSR safety
      partialize: (state) => ({
        // Only persist auth status, never sensitive data
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate auth store:', error)
        }
        if (state) {
          state.setHydrated(true)
          state.setLoading(false)
        }
      },
    }
  )
)

/**
 * Hook to manually trigger hydration on client mount
 * Use this in your root provider or layout
 */
export const useAuthHydration = () => {
  if (typeof window !== 'undefined') {
    useAuthStore.persist.rehydrate()
  }
}
