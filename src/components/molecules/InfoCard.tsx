/**
 * InfoCard
 *
 * Container component for displaying structured information with title and content.
 * Supports multiple variants (default, highlight, subtle) with terminal-themed styling.
 *
 * @module components/molecules/InfoCard
 *
 * @example
 * ```tsx
 * <InfoCard title="AGENT DETAILS" variant="highlight">
 *   <InfoCardItem label="Address" value="0x1234...5678" />
 *   <InfoCardItem label="Status" value="Active" />
 * </InfoCard>
 * ```
 */

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/** Props for the InfoCard component */
interface InfoCardProps {
  title: string
  children: ReactNode
  variant?: 'default' | 'highlight' | 'subtle'
  className?: string
}

/**
 * Renders a bordered card with title header and content area.
 */
export function InfoCard({ title, children, variant = 'default', className }: InfoCardProps) {
  const variantStyles = {
    default: 'border-terminal-dim bg-terminal/10',
    highlight: 'border-terminal-green bg-terminal-green/10',
    subtle: 'border-terminal-dim/50 bg-terminal/5',
  }

  return (
    <div className={cn('border-2 p-4', variantStyles[variant], className)}>
      <div className="typo-ui text-terminal-green mb-2">&gt; {title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

/**
 * InfoCardItem
 *
 * Displays a key-value pair within an InfoCard.
 */

/** Props for the InfoCardItem component */
interface InfoCardItemProps {
  label?: string
  value: ReactNode
  className?: string
}

/**
 * Renders a labeled value or standalone value within an InfoCard.
 */
export function InfoCardItem({ label, value, className }: InfoCardItemProps) {
  if (label) {
    return (
      <div className={cn('typo-ui', className)}>
        <span className="text-terminal-dim">{label}: </span>
        <span className="text-terminal-bright">{value}</span>
      </div>
    )
  }

  return <div className={cn('typo-ui text-terminal-dim', className)}>{value}</div>
}

/**
 * InfoCardList
 *
 * Displays a list of items with optional numbering within an InfoCard.
 */

/** Props for the InfoCardList component */
interface InfoCardListProps {
  items: Array<ReactNode | string>
  numbered?: boolean
  className?: string
}

/**
 * Renders a numbered or unnumbered list of items.
 */
export function InfoCardList({ items, numbered = true, className }: InfoCardListProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list, no reorder
        <div key={index} className="typo-ui text-terminal-dim">
          {numbered && <span>[{index + 1}] </span>}
          {item}
        </div>
      ))}
    </div>
  )
}
