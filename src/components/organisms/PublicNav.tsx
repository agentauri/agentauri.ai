/**
 * PublicNav
 *
 * Horizontal navigation bar for public pages with logo, links, and CTA button.
 * Supports badges, icons, and full customization of navigation items.
 *
 * @module components/organisms/PublicNav
 *
 * @example
 * ```tsx
 * // Default navigation
 * <PublicNav />
 *
 * // Authenticated user
 * <PublicNav isAuthenticated={true} />
 *
 * // Custom items
 * <PublicNav
 *   items={[
 *     { href: '/about', label: 'ABOUT' },
 *     { href: '/blog', label: 'BLOG', badge: { text: 'NEW' } }
 *   ]}
 * />
 * ```
 */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/atoms/logo'
import { LogoBull } from '@/components/atoms/BullLogo'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Icon, type IconName } from '@/components/atoms/icon'
import { Separator } from '@/components/atoms/separator'
import { cn } from '@/lib/utils'

/**
 * Navigation item configuration.
 */
export interface NavItem {
  /** Link destination */
  href: string
  /** Display label */
  label: string
  /** Optional badge to display next to label */
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  /** Optional icon to display before label */
  icon?: IconName
}

/**
 * Props for the PublicNav component.
 */
export interface PublicNavProps {
  /** Navigation items. Defaults to features, pricing, docs, changelog */
  items?: NavItem[]
  /** Branding configuration */
  branding?: {
    text: string
    href: string
  }
  /** Whether user is authenticated */
  isAuthenticated?: boolean
  /** CTA button text */
  ctaText?: {
    authenticated: string
    guest: string
  }
  /** Show separators between sections */
  showSeparators?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Default navigation items
 */
const DEFAULT_ITEMS: NavItem[] = [
  { href: '/features', label: 'FEATURES' },
  { href: '/pricing', label: 'PRICING' },
  { href: '/docs', label: 'DOCS' },
  { href: '/changelog', label: 'CHANGELOG' },
]

/**
 * Logo component
 */
function NavLogo({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 hover:text-terminal-bright transition-colors"
      aria-label="Home"
    >
      <LogoBull size={24} glow={true} />
      <Logo variant="compact" />
    </Link>
  )
}

/**
 * Single navigation link with optional badge and icon
 */
function NavLinkItem({
  item,
  isActive,
}: {
  item: NavItem
  isActive: boolean
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-1.5',
        'typo-ui uppercase transition-all duration-150',
        isActive
          ? 'text-terminal-bright glow-sm'
          : 'text-terminal-dim hover:text-terminal-green'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && <Icon name={item.icon} size="sm" aria-hidden="true" />}
      <span className="typo-ui">{item.label}</span>
      {item.badge && (
        <Badge
          variant={item.badge.variant ?? 'default'}
          className="typo-ui ml-0.5"
        >
          {item.badge.text}
        </Badge>
      )}
    </Link>
  )
}

/**
 * Public navigation bar component
 *
 * Horizontal navigation for public pages with logo, links, and CTA button.
 * Supports badges, icons, and full customization.
 */
export function PublicNav({
  items = DEFAULT_ITEMS,
  branding = { text: '[AGENTAURI.AI]', href: '/' },
  isAuthenticated = false,
  ctaText = { authenticated: 'DASHBOARD', guest: 'CONNECT' },
  showSeparators = true,
  className,
}: PublicNavProps) {
  const pathname = usePathname() ?? ''

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header
      className={cn(
        'hidden md:flex items-center justify-between',
        'h-16 px-6 border-b-2 border-terminal bg-terminal',
        className
      )}
    >
      {/* Logo */}
      <NavLogo href={branding.href} />

      {/* Separator */}
      {showSeparators && (
        <Separator
          orientation="vertical"
          className="h-6 bg-terminal-dim mx-4"
        />
      )}

      {/* Navigation Links */}
      <nav className="flex items-center gap-6">
        {items.map((item) => (
          <NavLinkItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Separator */}
      {showSeparators && (
        <Separator
          orientation="vertical"
          className="h-6 bg-terminal-dim mx-4"
        />
      )}

      {/* CTA Button */}
      <Button asChild variant="outline" size="sm">
        <Link href={isAuthenticated ? '/dashboard' : '/login'}>
          {isAuthenticated ? ctaText.authenticated : ctaText.guest}
        </Link>
      </Button>
    </header>
  )
}
