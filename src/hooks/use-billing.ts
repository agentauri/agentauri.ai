'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { billingApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CheckoutRequest } from '@/lib/validations/billing'
import type { PaginationParams } from '@/types/api'

/**
 * Hook for getting credit balance
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
