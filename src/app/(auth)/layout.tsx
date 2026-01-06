import Link from 'next/link'
import type { ReactNode } from 'react'
import { LogoBull } from '@/components/atoms/BullLogo'
import { Logo } from '@/components/atoms/logo'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col scanlines bg-terminal">
      <header className="border-b-2 border-terminal-green bg-terminal">
        <div className="container flex h-16 items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <LogoBull size={28} glow={true} />
            <Logo variant="compact" />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="border-t-2 border-terminal-dim py-6">
        <div className="container text-center typo-ui text-terminal-dim">
          <p>&copy; {new Date().getFullYear()} AGENTAURI.AI {'//'} ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  )
}
