import { describe, expect, it } from 'vitest'
import {
  loginRequestSchema,
  nonceResponseSchema,
  userSessionSchema,
  walletLoginRequestSchema,
} from '../auth'

describe('Auth validation schemas', () => {
  describe('nonceResponseSchema', () => {
    it('should accept valid response', () => {
      const result = nonceResponseSchema.parse({
        nonce: '550e8400-e29b-41d4-a716-446655440000',
        expires_at: '2024-01-01T00:00:00Z',
        message: 'Sign this message to authenticate with AgentAuri.\n\nNonce: 550e8400-...',
      })
      expect(result.nonce).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(result.message).toContain('Sign this message')
    })

    it('should reject invalid nonce format', () => {
      expect(() =>
        nonceResponseSchema.parse({
          nonce: 'not-a-uuid',
          expires_at: '2024-01-01T00:00:00Z',
          message: 'Some message',
        })
      ).toThrow()
    })
  })

  describe('walletLoginRequestSchema / loginRequestSchema', () => {
    it('should accept valid wallet login request', () => {
      const result = walletLoginRequestSchema.parse({
        address: '0x1234567890123456789012345678901234567890',
        message: 'Sign in message',
        signature:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      })
      expect(result.address).toBe('0x1234567890123456789012345678901234567890')
      expect(result.message).toBe('Sign in message')
    })

    it('should reject empty message', () => {
      expect(() =>
        loginRequestSchema.parse({
          address: '0x1234567890123456789012345678901234567890',
          message: '',
          signature:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        })
      ).toThrow()
    })

    it('should reject invalid signature format', () => {
      expect(() =>
        loginRequestSchema.parse({
          address: '0x1234567890123456789012345678901234567890',
          message: 'Sign in message',
          signature: 'invalid-signature',
        })
      ).toThrow()
    })

    it('should reject short signature', () => {
      expect(() =>
        loginRequestSchema.parse({
          address: '0x1234567890123456789012345678901234567890',
          message: 'Sign in message',
          signature: '0x1234',
        })
      ).toThrow()
    })

    it('should reject invalid address', () => {
      expect(() =>
        loginRequestSchema.parse({
          address: 'not-an-address',
          message: 'Sign in message',
          signature:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
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
        name: 'Test User',
        avatar: 'https://example.com/avatar.png',
        wallets: [
          { address: '0x1234567890123456789012345678901234567890', chain_id: 1 },
        ],
        providers: ['google'],
        organizations: [
          { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Test Org', slug: 'test-org', role: 'owner' },
        ],
        created_at: '2024-01-01T00:00:00Z',
      }

      const result = userSessionSchema.parse(validSession)
      expect(result.id).toBe(validSession.id)
      expect(result.email).toBe(validSession.email)
      expect(result.wallets).toHaveLength(1)
      expect(result.providers).toContain('google')
    })

    it('should accept minimal user session with defaults', () => {
      const session = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
        name: null,
        avatar: null,
        created_at: '2024-01-01T00:00:00Z',
      }

      const result = userSessionSchema.parse(session)
      expect(result.wallets).toEqual([])
      expect(result.providers).toEqual([])
      expect(result.organizations).toEqual([])
    })

    it('should reject invalid email', () => {
      expect(() =>
        userSessionSchema.parse({
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          email: 'not-an-email',
          name: null,
          avatar: null,
          created_at: '2024-01-01T00:00:00Z',
        })
      ).toThrow()
    })

    it('should reject invalid wallet address in wallets array', () => {
      expect(() =>
        userSessionSchema.parse({
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          email: 'test@example.com',
          name: null,
          avatar: null,
          wallets: [{ address: 'invalid-address', chain_id: 1 }],
          created_at: '2024-01-01T00:00:00Z',
        })
      ).toThrow()
    })

    it('should reject invalid provider', () => {
      expect(() =>
        userSessionSchema.parse({
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          email: 'test@example.com',
          name: null,
          avatar: null,
          providers: ['invalid-provider'],
          created_at: '2024-01-01T00:00:00Z',
        })
      ).toThrow()
    })
  })
})
