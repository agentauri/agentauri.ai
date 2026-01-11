/**
 * EventsList
 *
 * Displays a filterable grid of blockchain event cards with search,
 * chain, registry, and event type filters. Handles loading states,
 * errors, and empty states.
 *
 * @module components/organisms/EventsList
 *
 * @example
 * ```tsx
 * // All events
 * <EventsList />
 *
 * // Events for a specific agent
 * <EventsList agentId={42} />
 * ```
 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { ApiErrorDisplay, LoadingSkeleton } from '@/components/molecules'
import { FilterBar, FilterGroup, FilterItem } from '@/components/molecules/FilterBar'
import { SearchInput } from '@/components/molecules/SearchInput'
import { EmptyListState, NoResultsState } from '@/components/molecules/EmptyState'
import { useEvents } from '@/hooks'
import { REGISTRIES, SUPPORTED_CHAINS, type Registry, type SupportedChainId } from '@/lib/constants'
import { EVENT_TYPES } from '@/lib/validations/event'
import type { EventFilters } from '@/lib/validations/event'
import { EventCard } from './EventCard'

/**
 * Props for the EventsList component.
 */
interface EventsListProps {
  /** Optional agent ID to filter events by */
  agentId?: number
}

export function EventsList({ agentId }: EventsListProps) {
  const [filters, setFilters] = useState<EventFilters>(agentId ? { agentId } : {})
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useEvents({
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

  const handleRegistryFilter = (value: string) => {
    if (value === 'all') {
      const { registry, ...rest } = filters
      setFilters(rest)
    } else {
      setFilters({ ...filters, registry: value as Registry })
    }
  }

  const handleEventTypeFilter = (value: string) => {
    if (value === 'all') {
      const { eventType, ...rest } = filters
      setFilters(rest)
    } else {
      setFilters({ ...filters, eventType: value })
    }
  }

  const clearFilters = () => {
    setFilters(agentId ? { agentId } : {})
    setSearch('')
  }

  const hasActiveFilters =
    Object.keys(filters).filter((k) => k !== 'agentId').length > 0 || search.length > 0

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
        title="ERROR LOADING EVENTS"
      />
    )
  }

  const events = data?.data ?? []

  return (
    <div data-slot="events-list" className="space-y-6">
      {/* Filters */}
      <FilterBar
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={events.length}
        totalCount={data?.pagination?.total}
        resultsLabel={`EVENT${events.length !== 1 ? 'S' : ''}`}
      >
        <FilterGroup columns={4}>
          {/* Search by TX Hash */}
          <FilterItem className="md:col-span-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="> SEARCH BY TX HASH..."
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

          {/* Event Type Filter */}
          <FilterItem label="EVENT TYPE">
            <Select onValueChange={handleEventTypeFilter} value={filters.eventType ?? 'all'}>
              <SelectTrigger className="typo-ui">
                <SelectValue placeholder="[ALL TYPES]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">
                  [ALL TYPES]
                </SelectItem>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="typo-ui">
                    [{type.toUpperCase()}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>

      {/* Events Grid */}
      {events.length === 0 ? (
        hasActiveFilters ? (
          <NoResultsState searchQuery={search} onClear={clearFilters} />
        ) : (
          <EmptyListState itemName="event" />
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
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
