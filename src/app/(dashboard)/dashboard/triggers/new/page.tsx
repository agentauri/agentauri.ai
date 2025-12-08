'use client'

import Link from 'next/link'
import { TriggerForm } from '@/components/organisms'
import { useCurrentOrganization } from '@/hooks'

export default function NewTriggerPage() {
  const { data: orgData, isLoading } = useCurrentOrganization()
  const organization = orgData?.organization

  if (isLoading) {
    return (
      <div className="h-screen bg-terminal flex items-center justify-center">
        <p className="text-terminal-green typo-ui glow animate-pulse">
          {'>'} LOADING_
        </p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] NO ORGANIZATION SELECTED</p>
        <p className="text-terminal-dim typo-ui">
          Please select an organization to create a trigger
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b-2 border-terminal pb-6">
        <Link
          href="/dashboard/triggers"
          className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors"
        >
          [&lt;] BACK
        </Link>
        <div className="flex-1">
          <h1 className="typo-header text-terminal-green glow">
            [+] CREATE NEW TRIGGER
          </h1>
          <p className="typo-ui text-terminal-dim mt-1">
            Set up automated monitoring and actions for blockchain events
          </p>
        </div>
      </div>

      {/* Form */}
      <TriggerForm organizationId={organization.id} mode="create" />
    </div>
  )
}
