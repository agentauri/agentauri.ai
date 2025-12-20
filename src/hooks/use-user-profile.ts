'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { UpdateUserRequest } from '@/lib/validations/user'

/**
 * Hook for getting current user profile
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
