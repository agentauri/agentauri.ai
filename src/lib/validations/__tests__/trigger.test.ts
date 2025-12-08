import { describe, expect, it } from 'vitest'
import {
  createActionInputSchema,
  createConditionInputSchema,
  createTriggerRequestSchema,
  triggerActionSchema,
  triggerConditionSchema,
  triggerFiltersSchema,
  triggerSchema,
  updateTriggerRequestSchema,
} from '../trigger'

describe('Trigger validation schemas', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'
  const validDatetime = '2025-01-01T00:00:00Z'

  describe('triggerConditionSchema', () => {
    const validCondition = {
      id: validUuid,
      triggerId: validUuid,
      conditionType: 'event_filter',
      field: 'eventType',
      operator: 'eq' as const,
      value: 'transfer',
      config: {},
      createdAt: validDatetime,
    }

    it('should accept valid condition', () => {
      const result = triggerConditionSchema.parse(validCondition)
      expect(result.id).toBe(validUuid)
      expect(result.operator).toBe('eq')
    })

    it('should accept all valid operators', () => {
      const operators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'contains', 'startsWith', 'endsWith'] as const

      for (const operator of operators) {
        const condition = { ...validCondition, operator }
        expect(() => triggerConditionSchema.parse(condition)).not.toThrow()
      }
    })

    it('should reject invalid operator', () => {
      const condition = { ...validCondition, operator: 'invalid' }
      expect(() => triggerConditionSchema.parse(condition)).toThrow()
    })

    it('should require conditionType', () => {
      const condition = { ...validCondition, conditionType: '' }
      expect(() => triggerConditionSchema.parse(condition)).toThrow()
    })

    it('should require field', () => {
      const condition = { ...validCondition, field: '' }
      expect(() => triggerConditionSchema.parse(condition)).toThrow()
    })

    it('should default config to empty object', () => {
      const conditionWithoutConfig = { ...validCondition }
      delete (conditionWithoutConfig as Record<string, unknown>).config
      const result = triggerConditionSchema.parse(conditionWithoutConfig)
      expect(result.config).toEqual({})
    })
  })

  describe('triggerActionSchema', () => {
    const validAction = {
      id: validUuid,
      triggerId: validUuid,
      actionType: 'telegram' as const,
      priority: 0,
      config: { chatId: '123456' },
      createdAt: validDatetime,
    }

    it('should accept valid action', () => {
      const result = triggerActionSchema.parse(validAction)
      expect(result.actionType).toBe('telegram')
      expect(result.priority).toBe(0)
    })

    it('should accept all valid action types', () => {
      const actionTypes = ['telegram', 'rest', 'mcp'] as const

      for (const actionType of actionTypes) {
        const action = { ...validAction, actionType }
        expect(() => triggerActionSchema.parse(action)).not.toThrow()
      }
    })

    it('should reject invalid action type', () => {
      const action = { ...validAction, actionType: 'invalid' }
      expect(() => triggerActionSchema.parse(action)).toThrow()
    })

    it('should enforce priority range 0-100', () => {
      expect(() => triggerActionSchema.parse({ ...validAction, priority: -1 })).toThrow()
      expect(() => triggerActionSchema.parse({ ...validAction, priority: 101 })).toThrow()
      expect(() => triggerActionSchema.parse({ ...validAction, priority: 50 })).not.toThrow()
      expect(() => triggerActionSchema.parse({ ...validAction, priority: 100 })).not.toThrow()
    })
  })

  describe('triggerSchema', () => {
    const validTrigger = {
      id: validUuid,
      userId: validUuid,
      organizationId: validUuid,
      name: 'Test Trigger',
      description: 'A test trigger',
      chainId: 1,
      registry: 'identity' as const,
      enabled: true,
      isStateful: false,
      executionCount: 0,
      lastExecutedAt: null,
      createdAt: validDatetime,
      updatedAt: validDatetime,
    }

    it('should accept valid trigger', () => {
      const result = triggerSchema.parse(validTrigger)
      expect(result.name).toBe('Test Trigger')
      expect(result.enabled).toBe(true)
    })

    it('should accept nullable description', () => {
      const trigger = { ...validTrigger, description: null }
      const result = triggerSchema.parse(trigger)
      expect(result.description).toBeNull()
    })

    it('should accept nullable lastExecutedAt', () => {
      const trigger = { ...validTrigger, lastExecutedAt: validDatetime }
      const result = triggerSchema.parse(trigger)
      expect(result.lastExecutedAt).toBe(validDatetime)
    })

    it('should enforce name length limits', () => {
      expect(() => triggerSchema.parse({ ...validTrigger, name: '' })).toThrow()
      expect(() => triggerSchema.parse({ ...validTrigger, name: 'a'.repeat(101) })).toThrow()
    })

    it('should enforce description max length', () => {
      expect(() => triggerSchema.parse({ ...validTrigger, description: 'a'.repeat(501) })).toThrow()
    })
  })

  describe('createConditionInputSchema', () => {
    const validInput = {
      conditionType: 'event_filter',
      field: 'eventType',
      operator: 'eq' as const,
      value: 'transfer',
    }

    it('should accept valid input', () => {
      const result = createConditionInputSchema.parse(validInput)
      expect(result.conditionType).toBe('event_filter')
    })

    it('should enforce conditionType format (lowercase with underscores)', () => {
      expect(() => createConditionInputSchema.parse({ ...validInput, conditionType: 'EventFilter' })).toThrow()
      expect(() => createConditionInputSchema.parse({ ...validInput, conditionType: 'event-filter' })).toThrow()
      expect(() => createConditionInputSchema.parse({ ...validInput, conditionType: 'event_filter_extended' })).not.toThrow()
    })

    it('should enforce conditionType length limits', () => {
      expect(() => createConditionInputSchema.parse({ ...validInput, conditionType: '' })).toThrow()
      expect(() => createConditionInputSchema.parse({ ...validInput, conditionType: 'a'.repeat(51) })).toThrow()
    })

    it('should enforce field format (alphanumeric with underscores)', () => {
      expect(() => createConditionInputSchema.parse({ ...validInput, field: 'event-type' })).toThrow()
      expect(() => createConditionInputSchema.parse({ ...validInput, field: 'eventType123' })).not.toThrow()
      expect(() => createConditionInputSchema.parse({ ...validInput, field: 'event_type' })).not.toThrow()
    })

    it('should enforce field length limits', () => {
      expect(() => createConditionInputSchema.parse({ ...validInput, field: '' })).toThrow()
      expect(() => createConditionInputSchema.parse({ ...validInput, field: 'a'.repeat(51) })).toThrow()
    })

    it('should enforce value max length', () => {
      expect(() => createConditionInputSchema.parse({ ...validInput, value: 'a'.repeat(501) })).toThrow()
    })

    it('should trim value whitespace', () => {
      const result = createConditionInputSchema.parse({ ...validInput, value: '  transfer  ' })
      expect(result.value).toBe('transfer')
    })

    it('should enforce max 10 keys in config', () => {
      const tooManyKeys: Record<string, string> = {}
      for (let i = 0; i < 11; i++) {
        tooManyKeys[`key${i}`] = 'value'
      }
      expect(() => createConditionInputSchema.parse({ ...validInput, config: tooManyKeys })).toThrow()
    })

    it('should accept config with 10 keys', () => {
      const tenKeys: Record<string, string> = {}
      for (let i = 0; i < 10; i++) {
        tenKeys[`key${i}`] = 'value'
      }
      expect(() => createConditionInputSchema.parse({ ...validInput, config: tenKeys })).not.toThrow()
    })
  })

  describe('createActionInputSchema', () => {
    const validInput = {
      actionType: 'telegram' as const,
      config: { chatId: '123456' },
    }

    it('should accept valid input', () => {
      const result = createActionInputSchema.parse(validInput)
      expect(result.actionType).toBe('telegram')
      expect(result.priority).toBe(0) // default
    }
    )

    it('should default priority to 0', () => {
      const result = createActionInputSchema.parse(validInput)
      expect(result.priority).toBe(0)
    })

    it('should enforce priority range', () => {
      expect(() => createActionInputSchema.parse({ ...validInput, priority: -1 })).toThrow()
      expect(() => createActionInputSchema.parse({ ...validInput, priority: 101 })).toThrow()
    })

    it('should enforce max 20 keys in config', () => {
      const tooManyKeys: Record<string, string> = {}
      for (let i = 0; i < 21; i++) {
        tooManyKeys[`key${i}`] = 'value'
      }
      expect(() => createActionInputSchema.parse({ ...validInput, config: tooManyKeys })).toThrow()
    })

    it('should enforce max 10KB config size', () => {
      const largeConfig = {
        data: 'x'.repeat(11000), // > 10KB
      }
      expect(() => createActionInputSchema.parse({ ...validInput, config: largeConfig })).toThrow()
    })

    it('should accept config within size limits', () => {
      const okConfig = {
        data: 'x'.repeat(5000),
      }
      expect(() => createActionInputSchema.parse({ ...validInput, config: okConfig })).not.toThrow()
    })
  })

  describe('createTriggerRequestSchema', () => {
    const validCondition = {
      conditionType: 'event_filter',
      field: 'eventType',
      operator: 'eq' as const,
      value: 'transfer',
    }

    const validAction = {
      actionType: 'telegram' as const,
      config: { chatId: '123456' },
    }

    const validRequest = {
      name: 'Test Trigger',
      chainId: 1,
      registry: 'identity' as const,
      conditions: [validCondition],
      actions: [validAction],
    }

    it('should accept valid request', () => {
      const result = createTriggerRequestSchema.parse(validRequest)
      expect(result.name).toBe('Test Trigger')
      expect(result.enabled).toBe(true) // default
      expect(result.isStateful).toBe(false) // default
    })

    it('should enforce name min length', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, name: 'a' })).toThrow()
    })

    it('should enforce name max length', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, name: 'a'.repeat(101) })).toThrow()
    })

    it('should enforce name format (word chars, spaces, hyphens, underscores, dots)', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, name: 'Valid-Name_123.test' })).not.toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, name: 'Invalid<Script>' })).toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, name: 'Invalid@Name' })).toThrow()
    })

    it('should trim name whitespace', () => {
      const result = createTriggerRequestSchema.parse({ ...validRequest, name: '  Test Trigger  ' })
      expect(result.name).toBe('Test Trigger')
    })

    it('should enforce description max length', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, description: 'a'.repeat(501) })).toThrow()
    })

    it('should require at least one condition', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, conditions: [] })).toThrow()
    })

    it('should enforce max 20 conditions', () => {
      const manyConditions = Array(21).fill(null).map((_, i) => ({
        ...validCondition,
        field: `field${i}`,
      }))
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, conditions: manyConditions })).toThrow()
    })

    it('should require at least one action', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, actions: [] })).toThrow()
    })

    it('should enforce max 10 actions', () => {
      const manyActions = Array(11).fill(validAction)
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, actions: manyActions })).toThrow()
    })

    it('should detect duplicate conditions', () => {
      const duplicateConditions = [
        validCondition,
        validCondition, // Same conditionType:field
      ]
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, conditions: duplicateConditions })).toThrow()
    })

    it('should allow conditions with different fields', () => {
      const differentConditions = [
        validCondition,
        { ...validCondition, field: 'agentId' },
      ]
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, conditions: differentConditions })).not.toThrow()
    })

    it('should allow conditions with different types', () => {
      const differentConditions = [
        validCondition,
        { ...validCondition, conditionType: 'threshold' },
      ]
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, conditions: differentConditions })).not.toThrow()
    })

    it('should validate chainId', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, chainId: 999999 })).toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, chainId: 1 })).not.toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, chainId: 8453 })).not.toThrow()
    })

    it('should validate registry', () => {
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, registry: 'invalid' })).toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, registry: 'identity' })).not.toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, registry: 'reputation' })).not.toThrow()
      expect(() => createTriggerRequestSchema.parse({ ...validRequest, registry: 'validation' })).not.toThrow()
    })
  })

  describe('updateTriggerRequestSchema', () => {
    it('should accept partial updates', () => {
      const result = updateTriggerRequestSchema.parse({ name: 'Updated Name' })
      expect(result.name).toBe('Updated Name')
    })

    it('should accept empty object', () => {
      const result = updateTriggerRequestSchema.parse({})
      expect(result).toEqual({})
    })

    it('should validate name when provided', () => {
      expect(() => updateTriggerRequestSchema.parse({ name: 'a' })).toThrow()
      expect(() => updateTriggerRequestSchema.parse({ name: 'Valid Name' })).not.toThrow()
    })

    it('should allow nullable description', () => {
      const result = updateTriggerRequestSchema.parse({ description: null })
      expect(result.description).toBeNull()
    })

    it('should accept boolean fields', () => {
      const result = updateTriggerRequestSchema.parse({ enabled: false, isStateful: true })
      expect(result.enabled).toBe(false)
      expect(result.isStateful).toBe(true)
    })
  })

  describe('triggerFiltersSchema', () => {
    it('should accept empty filters', () => {
      const result = triggerFiltersSchema.parse({})
      expect(result).toEqual({})
    })

    it('should accept valid chainId filter', () => {
      const result = triggerFiltersSchema.parse({ chainId: 1 })
      expect(result.chainId).toBe(1)
    })

    it('should accept valid registry filter', () => {
      const result = triggerFiltersSchema.parse({ registry: 'identity' })
      expect(result.registry).toBe('identity')
    })

    it('should coerce enabled to boolean', () => {
      const result = triggerFiltersSchema.parse({ enabled: 'true' })
      expect(result.enabled).toBe(true)
    })

    it('should accept search filter', () => {
      const result = triggerFiltersSchema.parse({ search: 'test query' })
      expect(result.search).toBe('test query')
    })

    it('should enforce search max length', () => {
      expect(() => triggerFiltersSchema.parse({ search: 'a'.repeat(101) })).toThrow()
    })
  })
})
