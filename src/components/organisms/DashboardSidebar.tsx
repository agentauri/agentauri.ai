'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { Icon, type IconName } from '@/components/atoms/icon'

const navItems: { href: string; icon: IconName; label: string }[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'DASHBOARD' },
  { href: '/dashboard/triggers', icon: 'triggers', label: 'TRIGGERS' },
  { href: '/dashboard/events', icon: 'events', label: 'EVENTS' },
  { href: '/dashboard/agents', icon: 'agents', label: 'AGENTS' },
  { href: '/dashboard/api-keys', icon: 'api-keys', label: 'API KEYS' },
  { href: '/dashboard/billing', icon: 'chart', label: 'BILLING' },
  { href: '/dashboard/settings', icon: 'settings', label: 'SETTINGS' },
]

interface DashboardSidebarProps {
  className?: string
  /** Override pathname for Storybook */
  activePath?: string
}

export function DashboardSidebar({ className, activePath }: DashboardSidebarProps) {
  const routerPathname = usePathname() ?? ''
  const pathname = activePath ?? routerPathname
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen',
        'fixed left-0 top-0 z-40',
        'bg-terminal border-r-2 border-terminal',
        'transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-56',
        className
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b-2 border-terminal-dim">
        <Link
          href="/"
          className={cn(
            'text-terminal-green glow hover:text-terminal-bright transition-colors',
            'flex items-center gap-2'
          )}
        >
          <Icon name="logo" size="sm" />
          {!sidebarCollapsed && <span className="typo-ui">AGENTAURI.AI</span>}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-terminal-dim hover:text-terminal-green transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={sidebarCollapsed ? 'collapse' : 'expand'} size="sm" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  'transition-all duration-150',
                  isActive(item.href)
                    ? 'text-terminal-bright glow-sm bg-terminal-green/5'
                    : 'text-terminal-dim hover:text-terminal-green hover:bg-terminal-green/5'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">
                  {isActive(item.href) ? (
                    <Icon name="active-nav" size="sm" />
                  ) : (
                    <Icon name={item.icon} size="sm" />
                  )}
                </span>
                {!sidebarCollapsed && (
                  <span className="typo-ui truncate">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t-2 border-terminal-dim p-4">
        <button
          type="button"
          className={cn(
            'flex items-center gap-3 w-full',
            'text-terminal-dim hover:text-destructive',
            'transition-all duration-150'
          )}
        >
          <Icon name="close" size="sm" />
          {!sidebarCollapsed && (
            <span className="typo-ui">DISCONNECT</span>
          )}
        </button>
      </div>
    </aside>
  )
}
