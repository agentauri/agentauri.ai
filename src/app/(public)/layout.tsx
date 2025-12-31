'use client'

import { PublicNav } from '@/components/templates'
import { PublicMobileNav } from '@/components/molecules'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-terminal">
      <PublicNav />
      <main>{children}</main>
      <PublicMobileNav />
    </div>
  )
}
