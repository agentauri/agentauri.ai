import { describe, expect, it } from 'vitest'
import { cn } from '../utils'

describe('utils', () => {
  describe('cn (className merger)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'skipped')
      expect(result).toBe('base conditional')
    })

    it('should merge Tailwind classes correctly', () => {
      // twMerge should dedupe and override conflicting Tailwind classes
      const result = cn('px-4 py-2', 'px-8')
      expect(result).toBe('py-2 px-8')
    })

    it('should handle arrays', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle objects', () => {
      const result = cn({
        class1: true,
        class2: false,
        class3: true,
      })
      expect(result).toBe('class1 class3')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })
  })
})
