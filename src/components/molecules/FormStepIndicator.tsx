/**
 * Reusable step indicator for multi-step forms
 */

import { Box } from '@/components/atoms/box'
import { Icon } from '@/components/atoms/icon'

interface FormStepIndicatorProps<T extends string> {
  steps: { value: T; label: string }[]
  currentStep: T
  onStepClick?: (step: T) => void
  className?: string
}

export function FormStepIndicator<T extends string>({
  steps,
  currentStep,
  onStepClick,
  className = '',
}: FormStepIndicatorProps<T>) {
  const currentIndex = steps.findIndex((s) => s.value === currentStep)

  return (
    <Box variant="default" padding="md" className={className}>
      <div className="flex items-center justify-between typo-ui">
        {steps.map((step, index) => {
          const isCurrent = step.value === currentStep
          const isCompleted = index < currentIndex
          const isClickable = onStepClick !== undefined

          return (
            <div key={step.value} className="flex items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.value)}
                disabled={!isClickable}
                className={`flex items-center ${
                  isCurrent
                    ? 'text-terminal-green glow'
                    : isCompleted
                      ? 'text-terminal-bright'
                      : 'text-terminal-dim'
                } ${isClickable ? 'cursor-pointer hover:text-terminal-bright' : 'cursor-default'}`}
              >
                <span className="mr-2">
                  {isCompleted ? (
                    <Icon name="check" size="sm" />
                  ) : (
                    `[${index + 1}]`
                  )}
                </span>
                <span className="uppercase">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <span className="mx-4 text-terminal-dim">
                  <Icon name="collapse" size="sm" />
                </span>
              )}
            </div>
          )
        })}
      </div>
    </Box>
  )
}
