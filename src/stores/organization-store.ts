/**
 * Organization store
 *
 * Zustand store for managing current organization context with localStorage persistence.
 * Tracks the selected organization and user's role for permission checks.
 *
 * @module stores/organization-store
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { OrganizationRole } from '@/lib/constants'
import { createSafeStorage, createHydrationHook } from '@/lib/storage-utils'

/**
 * Organization entity representing a workspace/team
 *
 * Organizations are the primary grouping mechanism for resources
 * like agents, triggers, API keys, and billing.
 */
export interface Organization {
  /** Unique organization UUID */
  id: string
  /** Display name of the organization */
  name: string
  /** URL-friendly unique identifier */
  slug: string
  /** Optional description of the organization */
  description: string | null
  /** Whether this is the user's personal organization */
  isPersonal: boolean
  /** ISO timestamp of creation */
  createdAt: string
  /** ISO timestamp of last update */
  updatedAt: string
}

/**
 * Organization with the current user's role
 *
 * Used when listing organizations to show the user's
 * permission level in each organization.
 */
export interface OrganizationWithRole {
  /** The organization entity */
  organization: Organization
  /** Current user's role in this organization */
  myRole: OrganizationRole
}

/**
 * Organization store state interface
 *
 * Stores only the current organization selection.
 * Full organization list should be fetched via TanStack Query.
 */
interface OrganizationState {
  /** Currently selected organization ID (null if none selected) */
  currentOrganizationId: string | null
  /** Current user's role in the selected organization */
  currentRole: OrganizationRole | null
  /** Whether the store has been hydrated from localStorage */
  isHydrated: boolean

  /** Set the current organization and optionally the user's role */
  setCurrentOrganization: (orgId: string | null, role?: OrganizationRole | null) => void
  /** Mark store as hydrated (called after rehydration) */
  setHydrated: (hydrated: boolean) => void
  /** Reset organization selection to null */
  reset: () => void
}

/**
 * Zustand store for current organization context
 *
 * Manages the currently selected organization with localStorage persistence.
 * Only stores the selection - full organization list should be fetched
 * via the `useOrganizations` hook from TanStack Query.
 *
 * **Persisted state:** `currentOrganizationId` and `currentRole`
 *
 * @example
 * ```tsx
 * // Get current organization ID for API calls
 * function useAgentsList() {
 *   const orgId = useOrganizationStore((s) => s.currentOrganizationId)
 *
 *   return useQuery({
 *     queryKey: ['agents', orgId],
 *     queryFn: () => fetchAgents(orgId!),
 *     enabled: !!orgId,
 *   })
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Organization switcher
 * function OrgSwitcher({ organizations }: { organizations: Organization[] }) {
 *   const { currentOrganizationId, setCurrentOrganization } = useOrganizationStore()
 *
 *   return (
 *     <select
 *       value={currentOrganizationId ?? ''}
 *       onChange={(e) => setCurrentOrganization(e.target.value)}
 *     >
 *       {organizations.map((org) => (
 *         <option key={org.id} value={org.id}>{org.name}</option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Check user role for permissions
 * function AdminOnlyButton() {
 *   const role = useOrganizationStore((s) => s.currentRole)
 *
 *   if (role !== 'owner' && role !== 'admin') {
 *     return null
 *   }
 *
 *   return <button>Admin Action</button>
 * }
 * ```
 */
export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      currentOrganizationId: null,
      currentRole: null,
      isHydrated: false,

      setCurrentOrganization: (orgId, role = null) =>
        set({
          currentOrganizationId: orgId,
          currentRole: role,
        }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      reset: () =>
        set({
          currentOrganizationId: null,
          currentRole: null,
        }),
    }),
    {
      name: 'organization-storage',
      storage: createJSONStorage(createSafeStorage),
      skipHydration: true,
      partialize: (state) => ({
        currentOrganizationId: state.currentOrganizationId,
        currentRole: state.currentRole,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate organization store:', error)
        }
        if (state) {
          state.setHydrated(true)
        }
      },
    }
  )
)

/**
 * Hook to manually trigger organization store hydration on client mount
 *
 * Must be called once in your root provider or layout to restore
 * persisted organization selection from localStorage.
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
 * // Wait for hydration before making org-scoped API calls
 * function DashboardLayout({ children }: { children: React.ReactNode }) {
 *   useOrganizationHydration()
 *   const { currentOrganizationId, isHydrated } = useOrganizationStore()
 *
 *   if (!isHydrated) return <LoadingSpinner />
 *   if (!currentOrganizationId) return <OrgSelector />
 *
 *   return <DashboardShell>{children}</DashboardShell>
 * }
 * ```
 */
export const useOrganizationHydration = createHydrationHook(useOrganizationStore)
