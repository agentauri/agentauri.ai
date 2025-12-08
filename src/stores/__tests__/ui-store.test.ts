import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initThemeListener, useUIStore } from '../ui-store'

describe('ui-store', () => {
  beforeEach(() => {
    // Mock window.matchMedia for theme tests
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Reset store to initial state before each test
    const { setState } = useUIStore
    setState({
      theme: 'system',
      sidebarOpen: true,
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      isHydrated: false,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useUIStore.getState()
      expect(state.theme).toBe('system')
      expect(state.sidebarOpen).toBe(true)
      expect(state.sidebarCollapsed).toBe(false)
      expect(state.mobileMenuOpen).toBe(false)
      expect(state.isHydrated).toBe(false)
    })
  })

  describe('setTheme', () => {
    it('should set theme to light', () => {
      act(() => {
        useUIStore.getState().setTheme('light')
      })

      expect(useUIStore.getState().theme).toBe('light')
    })

    it('should set theme to dark', () => {
      act(() => {
        useUIStore.getState().setTheme('dark')
      })

      expect(useUIStore.getState().theme).toBe('dark')
    })

    it('should set theme to system', () => {
      // First set to dark
      act(() => {
        useUIStore.getState().setTheme('dark')
      })

      // Then back to system
      act(() => {
        useUIStore.getState().setTheme('system')
      })

      expect(useUIStore.getState().theme).toBe('system')
    })
  })

  describe('toggleSidebar', () => {
    it('should toggle sidebarCollapsed from false to true', () => {
      expect(useUIStore.getState().sidebarCollapsed).toBe(false)

      act(() => {
        useUIStore.getState().toggleSidebar()
      })

      expect(useUIStore.getState().sidebarCollapsed).toBe(true)
    })

    it('should toggle sidebarCollapsed from true to false', () => {
      // First set to true
      act(() => {
        useUIStore.getState().toggleSidebar()
      })
      expect(useUIStore.getState().sidebarCollapsed).toBe(true)

      // Toggle again
      act(() => {
        useUIStore.getState().toggleSidebar()
      })

      expect(useUIStore.getState().sidebarCollapsed).toBe(false)
    })
  })

  describe('setSidebarOpen', () => {
    it('should set sidebarOpen to true', () => {
      // First set to false
      act(() => {
        useUIStore.getState().setSidebarOpen(false)
      })

      // Then set to true
      act(() => {
        useUIStore.getState().setSidebarOpen(true)
      })

      expect(useUIStore.getState().sidebarOpen).toBe(true)
    })

    it('should set sidebarOpen to false', () => {
      act(() => {
        useUIStore.getState().setSidebarOpen(false)
      })

      expect(useUIStore.getState().sidebarOpen).toBe(false)
    })
  })

  describe('toggleSidebarCollapsed', () => {
    it('should toggle sidebarCollapsed from false to true', () => {
      expect(useUIStore.getState().sidebarCollapsed).toBe(false)

      act(() => {
        useUIStore.getState().toggleSidebarCollapsed()
      })

      expect(useUIStore.getState().sidebarCollapsed).toBe(true)
    })

    it('should toggle sidebarCollapsed from true to false', () => {
      // First set to true
      act(() => {
        useUIStore.getState().toggleSidebarCollapsed()
      })

      // Toggle again
      act(() => {
        useUIStore.getState().toggleSidebarCollapsed()
      })

      expect(useUIStore.getState().sidebarCollapsed).toBe(false)
    })
  })

  describe('setMobileMenuOpen', () => {
    it('should set mobileMenuOpen to true', () => {
      act(() => {
        useUIStore.getState().setMobileMenuOpen(true)
      })

      expect(useUIStore.getState().mobileMenuOpen).toBe(true)
    })

    it('should set mobileMenuOpen to false', () => {
      // First open
      act(() => {
        useUIStore.getState().setMobileMenuOpen(true)
      })

      // Then close
      act(() => {
        useUIStore.getState().setMobileMenuOpen(false)
      })

      expect(useUIStore.getState().mobileMenuOpen).toBe(false)
    })
  })

  describe('toggleMobileMenu', () => {
    it('should toggle mobileMenuOpen from false to true', () => {
      expect(useUIStore.getState().mobileMenuOpen).toBe(false)

      act(() => {
        useUIStore.getState().toggleMobileMenu()
      })

      expect(useUIStore.getState().mobileMenuOpen).toBe(true)
    })

    it('should toggle mobileMenuOpen from true to false', () => {
      // First open
      act(() => {
        useUIStore.getState().toggleMobileMenu()
      })

      // Toggle again
      act(() => {
        useUIStore.getState().toggleMobileMenu()
      })

      expect(useUIStore.getState().mobileMenuOpen).toBe(false)
    })
  })

  describe('setHydrated', () => {
    it('should set isHydrated to true', () => {
      act(() => {
        useUIStore.getState().setHydrated(true)
      })

      expect(useUIStore.getState().isHydrated).toBe(true)
    })

    it('should set isHydrated to false', () => {
      // First set to true
      act(() => {
        useUIStore.getState().setHydrated(true)
      })

      // Then set to false
      act(() => {
        useUIStore.getState().setHydrated(false)
      })

      expect(useUIStore.getState().isHydrated).toBe(false)
    })
  })

  describe('persist configuration', () => {
    it('should have correct persist name', () => {
      const persistOptions = useUIStore.persist
      expect(persistOptions.getOptions().name).toBe('ui-storage')
    })
  })

  describe('initThemeListener', () => {
    it('should return undefined on server (no window)', () => {
      // In jsdom environment, window exists, so we need to mock it
      const originalWindow = global.window

      // @ts-expect-error - Intentionally setting window to undefined for testing
      delete global.window

      const cleanup = initThemeListener()
      expect(cleanup).toBeUndefined()

      // Restore window
      global.window = originalWindow
    })

    it('should return cleanup function in browser', () => {
      // Mock matchMedia
      const mockAddEventListener = vi.fn()
      const mockRemoveEventListener = vi.fn()

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        })),
      })

      const cleanup = initThemeListener()

      expect(cleanup).toBeInstanceOf(Function)
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

      // Call cleanup
      if (cleanup) {
        cleanup()
        expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      }
    })
  })

  describe('state transitions', () => {
    it('should handle responsive sidebar behavior', () => {
      // Desktop: sidebar open and not collapsed
      expect(useUIStore.getState().sidebarOpen).toBe(true)
      expect(useUIStore.getState().sidebarCollapsed).toBe(false)

      // User collapses sidebar
      act(() => {
        useUIStore.getState().toggleSidebarCollapsed()
      })

      expect(useUIStore.getState().sidebarCollapsed).toBe(true)

      // User expands sidebar
      act(() => {
        useUIStore.getState().toggleSidebarCollapsed()
      })

      expect(useUIStore.getState().sidebarCollapsed).toBe(false)
    })

    it('should handle mobile menu behavior', () => {
      // Initially closed
      expect(useUIStore.getState().mobileMenuOpen).toBe(false)

      // User opens menu
      act(() => {
        useUIStore.getState().setMobileMenuOpen(true)
      })

      expect(useUIStore.getState().mobileMenuOpen).toBe(true)

      // User navigates (menu should close)
      act(() => {
        useUIStore.getState().setMobileMenuOpen(false)
      })

      expect(useUIStore.getState().mobileMenuOpen).toBe(false)
    })

    it('should handle theme preference flow', () => {
      // Default: system
      expect(useUIStore.getState().theme).toBe('system')

      // User selects dark theme
      act(() => {
        useUIStore.getState().setTheme('dark')
      })
      expect(useUIStore.getState().theme).toBe('dark')

      // User selects light theme
      act(() => {
        useUIStore.getState().setTheme('light')
      })
      expect(useUIStore.getState().theme).toBe('light')

      // User goes back to system preference
      act(() => {
        useUIStore.getState().setTheme('system')
      })
      expect(useUIStore.getState().theme).toBe('system')
    })
  })
})
