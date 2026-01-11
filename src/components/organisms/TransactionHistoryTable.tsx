/**
 * TransactionHistoryTable
 *
 * Displays a table of credit transactions including purchases, usage,
 * refunds, and bonuses. Shows date, type, description, and amount.
 *
 * @module components/organisms/TransactionHistoryTable
 *
 * @example
 * ```tsx
 * <TransactionHistoryTable organizationId="org_123" />
 * ```
 */
'use client'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { ApiErrorDisplay, LoadingSkeleton } from '@/components/molecules'
import { EmptyListState } from '@/components/molecules/EmptyState'
import { useCreditTransactions } from '@/hooks'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/lib/validations/billing'

/**
 * Props for the TransactionHistoryTable component.
 */
interface TransactionHistoryTableProps {
  /** The organization ID to fetch transactions for */
  organizationId: string
  /** Additional CSS classes */
  className?: string
}

const transactionTypeConfig: Record<
  TransactionType,
  { label: string; className: string; prefix: string }
> = {
  purchase: {
    label: 'PURCHASE',
    className: 'border-terminal-green text-terminal-green',
    prefix: '+',
  },
  usage: {
    label: 'USAGE',
    className: 'border-terminal-dim text-terminal-dim',
    prefix: '-',
  },
  refund: {
    label: 'REFUND',
    className: 'border-yellow-500 text-yellow-500',
    prefix: '+',
  },
  bonus: {
    label: 'BONUS',
    className: 'border-purple-500 text-purple-500',
    prefix: '+',
  },
}

export function TransactionHistoryTable({
  organizationId,
  className,
}: TransactionHistoryTableProps) {
  const { data, isLoading, error } = useCreditTransactions(organizationId)

  if (isLoading) {
    return <LoadingSkeleton count={5} height={60} />
  }

  if (error) {
    return (
      <ApiErrorDisplay
        error={error instanceof Error ? error : new Error('An unexpected error occurred')}
        title="ERROR LOADING TRANSACTIONS"
      />
    )
  }

  const transactions = data?.data ?? []

  if (transactions.length === 0) {
    return <EmptyListState itemName="transaction" />
  }

  return (
    <div data-slot="transaction-history" className={cn('space-y-4', className)}>
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b-2 border-terminal-dim">
        <div className="col-span-3 typo-ui text-terminal-dim">&gt; DATE</div>
        <div className="col-span-2 typo-ui text-terminal-dim">&gt; TYPE</div>
        <div className="col-span-4 typo-ui text-terminal-dim">&gt; DESCRIPTION</div>
        <div className="col-span-3 typo-ui text-terminal-dim text-right">&gt; AMOUNT</div>
      </div>

      {/* Transaction Rows */}
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const config = transactionTypeConfig[transaction.type]
          const isPositive = transaction.type !== 'usage'

          return (
            <div
              key={transaction.id}
              className="border-2 border-terminal bg-terminal hover:border-terminal-green transition-colors p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Date */}
                <div className="md:col-span-3">
                  <div className="md:hidden typo-ui text-terminal-dim mb-1">&gt; DATE</div>
                  <div className="typo-ui text-terminal-green">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                  <div className="typo-ui text-terminal-dim text-xs">
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                {/* Type */}
                <div className="md:col-span-2">
                  <div className="md:hidden typo-ui text-terminal-dim mb-1">&gt; TYPE</div>
                  <Badge
                    variant="outline"
                    className={cn('typo-ui border-2 bg-transparent', config.className)}
                  >
                    {config.label}
                  </Badge>
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                  <div className="md:hidden typo-ui text-terminal-dim mb-1">&gt; DESCRIPTION</div>
                  <div className="typo-ui text-terminal-green">{transaction.description}</div>
                  {transaction.referenceId && (
                    <div className="typo-ui text-terminal-dim text-xs font-mono">
                      REF: {transaction.referenceId.slice(0, 12)}...
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="md:col-span-3 md:text-right">
                  <div className="md:hidden typo-ui text-terminal-dim mb-1">&gt; AMOUNT</div>
                  <div
                    className={cn(
                      'typo-header',
                      isPositive ? 'text-terminal-green glow' : 'text-terminal-dim'
                    )}
                  >
                    {config.prefix}
                    {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      {data?.pagination?.hasMore && (
        <div className="text-center">
          <Button variant="outline" className="typo-ui">
            [LOAD MORE]
          </Button>
        </div>
      )}
    </div>
  )
}
