'use client'

import { useEffect } from 'react'
import { Button } from '@/components/atoms/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="typo-header text-foreground">Something went wrong</h2>
        <p className="typo-ui mt-2 text-muted-foreground">
          An error occurred while loading the dashboard.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 max-w-lg overflow-auto rounded bg-muted p-4 text-left typo-code">
            {error.message}
          </pre>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
