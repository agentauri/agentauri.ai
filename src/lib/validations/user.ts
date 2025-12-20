import { z } from 'zod'
import { uuidSchema, ethereumAddressSchema } from './common'

/**
 * User validation schemas
 */

// User schema
export const userSchema = z.object({
  id: uuidSchema,
  username: z.string().min(2).max(50),
  email: z.string().email(),
  currentOrganizationId: uuidSchema.nullable(),
  walletAddresses: z.array(ethereumAddressSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Update user request
export const updateUserRequestSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be at most 50 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  currentOrganizationId: uuidSchema.nullable().optional(),
})

// Inferred types
export type User = z.infer<typeof userSchema>
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>
