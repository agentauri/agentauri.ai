/**
 * API clients barrel export
 *
 * Centralizes all API client modules for backend communication.
 * Each client provides typed methods with Zod validation.
 *
 * Available clients:
 * - authApi: Authentication (OAuth, SIWE, tokens)
 * - usersApi: User profile management
 * - organizationsApi: Workspace and team management
 * - agentsApi: ERC-8004 agent linking
 * - triggersApi: Automation triggers
 * - eventsApi: Blockchain event queries
 * - apiKeysApi: API key management
 * - billingApi: Credits and subscriptions
 * - healthApi: API health monitoring
 *
 * @module lib/api
 *
 * @example
 * ```ts
 * import { authApi, organizationsApi } from '@/lib/api'
 *
 * // Authenticate
 * const session = await authApi.getSession()
 *
 * // List organizations
 * const { data: orgs } = await organizationsApi.list()
 * ```
 */

export { agentsApi } from './agents'
export { apiKeysApi } from './api-keys'
export { authApi } from './auth'
export { billingApi } from './billing'
export { eventsApi } from './events'
export { healthApi } from './health'
export { organizationsApi } from './organizations'
export { triggersApi } from './triggers'
export { usersApi } from './users'
