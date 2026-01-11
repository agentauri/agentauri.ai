/**
 * Zustand stores barrel export
 *
 * Central export point for all Zustand state stores used in the AgentAuri platform.
 * All stores use localStorage persistence with SSR-safe hydration.
 *
 * @module stores
 *
 * @example
 * ```tsx
 * import {
 *   // Auth store
 *   useAuthStore,
 *   useAuthHydration,
 *
 *   // Organization store
 *   useOrganizationStore,
 *   useOrganizationHydration,
 *
 *   // UI store
 *   useUIStore,
 *   useUIHydration,
 *   initThemeListener,
 * } from '@/stores'
 *
 * // In root provider - hydrate all stores
 * function Providers({ children }) {
 *   useAuthHydration()
 *   useOrganizationHydration()
 *   useUIHydration()
 *   return <>{children}</>
 * }
 * ```
 */

export { useAuthStore, useAuthHydration } from './auth-store'
export { useOrganizationStore, useOrganizationHydration } from './organization-store'
export type { Organization, OrganizationWithRole } from './organization-store'
export { useUIStore, useUIHydration, initThemeListener } from './ui-store'
