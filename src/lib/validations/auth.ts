import { z } from 'zod'
import { ethereumAddressSchema, uuidSchema } from './common'

/**
 * Authentication-related validation schemas
 * Updated to match backend API spec from api.agentauri.ai
 */

// OAuth provider types
export const oauthProviderSchema = z.enum(['google', 'github'])
export type OAuthProvider = z.infer<typeof oauthProviderSchema>

// Wallet schema
export const walletSchema = z.object({
  address: ethereumAddressSchema,
  chain_id: z.number().int().positive(),
})

// Organization membership schema
export const organizationMembershipSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
})

// Auth user schema (subset for login responses)
const authUserSchema = z.object({
  id: uuidSchema,
  username: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().url().nullable(),
  created_at: z.string().datetime(),
  last_login_at: z.string().datetime().nullish(), // Can be null or undefined
  is_active: z.boolean().optional(),
})

// Nonce response schema (for SIWE)
export const nonceResponseSchema = z.object({
  nonce: z.string().uuid(),
  expires_at: z.string().datetime().optional(), // Optional: BE may not include this
  message: z.string(), // Pre-formatted message to sign
})

// Wallet login request schema
export const walletLoginRequestSchema = z.object({
  address: ethereumAddressSchema,
  signature: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format')
    .min(132, 'Invalid signature length'),
  message: z.string().min(1, 'Message is required'),
})

// Wallet login response schema
export const walletLoginResponseSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(), // seconds until access token expires
  user: authUserSchema,
})

// Classic login request schema (username/password)
export const classicLoginRequestSchema = z.object({
  username_or_email: z.string().min(1),
  password: z.string().min(1),
})

// Classic login response (same as wallet)
export const classicLoginResponseSchema = walletLoginResponseSchema

// Logout response schema
export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// Refresh token request schema
export const refreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
})

// Refresh token response schema (token rotation - new tokens issued)
export const refreshTokenResponseSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
})

// OAuth code exchange request schema
export const exchangeCodeRequestSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
})

// OAuth code exchange response (same structure as login response)
export const exchangeCodeResponseSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  user: z.object({
    id: uuidSchema,
    username: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    avatar: z.string().url().nullable(),
    created_at: z.string().datetime(),
    last_login_at: z.string().datetime().nullish(), // Can be null or undefined
    is_active: z.boolean().optional(),
  }),
})

// User session schema (from /me endpoint)
export const userSessionSchema = z.object({
  id: uuidSchema,
  username: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().url().nullable(),
  wallets: z.array(walletSchema).default([]),
  providers: z.array(oauthProviderSchema).default([]),
  organizations: z.array(organizationMembershipSchema).default([]),
  created_at: z.string().datetime(),
})

// Legacy type aliases for backward compatibility
export const loginRequestSchema = walletLoginRequestSchema
export const loginResponseSchema = walletLoginResponseSchema

// Inferred types
export type Wallet = z.infer<typeof walletSchema>
export type OrganizationMembership = z.infer<typeof organizationMembershipSchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type NonceResponse = z.infer<typeof nonceResponseSchema>
export type WalletLoginRequest = z.infer<typeof walletLoginRequestSchema>
export type WalletLoginResponse = z.infer<typeof walletLoginResponseSchema>
export type ClassicLoginRequest = z.infer<typeof classicLoginRequestSchema>
export type ClassicLoginResponse = z.infer<typeof classicLoginResponseSchema>
export type LogoutResponse = z.infer<typeof logoutResponseSchema>
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>
export type UserSession = z.infer<typeof userSessionSchema>

// Legacy types
export type LoginRequest = WalletLoginRequest
export type LoginResponse = WalletLoginResponse
export type NonceRequest = { address: string } // No longer needed but kept for compatibility
