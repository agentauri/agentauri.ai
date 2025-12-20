'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { LoadingSkeleton } from '@/components/molecules'
import { FilterBar, FilterGroup, FilterItem } from '@/components/molecules/FilterBar'
import { SearchInput } from '@/components/molecules/SearchInput'
import { EmptyListState, NoResultsState } from '@/components/molecules/EmptyState'
import { useAgents } from '@/hooks'
import { SUPPORTED_CHAINS, type SupportedChainId } from '@/lib/constants'
import type { AgentFilters } from '@/lib/validations/agent'
import { AgentCard } from './AgentCard'

interface AgentsListProps {
  organizationId: string
  showLinkButton?: boolean
  onLinkAgent?: () => void
}

export function AgentsList({ organizationId, showLinkButton = true, onLinkAgent }: AgentsListProps) {
  const [filters, setFilters] = useState<AgentFilters>({})
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useAgents(organizationId, {
    ...filters,
    search: search || undefined,
  })

  const handleChainFilter = (value: string) => {
    if (value === 'all') {
      const { chainId: _, ...rest } = filters
      setFilters(rest)
    } else {
      setFilters({ ...filters, chainId: Number.parseInt(value, 10) as SupportedChainId })
    }
  }

  const clearFilters = () => {
    setFilters({})
    setSearch('')
  }

  const hasActiveFilters = Object.keys(filters).length > 0 || search.length > 0

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton count={3} height={200} />
      </div>
    )
  }

  if (error) {
    return (
      <Box variant="error" padding="md" className="text-center">
        <p className="typo-ui text-destructive flex items-center justify-center gap-2">
          <Icon name="warning" size="sm" />
          ERROR LOADING AGENTS
        </p>
        <p className="typo-ui text-destructive/80 mt-2">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </Box>
    )
  }

  const agents = data?.data ?? []

  return (
    <div data-slot="agents-list" className="space-y-6">
      {/* Header with Link Button */}
      {showLinkButton && (
        <div className="flex justify-end">
          <Button
            onClick={onLinkAgent}
            className="typo-ui"
          >
            <Icon name="add" size="sm" className="mr-1" />
            [LINK AGENT]
          </Button>
        </div>
      )}

      {/* Filters */}
      <FilterBar
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={agents.length}
        totalCount={data?.pagination?.total}
        resultsLabel={`AGENT${agents.length !== 1 ? 'S' : ''}`}
      >
        <FilterGroup columns={2}>
          {/* Search by Address/ID */}
          <FilterItem className="md:col-span-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="> SEARCH BY ADDRESS OR ID..."
              debounceMs={300}
            />
          </FilterItem>

          {/* Chain Filter */}
          <FilterItem label="CHAIN">
            <Select onValueChange={handleChainFilter} value={filters.chainId?.toString() ?? 'all'}>
              <SelectTrigger className="typo-ui">
                <SelectValue placeholder="[ALL CHAINS]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">
                  [ALL CHAINS]
                </SelectItem>
                {Object.entries(SUPPORTED_CHAINS).map(([name, id]) => (
                  <SelectItem key={id} value={id.toString()} className="typo-ui">
                    [{name}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>

      {/* Agents Grid */}
      {agents.length === 0 ? (
        hasActiveFilters ? (
          <NoResultsState searchQuery={search} onClear={clearFilters} />
        ) : (
          <EmptyListState
            itemName="agent"
            onCreate={showLinkButton ? onLinkAgent : undefined}
          />
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              organizationId={organizationId}
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
    </div>
  )
}
