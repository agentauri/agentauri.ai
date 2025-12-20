import { z } from 'zod'
import {
  chainIdSchema,
  ethereumAddressSchema,
  paginatedResponseSchema,
  uuidSchema,
} from './common'

/**
 * Agent-related validation schemas
 */

// Linked agent schema (matches LinkedAgent model)
export const linkedAgentSchema = z.object({
  id: uuidSchema,
  organizationId: uuidSchema,
  agentId: z.number().int().min(0),
  chainId: chainIdSchema,
  walletAddress: ethereumAddressSchema,
  linkedAt: z.string().datetime(),
})

// Agent filters schema
export const agentFiltersSchema = z.object({
  chainId: chainIdSchema.optional(),
  search: z.string().max(100).optional(),
})

// Link agent request schema
export const linkAgentRequestSchema = z.object({
  agentId: z.number().int().min(0, 'Agent ID must be a positive number'),
  chainId: chainIdSchema,
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
})

// Agent list response
export const agentListResponseSchema = paginatedResponseSchema(linkedAgentSchema)

// Inferred types
export type LinkedAgent = z.infer<typeof linkedAgentSchema>
export type AgentFilters = z.infer<typeof agentFiltersSchema>
export type LinkAgentRequest = z.infer<typeof linkAgentRequestSchema>
