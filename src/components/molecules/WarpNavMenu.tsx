'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'FEATURES', href: '/features' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'DOCS', href: '/docs' },
  { label: 'CONNECT', href: '/login' },
]

interface WarpNavMenuProps {
  /** Navigation items */
  items?: NavItem[]
  /** Whether the menu is visible */
  visible?: boolean
  /** Additional CSS classes */
  className?: string
}

export function WarpNavMenu({
  items = DEFAULT_NAV_ITEMS,
  visible = false,
  className,
}: WarpNavMenuProps) {
  if (!visible) return null

  return (
    <nav
      data-slot="warp-nav-menu"
      className={cn(
        'flex flex-wrap items-center justify-center gap-2 sm:gap-4',
        className
      )}
      aria-label="Main navigation"
    >
      {items.map((item, index) => (
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
