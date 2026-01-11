/**
 * Agent validation schemas
 *
 * Provides Zod schemas for agent operations:
 * - Linked agent data (agents linked to organizations)
 * - Agent filtering for list queries
 * - Link agent request (with signature verification)
 *
 * @module lib/validations/agent
 */

import { z } from 'zod'
import {
  chainIdSchema,
  ethereumAddressSchema,
  paginatedResponseSchema,
  uuidSchema,
} from './common'

/**
 * Linked agent schema
 *
 * Represents an ERC-8004 agent linked to an organization.
 */
export const linkedAgentSchema = z.object({
  id: uuidSchema,
  organizationId: uuidSchema,
  agentId: z.number().int().min(0),
  chainId: chainIdSchema,
  walletAddress: ethereumAddressSchema,
  linkedAt: z.string().datetime(),
})

/**
 * Agent filters schema for list queries
 */
export const agentFiltersSchema = z.object({
  chainId: chainIdSchema.optional(),
  search: z.string().max(100).optional(),
})

/**
 * Link agent request schema
 *
 * Links an on-chain agent to the organization.
 * Requires signature proof of ownership.
 */
export const linkAgentRequestSchema = z.object({
  agentId: z.number().int().min(0, 'Agent ID must be a positive number'),
  chainId: chainIdSchema,
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
})

/** Agent list response with pagination */
export const agentListResponseSchema = paginatedResponseSchema(linkedAgentSchema)

/* ─────────────────────────────────────────────────────────────────────────────
 * Inferred Types
 * ─────────────────────────────────────────────────────────────────────────────*/
export type LinkedAgent = z.infer<typeof linkedAgentSchema>
export type AgentFilters = z.infer<typeof agentFiltersSchema>
export type LinkAgentRequest = z.infer<typeof linkAgentRequestSchema>
