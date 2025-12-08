import Link from 'next/link'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="typo-header terminal-glow">
            agentauri.ai
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center typo-ui text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} agentauri.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
