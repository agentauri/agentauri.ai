import { cn } from './utils'

describe('cn utility function', () => {
  describe('Basic Functionality', () => {
    it('should merge single class name', () => {
      const result = cn('test-class')
      expect(result).toBe('test-class')
    })

    it('should merge multiple class names', () => {
      const result = cn('class-1', 'class-2', 'class-3')
      expect(result).toBe('class-1 class-2 class-3')
    })

    it('should handle empty strings', () => {
      const result = cn('', 'class-1', '', 'class-2')
      expect(result).toBe('class-1 class-2')
    })

    it('should handle undefined values', () => {
      const result = cn('class-1', undefined, 'class-2')
      expect(result).toBe('class-1 class-2')
    })

    it('should handle null values', () => {
      const result = cn('class-1', null, 'class-2')
      expect(result).toBe('class-1 class-2')
    })

    it('should handle boolean values', () => {
      const result = cn('class-1', false, 'class-2', true)
      expect(result).toBe('class-1 class-2')
    })

    it('should return empty string for no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should return empty string for all falsy values', () => {
      const result = cn(false, null, undefined, '', 0)
      expect(result).toBe('')
    })
  })

  describe('Conditional Classes', () => {
    it('should handle conditional class names with objects', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'highlighted': true,
      })
      expect(result).toBe('active highlighted')
    })

    it('should handle mixed conditional and string classes', () => {
      const result = cn('base-class', {
        'active': true,
        'disabled': false,
      })
      expect(result).toBe('base-class active')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class-1', 'class-2'], 'class-3')
      expect(result).toBe('class-1 class-2 class-3')
    })

    it('should handle nested arrays', () => {
      const result = cn(['class-1', ['class-2', 'class-3']], 'class-4')
      expect(result).toBe('class-1 class-2 class-3 class-4')
    })

    it('should handle complex nested structures', () => {
      const result = cn(
        'base',
        ['array-1', 'array-2'],
        { conditional: true, skipped: false },
        undefined,
        'final'
      )
      expect(result).toBe('base array-1 array-2 conditional final')
    })
  })

  describe('Tailwind CSS Conflict Resolution', () => {
    it('should resolve conflicting padding classes', () => {
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })

    it('should resolve conflicting margin classes', () => {
      const result = cn('m-2', 'm-6')
      expect(result).toBe('m-6')
    })

    it('should resolve conflicting text color classes', () => {
      const result = cn('text-red-500', 'text-blue-500')
      expect(result).toBe('text-blue-500')
    })

    it('should resolve conflicting background color classes', () => {
      const result = cn('bg-gray-100', 'bg-white')
      expect(result).toBe('bg-white')
    })

    it('should resolve conflicting width classes', () => {
      const result = cn('w-full', 'w-1/2')
      expect(result).toBe('w-1/2')
    })

    it('should resolve conflicting height classes', () => {
      const result = cn('h-screen', 'h-full')
      expect(result).toBe('h-full')
    })

    it('should resolve conflicting display classes', () => {
      const result = cn('block', 'flex', 'inline')
      expect(result).toBe('inline')
    })

    it('should resolve conflicting position classes', () => {
      const result = cn('absolute', 'relative', 'fixed')
      expect(result).toBe('fixed')
    })

    it('should keep non-conflicting classes', () => {
      const result = cn('p-4', 'text-red-500', 'bg-blue-100', 'm-2')
      expect(result).toContain('p-4')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-100')
      expect(result).toContain('m-2')
    })

    it('should resolve conflicts while keeping non-conflicting classes', () => {
      const result = cn('p-4 m-2 text-red-500', 'p-8 bg-blue-500')
      expect(result).toContain('p-8')
      expect(result).toContain('m-2')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
      expect(result).not.toContain('p-4')
    })
  })

  describe('Responsive and Variant Classes', () => {
    it('should handle responsive classes', () => {
      const result = cn('text-sm', 'md:text-base', 'lg:text-lg')
      expect(result).toContain('text-sm')
      expect(result).toContain('md:text-base')
      expect(result).toContain('lg:text-lg')
    })

    it('should resolve conflicting responsive classes', () => {
      const result = cn('md:p-4', 'md:p-8')
      expect(result).toBe('md:p-8')
    })

    it('should handle hover states', () => {
      const result = cn('hover:bg-blue-500', 'hover:text-white')
      expect(result).toContain('hover:bg-blue-500')
      expect(result).toContain('hover:text-white')
    })

    it('should resolve conflicting hover states', () => {
      const result = cn('hover:bg-blue-500', 'hover:bg-red-500')
      expect(result).toBe('hover:bg-red-500')
    })

    it('should handle focus states', () => {
      const result = cn('focus:ring-2', 'focus:outline-none')
      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:outline-none')
    })

    it('should handle dark mode classes', () => {
      const result = cn('bg-white', 'dark:bg-gray-900')
      expect(result).toContain('bg-white')
      expect(result).toContain('dark:bg-gray-900')
    })
  })

  describe('Real-World Use Cases', () => {
    it('should merge button variant classes', () => {
      const baseClasses = 'px-4 py-2 rounded font-medium'
      const variantClasses = 'bg-blue-500 text-white hover:bg-blue-600'

      const result = cn(baseClasses, variantClasses)

      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
      expect(result).toContain('rounded')
      expect(result).toContain('font-medium')
      expect(result).toContain('bg-blue-500')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-blue-600')
    })

    it('should handle conditional button states', () => {
      const isActive = true
      const isDisabled = false

      const result = cn(
        'px-4 py-2 rounded',
        {
          'bg-blue-500 text-white': isActive,
          'bg-gray-300 text-gray-500 cursor-not-allowed': isDisabled,
        }
      )

      expect(result).toContain('bg-blue-500')
      expect(result).toContain('text-white')
      expect(result).not.toContain('bg-gray-300')
      expect(result).not.toContain('cursor-not-allowed')
    })

    it('should override base classes with custom props', () => {
      const baseClasses = 'p-4 m-2 bg-white'
      const customClasses = 'p-8 bg-blue-100'

      const result = cn(baseClasses, customClasses)

      expect(result).toContain('p-8')
      expect(result).toContain('m-2')
      expect(result).toContain('bg-blue-100')
      expect(result).not.toContain('p-4')
      expect(result).not.toContain('bg-white')
    })

    it('should handle component composition', () => {
      const containerClasses = 'flex items-center justify-center'
      const responsiveClasses = 'w-full md:w-1/2 lg:w-1/3'
      const customClasses = 'bg-gradient-to-r from-blue-500 to-purple-500'

      const result = cn(containerClasses, responsiveClasses, customClasses)

      expect(result).toContain('flex')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-center')
      expect(result).toContain('w-full')
      expect(result).toContain('md:w-1/2')
      expect(result).toContain('lg:w-1/3')
      expect(result).toContain('bg-gradient-to-r')
    })

    it('should handle form input variants', () => {
      const hasError = true
      const isFocused = false

      const result = cn(
        'border rounded px-3 py-2',
        {
          'border-red-500 focus:ring-red-500': hasError,
          'border-gray-300 focus:ring-blue-500': !hasError,
          'ring-2': isFocused,
        }
      )

      expect(result).toContain('border')
      expect(result).toContain('rounded')
      expect(result).toContain('border-red-500')
      expect(result).toContain('focus:ring-red-500')
      expect(result).not.toContain('border-gray-300')
      expect(result).not.toContain('ring-2')
    })

    it('should handle card component with multiple states', () => {
      const isHoverable = true
      const isSelected = true
      const size = 'large'

      const result = cn(
        'rounded-lg shadow-md bg-white',
        {
          'hover:shadow-lg transition-shadow': isHoverable,
          'ring-2 ring-blue-500': isSelected,
          'p-4': size === 'small',
          'p-6': size === 'medium',
          'p-8': size === 'large',
        }
      )

      expect(result).toContain('rounded-lg')
      expect(result).toContain('hover:shadow-lg')
      expect(result).toContain('ring-2')
      expect(result).toContain('ring-blue-500')
      expect(result).toContain('p-8')
      expect(result).not.toContain('p-4')
      expect(result).not.toContain('p-6')
    })
  })

  describe('Edge Cases', () => {
    it('should handle whitespace in class strings', () => {
      const result = cn('  class-1  ', '  class-2  ')
      expect(result).toBe('class-1 class-2')
    })

    it('should handle class strings with multiple spaces', () => {
      const result = cn('class-1    class-2', 'class-3')
      expect(result).toBe('class-1 class-2 class-3')
    })

    it('should handle numeric values', () => {
      const result = cn('class-1', 0, 1, 'class-2')
      // clsx includes truthy values like 1, excludes falsy values like 0
      expect(result).toBe('class-1 1 class-2')
    })

    it('should handle very long class strings', () => {
      const longClassString = Array(100).fill('class').join(' ')
      const result = cn(longClassString)
      expect(result).toContain('class')
      expect(result.split(' ').length).toBe(100)
    })

    it('should handle special characters in class names', () => {
      const result = cn('class-1', 'class_2', 'class.3', 'class:4')
      expect(result).toContain('class-1')
      expect(result).toContain('class_2')
      expect(result).toContain('class.3')
      expect(result).toContain('class:4')
    })

    it('should handle duplicate classes', () => {
      const result = cn('class-1', 'class-2', 'class-1', 'class-2')
      // twMerge only deduplicates conflicting Tailwind classes, not arbitrary classes
      // So duplicates remain for non-Tailwind class names
      expect(result).toContain('class-1')
      expect(result).toContain('class-2')
    })

    it('should handle empty objects', () => {
      const result = cn({})
      expect(result).toBe('')
    })

    it('should handle empty arrays', () => {
      const result = cn([])
      expect(result).toBe('')
    })

    it('should handle deeply nested arrays', () => {
      const result = cn([[[['class-1']]]], 'class-2')
      expect(result).toBe('class-1 class-2')
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should accept string arguments', () => {
      const result = cn('test')
      expect(typeof result).toBe('string')
    })

    it('should accept object arguments', () => {
      const result = cn({ test: true })
      expect(typeof result).toBe('string')
    })

    it('should accept array arguments', () => {
      const result = cn(['test'])
      expect(typeof result).toBe('string')
    })

    it('should accept mixed argument types', () => {
      const result = cn('test', { active: true }, ['class-1'])
      expect(typeof result).toBe('string')
    })

    it('should always return a string', () => {
      expect(typeof cn()).toBe('string')
      expect(typeof cn('test')).toBe('string')
      expect(typeof cn(undefined)).toBe('string')
      expect(typeof cn(null)).toBe('string')
    })
  })

  describe('Performance Considerations', () => {
    it('should handle many arguments efficiently', () => {
      const manyArgs = Array(1000).fill('class').map((c, i) => `${c}-${i}`)
      const result = cn(...manyArgs)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle repeated calls', () => {
      for (let i = 0; i < 1000; i++) {
        const result = cn('class-1', 'class-2', { active: true })
        expect(result).toContain('class-1')
      }
    })

    it('should be deterministic', () => {
      const input1 = ['class-1', 'class-2', { active: true, disabled: false }]
      const input2 = ['class-1', 'class-2', { active: true, disabled: false }]

      const result1 = cn(...input1)
      const result2 = cn(...input2)

      expect(result1).toBe(result2)
    })
  })

  describe('Integration with clsx and twMerge', () => {
    it('should combine clsx and twMerge functionality', () => {
      // clsx handles conditional classes
      // twMerge handles Tailwind conflicts
      const result = cn(
        'p-4',
        { 'text-red-500': true },
        ['bg-blue-100'],
        'p-8' // Should override p-4
      )

      expect(result).toContain('p-8')
      expect(result).not.toContain('p-4')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-100')
    })

    it('should handle complex clsx patterns with twMerge', () => {
      const isActive = true
      const variant = 'primary'

      const result = cn(
        'base-class',
        isActive && 'active-class',
        variant === 'primary' && 'primary-variant',
        'p-4',
        'p-6' // Should override p-4
      )

      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
      expect(result).toContain('primary-variant')
      expect(result).toContain('p-6')
      expect(result).not.toContain('p-4')
    })
  })
})
