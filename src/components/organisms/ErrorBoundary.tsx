/**
 * ErrorBoundary
 *
 * React error boundary component that catches JavaScript errors in child
 * components. Displays a fallback UI and provides reset/reload options.
 *
 * @module components/organisms/ErrorBoundary
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomError />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/components/atoms/button'

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Optional custom fallback UI to display on error */
  fallback?: ReactNode
}

/**
 * Internal state for ErrorBoundary.
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to monitoring service in production
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
          <div className="text-center">
            <h2 className="typo-header text-foreground">Something went wrong</h2>
            <p className="typo-ui mt-2 text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 max-w-lg overflow-auto rounded bg-muted p-4 text-left typo-code">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button onClick={this.handleReset}>Try Again</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Props for the QueryErrorBoundary component.
 */
interface QueryErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Optional callback when user clicks retry */
  onReset?: () => void
}

/**
 * Internal state for QueryErrorBoundary.
 */
interface QueryErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * QueryErrorBoundary
 *
 * A specialized error boundary for data fetching errors.
 * Displays a compact error message with retry functionality.
 */
export class QueryErrorBoundary extends Component<
  QueryErrorBoundaryProps,
  QueryErrorBoundaryState
> {
  constructor(props: QueryErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): QueryErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Query error caught by boundary:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <div className="text-center">
            <h3 className="typo-header text-destructive">Failed to load data</h3>
            <p className="typo-ui mt-1 text-muted-foreground">
              {this.state.error?.message ?? 'An error occurred while fetching data'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={this.handleReset}>
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
