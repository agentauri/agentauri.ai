import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api-client'
import {
  AppError,
  ERROR_CODES,
  getUserFriendlyMessage,
  handleError,
  logError,
  normalizeError,
  retryWithBackoff,
} from '../error-handler'
import { RateLimitError } from '../rate-limit'

describe('error-handler', () => {
  describe('AppError', () => {
    it('should create error with code and message', () => {
      const error = new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid input', 400)

      expect(error.name).toBe('AppError')
      expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR)
      expect(error.message).toBe('Invalid input')
      expect(error.status).toBe(400)
    })

    it('should identify retryable errors', () => {
      const networkError = new AppError(ERROR_CODES.NETWORK_ERROR, 'Network failed')
      expect(networkError.isRetryable).toBe(true)

      const serverError = new AppError(ERROR_CODES.INTERNAL_ERROR, 'Server error', 500)
      expect(serverError.isRetryable).toBe(true)

      const validationError = new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid', 400)
      expect(validationError.isRetryable).toBe(false)
    })

    it('should identify client errors', () => {
      const clientError = new AppError(ERROR_CODES.VALIDATION_ERROR, 'Bad input', 400)
      expect(clientError.isClientError).toBe(true)

      const serverError = new AppError(ERROR_CODES.INTERNAL_ERROR, 'Server issue', 500)
      expect(serverError.isClientError).toBe(false)
    })

    it('should serialize to JSON', () => {
      const error = new AppError(ERROR_CODES.NOT_FOUND, 'Resource not found', 404, {
        resource: 'trigger',
      })

      const json = error.toJSON()
      expect(json).toEqual({
        name: 'AppError',
        code: ERROR_CODES.NOT_FOUND,
        message: 'Resource not found',
        status: 404,
        details: { resource: 'trigger' },
      })
    })
  })

  describe('normalizeError', () => {
    it('should return AppError as-is', () => {
      const appError = new AppError(ERROR_CODES.VALIDATION_ERROR, 'Test')
      const normalized = normalizeError(appError)

      expect(normalized).toBe(appError)
    })

    it('should convert ApiError to AppError', () => {
      const apiError = new ApiError(404, 'Not found')
      const normalized = normalizeError(apiError)

      expect(normalized).toBeInstanceOf(AppError)
      expect(normalized.code).toBe(ERROR_CODES.NOT_FOUND)
      expect(normalized.status).toBe(404)
    })

    it('should handle ApiError with different status codes', () => {
      const unauthorized = normalizeError(new ApiError(401, 'Unauthorized'))
      expect(unauthorized.code).toBe(ERROR_CODES.UNAUTHORIZED)

      const forbidden = normalizeError(new ApiError(403, 'Forbidden'))
      expect(forbidden.code).toBe(ERROR_CODES.FORBIDDEN)

      const rateLimited = normalizeError(new ApiError(429, 'Too many requests'))
      expect(rateLimited.code).toBe(ERROR_CODES.RATE_LIMIT_EXCEEDED)

      const serverError = normalizeError(new ApiError(500, 'Internal server error'))
      expect(serverError.code).toBe(ERROR_CODES.INTERNAL_ERROR)
    })

    it('should convert RateLimitError to AppError', () => {
      const rateLimitError = new RateLimitError('Rate limit exceeded', Date.now() + 1000, 1000)
      const normalized = normalizeError(rateLimitError)

      expect(normalized).toBeInstanceOf(AppError)
      expect(normalized.code).toBe(ERROR_CODES.RATE_LIMIT_EXCEEDED)
      expect(normalized.status).toBe(429)
    })

    it('should detect timeout errors from message', () => {
      const timeoutError = new Error('Request timeout')
      const normalized = normalizeError(timeoutError)

      expect(normalized.code).toBe(ERROR_CODES.TIMEOUT)
    })

    it('should detect network errors from message', () => {
      const networkError = new Error('Network connection failed')
      const normalized = normalizeError(networkError)

      expect(normalized.code).toBe(ERROR_CODES.NETWORK_ERROR)
    })

    it('should handle unknown error types', () => {
      const normalized = normalizeError('string error')

      expect(normalized).toBeInstanceOf(AppError)
      expect(normalized.code).toBe(ERROR_CODES.INTERNAL_ERROR)
      expect(normalized.message).toBe('An unexpected error occurred')
    })
  })

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for each error code', () => {
      const unauthorized = new AppError(ERROR_CODES.UNAUTHORIZED, 'Auth failed')
      expect(getUserFriendlyMessage(unauthorized)).toBe('Please log in to continue')

      const notFound = new AppError(ERROR_CODES.NOT_FOUND, 'Resource missing')
      expect(getUserFriendlyMessage(notFound)).toBe('The requested resource was not found')

      const validation = new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid data')
      expect(getUserFriendlyMessage(validation)).toBe('Please check your input and try again')
    })

    it('should fallback to sanitized error message', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Intentionally testing unknown error code fallback
      const customError = new AppError('CUSTOM_CODE' as any, 'Custom error message')
      const message = getUserFriendlyMessage(customError)
      expect(message).toBeTruthy()
    })
  })

  describe('logError', () => {
    it('should log error in development', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const originalEnv = process.env.NODE_ENV

      ;(process.env as { NODE_ENV: string }).NODE_ENV = 'development'

      const error = new AppError(ERROR_CODES.VALIDATION_ERROR, 'Test error', 400)
      logError(error, { userId: '123' })

      expect(consoleSpy).toHaveBeenCalled()

      ;(process.env as { NODE_ENV: string }).NODE_ENV = originalEnv
      consoleSpy.mockRestore()
    })

    it('should log minimal info in production', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const originalEnv = process.env.NODE_ENV

      ;(process.env as { NODE_ENV: string }).NODE_ENV = 'production'

      const error = new AppError(ERROR_CODES.INTERNAL_ERROR, 'Server error')
      logError(error)

      expect(consoleSpy).toHaveBeenCalledWith('Error:', ERROR_CODES.INTERNAL_ERROR, 'Server error')

      ;(process.env as { NODE_ENV: string }).NODE_ENV = originalEnv
      consoleSpy.mockRestore()
    })
  })

  describe('handleError', () => {
    it('should normalize and return user-friendly message', () => {
      const apiError = new ApiError(404, 'Resource not found')
      const message = handleError(apiError, { log: false })

      expect(message).toBe('The requested resource was not found')
    })

    it('should log error when log option is true', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const error = new Error('Test error')
      handleError(error, { log: true, context: { action: 'test' } })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should not log when log option is false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const error = new Error('Test error')
      handleError(error, { log: false })

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('retryWithBackoff', () => {
    it('should succeed on first try if no error', async () => {
      const fn = vi.fn(async () => 'success')
      const result = await retryWithBackoff(fn)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on retryable errors', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce('success')

      const result = await retryWithBackoff(fn, { maxRetries: 3, initialDelay: 10 })

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should not retry non-retryable errors', async () => {
      const fn = vi.fn().mockRejectedValue(new ApiError(400, 'Bad request'))

      await expect(retryWithBackoff(fn, { maxRetries: 3 })).rejects.toThrow()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should throw after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(retryWithBackoff(fn, { maxRetries: 2, initialDelay: 10 })).rejects.toThrow(
        'Network error'
      )
      expect(fn).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('should use custom shouldRetry function', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Custom error'))

      const shouldRetry = vi.fn(() => false)

      await expect(
        retryWithBackoff(fn, { maxRetries: 3, shouldRetry })
      ).rejects.toThrow()

      expect(fn).toHaveBeenCalledTimes(1)
      expect(shouldRetry).toHaveBeenCalled()
    })
  })

  describe('ERROR_CODES', () => {
    it('should have all expected error codes', () => {
      expect(ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED')
      expect(ERROR_CODES.FORBIDDEN).toBe('FORBIDDEN')
      expect(ERROR_CODES.NOT_FOUND).toBe('NOT_FOUND')
      expect(ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR')
      expect(ERROR_CODES.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED')
      expect(ERROR_CODES.INTERNAL_ERROR).toBe('INTERNAL_ERROR')
      expect(ERROR_CODES.NETWORK_ERROR).toBe('NETWORK_ERROR')
      expect(ERROR_CODES.TIMEOUT).toBe('TIMEOUT')
    })
  })
})
