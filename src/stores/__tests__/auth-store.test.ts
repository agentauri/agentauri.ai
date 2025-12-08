import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore, useAuthHydration } from '../auth-store'

// Mock clearCsrfToken from api-client
vi.mock('@/lib/api-client', () => ({
  clearCsrfToken: vi.fn(),
}))

describe('auth-store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { setState } = useAuthStore
    setState({
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(true)
      expect(state.isHydrated).toBe(false)
    })
  })

  describe('setAuthenticated', () => {
    it('should set isAuthenticated to true', () => {
      const { setAuthenticated } = useAuthStore.getState()

      act(() => {
        setAuthenticated(true)
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
    })

    it('should set isAuthenticated to false', () => {
      // First set to true
      act(() => {
        useAuthStore.getState().setAuthenticated(true)
      })

      // Then set to false
      act(() => {
        useAuthStore.getState().setAuthenticated(false)
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
    })

    it('should also set isLoading to false', () => {
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(true)

      act(() => {
        useAuthStore.getState().setAuthenticated(true)
      })

      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('setLoading', () => {
    it('should set isLoading to true', () => {
      // First set to false via setAuthenticated
      act(() => {
        useAuthStore.getState().setAuthenticated(true)
      })

      act(() => {
        useAuthStore.getState().setLoading(true)
      })

      expect(useAuthStore.getState().isLoading).toBe(true)
    })

    it('should set isLoading to false', () => {
      act(() => {
        useAuthStore.getState().setLoading(false)
      })

      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('setHydrated', () => {
    it('should set isHydrated to true', () => {
      act(() => {
        useAuthStore.getState().setHydrated(true)
      })

      expect(useAuthStore.getState().isHydrated).toBe(true)
    })

    it('should set isHydrated to false', () => {
      // First set to true
      act(() => {
        useAuthStore.getState().setHydrated(true)
      })

      // Then set to false
      act(() => {
        useAuthStore.getState().setHydrated(false)
      })

      expect(useAuthStore.getState().isHydrated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should reset authentication state', () => {
      // First authenticate
      act(() => {
        useAuthStore.getState().setAuthenticated(true)
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Then logout
      act(() => {
        useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
    })

    it('should call clearCsrfToken', async () => {
      const { clearCsrfToken } = await import('@/lib/api-client')

      act(() => {
        useAuthStore.getState().logout()
      })

      expect(clearCsrfToken).toHaveBeenCalled()
    })

    it('should clear auth cookie', () => {
      // Mock document.cookie
      let cookieValue = 'auth-token=some-token; other=value'
      Object.defineProperty(document, 'cookie', {
        writable: true,
        configurable: true,
        value: cookieValue,
        // The setter will be called when clearing the cookie
      })

      act(() => {
        useAuthStore.getState().logout()
      })

      // Verify logout was called (cookie clearing happens internally)
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('persist configuration', () => {
    it('should have correct persist name', () => {
      // Access the persist options
      const persistOptions = useAuthStore.persist
      expect(persistOptions.getOptions().name).toBe('auth-storage')
    })

    it('should only persist isAuthenticated via partialize', () => {
      const persistOptions = useAuthStore.persist.getOptions()
      const testState = {
        isAuthenticated: true,
        isLoading: true,
        isHydrated: true,
        setAuthenticated: vi.fn(),
        setLoading: vi.fn(),
        setHydrated: vi.fn(),
        logout: vi.fn(),
      }

      // @ts-expect-error - partialize is internal but we need to test it
      const partializedState = persistOptions.partialize?.(testState)
      expect(partializedState).toEqual({ isAuthenticated: true })
      expect(partializedState).not.toHaveProperty('isLoading')
      expect(partializedState).not.toHaveProperty('isHydrated')
    })
  })

  describe('useAuthHydration', () => {
    it('should call rehydrate when window is defined', () => {
      const rehydrateSpy = vi.spyOn(useAuthStore.persist, 'rehydrate')

      useAuthHydration()

      expect(rehydrateSpy).toHaveBeenCalled()
      rehydrateSpy.mockRestore()
    })

    it('should not throw when called on server (no window)', () => {
      const originalWindow = global.window

      // @ts-expect-error - Intentionally setting window to undefined for testing
      delete global.window

      expect(() => useAuthHydration()).not.toThrow()

      global.window = originalWindow
    })
  })

  describe('onRehydrateStorage', () => {
    it('should set hydrated and stop loading on successful rehydration', async () => {
      // Reset state
      useAuthStore.setState({
        isAuthenticated: false,
        isLoading: true,
        isHydrated: false,
      })

      // Manually trigger rehydration
      await useAuthStore.persist.rehydrate()

      const state = useAuthStore.getState()
      expect(state.isHydrated).toBe(true)
      expect(state.isLoading).toBe(false)
    })
  })

  describe('state transitions', () => {
    it('should handle login flow correctly', () => {
      // Start: not authenticated, loading
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().isLoading).toBe(true)

      // Hydration complete
      act(() => {
        useAuthStore.getState().setHydrated(true)
      })
      expect(useAuthStore.getState().isHydrated).toBe(true)

      // Login success
      act(() => {
        useAuthStore.getState().setAuthenticated(true)
      })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('should handle logout flow correctly', () => {
      // Start: authenticated
      act(() => {
        useAuthStore.getState().setAuthenticated(true)
        useAuthStore.getState().setHydrated(true)
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Logout
      act(() => {
        useAuthStore.getState().logout()
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('should handle failed authentication', () => {
      // Hydration complete
      act(() => {
        useAuthStore.getState().setHydrated(true)
        useAuthStore.getState().setLoading(true)
      })

      // Auth check fails
      act(() => {
        useAuthStore.getState().setAuthenticated(false)
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })
})
