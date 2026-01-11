/**
 * FilterBar
 *
 * Container component for filter controls with clear functionality and results count display.
 * Designed for terminal/brutalist aesthetic with support for grouped filters.
 *
 * @module components/molecules/FilterBar
 *
 * @example
 * ```tsx
 * <FilterBar
 *   onClearFilters={handleClear}
 *   hasActiveFilters={hasFilters}
 *   resultsCount={25}
 *   totalCount={100}
 * >
 *   <FilterGroup columns={3}>
 *     <FilterItem label="STATUS">...</FilterItem>
 *   </FilterGroup>
 * </FilterBar>
 * ```
 */

import type { ReactNode } from 'react'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Props for the FilterBar component */
interface FilterBarProps {
  children: ReactNode
  onClearFilters?: () => void
  hasActiveFilters?: boolean
  resultsCount?: number
  totalCount?: number
  resultsLabel?: string
  className?: string
}

/**
 * Renders a filter bar container with filter controls and optional results summary.
 */
export function FilterBar({
  children,
  onClearFilters,
  hasActiveFilters = false,
  resultsCount,
  totalCount,
  resultsLabel = 'RESULTS',
  className,
}: FilterBarProps) {
  return (
    <Box variant="default" padding="md" className={className}>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-4">
        {children}

        {/* Clear Filters Button */}
        {onClearFilters && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="typo-ui flex items-center gap-1"
            >
              <Icon name="close" size="sm" />
              CLEAR FILTERS
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      {resultsCount !== undefined && (
        <div className="typo-ui text-terminal-dim mt-4 pt-4 border-t border-terminal-dim">
          &gt; SHOWING {resultsCount} {resultsLabel}
          {totalCount !== undefined && resultsCount !== totalCount && ` OF ${totalCount} TOTAL`}
        </div>
      )}
    </Box>
  )
}

/**
 * FilterGroup
 *
 * Grid container for organizing related filter controls in responsive columns.
 */

/** Props for the FilterGroup component */
interface FilterGroupProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

/**
 * Renders a responsive grid for filter controls.
 */
export function FilterGroup({ children, columns = 4, className }: FilterGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return <div className={cn('grid gap-4', gridCols[columns], className)}>{children}</div>
}

/**
 * FilterItem
 *
 * Wrapper for individual filter controls with optional label.
 */

/** Props for the FilterItem component */
interface FilterItemProps {
  label?: string
  children: ReactNode
  className?: string
}

/**
 * Renders a labeled container for a filter control.
 */
export function FilterItem({ label, children, className }: FilterItemProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="typo-ui text-terminal-green">{label}</div>}
      {children}
    </div>
  )
}
