/**
 * Skeleton component
 *
 * Loading placeholder with pulse animation.
 * Use to indicate content is loading.
 *
 * @module components/atoms/skeleton
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[200px]" />
 * <Skeleton className="h-12 w-full" />
 * ```
 */

import { cn } from '@/lib/utils'

/** Animated loading placeholder */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
