/**
 * User profile hooks
 *
 * React hooks for fetching and updating the current user's profile.
 * Handles profile data synchronization with session state.
 *
 * @module hooks/use-user-profile
 */

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { UpdateUserRequest } from '@/lib/validations/user'

/**
 * Hook for getting current user profile
 *
 * Fetches the authenticated user's profile information.
 * Data is cached for 5 minutes.
 *
 * @returns TanStack Query result with user profile
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { data: user, isLoading } = useUserProfile()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <h1>{user?.name || 'Anonymous'}</h1>
 *       <p>{user?.email}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: () => usersApi.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for updating user profile
 *
 * Updates the authenticated user's profile information.
 * Invalidates both profile and session queries on success.
 * Shows success/error toast notifications.
 *
 * @returns TanStack Mutation for profile update
 *
 * @example
 * ```tsx
 * function EditProfileForm() {
 *   const updateProfile = useUpdateProfile()
 *   const { data: user } = useUserProfile()
 *
 *   const handleSubmit = (data: UpdateUserRequest) => {
 *     updateProfile.mutate(data)
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="name" defaultValue={user?.name} />
 *       <Button type="submit" disabled={updateProfile.isPending}>
 *         Save
 *       </Button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateUserRequest) => usersApi.updateMe(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    },
  })
}
