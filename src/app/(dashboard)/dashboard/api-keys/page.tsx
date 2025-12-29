'use client'

import { useState } from 'react'
import { Box } from '@/components/atoms/box'
import {
  ApiKeyCreatedDialog,
  ApiKeysList,
  CreateApiKeyDialog,
} from '@/components/organisms'
import { useApiKeyStats, useCurrentOrganization } from '@/hooks'

export default function ApiKeysPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [keyCreatedDialogOpen, setKeyCreatedDialogOpen] = useState(false)

  const { data: orgData, isLoading } = useCurrentOrganization()
  const organization = orgData

  // Fetch API key stats from dedicated endpoint
  const { data: statsData } = useApiKeyStats(organization?.id ?? null)

  // Stats from backend
  const stats = {
    totalKeys: statsData?.totalKeys ?? 0,
    activeKeys: statsData?.activeKeys ?? 0,
    apiCalls24h: statsData?.calls24h ?? 0,
  }

  const handleKeyCreated = (key: string) => {
    setNewKey(key)
    setKeyCreatedDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING API KEYS_
        </p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] NO ORGANIZATION SELECTED</p>
        <p className="text-terminal-dim typo-ui">
          Please select an organization to view API keys
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
            [#] API KEYS
          </h1>
          <p className="typo-ui text-terminal-dim">
            Manage API keys for accessing the AgentAuri API
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Box variant="default" padding="md">
        <div className="flex items-start gap-3">
          <span className="typo-ui text-terminal-green">&gt;</span>
          <div>
            <p className="typo-ui text-terminal-green mb-1">API ACCESS</p>
            <p className="typo-ui text-terminal-dim text-sm">
              Use API keys to authenticate requests to the AgentAuri API.
              Keys can have different access tiers that determine which endpoints you can use.
            </p>
          </div>
        </div>
      </Box>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; TOTAL KEYS</div>
          <div className="typo-header text-terminal-green">{stats.totalKeys}</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; ACTIVE KEYS</div>
          <div className="typo-header text-terminal-green">{stats.activeKeys}</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; API CALLS (24H)</div>
          <div className="typo-header text-terminal-green">
            {stats.apiCalls24h.toLocaleString()}
          </div>
        </Box>
      </div>

      {/* API Keys List */}
      <ApiKeysList
        organizationId={organization.id}
        onCreateKey={() => setCreateDialogOpen(true)}
      />

      {/* Create API Key Dialog */}
      <CreateApiKeyDialog
        organizationId={organization.id}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleKeyCreated}
      />

      {/* Key Created Dialog */}
      <ApiKeyCreatedDialog
        apiKey={newKey}
        open={keyCreatedDialogOpen}
        onOpenChange={setKeyCreatedDialogOpen}
      />
    </div>
  )
}
