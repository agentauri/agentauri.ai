import { apiClient } from '@/lib/api-client'
import {
  type LoginRequest,
  type LoginResponse,
  loginResponseSchema,
  type NonceRequest,
  type NonceResponse,
  nonceResponseSchema,
  type UserSession,
  userSessionSchema,
} from '@/lib/validations'

/**
 * Auth API client
 */
export const authApi = {
  /**
   * Get nonce for SIWE authentication
   */
  async getNonce(address: string): Promise<NonceResponse> {
    const data = await apiClient.post<NonceResponse>('/auth/nonce', {
      address,
    } satisfies NonceRequest)
    return nonceResponseSchema.parse(data)
  },

  /**
   * Login with SIWE message and signature
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>('/auth/login', request)
    return loginResponseSchema.parse(data)
  },

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /**
   * Get current user session
   */
  async getSession(): Promise<UserSession> {
    const data = await apiClient.get<UserSession>('/auth/me')
    return userSessionSchema.parse(data)
  },

  /**
   * Refresh session token
   */
  async refreshToken(): Promise<{ expiresAt: string }> {
    return apiClient.post<{ expiresAt: string }>('/auth/refresh')
  },
}
