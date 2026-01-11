/**
 * Application-wide constants
 *
 * Centralized configuration for the application including:
 * - App metadata
 * - API configuration
 * - Blockchain network definitions
 * - Domain-specific constants (registries, roles, actions)
 *
 * @module lib/constants
 */

/** Application name */
export const APP_NAME = 'agentauri.ai' as const
/** Application description for metadata */
export const APP_DESCRIPTION = 'ERC-8004 Reputation Dashboard' as const

/**
 * API Configuration
 *
 * @remarks
 * In development, use empty string to make API calls through Next.js proxy (same origin).
 * This avoids cross-origin cookie issues when backend runs on different port.
 * In production, set NEXT_PUBLIC_API_BASE_URL to the actual API domain.
 */
const configuredApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

// Use empty string (relative URLs) in dev to leverage Next.js proxy for API calls
export const API_BASE_URL = configuredApiUrl

// OAuth requires direct browser redirect to backend (can't use proxy)
// In dev, this points directly to backend; in prod, same as API_BASE_URL
export const OAUTH_BASE_URL = process.env.NEXT_PUBLIC_OAUTH_BASE_URL
  || process.env.NEXT_PUBLIC_API_BASE_URL
  || 'http://localhost:8080'

/** API version prefix for all endpoints */
export const API_VERSION = 'v1' as const

/**
 * Supported blockchain networks
 *
 * Map of chain names to their EIP-155 chain IDs.
 * Includes both mainnet and testnet networks.
 */
export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  BASE: 8453,
  SEPOLIA: 11155111,
  BASE_SEPOLIA: 84532,
  LINEA_SEPOLIA: 59141,
  POLYGON_AMOY: 80002,
} as const

/** Type for supported chain IDs */
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS]

/**
 * ERC-8004 registry types
 *
 * - `identity`: Agent identity and metadata
 * - `reputation`: Agent reputation scores
 * - `validation`: Agent validation status
 */
export const REGISTRIES = ['identity', 'reputation', 'validation'] as const
/** Type for registry names */
export type Registry = (typeof REGISTRIES)[number]

/**
 * Organization member roles
 *
 * Permissions hierarchy (highest to lowest):
 * - `owner`: Full access, can delete organization
 * - `admin`: Manage members, settings, and all resources
 * - `member`: Create and manage own resources
 * - `viewer`: Read-only access
 */
export const ORGANIZATION_ROLES = ['owner', 'admin', 'member', 'viewer'] as const
/** Type for organization roles */
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number]

/**
 * Trigger action types
 *
 * Actions that can be executed when a trigger fires:
 * - `telegram`: Send message to Telegram bot
 * - `rest`: HTTP webhook call
 * - `mcp`: Model Context Protocol action
 */
export const ACTION_TYPES = ['telegram', 'rest', 'mcp'] as const
/** Type for action types */
export type ActionType = (typeof ACTION_TYPES)[number]

/**
 * Blockchain event types supported by the backend
 *
 * These events are indexed by Ponder and can trigger automations:
 * - `AgentRegistered`: New agent registered on-chain
 * - `AgentUpdated`: Agent metadata updated
 * - `ReputationUpdated`: Agent reputation score changed
 * - `ValidationCompleted`: Agent validation finished
 */
export const EVENT_TYPES = {
  AGENT_REGISTERED: 'AgentRegistered',
  AGENT_UPDATED: 'AgentUpdated',
  REPUTATION_UPDATED: 'ReputationUpdated',
  VALIDATION_COMPLETED: 'ValidationCompleted',
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

export const EVENT_TYPE_LIST = Object.values(EVENT_TYPES)

/**
 * Event type metadata with registry mapping and descriptions
 */
export const EVENT_TYPE_INFO: Record<
  EventType,
  { registry: Registry; description: string; icon: string }
> = {
  AgentRegistered: {
    registry: 'identity',
    description: 'New agent registered on-chain',
    icon: 'agents',
  },
  AgentUpdated: {
    registry: 'identity',
    description: 'Agent metadata updated',
    icon: 'edit',
  },
  ReputationUpdated: {
    registry: 'reputation',
    description: 'Agent reputation score changed',
    icon: 'star',
  },
  ValidationCompleted: {
    registry: 'validation',
    description: 'Agent validation finished',
    icon: 'check',
  },
}

/**
 * Chains currently supported by the backend (testnet only)
 */
export const TESTNET_CHAINS = {
  SEPOLIA: 11155111,
  BASE_SEPOLIA: 84532,
  LINEA_SEPOLIA: 59141,
} as const

export type TestnetChainId = (typeof TESTNET_CHAINS)[keyof typeof TESTNET_CHAINS]

export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  11155111: 'Sepolia',
  84532: 'Base Sepolia',
  59141: 'Linea Sepolia',
  80002: 'Polygon Amoy',
}

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
