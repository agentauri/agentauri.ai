import { z } from 'zod'
import { organizationRoleSchema, paginatedResponseSchema, uuidSchema } from './common'

/**
 * Organization-related validation schemas
 */

// Organization base schema
export const organizationSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).nullable(),
  isPersonal: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Organization with role schema
export const organizationWithRoleSchema = z.object({
  organization: organizationSchema,
  myRole: organizationRoleSchema,
})

// Organization member schema
export const organizationMemberSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  organizationId: uuidSchema,
  role: organizationRoleSchema,
  username: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

// Create organization request
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

// Update organization request
export const updateOrganizationRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
})

// Invite member request
export const inviteMemberRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: organizationRoleSchema.exclude(['owner']),
})

// Update member role request
export const updateMemberRoleRequestSchema = z.object({
  role: organizationRoleSchema.exclude(['owner']),
})

// Organization list response
export const organizationListResponseSchema = paginatedResponseSchema(organizationWithRoleSchema)

// Member list response
export const memberListResponseSchema = paginatedResponseSchema(organizationMemberSchema)

// Inferred types
export type Organization = z.infer<typeof organizationSchema>
export type OrganizationWithRole = z.infer<typeof organizationWithRoleSchema>
export type OrganizationMember = z.infer<typeof organizationMemberSchema>
export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>
export type UpdateOrganizationRequest = z.infer<typeof updateOrganizationRequestSchema>
export type InviteMemberRequest = z.infer<typeof inviteMemberRequestSchema>
export type UpdateMemberRoleRequest = z.infer<typeof updateMemberRoleRequestSchema>
