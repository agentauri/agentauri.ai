/**
 * Clipboard hooks
 *
 * React hook for copying text to clipboard with toast notifications.
 * Includes automatic state reset and manual reset capability.
 *
 * @module hooks/use-copy-to-clipboard
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'

/**
 * Options for useCopyToClipboard hook
 */
interface UseCopyToClipboardOptions {
  /** Toast message on success (default: 'Copied to clipboard') */
  successMessage?: string
  /** Toast message on error (default: 'Failed to copy') */
  errorMessage?: string
  /** Timeout for copied state reset in ms (default: 2000) */
  timeout?: number
}

/**
 * Return type for useCopyToClipboard hook
 */
interface UseCopyToClipboardReturn {
  /** Whether the copy operation was recently successful */
  copied: boolean
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>
  /** Reset the copied state manually */
  reset: () => void
}

/**
 * Hook for copying text to clipboard with toast notifications
 *
 * Provides clipboard functionality with:
 * - Toast notifications on success/error
 * - Automatic state reset after timeout
 * - Manual reset capability
 *
 * @param options - Configuration options
 * @returns Clipboard state and copy function
 *
 * @example
 * ```tsx
 * function CopyButton({ text }: { text: string }) {
 *   const { copied, copy } = useCopyToClipboard()
 *
 *   return (
 *     <Button onClick={() => copy(text)}>
 *       <Icon name={copied ? 'check' : 'copy'} />
 *       {copied ? 'Copied!' : 'Copy'}
 *     </Button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom messages
 * function AddressCopy({ address }: { address: string }) {
 *   const { copied, copy } = useCopyToClipboard({
 *     successMessage: 'Address copied!',
 *     errorMessage: 'Could not copy address',
 *     timeout: 3000,
 *   })
 *
 *   return (
 *     <button onClick={() => copy(address)}>
 *       {address.slice(0, 6)}...{address.slice(-4)}
 *       <Icon name={copied ? 'check' : 'copy'} />
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual reset
 * function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
 *   const { copied, copy, reset } = useCopyToClipboard()
 *
 *   // Reset when key changes
 *   useEffect(() => {
 *     reset()
 *   }, [apiKey, reset])
 *
 *   return <Button onClick={() => copy(apiKey)}>Copy Key</Button>
 * }
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
