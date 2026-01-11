/**
 * Authentication validation schemas
 *
 * Provides Zod schemas for all authentication flows:
 * - OAuth (Google, GitHub) authentication
 * - Wallet-based SIWE (Sign-In With Ethereum)
 * - Classic username/password login
 * - Token refresh and session management
 *
 * All schemas match the backend API spec from api.agentauri.ai
 *
 * @module lib/validations/auth
 */

import { z } from 'zod'
import { ethereumAddressSchema, uuidSchema } from './common'

/**
 * OAuth provider schema
 *
 * Supported OAuth providers: 'google', 'github'
 */
export const oauthProviderSchema = z.enum(['google', 'github'])
export type OAuthProvider = z.infer<typeof oauthProviderSchema>

/**
 * Connected wallet schema
 *
 * Represents a wallet linked to a user account.
 */
export const walletSchema = z.object({
  address: ethereumAddressSchema,
  chain_id: z.number().int().positive(),
})

/**
 * Organization membership schema
 *
 * Minimal organization info included in auth responses.
 */
export const organizationMembershipSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
})

/**
 * Auth user schema (subset for login responses)
 *
 * Core user data returned in authentication responses.
 */
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

/**
 * SIWE nonce response schema
 *
 * Response from `/auth/nonce` endpoint for Sign-In With Ethereum.
 * Contains the nonce and pre-formatted message to sign.
 */
export const nonceResponseSchema = z.object({
  nonce: z.string().uuid(),
  expires_at: z.string().datetime().optional(), // Optional: BE may not include this
  message: z.string(), // Pre-formatted message to sign
})

/**
 * Wallet login request schema
 *
 * Request body for SIWE authentication.
 * ECDSA signatures are 65 bytes (130 hex chars + 0x prefix = 132 chars).
 */
const MAX_SIGNATURE_LENGTH = 200 // Buffer for different signature types

export const walletLoginRequestSchema = z.object({
  address: ethereumAddressSchema,
  signature: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format')
    .min(132, 'Signature too short (min 132 chars)')
    .max(MAX_SIGNATURE_LENGTH, `Signature too long (max ${MAX_SIGNATURE_LENGTH} chars)`),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
})

/**
 * Wallet login response schema
 *
 * Successful authentication response with tokens and user data.
 */
export const walletLoginResponseSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(), // seconds until access token expires
  user: authUserSchema,
})

/**
 * Classic login request schema
 *
 * Username/email and password authentication.
 */
export const classicLoginRequestSchema = z.object({
  username_or_email: z.string().min(1),
  password: z.string().min(1),
})

/** Classic login response (same structure as wallet login) */
export const classicLoginResponseSchema = walletLoginResponseSchema

/**
 * Logout response schema
 */
export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

/**
 * Refresh token request schema
 *
 * Used when refresh token is sent in request body (API clients).
 * Browser clients use httpOnly cookies instead.
 */
export const refreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
})

/**
 * Refresh token response schema
 *
 * Token rotation: new access and refresh tokens issued.
 */
export const refreshTokenResponseSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
})

/**
 * OAuth code exchange request schema
 *
 * Exchange authorization code for tokens after OAuth callback.
 */
export const exchangeCodeRequestSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
})

/**
 * OAuth code exchange response schema
 *
 * Same structure as login response with tokens and user data.
 */
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

/**
 * User session schema
 *
 * Full user data returned from `/auth/me` endpoint.
 * Includes wallets, OAuth providers, and organization memberships.
 */
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

/** @deprecated Use walletLoginRequestSchema */
export const loginRequestSchema = walletLoginRequestSchema
/** @deprecated Use walletLoginResponseSchema */
export const loginResponseSchema = walletLoginResponseSchema

/* ─────────────────────────────────────────────────────────────────────────────
 * Inferred Types
 * ─────────────────────────────────────────────────────────────────────────────*/
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

/* Legacy types for backward compatibility */
/** @deprecated Use WalletLoginRequest */
export type LoginRequest = WalletLoginRequest
/** @deprecated Use WalletLoginResponse */
export type LoginResponse = WalletLoginResponse
/** @deprecated No longer used */
export type NonceRequest = { address: string }
