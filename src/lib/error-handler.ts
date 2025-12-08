/**
 * Enhanced error handling utilities
 * Provides consistent error formatting, logging, and user-friendly messages
 */

import { ApiError } from './api-client'
import { RateLimitError } from './rate-limit'
import { sanitizeErrorMessage } from './sanitize'

/**
 * Standard error codes for the application
 */
export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  REQUEST_FAILED: 'REQUEST_FAILED',

  // Business Logic
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  TRIGGER_LIMIT_EXCEEDED: 'TRIGGER_LIMIT_EXCEEDED',
  INVALID_WEBHOOK_URL: 'INVALID_WEBHOOK_URL',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

/**
 * Application error with structured data
 */
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }

  /**
   * Get user-friendly error message
   */
  get userMessage(): string {
    return sanitizeErrorMessage(this.message)
  }

  /**
   * Check if error should be retried
   */
  get isRetryable(): boolean {
    return (
      this.code === ERROR_CODES.NETWORK_ERROR ||
      this.code === ERROR_CODES.TIMEOUT ||
      this.code === ERROR_CODES.SERVICE_UNAVAILABLE ||
      (this.status !== undefined && this.status >= 500)
    )
  }

  /**
   * Check if error is client-side
   */
  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500
  }

  /**
   * Convert to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    }
  }
}

/**
 * Convert various error types to AppError
 */
export function normalizeError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error
  }

  // API Error
  if (error instanceof ApiError) {
    let code: ErrorCode = ERROR_CODES.REQUEST_FAILED

    if (error.isUnauthorized) {
      code = ERROR_CODES.UNAUTHORIZED
    } else if (error.isForbidden) {
      code = ERROR_CODES.FORBIDDEN
    } else if (error.isNotFound) {
      code = ERROR_CODES.NOT_FOUND
    } else if (error.isRateLimited) {
      code = ERROR_CODES.RATE_LIMIT_EXCEEDED
    } else if (error.isServerError) {
      code = ERROR_CODES.INTERNAL_ERROR
    }

    return new AppError(code, error.message, error.status, error.data)
  }

  // Rate Limit Error
  if (error instanceof RateLimitError) {
    return new AppError(ERROR_CODES.RATE_LIMIT_EXCEEDED, error.message, 429, {
      resetAt: error.resetAt,
      resetIn: error.resetIn,
    })
  }

  // Standard Error
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return new AppError(ERROR_CODES.TIMEOUT, error.message)
    }

    if (error.message.includes('network') || error.message.includes('Network')) {
      return new AppError(ERROR_CODES.NETWORK_ERROR, error.message)
    }

    return new AppError(ERROR_CODES.INTERNAL_ERROR, error.message)
  }

  // Unknown error type
  return new AppError(ERROR_CODES.INTERNAL_ERROR, 'An unexpected error occurred')
}

/**
 * Get user-friendly error message based on error code
 */
export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<ErrorCode, string> = {
    [ERROR_CODES.UNAUTHORIZED]: 'Please log in to continue',
    [ERROR_CODES.FORBIDDEN]: "You don't have permission to perform this action",
    [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
    [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password',
    [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again',
    [ERROR_CODES.INVALID_INPUT]: 'The information provided is invalid',
    [ERROR_CODES.DUPLICATE_ENTRY]: 'This item already exists',
    [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found',
    [ERROR_CODES.RESOURCE_CONFLICT]: 'This operation conflicts with existing data',
    [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
    [ERROR_CODES.INTERNAL_ERROR]: 'Something went wrong. Please try again',
    [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later',
    [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again',
    [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection',
    [ERROR_CODES.REQUEST_FAILED]: 'Request failed. Please try again',
    [ERROR_CODES.INSUFFICIENT_CREDITS]: 'Insufficient credits. Please purchase more credits',
    [ERROR_CODES.TRIGGER_LIMIT_EXCEEDED]: 'You have reached the maximum number of triggers',
    [ERROR_CODES.INVALID_WEBHOOK_URL]: 'Invalid webhook URL provided',
  }

  return messages[error.code] ?? error.userMessage
}

/**
 * Log error to console with structured format
 * In production, this should send to error tracking service
 */
export function logError(error: AppError, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', {
      code: error.code,
      message: error.message,
      status: error.status,
      details: error.details,
      context,
      stack: error.stack,
    })
  } else {
    // In production, send to error tracking service (Sentry, etc.)
    console.error('Error:', error.code, error.message)
  }
}

/**
 * Handle error and return user-friendly message
 * Optionally logs the error
 */
export function handleError(
  error: unknown,
  options: {
    log?: boolean
    context?: Record<string, unknown>
  } = {}
): string {
  const { log = true, context } = options

  const appError = normalizeError(error)

  if (log) {
    logError(appError, context)
  }

  return getUserFriendlyMessage(appError)
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    shouldRetry?: (error: AppError) => boolean
  } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000, shouldRetry } = options

  let lastError: AppError | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = normalizeError(error)

      // Don't retry if not retryable
      if (shouldRetry && !shouldRetry(lastError)) {
        throw lastError
      }

      if (!lastError.isRetryable) {
        throw lastError
      }

      // Last attempt failed
      if (attempt === maxRetries) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * 2 ** attempt, maxDelay)

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.3 * delay
      await new Promise((resolve) => setTimeout(resolve, delay + jitter))
    }
  }

  // This should never happen, but TypeScript needs it
  throw lastError ?? new AppError(ERROR_CODES.INTERNAL_ERROR, 'Retry failed')
}
