'use client'

import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

export type EditorMode = 'ui' | 'json'

interface JsonEditorToggleProps {
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  className?: string
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
