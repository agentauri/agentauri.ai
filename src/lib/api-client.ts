import { API_BASE_URL, API_VERSION } from './constants'
import { handleSessionExpired } from './auth-utils'

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
  timeout?: number
  skipRefresh?: boolean // Flag to prevent infinite refresh loops
}

interface ApiErrorData {
  message: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: ApiErrorData
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  get isServerError(): boolean {
    return this.status >= 500
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }
}

/**
 * CSRF token management
 * Token is fetched from the server and cached in memory
 */
let csrfToken: string | null = null
let csrfFetchAttempts = 0
const MAX_CSRF_FETCH_ATTEMPTS = 3

async function fetchCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken

  // Prevent excessive retry attempts
  if (csrfFetchAttempts >= MAX_CSRF_FETCH_ATTEMPTS) {
    console.warn('[CSRF] Max fetch attempts reached, skipping CSRF protection')
    return null
  }

  csrfFetchAttempts++

  try {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      csrfToken = data.token ?? null
      csrfFetchAttempts = 0 // Reset on success
      return csrfToken
    }

    // Log specific failure reason
    console.warn('[CSRF] Token fetch failed:', {
      status: response.status,
      attempt: csrfFetchAttempts,
    })
  } catch (error) {
    // Network error during CSRF fetch
    console.error('[CSRF] Token fetch error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      attempt: csrfFetchAttempts,
    })
  }

  return null
}

/**
 * Reset CSRF fetch attempts (call after successful auth)
 */
export function resetCsrfFetchAttempts(): void {
  csrfFetchAttempts = 0
}

/**
 * Clear cached CSRF token (call on logout)
 */
export function clearCsrfToken(): void {
  csrfToken = null
}

/**
 * Token refresh state to prevent concurrent refresh attempts
 * Uses mutex pattern to ensure only one refresh happens at a time
 */
let refreshPromise: Promise<boolean> | null = null

/**
 * Attempt to refresh the access token
 * Uses the refresh token stored in httpOnly cookie
 * Returns true if refresh succeeded, false otherwise
 *
 * This function implements a mutex pattern:
 * - If a refresh is already in progress, all callers wait on the same promise
 * - Only one actual refresh request is made regardless of concurrent calls
 */
async function attemptTokenRefresh(): Promise<boolean> {
  // If already refreshing, wait for the existing refresh to complete
  // This prevents race conditions when multiple requests fail simultaneously
  if (refreshPromise) {
    console.debug('[Auth] Token refresh already in progress, waiting...')
    return refreshPromise
  }

  console.debug('[Auth] Starting token refresh...')

  // Create the refresh promise - all concurrent callers will share this
  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        console.debug('[Auth] Token refresh successful')
        return true
      }

      // Log the failure reason for debugging
      const errorData = await response.json().catch(() => ({}))
      console.warn('[Auth] Token refresh failed:', {
        status: response.status,
        code: errorData.code ?? 'UNKNOWN',
        message: errorData.error ?? 'Token refresh rejected',
      })
      return false
    } catch (error) {
      // Network or other errors during refresh
      console.error('[Auth] Token refresh error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return false
    }
  })()

  try {
    return await refreshPromise
  } finally {
    // Clear the promise after completion so future refreshes can proceed
    // This is safe because all waiters have already received their result
    refreshPromise = null
  }
}

function buildUrl(endpoint: string, params?: ApiRequestOptions['params']): string {
  const path = `/api/${API_VERSION}${endpoint}`

  // Handle both absolute URLs (production) and relative URLs (dev proxy)
  if (!API_BASE_URL) {
    // Relative URL for Next.js proxy
    if (!params || Object.keys(params).length === 0) {
      return path
    }
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    }
    return `${path}?${searchParams.toString()}`
  }

  // Absolute URL for production
  const url = new URL(path, API_BASE_URL)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

/**
 * Type guard to check if value is a valid JSON object
 */
function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Parse JSON response safely with type checking
 */
async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    return null
  }

  const data: unknown = await response.json()
  return data as T
}

async function request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { params, body, timeout = 30000, skipRefresh = false, headers: customHeaders, ...fetchOptions } = options

  const url = buildUrl(endpoint, params)
  const headers = new Headers(customHeaders)

  // Set default headers
  if (!headers.has('Content-Type') && body) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('Accept', 'application/json')

  // Note: We no longer set Authorization header from client-readable cookie
  // The httpOnly cookie is sent automatically via credentials: 'include'
  // The backend reads the token from the cookie

  // Add CSRF token for state-changing requests
  const method = fetchOptions.method ?? 'GET'
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await fetchCsrfToken()
    if (token) {
      headers.set('X-CSRF-Token', token)
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: 'include', // Send cookies for httpOnly auth tokens
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorData: ApiErrorData | undefined
      try {
        const parsed = await parseJsonResponse<unknown>(response)
        if (isJsonObject(parsed) && typeof parsed.message === 'string') {
          errorData = {
            message: parsed.message,
            code: typeof parsed.code === 'string' ? parsed.code : undefined,
            details: parsed.details,
          }
        }
      } catch {
        // Response body might not be JSON
      }

      // Clear CSRF token on 403 (might be expired)
      if (response.status === 403) {
        clearCsrfToken()
      }

      // Handle 401 (token expired) - attempt refresh before logout
      if (response.status === 401) {
        const isAuthEndpoint = endpoint.startsWith('/auth/')

        if (!isAuthEndpoint && !skipRefresh) {
          // Try to refresh the token
          const refreshed = await attemptTokenRefresh()

          if (refreshed) {
            // Retry the original request with the new token
            return request<T>(endpoint, { ...options, skipRefresh: true })
          }

          // Refresh failed - session is truly expired
          handleSessionExpired()
        }
      }

      throw new ApiError(
        response.status,
        errorData?.message ?? `Request failed with status ${response.status}`,
        errorData
      )
    }

    // Handle empty responses - return null instead of unsafe cast
    const data = await parseJsonResponse<T>(response)
    if (data === null) {
      // For void/empty responses, caller should handle this
      return undefined as unknown as T
    }

    return data
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(0, 'Request timed out')
    }

    throw new ApiError(0, error instanceof Error ? error.message : 'Network error')
  }
}

export const apiClient = {
  get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'body'>) {
    return request<T>(endpoint, { ...options, method: 'GET' })
  },

  post<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>) {
    return request<T>(endpoint, { ...options, method: 'POST', body })
  },

  put<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PUT', body })
  },

  patch<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PATCH', body })
  },

  delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'body'>) {
    return request<T>(endpoint, { ...options, method: 'DELETE' })
  },
}
