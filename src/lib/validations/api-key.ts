import { z } from 'zod'
import { queryTierSchema, uuidSchema } from './common'

/**
 * API Key validation schemas
 */

// API Key schema - handles snake_case from backend
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

// Create API key request
export const createApiKeyRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  tier: queryTierSchema.default('basic'),
  expiresAt: z.string().datetime().optional(),
})

// Create API key response (includes full key once)
export const createApiKeyResponseSchema = z.object({
  apiKey: apiKeySchema,
  key: z.string().regex(/^8004_[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/),
})

// Update API key request
export const updateApiKeyRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  tier: queryTierSchema.optional(),
  enabled: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
})

// API key list response - handles backend format with items/page/page_size
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

// Inferred types
export type ApiKey = z.infer<typeof apiKeySchema>
export type CreateApiKeyRequest = z.infer<typeof createApiKeyRequestSchema>
export type CreateApiKeyResponse = z.infer<typeof createApiKeyResponseSchema>
export type UpdateApiKeyRequest = z.infer<typeof updateApiKeyRequestSchema>
