/**
 * Authentication utilities for handling session expiration
 *
 * Provides client-side session management with:
 * - Automatic redirect on session expiration
 * - Protection against multiple concurrent redirects
 * - Cleanup of authentication cookies
 *
 * @module lib/auth-utils
 */

let isRedirecting = false

/**
 * Handle session expiration by clearing cookies and redirecting to login
 *
 * Uses a mutex flag to prevent multiple redirects from concurrent API calls
 * that may all receive 401 responses simultaneously.
 *
 * The function:
 * 1. Checks if already redirecting (prevents duplicate redirects)
 * 2. Calls logout API to clear httpOnly cookies server-side
 * 3. Redirects to login page with session=expired query param
 *
 * @example
 * ```ts
 * // In API client error handler
 * if (response.status === 401 && !refreshSucceeded) {
 *   handleSessionExpired()
 * }
 * ```
 */
export function handleSessionExpired(): void {
  if (typeof window === 'undefined' || isRedirecting) return
  isRedirecting = true

  // Call logout API to clear httpOnly cookie, then redirect
  // Using fetch without await since we're redirecting anyway
  fetch('/api/auth/logout', { method: 'POST' })
    .finally(() => {
      // Redirect to login with session expired indicator
      window.location.href = '/login?session=expired'
    })
}

/**
 * Reset the redirect flag
 *
 * Call this after successful login or in tests to allow
 * future session expirations to trigger redirects.
 *
 * @example
 * ```ts
 * // After successful login
 * resetSessionExpiredFlag()
 *
 * // In test setup
 * beforeEach(() => resetSessionExpiredFlag())
 * ```
 */
export function resetSessionExpiredFlag(): void {
  isRedirecting = false
}
