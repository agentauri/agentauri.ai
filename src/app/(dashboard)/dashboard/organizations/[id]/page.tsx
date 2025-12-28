'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Box, Button, Badge, Input, Label, Textarea } from '@/components/atoms'
import { Icon } from '@/components/atoms/icon'
import { ConfirmDialog } from '@/components/molecules'
import {
  useOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useSwitchOrganization,
} from '@/hooks'
import { useOrganizationStore } from '@/stores/organization-store'
import type { OrganizationRole } from '@/lib/constants'

const ROLE_COLORS: Record<OrganizationRole, string> = {
  owner: 'border-yellow-400 text-yellow-400',
  admin: 'border-terminal-green text-terminal-green',
  member: 'border-terminal-dim text-terminal-dim',
  viewer: 'border-gray-500 text-gray-500',
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const { currentOrganizationId } = useOrganizationStore()
  const { data: orgData, isLoading } = useOrganization(orgId)
  const updateOrg = useUpdateOrganization(orgId)
  const deleteOrg = useDeleteOrganization()
  const switchOrg = useSwitchOrganization()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const organization = orgData
  const myRole = orgData?.my_role
  const canEdit = myRole === 'owner' || myRole === 'admin'
  const canDelete = myRole === 'owner'
  const isCurrent = currentOrganizationId === orgId

  const handleStartEdit = () => {
    if (organization) {
      setEditName(organization.name)
      setEditDescription(organization.description ?? '')
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    try {
      await updateOrg.mutateAsync({
        name: editName,
        description: editDescription || null,
      })
      setIsEditing(false)
    } catch {
      // Error handled by mutation
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrg.mutateAsync(orgId)
      router.push('/dashboard/organizations')
    } catch {
      // Error handled by mutation
    }
  }

  const handleSwitchTo = () => {
    switchOrg.mutate(orgId)
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING ORGANIZATION_
        </p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] ORGANIZATION NOT FOUND</p>
        <Link href="/dashboard/organizations">
          <Button variant="outline" className="typo-ui">
            [BACK TO ORGANIZATIONS]
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-terminal-dim typo-ui">
        <Link href="/dashboard/organizations" className="hover:text-terminal-green">
          ORGANIZATIONS
        </Link>
        <span>/</span>
        <span className="text-terminal-green">{organization.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-terminal pb-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="typo-header text-terminal-green glow">
                {organization.name}
              </h1>
              {isCurrent && (
                <Badge variant="outline" className="border-terminal-green text-terminal-green">
                  CURRENT
                </Badge>
              )}
            </div>
            <p className="typo-ui text-terminal-dim font-mono">@{organization.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {myRole && (
            <Badge variant="outline" className={ROLE_COLORS[myRole]}>
              {myRole.toUpperCase()}
            </Badge>
          )}
          {!isCurrent && (
            <Button
              variant="outline"
              onClick={handleSwitchTo}
              disabled={switchOrg.isPending}
              className="typo-ui"
            >
              {switchOrg.isPending ? '[SWITCHING...]' : '[SWITCH TO]'}
            </Button>
          )}
        </div>
      </div>

      {/* Organization Details */}
      <Box variant="default" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="typo-ui text-terminal-green glow">&gt; DETAILS</h2>
          {canEdit && !isEditing && (
            <Button variant="outline" size="sm" onClick={handleStartEdit} className="typo-ui">
              <Icon name="edit" size="sm" className="mr-1" />
              [EDIT]
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="typo-ui text-terminal-dim">
                &gt; NAME
              </Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="typo-ui text-terminal-dim">
                &gt; DESCRIPTION
              </Label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={updateOrg.isPending}
                className="typo-ui"
              >
                {updateOrg.isPending ? '[SAVING...]' : '[SAVE]'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="typo-ui"
              >
                [CANCEL]
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; NAME</div>
              <div className="typo-ui text-terminal-green">{organization.name}</div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; SLUG</div>
              <div className="typo-ui text-terminal-green font-mono">@{organization.slug}</div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; DESCRIPTION</div>
              <div className="typo-ui text-terminal-green">
                {organization.description || '-'}
              </div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; TYPE</div>
              <div className="typo-ui text-terminal-green">
                {organization.is_personal ? 'Personal' : 'Team'}
              </div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; CREATED</div>
              <div className="typo-ui text-terminal-green">
                {new Date(organization.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </Box>

      {/* Members Section */}
      <Box variant="default" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="typo-ui text-terminal-green glow">&gt; MEMBERS</h2>
          <Link href={`/dashboard/organizations/${orgId}/members`}>
            <Button variant="outline" size="sm" className="typo-ui">
              [MANAGE MEMBERS]
            </Button>
          </Link>
        </div>
        <p className="typo-ui text-terminal-dim">
          View and manage organization members, roles, and invitations.
        </p>
      </Box>

      {/* Danger Zone */}
      {canDelete && (
        <Box variant="error" padding="lg">
          <h2 className="typo-ui text-destructive mb-4">&gt; DANGER ZONE</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="typo-ui text-destructive">DELETE ORGANIZATION</div>
              <div className="typo-ui text-destructive/70 text-sm">
                Permanently delete this organization and all its data
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="typo-ui"
            >
              [DELETE]
            </Button>
          </div>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Organization"
        description={`Are you sure you want to delete "${organization.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteOrg.isPending}
      />
    </div>
  )
}
