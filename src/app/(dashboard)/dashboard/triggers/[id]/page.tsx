'use client'

import Link from 'next/link'
import { use, useState } from 'react'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { LoadingSkeleton } from '@/components/molecules/loading-skeleton'
import { ChainBadge, RegistryBadge, StatusBadge, TriggerForm } from '@/components/organisms'
import { useCurrentOrganization, useTrigger } from '@/hooks'
import { sanitizeHtml, sanitizeConfigValue } from '@/lib/sanitize'

interface TriggerDetailPageProps {
  params: Promise<{ id: string }>
}

export default function TriggerDetailPage({ params }: TriggerDetailPageProps) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view')

  const { data: orgData } = useCurrentOrganization()
  const organization = orgData?.organization

  const { data: trigger, isLoading, error } = useTrigger(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} height={200} />
        <LoadingSkeleton count={3} height={150} />
      </div>
    )
  }

  if (error || !trigger) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] TRIGGER NOT FOUND</p>
        <p className="text-terminal-dim typo-ui">
          {error instanceof Error ? error.message : 'The trigger could not be loaded'}
        </p>
        <Button asChild variant="outline" className="typo-ui">
          <Link href="/dashboard/triggers">[&lt;] BACK TO TRIGGERS</Link>
        </Button>
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
            {sanitizeHtml(trigger.name)}
          </h1>
          {trigger.description && (
            <p className="typo-ui text-terminal-dim mt-1">
              {sanitizeHtml(trigger.description)}
            </p>
          )}
        </div>
        <StatusBadge enabled={trigger.enabled} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'view' | 'edit')}>
        <TabsList className="border-2 border-terminal">
          <TabsTrigger value="view" className="typo-ui">
            [VIEW]
          </TabsTrigger>
          <TabsTrigger value="edit" className="typo-ui">
            [EDIT]
          </TabsTrigger>
        </TabsList>

        {/* View Tab */}
        <TabsContent value="view" className="space-y-6">
          {/* Basic Info */}
          <Box variant="secondary" padding="md">
            <div className="typo-ui text-terminal-green glow mb-4">
              [i] BASIC INFORMATION
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="typo-ui text-terminal-dim mb-2">&gt; BLOCKCHAIN</div>
                <ChainBadge chainId={trigger.chainId} />
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-2">&gt; REGISTRY</div>
                <RegistryBadge registry={trigger.registry} />
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-2">&gt; STATEFUL</div>
                <div className="typo-ui text-terminal-green">
                  {trigger.isStateful ? 'YES' : 'NO'}
                </div>
              </div>
              <div>
                <div className="typo-ui text-terminal-dim mb-2">&gt; STATUS</div>
                <div className="typo-ui text-terminal-green">
                  {trigger.enabled ? 'ENABLED' : 'DISABLED'}
                </div>
              </div>
            </div>
          </Box>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box variant="default" padding="md">
              <div className="typo-ui text-terminal-dim mb-1">&gt; EXECUTIONS</div>
              <div className="typo-header text-terminal-green">
                {trigger.executionCount}
              </div>
            </Box>
            <Box variant="default" padding="md">
              <div className="typo-ui text-terminal-dim mb-1">&gt; LAST RUN</div>
              <div className="typo-ui text-terminal-green">
                {trigger.lastExecutedAt
                  ? new Date(trigger.lastExecutedAt).toLocaleString()
                  : 'NEVER'}
              </div>
            </Box>
            <Box variant="default" padding="md">
              <div className="typo-ui text-terminal-dim mb-1">&gt; CREATED</div>
              <div className="typo-ui text-terminal-green">
                {new Date(trigger.createdAt).toLocaleDateString()}
              </div>
            </Box>
          </div>

          {/* Conditions */}
          <Box variant="secondary" padding="md">
            <div className="typo-ui text-terminal-green glow mb-4">
              [?] CONDITIONS ({trigger.conditions?.length ?? 0})
            </div>
            <div className="space-y-3">
              {trigger.conditions?.map((condition, index) => (
                <Box key={condition.id} variant="subtle" padding="md">
                  <div className="typo-ui text-terminal-dim mb-2">
                    CONDITION {index + 1}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 typo-ui">
                    <div>
                      <span className="text-terminal-dim">TYPE:</span>{' '}
                      <span className="text-terminal-green">
                        {sanitizeHtml(condition.conditionType)}
                      </span>
                    </div>
                    <div>
                      <span className="text-terminal-dim">FIELD:</span>{' '}
                      <span className="text-terminal-green">{sanitizeHtml(condition.field)}</span>
                    </div>
                    <div>
                      <span className="text-terminal-dim">OPERATOR:</span>{' '}
                      <span className="text-terminal-green">
                        {sanitizeHtml(condition.operator)}
                      </span>
                    </div>
                    <div>
                      <span className="text-terminal-dim">VALUE:</span>{' '}
                      <span className="text-terminal-green">{sanitizeHtml(condition.value)}</span>
                    </div>
                  </div>
                </Box>
              )) ?? (
                <div className="typo-ui text-terminal-dim">No conditions defined</div>
              )}
            </div>
          </Box>

          {/* Actions */}
          <Box variant="secondary" padding="md">
            <div className="typo-ui text-terminal-green glow mb-4">
              [!] ACTIONS ({trigger.actions?.length ?? 0})
            </div>
            <div className="space-y-3">
              {trigger.actions
                ?.sort((a, b) => b.priority - a.priority)
                .map((action, index) => (
                  <Box key={action.id} variant="subtle" padding="md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="typo-ui text-terminal-dim">ACTION {index + 1}</div>
                      <div className="typo-ui text-terminal-green">
                        PRIORITY: {action.priority}
                      </div>
                    </div>
                    <div className="typo-ui mb-2">
                      <span className="text-terminal-dim">TYPE:</span>{' '}
                      <span className="text-terminal-green">
                        {sanitizeHtml(action.actionType.toUpperCase())}
                      </span>
                    </div>
                    <pre className="typo-code text-terminal-dim overflow-x-auto p-2 bg-terminal/20 border border-terminal-dim">
                      <code>{sanitizeConfigValue(action.config)}</code>
                    </pre>
                  </Box>
                )) ?? <div className="typo-ui text-terminal-dim">No actions defined</div>}
            </div>
          </Box>
        </TabsContent>

        {/* Edit Tab */}
        <TabsContent value="edit">
          {organization && (
            <TriggerForm organizationId={organization.id} trigger={trigger} mode="edit" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
