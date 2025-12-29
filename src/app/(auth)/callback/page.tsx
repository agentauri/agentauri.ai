'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { queryKeys } from '@/lib/query-keys'
import { sanitizeRedirectUrl } from '@/lib/security-headers'

type CallbackState = 'loading' | 'success' | 'error'

function OAuthCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setAuthenticated } = useAuthStore()

  const [state, setState] = useState<CallbackState>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const code = searchParams.get('code')
  const token = searchParams.get('token') // Legacy flow support
  const refreshToken = searchParams.get('refresh_token')
  const error = searchParams.get('error')
  // Sanitize redirect URL to prevent open redirect attacks
  const redirectTo = sanitizeRedirectUrl(searchParams.get('redirect'), '/dashboard')

  useEffect(() => {
    // Handle OAuth error from provider
    if (error) {
      setState('error')
      setErrorMessage(error === 'access_denied' ? 'Access was denied' : 'OAuth authentication failed')
      return
    }

    // Setup cleanup
    const abortController = new AbortController()
    let redirectTimeout: NodeJS.Timeout | null = null

    // Handle legacy token flow (backend sends ?token=xxx directly)
    const handleLegacyToken = async () => {
      if (!token) return false

      try {
        // Store token via set-tokens endpoint
        const response = await fetch('/api/auth/set-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            refresh_token: refreshToken || token, // Fallback if no refresh token
            expires_in: 3600, // 1 hour default
          }),
          credentials: 'include',
          signal: abortController.signal,
        })

        if (abortController.signal.aborted) return true

        if (!response.ok) {
          throw new Error('Failed to store authentication tokens')
        }

        // Success
        setAuthenticated(true)
        setState('success')
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })

        redirectTimeout = setTimeout(() => {
          if (!abortController.signal.aborted) {
            router.push(redirectTo)
          }
        }, 500)

        return true
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return true
        throw err
      }
    }

    // Handle new Authorization Code flow (backend sends ?code=oac_xxx)
    const handleAuthorizationCode = async () => {
      if (!code) return false

      // Validate code format
      if (!code.startsWith('oac_')) {
        setState('error')
        setErrorMessage('Invalid authorization code')
        return true
      }

      try {
        const response = await fetch('/api/auth/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          credentials: 'include',
          signal: abortController.signal,
        })

        if (abortController.signal.aborted) return true

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Authentication failed')
        }

        // Success
        setAuthenticated(true)
        setState('success')
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })

        redirectTimeout = setTimeout(() => {
          if (!abortController.signal.aborted) {
            router.push(redirectTo)
          }
        }, 500)

        return true
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return true
        throw err
      }
    }

    // Process authentication
    const processAuth = async () => {
      try {
        // Try legacy token flow first (for backward compatibility)
        if (token) {
          await handleLegacyToken()
          return
        }

        // Try new Authorization Code flow
        if (code) {
          await handleAuthorizationCode()
          return
        }

        // No token or code present
        setState('error')
        setErrorMessage('No authorization code received')
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setState('error')
        setErrorMessage(err instanceof Error ? err.message : 'Authentication failed')
      }
    }

    processAuth()

    // Cleanup function to prevent memory leaks
    return () => {
      abortController.abort()
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [code, token, refreshToken, error, router, setAuthenticated, queryClient, redirectTo])

  return (
    <div className="space-y-6 text-center">
      {state === 'loading' && (
        <>
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-terminal-dim border-t-terminal-green" />
          </div>
          <div>
            <h1 className="typo-header text-terminal-green glow">Completing sign in...</h1>
            <p className="mt-2 typo-ui text-terminal-dim">Please wait while we authenticate you.</p>
          </div>
        </>
      )}

      {state === 'success' && (
        <>
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terminal-green/20 text-terminal-green">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="typo-header text-terminal-green glow">Welcome!</h1>
            <p className="mt-2 typo-ui text-terminal-dim">Redirecting to dashboard...</p>
          </div>
        </>
      )}

      {state === 'error' && (
        <>
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="typo-header text-destructive">Authentication Failed</h1>
            <p className="mt-2 typo-ui text-terminal-dim">{errorMessage}</p>
          </div>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-block rounded-lg border-2 border-terminal-dim bg-terminal px-6 py-3 typo-ui text-terminal-green hover:border-terminal-green transition-colors"
            >
              Try again
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function CallbackFallback() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-terminal-dim border-t-terminal-green" />
      </div>
      <div>
        <h1 className="typo-header text-terminal-green glow">Completing sign in...</h1>
        <p className="mt-2 typo-ui text-terminal-dim">Please wait while we authenticate you.</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <OAuthCallbackContent />
    </Suspense>
  )
}
