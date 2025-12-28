'use client'

import Link from 'next/link'
import { use } from 'react'
import { Button } from '@/components/atoms/button'
import { LoadingSkeleton } from '@/components/molecules'
import { AgentDetail } from '@/components/organisms'
import { useAgent, useCurrentOrganization } from '@/hooks'

interface AgentDetailPageProps {
  params: Promise<{ address: string }>
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { address } = use(params)

  const { data: orgData, isLoading: orgLoading } = useCurrentOrganization()
  const organization = orgData

  const { data: agent, isLoading, error } = useAgent(
    organization?.id ?? null,
    address
  )

  if (orgLoading || isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <LoadingSkeleton count={1} height={100} />
        <LoadingSkeleton count={2} height={200} />
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

  if (error || !agent) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] AGENT NOT FOUND</p>
        <p className="text-terminal-dim typo-ui">
          {error instanceof Error ? error.message : 'The agent could not be loaded'}
        </p>
        <Button asChild variant="outline" className="typo-ui">
          <Link href="/dashboard/agents">[&lt;] BACK TO AGENTS</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b-2 border-terminal pb-6">
        <Link
          href="/dashboard/agents"
          className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors"
        >
          [&lt;] BACK
        </Link>
        <div className="flex-1">
          <h1 className="typo-header text-terminal-green glow">
            AGENT #{agent.agentId}
          </h1>
          <p className="typo-ui text-terminal-dim mt-1">
            {agent.walletAddress.slice(0, 6)}...{agent.walletAddress.slice(-4)}
          </p>
        </div>
      </div>

      {/* Agent Detail */}
      <AgentDetail agent={agent} organizationId={organization.id} />
    </div>
  )
}
