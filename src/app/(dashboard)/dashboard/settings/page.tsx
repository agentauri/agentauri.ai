'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { AgentAddressBadge } from '@/components/molecules'
import { useAuth, useCurrentOrganization, useUpdateProfile, useLogout } from '@/hooks'

export default function SettingsPage() {
  const { session, isLoading: sessionLoading } = useAuth()
  const { data: orgData, isLoading: orgLoading } = useCurrentOrganization()
  const updateProfile = useUpdateProfile()
  const logout = useLogout()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Session IS the user data directly
  const user = session
  const organization = orgData?.organization

  const handleEdit = () => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        username: username || undefined,
        email: email || undefined,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUsername('')
    setEmail('')
  }

  if (sessionLoading || orgLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING SETTINGS_
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-terminal pb-6">
        <div>
          <h1 className="typo-header text-terminal-green glow mb-2">
            [#] SETTINGS
          </h1>
          <p className="typo-ui text-terminal-dim">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Box variant="default" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="typo-ui text-terminal-green glow">&gt; PROFILE</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit} className="typo-ui">
              <Icon name="edit" size="sm" className="mr-1" />
              [EDIT]
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="username" className="typo-ui text-terminal-dim">
                  &gt; USERNAME
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="typo-ui text-terminal-dim">
                  &gt; EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="typo-ui border-terminal-dim bg-terminal focus:border-terminal-green"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateProfile.isPending} className="typo-ui">
                  {updateProfile.isPending ? '[SAVING...]' : '[SAVE]'}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="typo-ui">
                  [CANCEL]
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; USERNAME</div>
                <div className="typo-ui text-terminal-green">{user?.username ?? '-'}</div>
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; EMAIL</div>
                <div className="typo-ui text-terminal-green">{user?.email ?? '-'}</div>
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; MEMBER SINCE</div>
                <div className="typo-ui text-terminal-green">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </div>
              </div>
            </>
          )}
        </div>
      </Box>

      {/* Connected Wallets */}
      <Box variant="default" padding="lg">
        <h2 className="typo-ui text-terminal-green glow mb-4">&gt; CONNECTED WALLETS</h2>
        <div className="space-y-2">
          {user?.wallets && user.wallets.length > 0 ? (
            user.wallets.map((wallet) => (
              <div key={wallet.address} className="flex items-center justify-between">
                <AgentAddressBadge address={wallet.address} />
              </div>
            ))
          ) : (
            <p className="typo-ui text-terminal-dim">No wallets connected</p>
          )}
        </div>
      </Box>

      {/* Current Organization */}
      <Box variant="default" padding="lg">
        <h2 className="typo-ui text-terminal-green glow mb-4">&gt; CURRENT ORGANIZATION</h2>
        {organization ? (
          <div className="space-y-4">
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; NAME</div>
              <div className="typo-header text-terminal-green">{organization.name}</div>
            </div>
            <div>
              <div className="typo-ui text-terminal-dim mb-1">&gt; SLUG</div>
              <div className="typo-ui text-terminal-green font-mono">@{organization.slug}</div>
            </div>
            {organization.description && (
              <div>
                <div className="typo-ui text-terminal-dim mb-1">&gt; DESCRIPTION</div>
                <div className="typo-ui text-terminal-green">{organization.description}</div>
              </div>
            )}
          </div>
        ) : (
          <p className="typo-ui text-terminal-dim">No organization selected</p>
        )}
      </Box>

      {/* Quick Links */}
      <Box variant="default" padding="lg">
        <h2 className="typo-ui text-terminal-green glow mb-4">&gt; QUICK LINKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" asChild className="typo-ui justify-start">
            <Link href="/dashboard/api-keys">
              <Icon name="api-keys" size="sm" className="mr-2" />
              MANAGE API KEYS
            </Link>
          </Button>
          <Button variant="outline" asChild className="typo-ui justify-start">
            <Link href="/dashboard/billing">
              <Icon name="chart" size="sm" className="mr-2" />
              BILLING & CREDITS
            </Link>
          </Button>
          <Button variant="outline" asChild className="typo-ui justify-start">
            <Link href="/docs">
              <Icon name="help" size="sm" className="mr-2" />
              DOCUMENTATION
            </Link>
          </Button>
          <Button variant="outline" asChild className="typo-ui justify-start">
            <Link href="https://github.com/agentauri/agentauri" target="_blank">
              <Icon name="arrow-right" size="sm" className="mr-2" />
              GITHUB REPO
            </Link>
          </Button>
        </div>
      </Box>

      {/* Danger Zone */}
      <Box variant="error" padding="lg">
        <h2 className="typo-ui text-destructive mb-4">&gt; DANGER ZONE</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="typo-ui text-destructive">DISCONNECT WALLET</div>
            <div className="typo-ui text-destructive/70 text-sm">
              Sign out and disconnect your wallet
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="typo-ui"
          >
            {logout.isPending ? '[DISCONNECTING...]' : '[DISCONNECT]'}
          </Button>
        </div>
      </Box>
    </div>
  )
}
