import { z } from 'zod'
import { ethereumAddressSchema, uuidSchema } from './common'

/**
 * Authentication-related validation schemas
 */

// SIWE message schema (Sign-In with Ethereum)
export const siweMessageSchema = z.object({
  domain: z.string().min(1),
  address: ethereumAddressSchema,
  statement: z.string().optional(),
  uri: z.string().url(),
  version: z.literal('1'),
  chainId: z.number().int().positive(),
  nonce: z.string().min(8),
  issuedAt: z.string().datetime(),
  expirationTime: z.string().datetime().optional(),
  notBefore: z.string().datetime().optional(),
  requestId: z.string().optional(),
  resources: z.array(z.string().url()).optional(),
})

// Login request schema
export const loginRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  signature: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format')
    .min(132, 'Invalid signature length'),
})

// Login response schema
export const loginResponseSchema = z.object({
  user: z.object({
    id: uuidSchema,
    username: z.string(),
    email: z.string().email(),
  }),
  expiresAt: z.string().datetime(),
})

// Nonce request schema
export const nonceRequestSchema = z.object({
  address: ethereumAddressSchema,
})

// Nonce response schema
export const nonceResponseSchema = z.object({
  nonce: z.string().min(8),
  expiresAt: z.string().datetime(),
})

// Logout response schema
export const logoutResponseSchema = z.object({
  success: z.boolean(),
})

// User session schema (from /me endpoint)
export const userSessionSchema = z.object({
  id: uuidSchema,
  username: z.string(),
  email: z.string().email(),
  currentOrganizationId: uuidSchema.nullable(),
  walletAddresses: z.array(ethereumAddressSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Inferred types
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type NonceRequest = z.infer<typeof nonceRequestSchema>
export type NonceResponse = z.infer<typeof nonceResponseSchema>
export type UserSession = z.infer<typeof userSessionSchema>
