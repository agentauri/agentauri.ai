'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'
import { OAuthButtons, WalletOptions } from '@/components/molecules'
import { authApi } from '@/lib/api/auth'
import { useLogin } from '@/hooks'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoadingNonce, setIsLoadingNonce] = useState(false)
  const [organizationName, setOrganizationName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync, isPending: isSigning } = useSignMessage()

  const login = useLogin()

  const handleSignUp = async () => {
    if (!address) return

    if (!organizationName.trim()) {
      setError('Organization name is required')
      return
    }

    if (!acceptedTerms) {
      setError('You must accept the Terms of Service')
      return
    }

    setError(null)
    setIsLoadingNonce(true)

    try {
      // 1. Get nonce and pre-formatted message from backend
      const nonceData = await authApi.getNonce(address)
      setIsLoadingNonce(false)

      // 2. Sign the pre-formatted message
      const signature = await signMessageAsync({ message: nonceData.message })

      // 3. Login with address, signature, and message
      // Note: Backend will create organization based on first login
      await login.mutateAsync({
        address,
        signature,
        message: nonceData.message,
      })
    } catch (err) {
      setIsLoadingNonce(false)
      setError(err instanceof Error ? err.message : 'Failed to sign up')
    }
  }

  const isLoading = isLoadingNonce || isSigning || login.isPending
  const canSubmit = organizationName.trim() && acceptedTerms && !isLoading

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="typo-header text-terminal-green glow">
          Create your account
        </h1>
        <p className="mt-2 typo-ui text-terminal-dim">
          Connect your wallet to get started
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

            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="org-name" className="typo-ui text-terminal-green">
                Organization Name
              </Label>
              <Input
                id="org-name"
                type="text"
                placeholder="> Enter organization name..."
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
              <p className="typo-ui text-terminal-dim text-xs">
                This will be your workspace name on AgentAuri
              </p>
            </div>

            {/* Terms of Service */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="typo-ui text-terminal-dim text-sm leading-relaxed">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-terminal-green hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-terminal-green hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              className="w-full"
              onClick={handleSignUp}
              disabled={!canSubmit}
            >
              {isLoadingNonce
                ? 'Preparing...'
                : isSigning
                  ? 'Sign in wallet...'
                  : login.isPending
                    ? 'Creating account...'
                    : '[ CREATE ACCOUNT ]'}
            </Button>

            <Button variant="outline" className="w-full" onClick={() => disconnect()}>
              [ DISCONNECT ]
            </Button>

            {error && (
              <p className="text-center typo-ui text-destructive">{error}</p>
            )}
            {login.isError && (
              <p className="text-center typo-ui text-destructive">
                {login.error instanceof Error ? login.error.message : 'Registration failed'}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-center typo-ui text-terminal-dim text-sm">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-terminal-green hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
