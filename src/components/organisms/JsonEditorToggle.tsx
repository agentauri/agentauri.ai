/**
 * JsonEditorToggle
 *
 * A toggle button group for switching between UI mode and JSON mode
 * in the trigger editor form.
 *
 * @module components/organisms/JsonEditorToggle
 *
 * @example
 * ```tsx
 * <JsonEditorToggle
 *   mode="ui"
 *   onModeChange={(mode) => console.log('Switched to:', mode)}
 * />
 * ```
 */
'use client'

import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

/** Editor mode type - either UI wizard or JSON editor */
export type EditorMode = 'ui' | 'json'

/**
 * Props for the JsonEditorToggle component.
 */
interface JsonEditorToggleProps {
  /** Current editor mode */
  mode: EditorMode
  /** Callback when mode is changed */
  onModeChange: (mode: EditorMode) => void
  /** Additional CSS classes */
  className?: string
  /** Whether the toggle is disabled */
  disabled?: boolean
}

export function JsonEditorToggle({
  mode,
  onModeChange,
  className,
  disabled = false,
}: JsonEditorToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex border-2 border-terminal bg-terminal/30 p-1',
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onModeChange('ui')}
        disabled={disabled}
        className={cn(
          'typo-ui px-4 py-2 transition-colors',
          mode === 'ui'
            ? 'bg-terminal text-terminal-green glow'
            : 'text-terminal-dim hover:text-terminal-bright'
        )}
      >
        [UI MODE]
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onModeChange('json')}
        disabled={disabled}
        className={cn(
          'typo-ui px-4 py-2 transition-colors',
          mode === 'json'
            ? 'bg-terminal text-terminal-green glow'
            : 'text-terminal-dim hover:text-terminal-bright'
        )}
      >
        [JSON MODE]
      </Button>
    </div>
  )
}
