/**
 * Form utilities for common patterns
 * Reduces code duplication in complex forms
 */

import { useState } from 'react'

/**
 * Create array field handlers for React Hook Form
 * Handles add, update, remove operations with proper type safety
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
 * Multi-step form state management
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
 * Useful for converting full models to creation/update payloads
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
 */
export function hasUnsavedChanges<T extends Record<string, unknown>>(
  currentValues: T,
  defaultValues: T
): boolean {
  return JSON.stringify(currentValues) !== JSON.stringify(defaultValues)
}

/**
 * Format form values for display in review step
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
 * Normalize form data by trimming strings and removing empty values
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
