/**
 * Security headers configuration
 *
 * Implements defense-in-depth security headers for the application:
 * - Content Security Policy (CSP) for XSS protection
 * - CORS validation for cross-origin requests
 * - Safe redirect URL validation
 * - Cryptographic nonce generation
 *
 * @module lib/security-headers
 */

/**
 * Content Security Policy (CSP) configuration
 *
 * Prevents XSS, clickjacking, and other code injection attacks
 * by restricting resource loading to trusted sources.
 *
 * @param nonce - Optional cryptographic nonce for inline scripts
 * @returns CSP header value string
 *
 * @example
 * ```ts
 * const csp = getContentSecurityPolicy(nonce)
 * response.headers.set('Content-Security-Policy', csp)
 * ```
 */
export function getContentSecurityPolicy(nonce?: string): string {
  const directives = {
    // Only load scripts from same origin and inline with nonce
    'script-src': [
      "'self'",
      nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
      'https://cdnjs.cloudflare.com', // For any CDN dependencies
    ],

    // Only load styles from same origin and inline
    'style-src': ["'self'", "'unsafe-inline'"],

    // Images from same origin, data URIs, and HTTPS
    'img-src': ["'self'", 'data:', 'https:'],

    // Fonts from same origin and CDN
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],

    // Only connect to same origin API and WebSocket
    'connect-src': [
      "'self'",
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080',
      'wss:', // WebSocket connections
    ],

    // No object/embed/applet tags
    'object-src': ["'none'"],

    // Media only from same origin
    'media-src': ["'self'"],

    // Frames only from same origin
    'frame-src': ["'self'"],

    // Form actions only to same origin
    'form-action': ["'self'"],

    // Only same-origin frames can embed this site
    'frame-ancestors': ["'self'"],

    // Base URI restricted to same origin
    'base-uri': ["'self'"],

    // Upgrade insecure requests in production
    ...(process.env.NODE_ENV === 'production' && {
      'upgrade-insecure-requests': [],
    }),
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

/**
 * Get all security headers for Next.js configuration
 *
 * Returns a complete set of security headers including:
 * - Content-Security-Policy
 * - X-Content-Type-Options
 * - X-Frame-Options
 * - X-XSS-Protection
 * - Referrer-Policy
 * - Permissions-Policy
 * - Strict-Transport-Security (production only)
 *
 * @param nonce - Optional cryptographic nonce for CSP
 * @returns Object of header name to value pairs
 *
 * @example
 * ```ts
 * // In Next.js middleware
 * const headers = getSecurityHeaders(nonce)
 * Object.entries(headers).forEach(([key, value]) => {
 *   response.headers.set(key, value)
 * })
 * ```
 */
export function getSecurityHeaders(nonce?: string): Record<string, string> {
  return {
    // Content Security Policy
    'Content-Security-Policy': getContentSecurityPolicy(nonce),

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',

    // Enable XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy (formerly Feature Policy)
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), interest-cohort=()',

    // HSTS - Force HTTPS (only in production)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    }),
  }
}

/**
 * Validate if a URL is safe for redirect
 *
 * Prevents open redirect vulnerabilities by checking:
 * - Same-origin by default
 * - Optional allowlist for external domains
 * - Blocks javascript: and data: protocols
 *
 * @param url - URL to validate
 * @param allowedDomains - Optional array of allowed external domains
 * @returns True if URL is safe for redirect
 *
 * @example
 * ```ts
 * isSafeRedirectUrl('/dashboard')                    // => true
 * isSafeRedirectUrl('https://evil.com')              // => false
 * isSafeRedirectUrl('https://partner.com', ['partner.com']) // => true
 * isSafeRedirectUrl('javascript:alert(1)')           // => false
 * ```
 */
export function isSafeRedirectUrl(url: string, allowedDomains?: string[]): boolean {
  try {
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined)

    // Only allow same-origin redirects by default
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin
      if (parsed.origin !== currentOrigin) {
        // Check if domain is in allowlist
        if (!allowedDomains?.includes(parsed.hostname)) {
          return false
        }
      }
    }

    // Block javascript: and data: URLs
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return false
    }

    // Only allow HTTP(S) protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }

    return true
  } catch {
    // Invalid URL
    return false
  }
}

/**
 * Sanitize redirect URL with fallback
 *
 * Validates and normalizes redirect URLs, returning a safe
 * fallback if the URL is invalid or potentially malicious.
 *
 * @param url - URL to sanitize (can be null/undefined)
 * @param fallback - Fallback URL if invalid (default: '/')
 * @param allowedDomains - Optional array of allowed external domains
 * @returns Safe URL string
 *
 * @example
 * ```ts
 * sanitizeRedirectUrl('/dashboard')           // => '/dashboard'
 * sanitizeRedirectUrl('https://evil.com')     // => '/'
 * sanitizeRedirectUrl(null, '/home')          // => '/home'
 * sanitizeRedirectUrl('//evil.com')           // => '/'
 * ```
 */
export function sanitizeRedirectUrl(
  url: string | null | undefined,
  fallback = '/',
  allowedDomains?: string[]
): string {
  if (!url) return fallback

  // Remove any leading/trailing whitespace
  const trimmed = url.trim()

  // Check if it's a relative URL (starts with /)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    // Prevent path traversal
    try {
      const normalized = new URL(trimmed, 'http://localhost').pathname
      return normalized
    } catch {
      return fallback
    }
  }

  // For absolute URLs, validate safety
  if (isSafeRedirectUrl(trimmed, allowedDomains)) {
    return trimmed
  }

  return fallback
}

/**
 * Generate cryptographically secure random nonce
 *
 * Creates a random hex string suitable for CSP nonces
 * or other security tokens. Works in both browser and Node.js.
 *
 * @param length - Number of random bytes (default: 32)
 * @returns Hex-encoded random string (2x length characters)
 *
 * @example
 * ```ts
 * const nonce = generateNonce()
 * // => 'a1b2c3d4e5f6...' (64 characters)
 *
 * const shortNonce = generateNonce(16)
 * // => 'a1b2c3d4...' (32 characters)
 * ```
 */
export function generateNonce(length = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  // Fallback for server-side (Node.js)
  const { randomBytes } = require('node:crypto')
  return randomBytes(length).toString('hex')
}

/**
 * Check if request origin is allowed (CORS validation)
 *
 * Validates origin against an allowlist, supporting both
 * exact matches and wildcard patterns.
 *
 * @param origin - Request origin header value
 * @param allowedOrigins - Array of allowed origins (supports * wildcards)
 * @returns True if origin is allowed
 *
 * @example
 * ```ts
 * isAllowedOrigin('https://app.example.com', ['https://app.example.com'])
 * // => true
 *
 * isAllowedOrigin('https://sub.example.com', ['https://*.example.com'])
 * // => true
 *
 * isAllowedOrigin(null, ['https://example.com'])
 * // => false
 * ```
 */
export function isAllowedOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false

  // Check exact match
  if (allowedOrigins.includes(origin)) {
    return true
  }

  // Check wildcard patterns
  return allowedOrigins.some((allowed) => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace(/\*/g, '.*')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(origin)
    }
    return false
  })
}

/**
 * Security utilities namespace
 *
 * Exports all security functions for convenient access.
 */
export const SecurityUtils = {
  getSecurityHeaders,
  getContentSecurityPolicy,
  isSafeRedirectUrl,
  sanitizeRedirectUrl,
  generateNonce,
  isAllowedOrigin,
} as const
