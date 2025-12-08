import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { FormStepIndicator } from './FormStepIndicator'

const meta = {
  title: 'Shared/FormStepIndicator',
  component: FormStepIndicator,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormStepIndicator>

export default meta
type Story = StoryObj<typeof FormStepIndicator>

type DemoStep = 'basic' | 'details' | 'review' | 'submit'

const demoSteps: Array<{ value: DemoStep; label: string }> = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'details', label: 'Details' },
  { value: 'review', label: 'Review' },
  { value: 'submit', label: 'Submit' },
]

// Interactive wrapper with state
function FormStepIndicatorDemo({
  initialStep = 'basic' as DemoStep,
  clickable = false,
}: {
  initialStep?: DemoStep
  clickable?: boolean
}) {
  const [currentStep, setCurrentStep] = useState<DemoStep>(initialStep)

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <Box variant="default" padding="sm" className="mb-6 typo-ui text-terminal-green">
        &gt; FORM STEP INDICATOR DEMO
      </Box>

      <FormStepIndicator
        steps={demoSteps}
        currentStep={currentStep}
        onStepClick={clickable ? setCurrentStep : undefined}
      />

      <Box variant="subtle" padding="md" className="mt-8">
        <div className="typo-ui text-terminal-green mb-4">
          &gt; Current Step: <span className="text-terminal-bright">{currentStep.toUpperCase()}</span>
        </div>
        <div className="typo-ui text-terminal-dim space-y-2">
          <div>• Step {demoSteps.findIndex(s => s.value === currentStep) + 1} of {demoSteps.length}</div>
          <div>• Clickable: {clickable ? 'YES' : 'NO'}</div>
        </div>

        {clickable && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                const currentIndex = demoSteps.findIndex(s => s.value === currentStep)
                const prevStep = demoSteps[currentIndex - 1]
                if (currentIndex > 0 && prevStep) {
                  setCurrentStep(prevStep.value)
                }
              }}
              disabled={currentStep === 'basic'}
              className="typo-ui px-4 py-2 border-2 border-terminal text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              [&lt;] PREVIOUS
            </button>
            <button
              type="button"
              onClick={() => {
                const currentIndex = demoSteps.findIndex(s => s.value === currentStep)
                const nextStep = demoSteps[currentIndex + 1]
                if (currentIndex < demoSteps.length - 1 && nextStep) {
                  setCurrentStep(nextStep.value)
                }
              }}
              disabled={currentStep === 'submit'}
              className="typo-ui px-4 py-2 border-2 border-terminal text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              [&gt;] NEXT
            </button>
          </div>
        )}
      </Box>
    </div>
  )
}

export const FirstStep: Story = {
  render: () => <FormStepIndicatorDemo initialStep="basic" clickable={false} />,
}

export const MiddleStep: Story = {
  render: () => <FormStepIndicatorDemo initialStep="details" clickable={false} />,
}

export const LastStep: Story = {
  render: () => <FormStepIndicatorDemo initialStep="submit" clickable={false} />,
}

export const ClickableSteps: Story = {
  render: () => <FormStepIndicatorDemo initialStep="basic" clickable={true} />,
}

export const ClickableMiddle: Story = {
  render: () => <FormStepIndicatorDemo initialStep="review" clickable={true} />,
}

// Three-step variant
type SimpleStep = 'info' | 'config' | 'done'

const simpleSteps: Array<{ value: SimpleStep; label: string }> = [
  { value: 'info', label: 'Information' },
  { value: 'config', label: 'Configuration' },
  { value: 'done', label: 'Complete' },
]

function ThreeStepDemo() {
  const [currentStep, setCurrentStep] = useState<SimpleStep>('config')

  return (
    <div className="max-w-3xl mx-auto p-8 bg-background">
      <Box variant="default" padding="sm" className="mb-6 typo-ui text-terminal-green">
        &gt; THREE-STEP PROCESS
      </Box>
      <FormStepIndicator
        steps={simpleSteps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />
    </div>
  )
}

export const ThreeSteps: Story = {
  render: () => <ThreeStepDemo />,
}
