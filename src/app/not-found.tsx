import Link from 'next/link'
import { Button } from '@/components/atoms/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 bg-terminal">
      <div className="text-center">
        <h1 className="typo-header terminal-glow">[404]</h1>
        <h2 className="typo-header mt-2 text-terminal-dim">PAGE NOT FOUND</h2>
        <p className="typo-ui mt-2 text-terminal-dim/80">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/">[HOME]</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">[DASHBOARD]</Link>
        </Button>
      </div>
    </div>
  )
}
