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
 * Common validation schemas used across the application
 */

// Ethereum address validation with checksum validation
export const ethereumAddressSchema = z
  .string()
  .trim()
  .min(42, 'Address too short')
  .max(42, 'Address too long')
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
  .transform((val) => val.toLowerCase()) // Normalize to lowercase

// UUID validation with strict format
export const uuidSchema = z
  .string()
  .trim()
  .uuid('Invalid UUID format')
  .transform((val) => val.toLowerCase())

// Chain ID validation with whitelist
const chainIds = Object.values(SUPPORTED_CHAINS) as [number, ...number[]]
export const chainIdSchema = z.coerce
  .number()
  .int('Chain ID must be an integer')
  .positive('Chain ID must be positive')
  .refine((val) => chainIds.includes(val), {
    message: `Unsupported chain ID. Must be one of: ${chainIds.join(', ')}`,
  })

// Registry type validation
export const registrySchema = z.enum(REGISTRIES)

// Organization role validation
export const organizationRoleSchema = z.enum(ORGANIZATION_ROLES)

// Action type validation
export const actionTypeSchema = z.enum(ACTION_TYPES)

// Query tier validation
export const queryTierSchema = z.enum(QUERY_TIERS)

// Pagination schema with strict bounds
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

// Sort schema with field validation
export const sortSchema = z.object({
  sortBy: z
    .string()
    .max(50, 'Sort field name too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Sort field contains invalid characters')
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Date range schema with validation
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

// API response wrapper schema factory
export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
  })
}

// Paginated response schema factory
export function paginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
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
}

// API error response schema
export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})
