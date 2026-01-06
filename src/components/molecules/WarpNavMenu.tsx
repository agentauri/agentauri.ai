'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

interface NavItem {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'FEATURES', href: '/features' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'DOCS', href: '/docs' },
]

interface WarpNavMenuProps {
  /** Navigation items (excluding auth button which is handled separately) */
  items?: NavItem[]
  /** Whether the menu is visible */
  visible?: boolean
  /** Additional CSS classes */
  className?: string
}

export function WarpNavMenu({
  items = NAV_ITEMS,
  visible = false,
  className,
}: WarpNavMenuProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Build nav items with auth button first
  const authItem: NavItem = isAuthenticated
    ? { label: 'DASHBOARD', href: '/dashboard' }
    : { label: 'LOGIN', href: '/login' }

  const allItems = [authItem, ...items]
  return (
    <nav
      data-slot="warp-nav-menu"
      className={cn(
        'flex flex-wrap items-center justify-center gap-2 sm:gap-4',
        'transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      aria-label="Main navigation"
    >
      {allItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'typo-ui px-3 py-2 sm:px-4 sm:py-2',
            'text-terminal-green border-2 border-terminal-dim',
            'hover:border-terminal-green hover:glow-sm',
            'transition-all duration-200',
            'animate-warp-nav',
            `warp-nav-delay-${index + 1}`
          )}
        >
          [ {item.label} ]
        </Link>
      ))}
    </nav>
  )
}
