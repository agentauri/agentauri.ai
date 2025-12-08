/**
 * Generic filter bar component with search, filters, and clear functionality
 * Designed for terminal/brutalist aesthetic
 */

import type { ReactNode } from 'react'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  children: ReactNode
  onClearFilters?: () => void
  hasActiveFilters?: boolean
  resultsCount?: number
  totalCount?: number
  resultsLabel?: string
  className?: string
}

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
 * Filter group for organizing related filters
 */
interface FilterGroupProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

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
 * Individual filter item wrapper
 */
interface FilterItemProps {
  label?: string
  children: ReactNode
  className?: string
}

export function FilterItem({ label, children, className }: FilterItemProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="typo-ui text-terminal-green">{label}</div>}
      {children}
    </div>
  )
}
