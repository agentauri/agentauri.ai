/**
 * Validation schemas barrel export
 *
 * Centralizes all Zod validation schemas used across the application.
 * Organized by domain:
 * - common: Shared primitives (UUID, chain ID, pagination)
 * - auth: Authentication flows (SIWE, OAuth, tokens)
 * - user: User profile management
 * - organization: Organization and member management
 * - agent: ERC-8004 agent linking
 * - trigger: Automation triggers with conditions/actions
 * - event: Blockchain event filtering
 * - api-key: API key management
 * - billing: Credits and subscriptions
 *
 * @module lib/validations
 */

// Entity schemas
export * from './agent'
export * from './api-key'
export * from './billing'
export * from './event'
export * from './organization'
export * from './trigger'
export * from './user'

// Auth schemas
export * from './auth'

// Foundation schemas
export * from './common'
