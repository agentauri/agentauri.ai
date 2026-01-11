'use client'

import { useQuery } from '@tanstack/react-query'
import { healthApi, type HealthStatus } from '@/lib/api/health'

/**
 * Query key for health status
 */
const healthQueryKey = ['health', 'status'] as const

/**
 * Hook for checking API health status
 * Polls every 30 seconds to keep status updated
 *
 * Uses getStatusSafe() which returns unhealthy status on error
 * instead of throwing, making it safe for UI display
 */
export function useHealthStatus() {
  return useQuery<HealthStatus>({
    queryKey: healthQueryKey,
    queryFn: () => healthApi.getStatusSafe(),
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    refetchOnWindowFocus: true,
    retry: false, // Don't retry on failure - getStatusSafe handles errors gracefully
  })
}
