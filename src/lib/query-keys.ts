/**
 * Query key factories for TanStack Query
 *
 * Using factory pattern for type-safe, consistent query keys:
 * - All keys are arrays for proper invalidation
 * - Hierarchical structure for granular invalidation
 * - Type-safe with TypeScript inference
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    nonce: (address: string) => [...queryKeys.auth.all, 'nonce', address] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },

  // Organization queries
  organizations: {
    all: ['organizations'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.organizations.all, 'list', filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.organizations.all, 'detail', id] as const,
    members: (orgId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.organizations.all, 'members', orgId, filters ?? {}] as const,
    member: (orgId: string, memberId: string) =>
      [...queryKeys.organizations.all, 'member', orgId, memberId] as const,
  },

  // Trigger queries
  triggers: {
    all: ['triggers'] as const,
    list: (orgId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.triggers.all, 'list', orgId, filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.triggers.all, 'detail', id] as const,
    executions: (triggerId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.triggers.all, 'executions', triggerId, filters ?? {}] as const,
  },

  // API Key queries
  apiKeys: {
    all: ['apiKeys'] as const,
    list: (orgId: string) => [...queryKeys.apiKeys.all, 'list', orgId] as const,
    detail: (id: string) => [...queryKeys.apiKeys.all, 'detail', id] as const,
  },

  // Agent queries
  agents: {
    all: ['agents'] as const,
    list: (orgId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.agents.all, 'list', orgId, filters ?? {}] as const,
    detail: (orgId: string, agentId: number, chainId: number) =>
      [...queryKeys.agents.all, 'detail', orgId, agentId, chainId] as const,
    linked: (orgId: string) => [...queryKeys.agents.all, 'linked', orgId] as const,
  },

  // Events queries
  events: {
    all: ['events'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.events.all, 'list', filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
    byAgent: (agentId: number, chainId: number, filters?: Record<string, unknown>) =>
      [...queryKeys.events.all, 'byAgent', agentId, chainId, filters ?? {}] as const,
  },

  // Credits queries
  credits: {
    all: ['credits'] as const,
    balance: (orgId: string) => [...queryKeys.credits.all, 'balance', orgId] as const,
    transactions: (orgId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.credits.all, 'transactions', orgId, filters ?? {}] as const,
  },

  // Stats queries
  stats: {
    all: ['stats'] as const,
    dashboard: (orgId: string) => [...queryKeys.stats.all, 'dashboard', orgId] as const,
    triggers: (orgId: string, period?: string) =>
      [...queryKeys.stats.all, 'triggers', orgId, period ?? '7d'] as const,
    events: (orgId: string, period?: string) =>
      [...queryKeys.stats.all, 'events', orgId, period ?? '7d'] as const,
  },
} as const

// Type helpers for query key inference
export type QueryKeys = typeof queryKeys
