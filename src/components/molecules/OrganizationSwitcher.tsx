'use client'

import { useState } from 'react'
import { ChevronDownIcon, PlusIcon, BuildingIcon, CheckIcon } from 'lucide-react'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@/components/atoms'
import { CreateOrganizationDialog } from '@/components/organisms'
import { useOrganizations, useCurrentOrganization, useSwitchOrganization } from '@/hooks'
import { cn } from '@/lib/utils'
import type { OrganizationRole } from '@/lib/constants'

interface OrganizationSwitcherProps {
  collapsed?: boolean
  className?: string
}

const ROLE_COLORS: Record<OrganizationRole, string> = {
  owner: 'text-yellow-400',
  admin: 'text-terminal-green',
  member: 'text-terminal-dim',
  viewer: 'text-gray-500',
}

export function OrganizationSwitcher({ collapsed = false, className }: OrganizationSwitcherProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { data: orgsData, isLoading: orgsLoading } = useOrganizations()
  const { data: currentOrgData, isLoading: currentLoading } = useCurrentOrganization()
  const switchOrg = useSwitchOrganization()

  const organizations = orgsData?.data ?? []
  const currentOrg = currentOrgData?.organization
  const currentRole = currentOrgData?.myRole

  const handleSwitch = (orgId: string) => {
    if (orgId !== currentOrg?.id) {
      switchOrg.mutate(orgId)
    }
  }

  if (orgsLoading || currentLoading) {
    return (
      <div className={cn('px-4 py-2', className)}>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('w-full h-10', className)}
            title={currentOrg?.name ?? 'Select organization'}
          >
            <BuildingIcon className="h-4 w-4 text-terminal-green" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56 bg-terminal border-terminal-green">
          <DropdownMenuLabel className="text-terminal-green typo-ui">
            ORGANIZATIONS
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-terminal-dim" />
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.organization.id}
              onClick={() => handleSwitch(org.organization.id)}
              className="typo-ui text-terminal-dim hover:text-terminal-green cursor-pointer"
            >
              <span className="flex-1 truncate">{org.organization.name}</span>
              {org.organization.id === currentOrg?.id && (
                <CheckIcon className="h-4 w-4 text-terminal-green ml-2" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-terminal-dim" />
          <DropdownMenuItem
            onClick={() => setCreateDialogOpen(true)}
            className="typo-ui text-terminal-green cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            CREATE NEW
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-between h-auto py-2 px-3',
              'bg-terminal-green/5 border border-terminal-dim',
              'hover:border-terminal-green hover:bg-terminal-green/10',
              className
            )}
          >
            <div className="flex flex-col items-start text-left min-w-0">
              <span className="text-terminal-green typo-ui truncate w-full">
                {currentOrg?.name ?? 'Select Organization'}
              </span>
              {currentRole && (
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs mt-0.5 border-none px-0',
                    ROLE_COLORS[currentRole]
                  )}
                >
                  {currentRole.toUpperCase()}
                </Badge>
              )}
            </div>
            <ChevronDownIcon className="h-4 w-4 text-terminal-dim shrink-0 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-terminal border-terminal-green">
          <DropdownMenuLabel className="text-terminal-green typo-ui">
            SWITCH ORGANIZATION
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-terminal-dim" />
          {organizations.length === 0 ? (
            <DropdownMenuItem disabled className="typo-ui text-terminal-dim">
              No organizations
            </DropdownMenuItem>
          ) : (
            organizations.map((org) => (
              <DropdownMenuItem
                key={org.organization.id}
                onClick={() => handleSwitch(org.organization.id)}
                className={cn(
                  'typo-ui cursor-pointer flex items-center',
                  org.organization.id === currentOrg?.id
                    ? 'text-terminal-green'
                    : 'text-terminal-dim hover:text-terminal-green'
                )}
              >
                <span className="flex-1 truncate">{org.organization.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs border-none ml-2',
                    ROLE_COLORS[org.myRole]
                  )}
                >
                  {org.myRole}
                </Badge>
                {org.organization.id === currentOrg?.id && (
                  <CheckIcon className="h-4 w-4 text-terminal-green ml-2 shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator className="bg-terminal-dim" />
          <DropdownMenuItem
            onClick={() => setCreateDialogOpen(true)}
            className="typo-ui text-terminal-green cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            CREATE NEW ORGANIZATION
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
