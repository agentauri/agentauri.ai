import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  createArrayFieldHandlers,
  formatReviewValue,
  getFieldError,
  hasUnsavedChanges,
  normalizeFormData,
  omitReadonlyFields,
  useFormSteps,
} from '../form-utils'

describe('form-utils', () => {
  describe('createArrayFieldHandlers', () => {
    interface TestItem {
      id: string
      name: string
      [key: string]: unknown
    }

    const defaultItem: TestItem = { id: '', name: '' }

    it('should initialize with empty array when getValue returns undefined', () => {
      const getValue = vi.fn(() => undefined)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)

      expect(handlers.items).toEqual([])
      expect(handlers.count).toBe(0)
      expect(handlers.canRemove).toBe(false)
    })

    it('should initialize with existing items', () => {
      const items: TestItem[] = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]
      const getValue = vi.fn(() => items)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)

      expect(handlers.items).toEqual(items)
      expect(handlers.count).toBe(2)
      expect(handlers.canRemove).toBe(true)
    })

    it('should add new item', () => {
      const items: TestItem[] = [{ id: '1', name: 'First' }]
      const getValue = vi.fn(() => items)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)
      handlers.add()

      expect(onChange).toHaveBeenCalledWith([...items, defaultItem])
    })

    it('should update item at index', () => {
      const items: TestItem[] = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]
      const getValue = vi.fn(() => items)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)
      handlers.update(0, { name: 'Updated' })

      expect(onChange).toHaveBeenCalledWith([
        { id: '1', name: 'Updated' },
        { id: '2', name: 'Second' },
      ])
    })

    it('should replace item at index', () => {
      const items: TestItem[] = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]
      const getValue = vi.fn(() => items)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)
      const newItem: TestItem = { id: '3', name: 'Replaced' }
      handlers.replace(0, newItem)

      expect(onChange).toHaveBeenCalledWith([newItem, { id: '2', name: 'Second' }])
    })

    it('should remove item at index', () => {
      const items: TestItem[] = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
        { id: '3', name: 'Third' },
      ]
      const getValue = vi.fn(() => items)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)
      handlers.remove(1)

      expect(onChange).toHaveBeenCalledWith([
        { id: '1', name: 'First' },
        { id: '3', name: 'Third' },
      ])
    })

    it('should get item at index', () => {
      const items: TestItem[] = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]
      const getValue = vi.fn(() => items)
      const onChange = vi.fn()

      const handlers = createArrayFieldHandlers(getValue, onChange, defaultItem)

      expect(handlers.get(0)).toEqual({ id: '1', name: 'First' })
      expect(handlers.get(1)).toEqual({ id: '2', name: 'Second' })
      expect(handlers.get(2)).toBeUndefined()
    })
  })

  describe('useFormSteps', () => {
    type Step = 'basic' | 'details' | 'review'
    const steps: Step[] = ['basic', 'details', 'review']

    it('should initialize with first step by default', () => {
      const { result } = renderHook(() => useFormSteps(steps))

      expect(result.current.currentStep).toBe('basic')
      expect(result.current.currentIndex).toBe(0)
      expect(result.current.isFirst).toBe(true)
      expect(result.current.isLast).toBe(false)
      expect(result.current.progress).toBe(33.33333333333333)
    })

    it('should initialize with custom initial step', () => {
      const { result } = renderHook(() => useFormSteps(steps, 'details'))

      expect(result.current.currentStep).toBe('details')
      expect(result.current.currentIndex).toBe(1)
      expect(result.current.isFirst).toBe(false)
      expect(result.current.isLast).toBe(false)
    })

    it('should go to next step', () => {
      const { result } = renderHook(() => useFormSteps(steps))

      act(() => {
        result.current.next()
      })

      expect(result.current.currentStep).toBe('details')
      expect(result.current.currentIndex).toBe(1)
    })

    it('should go to previous step', () => {
      const { result } = renderHook(() => useFormSteps(steps, 'details'))

      act(() => {
        result.current.previous()
      })

      expect(result.current.currentStep).toBe('basic')
      expect(result.current.currentIndex).toBe(0)
    })

    it('should not go beyond last step', () => {
      const { result } = renderHook(() => useFormSteps(steps, 'review'))

      act(() => {
        result.current.next()
      })

      expect(result.current.currentStep).toBe('review')
      expect(result.current.isLast).toBe(true)
    })

    it('should not go before first step', () => {
      const { result } = renderHook(() => useFormSteps(steps))

      act(() => {
        result.current.previous()
      })

      expect(result.current.currentStep).toBe('basic')
      expect(result.current.isFirst).toBe(true)
    })

    it('should go to specific step', () => {
      const { result } = renderHook(() => useFormSteps(steps))

      act(() => {
        result.current.goTo('review')
      })

      expect(result.current.currentStep).toBe('review')
      expect(result.current.currentIndex).toBe(2)
      expect(result.current.progress).toBe(100)
    })

    it('should not change step if invalid step provided', () => {
      const { result } = renderHook(() => useFormSteps(steps))

      act(() => {
        result.current.goTo('invalid' as Step)
      })

      expect(result.current.currentStep).toBe('basic')
    })
  })

  describe('omitReadonlyFields', () => {
    it('should remove readonly fields', () => {
      const data = {
        id: '123',
        name: 'Test',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      }

      const result = omitReadonlyFields(data, ['id', 'createdAt', 'updatedAt'])

      expect(result).toEqual({ name: 'Test' })
      expect(result.id).toBeUndefined()
    })

    it('should handle empty readonly fields array', () => {
      const data = { id: '123', name: 'Test' }

      const result = omitReadonlyFields(data, [])

      expect(result).toEqual(data)
    })

    it('should not mutate original data', () => {
      const data = { id: '123', name: 'Test' }

      const result = omitReadonlyFields(data, ['id'])

      expect(data.id).toBe('123')
      expect(result.id).toBeUndefined()
    })
  })

  describe('getFieldError', () => {
    it('should get error for top-level field', () => {
      const errors = {
        name: { message: 'Name is required' },
        email: { message: 'Email is invalid' },
      }

      expect(getFieldError(errors, 'name')).toBe('Name is required')
      expect(getFieldError(errors, 'email')).toBe('Email is invalid')
    })

    it('should get error for nested field', () => {
      const errors = {
        user: {
          profile: {
            name: { message: 'Name is required' },
          },
        },
      }

      expect(getFieldError(errors, 'user.profile.name')).toBe('Name is required')
    })

    it('should return undefined for non-existent field', () => {
      const errors = {
        name: { message: 'Name is required' },
      }

      expect(getFieldError(errors, 'email')).toBeUndefined()
      expect(getFieldError(errors, 'user.name')).toBeUndefined()
    })

    it('should return undefined for field without message', () => {
      const errors = {
        name: {},
      }

      expect(getFieldError(errors, 'name')).toBeUndefined()
    })
  })

  describe('hasUnsavedChanges', () => {
    it('should return false when values are identical', () => {
      const values = { name: 'Test', email: 'test@example.com' }
      const defaults = { name: 'Test', email: 'test@example.com' }

      expect(hasUnsavedChanges(values, defaults)).toBe(false)
    })

    it('should return true when values differ', () => {
      const values = { name: 'Updated', email: 'test@example.com' }
      const defaults = { name: 'Test', email: 'test@example.com' }

      expect(hasUnsavedChanges(values, defaults)).toBe(true)
    })

    it('should detect nested changes', () => {
      const values = { user: { name: 'Updated' } }
      const defaults = { user: { name: 'Original' } }

      expect(hasUnsavedChanges(values, defaults)).toBe(true)
    })
  })

  describe('formatReviewValue', () => {
    it('should format null/undefined as "Not set"', () => {
      expect(formatReviewValue(null)).toBe('Not set')
      expect(formatReviewValue(undefined)).toBe('Not set')
    })

    it('should format booleans as Yes/No', () => {
      expect(formatReviewValue(true)).toBe('Yes')
      expect(formatReviewValue(false)).toBe('No')
    })

    it('should format numbers as strings', () => {
      expect(formatReviewValue(42)).toBe('42')
      expect(formatReviewValue(0)).toBe('0')
    })

    it('should format strings', () => {
      expect(formatReviewValue('Hello')).toBe('Hello')
      expect(formatReviewValue('')).toBe('Not set')
    })

    it('should format arrays with count', () => {
      expect(formatReviewValue([1, 2, 3])).toBe('3 item(s)')
      expect(formatReviewValue([])).toBe('0 item(s)')
    })

    it('should format objects as JSON', () => {
      const obj = { key: 'value' }
      const result = formatReviewValue(obj)

      expect(result).toContain('"key"')
      expect(result).toContain('"value"')
    })
  })

  describe('normalizeFormData', () => {
    it('should trim string values', () => {
      const data = { name: '  Test  ', email: 'test@example.com  ' }

      const result = normalizeFormData(data)

      expect(result).toEqual({ name: 'Test', email: 'test@example.com' })
    })

    it('should convert empty strings to null', () => {
      const data = { name: '', email: 'test@example.com' }

      const result = normalizeFormData(data)

      expect(result).toEqual({ name: null, email: 'test@example.com' })
    })

    it('should normalize nested objects', () => {
      const data = {
        user: {
          name: '  John  ',
          email: '',
        },
      }

      const result = normalizeFormData(data)

      expect(result).toEqual({
        user: {
          name: 'John',
          email: null,
        },
      })
    })

    it('should preserve non-string values', () => {
      const data = {
        count: 42,
        enabled: true,
        tags: ['a', 'b'],
      }

      const result = normalizeFormData(data)

      expect(result).toEqual(data)
    })

    it('should not mutate original data', () => {
      const data = { name: '  Test  ' }

      const result = normalizeFormData(data)

      expect(data.name).toBe('  Test  ')
      expect(result.name).toBe('Test')
    })
  })
})
