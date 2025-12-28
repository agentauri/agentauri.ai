import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { clearCsrfToken } from '@/lib/api-client'

/**
 * Minimal auth state - only authentication status.
 * User data should be fetched via TanStack Query, not stored here.
 * Sensitive data (email, wallets) is NEVER persisted client-side.
 *
 * SECURITY NOTE:
 * - Auth tokens are stored in httpOnly cookies (not accessible to JS)
 * - Use /api/auth/logout to clear cookies (server-side only)
 * - No client-readable token cookies (XSS protection)
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
 * Clear auth cookies via API route (httpOnly cookies can't be cleared from JS)
 * This is called synchronously to update local state, but cookie clearing
 * should be done via the /api/auth/logout route in the useLogout hook
 */
const clearLocalAuthState = () => {
  clearCsrfToken()
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
        clearLocalAuthState()
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
