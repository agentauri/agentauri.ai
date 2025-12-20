import { z } from 'zod'
import {
  chainIdSchema,
  paginatedResponseSchema,
  registrySchema,
  uuidSchema,
} from './common'

/**
 * Event-related validation schemas
 */

// Event types
export const EVENT_TYPES = [
  'AgentRegistered',
  'AgentUpdated',
  'AgentDeregistered',
  'ReputationChanged',
  'ValidationCompleted',
  'Transfer',
  'Mint',
  'Burn',
] as const

export const eventTypeSchema = z.enum(EVENT_TYPES)

// Blockchain event schema
export const blockchainEventSchema = z.object({
  id: uuidSchema,
  chainId: chainIdSchema,
  registry: registrySchema,
  eventType: z.string().min(1),
  blockNumber: z.number().int().min(0),
  transactionHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  agentId: z.number().int().min(0).nullable(),
  data: z.record(z.string(), z.unknown()),
  timestamp: z.string().datetime(),
  createdAt: z.string().datetime(),
})

// Event filters schema
export const eventFiltersSchema = z.object({
  chainId: chainIdSchema.optional(),
  registry: registrySchema.optional(),
  eventType: z.string().max(50).optional(),
  agentId: z.coerce.number().int().min(0).optional(),
  transactionHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/)
    .optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
})

// Event list response
export const eventListResponseSchema = paginatedResponseSchema(blockchainEventSchema)

// Inferred types
export type BlockchainEvent = z.infer<typeof blockchainEventSchema>
export type EventFilters = z.infer<typeof eventFiltersSchema>
export type EventType = (typeof EVENT_TYPES)[number]
