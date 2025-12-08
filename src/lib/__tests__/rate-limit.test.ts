import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  RATE_LIMITS,
  RateLimitError,
  checkRateLimit,
  clearAllRateLimits,
  enforceRateLimit,
  resetRateLimit,
  withRateLimit,
} from '../rate-limit'

describe('rate-limit', () => {
  beforeEach(() => {
    clearAllRateLimits()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const result1 = checkRateLimit('test', { maxRequests: 3, windowMs: 1000 })
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(2)

      const result2 = checkRateLimit('test', { maxRequests: 3, windowMs: 1000 })
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(1)

      const result3 = checkRateLimit('test', { maxRequests: 3, windowMs: 1000 })
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('should block requests exceeding limit', () => {
      checkRateLimit('test', { maxRequests: 2, windowMs: 1000 })
      checkRateLimit('test', { maxRequests: 2, windowMs: 1000 })

      const result = checkRateLimit('test', { maxRequests: 2, windowMs: 1000 })
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      checkRateLimit('test', { maxRequests: 2, windowMs: 1000 })
      checkRateLimit('test', { maxRequests: 2, windowMs: 1000 })
      checkRateLimit('test', { maxRequests: 2, windowMs: 1000 }) // Exceeds

      // Advance time past window
      vi.advanceTimersByTime(1001)

      const result = checkRateLimit('test', { maxRequests: 2, windowMs: 1000 })
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('should track different keys separately', () => {
      checkRateLimit('key1', { maxRequests: 1, windowMs: 1000 })
      const result1 = checkRateLimit('key1', { maxRequests: 1, windowMs: 1000 })
      expect(result1.allowed).toBe(false)

      const result2 = checkRateLimit('key2', { maxRequests: 1, windowMs: 1000 })
      expect(result2.allowed).toBe(true)
    })

    it('should support identifier for per-user limits', () => {
      const config = { maxRequests: 2, windowMs: 1000, identifier: 'user1' }

      checkRateLimit('action', config)
      checkRateLimit('action', config)
      const result = checkRateLimit('action', config)
      expect(result.allowed).toBe(false)

      // Different user should have separate limit
      const config2 = { maxRequests: 2, windowMs: 1000, identifier: 'user2' }
      const result2 = checkRateLimit('action', config2)
      expect(result2.allowed).toBe(true)
    })

    it('should return correct resetAt timestamp', () => {
      const now = Date.now()
      const result = checkRateLimit('test', { maxRequests: 5, windowMs: 1000 })

      expect(result.resetAt).toBeGreaterThanOrEqual(now + 1000)
      expect(result.resetIn).toBeGreaterThan(0)
      expect(result.resetIn).toBeLessThanOrEqual(1000)
    })
  })

  describe('resetRateLimit', () => {
    it('should reset limit for specific key', () => {
      checkRateLimit('test', { maxRequests: 1, windowMs: 1000 })
      checkRateLimit('test', { maxRequests: 1, windowMs: 1000 })

      resetRateLimit('test')

      const result = checkRateLimit('test', { maxRequests: 1, windowMs: 1000 })
      expect(result.allowed).toBe(true)
    })

    it('should support identifier in reset', () => {
      const config = { maxRequests: 1, windowMs: 1000, identifier: 'user1' }
      checkRateLimit('action', config)
      checkRateLimit('action', config)

      resetRateLimit('action', 'user1')

      const result = checkRateLimit('action', config)
      expect(result.allowed).toBe(true)
    })
  })

  describe('clearAllRateLimits', () => {
    it('should clear all limits', () => {
      checkRateLimit('key1', { maxRequests: 1, windowMs: 1000 })
      checkRateLimit('key1', { maxRequests: 1, windowMs: 1000 })
      checkRateLimit('key2', { maxRequests: 1, windowMs: 1000 })
      checkRateLimit('key2', { maxRequests: 1, windowMs: 1000 })

      clearAllRateLimits()

      expect(checkRateLimit('key1', { maxRequests: 1, windowMs: 1000 }).allowed).toBe(true)
      expect(checkRateLimit('key2', { maxRequests: 1, windowMs: 1000 }).allowed).toBe(true)
    })
  })

  describe('enforceRateLimit', () => {
    it('should not throw when within limit', () => {
      expect(() => {
        enforceRateLimit('test', { maxRequests: 5, windowMs: 1000 })
      }).not.toThrow()
    })

    it('should throw RateLimitError when exceeded', () => {
      enforceRateLimit('test', { maxRequests: 1, windowMs: 1000 })

      expect(() => {
        enforceRateLimit('test', { maxRequests: 1, windowMs: 1000 })
      }).toThrow(RateLimitError)
    })
  })

  describe('RateLimitError', () => {
    it('should have correct properties', () => {
      const resetAt = Date.now() + 60000
      const resetIn = 60000
      const error = new RateLimitError('Rate limit exceeded', resetAt, resetIn)

      expect(error.name).toBe('RateLimitError')
      expect(error.message).toContain('Rate limit exceeded')
      expect(error.resetAt).toBe(resetAt)
      expect(error.resetIn).toBe(resetIn)
    })

    it('should calculate resetInSeconds correctly', () => {
      const error = new RateLimitError('Test', Date.now() + 5000, 5000)
      expect(error.resetInSeconds).toBe(5)
    })

    it('should calculate resetInMinutes correctly', () => {
      const error = new RateLimitError('Test', Date.now() + 120000, 120000)
      expect(error.resetInMinutes).toBe(2)
    })
  })

  describe('withRateLimit', () => {
    it('should allow function execution within limit', async () => {
      const fn = vi.fn(async () => 'success')
      const limited = withRateLimit(fn, 'test', { maxRequests: 2, windowMs: 1000 })

      await expect(limited()).resolves.toBe('success')
      await expect(limited()).resolves.toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should throw when limit exceeded', async () => {
      const fn = vi.fn(async () => 'success')
      const limited = withRateLimit(fn, 'test', { maxRequests: 1, windowMs: 1000 })

      await limited()
      await expect(limited()).rejects.toThrow('Rate limit exceeded')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to wrapped function', async () => {
      const fn = vi.fn(async (a: number, b: number) => a + b)
      const limited = withRateLimit(fn, 'test', { maxRequests: 5, windowMs: 1000 })

      const result = await limited(2, 3)
      expect(result).toBe(5)
      expect(fn).toHaveBeenCalledWith(2, 3)
    })
  })

  describe('RATE_LIMITS presets', () => {
    it('should have AUTH preset', () => {
      expect(RATE_LIMITS.AUTH).toEqual({
        maxRequests: 5,
        windowMs: 15 * 60 * 1000,
      })
    })

    it('should have TRIGGER_CREATE preset', () => {
      expect(RATE_LIMITS.TRIGGER_CREATE).toEqual({
        maxRequests: 10,
        windowMs: 60 * 60 * 1000,
      })
    })

    it('should have API_QUERY preset', () => {
      expect(RATE_LIMITS.API_QUERY).toEqual({
        maxRequests: 100,
        windowMs: 60 * 1000,
      })
    })

    it('should have FORM_SUBMIT preset', () => {
      expect(RATE_LIMITS.FORM_SUBMIT).toEqual({
        maxRequests: 20,
        windowMs: 5 * 60 * 1000,
      })
    })

    it('should have GENERIC preset', () => {
      expect(RATE_LIMITS.GENERIC).toEqual({
        maxRequests: 30,
        windowMs: 60 * 1000,
      })
    })
  })
})
