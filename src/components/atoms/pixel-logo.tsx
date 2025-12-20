'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { usePixelAnimation } from '@/hooks/use-pixel-animation'

// 5x7 pixel matrix for each letter (1 = filled, 0 = empty)
const PIXEL_LETTERS: Record<string, number[][]> = {
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  '.': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
  ],
  '[': [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
  ],
  ']': [
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1],
  ],
}

const LETTER_WIDTH = 5
const LETTER_HEIGHT = 7
const PIXEL_SIZE = 6
const PIXEL_GAP = 2
const LETTER_GAP = 3 // Extra gap between letters

export type PixelLogoAnimation = 'none' | 'boot'

export interface PixelLogoProps {
  /** Text to display (default: "AGENTAURI.AI") */
  text?: string
  /** Animation type */
  animation?: PixelLogoAnimation
  /** Whether animation should play on mount (default: true) */
  autoPlay?: boolean
  /** Boot animation duration in ms (default: 2000) */
  bootDuration?: number
  /** Whether to show glow effect (default: true) */
  glow?: boolean
  /** Additional CSS classes */
  className?: string
  /** Callback when boot animation completes */
  onAnimationComplete?: () => void
}

interface PixelData {
  x: number
  y: number
  index: number
}

function getPixelsForText(text: string): { pixels: PixelData[]; width: number; height: number } {
  const pixels: PixelData[] = []
  let currentX = 0
  let index = 0

  for (const char of text.toUpperCase()) {
    const letterMatrix = PIXEL_LETTERS[char]
    if (!letterMatrix) continue

    for (let row = 0; row < LETTER_HEIGHT; row++) {
      const rowData = letterMatrix[row]
      if (!rowData) continue
      for (let col = 0; col < LETTER_WIDTH; col++) {
        if (rowData[col] === 1) {
          pixels.push({
            x: currentX + col * (PIXEL_SIZE + PIXEL_GAP),
            y: row * (PIXEL_SIZE + PIXEL_GAP),
            index: index++,
          })
        }
      }
    }

    currentX += LETTER_WIDTH * (PIXEL_SIZE + PIXEL_GAP) + LETTER_GAP * PIXEL_SIZE
  }

  const width = currentX - LETTER_GAP * PIXEL_SIZE
  const height = LETTER_HEIGHT * (PIXEL_SIZE + PIXEL_GAP) - PIXEL_GAP

  return { pixels, width, height }
}

export function PixelLogo({
  text = 'AGENTAURI.AI',
  animation = 'boot',
  autoPlay = true,
  bootDuration = 2000,
  glow = true,
  className,
  onAnimationComplete,
}: PixelLogoProps) {
  const { pixels, width, height } = useMemo(() => getPixelsForText(text), [text])

  const { phase, visiblePixels, glitchingPixels, startBoot } = usePixelAnimation({
    totalPixels: pixels.length,
    bootDuration,
    autoPlay: animation === 'boot' && autoPlay,
    onBootComplete: onAnimationComplete,
  })

  const showAllPixels = animation === 'none' || phase === 'pulse' || phase === 'idle'

  return (
    <div
      data-slot="pixel-logo"
      role="img"
      aria-label={text}
      onClick={phase === 'pulse' || phase === 'idle' ? startBoot : undefined}
      className={cn(
        'inline-block',
        (phase === 'pulse' || phase === 'idle') && 'cursor-pointer',
        className
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn(
          'w-full max-w-4xl h-auto',
          glow && 'pixel-logo-glow',
          phase === 'pulse' && 'pixel-pulse',
          phase === 'glitch' && 'pixel-glitch'
        )}
        style={{
          filter: glow ? 'drop-shadow(0 0 10px #33FF33) drop-shadow(0 0 20px #33FF3380)' : undefined,
        }}
      >
        {pixels.map((pixel) => {
          const isVisible = showAllPixels || visiblePixels.has(pixel.index)
          const isGlitching = glitchingPixels.has(pixel.index)

          return (
            <rect
              key={pixel.index}
              x={pixel.x}
              y={pixel.y}
              width={PIXEL_SIZE}
              height={PIXEL_SIZE}
              fill={isGlitching ? '#66FF66' : '#33FF33'}
              opacity={isVisible ? 1 : 0}
              className={cn(
                'transition-opacity duration-75',
                isGlitching && 'animate-pulse'
              )}
            />
          )
        })}
      </svg>
    </div>
  )
}

export { PIXEL_LETTERS }
