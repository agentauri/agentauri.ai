/**
 * Domain model type definitions
 *
 * TypeScript interfaces for all domain entities in the AgentAuri platform.
 * These types represent the data structures returned by the API.
 *
 * @module types/models
 *
 * @example
 * ```ts
 * import type { User, Organization, Trigger } from '@/types'
 *
 * function displayUser(user: User) {
 *   console.log(`${user.username} (${user.email})`)
 * }
 * ```
 */

import type {
  ActionType,
  OrganizationRole,
  QueryTier,
  Registry,
} from '@/lib/constants'

// ============================================================================
// User & Organization Models
// ============================================================================

/**
 * User model
 *
 * Represents an authenticated user in the system.
 * Users can belong to multiple organizations and have connected wallets.
 *
 * @example
 * ```ts
 * const user: User = {
 *   id: 'usr_123',
 *   username: 'alice',
 *   email: 'alice@example.com',
 *   currentOrganizationId: 'org_456',
 *   walletAddresses: ['0x1234...'],
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface User {
  /** Unique user identifier */
  id: string
  /** Display username */
  username: string
  /** Email address */
  email: string
  /** Currently selected organization (null if none) */
  currentOrganizationId: string | null
  /** Connected blockchain wallet addresses */
  walletAddresses: string[]
  /** Account creation timestamp (ISO 8601) */
  createdAt: string
  /** Last update timestamp (ISO 8601) */
  updatedAt: string
}

/**
 * Organization model
 *
 * Represents a workspace for managing agents, triggers, and API keys.
 * Each user has a personal organization and can create/join team organizations.
 *
 * @example
 * ```ts
 * const org: Organization = {
 *   id: 'org_123',
 *   name: 'My Team',
 *   slug: 'my-team',
 *   description: 'Team workspace',
 *   isPersonal: false,
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface Organization {
  /** Unique organization identifier */
  id: string
  /** Display name */
  name: string
  /** URL-friendly identifier */
  slug: string
  /** Optional description */
  description: string | null
  /** Whether this is a user's personal organization */
  isPersonal: boolean
  /** Creation timestamp (ISO 8601) */
  createdAt: string
  /** Last update timestamp (ISO 8601) */
  updatedAt: string
}

/**
 * Organization membership
 *
 * Represents a user's membership in an organization with their role.
 *
 * @example
 * ```ts
 * const member: OrganizationMember = {
 *   id: 'mem_123',
 *   userId: 'usr_456',
 *   organizationId: 'org_789',
 *   role: 'admin',
 *   username: 'alice',
 *   email: 'alice@example.com',
 *   createdAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface OrganizationMember {
  /** Unique membership identifier */
  id: string
  /** Member's user ID */
  userId: string
  /** Organization ID */
  organizationId: string
  /** Member's role in the organization */
  role: OrganizationRole
  /** Member's username (denormalized) */
  username: string
  /** Member's email (denormalized) */
  email: string
  /** When the user joined (ISO 8601) */
  createdAt: string
}

// ============================================================================
// Trigger Models
// ============================================================================

/**
 * Trigger model
 *
 * Automated workflow triggered by blockchain events.
 * Contains conditions to match events and actions to execute.
 *
 * @example
 * ```ts
 * const trigger: Trigger = {
 *   id: 'trg_123',
 *   userId: 'usr_456',
 *   organizationId: 'org_789',
 *   name: 'Alert on Registration',
 *   description: 'Send webhook when agent registers',
 *   chainId: 1,
 *   registry: 'ERC8004',
 *   enabled: true,
 *   isStateful: false,
 *   executionCount: 42,
 *   lastExecutedAt: '2024-06-01T12:00:00Z',
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z',
 *   conditions: [],
 *   actions: []
 * }
 * ```
 */
export interface Trigger {
  /** Unique trigger identifier */
  id: string
  /** Owner's user ID */
  userId: string
  /** Organization this trigger belongs to */
  organizationId: string
  /** Display name */
  name: string
  /** Optional description */
  description: string | null
  /** Blockchain network ID (1 = Mainnet, 8453 = Base, etc.) */
  chainId: number
  /** Registry type to monitor */
  registry: Registry
  /** Whether the trigger is active */
  enabled: boolean
  /** Whether trigger maintains state between executions */
  isStateful: boolean
  /** Number of times this trigger has executed */
  executionCount: number
  /** Last execution timestamp (ISO 8601) */
  lastExecutedAt: string | null
  /** Creation timestamp (ISO 8601) */
  createdAt: string
  /** Last update timestamp (ISO 8601) */
  updatedAt: string
  /** Conditions that must match for trigger to fire */
  conditions?: TriggerCondition[]
  /** Actions to execute when trigger fires */
  actions?: TriggerAction[]
}

/**
 * Trigger condition
 *
 * A single condition that must be met for a trigger to fire.
 * Multiple conditions are combined with AND logic.
 *
 * @example
 * ```ts
 * const condition: TriggerCondition = {
 *   id: 'cond_123',
 *   triggerId: 'trg_456',
 *   conditionType: 'event_field',
 *   field: 'agentId',
 *   operator: 'eq',
 *   value: '42',
 *   config: {},
 *   createdAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface TriggerCondition {
  /** Unique condition identifier */
  id: string
  /** Parent trigger ID */
  triggerId: string
  /** Type of condition (event_field, threshold, etc.) */
  conditionType: string
  /** Event field to evaluate */
  field: string
  /** Comparison operator */
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'startsWith' | 'endsWith'
  /** Value to compare against (as string) */
  value: string
  /** Additional condition configuration */
  config: Record<string, unknown>
  /** Creation timestamp (ISO 8601) */
  createdAt: string
}

/**
 * Trigger action
 *
 * An action to execute when a trigger fires.
 * Multiple actions are executed in priority order.
 *
 * @example
 * ```ts
 * const action: TriggerAction = {
 *   id: 'act_123',
 *   triggerId: 'trg_456',
 *   actionType: 'webhook',
 *   priority: 1,
 *   config: { url: 'https://api.example.com/hook' },
 *   createdAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface TriggerAction {
  /** Unique action identifier */
  id: string
  /** Parent trigger ID */
  triggerId: string
  /** Type of action (webhook, email, etc.) */
  actionType: ActionType
  /** Execution order (lower = first) */
  priority: number
  /** Action-specific configuration */
  config: Record<string, unknown>
  /** Creation timestamp (ISO 8601) */
  createdAt: string
}

// ============================================================================
// API Key & Agent Models
// ============================================================================

/**
 * API Key model
 *
 * Authentication key for accessing the AgentAuri API.
 * Keys have tiers that determine rate limits and features.
 *
 * @example
 * ```ts
 * const apiKey: ApiKey = {
 *   id: 'key_123',
 *   organizationId: 'org_456',
 *   name: 'Production Key',
 *   keyPrefix: 'ak_prod_',
 *   tier: 'standard',
 *   enabled: true,
 *   lastUsedAt: '2024-06-01T12:00:00Z',
 *   expiresAt: null,
 *   createdAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface ApiKey {
  /** Unique API key identifier */
  id: string
  /** Organization this key belongs to */
  organizationId: string
  /** Display name for the key */
  name: string
  /** First characters of the key (for identification) */
  keyPrefix: string
  /** Key tier (determines rate limits) */
  tier: QueryTier
  /** Whether the key is active */
  enabled: boolean
  /** Last usage timestamp (ISO 8601) */
  lastUsedAt: string | null
  /** Expiration timestamp (ISO 8601, null = never) */
  expiresAt: string | null
  /** Creation timestamp (ISO 8601) */
  createdAt: string
}

/**
 * Linked agent model
 *
 * An ERC-8004 agent linked to an organization for monitoring.
 * Links are established by signing a message with the agent's wallet.
 *
 * @example
 * ```ts
 * const agent: LinkedAgent = {
 *   id: 'link_123',
 *   organizationId: 'org_456',
 *   agentId: 42,
 *   chainId: 1,
 *   walletAddress: '0x1234567890abcdef...',
 *   linkedAt: '2024-01-01T00:00:00Z'
 * }
 * ```
 */
export interface LinkedAgent {
  /** Unique link identifier */
  id: string
  /** Organization this agent is linked to */
  organizationId: string
  /** On-chain agent ID in the registry */
  agentId: number
  /** Blockchain network ID */
  chainId: number
  /** Agent's wallet address */
  walletAddress: string
  /** When the agent was linked (ISO 8601) */
  linkedAt: string
}

// ============================================================================
// Event Models
// ============================================================================

/**
 * Blockchain event model
 *
 * An event emitted by an ERC-8004 registry contract.
 * Events are indexed and stored for querying and trigger matching.
 *
 * @example
 * ```ts
 * const event: BlockchainEvent = {
 *   id: 'evt_123',
 *   chainId: 1,
 *   registry: 'ERC8004',
 *   eventType: 'AgentRegistered',
 *   blockNumber: 18500000,
 *   transactionHash: '0xabcd...',
 *   agentId: 42,
 *   data: { owner: '0x1234...' },
 *   timestamp: '2024-06-01T12:00:00Z',
 *   createdAt: '2024-06-01T12:00:01Z'
 * }
 * ```
 */
export interface BlockchainEvent {
  /** Unique event identifier */
  id: string
  /** Blockchain network ID */
  chainId: number
  /** Registry that emitted the event */
  registry: Registry
  /** Event name (e.g., 'AgentRegistered', 'ReputationUpdated') */
  eventType: string
  /** Block number where event was emitted */
  blockNumber: number
  /** Transaction hash containing the event */
  transactionHash: string
  /** Related agent ID (if applicable) */
  agentId: number | null
  /** Event-specific data payload */
  data: Record<string, unknown>
  /** Block timestamp (ISO 8601) */
  timestamp: string
  /** When the event was indexed (ISO 8601) */
  createdAt: string
}

// ============================================================================
// Billing Models
// ============================================================================

/**
 * Credit balance model
 *
 * Organization's credit balance for API usage and premium features.
 *
 * @example
 * ```ts
 * const balance: CreditBalance = {
 *   organizationId: 'org_123',
 *   balance: 1000,
 *   lifetimePurchased: 5000,
 *   lifetimeUsed: 4000,
 *   updatedAt: '2024-06-01T12:00:00Z'
 * }
 * ```
 */
export interface CreditBalance {
  /** Organization ID */
  organizationId: string
  /** Current available credit balance */
  balance: number
  /** Total credits ever purchased */
  lifetimePurchased: number
  /** Total credits ever consumed */
  lifetimeUsed: number
  /** Last update timestamp (ISO 8601) */
  updatedAt: string
}

/**
 * Credit transaction model
 *
 * A single credit transaction (purchase, usage, refund, or bonus).
 *
 * @example
 * ```ts
 * const transaction: CreditTransaction = {
 *   id: 'txn_123',
 *   organizationId: 'org_456',
 *   amount: 100,
 *   type: 'purchase',
 *   description: 'Credit pack purchase',
 *   referenceId: 'stripe_pi_123',
 *   createdAt: '2024-06-01T12:00:00Z'
 * }
 * ```
 */
export interface CreditTransaction {
  /** Unique transaction identifier */
  id: string
  /** Organization ID */
  organizationId: string
  /** Credit amount (positive for credits, negative for usage) */
  amount: number
  /** Transaction type */
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  /** Human-readable description */
  description: string
  /** External reference (payment ID, etc.) */
  referenceId: string | null
  /** Transaction timestamp (ISO 8601) */
  createdAt: string
}
