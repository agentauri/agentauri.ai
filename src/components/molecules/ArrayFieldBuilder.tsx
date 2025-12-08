/**
 * Generic array field builder component
 * Reduces duplication in ConditionBuilder and ActionBuilder patterns
 */

import { ActionLabel } from '@/components/atoms/action-label'
import { Button } from '@/components/atoms/button'
import type { ReactNode } from 'react'

interface ArrayFieldBuilderProps<T> {
  items: T[]
  onAdd: () => void
  onUpdate: (index: number, item: T) => void
  onRemove: (index: number) => void
  canRemove: boolean
  addButtonLabel: string
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  emptyMessage?: string
}

export function ArrayFieldBuilder<T>({
  items,
  onAdd,
  onUpdate: _onUpdate,
  onRemove,
  canRemove,
  addButtonLabel,
  renderItem,
  className = '',
  emptyMessage,
}: ArrayFieldBuilderProps<T>) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.length === 0 && emptyMessage ? (
        <div className="typo-ui text-terminal-dim italic p-4 border-2 border-dashed border-terminal-dim">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="relative">
              {renderItem(item, index)}
              {items.length > 1 && (
                <ActionLabel
                  variant="destructive"
                  icon="close"
                  onClick={() => onRemove(index)}
                  disabled={!canRemove}
                  className="absolute top-4 right-4"
                >
                  REMOVE
                </ActionLabel>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="typo-ui mt-4 w-full"
      >
        {addButtonLabel}
      </Button>
    </div>
  )
}

/**
 * Wrapper for form field arrays with validation messages
 */
interface FormArrayFieldBuilderProps<T> extends Omit<ArrayFieldBuilderProps<T>, 'items' | 'canRemove'> {
  value: T[] | undefined
  error?: string
  minItems?: number
}

export function FormArrayFieldBuilder<T>({
  value = [],
  error,
  minItems = 1,
  ...props
}: FormArrayFieldBuilderProps<T>) {
  return (
    <div className="space-y-2">
      <ArrayFieldBuilder
        items={value}
        canRemove={value.length > minItems}
        {...props}
      />
      {error && (
        <p className="typo-ui text-destructive mt-2">{error}</p>
      )}
    </div>
  )
}
