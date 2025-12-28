'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Box, Button, Badge } from '@/components/atoms'
import { Icon } from '@/components/atoms/icon'
import { CreateOrganizationDialog } from '@/components/organisms'
import { useOrganizations } from '@/hooks'
import { useOrganizationStore } from '@/stores/organization-store'
import { cn } from '@/lib/utils'
import type { OrganizationRole } from '@/lib/constants'

const ROLE_COLORS: Record<OrganizationRole, string> = {
  owner: 'border-yellow-400 text-yellow-400',
  admin: 'border-terminal-green text-terminal-green',
  member: 'border-terminal-dim text-terminal-dim',
  viewer: 'border-gray-500 text-gray-500',
}

export default function OrganizationsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { data: orgsData, isLoading } = useOrganizations()
  const { currentOrganizationId } = useOrganizationStore()

  const organizations = orgsData?.data ?? []

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING ORGANIZATIONS_
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-terminal pb-6">
        <div>
          <h1 className="typo-header text-terminal-green glow mb-2">
            [#] ORGANIZATIONS
          </h1>
          <p className="typo-ui text-terminal-dim">
            Manage your organizations and team members
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="typo-ui"
        >
          <Icon name="add" size="sm" className="mr-2" />
          [CREATE NEW]
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; TOTAL ORGS</div>
          <div className="typo-header text-terminal-green">{organizations.length}</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; OWNER OF</div>
          <div className="typo-header text-terminal-green">
            {organizations.filter(o => o.my_role === 'owner').length}
          </div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; MEMBER OF</div>
          <div className="typo-header text-terminal-green">
            {organizations.filter(o => o.my_role !== 'owner').length}
          </div>
        </Box>
      </div>

      {/* Organizations List */}
      {organizations.length === 0 ? (
        <Box variant="default" padding="lg" className="text-center">
          <Icon name="agents" size="lg" className="mx-auto mb-4 text-terminal-dim" />
          <h3 className="typo-ui text-terminal-green mb-2">NO ORGANIZATIONS</h3>
          <p className="typo-ui text-terminal-dim mb-4">
            Create your first organization to get started
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="typo-ui">
            [CREATE ORGANIZATION]
          </Button>
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/dashboard/organizations/${org.id}`}
            >
              <Box
                variant="default"
                padding="lg"
                className={cn(
                  'cursor-pointer transition-all hover:border-terminal-green h-full',
                  currentOrganizationId === org.id && 'border-terminal-green'
                )}
              >
                {/* Header: Name */}
                <h3 className="typo-ui text-terminal-green truncate mb-1">
                  {org.name}
                </h3>

                {/* Slug */}
                <p className="typo-ui text-terminal-dim text-sm font-mono truncate mb-3">
                  @{org.slug}
                </p>

                {/* Description (optional) */}
                {org.description && (
                  <p className="typo-ui text-terminal-dim text-sm line-clamp-2 mb-3">
                    {org.description}
                  </p>
                )}

                {/* Footer: Badges row */}
                <div className="flex items-center flex-wrap gap-2">
                  {currentOrganizationId === org.id && (
                    <Badge variant="outline" className="text-xs border-terminal-green text-terminal-green">
                      CURRENT
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn('text-xs', ROLE_COLORS[org.my_role])}
                  >
                    {org.my_role.toUpperCase()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs border-terminal-dim text-terminal-dim"
                  >
                    {org.is_personal ? 'PERSONAL' : 'TEAM'}
                  </Badge>
                </div>
              </Box>
            </Link>
          ))}
        </div>
      )}

      {/* Create Organization Dialog */}
      <CreateOrganizationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  )
}
