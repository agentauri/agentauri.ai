/**
 * Collapsible component
 *
 * Expandable/collapsible section with terminal styling.
 * Shows a clickable header that toggles visibility of content.
 *
 * @module components/atoms/collapsible
 *
 * @example
 * ```tsx
 * <Collapsible title="Advanced Options" defaultOpen={false}>
 *   <p>Hidden content revealed on expand</p>
 * </Collapsible>
 *
 * <Collapsible title="Details" variant="bordered" defaultOpen>
 *   <p>Content visible by default</p>
 * </Collapsible>
 * ```
 */

'use client'

import type * as React from 'react'
import { useId, useState } from 'react'
import { Box, type BoxVariant } from './box'
import { Icon } from './icon'
import { cn } from '@/lib/utils'

interface CollapsibleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  variant?: BoxVariant
  className?: string
}

/**
 * Collapsible section with terminal-styled toggle
 * @param title - Header text displayed in toggle button
 * @param defaultOpen - Initial expanded state (default: false)
 * @param variant - Box variant styling (default: 'subtle')
 */
function Collapsible({
  title,
  children,
  defaultOpen = false,
  variant = 'subtle',
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <Box data-slot="collapsible" variant={variant} padding="sm" className={cn('p-0', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex items-start justify-between gap-3 p-3 typo-ui text-terminal-green hover:bg-terminal/30 transition-colors"
      >
        <span className="text-left">{title}</span>
        <span className="flex items-center gap-2 shrink-0">
          <span className="text-terminal-dim">{isOpen ? '[HIDE]' : '[SHOW]'}</span>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size="sm"
            className="text-terminal-green"
            aria-hidden="true"
          />
        </span>
      </button>
      {isOpen && (
        <div id={contentId} className="p-3 border-t-2 border-terminal-dim">
          {children}
        </div>
      )}
    </Box>
  )
}

export { Collapsible }
