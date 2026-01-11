/**
 * Organization validation schemas
 *
 * Provides Zod schemas for organization operations:
 * - Organization CRUD operations
 * - Member management (invite, update role, remove)
 * - List responses with pagination
 *
 * @module lib/validations/organization
 */

import { z } from 'zod'
import { organizationRoleSchema, paginatedResponseSchema, uuidSchema } from './common'

/**
 * Organization base schema
 *
 * Matches backend snake_case response format.
 */
export const organizationSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).nullable(),
  owner_id: uuidSchema.optional(),
  plan: z.string().optional(),
  is_personal: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

/**
 * Organization with role schema
 *
 * Flat structure from backend list endpoint including the
 * current user's role in the organization.
 */
export const organizationWithRoleSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).nullable(),
  owner_id: uuidSchema.optional(),
  plan: z.string().optional(),
  is_personal: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  my_role: organizationRoleSchema,
})

/**
 * Organization member schema
 *
 * Member details including user info and role.
 */
export const organizationMemberSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  organizationId: uuidSchema,
  role: organizationRoleSchema,
  username: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

/**
 * Create organization request schema
 *
 * Slug is auto-generated from name if not provided.
 */
export const createOrganizationRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
  description: z.string().max(500).optional(),
})

/**
 * Update organization request schema
 */
export const updateOrganizationRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
})

/**
 * Invite member request schema
 *
 * Cannot invite as 'owner' role.
 */
export const inviteMemberRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: organizationRoleSchema.exclude(['owner']),
})

/**
 * Update member role request schema
 *
 * Cannot set role to 'owner'.
 */
export const updateMemberRoleRequestSchema = z.object({
  role: organizationRoleSchema.exclude(['owner']),
})

/** Organization list response with pagination */
export const organizationListResponseSchema = paginatedResponseSchema(organizationWithRoleSchema)

/** Member list response with pagination */
export const memberListResponseSchema = paginatedResponseSchema(organizationMemberSchema)

/* ─────────────────────────────────────────────────────────────────────────────
 * Inferred Types
 * ─────────────────────────────────────────────────────────────────────────────*/
export type Organization = z.infer<typeof organizationSchema>
export type OrganizationWithRole = z.infer<typeof organizationWithRoleSchema>
export type OrganizationMember = z.infer<typeof organizationMemberSchema>
export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>
export type UpdateOrganizationRequest = z.infer<typeof updateOrganizationRequestSchema>
export type InviteMemberRequest = z.infer<typeof inviteMemberRequestSchema>
export type UpdateMemberRoleRequest = z.infer<typeof updateMemberRoleRequestSchema>
