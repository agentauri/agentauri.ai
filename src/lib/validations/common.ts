/**
 * Common validation schemas used across the application
 *
 * Provides reusable Zod schemas for validating:
 * - Ethereum addresses and transaction hashes
 * - UUIDs with strict format validation
 * - Chain IDs against supported networks
 * - Pagination, sorting, and date range filters
 * - API response wrappers
 *
 * @module lib/validations/common
 *
 * @example
 * ```ts
 * import { ethereumAddressSchema, paginationSchema } from '@/lib/validations'
 *
 * // Validate an address
 * const address = ethereumAddressSchema.parse('0x123...')
 *
 * // Validate pagination params
 * const { limit, offset } = paginationSchema.parse(req.query)
 * ```
 */

import { z } from 'zod'
import {
  ACTION_TYPES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  ORGANIZATION_ROLES,
  QUERY_TIERS,
  REGISTRIES,
  SUPPORTED_CHAINS,
} from '@/lib/constants'

/**
 * Ethereum address validation schema
 *
 * Validates and normalizes Ethereum addresses:
 * - Must be exactly 42 characters (0x + 40 hex chars)
 * - Validates hex format with regex
 * - Normalizes to lowercase for consistent storage
 *
 * @example
 * ```ts
 * ethereumAddressSchema.parse('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B')
 * // => '0xab5801a7d398351b8be11c439e05c5b3259aec9b'
 * ```
 */
export const ethereumAddressSchema = z
  .string()
  .trim()
  .min(42, 'Address too short')
  .max(42, 'Address too long')
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
  .transform((val) => val.toLowerCase()) // Normalize to lowercase

/**
 * UUID validation schema
 *
 * Validates UUID v4 format and normalizes to lowercase.
 *
 * @example
 * ```ts
 * uuidSchema.parse('550E8400-E29B-41D4-A716-446655440000')
 * // => '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
export const uuidSchema = z
  .string()
  .trim()
  .uuid('Invalid UUID format')
  .transform((val) => val.toLowerCase())

/**
 * Chain ID validation schema
 *
 * Validates against the whitelist of supported EIP-155 chain IDs.
 * Coerces string inputs to numbers for flexibility.
 *
 * Supported chains: Mainnet, Base, Sepolia, Base Sepolia, Linea Sepolia, Polygon Amoy
 */
const chainIds = Object.values(SUPPORTED_CHAINS) as [number, ...number[]]
export const chainIdSchema = z.coerce
  .number()
  .int('Chain ID must be an integer')
  .positive('Chain ID must be positive')
  .refine((val) => chainIds.includes(val), {
    message: `Unsupported chain ID. Must be one of: ${chainIds.join(', ')}`,
  })

/**
 * Registry type validation schema
 *
 * Valid values: 'identity', 'reputation', 'validation'
 */
export const registrySchema = z.enum(REGISTRIES)

/**
 * Organization role validation schema
 *
 * Valid values: 'owner', 'admin', 'member', 'viewer'
 */
export const organizationRoleSchema = z.enum(ORGANIZATION_ROLES)

/**
 * Trigger action type validation schema
 *
 * Valid values: 'telegram', 'rest', 'mcp'
 */
export const actionTypeSchema = z.enum(ACTION_TYPES)

/**
 * API query tier validation schema
 *
 * Valid values: 'basic', 'standard', 'advanced', 'full'
 */
export const queryTierSchema = z.enum(QUERY_TIERS)

/**
 * Pagination schema with strict bounds
 *
 * - limit: 1-100 items per page (default: 20)
 * - offset: Non-negative starting position (default: 0)
 *
 * @example
 * ```ts
 * paginationSchema.parse({ limit: '50', offset: '100' })
 * // => { limit: 50, offset: 100 }
 * ```
 */
export const paginationSchema = z.object({
  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(MAX_PAGE_SIZE, `Limit cannot exceed ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
  offset: z.coerce
    .number()
    .int('Offset must be an integer')
    .min(0, 'Offset cannot be negative')
    .default(0),
})

/**
 * Sort schema for list queries
 *
 * - sortBy: Field name (alphanumeric + underscores only)
 * - sortOrder: 'asc' or 'desc' (default: 'desc')
 */
export const sortSchema = z.object({
  sortBy: z
    .string()
    .max(50, 'Sort field name too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Sort field contains invalid characters')
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Date range schema with validation
 *
 * Validates date range with:
 * - ISO 8601 datetime format
 * - startDate must be before endDate
 * - Maximum range of 1 year (prevents abuse)
 */
export const dateRangeSchema = z
  .object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      // If both dates provided, ensure startDate is before endDate
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate)
      }
      return true
    },
    {
      message: 'Start date must be before or equal to end date',
    }
  )
  .refine(
    (data) => {
      // Prevent date range abuse (max 1 year)
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate)
        const end = new Date(data.endDate)
        const maxRange = 365 * 24 * 60 * 60 * 1000 // 1 year in ms
        return end.getTime() - start.getTime() <= maxRange
      }
      return true
    },
    {
      message: 'Date range cannot exceed 1 year',
    }
  )

/**
 * API response wrapper schema factory
 *
 * Wraps a data schema in a standard API response format.
 *
 * @typeParam T - The Zod schema type for the data
 * @param dataSchema - Schema for the response data
 * @returns Schema for `{ data: T, message?: string }`
 *
 * @example
 * ```ts
 * const userResponseSchema = apiResponseSchema(userSchema)
 * // Validates: { data: User, message?: string }
 * ```
 */
export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
  })
}

/**
 * Paginated response schema factory
 *
 * Creates a schema for paginated API responses. Handles both:
 * - Object format: `{ data: T[], pagination: {...} }`
 * - Array format: `T[]` (converted to paginated format)
 *
 * Automatically maps snake_case `has_more` to camelCase `hasMore`.
 *
 * @typeParam T - The Zod schema type for array items
 * @param itemSchema - Schema for individual items in the array
 * @returns Schema for paginated response
 *
 * @example
 * ```ts
 * const triggerListSchema = paginatedResponseSchema(triggerSchema)
 * // Validates: { data: Trigger[], pagination: { total, hasMore } }
 * ```
 */
export function paginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  const paginatedObject = z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      total: z.number(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      has_more: z.boolean(),
    }).passthrough(),
  }).transform((data) => ({
    ...data,
    pagination: {
      ...data.pagination,
      hasMore: data.pagination.has_more, // Map snake_case to camelCase for frontend
    },
  }))

  const rawArray = z.array(itemSchema).transform((arr) => ({
    data: arr,
    pagination: {
      total: arr.length,
      hasMore: false,
      has_more: false,
    },
  }))

  return z.union([paginatedObject, rawArray])
}

/**
 * API error response schema
 *
 * Standard error response format from the backend.
 */
export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})
