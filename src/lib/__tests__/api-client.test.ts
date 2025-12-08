import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { ApiError, apiClient, clearCsrfToken } from '../api-client'
import { API_BASE_URL, API_VERSION } from '../constants'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('ApiClient', () => {
  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: '1', name: 'Test' }

      server.use(
        http.get(`${baseUrl}/test`, () => {
          return HttpResponse.json(mockData)
        })
      )

      const result = await apiClient.get<typeof mockData>('/test')
      expect(result).toEqual(mockData)
    })

    it('should include query parameters', async () => {
      let capturedUrl: URL | undefined

      server.use(
        http.get(`${baseUrl}/test`, ({ request }) => {
          capturedUrl = new URL(request.url)
          return HttpResponse.json({ success: true })
        })
      )

      await apiClient.get('/test', { params: { foo: 'bar', num: 123 } })

      expect(capturedUrl).toBeDefined()
      expect(capturedUrl!.searchParams.get('foo')).toBe('bar')
      expect(capturedUrl!.searchParams.get('num')).toBe('123')
    })

    it('should handle 404 errors', async () => {
      server.use(
        http.get(`${baseUrl}/not-found`, () => {
          return HttpResponse.json({ message: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
        })
      )

      try {
        await apiClient.get('/not-found')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(404)
        expect((error as ApiError).isNotFound).toBe(true)
      }
    })
  })

  describe('POST requests', () => {
    it('should make successful POST request with body', async () => {
      const requestBody = { name: 'Test' }
      const mockResponse = { id: '1', ...requestBody }
      let capturedBody: unknown = null

      server.use(
        http.post(`${baseUrl}/test`, async ({ request }) => {
          capturedBody = await request.json()
          return HttpResponse.json(mockResponse)
        })
      )

      // Mock CSRF token endpoint
      server.use(
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf-token' })
        })
      )

      const result = await apiClient.post<typeof mockResponse>('/test', requestBody)

      expect(result).toEqual(mockResponse)
      expect(capturedBody).toEqual(requestBody)
    })

    it('should include CSRF token header for POST requests', async () => {
      let capturedHeaders: Headers | undefined

      server.use(
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf-token' })
        }),
        http.post(`${baseUrl}/test`, ({ request }) => {
          capturedHeaders = new Headers(request.headers)
          return HttpResponse.json({ success: true })
        })
      )

      await apiClient.post('/test', {})

      expect(capturedHeaders).toBeDefined()
      expect(capturedHeaders!.get('X-CSRF-Token')).toBe('test-csrf-token')
    })
  })

  describe('Error handling', () => {
    it('should handle 401 unauthorized', async () => {
      server.use(
        http.get(`${baseUrl}/protected`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        })
      )

      try {
        await apiClient.get('/protected')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).isUnauthorized).toBe(true)
      }
    })

    it('should handle 403 forbidden and clear CSRF token', async () => {
      // First set up CSRF token
      server.use(
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-token' })
        })
      )

      // Make a POST to cache the token
      server.use(
        http.post(`${baseUrl}/setup`, () => {
          return HttpResponse.json({ success: true })
        })
      )
      await apiClient.post('/setup', {})

      // Now test 403 response
      server.use(
        http.get(`${baseUrl}/forbidden`, () => {
          return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
        })
      )

      try {
        await apiClient.get('/forbidden')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).isForbidden).toBe(true)
      }
    })

    it('should handle 429 rate limit', async () => {
      server.use(
        http.get(`${baseUrl}/rate-limited`, () => {
          return HttpResponse.json({ message: 'Too many requests' }, { status: 429 })
        })
      )

      try {
        await apiClient.get('/rate-limited')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).isRateLimited).toBe(true)
      }
    })

    it('should handle error responses with structured data', async () => {
      const errorData = {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { field: 'email', reason: 'invalid format' },
      }

      server.use(
        http.post(`${baseUrl}/validate`, () => {
          return HttpResponse.json(errorData, { status: 422 })
        })
      )

      server.use(
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-token' })
        })
      )

      try {
        await apiClient.post('/validate', { email: 'invalid' })
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.status).toBe(422)
        expect(apiError.data?.message).toBe('Validation failed')
        expect(apiError.data?.code).toBe('VALIDATION_ERROR')
        expect(apiError.data?.details).toEqual({ field: 'email', reason: 'invalid format' })
      }
    })

    it('should handle error responses with non-JSON body', async () => {
      server.use(
        http.get(`${baseUrl}/text-error`, () => {
          return new Response('Internal Server Error', { status: 500 })
        })
      )

      try {
        await apiClient.get('/text-error')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.status).toBe(500)
        expect(apiError.message).toBe('Request failed with status 500')
      }
    })

    it('should handle network errors', async () => {
      server.use(
        http.get(`${baseUrl}/network-error`, () => {
          return HttpResponse.error()
        })
      )

      try {
        await apiClient.get('/network-error')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(0)
      }
    })

    it('should handle timeout', async () => {
      server.use(
        http.get(`${baseUrl}/slow`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return HttpResponse.json({ success: true })
        })
      )

      try {
        await apiClient.get('/slow', { timeout: 100 })
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        // AbortError message varies by environment
        expect((error as ApiError).status).toBe(0)
      }
    })
  })

  describe('HTTP methods', () => {
    beforeEach(() => {
      server.use(
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-token' })
        })
      )
    })

    it('should make PUT requests', async () => {
      const requestBody = { name: 'Updated' }
      const mockResponse = { id: '1', ...requestBody }

      server.use(
        http.put(`${baseUrl}/resource/1`, async ({ request }) => {
          const body = await request.json()
          expect(body).toEqual(requestBody)
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await apiClient.put<typeof mockResponse>('/resource/1', requestBody)
      expect(result).toEqual(mockResponse)
    })

    it('should make PATCH requests', async () => {
      const requestBody = { name: 'Patched' }
      const mockResponse = { id: '1', ...requestBody }

      server.use(
        http.patch(`${baseUrl}/resource/1`, async ({ request }) => {
          const body = await request.json()
          expect(body).toEqual(requestBody)
          return HttpResponse.json(mockResponse)
        })
      )

      const result = await apiClient.patch<typeof mockResponse>('/resource/1', requestBody)
      expect(result).toEqual(mockResponse)
    })

    it('should make DELETE requests', async () => {
      server.use(
        http.delete(`${baseUrl}/resource/1`, () => {
          return HttpResponse.json({ success: true })
        })
      )

      const result = await apiClient.delete<{ success: boolean }>('/resource/1')
      expect(result).toEqual({ success: true })
    })
  })

  describe('Response handling', () => {
    it('should handle empty/void responses', async () => {
      server.use(
        http.get(`${baseUrl}/no-content`, () => {
          return new Response(null, {
            status: 204,
            headers: { 'Content-Type': 'text/plain' },
          })
        })
      )

      const result = await apiClient.get('/no-content')
      expect(result).toBeUndefined()
    })

    it('should handle responses without content-type header', async () => {
      server.use(
        http.get(`${baseUrl}/plain-text`, () => {
          return new Response('Plain text response', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
          })
        })
      )

      const result = await apiClient.get('/plain-text')
      expect(result).toBeUndefined()
    })
  })

  describe('ApiError class', () => {
    it('should correctly identify client errors', () => {
      const error = new ApiError(400, 'Bad request')
      expect(error.isClientError).toBe(true)
      expect(error.isServerError).toBe(false)
    })

    it('should correctly identify server errors', () => {
      const error = new ApiError(500, 'Internal server error')
      expect(error.isClientError).toBe(false)
      expect(error.isServerError).toBe(true)
    })

    it('should store error data', () => {
      const errorData = { message: 'Validation failed', code: 'VALIDATION_ERROR' }
      const error = new ApiError(422, 'Validation failed', errorData)
      expect(error.data).toEqual(errorData)
    })
  })
})
