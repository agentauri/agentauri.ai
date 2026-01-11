/**
 * SSR-safe storage utilities for Zustand persisted stores
 */

import type { StateStorage } from 'zustand/middleware'

/**
 * SSR-safe storage that returns empty values on server
 * Use this with Zustand's createJSONStorage for persisted stores
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
 * This triggers rehydration only on the client side
 *
 * @param store - The Zustand store with persist middleware
 * @returns A hook function that triggers hydration when called
 *
 * @example
 * ```ts
 * export const useAuthHydration = createHydrationHook(useAuthStore)
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
 * Standard rehydration error handler for persist middleware
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
