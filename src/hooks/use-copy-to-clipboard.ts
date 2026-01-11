import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'

interface UseCopyToClipboardOptions {
  /** Toast message on success (default: 'Copied to clipboard') */
  successMessage?: string
  /** Toast message on error (default: 'Failed to copy') */
  errorMessage?: string
  /** Timeout for copied state reset in ms (default: 2000) */
  timeout?: number
}

interface UseCopyToClipboardReturn {
  /** Whether the copy operation was recently successful */
  copied: boolean
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>
  /** Reset the copied state */
  reset: () => void
}

/**
 * Hook for copying text to clipboard with toast notifications
 *
 * @example
 * ```tsx
 * const { copied, copy } = useCopyToClipboard({ successMessage: 'Address copied!' })
 *
 * return (
 *   <button onClick={() => copy(address)}>
 *     <Icon name={copied ? 'check' : 'copy'} />
 *   </button>
 * )
 * ```
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const {
    successMessage = 'Copied to clipboard',
    errorMessage = 'Failed to copy',
    timeout = 2000,
  } = options

  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCopied(false)
  }, [])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success(successMessage)
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
          timeoutRef.current = null
        }, timeout)
        return true
      } catch {
        toast.error(errorMessage)
        return false
      }
    },
    [successMessage, errorMessage, timeout]
  )

  return { copied, copy, reset }
}
