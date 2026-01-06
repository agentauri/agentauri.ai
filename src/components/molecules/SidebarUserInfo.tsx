'use client'

import Link from 'next/link'
import { UserIcon, ChevronRightIcon } from 'lucide-react'
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
        <div className="flex items-start gap-2.5">
          <Skeleton className="w-7 h-7" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-20" />
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
        'group flex items-start gap-2.5 w-full',
        'hover:bg-terminal-green/5 transition-colors',
        'px-4 py-3',
        className
      )}
    >
      <div className="w-7 h-7 border-2 border-terminal-green flex items-center justify-center shrink-0">
        <span className="text-terminal-green text-[10px] font-bold">
          {orgName.charAt(0).toUpperCase()}
        </span>
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          {/* Organization context */}
          <div className="text-[9px] text-terminal-dim uppercase tracking-wider mb-0.5">
            Working in
          </div>
          <div className="flex items-center gap-1 mb-1.5">
            <span className="typo-ui text-terminal-green truncate">
              {orgName}
            </span>
            <ChevronRightIcon className="w-3 h-3 text-terminal-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          {/* User identity + role */}
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-3 h-3 text-terminal-dim shrink-0" />
            <span className="text-[10px] text-terminal-dim truncate">{username}</span>
            <Badge
              variant="outline"
              className={cn('px-1 py-0 text-[8px] shrink-0 ml-auto', ROLE_COLORS[role])}
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
            <div className="text-[9px] text-terminal-dim uppercase tracking-wider mb-1">
              Working in
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-terminal-green typo-ui">{orgName}</span>
              <Badge
                variant="outline"
                className={cn('text-[9px] px-1 py-0', ROLE_COLORS[role])}
              >
                {role.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-terminal-dim mt-2">
              <UserIcon className="w-3 h-3" />
              <span className="text-[10px]">{username}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}
