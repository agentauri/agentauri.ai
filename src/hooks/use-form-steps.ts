'use client'

import { useState } from 'react'

/**
 * Multi-step form state management hook
 *
 * Provides navigation controls and state for multi-step forms/wizards.
 * Supports any string literal type for step identifiers.
 *
 * @typeParam T - String literal union type for step identifiers
 * @param steps - Array of step identifiers in order
 * @param initialStep - Optional initial step (defaults to first step)
 * @returns Step state and navigation controls
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
 *       <ProgressBar progress={steps.progress} />
 *
 *       {steps.currentStep === 'basic' && <BasicStep />}
 *       {steps.currentStep === 'details' && <DetailsStep />}
 *       {steps.currentStep === 'review' && <ReviewStep />}
 *
 *       <div>
 *         <Button onClick={steps.previous} disabled={steps.isFirst}>
 *           Previous
 *         </Button>
 *         <Button onClick={steps.next} disabled={steps.isLast}>
 *           Next
 *         </Button>
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Jump to specific step
 * function StepIndicator({ step, steps }) {
 *   return (
 *     <button
 *       onClick={() => steps.goTo(step)}
 *       aria-current={steps.currentStep === step ? 'step' : undefined}
 *     >
 *       {step}
 *     </button>
 *   )
 * }
 * ```
 */
export function useFormSteps<T extends string>(steps: T[], initialStep?: T) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep ?? (steps[0] as T))
  const currentIndex = steps.indexOf(currentStep)

  return {
    /** Current active step identifier */
    currentStep,
    /** Zero-based index of current step */
    currentIndex,
    /** Array of all step identifiers */
    steps,

    /**
     * Navigate to next step
     *
     * Does nothing if already on the last step.
     */
    next: () => {
      const nextIndex = currentIndex + 1
      if (nextIndex < steps.length) {
        const nextStep = steps[nextIndex]
        if (nextStep) setCurrentStep(nextStep)
      }
    },

    /**
     * Navigate to previous step
     *
     * Does nothing if already on the first step.
     */
    previous: () => {
      const prevIndex = currentIndex - 1
      if (prevIndex >= 0) {
        const prevStep = steps[prevIndex]
        if (prevStep) setCurrentStep(prevStep)
      }
    },

    /**
     * Navigate to a specific step
     *
     * @param step - Step identifier to navigate to
     */
    goTo: (step: T) => {
      if (steps.includes(step)) {
        setCurrentStep(step)
      }
    },

    /** Whether current step is the first step */
    isFirst: currentIndex === 0,

    /** Whether current step is the last step */
    isLast: currentIndex === steps.length - 1,

    /** Progress percentage (0-100) */
    progress: ((currentIndex + 1) / steps.length) * 100,
  }
}
