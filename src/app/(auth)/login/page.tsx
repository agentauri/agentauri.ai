'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { Button } from '@/components/atoms/button'
import { useLogin, useNonce } from '@/hooks'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync, isPending: isSigning } = useSignMessage()

  const { data: nonceData, isLoading: isLoadingNonce } = useNonce(address)
  const login = useLogin()

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  const handleSignIn = async () => {
    if (!address || !nonceData) return

    setError(null)

    try {
      // Create SIWE message
      const domain = window.location.host
      const origin = window.location.origin
      const statement = 'Sign in to agentauri.ai'
      const issuedAt = new Date().toISOString()

      const message = `${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${origin}
Version: 1
Chain ID: 1
Nonce: ${nonceData.nonce}
Issued At: ${issuedAt}`

      // Sign message
      const signature = await signMessageAsync({ message })

      // Login
      await login.mutateAsync({
        message,
        signature,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="typo-header">Sign in to agentauri.ai</h1>
        <p className="mt-2 typo-ui text-muted-foreground">
          Connect your wallet to access the dashboard
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        {!isConnected ? (
          <div className="space-y-4">
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            <p className="text-center typo-ui text-muted-foreground">
              MetaMask or any injected wallet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="typo-ui text-muted-foreground">Connected as</p>
              <p className="typo-code">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleSignIn}
              disabled={isSigning || login.isPending || isLoadingNonce}
            >
              {isSigning || login.isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <Button variant="outline" className="w-full" onClick={() => disconnect()}>
              Disconnect
            </Button>

            {error && <p className="text-center typo-ui text-destructive">{error}</p>}
            {login.isError && (
              <p className="text-center typo-ui text-destructive">
                {login.error instanceof Error ? login.error.message : 'Login failed'}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-center typo-ui text-muted-foreground">
        Don&apos;t have a wallet?{' '}
        <Link href="https://metamask.io" className="text-primary hover:underline" target="_blank">
          Get MetaMask
        </Link>
      </p>
    </div>
  )
}
