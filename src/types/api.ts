/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit?: number
  offset?: number
  [key: string]: string | number | boolean | undefined
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Common filter parameters
 */
export interface FilterParams {
  search?: string
  startDate?: string
  endDate?: string
}
