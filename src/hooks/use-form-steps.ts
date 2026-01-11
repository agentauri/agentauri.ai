'use client'

import { useState } from 'react'

/**
 * Multi-step form state management hook
 *
 * @example
 * ```tsx
 * type Step = 'basic' | 'details' | 'review'
 *
 * function MyForm() {
 *   const steps = useFormSteps<Step>(['basic', 'details', 'review'])
 *
 *   return (
 *     <div>
 *       {steps.currentStep === 'basic' && <BasicStep />}
 *       {steps.currentStep === 'details' && <DetailsStep />}
 *       {steps.currentStep === 'review' && <ReviewStep />}
 *
 *       <button onClick={steps.previous} disabled={steps.isFirst}>
 *         Previous
 *       </button>
 *       <button onClick={steps.next} disabled={steps.isLast}>
 *         Next
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFormSteps<T extends string>(steps: T[], initialStep?: T) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep ?? (steps[0] as T))
  const currentIndex = steps.indexOf(currentStep)

  return {
    /** Current active step */
    currentStep,
    /** Index of current step (0-based) */
    currentIndex,
    /** Array of all steps */
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
     * Get progress percentage (0-100)
     */
    progress: ((currentIndex + 1) / steps.length) * 100,
  }
}
