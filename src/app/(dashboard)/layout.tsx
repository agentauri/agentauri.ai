'use client'

import type { ReactNode } from 'react'
import { DashboardSidebar, BottomNav, MobileMenu } from '@/components/templates'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-terminal">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          'pb-16 md:pb-0',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-56'
        )}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav
        variant="dashboard"
        onMoreClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  )
}
