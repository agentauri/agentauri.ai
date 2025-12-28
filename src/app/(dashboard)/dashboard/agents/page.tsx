'use client'

import { useState } from 'react'
import { Box } from '@/components/atoms/box'
import { AgentsList, LinkAgentDialog } from '@/components/organisms'
import { useCurrentOrganization } from '@/hooks'

export default function AgentsPage() {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const { data: orgData, isLoading } = useCurrentOrganization()
  const organization = orgData

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING AGENTS_
        </p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] NO ORGANIZATION SELECTED</p>
        <p className="text-terminal-dim typo-ui">
          Please select an organization to view agents
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
            [#] LINKED AGENTS
          </h1>
          <p className="typo-ui text-terminal-dim">
            ERC-8004 agents linked to your organization
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; LINKED AGENTS</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; ACTIVE CHAINS</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; EVENTS (24H)</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
      </div>

      {/* Agents List */}
      <AgentsList
        organizationId={organization.id}
        showLinkButton
        onLinkAgent={() => setLinkDialogOpen(true)}
      />

      {/* Link Agent Dialog */}
      <LinkAgentDialog
        organizationId={organization.id}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
      />
    </div>
  )
}
