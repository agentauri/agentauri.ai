import { apiClient } from '@/lib/api-client'
import {
  type CheckoutRequest,
  type CheckoutResponse,
  checkoutResponseSchema,
  type CreditBalance,
  creditBalanceSchema,
  type CreditTransaction,
  creditTransactionListResponseSchema,
  type Subscription,
  subscriptionListResponseSchema,
} from '@/lib/validations/billing'
import type { PaginationParams } from '@/types/api'

/**
 * Billing API client
 */
export const billingApi = {
  /**
   * Get credit balance for organization
   */
  async getBalance(orgId: string): Promise<CreditBalance> {
    const data = await apiClient.get<CreditBalance>(`/organizations/${orgId}/credits/balance`)
    return creditBalanceSchema.parse(data)
  },

  /**
   * List credit transactions for organization
   */
  async listTransactions(
    orgId: string,
    params?: PaginationParams
  ): Promise<{ data: CreditTransaction[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get(`/organizations/${orgId}/credits/transactions`, { params })
    return creditTransactionListResponseSchema.parse(data)
  },

  /**
   * Create Stripe checkout session
   */
  async createCheckout(orgId: string, request: CheckoutRequest): Promise<CheckoutResponse> {
    const data = await apiClient.post<CheckoutResponse>(
      `/organizations/${orgId}/checkout`,
      request
    )
    return checkoutResponseSchema.parse(data)
  },

  /**
   * List subscriptions for organization
   */
  async listSubscriptions(orgId: string): Promise<Subscription[]> {
    const data = await apiClient.get(`/organizations/${orgId}/subscriptions`)
    return subscriptionListResponseSchema.parse(data)
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await apiClient.delete(`/subscriptions/${subscriptionId}`)
  },
}
