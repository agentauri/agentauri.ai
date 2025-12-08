import DOMPurify from 'dompurify'

/**
 * Security utilities for sanitizing user input and preventing XSS attacks
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes all HTML tags and returns plain text only
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
 * Returns null if JSON is invalid or contains dangerous patterns
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
 * Returns true if valid, false otherwise
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
 * Blocks private IPs, localhost, and metadata endpoints
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
 * Handles strings, objects, and special cases
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
 * Returns true if template uses only allowed variables
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
 * Removes sensitive information like stack traces, paths, etc.
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
