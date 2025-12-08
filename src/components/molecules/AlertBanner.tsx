/**
 * Alert banner component for displaying important messages
 * Terminal/brutalist styling
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Icon, type IconName } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertBannerProps {
  variant?: AlertVariant
  title?: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const variantStyles: Record<AlertVariant, { border: string; bg: string; text: string; icon: IconName }> = {
  info: {
    border: 'border-terminal',
    bg: 'bg-terminal/20',
    text: 'text-terminal-bright',
    icon: 'info',
  },
  success: {
    border: 'border-terminal-green',
    bg: 'bg-terminal-green/10',
    text: 'text-terminal-green',
    icon: 'check',
  },
  warning: {
    border: 'border-terminal-yellow',
    bg: 'bg-terminal-yellow/10',
    text: 'text-terminal-yellow',
    icon: 'warning',
  },
  error: {
    border: 'border-destructive',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    icon: 'close',
  },
}

export function AlertBanner({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  className,
}: AlertBannerProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const styles = variantStyles[variant]

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div
      className={cn(
        'border-2 p-4',
        styles.border,
        styles.bg,
        className
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className={cn('flex-shrink-0', styles.text)}>
            <Icon name={styles.icon} size="sm" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <div className={`typo-ui mb-1 ${styles.text}`}>
                {title}
              </div>
            )}
            <div className="typo-ui text-terminal-dim">
              {message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {action && (
            <Button
              size="sm"
              variant="ghost"
              onClick={action.onClick}
              className="typo-ui h-auto py-1 px-2"
            >
              {action.label}
            </Button>
          )}
          {dismissible && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="typo-ui h-auto py-1 px-2"
              aria-label="Dismiss"
            >
              <Icon name="close" size="sm" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
