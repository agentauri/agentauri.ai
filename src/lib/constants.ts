/**
 * Application-wide constants
 */

export const APP_NAME = 'agentauri.ai' as const
export const APP_DESCRIPTION = 'ERC-8004 Reputation Dashboard' as const

/**
 * API Configuration
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
export const API_VERSION = 'v1' as const

/**
 * Supported blockchain networks
 */
export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  BASE: 8453,
  SEPOLIA: 11155111,
  BASE_SEPOLIA: 84532,
  LINEA_SEPOLIA: 59141,
  POLYGON_AMOY: 80002,
} as const

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS]

/**
 * Registry types
 */
export const REGISTRIES = ['identity', 'reputation', 'validation'] as const
export type Registry = (typeof REGISTRIES)[number]

/**
 * Organization roles
 */
export const ORGANIZATION_ROLES = ['owner', 'admin', 'member', 'viewer'] as const
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number]

/**
 * Trigger action types
 */
export const ACTION_TYPES = ['telegram', 'rest', 'mcp'] as const
export type ActionType = (typeof ACTION_TYPES)[number]

/**
 * Query tiers
 */
export const QUERY_TIERS = ['basic', 'standard', 'advanced', 'full'] as const
export type QueryTier = (typeof QUERY_TIERS)[number]

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 20 as const
export const MAX_PAGE_SIZE = 100 as const
