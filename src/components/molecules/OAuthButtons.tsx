'use client'

import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

interface OAuthProvider {
  id: string
  name: string
  icon: string
  disabled?: boolean
}

const OAUTH_PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'G',
    disabled: true, // Backend not implemented yet
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    disabled: true, // Backend not implemented yet
  },
]

interface OAuthButtonsProps {
  /** Which providers to show (default: all) */
  providers?: string[]
  /** Callback when a provider is selected */
  onSelect?: (providerId: string) => void
  /** Additional CSS classes */
  className?: string
}

export function OAuthButtons({
  providers,
  onSelect,
  className,
}: OAuthButtonsProps) {
  const availableProviders = providers
    ? OAUTH_PROVIDERS.filter((p) => providers.includes(p.id))
    : OAUTH_PROVIDERS

  const handleClick = (provider: OAuthProvider) => {
    if (provider.disabled) return
    onSelect?.(provider.id)
    // When enabled, redirect to OAuth endpoint
    // window.location.href = `/api/auth/${provider.id}`
  }

  return (
    <div className={cn('space-y-3', className)}>
      {availableProviders.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className={cn(
            'w-full justify-between gap-2 h-auto py-3 px-4',
            'border-terminal-dim',
            provider.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-terminal-green hover:bg-terminal-green/10 transition-all'
          )}
          onClick={() => handleClick(provider)}
          disabled={provider.disabled}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={cn(
                'w-6 h-6 flex items-center justify-center text-lg shrink-0',
                provider.id === 'google' && 'font-bold text-terminal-green'
              )}
              aria-hidden
            >
              {provider.icon}
            </span>
            <span className="typo-ui text-terminal-green truncate">
              {provider.name}
            </span>
          </div>
          {provider.disabled && (
            <span className="typo-ui text-[10px] text-terminal-dim border border-terminal-dim px-1.5 py-0.5 shrink-0 whitespace-nowrap">
              SOON
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}
