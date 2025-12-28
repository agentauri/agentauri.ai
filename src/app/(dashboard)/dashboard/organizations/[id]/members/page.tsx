'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms'
import { Icon } from '@/components/atoms/icon'
import { ConfirmDialog } from '@/components/molecules'
import {
  useOrganization,
  useOrganizationMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
} from '@/hooks'
import { cn } from '@/lib/utils'
import { inviteMemberRequestSchema, type InviteMemberRequest } from '@/lib/validations'
import type { OrganizationRole } from '@/lib/constants'

const ROLE_COLORS: Record<OrganizationRole, string> = {
  owner: 'border-yellow-400 text-yellow-400',
  admin: 'border-terminal-green text-terminal-green',
  member: 'border-terminal-dim text-terminal-dim',
  viewer: 'border-gray-500 text-gray-500',
}

const ROLE_OPTIONS: { value: Exclude<OrganizationRole, 'owner'>; label: string }[] = [
  { value: 'admin', label: 'ADMIN' },
  { value: 'member', label: 'MEMBER' },
  { value: 'viewer', label: 'VIEWER' },
]

export default function OrganizationMembersPage() {
  const params = useParams()
  const orgId = params.id as string

  const { data: orgData, isLoading: orgLoading } = useOrganization(orgId)
  const { data: membersData, isLoading: membersLoading } = useOrganizationMembers(orgId)
  const inviteMember = useInviteMember(orgId)
  const updateMemberRole = useUpdateMemberRole(orgId)
  const removeMember = useRemoveMember(orgId)

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; username: string } | null>(null)

  const organization = orgData
  const myRole = orgData?.my_role
  const members = membersData?.data ?? []
  const canManage = myRole === 'owner' || myRole === 'admin'

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteMemberRequest>({
    resolver: zodResolver(inviteMemberRequestSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  })

  const selectedRole = watch('role')

  const onInvite = async (data: InviteMemberRequest) => {
    try {
      await inviteMember.mutateAsync(data)
      reset()
    } catch {
      // Error handled by mutation
    }
  }

  const handleRoleChange = async (memberId: string, newRole: Exclude<OrganizationRole, 'owner'>) => {
    try {
      await updateMemberRole.mutateAsync({
        memberId,
        request: { role: newRole },
      })
    } catch {
      // Error handled by mutation
    }
  }

  const handleRemoveClick = (id: string, username: string) => {
    setMemberToRemove({ id, username })
    setRemoveDialogOpen(true)
  }

  const handleRemoveConfirm = async () => {
    if (!memberToRemove) return
    try {
      await removeMember.mutateAsync(memberToRemove.id)
      setRemoveDialogOpen(false)
      setMemberToRemove(null)
    } catch {
      // Error handled by mutation
    }
  }

  if (orgLoading || membersLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING MEMBERS_
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
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-terminal-dim typo-ui">
        <Link href="/dashboard/organizations" className="hover:text-terminal-green">
          ORGANIZATIONS
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/organizations/${orgId}`}
          className="hover:text-terminal-green"
        >
          {organization.name}
        </Link>
        <span>/</span>
        <span className="text-terminal-green">MEMBERS</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-terminal pb-6">
        <div>
          <h1 className="typo-header text-terminal-green glow mb-2">
            [#] MEMBERS
          </h1>
          <p className="typo-ui text-terminal-dim">
            Manage members of {organization.name}
          </p>
        </div>
        <Badge variant="outline" className={myRole ? ROLE_COLORS[myRole] : ''}>
          YOUR ROLE: {myRole?.toUpperCase()}
        </Badge>
      </div>

      {/* Invite Member Form */}
      {canManage && (
        <Box variant="default" padding="lg">
          <h2 className="typo-ui text-terminal-green glow mb-4">&gt; INVITE MEMBER</h2>
          <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="email" className="typo-ui text-terminal-dim">
                  &gt; EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register('email')}
                  className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="typo-ui text-terminal-dim">
                  &gt; ROLE
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setValue('role', value as Exclude<OrganizationRole, 'owner'>)}
                >
                  <SelectTrigger className="typo-ui border-terminal-dim bg-terminal">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-terminal border-terminal-green">
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="typo-ui text-terminal-dim hover:text-terminal-green"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-destructive text-sm">{errors.role.message}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={inviteMember.isPending}
              className="typo-ui"
            >
              {inviteMember.isPending ? '[INVITING...]' : '[INVITE]'}
            </Button>
          </form>
        </Box>
      )}

      {/* Members List */}
      <Box variant="default" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="typo-ui text-terminal-green glow">
            &gt; MEMBERS ({members.length})
          </h2>
        </div>

        {members.length === 0 ? (
          <p className="typo-ui text-terminal-dim text-center py-8">
            No members found
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => {
              const isOwner = member.role === 'owner'
              const canModify = canManage && !isOwner

              return (
                <div
                  key={member.id}
                  className={cn(
                    'flex flex-col md:flex-row md:items-center justify-between gap-3 p-4',
                    'border border-terminal-dim hover:border-terminal-green transition-colors'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="typo-ui text-terminal-green truncate">
                        {member.username}
                      </span>
                      <Badge variant="outline" className={ROLE_COLORS[member.role]}>
                        {member.role.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="typo-ui text-terminal-dim text-sm font-mono truncate">
                      {member.email}
                    </p>
                  </div>

                  {canModify && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          handleRoleChange(member.id, value as Exclude<OrganizationRole, 'owner'>)
                        }
                        disabled={updateMemberRole.isPending}
                      >
                        <SelectTrigger className="w-32 typo-ui border-terminal-dim bg-terminal text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-terminal border-terminal-green">
                          {ROLE_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="typo-ui text-terminal-dim hover:text-terminal-green text-sm"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveClick(member.id, member.username)}
                        className="typo-ui text-destructive hover:text-destructive border-destructive"
                      >
                        <Icon name="close" size="sm" />
                      </Button>
                    </div>
                  )}

                  {isOwner && (
                    <span className="typo-ui text-terminal-dim text-sm">
                      ORGANIZATION OWNER
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Box>

      {/* Remove Member Confirmation Dialog */}
      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove Member"
        description={`Are you sure you want to remove "${memberToRemove?.username}" from this organization?`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleRemoveConfirm}
        isLoading={removeMember.isPending}
      />
    </div>
  )
}
