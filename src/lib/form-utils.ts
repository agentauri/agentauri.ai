/**
 * Form utilities for common patterns
 *
 * Provides reusable utilities for complex form handling:
 * - Array field management (add, update, remove operations)
 * - Multi-step form navigation
 * - Form data transformation and normalization
 * - Field error extraction from nested structures
 *
 * @module lib/form-utils
 */

import { useState } from 'react'

/**
 * Create array field handlers for React Hook Form
 *
 * Provides a complete set of CRUD operations for managing array fields
 * in forms with proper type safety and immutable updates.
 *
 * @typeParam T - The type of items in the array
 * @param getValue - Function to get current array value from form state
 * @param onChange - Function to update the array value in form state
 * @param defaultItem - Default item to use when adding new entries
 * @returns Object with array manipulation methods
 *
 * @example
 * ```tsx
 * const conditions = createArrayFieldHandlers(
 *   () => form.getValues('conditions'),
 *   (value) => form.setValue('conditions', value),
 *   { field: '', operator: 'eq', value: '' }
 * )
 *
 * // Add new condition
 * conditions.add()
 *
 * // Update condition at index
 * conditions.update(0, { value: 'newValue' })
 *
 * // Remove condition
 * if (conditions.canRemove) conditions.remove(0)
 * ```
 */
export function createArrayFieldHandlers<T extends Record<string, unknown>>(
  getValue: () => T[] | undefined,
  onChange: (value: T[]) => void,
  defaultItem: T
) {
  const items = getValue() ?? []

  return {
    items,

    /**
     * Add new item to array
     */
    add: () => {
      onChange([...items, defaultItem])
    },

    /**
     * Update item at index
     */
    update: (index: number, updatedItem: Partial<T>) => {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], ...updatedItem } as T
      onChange(newItems)
    },

    /**
     * Replace item at index completely
     */
    replace: (index: number, newItem: T) => {
      const newItems = [...items]
      newItems[index] = newItem
      onChange(newItems)
    },

    /**
     * Remove item at index
     */
    remove: (index: number) => {
      onChange(items.filter((_, i) => i !== index))
    },

    /**
     * Get item at index
     */
    get: (index: number): T | undefined => items[index],

    /**
     * Check if can remove (at least one item must remain)
     */
    canRemove: items.length > 1,

    /**
     * Get count
     */
    count: items.length,
  }
}

/**
 * Multi-step form state management hook
 *
 * Manages navigation through a series of form steps with
 * progress tracking and boundary checking.
 *
 * @typeParam T - Union type of step names (typically string literals)
 * @param steps - Array of step identifiers in order
 * @param initialStep - Optional starting step (defaults to first)
 * @returns Object with navigation methods and state
 *
 * @example
 * ```tsx
 * type Step = 'basics' | 'conditions' | 'actions' | 'review'
 *
 * function TriggerWizard() {
 *   const { currentStep, next, previous, isLast, progress } = useFormSteps<Step>(
 *     ['basics', 'conditions', 'actions', 'review']
 *   )
 *
 *   return (
 *     <>
 *       <ProgressBar value={progress} />
 *       {currentStep === 'basics' && <BasicsForm />}
 *       <Button onClick={previous} disabled={isFirst}>Back</Button>
 *       <Button onClick={isLast ? handleSubmit : next}>
 *         {isLast ? 'Submit' : 'Next'}
 *       </Button>
 *     </>
 *   )
 * }
 * ```
 */
export function useFormSteps<T extends string>(steps: T[], initialStep?: T) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep ?? (steps[0] as T))
  const currentIndex = steps.indexOf(currentStep)

  return {
    currentStep,
    currentIndex,
    steps,

    /**
     * Go to next step
     */
    next: () => {
      const nextIndex = currentIndex + 1
      if (nextIndex < steps.length) {
        const nextStep = steps[nextIndex]
        if (nextStep) setCurrentStep(nextStep)
      }
    },

    /**
     * Go to previous step
     */
    previous: () => {
      const prevIndex = currentIndex - 1
      if (prevIndex >= 0) {
        const prevStep = steps[prevIndex]
        if (prevStep) setCurrentStep(prevStep)
      }
    },

    /**
     * Go to specific step
     */
    goTo: (step: T) => {
      if (steps.includes(step)) {
        setCurrentStep(step)
      }
    },

    /**
     * Check if current step is first
     */
    isFirst: currentIndex === 0,

    /**
     * Check if current step is last
     */
    isLast: currentIndex === steps.length - 1,

    /**
     * Get progress percentage
     */
    progress: ((currentIndex + 1) / steps.length) * 100,
  }
}

/**
 * Transform form data by removing readonly fields
 *
 * Useful for converting full model objects to create/update payloads
 * by stripping server-managed fields like id, createdAt, updatedAt.
 *
 * @typeParam T - The data type
 * @param data - Object to transform
 * @param readonlyFields - Array of field names to remove
 * @returns New object without the specified fields
 *
 * @example
 * ```ts
 * const fullTrigger = { id: '123', name: 'Test', createdAt: '...' }
 * const payload = omitReadonlyFields(fullTrigger, ['id', 'createdAt'])
 * // => { name: 'Test' }
 * ```
 */
export function omitReadonlyFields<T extends Record<string, unknown>>(
  data: Partial<T>,
  readonlyFields: (keyof T)[]
): Partial<T> {
  const result = { ...data }
  for (const field of readonlyFields) {
    delete result[field]
  }
  return result
}

/**
 * Get validation error message from form state
 *
 * Traverses nested error objects using dot notation to extract
 * error messages from React Hook Form's error structure.
 *
 * @param errors - Form errors object from React Hook Form
 * @param fieldPath - Dot-notation path to the field (e.g., 'conditions.0.value')
 * @returns Error message string or undefined if no error
 *
 * @example
 * ```ts
 * const errors = { conditions: [{ value: { message: 'Required' } }] }
 * getFieldError(errors, 'conditions.0.value')
 * // => 'Required'
 *
 * getFieldError(errors, 'conditions.0.field')
 * // => undefined
 * ```
 */
export function getFieldError(
  errors: Record<string, unknown>,
  fieldPath: string
): string | undefined {
  const keys = fieldPath.split('.')
  let current: unknown = errors

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  if (current && typeof current === 'object' && 'message' in current) {
    return (current as { message?: string }).message
  }

  return undefined
}

/**
 * Check if form has unsaved changes
 *
 * Performs deep comparison of current values against initial/default values
 * using JSON serialization.
 *
 * @typeParam T - The form values type
 * @param currentValues - Current form values
 * @param defaultValues - Original/default form values
 * @returns True if values differ
 *
 * @example
 * ```tsx
 * const isDirty = hasUnsavedChanges(form.getValues(), initialData)
 * if (isDirty && !confirm('Discard changes?')) return
 * ```
 */
export function hasUnsavedChanges<T extends Record<string, unknown>>(
  currentValues: T,
  defaultValues: T
): boolean {
  return JSON.stringify(currentValues) !== JSON.stringify(defaultValues)
}

/**
 * Format form values for display in review step
 *
 * Converts various value types to human-readable strings
 * for displaying in form review/confirmation steps.
 *
 * @param value - Any form value to format
 * @returns Human-readable string representation
 *
 * @example
 * ```ts
 * formatReviewValue(null)         // => 'Not set'
 * formatReviewValue(true)         // => 'Yes'
 * formatReviewValue(['a', 'b'])   // => '2 item(s)'
 * formatReviewValue({ x: 1 })     // => '{\n  "x": 1\n}'
 * ```
 */
export function formatReviewValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'Not set'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'number') {
    return value.toString()
  }

  if (typeof value === 'string') {
    return value || 'Not set'
  }

  if (Array.isArray(value)) {
    return `${value.length} item(s)`
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}

/**
 * Normalize form data by trimming strings and converting empty values
 *
 * Recursively processes form data to:
 * - Trim whitespace from strings
 * - Convert empty strings to null
 * - Apply normalization to nested objects
 *
 * @typeParam T - The form data type
 * @param data - Form data to normalize
 * @returns Normalized copy of the data
 *
 * @example
 * ```ts
 * normalizeFormData({ name: '  Test  ', email: '' })
 * // => { name: 'Test', email: null }
 *
 * normalizeFormData({ user: { name: '  John  ' } })
 * // => { user: { name: 'John' } }
 * ```
 */
export function normalizeFormData<T extends Record<string, unknown>>(data: T): T {
  const normalized = { ...data }

  for (const key in normalized) {
    const value = normalized[key]

    // Trim strings
    if (typeof value === 'string') {
      normalized[key] = value.trim() as T[Extract<keyof T, string>]
    }

    // Convert empty strings to null
    if (value === '') {
      normalized[key] = null as T[Extract<keyof T, string>]
    }

    // Recursively normalize nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      normalized[key] = normalizeFormData(value as Record<string, unknown>) as T[Extract<
        keyof T,
        string
      >]
    }
  }

  return normalized
}
