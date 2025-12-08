'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-terminal">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <div className="text-center">
            <h1 className="typo-header terminal-glow">[500]</h1>
            <h2 className="typo-header mt-2 text-terminal-dim">SOMETHING WENT WRONG</h2>
            <p className="typo-ui mt-2 text-terminal-dim/80">
              An unexpected error occurred. Please try again later.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="typo-ui border-2 border-terminal-dim px-4 py-2 text-terminal-dim hover:border-terminal-green hover:text-terminal-green transition-colors"
            >
              [RELOAD]
            </button>
            <button
              onClick={reset}
              className="typo-ui bg-terminal-green px-4 py-2 text-terminal-bg hover:bg-terminal-bright transition-colors"
            >
              [TRY AGAIN]
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
