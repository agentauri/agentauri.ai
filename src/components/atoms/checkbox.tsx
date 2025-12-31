'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 shrink-0 border-2 border-terminal-green',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terminal-green',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'flex items-center justify-center',
            'cursor-pointer',
            checked && 'bg-terminal-green',
            className
          )}
          onClick={() => !disabled && onCheckedChange?.(!checked)}
          aria-hidden="true"
        >
          {checked && (
            <span className="text-terminal typo-ui text-[10px] font-bold">
              X
            </span>
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
