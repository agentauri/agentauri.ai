import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  apiErrorResponseSchema,
  apiResponseSchema,
  chainIdSchema,
  dateRangeSchema,
  ethereumAddressSchema,
  organizationRoleSchema,
  paginatedResponseSchema,
  paginationSchema,
  registrySchema,
  sortSchema,
  uuidSchema,
} from '../common'

describe('Common validation schemas', () => {
  describe('ethereumAddressSchema', () => {
    it('should accept valid Ethereum addresses', () => {
      const validAddresses = [
        '0x1234567890123456789012345678901234567890',
        '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
        '0xabcdef1234567890abcdef1234567890abcdef12',
      ]

      for (const address of validAddresses) {
        expect(() => ethereumAddressSchema.parse(address)).not.toThrow()
      }
    })

    it('should reject invalid Ethereum addresses', () => {
      const invalidAddresses = [
        '0x123', // too short
        '1234567890123456789012345678901234567890', // missing 0x prefix
        '0x12345678901234567890123456789012345678901', // too long
        '0xGHIJKL1234567890123456789012345678901234', // invalid hex chars
        '', // empty
      ]

      for (const address of invalidAddresses) {
        expect(() => ethereumAddressSchema.parse(address)).toThrow()
      }
    })
  })

  describe('uuidSchema', () => {
    it('should accept valid UUIDs', () => {
      const validUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      ]

      for (const uuid of validUuids) {
        expect(() => uuidSchema.parse(uuid)).not.toThrow()
      }
    })

    it('should reject invalid UUIDs', () => {
      const invalidUuids = ['not-a-uuid', '550e8400-e29b-41d4-a716', '', '123']

      for (const uuid of invalidUuids) {
        expect(() => uuidSchema.parse(uuid)).toThrow()
      }
    })
  })

  describe('chainIdSchema', () => {
    it('should accept supported chain IDs', () => {
      const supportedChains = [1, 8453, 11155111, 84532, 59141, 80002]

      for (const chainId of supportedChains) {
        expect(() => chainIdSchema.parse(chainId)).not.toThrow()
      }
    })

    it('should coerce string to number', () => {
      expect(chainIdSchema.parse('1')).toBe(1)
      expect(chainIdSchema.parse('8453')).toBe(8453)
    })

    it('should reject unsupported chain IDs', () => {
      const unsupportedChains = [0, 999, 12345]

      for (const chainId of unsupportedChains) {
        expect(() => chainIdSchema.parse(chainId)).toThrow()
      }
    })
  })

  describe('registrySchema', () => {
    it('should accept valid registry types', () => {
      const validRegistries = ['identity', 'reputation', 'validation']

      for (const registry of validRegistries) {
        expect(() => registrySchema.parse(registry)).not.toThrow()
      }
    })

    it('should reject invalid registry types', () => {
      expect(() => registrySchema.parse('invalid')).toThrow()
      expect(() => registrySchema.parse('')).toThrow()
    })
  })

  describe('organizationRoleSchema', () => {
    it('should accept valid organization roles', () => {
      const validRoles = ['owner', 'admin', 'member', 'viewer']

      for (const role of validRoles) {
        expect(() => organizationRoleSchema.parse(role)).not.toThrow()
      }
    })

    it('should reject invalid roles', () => {
      expect(() => organizationRoleSchema.parse('superadmin')).toThrow()
      expect(() => organizationRoleSchema.parse('')).toThrow()
    })
  })

  describe('paginationSchema', () => {
    it('should apply default values', () => {
      const result = paginationSchema.parse({})
      expect(result.limit).toBe(20)
      expect(result.offset).toBe(0)
    })

    it('should accept valid pagination params', () => {
      const result = paginationSchema.parse({ limit: 50, offset: 10 })
      expect(result.limit).toBe(50)
      expect(result.offset).toBe(10)
    })

    it('should coerce strings to numbers', () => {
      const result = paginationSchema.parse({ limit: '25', offset: '5' })
      expect(result.limit).toBe(25)
      expect(result.offset).toBe(5)
    })

    it('should enforce max limit', () => {
      expect(() => paginationSchema.parse({ limit: 200 })).toThrow()
    })

    it('should enforce min values', () => {
      expect(() => paginationSchema.parse({ limit: 0 })).toThrow()
      expect(() => paginationSchema.parse({ offset: -1 })).toThrow()
    })
  })

  describe('sortSchema', () => {
    it('should accept valid sort fields', () => {
      const result = sortSchema.parse({ sortBy: 'createdAt', sortOrder: 'desc' })
      expect(result.sortBy).toBe('createdAt')
      expect(result.sortOrder).toBe('desc')
    })

    it('should apply default sort order', () => {
      const result = sortSchema.parse({ sortBy: 'name' })
      expect(result.sortOrder).toBe('desc')
    })

    it('should accept asc sort order', () => {
      const result = sortSchema.parse({ sortOrder: 'asc' })
      expect(result.sortOrder).toBe('asc')
    })

    it('should validate field name format', () => {
      expect(() => sortSchema.parse({ sortBy: 'invalid-field' })).toThrow()
      expect(() => sortSchema.parse({ sortBy: 'a'.repeat(100) })).toThrow()
    })

    it('should allow undefined sortBy', () => {
      const result = sortSchema.parse({})
      expect(result.sortBy).toBeUndefined()
    })
  })

  describe('dateRangeSchema', () => {
    it('should accept valid date ranges', () => {
      const start = new Date('2025-01-01').toISOString()
      const end = new Date('2025-02-01').toISOString()

      const result = dateRangeSchema.parse({ startDate: start, endDate: end })
      expect(result.startDate).toBe(start)
      expect(result.endDate).toBe(end)
    })

    it('should reject when start is after end', () => {
      const start = new Date('2025-02-01').toISOString()
      const end = new Date('2025-01-01').toISOString()

      expect(() => dateRangeSchema.parse({ startDate: start, endDate: end })).toThrow()
    })

    it('should allow equal start and end dates', () => {
      const date = new Date('2025-01-01').toISOString()

      const result = dateRangeSchema.parse({ startDate: date, endDate: date })
      expect(result.startDate).toBe(date)
      expect(result.endDate).toBe(date)
    })

    it('should reject date ranges exceeding 1 year', () => {
      const start = new Date('2024-01-01').toISOString()
      const end = new Date('2025-12-31').toISOString() // More than 1 year

      expect(() => dateRangeSchema.parse({ startDate: start, endDate: end })).toThrow()
    })

    it('should accept date range within 1 year', () => {
      const start = new Date('2024-01-01').toISOString()
      const end = new Date('2024-12-31').toISOString() // Within 1 year

      const result = dateRangeSchema.parse({ startDate: start, endDate: end })
      expect(result.startDate).toBe(start)
      expect(result.endDate).toBe(end)
    })

    it('should allow only startDate', () => {
      const start = new Date('2025-01-01').toISOString()

      const result = dateRangeSchema.parse({ startDate: start })
      expect(result.startDate).toBe(start)
      expect(result.endDate).toBeUndefined()
    })

    it('should allow only endDate', () => {
      const end = new Date('2025-01-01').toISOString()

      const result = dateRangeSchema.parse({ endDate: end })
      expect(result.startDate).toBeUndefined()
      expect(result.endDate).toBe(end)
    })

    it('should allow empty object', () => {
      const result = dateRangeSchema.parse({})
      expect(result.startDate).toBeUndefined()
      expect(result.endDate).toBeUndefined()
    })
  })

  describe('apiResponseSchema', () => {
    it('should validate response with data and message', () => {
      const UserSchema = z.object({
        id: z.string(),
        name: z.string(),
      })

      const schema = apiResponseSchema(UserSchema)

      const validResponse = {
        data: { id: '123', name: 'Test User' },
        message: 'Success',
      }

      const result = schema.parse(validResponse)
      expect(result.data).toEqual({ id: '123', name: 'Test User' })
      expect(result.message).toBe('Success')
    })

    it('should allow missing message', () => {
      const StringSchema = z.string()
      const schema = apiResponseSchema(StringSchema)

      const result = schema.parse({ data: 'test' })
      expect(result.data).toBe('test')
      expect(result.message).toBeUndefined()
    })

    it('should reject invalid data shape', () => {
      const UserSchema = z.object({
        id: z.string(),
        name: z.string(),
      })

      const schema = apiResponseSchema(UserSchema)

      expect(() =>
        schema.parse({
          data: { id: 123, name: 'Test' }, // id should be string
        })
      ).toThrow()
    })
  })

  describe('paginatedResponseSchema', () => {
    it('should validate paginated response', () => {
      const ItemSchema = z.object({
        id: z.string(),
        title: z.string(),
      })

      const schema = paginatedResponseSchema(ItemSchema)

      const validResponse = {
        data: [
          { id: '1', title: 'First' },
          { id: '2', title: 'Second' },
        ],
        pagination: {
          total: 10,
          limit: 2,
          offset: 0,
          hasMore: true,
        },
      }

      const result = schema.parse(validResponse)
      expect(result.data).toHaveLength(2)
      expect(result.pagination.total).toBe(10)
      expect(result.pagination.hasMore).toBe(true)
    })

    it('should handle empty data array', () => {
      const ItemSchema = z.object({ id: z.string() })
      const schema = paginatedResponseSchema(ItemSchema)

      const result = schema.parse({
        data: [],
        pagination: {
          total: 0,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      })

      expect(result.data).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })

    it('should reject invalid pagination structure', () => {
      const ItemSchema = z.object({ id: z.string() })
      const schema = paginatedResponseSchema(ItemSchema)

      expect(() =>
        schema.parse({
          data: [],
          pagination: {
            total: 'invalid', // should be number
            limit: 20,
            offset: 0,
            hasMore: false,
          },
        })
      ).toThrow()
    })
  })

  describe('apiErrorResponseSchema', () => {
    it('should validate error response structure', () => {
      const validError = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: { field: 'email', reason: 'invalid format' },
        },
      }

      const result = apiErrorResponseSchema.parse(validError)
      expect(result.error.code).toBe('VALIDATION_ERROR')
      expect(result.error.message).toBe('Validation failed')
      expect(result.error.details).toBeDefined()
    })

    it('should allow missing details', () => {
      const validError = {
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
      }

      const result = apiErrorResponseSchema.parse(validError)
      expect(result.error.code).toBe('NOT_FOUND')
      expect(result.error.details).toBeUndefined()
    })

    it('should reject missing required fields', () => {
      expect(() =>
        apiErrorResponseSchema.parse({
          error: {
            code: 'ERROR',
            // missing message
          },
        })
      ).toThrow()
    })
  })
})
