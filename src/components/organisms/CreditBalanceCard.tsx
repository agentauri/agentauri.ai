/**
 * CreditBalanceCard
 *
 * Displays the current credit balance for an organization with
 * lifetime purchased and used statistics. Includes optional buy credits button.
 *
 * @module components/organisms/CreditBalanceCard
 *
 * @example
 * ```tsx
 * <CreditBalanceCard
 *   organizationId="org_123"
 *   onBuyCredits={() => openPurchaseModal()}
 * />
 * ```
 */
'use client'

import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { ApiErrorDisplay } from '@/components/molecules'
import { useCreditBalance } from '@/hooks'
import { cn } from '@/lib/utils'

/**
 * Props for the CreditBalanceCard component.
 */
interface CreditBalanceCardProps {
  /** The organization ID to fetch credit balance for */
  organizationId: string
  /** Callback when buy credits button is clicked */
  onBuyCredits?: () => void
  /** Additional CSS classes */
  className?: string
}

export function CreditBalanceCard({
  organizationId,
  onBuyCredits,
  className,
}: CreditBalanceCardProps) {
  const { data: balance, isLoading, error } = useCreditBalance(organizationId)

  if (isLoading) {
    return (
      <Box variant="default" padding="lg" className={cn('animate-pulse', className)}>
        <div className="h-8 bg-terminal-dim/20 rounded w-32 mb-4" />
        <div className="h-12 bg-terminal-dim/20 rounded w-48 mb-2" />
        <div className="h-4 bg-terminal-dim/20 rounded w-full" />
      </Box>
    )
  }

  if (error) {
    return (
      <ApiErrorDisplay
        error={error instanceof Error ? error : new Error('An unexpected error occurred')}
        title="FAILED TO LOAD BALANCE"
        className={className}
      />
    )
  }

  const formatCredits = (amount: number) => {
    return amount.toLocaleString()
  }

  return (
    <Box variant="default" padding="lg" className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="typo-ui text-terminal-dim mb-2">&gt; CREDIT BALANCE</div>
          <div className="text-4xl font-bold text-terminal-green glow">
            {balance ? formatCredits(balance.balance) : '-'}
          </div>
          <div className="typo-ui text-terminal-dim mt-1">credits available</div>
        </div>
        {onBuyCredits && (
          <Button onClick={onBuyCredits} className="typo-ui">
            <Icon name="add" size="sm" className="mr-1" />
            [BUY CREDITS]
          </Button>
        )}
      </div>

      {balance && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-terminal-dim">
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; LIFETIME PURCHASED</div>
            <div className="typo-header text-terminal-green">
              {formatCredits(balance.lifetimePurchased)}
            </div>
          </div>
          <div>
            <div className="typo-ui text-terminal-dim mb-1">&gt; LIFETIME USED</div>
            <div className="typo-header text-terminal-green">
              {formatCredits(balance.lifetimeUsed)}
            </div>
          </div>
        </div>
      )}
    </Box>
  )
}
