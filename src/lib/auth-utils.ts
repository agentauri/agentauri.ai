/**
 * Authentication utilities for handling session expiration
 */

let isRedirecting = false

/**
 * Handle session expiration by clearing cookies and redirecting to login
 * Uses a flag to prevent multiple redirects from concurrent API calls
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
 * Reset the redirect flag (useful for testing or after successful login)
 */
export function resetSessionExpiredFlag(): void {
  isRedirecting = false
}
