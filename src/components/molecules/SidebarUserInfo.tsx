'use client'

import Link from 'next/link'
import { UserIcon } from 'lucide-react'
import { Badge, Skeleton, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms'
import { useSession } from '@/hooks/use-auth'
import { useCurrentOrganization } from '@/hooks/use-organizations'
import { cn } from '@/lib/utils'
import type { OrganizationRole } from '@/lib/constants'

interface SidebarUserInfoProps {
  collapsed?: boolean
  className?: string
}

const ROLE_COLORS: Record<OrganizationRole, string> = {
  owner: 'border-yellow-400 text-yellow-400',
  admin: 'border-terminal-green text-terminal-green',
  member: 'border-terminal-dim text-terminal-dim',
  viewer: 'border-gray-500 text-gray-500',
}

export function SidebarUserInfo({ collapsed = false, className }: SidebarUserInfoProps) {
  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: currentOrg, isLoading: orgLoading } = useCurrentOrganization()

  const isLoading = sessionLoading || orgLoading
  const username = session?.username ?? 'User'
  const orgName = currentOrg?.name ?? 'No organization'
  const role = currentOrg?.my_role ?? 'member'

  if (isLoading) {
    return (
      <div className={cn('px-4 py-3', className)}>
        <div className="flex items-center gap-3">
          <Skeleton className="w-6 h-6 rounded-full" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          )}
        </div>
      </div>
    )
  }

  const content = (
    <Link
      href="/dashboard/organizations"
      className={cn(
        'flex items-center gap-3 w-full',
        'hover:bg-terminal-green/5 transition-colors',
        'px-4 py-3',
        className
      )}
    >
      <UserIcon className="w-6 h-6 text-terminal-green shrink-0" />
      {!collapsed && (
        <div className="min-w-0 flex-1 space-y-1">
          <div className="typo-ui text-terminal-green truncate">
            {username}
          </div>
          <div className="flex items-center gap-2">
            <span className="typo-ui text-terminal-dim truncate">
              {orgName}
            </span>
            <Badge
              variant="outline"
              className={cn('typo-ui px-1.5 py-0.5', ROLE_COLORS[role])}
            >
              {role.toUpperCase()}
            </Badge>
          </div>
        </div>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-terminal border-terminal-dim">
            <div className="text-terminal-green typo-ui text-sm">{username}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-terminal-dim text-xs">{orgName}</span>
              <Badge
                variant="outline"
                className={cn('text-[10px] px-1 py-0 h-4', ROLE_COLORS[role])}
              >
                {role.toUpperCase()}
              </Badge>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}
