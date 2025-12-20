import { apiClient } from '@/lib/api-client'
import {
  type UpdateUserRequest,
  type User,
  userSchema,
} from '@/lib/validations/user'

/**
 * Users API client
 */
export const usersApi = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    const data = await apiClient.get<User>('/users/me')
    return userSchema.parse(data)
  },

  /**
   * Update current user profile
   */
  async updateMe(request: UpdateUserRequest): Promise<User> {
    const data = await apiClient.patch<User>('/users/me', request)
    return userSchema.parse(data)
  },
}
