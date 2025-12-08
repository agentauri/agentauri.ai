import { describe, expect, it } from 'vitest'
import {
  loginRequestSchema,
  nonceRequestSchema,
  nonceResponseSchema,
  userSessionSchema,
} from '../auth'

describe('Auth validation schemas', () => {
  describe('nonceRequestSchema', () => {
    it('should accept valid request', () => {
      const result = nonceRequestSchema.parse({
        address: '0x1234567890123456789012345678901234567890',
      })
      expect(result.address).toBe('0x1234567890123456789012345678901234567890')
    })

    it('should reject invalid address', () => {
      expect(() =>
        nonceRequestSchema.parse({
          address: 'invalid',
        })
      ).toThrow()
    })
  })

  describe('nonceResponseSchema', () => {
    it('should accept valid response', () => {
      const result = nonceResponseSchema.parse({
        nonce: 'abc12345678',
        expiresAt: '2024-01-01T00:00:00Z',
      })
      expect(result.nonce).toBe('abc12345678')
    })

    it('should reject short nonce', () => {
      expect(() =>
        nonceResponseSchema.parse({
          nonce: 'short',
          expiresAt: '2024-01-01T00:00:00Z',
        })
      ).toThrow()
    })
  })

  describe('loginRequestSchema', () => {
    it('should accept valid login request', () => {
      const result = loginRequestSchema.parse({
        message: 'Sign in message',
        signature:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      })
      expect(result.message).toBe('Sign in message')
    })

    it('should reject empty message', () => {
      expect(() =>
        loginRequestSchema.parse({
          message: '',
          signature:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        })
      ).toThrow()
    })

    it('should reject invalid signature format', () => {
      expect(() =>
        loginRequestSchema.parse({
          message: 'Sign in message',
          signature: 'invalid-signature',
        })
      ).toThrow()
    })

    it('should reject short signature', () => {
      expect(() =>
        loginRequestSchema.parse({
          message: 'Sign in message',
          signature: '0x1234',
        })
      ).toThrow()
    })
  })

  describe('userSessionSchema', () => {
    it('should accept valid user session', () => {
      const validSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        currentOrganizationId: '550e8400-e29b-41d4-a716-446655440001',
        walletAddresses: ['0x1234567890123456789012345678901234567890'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = userSessionSchema.parse(validSession)
      expect(result.id).toBe(validSession.id)
      expect(result.email).toBe(validSession.email)
      expect(result.walletAddresses).toHaveLength(1)
    })

    it('should accept null currentOrganizationId', () => {
      const session = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        currentOrganizationId: null,
        walletAddresses: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = userSessionSchema.parse(session)
      expect(result.currentOrganizationId).toBeNull()
    })

    it('should reject invalid email', () => {
      expect(() =>
        userSessionSchema.parse({
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          email: 'not-an-email',
          currentOrganizationId: null,
          walletAddresses: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        })
      ).toThrow()
    })

    it('should reject invalid wallet addresses', () => {
      expect(() =>
        userSessionSchema.parse({
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          email: 'test@example.com',
          currentOrganizationId: null,
          walletAddresses: ['invalid-address'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        })
      ).toThrow()
    })
  })
})
