'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BuildingIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useLogout } from '@/hooks/use-auth'
import { Icon, type IconName } from '@/components/atoms/icon'
import { SidebarUserInfo } from '@/components/molecules/SidebarUserInfo'

type NavItem = {
  href: string
  label: string
} & ({ icon: IconName; lucideIcon?: never } | { lucideIcon: React.ComponentType<{ className?: string }>; icon?: never })

const navItems: NavItem[] = [
  { href: '/dashboard/organizations', lucideIcon: BuildingIcon, label: 'ORGANIZATION' },
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
  const logout = useLogout()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    // Special case: /dashboard/organizations should match exactly
    if (href === '/dashboard/organizations') {
      return pathname === href || pathname.startsWith('/dashboard/organizations/')
    }
    return pathname.startsWith(href)
  }

  const handleDisconnect = () => {
    logout.mutate()
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
      <nav aria-label="Main navigation" className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
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
                  ) : item.lucideIcon ? (
                    <item.lucideIcon className="w-3 h-3" />
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
      <div className="border-t-2 border-terminal-dim">
        {/* User Info */}
        <SidebarUserInfo collapsed={sidebarCollapsed} />

        {/* Disconnect Button */}
        <div className="p-4 pt-2">
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={logout.isPending}
            aria-label={sidebarCollapsed ? 'Disconnect wallet and sign out' : undefined}
            aria-busy={logout.isPending}
            className={cn(
              'flex items-center gap-3 w-full',
              'text-terminal-dim hover:text-destructive',
              'transition-all duration-150',
              logout.isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Icon name="close" size="sm" />
            {!sidebarCollapsed && (
              <span className="typo-ui">
                {logout.isPending ? 'DISCONNECTING...' : 'DISCONNECT'}
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
