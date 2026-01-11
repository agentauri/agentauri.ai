/**
 * SSR-safe storage utilities for Zustand persisted stores
 *
 * Provides utilities for handling localStorage in SSR environments:
 * - Safe storage adapters that work on both server and client
 * - Hydration hooks for triggering client-side rehydration
 * - Error handlers for persist middleware
 *
 * @module lib/storage-utils
 */

import type { StateStorage } from 'zustand/middleware'

/**
 * Create SSR-safe storage adapter for Zustand persist middleware
 *
 * Returns a storage adapter that:
 * - On server: Returns no-op functions (prevents SSR errors)
 * - On client: Returns localStorage
 *
 * Use with Zustand's `createJSONStorage` for persisted stores.
 *
 * @returns StateStorage-compatible object
 *
 * @example
 * ```ts
 * import { createJSONStorage, persist } from 'zustand/middleware'
 *
 * const useStore = create(
 *   persist(
 *     (set) => ({ count: 0 }),
 *     {
 *       name: 'my-store',
 *       storage: createJSONStorage(() => createSafeStorage()),
 *     }
 *   )
 * )
 * ```
 */
export function createSafeStorage(): StateStorage {
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
 * Create a hydration hook for a Zustand persisted store
 *
 * Creates a hook that triggers rehydration from localStorage
 * only on the client side. Use this in your app's root component
 * to ensure stores are hydrated after initial render.
 *
 * @typeParam T - The store's state type
 * @param store - Zustand store with persist middleware
 * @returns Hook function that triggers hydration when called
 *
 * @example
 * ```ts
 * // Create the hydration hook
 * export const useAuthHydration = createHydrationHook(useAuthStore)
 *
 * // Use in root component
 * function App() {
 *   useAuthHydration()
 *   return <MyApp />
 * }
 * ```
 */
export function createHydrationHook<T>(
  store: { persist: { rehydrate: () => void } }
): () => void {
  return () => {
    if (typeof window !== 'undefined') {
      store.persist.rehydrate()
    }
  }
}

/**
 * Create a standard rehydration error handler for persist middleware
 *
 * Returns a handler function that:
 * - Logs errors during rehydration
 * - Calls setHydrated(true) on success to mark store as ready
 *
 * @typeParam T - State type with optional setHydrated method
 * @param storeName - Name for logging purposes
 * @returns Handler function for persist middleware's onRehydrateStorage
 *
 * @example
 * ```ts
 * const useStore = create(
 *   persist(
 *     (set) => ({
 *       data: null,
 *       setHydrated: (hydrated: boolean) => set({ hydrated }),
 *     }),
 *     {
 *       name: 'my-store',
 *       onRehydrateStorage: () => createRehydrateHandler('my-store'),
 *     }
 *   )
 * )
 * ```
 */
export function createRehydrateHandler<T extends { setHydrated?: (hydrated: boolean) => void }>(
  storeName: string
): (state: T | undefined, error?: unknown) => void {
  return (state, error) => {
    if (error) {
      console.error(`Failed to rehydrate ${storeName} store:`, error)
    }
    if (state?.setHydrated) {
      state.setHydrated(true)
    }
  }
}
