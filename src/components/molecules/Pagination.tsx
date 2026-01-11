/**
 * Pagination
 *
 * Navigation component for paginated data with page numbers, ellipsis, and prev/next controls.
 * Supports optional first/last page buttons with terminal styling.
 *
 * @module components/molecules/Pagination
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={5}
 *   totalPages={20}
 *   onPageChange={setPage}
 *   showFirstLast
 * />
 * ```
 */

'use client'

import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Props for the Pagination component */
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
}

/**
 * Renders pagination controls with page numbers, ellipsis, and navigation buttons.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = false,
}: PaginationProps) {
  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <nav
      className={cn('flex items-center gap-1', className)}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          aria-label="First page"
          className="typo-ui"
        >
          |&lt;
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size="sm" />
      </Button>

      {getVisiblePages().map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-terminal-dim typo-ui"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className="typo-ui min-w-8"
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
      >
        <Icon name="chevron-right" size="sm" />
      </Button>

      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          aria-label="Last page"
          className="typo-ui"
        >
          &gt;|
        </Button>
      )}
    </nav>
  )
}
