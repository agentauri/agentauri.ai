'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { Button } from '@/components/atoms/button'
import { OAuthButtons, WalletOptions } from '@/components/molecules'
import { authApi } from '@/lib/api/auth'
import { useLogin } from '@/hooks'
import { resetSessionExpiredFlag } from '@/lib/auth-utils'

function LoginContent() {
  const searchParams = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'

  const [error, setError] = useState<string | null>(null)
  const [isLoadingNonce, setIsLoadingNonce] = useState(false)

  // Reset redirect flag when landing on login page
  useEffect(() => {
    resetSessionExpiredFlag()
  }, [])

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync, isPending: isSigning } = useSignMessage()

  const login = useLogin()

  const handleSignIn = async () => {
    if (!address) return

    setError(null)
    setIsLoadingNonce(true)

    try {
      // 1. Get nonce and pre-formatted message from backend
      const nonceData = await authApi.getNonce(address)
      setIsLoadingNonce(false)

      // 2. Sign the pre-formatted message
      const signature = await signMessageAsync({ message: nonceData.message })

      // 3. Login with address, signature, and message
      await login.mutateAsync({
        address,
        signature,
        message: nonceData.message,
      })
    } catch (err) {
      setIsLoadingNonce(false)
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    }
  }

  const isLoading = isLoadingNonce || isSigning || login.isPending

  return (
    <div className="space-y-6">
      {/* Session expired message */}
      {sessionExpired && (
        <div className="border-2 border-terminal-dim bg-terminal p-4 text-center">
          <p className="typo-ui text-terminal-green">
            Your session has expired. Please sign in again.
          </p>
        </div>
      )}

      <div className="text-center">
        <h1 className="typo-header text-terminal-green glow">
          Sign in to agentauri.ai
        </h1>
        <p className="mt-2 typo-ui text-terminal-dim">
          Connect your wallet to sign in
        </p>
      </div>

      <div className="border-2 border-terminal-dim bg-terminal p-6">
        {!isConnected ? (
          <div className="space-y-6">
            {/* Wallet Options */}
            <div>
              <h2 className="typo-ui text-terminal-green text-sm mb-3 text-center">
                [ CONNECT WALLET ]
              </h2>
              <WalletOptions />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-terminal-dim" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-terminal px-2 typo-ui text-terminal-dim">OR</span>
              </div>
            </div>

            {/* OAuth Options */}
            <div>
              <h2 className="typo-ui text-terminal-green text-sm mb-3 text-center">
                [ CONTINUE WITH ]
              </h2>
              <OAuthButtons />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-terminal-green/10 border-2 border-terminal-dim p-4">
              <p className="typo-ui text-terminal-dim text-sm">Connected as</p>
              <p className="typo-code text-terminal-green">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoadingNonce
                ? 'Preparing...'
                : isSigning
                  ? 'Sign in wallet...'
                  : login.isPending
                    ? 'Signing in...'
                    : '[ SIGN IN ]'}
            </Button>

            <Button variant="outline" className="w-full" onClick={() => disconnect()}>
              [ DISCONNECT ]
            </Button>

            {error && (
              <p className="text-center typo-ui text-destructive">{error}</p>
            )}
            {login.isError && (
              <p className="text-center typo-ui text-destructive">
                {login.error instanceof Error ? login.error.message : 'Login failed'}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-center typo-ui text-terminal-dim text-sm">
        Don&apos;t have a wallet?{' '}
        <Link
          href="https://metamask.io"
          className="text-terminal-green hover:underline"
          target="_blank"
        >
          Get MetaMask
        </Link>
      </p>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="typo-header text-terminal-green glow">
          Sign in to agentauri.ai
        </h1>
        <p className="mt-2 typo-ui text-terminal-dim">
          Connect your wallet to sign in
        </p>
      </div>
      <div className="border-2 border-terminal-dim bg-terminal p-6">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin border-4 border-terminal-dim border-t-terminal-green" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
