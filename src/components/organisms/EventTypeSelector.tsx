/**
 * EventTypeSelector
 *
 * A dropdown selector for choosing blockchain event types.
 * Displays available event types with icons and optional descriptions.
 *
 * @module components/organisms/EventTypeSelector
 *
 * @example
 * ```tsx
 * <EventTypeSelector
 *   value="ReputationUpdated"
 *   onChange={(type) => console.log('Selected:', type)}
 *   showDescription={true}
 * />
 * ```
 */
'use client'

import { Box } from '@/components/atoms/box'
import { Icon, type IconName } from '@/components/atoms/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { EVENT_TYPES, EVENT_TYPE_INFO, type EventType } from '@/lib/constants'
import { cn } from '@/lib/utils'

/**
 * Props for the EventTypeSelector component.
 */
interface EventTypeSelectorProps {
  /** Currently selected event type value */
  value: string
  /** Callback when an event type is selected */
  onChange: (value: EventType) => void
  /** Additional CSS classes */
  className?: string
  /** Whether to show the description box below the selector */
  showDescription?: boolean
}

const EVENT_TYPE_ICONS: Record<string, IconName> = {
  agents: 'agents',
  edit: 'edit',
  star: 'triggers',
  check: 'check',
}

export function EventTypeSelector({
  value,
  onChange,
  className,
  showDescription = true,
}: EventTypeSelectorProps) {
  const selectedEvent = value as EventType
  const selectedInfo = selectedEvent ? EVENT_TYPE_INFO[selectedEvent] : null

  return (
    <div className={cn('space-y-3', className)}>
      <Select value={value} onValueChange={(v) => onChange(v as EventType)}>
        <SelectTrigger className="typo-ui">
          <SelectValue placeholder="Select event type..." />
        </SelectTrigger>
        <SelectContent>
          {Object.values(EVENT_TYPES).map((eventType) => {
            const info = EVENT_TYPE_INFO[eventType]
            const iconName = EVENT_TYPE_ICONS[info.icon] ?? 'lightning'
            return (
              <SelectItem key={eventType} value={eventType} className="typo-ui">
                <div className="flex items-center gap-2">
                  <Icon name={iconName} size="sm" />
                  <span>{eventType}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {showDescription && selectedInfo && (
        <Box variant="subtle" padding="sm">
          <div className="flex items-start gap-2">
            <Icon
              name={EVENT_TYPE_ICONS[selectedInfo.icon] ?? 'lightning'}
              size="md"
              className="text-terminal-green"
            />
            <div className="flex-1 space-y-1">
              <div className="typo-ui text-terminal-green">{selectedEvent}</div>
              <div className="typo-ui text-terminal-dim">{selectedInfo.description}</div>
              <div className="typo-ui text-terminal-dim/70">
                Registry: <span className="text-terminal-green">{selectedInfo.registry.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </Box>
      )}
    </div>
  )
}
