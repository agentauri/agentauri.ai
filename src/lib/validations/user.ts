/**
 * User validation schemas
 *
 * Provides Zod schemas for user-related operations:
 * - User profile data
 * - Profile update requests
 *
 * Aligned with backend API spec from api.agentauri.ai
 *
 * @module lib/validations/user
 */

import { z } from 'zod'
import { uuidSchema } from './common'
import { walletSchema, organizationMembershipSchema, oauthProviderSchema } from './auth'

/**
 * User schema
 *
 * Full user profile including wallets, OAuth providers, and organizations.
 */
export const userSchema = z.object({
  id: uuidSchema,
  username: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().url().nullable(),
  wallets: z.array(walletSchema).default([]),
  providers: z.array(oauthProviderSchema).default([]),
  organizations: z.array(organizationMembershipSchema).default([]),
  created_at: z.string().datetime(),
  last_login_at: z.string().datetime().optional(),
  is_active: z.boolean().optional(),
})

/**
 * Update user request schema
 *
 * All fields are optional - only send fields to update.
 */
export const updateUserRequestSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be at most 50 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  name: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
})

/* ─────────────────────────────────────────────────────────────────────────────
 * Inferred Types
 * ─────────────────────────────────────────────────────────────────────────────*/
export type User = z.infer<typeof userSchema>
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>
