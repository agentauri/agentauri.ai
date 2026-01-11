import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { clearCsrfToken } from '@/lib/api-client'
import { createSafeStorage, createHydrationHook } from '@/lib/storage-utils'

/**
 * Authentication state interface
 *
 * Minimal auth state - only authentication status.
 * User data should be fetched via TanStack Query, not stored here.
 * Sensitive data (email, wallets) is NEVER persisted client-side.
 *
 * **Security Notes:**
 * - Auth tokens are stored in httpOnly cookies (not accessible to JS)
 * - Use /api/auth/logout to clear cookies (server-side only)
 * - No client-readable token cookies (XSS protection)
 */
interface AuthState {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean
  /** Whether auth state is being loaded/verified */
  isLoading: boolean
  /** Whether the store has been hydrated from localStorage */
  isHydrated: boolean

  /** Update authentication status */
  setAuthenticated: (authenticated: boolean) => void
  /** Update loading state */
  setLoading: (loading: boolean) => void
  /** Mark store as hydrated (called after rehydration) */
  setHydrated: (hydrated: boolean) => void
  /** Clear auth state and CSRF token (call useLogout hook for full logout) */
  logout: () => void
}

/**
 * Clear auth cookies via API route (httpOnly cookies can't be cleared from JS)
 * This is called synchronously to update local state, but cookie clearing
 * should be done via the /api/auth/logout route in the useLogout hook
 */
const clearLocalAuthState = () => {
  clearCsrfToken()
}

/**
 * Zustand store for authentication state
 *
 * Manages minimal authentication status with localStorage persistence.
 * Uses httpOnly cookies for actual token storage (XSS protection).
 *
 * **Persisted state:** Only `isAuthenticated` is persisted.
 * **Security:** Never stores tokens, emails, or sensitive user data.
 *
 * @example
 * ```tsx
 * // Check auth status
 * function AuthGuard({ children }: { children: React.ReactNode }) {
 *   const { isAuthenticated, isHydrated } = useAuthStore()
 *
 *   if (!isHydrated) return <LoadingSpinner />
 *   if (!isAuthenticated) return <Navigate to="/login" />
 *
 *   return children
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Update auth state after login
 * function useLoginCallback() {
 *   const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
 *
 *   return async (credentials: Credentials) => {
 *     const result = await loginApi(credentials)
 *     if (result.success) {
 *       setAuthenticated(true)
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Logout (use with useLogout hook for full cleanup)
 * function LogoutButton() {
 *   const logout = useAuthStore((s) => s.logout)
 *   const { mutate: serverLogout } = useLogout()
 *
 *   const handleLogout = () => {
 *     logout() // Clear local state
 *     serverLogout() // Clear httpOnly cookies
 *   }
 *
 *   return <button onClick={handleLogout}>Logout</button>
 * }
 * ```
 */
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
 * Hook to manually trigger auth store hydration on client mount
 *
 * Must be called once in your root provider or layout to restore
 * persisted auth state from localStorage. Uses `skipHydration: true`
 * for SSR safety - hydration only happens client-side.
 *
 * @returns void - triggers hydration as a side effect
 *
 * @example
 * ```tsx
 * // In your root provider
 * function Providers({ children }: { children: React.ReactNode }) {
 *   useAuthHydration()
 *   useOrganizationHydration()
 *   useUIHydration()
 *
 *   return <>{children}</>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Wait for hydration before rendering protected content
 * function App() {
 *   useAuthHydration()
 *   const isHydrated = useAuthStore((s) => s.isHydrated)
 *
 *   if (!isHydrated) {
 *     return <SplashScreen />
 *   }
 *
 *   return <Router />
 * }
 * ```
 */
export const useAuthHydration = createHydrationHook(useAuthStore)
