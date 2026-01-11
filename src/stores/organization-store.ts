import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { OrganizationRole } from '@/lib/constants'
import { createSafeStorage, createHydrationHook } from '@/lib/storage-utils'

/**
 * Organization context store - only stores current selection.
 * Full organization list should be fetched via TanStack Query.
 */

export interface Organization {
  id: string
  name: string
  slug: string
  description: string | null
  isPersonal: boolean
  createdAt: string
  updatedAt: string
}

export interface OrganizationWithRole {
  organization: Organization
  myRole: OrganizationRole
}

interface OrganizationState {
  // Current selection only - not the full list
  currentOrganizationId: string | null
  currentRole: OrganizationRole | null
  isHydrated: boolean

  setCurrentOrganization: (orgId: string | null, role?: OrganizationRole | null) => void
  setHydrated: (hydrated: boolean) => void
  reset: () => void
}

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
 * Hook to manually trigger hydration on client mount
 */
export const useOrganizationHydration = createHydrationHook(useOrganizationStore)
