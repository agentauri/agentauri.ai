/**
 * LoadingSkeleton
 *
 * Collection of skeleton loading components for various UI patterns including
 * pages, cards, tables, and forms. Used as placeholders while content loads.
 *
 * @module components/molecules/LoadingSkeleton
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton className="h-8 w-32" />
 *
 * // Pre-built patterns
 * <PageSkeleton />
 * <CardSkeleton />
 * <TableSkeleton rows={5} />
 * <FormSkeleton />
 * <LoadingSkeleton count={3} height={100} />
 * ```
 */

import { cn } from '@/lib/utils'

/** Props for the Skeleton component */
interface SkeletonProps {
  className?: string
}

/**
 * Base skeleton element with pulse animation.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

/**
 * Full page skeleton layout with header, stats grid, and content areas.
 */
export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <Skeleton className="mb-6 h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[350px]" />
            <Skeleton className="h-[350px]" />
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * Card-shaped skeleton with title, value, and description placeholders.
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

/**
 * Table skeleton with header and configurable row count.
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border">
      <div className="border-b p-4">
        <div className="flex items-center gap-4">
          {[...Array(4)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      {[...Array(rows)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
        <div key={i} className="flex items-center gap-4 border-b p-4 last:border-b-0">
          {[...Array(4)].map((_, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            <Skeleton key={j} className="h-4 w-24" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Form skeleton with labeled input fields and submit button.
 */
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

/**
 * Generic loading skeleton with configurable count and height.
 */
export function LoadingSkeleton({ count = 3, height = 100 }: { count?: number; height?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
        <Skeleton key={i} className={`h-[${height}px]`} />
      ))}
    </div>
  )
}
