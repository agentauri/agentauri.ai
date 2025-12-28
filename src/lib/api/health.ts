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
 * Health API client
 */
export const healthApi = {
  /**
   * Get API health status
   */
  async getStatus(): Promise<HealthStatus> {
    try {
      const data = await apiClient.get<HealthStatus>('/health')
      return healthStatusSchema.parse(data)
    } catch {
      // If health check fails, return unhealthy status
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      }
    }
  },
}
