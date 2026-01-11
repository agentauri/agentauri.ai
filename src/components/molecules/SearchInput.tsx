/**
 * SearchInput
 *
 * Terminal-styled search input with clear button, optional debounce, and keyboard shortcuts.
 * Supports both controlled and uncontrolled modes with Enter key submission.
 *
 * @module components/molecules/SearchInput
 *
 * @example
 * ```tsx
 * <SearchInput
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={handleSearch}
 *   debounceMs={300}
 *   placeholder="> SEARCH AGENTS..."
 * />
 * ```
 */

'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'

/** Props for the SearchInput component */
interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  debounceMs?: number
  disabled?: boolean
  className?: string
  showClearButton?: boolean
  autoFocus?: boolean
}

/**
 * Renders a search input with clear button, search icon, and optional debounce indicator.
 */
export function SearchInput({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = '> SEARCH...',
  debounceMs = 0,
  disabled = false,
  className,
  showClearButton = true,
  autoFocus = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '')
  const isControlled = controlledValue !== undefined

  const currentValue = isControlled ? controlledValue : internalValue

  // Debounce logic
  useEffect(() => {
    if (debounceMs === 0 || !onSearch) return

    const timeoutId = setTimeout(() => {
      onSearch(currentValue)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [currentValue, debounceMs, onSearch])

  const handleChange = (newValue: string) => {
    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }

    // Call onSearch immediately if no debounce
    if (debounceMs === 0 && onSearch) {
      onSearch(newValue)
    }

    // Always call onChange for controlled components
    if (onChange && !isControlled) {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    handleChange('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(currentValue)
    }
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div data-slot="search-input" className={cn('relative', className)}>
      <Input
        type="text"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="typo-ui pr-20"
      />

      {/* Search Icon/Indicator */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-terminal-dim pointer-events-none">
        <Icon name="search" size="sm" />
      </div>

      {/* Clear Button */}
      {showClearButton && currentValue && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-terminal-dim hover:text-terminal-bright"
        >
          <Icon name="close" size="sm" aria-hidden="true" />
        </Button>
      )}

      {/* Debounce indicator (subtle) */}
      {debounceMs > 0 && (
        <div className="absolute -bottom-5 right-0 typo-ui text-terminal-dim/50">
          debounce: {debounceMs}ms
        </div>
      )}
    </div>
  )
}

/**
 * CompactSearchInput
 *
 * Minimal search input wrapped in a form for inline use without clear button.
 */

/** Props for the CompactSearchInput component */
interface CompactSearchInputProps extends Omit<SearchInputProps, 'showClearButton'> {
  onSubmit?: (value: string) => void
}

/**
 * Renders a compact search input with form submission support.
 */
export function CompactSearchInput({ onSubmit, ...props }: CompactSearchInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(props.value ?? '')
      }}
      className="relative"
    >
      <SearchInput {...props} showClearButton={false} />
    </form>
  )
}
