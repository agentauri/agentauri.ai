import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSafeStorage, createHydrationHook } from '@/lib/storage-utils'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  isHydrated: boolean

  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setHydrated: (hydrated: boolean) => void
}

/**
 * Apply theme to document root
 */
const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      isHydrated: false,

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),

      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(createSafeStorage),
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate UI store:', error)
        }
        if (state) {
          // Apply theme after hydration
          applyTheme(state.theme)
          state.setHydrated(true)
        }
      },
    }
  )
)

/**
 * Hook to manually trigger hydration on client mount
 */
export const useUIHydration = createHydrationHook(useUIStore)

/**
 * Listen for system theme changes
 */
export const initThemeListener = () => {
  if (typeof window === 'undefined') return

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    const state = useUIStore.getState()
    if (state.theme === 'system') {
      applyTheme('system')
    }
  }

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}
