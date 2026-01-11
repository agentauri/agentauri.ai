/**
 * ApiErrorDisplay
 *
 * Displays API error messages with HTTP status code handling and user-friendly hints.
 * Provides contextual information for common HTTP errors (400, 401, 403, 404, 500, etc.).
 *
 * @module components/molecules/ApiErrorDisplay
 *
 * @example
 * ```tsx
 * <ApiErrorDisplay
 *   error={apiError}
 *   title="Failed to load agents"
 * />
 * ```
 */

'use client'

import { Box } from '@/components/atoms/box'
import { Icon } from '@/components/atoms/icon'
import { ApiError } from '@/lib/api-client'

/** Human-readable descriptions and hints for common HTTP status codes */
const HTTP_STATUS_DESCRIPTIONS: Record<number, { name: string; hint: string }> = {
  0: { name: 'Network Error', hint: 'Check your internet connection' },
  400: { name: 'Bad Request', hint: 'Invalid request parameters' },
  401: { name: 'Unauthorized', hint: 'Please log in again' },
  403: { name: 'Forbidden', hint: 'You do not have permission' },
  404: { name: 'Not Found', hint: 'The requested resource does not exist' },
  408: { name: 'Request Timeout', hint: 'The request took too long' },
  429: { name: 'Too Many Requests', hint: 'Please wait before trying again' },
  500: { name: 'Internal Server Error', hint: 'Server error, try again later' },
  502: { name: 'Bad Gateway', hint: 'Backend service unavailable' },
  503: { name: 'Service Unavailable', hint: 'Backend service is not running' },
  504: { name: 'Gateway Timeout', hint: 'Backend service timed out' },
}

/**
 * Returns status name and hint for a given HTTP status code.
 */
function getStatusInfo(status: number): { name: string; hint: string } {
  return HTTP_STATUS_DESCRIPTIONS[status] ?? { name: `Error ${status}`, hint: 'An unexpected error occurred' }
}

/** Props for the ApiErrorDisplay component */
interface ApiErrorDisplayProps {
  error: Error | null
  title: string
  className?: string
}

/**
 * Renders an error box with status code, message, and helpful hints.
 */
export function ApiErrorDisplay({ error, title, className }: ApiErrorDisplayProps) {
  if (!error) return null

  const isApiError = error instanceof ApiError
  const status = isApiError ? error.status : 0
  const statusInfo = getStatusInfo(status)

  // Use backend message if available, otherwise use status hint
  const message = isApiError && error.data?.message
    ? error.data.message
    : error.message.includes('Request failed with status')
      ? `${statusInfo.name} - ${statusInfo.hint}`
      : error.message

  return (
    <Box variant="error" padding="md" className={className}>
      <div className="text-center space-y-2">
        <p className="typo-ui text-destructive flex items-center justify-center gap-2">
          <Icon name="warning" size="sm" />
          {title}
        </p>
        <p className="typo-ui text-destructive/80">
          {status > 0 && (
            <span className="text-destructive font-bold">[{status}] </span>
          )}
          {message}
        </p>
        {isApiError && status >= 500 && (
          <p className="typo-ui text-terminal-dim text-xs mt-2">
            {'>'} Backend service may be down. Contact support if this persists.
          </p>
        )}
      </div>
    </Box>
  )
}
