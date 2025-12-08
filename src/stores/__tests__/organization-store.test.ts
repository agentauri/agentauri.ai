import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useOrganizationStore } from '../organization-store'

describe('organization-store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { setState } = useOrganizationStore
    setState({
      currentOrganizationId: null,
      currentRole: null,
      isHydrated: false,
    })
  })

  afterEach(() => {
    // Clean up after each test
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useOrganizationStore.getState()
      expect(state.currentOrganizationId).toBeNull()
      expect(state.currentRole).toBeNull()
      expect(state.isHydrated).toBe(false)
    })
  })

  describe('setCurrentOrganization', () => {
    it('should set organization id', () => {
      const orgId = '550e8400-e29b-41d4-a716-446655440000'

      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(orgId)
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBe(orgId)
    })

    it('should set organization id and role', () => {
      const orgId = '550e8400-e29b-41d4-a716-446655440000'

      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(orgId, 'admin')
      })

      const state = useOrganizationStore.getState()
      expect(state.currentOrganizationId).toBe(orgId)
      expect(state.currentRole).toBe('admin')
    })

    it('should set role to null when not provided', () => {
      const orgId = '550e8400-e29b-41d4-a716-446655440000'

      // First set with role
      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(orgId, 'owner')
      })
      expect(useOrganizationStore.getState().currentRole).toBe('owner')

      // Then set without role (should reset to null)
      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(orgId)
      })
      expect(useOrganizationStore.getState().currentRole).toBeNull()
    })

    it('should handle null organization id', () => {
      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(null)
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBeNull()
      expect(useOrganizationStore.getState().currentRole).toBeNull()
    })

    it('should accept all valid roles', () => {
      const orgId = '550e8400-e29b-41d4-a716-446655440000'
      const roles = ['owner', 'admin', 'member', 'viewer'] as const

      for (const role of roles) {
        act(() => {
          useOrganizationStore.getState().setCurrentOrganization(orgId, role)
        })
        expect(useOrganizationStore.getState().currentRole).toBe(role)
      }
    })
  })

  describe('setHydrated', () => {
    it('should set isHydrated to true', () => {
      act(() => {
        useOrganizationStore.getState().setHydrated(true)
      })

      expect(useOrganizationStore.getState().isHydrated).toBe(true)
    })

    it('should set isHydrated to false', () => {
      // First set to true
      act(() => {
        useOrganizationStore.getState().setHydrated(true)
      })

      // Then set to false
      act(() => {
        useOrganizationStore.getState().setHydrated(false)
      })

      expect(useOrganizationStore.getState().isHydrated).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset organization id and role to null', () => {
      const orgId = '550e8400-e29b-41d4-a716-446655440000'

      // First set some values
      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(orgId, 'admin')
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBe(orgId)
      expect(useOrganizationStore.getState().currentRole).toBe('admin')

      // Then reset
      act(() => {
        useOrganizationStore.getState().reset()
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBeNull()
      expect(useOrganizationStore.getState().currentRole).toBeNull()
    })

    it('should not affect isHydrated', () => {
      // Set hydrated
      act(() => {
        useOrganizationStore.getState().setHydrated(true)
      })

      // Reset organization
      act(() => {
        useOrganizationStore.getState().reset()
      })

      // isHydrated should still be true
      expect(useOrganizationStore.getState().isHydrated).toBe(true)
    })
  })

  describe('persist configuration', () => {
    it('should have correct persist name', () => {
      const persistOptions = useOrganizationStore.persist
      expect(persistOptions.getOptions().name).toBe('organization-storage')
    })
  })

  describe('state transitions', () => {
    it('should handle organization switch', () => {
      const org1 = '550e8400-e29b-41d4-a716-446655440001'
      const org2 = '550e8400-e29b-41d4-a716-446655440002'

      // Set first organization
      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(org1, 'owner')
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBe(org1)
      expect(useOrganizationStore.getState().currentRole).toBe('owner')

      // Switch to second organization
      act(() => {
        useOrganizationStore.getState().setCurrentOrganization(org2, 'member')
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBe(org2)
      expect(useOrganizationStore.getState().currentRole).toBe('member')
    })

    it('should handle logout flow (reset)', () => {
      const orgId = '550e8400-e29b-41d4-a716-446655440000'

      // User is logged in with organization
      act(() => {
        useOrganizationStore.getState().setHydrated(true)
        useOrganizationStore.getState().setCurrentOrganization(orgId, 'admin')
      })

      // User logs out
      act(() => {
        useOrganizationStore.getState().reset()
      })

      expect(useOrganizationStore.getState().currentOrganizationId).toBeNull()
      expect(useOrganizationStore.getState().currentRole).toBeNull()
      expect(useOrganizationStore.getState().isHydrated).toBe(true)
    })

    it('should handle initial app load', () => {
      // Initial state
      expect(useOrganizationStore.getState().isHydrated).toBe(false)
      expect(useOrganizationStore.getState().currentOrganizationId).toBeNull()

      // Hydration complete with persisted organization
      act(() => {
        useOrganizationStore.getState().setHydrated(true)
      })

      expect(useOrganizationStore.getState().isHydrated).toBe(true)
    })
  })
})
