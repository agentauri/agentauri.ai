'use client'

import { Box } from '@/components/atoms/box'
import { Icon } from '@/components/atoms/icon'
import {
  CreditBalanceCard,
  TransactionHistoryTable,
} from '@/components/organisms'
import { useCreateCheckout, useCurrentOrganization } from '@/hooks'

export default function BillingPage() {
  const { data: orgData, isLoading } = useCurrentOrganization()
  const organization = orgData?.organization

  const createCheckout = useCreateCheckout(organization?.id ?? '')

  const handleBuyCredits = () => {
    // This would trigger the Stripe checkout
    // For now, just show a placeholder message
    createCheckout.mutate({
      priceId: 'price_credits_1000',
      quantity: 1,
    })
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING BILLING_
        </p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] NO ORGANIZATION SELECTED</p>
        <p className="text-terminal-dim typo-ui">
          Please select an organization to view billing
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-terminal pb-6">
        <div>
          <h1 className="typo-header text-terminal-green glow mb-2">
            [#] BILLING & CREDITS
          </h1>
          <p className="typo-ui text-terminal-dim">
            Manage your credits and view transaction history
          </p>
        </div>
      </div>

      {/* Credit Balance */}
      <CreditBalanceCard
        organizationId={organization.id}
        onBuyCredits={handleBuyCredits}
      />

      {/* Pricing Plans Info */}
      <Box variant="default" padding="md">
        <div className="flex items-start gap-3">
          <Icon name="info" size="md" className="text-terminal-green shrink-0" />
          <div>
            <p className="typo-ui text-terminal-green mb-2">CREDIT PACKAGES</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-terminal-dim p-3">
                <div className="typo-ui text-terminal-dim mb-1">STARTER</div>
                <div className="typo-header text-terminal-green">1,000</div>
                <div className="typo-ui text-terminal-dim text-sm">$10</div>
              </div>
              <div className="border-2 border-terminal-green p-3">
                <div className="typo-ui text-terminal-green mb-1">POPULAR</div>
                <div className="typo-header text-terminal-green">5,000</div>
                <div className="typo-ui text-terminal-dim text-sm">$40</div>
              </div>
              <div className="border-2 border-terminal-dim p-3">
                <div className="typo-ui text-terminal-dim mb-1">ENTERPRISE</div>
                <div className="typo-header text-terminal-green">25,000</div>
                <div className="typo-ui text-terminal-dim text-sm">$150</div>
              </div>
            </div>
            <p className="typo-ui text-terminal-dim/70 text-sm mt-3">
              Credits are used for API calls and trigger executions. Buy once, use anytime.
            </p>
          </div>
        </div>
      </Box>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="typo-header text-terminal-green glow">
          [#] TRANSACTION HISTORY
        </h2>
        <TransactionHistoryTable organizationId={organization.id} />
      </div>
    </div>
  )
}
