import { apiClient } from '@/lib/api-client'
import {
  type UpdateUserRequest,
  type User,
  userSchema,
} from '@/lib/validations/user'

/**
 * Users API client for profile management
 *
 * Handles user profile operations. User authentication is managed
 * separately via the auth API.
 *
 * @see https://docs.agentauri.ai/api/users
 */
export const usersApi = {
  /**
   * Get current user profile
   *
   * Retrieves the authenticated user's profile information.
   *
   * @returns Current user's profile data
   * @throws {ApiError} 401 - Unauthorized (not authenticated)
   *
   * @example
   * ```ts
   * const user = await usersApi.getMe()
   * console.log(`Welcome, ${user.name || user.email}`)
   * ```
   */
  async getMe(): Promise<User> {
    const data = await apiClient.get<User>('/users/me')
    return userSchema.parse(data)
  },

  /**
   * Update current user profile
   *
   * Updates the authenticated user's profile information.
   * Only provided fields are updated.
   *
   * @param request - Fields to update (name, avatar, etc.)
   * @returns Updated user profile
   * @throws {ApiError} 400 - Invalid request
   * @throws {ApiError} 401 - Unauthorized (not authenticated)
   *
   * @example
   * ```ts
   * const user = await usersApi.updateMe({
   *   name: 'John Doe',
   *   avatar: 'https://example.com/avatar.png',
   * })
   * ```
   */
  async updateMe(request: UpdateUserRequest): Promise<User> {
    const data = await apiClient.patch<User>('/users/me', request)
    return userSchema.parse(data)
  },
}
