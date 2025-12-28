'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary for OAuth callback page
 * Catches unhandled errors during code exchange and provides user-friendly recovery
 */
export default function CallbackError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for debugging (without sensitive data)
    console.error('OAuth callback error:', {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <div>
        <h1 className="typo-header text-destructive">Something went wrong</h1>
        <p className="mt-2 typo-ui text-terminal-dim">
          We encountered an error during authentication.
        </p>
        {error.digest && (
          <p className="mt-1 typo-code text-terminal-dim text-xs">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={reset}
          className="inline-block rounded-lg border-2 border-terminal-green bg-terminal px-6 py-3 typo-ui text-terminal-green hover:bg-terminal-green/10 transition-colors"
        >
          Try again
        </button>

        <Link
          href="/login"
          className="inline-block rounded-lg border-2 border-terminal-dim bg-terminal px-6 py-3 typo-ui text-terminal-dim hover:border-terminal-green hover:text-terminal-green transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}
