/**
 * Client-side rate limiting utilities
 * Prevents abuse by limiting request frequency per endpoint/action
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

/**
 * In-memory storage for rate limit tracking
 * In production, consider using Redis or similar for distributed rate limiting
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Optional identifier (user ID, IP, etc.) */
  identifier?: string
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Number of requests remaining in current window */
  remaining: number
  /** Timestamp when the limit resets (ms since epoch) */
  resetAt: number
  /** Time until reset in milliseconds */
  resetIn: number
}

/**
 * Check if a request is within rate limit
 * Returns information about limit status
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const storageKey = config.identifier ? `${key}:${config.identifier}` : key

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    cleanupExpiredEntries()
  }

  let entry = rateLimitStore.get(storageKey)

  // Create new entry or reset if window expired
  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    }
    rateLimitStore.set(storageKey, entry)
  }

  // Increment request count
  entry.count++

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)
  const resetIn = Math.max(0, entry.resetAt - now)

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    resetIn,
  }
}

/**
 * Reset rate limit for a specific key
 * Useful for testing or manual override
 */
export function resetRateLimit(key: string, identifier?: string): void {
  const storageKey = identifier ? `${key}:${identifier}` : key
  rateLimitStore.delete(storageKey)
}

/**
 * Clear all rate limit entries
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Remove expired entries from storage
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Common rate limit presets
 */
export const RATE_LIMITS = {
  /** Authentication endpoints: 5 requests per 15 minutes */
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
  /** Trigger creation: 10 per hour */
  TRIGGER_CREATE: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
  /** API queries: 100 per minute */
  API_QUERY: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
  /** Form submissions: 20 per 5 minutes */
  FORM_SUBMIT: {
    maxRequests: 20,
    windowMs: 5 * 60 * 1000,
  },
  /** Generic actions: 30 per minute */
  GENERIC: {
    maxRequests: 30,
    windowMs: 60 * 1000,
  },
} as const

/**
 * Server-side rate limit presets for API routes
 */
export const AUTH_RATE_LIMITS = {
  /** Login attempts: 5 per minute */
  login: { maxRequests: 5, windowMs: 60 * 1000 },
  /** Token refresh: 10 per minute */
  refresh: { maxRequests: 10, windowMs: 60 * 1000 },
  /** Code exchange: 5 per minute */
  exchange: { maxRequests: 5, windowMs: 60 * 1000 },
  /** Set tokens: 10 per minute */
  setTokens: { maxRequests: 10, windowMs: 60 * 1000 },
  /** Logout: 10 per minute */
  logout: { maxRequests: 10, windowMs: 60 * 1000 },
} as const

/**
 * Get client IP from request headers (for server-side rate limiting)
 */
export function getClientIp(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Fallback identifier using user agent
  const userAgent = headers.get('user-agent') || 'unknown'
  return `ua:${userAgent.slice(0, 50)}`
}

/**
 * Decorator for rate-limited async functions
 * Throws error if rate limit exceeded
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic function wrapper requires any for type inference
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  key: string,
  config: RateLimitConfig
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = checkRateLimit(key, config)

    if (!result.allowed) {
      const error = new Error('Rate limit exceeded. Please try again later.')
      Object.assign(error, {
        name: 'RateLimitError',
        resetAt: result.resetAt,
        resetIn: result.resetIn,
      })
      throw error
    }

    return fn(...args) as ReturnType<T>
  }) as T
}

/**
 * Custom error type for rate limit violations
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly resetAt: number,
    public readonly resetIn: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }

  get resetInSeconds(): number {
    return Math.ceil(this.resetIn / 1000)
  }

  get resetInMinutes(): number {
    return Math.ceil(this.resetIn / 60000)
  }
}

/**
 * Check rate limit and throw if exceeded
 */
export function enforceRateLimit(key: string, config: RateLimitConfig): void {
  const result = checkRateLimit(key, config)

  if (!result.allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Please try again in ${Math.ceil(result.resetIn / 1000)} seconds.`,
      result.resetAt,
      result.resetIn
    )
  }
}
