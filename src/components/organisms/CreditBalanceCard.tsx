'use client'

import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { useCreditBalance } from '@/hooks'
import { cn } from '@/lib/utils'

interface CreditBalanceCardProps {
  organizationId: string
  onBuyCredits?: () => void
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
      <Box variant="error" padding="lg" className={className}>
        <p className="typo-ui text-destructive flex items-center gap-2">
          <Icon name="warning" size="sm" />
          FAILED TO LOAD BALANCE
        </p>
      </Box>
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
