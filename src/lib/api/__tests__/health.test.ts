import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { healthApi, HealthCheckError } from '../health'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('healthApi', () => {
  describe('getStatus', () => {
    it('should return healthy status', async () => {
      const mockHealthy = {
        status: 'healthy',
        timestamp: '2025-01-01T00:00:00Z',
        services: {
          database: 'connected',
          indexer: 'up',
          cache: 'up',
        },
      }

      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json(mockHealthy)
        })
      )

      const result = await healthApi.getStatus()

      expect(result.status).toBe('healthy')
      expect(result.services?.database).toBe('connected')
    })

    it('should return degraded status', async () => {
      const mockDegraded = {
        status: 'degraded',
        timestamp: '2025-01-01T00:00:00Z',
        services: {
          database: 'connected',
          indexer: 'down',
          cache: 'up',
        },
      }

      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json(mockDegraded)
        })
      )

      const result = await healthApi.getStatus()

      expect(result.status).toBe('degraded')
      expect(result.services?.indexer).toBe('down')
    })

    it('should throw HealthCheckError on API error', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json({ error: 'Service unavailable' }, { status: 503 })
        })
      )

      await expect(healthApi.getStatus()).rejects.toThrow(HealthCheckError)
    })

    it('should throw HealthCheckError on network error', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.error()
        })
      )

      await expect(healthApi.getStatus()).rejects.toThrow(HealthCheckError)
    })

    it('should handle minimal response', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json({ status: 'healthy' })
        })
      )

      const result = await healthApi.getStatus()

      expect(result.status).toBe('healthy')
      expect(result.services).toBeUndefined()
    })
  })

  describe('getStatusSafe', () => {
    it('should return unhealthy status on API error without throwing', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json({ error: 'Service unavailable' }, { status: 503 })
        })
      )

      const result = await healthApi.getStatusSafe()

      expect(result.status).toBe('unhealthy')
      expect(result.services?.database).toBe('down')
    })

    it('should return unhealthy status on network error without throwing', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.error()
        })
      )

      const result = await healthApi.getStatusSafe()

      expect(result.status).toBe('unhealthy')
    })

    it('should return healthy status when API responds normally', async () => {
      server.use(
        http.get(`${baseUrl}/health`, () => {
          return HttpResponse.json({ status: 'healthy' })
        })
      )

      const result = await healthApi.getStatusSafe()

      expect(result.status).toBe('healthy')
    })
  })
})
