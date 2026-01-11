import { z } from 'zod'
import { apiClient } from '@/lib/api-client'

/**
 * Health status response schema
 *
 * Validates the structure of API health check responses.
 * Backend may use different status indicators for services.
 */
export const healthStatusSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.string().optional(),
  // Backend may return 'connected'/'disconnected' or 'up'/'down'
  database: z.string().optional(),
  services: z.object({
    database: z.enum(['up', 'down', 'connected', 'disconnected']).optional(),
    indexer: z.enum(['up', 'down', 'connected', 'disconnected']).optional(),
    cache: z.enum(['up', 'down', 'connected', 'disconnected']).optional(),
  }).optional(),
  version: z.string().optional(),
})

/**
 * Health status type
 *
 * Represents the current status of the API and its services.
 */
export type HealthStatus = z.infer<typeof healthStatusSchema>

/**
 * Health check error with original cause
 *
 * Thrown when a health check fails. Contains the original error
 * as cause for debugging purposes.
 *
 * @example
 * ```ts
 * try {
 *   await healthApi.getStatus()
 * } catch (error) {
 *   if (error instanceof HealthCheckError) {
 *     console.error('Health check failed:', error.cause)
 *   }
 * }
 * ```
 */
export class HealthCheckError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'HealthCheckError'
  }
}

/**
 * Health API client for monitoring API availability
 *
 * Provides health check endpoints for monitoring the API status.
 * Use getStatus() when you need to throw on failure, or getStatusSafe()
 * when you need a fallback for UI display.
 *
 * @see https://docs.agentauri.ai/api/health
 */
export const healthApi = {
  /**
   * Get API health status
   *
   * Retrieves the current health status of the API and its services.
   * Throws HealthCheckError if the check fails.
   *
   * @returns Health status including service states
   * @throws {HealthCheckError} When health check fails (API unavailable)
   *
   * @example
   * ```ts
   * try {
   *   const health = await healthApi.getStatus()
   *   console.log(`API status: ${health.status}`)
   *   console.log(`Database: ${health.services?.database}`)
   * } catch (error) {
   *   if (error instanceof HealthCheckError) {
   *     // Handle API unavailability
   *   }
   * }
   * ```
   */
  async getStatus(): Promise<HealthStatus> {
    try {
      const data = await apiClient.get<HealthStatus>('/health')
      return healthStatusSchema.parse(data)
    } catch (error) {
      // Log the actual error for debugging
      console.error('[Health API] Health check failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })

      // Throw a typed error so callers can handle it appropriately
      throw new HealthCheckError(
        'Health check failed - API may be unavailable',
        error
      )
    }
  },

  /**
   * Get API health status with fallback
   *
   * Retrieves health status without throwing on failure.
   * Returns an unhealthy status if the check fails.
   * Useful for UI components that need to display status
   * without error handling.
   *
   * @returns Health status (never throws)
   *
   * @example
   * ```ts
   * // Safe to use in React components without try/catch
   * const health = await healthApi.getStatusSafe()
   * const isOnline = health.status === 'healthy'
   *
   * return <StatusBadge online={isOnline} />
   * ```
   */
  async getStatusSafe(): Promise<HealthStatus> {
    try {
      return await this.getStatus()
    } catch (error) {
      // Return unhealthy status with error context for UI display
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        // Include error info in services for debugging
        services: {
          database: 'down',
          indexer: 'down',
          cache: 'down',
        },
      }
    }
  },
}
