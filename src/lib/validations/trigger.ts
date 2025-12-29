import { z } from 'zod'
import {
  actionTypeSchema,
  chainIdSchema,
  paginatedResponseSchema,
  registrySchema,
  uuidSchema,
} from './common'

/**
 * Trigger-related validation schemas
 */

// Trigger condition schema
export const triggerConditionSchema = z.object({
  id: uuidSchema,
  triggerId: uuidSchema,
  conditionType: z.string().min(1),
  field: z.string().min(1),
  operator: z.enum([
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'in',
    'contains',
    'startsWith',
    'endsWith',
  ]),
  value: z.string(),
  config: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().datetime(),
})

// Trigger action schema
export const triggerActionSchema = z.object({
  id: uuidSchema,
  triggerId: uuidSchema,
  actionType: actionTypeSchema,
  priority: z.number().int().min(0).max(100),
  config: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
})

// Trigger base schema
export const triggerSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  organizationId: uuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  chainId: chainIdSchema,
  registry: registrySchema,
  enabled: z.boolean(),
  isStateful: z.boolean(),
  executionCount: z.number().int().min(0),
  lastExecutedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  conditions: z.array(triggerConditionSchema).optional(),
  actions: z.array(triggerActionSchema).optional(),
})

// Create trigger condition input with validation
export const createConditionInputSchema = z.object({
  conditionType: z
    .string()
    .min(1, 'Condition type is required')
    .max(50, 'Condition type too long')
    .regex(/^[a-z_]+$/, 'Condition type must be lowercase with underscores'),
  field: z
    .string()
    .min(1, 'Field is required')
    .max(50, 'Field name too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Field name contains invalid characters'),
  operator: z.enum([
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'in',
    'contains',
    'startsWith',
    'endsWith',
  ]),
  value: z.string().trim().max(500, 'Value too long'),
  config: z
    .record(z.string(), z.unknown())
    .default({})
    .refine((obj) => Object.keys(obj).length <= 10, {
      message: 'Config cannot have more than 10 keys',
    }),
})

// Create trigger action input with size limits
export const createActionInputSchema = z.object({
  _key: z.string().optional(), // Internal key for React list rendering (stripped before API)
  actionType: actionTypeSchema,
  priority: z.number().int().min(0).max(100).default(0),
  config: z
    .record(z.string(), z.unknown())
    .refine((obj) => Object.keys(obj).length <= 20, {
      message: 'Config cannot have more than 20 keys',
    })
    .refine((obj) => JSON.stringify(obj).length <= 10000, {
      message: 'Config size cannot exceed 10KB',
    }),
})

// Create trigger request with security validations
export const createTriggerRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .regex(/^[\w\s\-_.]+$/, 'Name contains invalid characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters')
      .optional(),
    chainId: chainIdSchema,
    registry: registrySchema,
    enabled: z.boolean().default(true),
    isStateful: z.boolean().default(false),
    conditions: z
      .array(createConditionInputSchema)
      .min(1, 'At least one condition is required')
      .max(20, 'Cannot exceed 20 conditions'),
    actions: z
      .array(createActionInputSchema)
      .min(1, 'At least one action is required')
      .max(10, 'Cannot exceed 10 actions'),
  })
  .refine(
    (data) => {
      // Prevent duplicate condition fields
      const fields = data.conditions.map((c) => `${c.conditionType}:${c.field}`)
      return fields.length === new Set(fields).size
    },
    {
      message: 'Duplicate conditions detected',
      path: ['conditions'],
    }
  )

// Update trigger request
export const updateTriggerRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  enabled: z.boolean().optional(),
  isStateful: z.boolean().optional(),
  conditions: z.array(createConditionInputSchema).optional(),
  actions: z.array(createActionInputSchema).optional(),
})

// Trigger list filters
export const triggerFiltersSchema = z.object({
  chainId: chainIdSchema.optional(),
  registry: registrySchema.optional(),
  enabled: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
})

// Trigger list response
export const triggerListResponseSchema = paginatedResponseSchema(triggerSchema)

// Inferred types
export type Trigger = z.infer<typeof triggerSchema>
export type TriggerCondition = z.infer<typeof triggerConditionSchema>
export type TriggerAction = z.infer<typeof triggerActionSchema>
export type CreateTriggerRequest = z.infer<typeof createTriggerRequestSchema>
// Form input type (before Zod transforms/coerces values)
export type CreateTriggerFormValues = z.input<typeof createTriggerRequestSchema>
export type UpdateTriggerRequest = z.infer<typeof updateTriggerRequestSchema>
export type TriggerFilters = z.infer<typeof triggerFiltersSchema>
