'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Default character set for glitch effect - terminal/hacker aesthetic with box drawing */
const DEFAULT_CHAR_SET = '0123456789ABCDEF!@#$%^&*<>[]{}|┌┐└┘─│├┤┬┴┼'

export interface UseGlitchAnimationOptions {
  /** Target text to resolve to */
  targetText: string
  /** Duration in milliseconds (default: 1500) */
  duration?: number
  /** Character set for scramble effect */
  charSet?: string
  /** Whether to auto-start on mount (default: true) */
  autoPlay?: boolean
  /** Callback when animation completes */
  onComplete?: () => void
}

export interface UseGlitchAnimationReturn {
  /** Current displayed text (with glitch characters during animation) */
  displayText: string
  /** Whether animation is currently in progress */
  isAnimating: boolean
  /** Start or restart the animation */
  start: () => void
  /** Stop the animation immediately */
  stop: () => void
  /** Reset to initial scrambled state */
  reset: () => void
}

/**
 * Hook for Matrix-style glitch text animation
 *
 * Creates a text scramble/reveal effect where characters start as random
 * symbols and progressively resolve to the target text. Perfect for
 * terminal-styled UIs, cyberpunk aesthetics, and dramatic text reveals.
 *
 * Features:
 * - Preserves whitespace during animation
 * - Configurable character set for scramble effect
 * - Progressive reveal with randomized timing
 * - Auto-play or manual trigger support
 *
 * @param options - Animation configuration options
 * @returns Animation state and control functions
 *
 * @example
 * ```tsx
 * function HeroTitle() {
 *   const { displayText, isAnimating } = useGlitchAnimation({
 *     targetText: 'WELCOME TO THE MATRIX',
 *     duration: 2000,
 *   })
 *
 *   return (
 *     <h1 className="font-mono text-green-500">
 *       {displayText}
 *       {isAnimating && <span className="animate-pulse">_</span>}
 *     </h1>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual trigger with callback
 * function TypewriterMessage({ message }: { message: string }) {
 *   const { displayText, start, isAnimating } = useGlitchAnimation({
 *     targetText: message,
 *     autoPlay: false,
 *     onComplete: () => console.log('Animation finished'),
 *   })
 *
 *   return (
 *     <div>
 *       <p>{displayText}</p>
 *       <button onClick={start} disabled={isAnimating}>
 *         Reveal Message
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom character set for different aesthetics
 * function BinaryReveal({ text }: { text: string }) {
 *   const { displayText } = useGlitchAnimation({
 *     targetText: text,
 *     charSet: '01', // Binary only
 *     duration: 3000,
 *   })
 *
 *   return <code>{displayText}</code>
 * }
 * ```
 */
export function useGlitchAnimation({
  targetText,
  duration = 1500,
  charSet = DEFAULT_CHAR_SET,
  autoPlay = true,
  onComplete,
}: UseGlitchAnimationOptions): UseGlitchAnimationReturn {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const resolvedIndicesRef = useRef<Set<number>>(new Set())

  /** Generate a random character from the charset */
  const getRandomChar = useCallback(() => {
    return charSet[Math.floor(Math.random() * charSet.length)]
  }, [charSet])

  /** Generate initial scrambled text (preserving whitespace) */
  const generateScrambled = useCallback(() => {
    return targetText
      .split('')
      .map((char) => {
        if (char === ' ' || char === '\n') return char
        return getRandomChar()
      })
      .join('')
  }, [targetText, getRandomChar])

  /** Stop animation and cleanup */
  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    setIsAnimating(false)
  }, [])

  /** Reset to scrambled state */
  const reset = useCallback(() => {
    stop()
    resolvedIndicesRef.current.clear()
    startTimeRef.current = null
    setDisplayText(generateScrambled())
  }, [stop, generateScrambled])

  /** Start the animation */
  const start = useCallback(() => {
    stop()
    resolvedIndicesRef.current.clear()
    startTimeRef.current = null
    setIsAnimating(true)

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Calculate how many characters should be resolved by now
      const totalNonWhitespace = targetText
        .split('')
        .filter((c) => c !== ' ' && c !== '\n').length
      const targetResolved = Math.floor(progress * totalNonWhitespace)

      // Build the display string
      let result = ''
      let _nonWhitespaceIndex = 0

      for (let i = 0; i < targetText.length; i++) {
        const targetChar = targetText[i]

        // Preserve whitespace
        if (targetChar === ' ' || targetChar === '\n') {
          result += targetChar
          continue
        }

        // Check if this character should be resolved
        if (resolvedIndicesRef.current.has(i)) {
          result += targetChar
        } else if (resolvedIndicesRef.current.size < targetResolved) {
          // Randomly decide to resolve this character
          // Higher chance as we get closer to the end
          const resolveChance = 0.3 + progress * 0.5
          if (Math.random() < resolveChance || progress > 0.95) {
            resolvedIndicesRef.current.add(i)
            result += targetChar
          } else {
            result += getRandomChar()
          }
        } else {
          // Still scrambling
          result += getRandomChar()
        }

        _nonWhitespaceIndex++
      }

      setDisplayText(result)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        // Ensure final state is exact target
        setDisplayText(targetText)
        setIsAnimating(false)
        frameRef.current = null
        onComplete?.()
      }
    }

    frameRef.current = requestAnimationFrame(animate)
  }, [targetText, duration, getRandomChar, onComplete, stop])

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay) {
      start()
    } else {
      setDisplayText(generateScrambled())
    }

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, generateScrambled, start]) // Only run on mount

  // Update display text if target changes (without animation)
  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(targetText)
    }
  }, [targetText, isAnimating])

  return {
    displayText,
    isAnimating,
    start,
    stop,
    reset,
  }
}
