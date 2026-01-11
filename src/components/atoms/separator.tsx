/**
 * Separator component
 *
 * Visual divider for separating content sections.
 * Supports horizontal and vertical orientations.
 *
 * @module components/atoms/separator
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * ```
 */

'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/** Visual divider with horizontal/vertical orientations */
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
