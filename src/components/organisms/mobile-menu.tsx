'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/atoms/icon'

const menuItems: { href: string; icon: IconName; label: string }[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'DASHBOARD' },
  { href: '/dashboard/triggers', icon: 'triggers', label: 'TRIGGERS' },
  { href: '/dashboard/events', icon: 'events', label: 'EVENTS' },
  { href: '/dashboard/agents', icon: 'agents', label: 'AGENTS' },
  { href: '/dashboard/api-keys', icon: 'api-keys', label: 'API KEYS' },
  { href: '/dashboard/settings', icon: 'settings', label: 'SETTINGS' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  /** Override pathname for Storybook */
  activePath?: string
}

export function MobileMenu({ isOpen, onClose, activePath }: MobileMenuProps) {
  const routerPathname = usePathname() ?? ''
  const pathname = activePath ?? routerPathname

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'bg-terminal flex flex-col',
        'animate-boot'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b-2 border-terminal">
        <span className="text-terminal-green typo-ui glow flex items-center gap-2">
          <Icon name="menu" size="sm" />
          MENU
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-terminal-dim hover:text-terminal-green typo-ui transition-colors flex items-center gap-2"
        >
          <Icon name="close" size="sm" />
          CLOSE
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col justify-start pt-8 px-8">
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li
              key={item.href}
              className="animate-boot"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 py-3',
                  'transition-all duration-150',
                  isActive(item.href)
                    ? 'text-terminal-bright glow'
                    : 'text-terminal-dim hover:text-terminal-green'
                )}
              >
                <span>
                  {isActive(item.href) ? (
                    <Icon name="active-nav" size="sm" />
                  ) : (
                    <Icon name={item.icon} size="sm" />
                  )}
                </span>
                <span className="typo-ui">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-8 py-6 border-t-2 border-terminal-dim">
        <button
          type="button"
          className={cn(
            'flex items-center gap-4 w-full',
            'text-terminal-dim hover:text-destructive',
            'transition-all duration-150'
          )}
        >
          <Icon name="close" size="sm" />
          <span className="typo-ui">DISCONNECT</span>
        </button>
      </div>
    </div>
  )
}
