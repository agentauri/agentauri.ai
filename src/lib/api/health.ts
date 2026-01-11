import { z } from 'zod'
import { apiClient } from '@/lib/api-client'

/**
 * Health status response schema
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

export type HealthStatus = z.infer<typeof healthStatusSchema>

/**
 * Health check error with original cause
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
 * Health API client
 */
export const healthApi = {
  /**
   * Get API health status
   * @throws {HealthCheckError} When health check fails - callers should handle this appropriately
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
   * Get API health status with fallback for UI display
   * Use this when you need a status to display but don't want to throw
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
