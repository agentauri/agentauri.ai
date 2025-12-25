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
 * Event types supported by the backend
 * These are the blockchain events that can trigger automations
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
