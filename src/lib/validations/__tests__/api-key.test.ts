import { describe, expect, it } from 'vitest'
import {
  apiKeySchema,
  createApiKeyRequestSchema,
  createApiKeyResponseSchema,
  updateApiKeyRequestSchema,
} from '../api-key'

describe('API Key validation schemas', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'
  const validDatetime = '2025-01-01T00:00:00Z'

  describe('apiKeySchema', () => {
    // Schema now supports both camelCase and snake_case from backend
    const validApiKey = {
      id: validUuid,
      organizationId: validUuid,
      name: 'Production API Key',
      keyPrefix: '8004_abc123XYZ',
      tier: 'basic' as const,
      enabled: true,
      lastUsedAt: null,
      expiresAt: null,
      createdAt: validDatetime,
    }

    // Backend snake_case format
    const validApiKeySnakeCase = {
      id: validUuid,
      organization_id: validUuid,
      name: 'Production API Key',
      key_prefix: '8004_abc123XYZ',
      tier: 'basic' as const,
      is_active: true,
      last_used_at: null,
      expires_at: null,
      created_at: validDatetime,
    }

    it('should accept valid API key (camelCase)', () => {
      const result = apiKeySchema.parse(validApiKey)
      expect(result.name).toBe('Production API Key')
      expect(result.tier).toBe('basic')
    })

    it('should accept valid API key (snake_case from backend)', () => {
      const result = apiKeySchema.parse(validApiKeySnakeCase)
      expect(result.name).toBe('Production API Key')
      expect(result.tier).toBe('basic')
      expect(result.organizationId).toBe(validUuid)
      expect(result.keyPrefix).toBe('8004_abc123XYZ')
    })

    it('should accept all valid tiers', () => {
      const tiers = ['basic', 'standard', 'advanced', 'full'] as const

      for (const tier of tiers) {
        const apiKey = { ...validApiKey, tier }
        expect(() => apiKeySchema.parse(apiKey)).not.toThrow()
      }
    })

    it('should default tier to basic when not provided', () => {
      const apiKeyWithoutTier = { ...validApiKey, tier: undefined }
      const result = apiKeySchema.parse(apiKeyWithoutTier)
      expect(result.tier).toBe('basic')
    })

    it('should accept keyPrefix in various formats (flexible for backend compatibility)', () => {
      // Schema is now flexible to handle different backend formats
      expect(() => apiKeySchema.parse({ ...validApiKey, keyPrefix: '8004_validKey123' })).not.toThrow()
      expect(() => apiKeySchema.parse({ ...validApiKey, key_prefix: '8004_validKey123' })).not.toThrow()
    })

    it('should accept nullable lastUsedAt', () => {
      const result = apiKeySchema.parse(validApiKey)
      expect(result.lastUsedAt).toBeNull()
    })

    it('should accept valid lastUsedAt datetime', () => {
      const apiKey = { ...validApiKey, lastUsedAt: validDatetime }
      const result = apiKeySchema.parse(apiKey)
      expect(result.lastUsedAt).toBe(validDatetime)
    })

    it('should accept nullable expiresAt', () => {
      const result = apiKeySchema.parse(validApiKey)
      expect(result.expiresAt).toBeNull()
    })

    it('should accept valid expiresAt datetime', () => {
      const apiKey = { ...validApiKey, expiresAt: validDatetime }
      const result = apiKeySchema.parse(apiKey)
      expect(result.expiresAt).toBe(validDatetime)
    })

    it('should enforce name min length', () => {
      expect(() => apiKeySchema.parse({ ...validApiKey, name: '' })).toThrow()
    })

    it('should enforce name max length', () => {
      expect(() => apiKeySchema.parse({ ...validApiKey, name: 'a'.repeat(101) })).toThrow()
    })
  })

  describe('createApiKeyRequestSchema', () => {
    const validRequest = {
      name: 'New API Key',
    }

    it('should accept valid request with name only', () => {
      const result = createApiKeyRequestSchema.parse(validRequest)
      expect(result.name).toBe('New API Key')
      expect(result.tier).toBe('basic') // default
    })

    it('should default tier to basic', () => {
      const result = createApiKeyRequestSchema.parse(validRequest)
      expect(result.tier).toBe('basic')
    })

    it('should accept explicit tier', () => {
      const result = createApiKeyRequestSchema.parse({ ...validRequest, tier: 'advanced' })
      expect(result.tier).toBe('advanced')
    })

    it('should accept optional expiresAt', () => {
      const result = createApiKeyRequestSchema.parse({ ...validRequest, expiresAt: validDatetime })
      expect(result.expiresAt).toBe(validDatetime)
    })

    it('should enforce name min length', () => {
      expect(() => createApiKeyRequestSchema.parse({ name: 'a' })).toThrow()
    })

    it('should enforce name max length', () => {
      expect(() => createApiKeyRequestSchema.parse({ name: 'a'.repeat(101) })).toThrow()
    })

    it('should reject invalid tier', () => {
      expect(() => createApiKeyRequestSchema.parse({ ...validRequest, tier: 'enterprise' })).toThrow()
    })

    it('should reject invalid expiresAt format', () => {
      expect(() => createApiKeyRequestSchema.parse({ ...validRequest, expiresAt: 'not-a-date' })).toThrow()
    })
  })

  describe('createApiKeyResponseSchema', () => {
    const validResponse = {
      apiKey: {
        id: validUuid,
        organizationId: validUuid,
        name: 'New API Key',
        keyPrefix: '8004_abc123',
        tier: 'basic' as const,
        enabled: true,
        lastUsedAt: null,
        expiresAt: null,
        createdAt: validDatetime,
      },
      key: '8004_abc123.secretPart456',
    }

    it('should accept valid response', () => {
      const result = createApiKeyResponseSchema.parse(validResponse)
      expect(result.apiKey.name).toBe('New API Key')
      expect(result.key).toBe('8004_abc123.secretPart456')
    })

    it('should enforce full key format (prefix.secret)', () => {
      expect(() => createApiKeyResponseSchema.parse({ ...validResponse, key: '8004_abc123' })).toThrow()
      expect(() => createApiKeyResponseSchema.parse({ ...validResponse, key: 'invalid.secret' })).toThrow()
    })

    it('should reject key without 8004_ prefix', () => {
      expect(() => createApiKeyResponseSchema.parse({ ...validResponse, key: 'abc123.secret456' })).toThrow()
    })

    it('should reject key without dot separator', () => {
      expect(() => createApiKeyResponseSchema.parse({ ...validResponse, key: '8004_abc123secret456' })).toThrow()
    })

    it('should accept valid key formats', () => {
      const validKeys = [
        '8004_abc.xyz',
        '8004_ABC123.DEF456',
        '8004_test123.secretKey789',
      ]

      for (const key of validKeys) {
        expect(() => createApiKeyResponseSchema.parse({ ...validResponse, key })).not.toThrow()
      }
    })
  })

  describe('updateApiKeyRequestSchema', () => {
    it('should accept empty object', () => {
      const result = updateApiKeyRequestSchema.parse({})
      expect(result).toEqual({})
    })

    it('should accept partial update with name', () => {
      const result = updateApiKeyRequestSchema.parse({ name: 'Updated Name' })
      expect(result.name).toBe('Updated Name')
    })

    it('should accept partial update with tier', () => {
      const result = updateApiKeyRequestSchema.parse({ tier: 'advanced' })
      expect(result.tier).toBe('advanced')
    })

    it('should accept partial update with enabled', () => {
      const result = updateApiKeyRequestSchema.parse({ enabled: false })
      expect(result.enabled).toBe(false)
    })

    it('should accept nullable expiresAt', () => {
      const result = updateApiKeyRequestSchema.parse({ expiresAt: null })
      expect(result.expiresAt).toBeNull()
    })

    it('should accept valid expiresAt', () => {
      const result = updateApiKeyRequestSchema.parse({ expiresAt: validDatetime })
      expect(result.expiresAt).toBe(validDatetime)
    })

    it('should validate name when provided', () => {
      expect(() => updateApiKeyRequestSchema.parse({ name: 'a' })).toThrow()
      expect(() => updateApiKeyRequestSchema.parse({ name: 'a'.repeat(101) })).toThrow()
    })

    it('should validate tier when provided', () => {
      expect(() => updateApiKeyRequestSchema.parse({ tier: 'enterprise' })).toThrow()
    })

    it('should accept multiple fields', () => {
      const result = updateApiKeyRequestSchema.parse({
        name: 'Updated Name',
        tier: 'standard',
        enabled: true,
        expiresAt: validDatetime,
      })
      expect(result.name).toBe('Updated Name')
      expect(result.tier).toBe('standard')
      expect(result.enabled).toBe(true)
      expect(result.expiresAt).toBe(validDatetime)
    })
  })
})
