/**
 * OAuthButtons
 *
 * Renders OAuth login buttons for available providers (Google, GitHub) with pixel art icons.
 * Handles redirect to OAuth flow with configurable post-auth destination.
 *
 * @module components/molecules/OAuthButtons
 *
 * @example
 * ```tsx
 * <OAuthButtons
 *   providers={['google', 'github']}
 *   redirectAfter="/dashboard/agents"
 *   isLoading={isPending}
 * />
 * ```
 */

'use client'

import { Button } from '@/components/atoms/button'
import { getOAuthIcon } from '@/components/atoms/wallet-icons'
import { authApi } from '@/lib/api/auth'
import type { OAuthProvider } from '@/lib/validations'
import { cn } from '@/lib/utils'

/** Configuration for OAuth provider display */
interface OAuthProviderConfig {
  id: OAuthProvider
  name: string
}

/** Available OAuth providers with their display names */
const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: 'google',
    name: 'Google',
  },
  {
    id: 'github',
    name: 'GitHub',
  },
]

interface OAuthButtonsProps {
  /** Which providers to show (default: all) */
  providers?: OAuthProvider[]
  /** Where to redirect after successful auth (default: /dashboard) */
  redirectAfter?: string
  /** Additional CSS classes */
  className?: string
  /** Loading state */
  isLoading?: boolean
}

/**
 * Renders a list of OAuth provider buttons that initiate the OAuth flow on click.
 */
export function OAuthButtons({
  providers,
  redirectAfter,
  className,
  isLoading = false,
}: OAuthButtonsProps) {
  const availableProviders = providers
    ? OAUTH_PROVIDERS.filter((p) => providers.includes(p.id))
    : OAUTH_PROVIDERS

  const handleClick = (provider: OAuthProviderConfig) => {
    if (isLoading) return
    // Build callback URL with optional redirect destination
    // Backend will redirect to: /callback?token=xxx (legacy) or /callback?code=oac_xxx (new)
    // The callback page handles auth and then redirects to final destination
    const finalRedirect = redirectAfter || '/dashboard'
    const callbackUrl = `/callback?redirect=${encodeURIComponent(finalRedirect)}`
    const url = authApi.getOAuthUrl(provider.id, callbackUrl)
    window.location.href = url
  }

  return (
    <div className={cn('space-y-3', className)}>
      {availableProviders.map((provider) => {
        const IconComponent = getOAuthIcon(provider.id)
        return (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            className={cn(
              'w-full justify-between gap-2 h-auto py-3 px-4',
              'border-terminal-dim',
              'hover:border-terminal-green hover:bg-terminal-green/10 transition-all'
            )}
            onClick={() => handleClick(provider)}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3 min-w-0">
              <IconComponent size={24} className="shrink-0" />
              <span className="typo-ui text-terminal-green truncate">
                {provider.name}
              </span>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
