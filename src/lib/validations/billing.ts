/**
 * Billing and credits validation schemas
 *
 * Provides Zod schemas for billing operations:
 * - Credit balance tracking
 * - Credit transactions (purchase, usage, refund, bonus)
 * - Stripe checkout flow
 * - Subscription management
 *
 * @module lib/validations/billing
 */

import { z } from 'zod'
import { paginatedResponseSchema, uuidSchema } from './common'

/**
 * Transaction type schema
 *
 * Supported credit transaction types.
 */
export const transactionTypeSchema = z.enum(['purchase', 'usage', 'refund', 'bonus'])

/**
 * Credit balance schema
 *
 * Organization's current credit balance and lifetime stats.
 */
export const creditBalanceSchema = z.object({
  organizationId: uuidSchema,
  balance: z.number().int(),
  lifetimePurchased: z.number().int().min(0),
  lifetimeUsed: z.number().int().min(0),
  updatedAt: z.string().datetime(),
})

/**
 * Credit transaction schema
 *
 * Individual credit transaction record.
 * Amount can be positive (purchase/bonus) or negative (usage).
 */
export const creditTransactionSchema = z.object({
  id: uuidSchema,
  organizationId: uuidSchema,
  amount: z.number().int(),
  type: transactionTypeSchema,
  description: z.string(),
  referenceId: z.string().nullable(),
  createdAt: z.string().datetime(),
})

/** Credit transaction list response with pagination */
export const creditTransactionListResponseSchema = paginatedResponseSchema(creditTransactionSchema)

/**
 * Checkout request schema
 *
 * Request body for creating a Stripe checkout session.
 */
export const checkoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  quantity: z.number().int().min(1).default(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

/**
 * Checkout response schema
 *
 * Returns Stripe checkout URL for redirect.
 */
export const checkoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
  sessionId: z.string(),
})

/**
 * Subscription schema
 *
 * Stripe subscription details for recurring billing.
 */
export const subscriptionSchema = z.object({
  id: z.string(),
  organizationId: uuidSchema,
  status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'incomplete']),
  planName: z.string(),
  priceId: z.string(),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  cancelAtPeriodEnd: z.boolean(),
  createdAt: z.string().datetime(),
})

/** Subscription list response (array, not paginated) */
export const subscriptionListResponseSchema = z.array(subscriptionSchema)

/* ─────────────────────────────────────────────────────────────────────────────
 * Inferred Types
 * ─────────────────────────────────────────────────────────────────────────────*/
export type TransactionType = z.infer<typeof transactionTypeSchema>
export type CreditBalance = z.infer<typeof creditBalanceSchema>
export type CreditTransaction = z.infer<typeof creditTransactionSchema>
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>
export type Subscription = z.infer<typeof subscriptionSchema>
