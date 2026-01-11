/**
 * API type definitions
 *
 * Standard response wrappers and common parameter types
 * used across all API endpoints.
 *
 * @module types/api
 *
 * @example
 * ```ts
 * // Using ApiResponse wrapper
 * const response: ApiResponse<User> = await api.get('/users/me')
 * console.log(response.data.username)
 *
 * // Using PaginatedResponse
 * const users: PaginatedResponse<User> = await api.get('/users', { limit: 10 })
 * console.log(`Showing ${users.data.length} of ${users.pagination.total}`)
 * ```
 */

// ============================================================================
// Response Types
// ============================================================================

/**
 * Standard API response wrapper
 *
 * Wraps successful API responses with optional message.
 *
 * @template T - The type of the response data
 *
 * @example
 * ```ts
 * interface UserResponse extends ApiResponse<User> {}
 * const response: UserResponse = { data: user, message: 'User retrieved' }
 * ```
 */
export interface ApiResponse<T> {
  /** Response payload */
  data: T
  /** Optional success message */
  message?: string
}

/**
 * Paginated API response
 *
 * Used for list endpoints that support pagination.
 * Includes pagination metadata for navigation.
 *
 * @template T - The type of items in the response array
 *
 * @example
 * ```ts
 * const agents: PaginatedResponse<LinkedAgent> = await api.get('/agents', {
 *   limit: 20,
 *   offset: 0
 * })
 * if (agents.pagination.hasMore) {
 *   // Load more...
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  /** Array of response items */
  data: T[]
  /** Pagination metadata */
  pagination: {
    /** Total number of items available */
    total: number
    /** Maximum items per page */
    limit: number
    /** Number of items skipped */
    offset: number
    /** Whether more items are available */
    hasMore: boolean
  }
}

/**
 * API error response
 *
 * Standard error format returned by the API
 * when a request fails.
 *
 * @example
 * ```ts
 * try {
 *   await api.post('/triggers', data)
 * } catch (error) {
 *   const apiError = error as ApiErrorResponse
 *   console.error(`${apiError.error.code}: ${apiError.error.message}`)
 * }
 * ```
 */
export interface ApiErrorResponse {
  /** Error details */
  error: {
    /** Machine-readable error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND') */
    code: string
    /** Human-readable error message */
    message: string
    /** Additional error context (validation errors, etc.) */
    details?: unknown
  }
}

// ============================================================================
// Request Parameters
// ============================================================================

/**
 * Pagination parameters
 *
 * Common parameters for paginated list endpoints.
 * Supports additional custom query parameters via index signature.
 *
 * @example
 * ```ts
 * const params: PaginationParams = {
 *   limit: 25,
 *   offset: 50,
 *   chainId: 1
 * }
 * ```
 */
export interface PaginationParams {
  /** Maximum number of items to return (default varies by endpoint) */
  limit?: number
  /** Number of items to skip for pagination */
  offset?: number
  /** Allow additional query parameters */
  [key: string]: string | number | boolean | undefined
}

/**
 * Sort parameters
 *
 * Common parameters for sortable list endpoints.
 *
 * @example
 * ```ts
 * const params: SortParams = {
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * }
 * ```
 */
export interface SortParams {
  /** Field name to sort by */
  sortBy?: string
  /** Sort direction */
  sortOrder?: 'asc' | 'desc'
}

/**
 * Common filter parameters
 *
 * Standard filters available on most list endpoints.
 *
 * @example
 * ```ts
 * const params: FilterParams = {
 *   search: 'my-agent',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * }
 * ```
 */
export interface FilterParams {
  /** Full-text search query */
  search?: string
  /** Filter by start date (ISO 8601 format) */
  startDate?: string
  /** Filter by end date (ISO 8601 format) */
  endDate?: string
}
