import DOMPurify from 'dompurify'

/**
 * Security utilities for sanitizing user input
 *
 * Provides comprehensive input sanitization to prevent:
 * - XSS (Cross-Site Scripting) attacks
 * - SSRF (Server-Side Request Forgery) attacks
 * - Prototype pollution attacks
 * - Template injection attacks
 *
 * @module lib/sanitize
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 *
 * Removes all HTML tags and returns plain text only.
 * Uses DOMPurify with strict configuration.
 *
 * @param dirty - Potentially unsafe HTML string
 * @returns Sanitized plain text
 *
 * @example
 * ```ts
 * sanitizeHtml('<script>alert("xss")</script>Hello')
 * // => 'Hello'
 *
 * sanitizeHtml('<b>Bold</b> text')
 * // => 'Bold text'
 * ```
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ''

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  })
}

/**
 * Check if an object contains prototype pollution attempts
 *
 * Recursively scans objects for dangerous keys that could
 * modify Object.prototype or other builtin prototypes.
 *
 * @param obj - Object to check
 * @param depth - Current recursion depth (internal)
 * @returns True if pollution attempt detected
 * @internal
 */
function hasPrototypePollution(obj: unknown, depth = 0): boolean {
  // Prevent infinite recursion
  if (depth > 10) return false
  if (obj === null || typeof obj !== 'object') return false

  const dangerousKeys = ['__proto__', 'constructor', 'prototype']

  const objRecord = obj as Record<string, unknown>

  for (const key in objRecord) {
    if (dangerousKeys.includes(key)) {
      return true
    }

    // Recursively check nested objects
    const value = objRecord[key]
    if (typeof value === 'object' && value !== null) {
      if (hasPrototypePollution(value, depth + 1)) {
        return true
      }
    }
  }

  return false
}

/**
 * Validate and sanitize JSON string
 *
 * Parses JSON and checks for prototype pollution attacks.
 * Returns normalized JSON string or null if invalid/dangerous.
 *
 * @param input - JSON string to validate
 * @returns Sanitized JSON string or null if invalid
 *
 * @example
 * ```ts
 * sanitizeJson('{"name": "test"}')
 * // => '{"name":"test"}'
 *
 * sanitizeJson('{"__proto__": {"admin": true}}')
 * // => null (prototype pollution detected)
 *
 * sanitizeJson('invalid json')
 * // => null
 * ```
 */
export function sanitizeJson(input: string): string | null {
  if (!input || !input.trim()) {
    return null
  }

  try {
    const parsed = JSON.parse(input)

    // Check for prototype pollution
    if (hasPrototypePollution(parsed)) {
      console.warn('Detected prototype pollution attempt in JSON')
      return null
    }

    // Return stringified version (normalized)
    return JSON.stringify(parsed)
  } catch (error) {
    console.warn('Invalid JSON provided:', error)
    return null
  }
}

/**
 * Validate JSON syntax without parsing
 *
 * Quick check for valid JSON syntax. Does not check for
 * prototype pollution - use `sanitizeJson` for full validation.
 *
 * @param input - String to validate
 * @returns True if valid JSON syntax
 *
 * @example
 * ```ts
 * isValidJson('{"valid": true}')
 * // => true
 *
 * isValidJson('{invalid}')
 * // => false
 * ```
 */
export function isValidJson(input: string): boolean {
  if (!input || !input.trim()) return false

  try {
    JSON.parse(input)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize webhook URL to prevent SSRF attacks
 *
 * Blocks dangerous URLs that could allow server-side request forgery:
 * - Localhost and loopback addresses
 * - Private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
 * - Cloud metadata endpoints (169.254.169.254)
 * - Non-HTTPS URLs in production
 *
 * @param url - Webhook URL to validate
 * @returns Validated URL or null if unsafe
 *
 * @example
 * ```ts
 * sanitizeWebhookUrl('https://api.example.com/webhook')
 * // => 'https://api.example.com/webhook'
 *
 * sanitizeWebhookUrl('http://localhost:3000/hook')
 * // => null (localhost blocked)
 *
 * sanitizeWebhookUrl('http://169.254.169.254/metadata')
 * // => null (metadata endpoint blocked)
 * ```
 */
export function sanitizeWebhookUrl(url: string): string | null {
  if (!url || !url.trim()) return null

  try {
    const parsed = new URL(url)

    // Only allow HTTPS in production
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      console.warn('Non-HTTPS URLs not allowed in production')
      return null
    }

    // Block localhost and private IPs
    const hostname = parsed.hostname.toLowerCase()

    // Localhost variations
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('127.') ||
      hostname === '::1' ||
      hostname === '0.0.0.0'
    ) {
      console.warn('Localhost URLs not allowed')
      return null
    }

    // Private IPv4 ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    const match = hostname.match(ipv4Regex)
    if (match) {
      const parts = match.slice(1).map(Number)
      const [a = 0, b = 0, c = 0, d = 0] = parts

      // 10.0.0.0/8
      if (a === 10) {
        console.warn('Private IP range (10.0.0.0/8) not allowed')
        return null
      }

      // 172.16.0.0/12
      if (a === 172 && b >= 16 && b <= 31) {
        console.warn('Private IP range (172.16.0.0/12) not allowed')
        return null
      }

      // 192.168.0.0/16
      if (a === 192 && b === 168) {
        console.warn('Private IP range (192.168.0.0/16) not allowed')
        return null
      }

      // Cloud metadata endpoint (169.254.169.254)
      if (a === 169 && b === 254 && c === 169 && d === 254) {
        console.warn('Cloud metadata endpoint not allowed')
        return null
      }
    }

    // Block private IPv6 ranges
    if (hostname.includes(':') && (hostname.startsWith('fc') || hostname.startsWith('fd'))) {
      console.warn('Private IPv6 range not allowed')
      return null
    }

    // Block cloud metadata IPv6 (fd00:ec2::254)
    if (hostname.includes('fd00:ec2')) {
      console.warn('Cloud metadata IPv6 endpoint not allowed')
      return null
    }

    return url
  } catch (error) {
    console.warn('Invalid URL format:', error)
    return null
  }
}

/**
 * Sanitize config value for safe display
 *
 * Converts various value types to safe display strings.
 * Applies HTML sanitization to prevent XSS.
 *
 * @param value - Any value to sanitize
 * @returns Safe string representation
 *
 * @example
 * ```ts
 * sanitizeConfigValue('<script>alert(1)</script>')
 * // => '' (script tag removed)
 *
 * sanitizeConfigValue({ key: 'value' })
 * // => '{\n  "key": "value"\n}'
 *
 * sanitizeConfigValue(null)
 * // => ''
 * ```
 */
export function sanitizeConfigValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return sanitizeHtml(value)
  }

  if (typeof value === 'object') {
    try {
      const jsonString = JSON.stringify(value, null, 2)
      return sanitizeHtml(jsonString)
    } catch {
      return '[Invalid Object]'
    }
  }

  return String(value)
}

/**
 * Validate template variable syntax
 *
 * Checks that template only uses allowed `{{variable}}` patterns.
 * Prevents template injection by restricting variable names.
 *
 * @param template - Template string with `{{variables}}`
 * @returns Validation result with any invalid variables found
 *
 * @example
 * ```ts
 * validateTemplateVariables('Event: {{eventType}} for agent {{agentId}}')
 * // => { isValid: true, invalidVars: [] }
 *
 * validateTemplateVariables('{{malicious}} payload')
 * // => { isValid: false, invalidVars: ['malicious'] }
 * ```
 */
export function validateTemplateVariables(template: string): {
  isValid: boolean
  invalidVars: string[]
} {
  // Allowed template variables
  const allowedVars = new Set([
    'eventType',
    'agentId',
    'chainId',
    'registry',
    'blockNumber',
    'transactionHash',
    'timestamp',
    'reputationScore',
    'triggerId',
    'triggerName',
  ])

  // Extract all {{variable}} patterns
  const varRegex = /\{\{([^}]+)\}\}/g
  const matches = Array.from(template.matchAll(varRegex))
  const usedVars = matches.map((m) => m[1]?.trim() ?? '')
  const invalidVars = usedVars.filter((v) => !allowedVars.has(v))

  return {
    isValid: invalidVars.length === 0,
    invalidVars,
  }
}

/**
 * Sanitize error message for display to user
 *
 * Removes sensitive information that could leak implementation details:
 * - Stack traces
 * - File paths
 * - Line numbers
 *
 * @param error - Error instance, string, or unknown value
 * @returns Safe error message for user display
 *
 * @example
 * ```ts
 * const err = new Error('Failed at /app/src/lib/api.ts:42:10')
 * sanitizeErrorMessage(err)
 * // => 'Failed'
 * ```
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred'
  }

  if (error instanceof Error) {
    // Remove stack traces and file paths
    let message = error.message
    message = message.split('\n')[0] ?? message // Take only first line
    message = message.replace(/at\s+.*$/g, '') // Remove "at" traces
    message = message.replace(/\/.*\//g, '') // Remove file paths
    message = message.replace(/\(.*:\d+:\d+\)/g, '') // Remove line numbers

    return sanitizeHtml(message)
  }

  if (typeof error === 'string') {
    return sanitizeHtml(error)
  }

  return 'An unexpected error occurred'
}
