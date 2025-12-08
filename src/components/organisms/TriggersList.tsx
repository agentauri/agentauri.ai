'use client'

import { useState } from 'react'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { LoadingSkeleton } from '@/components/molecules/loading-skeleton'
import { FilterBar, FilterGroup, FilterItem } from '@/components/molecules/FilterBar'
import { SearchInput } from '@/components/molecules/SearchInput'
import { EmptyListState, NoResultsState } from '@/components/molecules/EmptyState'
import { useTriggers } from '@/hooks'
import { REGISTRIES, SUPPORTED_CHAINS, type Registry, type SupportedChainId } from '@/lib/constants'
import type { TriggerFilters } from '@/lib/validations'
import { TriggerCard } from './TriggerCard'

interface TriggersListProps {
  organizationId: string
}

export function TriggersList({ organizationId }: TriggersListProps) {
  const [filters, setFilters] = useState<TriggerFilters>({})
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useTriggers(organizationId, {
    ...filters,
    search: search || undefined,
  })

  const handleChainFilter = (value: string) => {
    if (value === 'all') {
      const { chainId, ...rest } = filters
      setFilters(rest)
    } else {
      setFilters({ ...filters, chainId: Number.parseInt(value, 10) as SupportedChainId })
    }
  }

  const handleRegistryFilter = (value: string) => {
    if (value === 'all') {
      const { registry, ...rest } = filters
      setFilters(rest)
    } else {
      setFilters({ ...filters, registry: value as Registry })
    }
  }

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      const { enabled, ...rest } = filters
      setFilters(rest)
    } else {
      setFilters({ ...filters, enabled: value === 'enabled' })
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
          ERROR LOADING TRIGGERS
        </p>
        <p className="typo-ui text-destructive/80 mt-2">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </Box>
    )
  }

  const triggers = data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FilterBar
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={triggers.length}
        totalCount={data?.pagination?.total}
        resultsLabel={`TRIGGER${triggers.length !== 1 ? 'S' : ''}`}
      >
        <FilterGroup columns={4}>
          {/* Search */}
          <FilterItem className="md:col-span-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="> SEARCH TRIGGERS..."
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

          {/* Registry Filter */}
          <FilterItem label="REGISTRY">
            <Select onValueChange={handleRegistryFilter} value={filters.registry ?? 'all'}>
              <SelectTrigger className="typo-ui">
                <SelectValue placeholder="[ALL REGISTRIES]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">
                  [ALL REGISTRIES]
                </SelectItem>
                {REGISTRIES.map((registry) => (
                  <SelectItem key={registry} value={registry} className="typo-ui">
                    [{registry.toUpperCase()}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Status Filter */}
          <FilterItem label="STATUS">
            <Select
              onValueChange={handleStatusFilter}
              value={
                filters.enabled === undefined ? 'all' : filters.enabled ? 'enabled' : 'disabled'
              }
            >
              <SelectTrigger className="typo-ui">
                <SelectValue placeholder="[ALL STATUS]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">
                  [ALL STATUS]
                </SelectItem>
                <SelectItem value="enabled" className="typo-ui">
                  [ENABLED]
                </SelectItem>
                <SelectItem value="disabled" className="typo-ui">
                  [DISABLED]
                </SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>

      {/* Triggers Grid */}
      {triggers.length === 0 ? (
        hasActiveFilters ? (
          <NoResultsState searchQuery={search} onClear={clearFilters} />
        ) : (
          <EmptyListState itemName="trigger" />
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {triggers.map((trigger) => (
            <TriggerCard key={trigger.id} trigger={trigger} />
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
