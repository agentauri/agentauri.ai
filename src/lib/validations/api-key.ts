import { z } from 'zod'
import { paginatedResponseSchema, queryTierSchema, uuidSchema } from './common'

/**
 * API Key validation schemas
 */

// API Key schema
export const apiKeySchema = z.object({
  id: uuidSchema,
  organizationId: uuidSchema,
  name: z.string().min(1).max(100),
  keyPrefix: z.string().regex(/^8004_[a-zA-Z0-9]+$/),
  tier: queryTierSchema,
  enabled: z.boolean(),
  lastUsedAt: z.string().datetime().nullable(),
  expiresAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

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

// API key list response
export const apiKeyListResponseSchema = paginatedResponseSchema(apiKeySchema)

// Inferred types
export type ApiKey = z.infer<typeof apiKeySchema>
export type CreateApiKeyRequest = z.infer<typeof createApiKeyRequestSchema>
export type CreateApiKeyResponse = z.infer<typeof createApiKeyResponseSchema>
export type UpdateApiKeyRequest = z.infer<typeof updateApiKeyRequestSchema>
