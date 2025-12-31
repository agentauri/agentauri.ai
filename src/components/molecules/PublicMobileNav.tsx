'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { LogoBull } from '@/components/atoms/BullLogo'
import { Logo } from '@/components/atoms/logo'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/components/organisms/PublicNav'

interface PublicMobileNavProps {
  /** Navigation items */
  items?: NavItem[]
  /** Whether user is authenticated */
  isAuthenticated?: boolean
  /** CTA button text */
  ctaText?: {
    authenticated: string
    guest: string
  }
  className?: string
}

const DEFAULT_ITEMS: NavItem[] = [
  { href: '/features', label: 'FEATURES' },
  { href: '/pricing', label: 'PRICING' },
  { href: '/docs', label: 'DOCS' },
  { href: '/changelog', label: 'CHANGELOG' },
]

/**
 * Mobile navigation for public pages - Command Prompt style
 *
 * Features:
 * - Fixed bottom bar with "> MENU_" prompt
 * - Full-screen overlay with numbered menu items
 * - Terminal aesthetic with step-based animations
 * - Touch-friendly 44px minimum tap targets
 */
export function PublicMobileNav({
  items = DEFAULT_ITEMS,
  isAuthenticated = false,
  ctaText = { authenticated: 'DASHBOARD', guest: 'CONNECT' },
  className,
}: PublicMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() ?? ''

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }, [isOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <>
      {/* Fixed bottom bar - visible only on mobile */}
      <div
        className={cn(
          'md:hidden fixed bottom-0 left-0 right-0 z-50',
          'h-14 border-t-2 border-terminal-dim bg-terminal',
          'flex items-center justify-between px-4',
          className
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Home"
        >
          <LogoBull size={20} glow={true} />
          <Logo variant="compact" />
        </Link>

        {/* Menu toggle button */}
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="h-11 px-3 border-2 border-terminal-dim hover:border-terminal-green"
        >
          <span className="typo-ui text-terminal-green mr-2">
            {isOpen ? '> CLOSE_' : '> MENU_'}
          </span>
          <Icon
            name={isOpen ? 'close' : 'menu'}
            size="sm"
            className="text-terminal-green"
          />
        </Button>
      </div>

      {/* Full-screen overlay menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden fixed inset-0 z-40',
            'bg-terminal border-2 border-terminal-dim',
            'flex flex-col'
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Menu header */}
          <div className="h-16 border-b-2 border-terminal-dim flex items-center px-4">
            <span className="typo-ui text-terminal-green glow">
              [NAVIGATION]
            </span>
          </div>

          {/* Menu items */}
          <nav className="flex-1 flex flex-col justify-center px-6 space-y-4">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center h-12 px-4',
                  'border-2 transition-all',
                  isActive(item.href)
                    ? 'border-terminal-green bg-terminal-green/10 glow-sm'
                    : 'border-terminal-dim hover:border-terminal-green hover:bg-terminal-green/5'
                )}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="typo-ui text-terminal-dim w-8">
                  [{index + 1}]
                </span>
                <span
                  className={cn(
                    'typo-ui',
                    isActive(item.href)
                      ? 'text-terminal-bright'
                      : 'text-terminal-green'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Separator */}
            <div className="border-t-2 border-terminal-dim my-4" />

            {/* CTA Link */}
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className={cn(
                'flex items-center justify-center h-12 px-4',
                'border-2 border-terminal-green bg-terminal-green/20',
                'hover:bg-terminal-green/30 transition-all'
              )}
              onClick={() => setIsOpen(false)}
            >
              <span className="typo-ui text-terminal-bright glow-sm">
                [{isAuthenticated ? ctaText.authenticated : ctaText.guest}]
              </span>
            </Link>
          </nav>

          {/* Footer with close prompt */}
          <div className="h-16 border-t-2 border-terminal-dim flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors"
            >
              {'>'} ESC to close_
            </button>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind fixed bottom bar */}
      <div className="md:hidden h-14" aria-hidden="true" />
    </>
  )
}
