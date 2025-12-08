import type {
  ActionType,
  OrganizationRole,
  QueryTier,
  Registry,
  SupportedChainId,
} from '@/lib/constants'

/**
 * User model
 */
export interface User {
  id: string
  username: string
  email: string
  currentOrganizationId: string | null
  walletAddresses: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Organization model
 */
export interface Organization {
  id: string
  name: string
  slug: string
  description: string | null
  isPersonal: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Organization membership
 */
export interface OrganizationMember {
  id: string
  userId: string
  organizationId: string
  role: OrganizationRole
  username: string
  email: string
  createdAt: string
}

/**
 * Trigger model
 */
export interface Trigger {
  id: string
  userId: string
  organizationId: string
  name: string
  description: string | null
  chainId: number
  registry: Registry
  enabled: boolean
  isStateful: boolean
  executionCount: number
  lastExecutedAt: string | null
  createdAt: string
  updatedAt: string
  conditions?: TriggerCondition[]
  actions?: TriggerAction[]
}

/**
 * Trigger condition
 */
export interface TriggerCondition {
  id: string
  triggerId: string
  conditionType: string
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'startsWith' | 'endsWith'
  value: string
  config: Record<string, unknown>
  createdAt: string
}

/**
 * Trigger action
 */
export interface TriggerAction {
  id: string
  triggerId: string
  actionType: ActionType
  priority: number
  config: Record<string, unknown>
  createdAt: string
}

/**
 * API Key model
 */
export interface ApiKey {
  id: string
  organizationId: string
  name: string
  keyPrefix: string
  tier: QueryTier
  enabled: boolean
  lastUsedAt: string | null
  expiresAt: string | null
  createdAt: string
}

/**
 * Linked agent model
 */
export interface LinkedAgent {
  id: string
  organizationId: string
  agentId: number
  chainId: number
  walletAddress: string
  linkedAt: string
}

/**
 * Blockchain event model
 */
export interface BlockchainEvent {
  id: string
  chainId: number
  registry: Registry
  eventType: string
  blockNumber: number
  transactionHash: string
  agentId: number | null
  data: Record<string, unknown>
  timestamp: string
  createdAt: string
}

/**
 * Credit balance model
 */
export interface CreditBalance {
  organizationId: string
  balance: number
  lifetimePurchased: number
  lifetimeUsed: number
  updatedAt: string
}

/**
 * Credit transaction model
 */
export interface CreditTransaction {
  id: string
  organizationId: string
  amount: number
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  description: string
  referenceId: string | null
  createdAt: string
}
