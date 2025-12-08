'use client'

import * as React from 'react'
import { useState } from 'react'
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

function Collapsible({
  title,
  children,
  defaultOpen = false,
  variant = 'subtle',
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Box variant={variant} padding="sm" className={cn('p-0', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-3 p-3 typo-ui text-terminal-green hover:bg-terminal/30 transition-colors"
      >
        <span className="text-left">{title}</span>
        <span className="flex items-center gap-2 shrink-0">
          <span className="text-terminal-dim">{isOpen ? '[HIDE]' : '[SHOW]'}</span>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size="sm"
            className="text-terminal-green"
          />
        </span>
      </button>
      {isOpen && (
        <div className="p-3 border-t-2 border-terminal-dim">
          {children}
        </div>
      )}
    </Box>
  )
}

export { Collapsible }
