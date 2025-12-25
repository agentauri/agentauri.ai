'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { Button } from '@/components/atoms/button'
import { WalletOptions, OAuthButtons } from '@/components/molecules'
import { authApi } from '@/lib/api/auth'
import { useLogin } from '@/hooks'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoadingNonce, setIsLoadingNonce] = useState(false)

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
      const nonceData = await authApi.getNonce()
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
      <div className="text-center">
        <h1 className="typo-header text-terminal-green glow">
          Sign in to agentauri.ai
        </h1>
        <p className="mt-2 typo-ui text-terminal-dim">
          Connect your wallet or use social login
        </p>
      </div>

      <div className="rounded-lg border-2 border-terminal-dim bg-terminal p-6">
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
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-terminal-dim" />
              <span className="typo-ui text-terminal-dim text-xs">OR</span>
              <div className="flex-1 h-px bg-terminal-dim" />
            </div>

            {/* OAuth Options */}
            <div>
              <h2 className="typo-ui text-terminal-green text-sm mb-3 text-center">
                [ SOCIAL LOGIN ]
              </h2>
              <OAuthButtons redirectAfter="/dashboard" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-terminal-green/10 border border-terminal-dim p-4">
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
