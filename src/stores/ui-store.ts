import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSafeStorage, createHydrationHook } from '@/lib/storage-utils'

/**
 * Theme options for the application
 *
 * - `light`: Force light theme
 * - `dark`: Force dark theme
 * - `system`: Follow system preference
 */
type Theme = 'light' | 'dark' | 'system'

/**
 * UI store state interface
 *
 * Manages theme preferences and navigation UI state
 * with localStorage persistence for user preferences.
 */
interface UIState {
  /** Current theme setting */
  theme: Theme
  /** Whether sidebar is visible (desktop) */
  sidebarOpen: boolean
  /** Whether sidebar is in collapsed/icon-only mode */
  sidebarCollapsed: boolean
  /** Whether mobile navigation menu is open */
  mobileMenuOpen: boolean
  /** Whether the store has been hydrated from localStorage */
  isHydrated: boolean

  /** Set the theme and apply it to the document */
  setTheme: (theme: Theme) => void
  /** Toggle sidebar collapsed state */
  toggleSidebar: () => void
  /** Set sidebar visibility */
  setSidebarOpen: (open: boolean) => void
  /** Toggle sidebar collapsed state */
  toggleSidebarCollapsed: () => void
  /** Set mobile menu visibility */
  setMobileMenuOpen: (open: boolean) => void
  /** Toggle mobile menu */
  toggleMobileMenu: () => void
  /** Mark store as hydrated (called after rehydration) */
  setHydrated: (hydrated: boolean) => void
}

/**
 * Apply theme class to document root element
 *
 * Handles the `system` theme by detecting user's OS preference.
 * Removes existing theme classes before applying the new one.
 *
 * @param theme - Theme to apply ('light', 'dark', or 'system')
 * @internal
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

/**
 * Zustand store for UI state and preferences
 *
 * Manages theme settings and navigation UI state with localStorage
 * persistence. Theme is automatically applied to the document root.
 *
 * **Persisted state:** `theme` and `sidebarCollapsed`
 *
 * @example
 * ```tsx
 * // Theme switcher
 * function ThemeSwitcher() {
 *   const { theme, setTheme } = useUIStore()
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Sidebar toggle button
 * function SidebarToggle() {
 *   const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()
 *
 *   return (
 *     <button onClick={toggleSidebarCollapsed}>
 *       {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Responsive sidebar
 * function DashboardSidebar() {
 *   const { sidebarCollapsed, mobileMenuOpen } = useUIStore()
 *
 *   return (
 *     <aside
 *       className={cn(
 *         'transition-all duration-200',
 *         sidebarCollapsed ? 'w-16' : 'w-64',
 *         mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
 *       )}
 *     >
 *       <NavItems collapsed={sidebarCollapsed} />
 *     </aside>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Mobile menu button
 * function MobileMenuButton() {
 *   const { mobileMenuOpen, toggleMobileMenu } = useUIStore()
 *
 *   return (
 *     <button onClick={toggleMobileMenu} className="md:hidden">
 *       {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
 *     </button>
 *   )
 * }
 * ```
 */
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
 * Hook to manually trigger UI store hydration on client mount
 *
 * Must be called once in your root provider or layout to restore
 * persisted UI preferences from localStorage. Also applies the
 * persisted theme to the document on hydration.
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
 * // Prevent flash of wrong theme
 * function App() {
 *   useUIHydration()
 *   const isHydrated = useUIStore((s) => s.isHydrated)
 *
 *   // Theme is applied during hydration, so content is safe to render
 *   if (!isHydrated) return null
 *
 *   return <Router />
 * }
 * ```
 */
export const useUIHydration = createHydrationHook(useUIStore)

/**
 * Initialize system theme preference listener
 *
 * Sets up a media query listener to detect OS theme changes.
 * When theme is set to 'system', automatically updates the
 * document theme class when the system preference changes.
 *
 * Call this once during app initialization. Returns a cleanup
 * function to remove the event listener.
 *
 * @returns Cleanup function to remove the listener, or undefined if SSR
 *
 * @example
 * ```tsx
 * // In your root layout or app entry
 * function RootLayout({ children }: { children: React.ReactNode }) {
 *   useEffect(() => {
 *     const cleanup = initThemeListener()
 *     return cleanup
 *   }, [])
 *
 *   return <html><body>{children}</body></html>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In a client-side only provider
 * 'use client'
 *
 * function ThemeProvider({ children }: { children: React.ReactNode }) {
 *   useUIHydration()
 *
 *   useEffect(() => {
 *     return initThemeListener()
 *   }, [])
 *
 *   return <>{children}</>
 * }
 * ```
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
