'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { billingApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CheckoutRequest } from '@/lib/validations/billing'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for getting credit balance
 *
 * Returns current credit balance and usage limits for the organization.
 * Data is cached for 1 minute.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @returns TanStack Query result with credit balance
 *
 * @example
 * ```tsx
 * function CreditDisplay({ orgId }: { orgId: string }) {
 *   const { data: balance } = useCreditBalance(orgId)
 *
 *   return (
 *     <div>
 *       <p>Available: {balance?.available} credits</p>
 *       <p>Used: {balance?.used} credits</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useCreditBalance(orgId: string | null) {
  return useQuery({
    queryKey: queryKeys.credits.balance(orgId ?? ''),
    queryFn: () => billingApi.getBalance(orgId!),
    enabled: !!orgId,
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook for listing credit transactions
 *
 * Returns paginated history of credit additions and deductions.
 * Data is cached for 30 seconds.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @param params - Optional pagination parameters
 * @returns TanStack Query result with transactions list
 *
 * @example
 * ```tsx
 * function TransactionHistory({ orgId }: { orgId: string }) {
 *   const { data } = useCreditTransactions(orgId, { limit: 20 })
 *
 *   return (
 *     <ul>
 *       {data?.data.map(tx => (
 *         <li key={tx.id}>{tx.type}: {tx.amount} credits</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useCreditTransactions(orgId: string | null, params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.credits.transactions(orgId ?? '', params),
    queryFn: () => billingApi.listTransactions(orgId!, params),
    enabled: !!orgId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for creating a checkout session
 *
 * Creates a Stripe checkout session and redirects to Stripe's
 * hosted checkout page for payment.
 *
 * @param orgId - Organization UUID
 * @returns TanStack Mutation for checkout creation
 *
 * @example
 * ```tsx
 * function BuyCreditsButton({ orgId, priceId }: Props) {
 *   const createCheckout = useCreateCheckout(orgId)
 *
 *   const handleBuy = () => {
 *     createCheckout.mutate({
 *       priceId,
 *       quantity: 1,
 *       successUrl: window.location.href + '?success=true',
 *       cancelUrl: window.location.href,
 *     })
 *     // Will redirect to Stripe checkout
 *   }
 * }
 * ```
 */
export function useCreateCheckout(orgId: string) {
  return useMutation({
    mutationFn: (request: CheckoutRequest) => billingApi.createCheckout(orgId, request),
    onSuccess: (response) => {
      // Redirect to Stripe checkout
      window.location.href = response.checkoutUrl
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout session')
    },
  })
}

/**
 * Hook for listing subscriptions
 *
 * Returns all active and past subscriptions for the organization.
 * Data is cached for 1 minute.
 *
 * @param orgId - Organization UUID. Query disabled if null.
 * @returns TanStack Query result with subscriptions list
 *
 * @example
 * ```tsx
 * function SubscriptionList({ orgId }: { orgId: string }) {
 *   const { data: subscriptions } = useSubscriptions(orgId)
 *
 *   const active = subscriptions?.filter(s => s.status === 'active')
 *   return (
 *     <ul>
 *       {active?.map(sub => (
 *         <li key={sub.id}>{sub.planName}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useSubscriptions(orgId: string | null) {
  return useQuery({
    queryKey: ['subscriptions', orgId],
    queryFn: () => billingApi.listSubscriptions(orgId!),
    enabled: !!orgId,
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook for canceling a subscription
 *
 * Cancels a subscription at the end of the current billing period.
 * Credits remain available until expiration.
 *
 * @returns TanStack Mutation for subscription cancellation
 *
 * @example
 * ```tsx
 * function CancelButton({ subscriptionId }: { subscriptionId: string }) {
 *   const cancelSubscription = useCancelSubscription()
 *
 *   return (
 *     <Button
 *       variant="danger"
 *       onClick={() => cancelSubscription.mutate(subscriptionId)}
 *       disabled={cancelSubscription.isPending}
 *     >
 *       Cancel Subscription
 *     </Button>
 *   )
 * }
 * ```
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (subscriptionId: string) => billingApi.cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.all })
      toast.success('Subscription canceled successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription')
    },
  })
}
