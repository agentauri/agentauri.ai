/**
 * DetailPageHeader
 *
 * Page header component for detail pages with back navigation link, title,
 * optional subtitle, and action slot (e.g., for StatusBadge).
 *
 * @module components/molecules/DetailPageHeader
 *
 * @example
 * ```tsx
 * <DetailPageHeader
 *   backHref="/dashboard/triggers"
 *   backLabel="TRIGGERS"
 *   title="Trigger Details"
 *   subtitle="Monitor agent registration events"
 *   action={<StatusBadge enabled={trigger.enabled} />}
 * />
 * ```
 */

'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

/** Props for the DetailPageHeader component */
interface DetailPageHeaderProps {
  /** URL to navigate back to */
  backHref: string
  /** Optional custom back label (default: "BACK") */
  backLabel?: string
  /** Page title */
  title: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Optional action element (e.g., StatusBadge) on the right */
  action?: ReactNode
}

/**
 * Renders a detail page header with back link, title, and optional action slot.
 */
export function DetailPageHeader({
  backHref,
  backLabel = 'BACK',
  title,
  subtitle,
  action,
}: DetailPageHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors inline-flex items-center gap-1"
      >
        [&lt;] {backLabel}
      </Link>

      <div className="border-t-2 border-terminal-dim pt-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="typo-header text-terminal-green glow">{title}</h1>
          {subtitle && (
            <p className="typo-ui text-terminal-dim mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
