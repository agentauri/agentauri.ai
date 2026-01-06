/**
 * Reusable info card component for displaying structured data
 * Terminal-themed design consistent with the app
 */

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  children: ReactNode
  variant?: 'default' | 'highlight' | 'subtle'
  className?: string
}

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
 * Info card item for key-value pairs
 */
interface InfoCardItemProps {
  label?: string
  value: ReactNode
  className?: string
}

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
 * Info card list for array data
 */
interface InfoCardListProps {
  items: Array<ReactNode | string>
  numbered?: boolean
  className?: string
}

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
