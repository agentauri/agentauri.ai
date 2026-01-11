/**
 * ApiKeysList
 *
 * Displays a grid of API key cards with a create button.
 * Handles loading states, errors, and empty states.
 *
 * @module components/organisms/ApiKeysList
 *
 * @example
 * ```tsx
 * <ApiKeysList
 *   organizationId="org_123"
 *   onCreateKey={() => setCreateDialogOpen(true)}
 * />
 * ```
 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { ApiErrorDisplay, LoadingSkeleton } from '@/components/molecules'
import { EmptyListState } from '@/components/molecules/EmptyState'
import { useApiKeys } from '@/hooks'
import { ApiKeyCard } from './ApiKeyCard'
import { ApiKeyCreatedDialog } from './ApiKeyCreatedDialog'

/**
 * Props for the ApiKeysList component.
 */
interface ApiKeysListProps {
  /** The organization ID to fetch API keys for */
  organizationId: string
  /** Callback when create key button is clicked */
  onCreateKey?: () => void
}

export function ApiKeysList({ organizationId, onCreateKey }: ApiKeysListProps) {
  const [newKey, setNewKey] = useState<string | null>(null)
  const [keyCreatedDialogOpen, setKeyCreatedDialogOpen] = useState(false)

  const { data, isLoading, error } = useApiKeys(organizationId)

  const handleRegenerate = (key: string) => {
    setNewKey(key)
    setKeyCreatedDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton count={3} height={200} />
      </div>
    )
  }

  if (error) {
    return (
      <ApiErrorDisplay
        error={error instanceof Error ? error : new Error('An unexpected error occurred')}
        title="ERROR LOADING API KEYS"
      />
    )
  }

  const apiKeys = data?.data ?? []

  return (
    <div data-slot="api-keys-list" className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-end">
        <Button onClick={onCreateKey} className="typo-ui">
          <Icon name="add" size="sm" className="mr-1" />
          [CREATE API KEY]
        </Button>
      </div>

      {/* API Keys Grid */}
      {apiKeys.length === 0 ? (
        <EmptyListState itemName="API key" onCreate={onCreateKey} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {apiKeys.map((apiKey) => (
            <ApiKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>
      )}

      {/* Load More (if pagination has more) */}
      {data?.pagination?.hasMore && (
        <div className="text-center">
          <Button variant="outline" className="typo-ui">
            [LOAD MORE]
          </Button>
        </div>
      )}

      {/* Key Created/Regenerated Dialog */}
      <ApiKeyCreatedDialog
        apiKey={newKey}
        open={keyCreatedDialogOpen}
        onOpenChange={setKeyCreatedDialogOpen}
      />
    </div>
  )
}
