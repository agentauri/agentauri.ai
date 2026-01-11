/**
 * Vitest test setup and configuration
 *
 * Global test setup that runs before all test files.
 * Configures Testing Library, MSW mock server, and cleanup routines.
 *
 * @module test/setup
 *
 * @remarks
 * This file is automatically loaded by Vitest via the `setupFiles` config.
 * It provides:
 * - Jest-DOM matchers for Testing Library assertions
 * - Automatic DOM cleanup after each test
 * - MSW server for API mocking
 * - Default handlers for auth API routes
 *
 * @example
 * ```ts
 * // In a test file, use the exported server to add custom handlers
 * import { server } from '@/test/setup'
 * import { http, HttpResponse } from 'msw'
 *
 * beforeEach(() => {
 *   server.use(
 *     http.get('/api/v1/triggers', () => {
 *       return HttpResponse.json({ data: mockTriggers })
 *     })
 *   )
 * })
 * ```
 */

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// ============================================================================
// Test Cleanup
// ============================================================================

/**
 * Clean up after each test
 *
 * - Cleans up React Testing Library DOM (only in jsdom environment)
 * - Clears all mock call history (faster than restoreAllMocks)
 */
afterEach(() => {
  if (typeof document !== 'undefined') {
    cleanup()
  }
  // Clear mocks after each test (faster than restoreAllMocks)
  vi.clearAllMocks()
})

/**
 * Restore all mocks at the end of the test suite
 *
 * Ensures mock implementations are fully restored to originals.
 */
afterAll(() => {
  vi.restoreAllMocks()
})

// ============================================================================
// MSW Server Configuration
// ============================================================================

/**
 * Default handlers for local Next.js API routes
 *
 * These handlers prevent ECONNREFUSED errors in tests that trigger
 * authentication flows (token refresh, logout, etc.) without needing
 * to mock every auth-related API call individually.
 *
 * @internal
 */
const localApiHandlers = [
  /** Handle token setting requests */
  http.post('http://localhost:3000/api/auth/set-tokens', () => {
    return HttpResponse.json({ success: true })
  }),

  /** Handle token refresh requests */
  http.post('http://localhost:3000/api/auth/refresh', () => {
    return HttpResponse.json({ success: true })
  }),

  /** Handle logout requests */
  http.post('http://localhost:3000/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),
]

/**
 * MSW mock server instance
 *
 * Pre-configured with default auth API handlers.
 * Use `server.use()` in individual tests to add custom handlers.
 *
 * @example
 * ```ts
 * import { server } from '@/test/setup'
 * import { http, HttpResponse } from 'msw'
 *
 * // Add a handler for a specific test
 * server.use(
 *   http.get('/api/v1/agents', () => {
 *     return HttpResponse.json({ data: [] })
 *   })
 * )
 *
 * // Simulate an error response
 * server.use(
 *   http.post('/api/v1/triggers', () => {
 *     return HttpResponse.json(
 *       { message: 'Validation failed' },
 *       { status: 400 }
 *     )
 *   })
 * )
 * ```
 */
export const server = setupServer(...localApiHandlers)

/**
 * Start MSW server before all tests
 *
 * Configured to warn on unhandled requests to help identify
 * missing mock handlers during test development.
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

/**
 * Reset handlers after each test
 *
 * Removes any runtime handlers added via `server.use()`,
 * restoring the server to its initial configuration.
 */
afterEach(() => {
  server.resetHandlers()
})

/**
 * Close MSW server after all tests complete
 *
 * Cleans up server resources and stops request interception.
 */
afterAll(() => {
  server.close()
})
