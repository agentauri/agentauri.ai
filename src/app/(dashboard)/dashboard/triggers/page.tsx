'use client'

import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { TriggersList } from '@/components/organisms'
import { useCurrentOrganization } from '@/hooks'

export default function TriggersPage() {
  const { data: orgData, isLoading } = useCurrentOrganization()
  const organization = orgData?.organization

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING TRIGGERS_
        </p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] NO ORGANIZATION SELECTED</p>
        <p className="text-terminal-dim typo-ui">
          Please select an organization to view triggers
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
            [#] TRIGGERS
          </h1>
          <p className="typo-ui text-terminal-dim">
            Monitor blockchain events and automate actions
          </p>
        </div>
        <Button asChild className="typo-ui">
          <Link href="/dashboard/triggers/new">
            [+] NEW TRIGGER
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; TOTAL TRIGGERS</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; ACTIVE TRIGGERS</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; EXECUTIONS (24H)</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
      </div>

      {/* Triggers List */}
      <TriggersList organizationId={organization.id} />
    </div>
  )
}
