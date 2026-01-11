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
 * Billing API client for credits and subscriptions
 *
 * AgentAuri uses a credit-based billing system. Credits are consumed
 * by trigger executions and API calls.
 *
 * @see https://docs.agentauri.ai/api/billing
 */
export const billingApi = {
  /**
   * Get credit balance for organization
   *
   * Returns current credit balance and usage limits.
   *
   * @param orgId - Organization UUID
   * @returns Credit balance information
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member of organization)
   *
   * @example
   * ```ts
   * const balance = await billingApi.getBalance('org-uuid')
   * console.log(`Credits remaining: ${balance.available}`)
   * ```
   */
  async getBalance(orgId: string): Promise<CreditBalance> {
    const data = await apiClient.get<CreditBalance>(`/organizations/${orgId}/credits/balance`)
    return creditBalanceSchema.parse(data)
  },

  /**
   * List credit transactions for organization
   *
   * Returns paginated history of credit additions and deductions.
   *
   * @param orgId - Organization UUID
   * @param params - Pagination parameters
   * @returns Paginated list of credit transactions
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden
   *
   * @example
   * ```ts
   * const { data: transactions } = await billingApi.listTransactions('org-uuid', {
   *   limit: 20,
   * })
   * transactions.forEach(tx => {
   *   console.log(`${tx.type}: ${tx.amount} credits`)
   * })
   * ```
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
   *
   * Creates a Stripe checkout session for purchasing credits or subscriptions.
   * Returns a URL to redirect the user to Stripe's hosted checkout page.
   *
   * @param orgId - Organization UUID
   * @param request - Checkout configuration (price, quantity, etc.)
   * @returns Checkout session with redirect URL
   * @throws {ApiError} 400 - Invalid request
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   *
   * @example
   * ```ts
   * const { url } = await billingApi.createCheckout('org-uuid', {
   *   priceId: 'price_xxx',
   *   quantity: 1,
   *   successUrl: 'https://app.agentauri.ai/billing?success=true',
   *   cancelUrl: 'https://app.agentauri.ai/billing',
   * })
   * window.location.href = url
   * ```
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
   *
   * Returns all active and past subscriptions.
   *
   * @param orgId - Organization UUID
   * @returns List of subscriptions
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden
   *
   * @example
   * ```ts
   * const subscriptions = await billingApi.listSubscriptions('org-uuid')
   * const active = subscriptions.filter(s => s.status === 'active')
   * ```
   */
  async listSubscriptions(orgId: string): Promise<Subscription[]> {
    const data = await apiClient.get(`/organizations/${orgId}/subscriptions`)
    return subscriptionListResponseSchema.parse(data)
  },

  /**
   * Cancel subscription
   *
   * Cancels a subscription at the end of the current billing period.
   * Credits purchased through the subscription remain available until expiration.
   *
   * @param subscriptionId - Subscription ID to cancel
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 404 - Subscription not found
   *
   * @example
   * ```ts
   * await billingApi.cancelSubscription('sub_xxx')
   * ```
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await apiClient.delete(`/subscriptions/${subscriptionId}`)
  },
}
