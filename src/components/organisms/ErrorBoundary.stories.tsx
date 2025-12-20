import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ErrorBoundary, QueryErrorBoundary } from './error-boundary'
import { Button } from '@/components/atoms/button'

const meta = {
  title: 'Utility/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundary>

export default meta
type Story = StoryObj<typeof ErrorBoundary>

// Component that throws an error
function ThrowError({ message = 'This is a test error' }: { message?: string }): never {
  throw new Error(message)
}

// Component that can toggle throwing error
function ToggleError() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('Triggered error from button click')
  }

  return (
    <div className="border-2 border-terminal bg-terminal/30 p-6 text-center">
      <p className="typo-ui text-terminal-bright mb-4">
        [✓] COMPONENT WORKING NORMALLY
      </p>
      <p className="typo-ui text-terminal-dim mb-4">
        Click the button below to trigger an error
      </p>
      <Button
        onClick={() => setShouldThrow(true)}
        variant="destructive"
        className="typo-ui"
      >
        [!] THROW ERROR
      </Button>
    </div>
  )
}

// Normal working component
function WorkingComponent() {
  return (
    <div className="border-2 border-terminal-green bg-terminal-green/10 p-6 text-center">
      <p className="typo-ui text-terminal-green glow mb-2">
        [✓] NO ERRORS
      </p>
      <p className="typo-ui text-terminal-dim">
        This component is rendering successfully within the error boundary
      </p>
    </div>
  )
}

export const NormalRender: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; ERROR BOUNDARY - NORMAL RENDER
      </div>
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; ERROR BOUNDARY - CAUGHT ERROR
      </div>
      <ErrorBoundary>
        <ThrowError message="Network request failed: Unable to fetch data" />
      </ErrorBoundary>
    </div>
  ),
}

export const WithCustomFallback: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; ERROR BOUNDARY - CUSTOM FALLBACK
      </div>
      <ErrorBoundary
        fallback={
          <div className="border-2 border-destructive bg-destructive/10 p-8 text-center">
            <p className="typo-ui text-destructive mb-2">[!] CUSTOM ERROR MESSAGE</p>
            <p className="typo-ui text-destructive/80">
              This is a custom fallback UI instead of the default error display
            </p>
          </div>
        }
      >
        <ThrowError message="Custom fallback test error" />
      </ErrorBoundary>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; ERROR BOUNDARY - INTERACTIVE TEST
      </div>
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    </div>
  ),
}

export const QueryBoundarySuccess: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; QUERY ERROR BOUNDARY - SUCCESS
      </div>
      <QueryErrorBoundary>
        <div className="border-2 border-terminal-green bg-terminal-green/10 p-6 text-center">
          <p className="typo-ui text-terminal-green glow mb-2">
            [✓] DATA LOADED
          </p>
          <p className="typo-ui text-terminal-dim">
            Query completed successfully
          </p>
        </div>
      </QueryErrorBoundary>
    </div>
  ),
}

export const QueryBoundaryError: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; QUERY ERROR BOUNDARY - FAILED QUERY
      </div>
      <QueryErrorBoundary>
        <ThrowError message="Failed to fetch: Network error" />
      </QueryErrorBoundary>
    </div>
  ),
}

export const QueryBoundaryWithReset: Story = {
  render: () => {
    const [resetCount, setResetCount] = useState(0)

    return (
      <div className="max-w-2xl mx-auto p-8 bg-background">
        <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
          &gt; QUERY ERROR BOUNDARY - WITH RESET HANDLER
        </div>
        <div className="mb-4 typo-ui text-terminal-dim border-2 border-terminal-dim bg-terminal/20 p-3">
          Reset count: {resetCount}
        </div>
        <QueryErrorBoundary onReset={() => setResetCount(c => c + 1)}>
          <ThrowError message="Query failed - click retry to increment reset counter" />
        </QueryErrorBoundary>
      </div>
    )
  },
}

export const MultipleChildrenWithError: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="mb-4 typo-ui text-terminal-green border-2 border-terminal bg-terminal/50 p-3">
        &gt; ERROR BOUNDARY - MULTIPLE CHILDREN
      </div>
      <ErrorBoundary>
        <WorkingComponent />
        <div className="my-4" />
        <ThrowError message="Error in second child component" />
        <div className="my-4" />
        <WorkingComponent />
      </ErrorBoundary>
    </div>
  ),
}
