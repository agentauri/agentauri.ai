import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from '@/test/setup'
import { clearCsrfToken } from '@/lib/api-client'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { usersApi } from '../users'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

describe('usersApi', () => {
  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    username: 'testuser',
    currentOrganizationId: '550e8400-e29b-41d4-a716-446655440001',
    walletAddresses: ['0x1234567890123456789012345678901234567890'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }

  beforeEach(() => {
    clearCsrfToken()
  })

  afterEach(() => {
    clearCsrfToken()
  })

  describe('getMe', () => {
    it('should get current user profile', async () => {
      server.use(
        http.get(`${baseUrl}/users/me`, () => {
          return HttpResponse.json(mockUser)
        })
      )

      const result = await usersApi.getMe()

      expect(result.id).toBe(mockUser.id)
      expect(result.email).toBe('test@example.com')
      expect(result.username).toBe('testuser')
    })

    it('should handle unauthorized error', async () => {
      server.use(
        http.get(`${baseUrl}/users/me`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        })
      )

      await expect(usersApi.getMe()).rejects.toThrow()
    })
  })

  describe('updateMe', () => {
    it('should update user profile successfully', async () => {
      const updatedUser = { ...mockUser, username: 'newusername' }

      server.use(
        http.patch(`${baseUrl}/users/me`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject({ username: 'newusername' })
          return HttpResponse.json(updatedUser)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await usersApi.updateMe({ username: 'newusername' })

      expect(result.username).toBe('newusername')
    })

    it('should update current organization', async () => {
      const newOrgId = '550e8400-e29b-41d4-a716-446655440002'
      const updatedUser = { ...mockUser, currentOrganizationId: newOrgId }

      server.use(
        http.patch(`${baseUrl}/users/me`, async ({ request }) => {
          const body = await request.json()
          expect(body).toMatchObject({ currentOrganizationId: newOrgId })
          return HttpResponse.json(updatedUser)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const result = await usersApi.updateMe({ currentOrganizationId: newOrgId })

      expect(result.currentOrganizationId).toBe(newOrgId)
    })

    it('should handle validation error', async () => {
      server.use(
        http.patch(`${baseUrl}/users/me`, () => {
          return HttpResponse.json({ message: 'Invalid username' }, { status: 422 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(usersApi.updateMe({ username: '' })).rejects.toThrow()
    })

    it('should handle unauthorized error', async () => {
      server.use(
        http.patch(`${baseUrl}/users/me`, () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      await expect(usersApi.updateMe({ username: 'newname' })).rejects.toThrow()
    })
  })
})
