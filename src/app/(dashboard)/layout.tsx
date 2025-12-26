'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DashboardSidebar, BottomNav, MobileMenu } from '@/components/templates'
import { CreateOrganizationDialog } from '@/components/organisms'
import { useOrganizations, useSwitchOrganization } from '@/hooks'
import { useUIStore } from '@/stores/ui-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const { currentOrganizationId, isHydrated } = useOrganizationStore()
  const { data: orgsData, isLoading: orgsLoading } = useOrganizations()
  const switchOrg = useSwitchOrganization()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [hasCheckedOrgs, setHasCheckedOrgs] = useState(false)

  const organizations = orgsData?.data ?? []

  // Check organizations after data loads
  useEffect(() => {
    if (orgsLoading || !isHydrated || hasCheckedOrgs) return

    // User has no organizations - show create dialog
    if (organizations.length === 0) {
      setShowCreateDialog(true)
      setHasCheckedOrgs(true)
      return
    }

    // User has organizations but none selected - select first one
    if (!currentOrganizationId && organizations.length > 0) {
      const firstOrg = organizations[0]
      if (firstOrg) {
        switchOrg.mutate(firstOrg.organization.id)
      }
    }

    setHasCheckedOrgs(true)
  }, [orgsLoading, isHydrated, organizations, currentOrganizationId, hasCheckedOrgs, switchOrg])

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

      {/* Create Organization Dialog - shown when user has no organizations */}
      <CreateOrganizationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}
