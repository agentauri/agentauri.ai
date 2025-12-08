'use client'

import { PublicNav, BottomNav } from '@/components/templates'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-terminal">
      <PublicNav />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav variant="public" />
    </div>
  )
}
