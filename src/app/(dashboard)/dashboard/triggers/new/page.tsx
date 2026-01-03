'use client'

import { DetailPageHeader } from '@/components/molecules'
import { TriggerForm } from '@/components/organisms'
import { useCurrentOrganization } from '@/hooks'

export default function NewTriggerPage() {
  const { data: orgData, isLoading } = useCurrentOrganization()
  const organization = orgData

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
      <DetailPageHeader
        backHref="/dashboard/triggers"
        title="[+] CREATE NEW TRIGGER"
        subtitle="Set up automated monitoring and actions for blockchain events"
      />

      {/* Form */}
      <TriggerForm organizationId={organization.id} mode="create" />
    </div>
  )
}
