/**
 * Security headers configuration
 * Implements defense-in-depth security headers
 */

/**
 * Content Security Policy (CSP) configuration
 * Prevents XSS, clickjacking, and other code injection attacks
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
 * Prevents open redirect vulnerabilities
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
 * Sanitize redirect URL
 * Returns safe URL or fallback
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
 * Security utilities for request validation
 */
export const SecurityUtils = {
  getSecurityHeaders,
  getContentSecurityPolicy,
  isSafeRedirectUrl,
  sanitizeRedirectUrl,
  generateNonce,
  isAllowedOrigin,
} as const
