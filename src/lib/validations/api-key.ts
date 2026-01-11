/**
 * API key validation schemas
 *
 * Provides Zod schemas for API key management:
 * - API key CRUD operations
 * - Key statistics and usage tracking
 * - Snake_case to camelCase transformation (backend compatibility)
 *
 * @module lib/validations/api-key
 */

import { z } from 'zod'
import { queryTierSchema, uuidSchema } from './common'

/**
 * API key schema
 *
 * Handles both snake_case (backend) and camelCase (frontend) field names.
 * Transforms to consistent camelCase output.
 */
export const apiKeySchema = z.object({
  id: uuidSchema,
  organization_id: uuidSchema.optional(),
  organizationId: uuidSchema.optional(),
  name: z.string().min(1).max(100),
  key_prefix: z.string().optional(),
  keyPrefix: z.string().optional(),
  tier: queryTierSchema.optional().default('basic'),
  environment: z.string().optional(),
  enabled: z.boolean().optional().default(true),
  is_active: z.boolean().optional(),
  last_used_at: z.string().datetime().nullable().optional(),
  lastUsedAt: z.string().datetime().nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}).transform((data) => ({
  id: data.id,
  organizationId: data.organization_id ?? data.organizationId ?? '',
  name: data.name,
  keyPrefix: data.key_prefix ?? data.keyPrefix ?? '',
  tier: data.tier ?? 'basic',
  environment: data.environment,
  enabled: data.enabled ?? data.is_active ?? true,
  lastUsedAt: data.last_used_at ?? data.lastUsedAt ?? null,
  expiresAt: data.expires_at ?? data.expiresAt ?? null,
  createdAt: data.created_at ?? data.createdAt ?? new Date().toISOString(),
}))

/**
 * Create API key request schema
 *
 * Request body for creating a new API key.
 */
export const createApiKeyRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  tier: queryTierSchema.default('basic'),
  expiresAt: z.string().datetime().optional(),
})

/**
 * Create API key response schema
 *
 * Response includes the full key (only shown once at creation time).
 * Key format: `8004_<prefix>.<secret>`
 */
export const createApiKeyResponseSchema = z.object({
  apiKey: apiKeySchema,
  key: z.string().regex(/^8004_[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/),
})

/**
 * Update API key request schema
 *
 * All fields optional - only send fields to update.
 */
export const updateApiKeyRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  tier: queryTierSchema.optional(),
  enabled: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
})

/**
 * API key list response schema
 *
 * Handles backend format (items/page/page_size) and transforms
 * to frontend format (data/pagination).
 */
export const apiKeyListResponseSchema = z.object({
  items: z.array(apiKeySchema).optional(),
  data: z.array(apiKeySchema).optional(),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  page_size: z.number().optional().default(20),
  total_pages: z.number().optional().default(0),
  pagination: z.object({
    total: z.number(),
    has_more: z.boolean(),
  }).optional(),
}).transform((result) => ({
  // Prefer items (backend format), fallback to data (frontend format)
  data: result.items ?? result.data ?? [],
  pagination: {
    total: result.pagination?.total ?? result.total ?? 0,
    hasMore: result.pagination?.has_more ?? (result.page < result.total_pages),
  },
}))

/**
 * API key stats schema
 *
 * Statistics about API keys and their usage.
 * Transforms snake_case backend response to camelCase.
 */
export const apiKeyStatsSchema = z.object({
  data: z.object({
    // Key counts
    total_keys: z.number(),
    active_keys: z.number(),
    expired_keys: z.number().optional().default(0),
    revoked_keys: z.number().optional().default(0),
    unused_keys: z.number().optional().default(0),
    keys_expiring_soon: z.number().optional().default(0),

    // Usage stats
    api_calls_total: z.number().optional().default(0),
    calls_24h: z.number().optional().default(0),
    failed_auth_24h: z.number().optional().default(0),
    rate_limited_24h: z.number().optional().default(0),

    // Breakdowns
    keys_by_environment: z.record(z.string(), z.number()).optional(),
    keys_by_type: z.record(z.string(), z.number()).optional(),
  }),
}).transform((result) => ({
  // Key counts
  totalKeys: result.data.total_keys,
  activeKeys: result.data.active_keys,
  expiredKeys: result.data.expired_keys,
  revokedKeys: result.data.revoked_keys,
  unusedKeys: result.data.unused_keys,
  keysExpiringSoon: result.data.keys_expiring_soon,

  // Usage stats
  apiCallsTotal: result.data.api_calls_total,
  calls24h: result.data.calls_24h,
  failedAuth24h: result.data.failed_auth_24h,
  rateLimited24h: result.data.rate_limited_24h,

  // Breakdowns
  keysByEnvironment: result.data.keys_by_environment ?? {},
  keysByType: result.data.keys_by_type ?? {},
}))

/* ─────────────────────────────────────────────────────────────────────────────
 * Inferred Types
 * ─────────────────────────────────────────────────────────────────────────────*/
export type ApiKey = z.infer<typeof apiKeySchema>
export type CreateApiKeyRequest = z.infer<typeof createApiKeyRequestSchema>
export type CreateApiKeyResponse = z.infer<typeof createApiKeyResponseSchema>
export type UpdateApiKeyRequest = z.infer<typeof updateApiKeyRequestSchema>
export type ApiKeyStats = z.infer<typeof apiKeyStatsSchema>
