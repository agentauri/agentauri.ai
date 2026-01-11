/**
 * BottomNav
 *
 * A mobile bottom navigation bar with icons and labels.
 * Supports both public and dashboard variants with different nav items.
 *
 * @module components/organisms/BottomNav
 *
 * @example
 * ```tsx
 * // Public site navigation
 * <BottomNav variant="public" />
 *
 * // Dashboard navigation with more menu
 * <BottomNav variant="dashboard" onMoreClick={() => setMenuOpen(true)} />
 * ```
 */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/atoms/icon'

/** Navigation item configuration */
interface NavItem {
  href: string
  icon: IconName
  label: string
  onClick?: () => void
}

/** Public site navigation items */
const publicItems: NavItem[] = [
  { href: '/', icon: 'dashboard', label: 'HOME' },
  { href: '/features', icon: 'warning', label: 'FEAT' },
  { href: '/pricing', icon: 'star', label: 'PRICE' },
  { href: '/docs', icon: 'help', label: 'DOCS' },
  { href: '/login', icon: 'add', label: 'LOGIN' },
]

/** Dashboard navigation items */
const dashboardItems: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'DASH' },
  { href: '/dashboard/triggers', icon: 'triggers', label: 'TRIG' },
  { href: '/dashboard/events', icon: 'events', label: 'EVNT' },
  { href: '/dashboard/agents', icon: 'agents', label: 'AGNT' },
]

/**
 * Props for the BottomNav component.
 */
interface BottomNavProps {
  /** Navigation variant - public site or dashboard */
  variant: 'public' | 'dashboard'
  /** Callback when more button is clicked (dashboard only) */
  onMoreClick?: () => void
  /** Additional CSS classes */
  className?: string
}

export function BottomNav({ variant, onMoreClick, className }: BottomNavProps) {
  const pathname = usePathname() ?? ''
  const items = variant === 'public' ? publicItems : dashboardItems

  const isActive = (href: string) => {
    if (href === '/' || href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      aria-label={variant === 'dashboard' ? 'Dashboard navigation' : 'Main navigation'}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
        'bg-terminal border-t-2 border-terminal',
        className
      )}
    >
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            aria-label={item.label}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full',
              'transition-all duration-150',
              isActive(item.href)
                ? 'text-terminal-bright glow-sm'
                : 'text-terminal-dim hover:text-terminal-green'
            )}
          >
            <Icon name={item.icon} size="sm" />
            <span className="typo-ui mt-1">{item.label}</span>
          </Link>
        ))}

        {variant === 'dashboard' && (
          <button
            type="button"
            onClick={onMoreClick}
            aria-label="Open more options menu"
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full',
              'text-terminal-dim hover:text-terminal-green',
              'transition-all duration-150'
            )}
          >
            <Icon name="settings" size="sm" />
            <span className="typo-ui mt-1">MORE</span>
          </button>
        )}
      </div>
    </nav>
  )
}
