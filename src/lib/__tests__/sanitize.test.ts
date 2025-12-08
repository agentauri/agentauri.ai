import { describe, expect, it } from 'vitest'
import {
  isValidJson,
  sanitizeConfigValue,
  sanitizeErrorMessage,
  sanitizeHtml,
  sanitizeJson,
  sanitizeWebhookUrl,
  validateTemplateVariables,
} from '../sanitize'

describe('sanitize', () => {
  describe('sanitizeHtml', () => {
    it('should strip all HTML tags', () => {
      const dirty = '<script>alert("xss")</script>Hello <b>World</b>'
      const clean = sanitizeHtml(dirty)
      expect(clean).toBe('Hello World')
    })

    it('should handle empty strings', () => {
      expect(sanitizeHtml('')).toBe('')
    })

    it('should preserve text content', () => {
      const dirty = '<p>Hello <strong>there</strong>!</p>'
      const clean = sanitizeHtml(dirty)
      expect(clean).toBe('Hello there!')
    })

    it('should handle dangerous attributes', () => {
      const dirty = '<img src=x onerror="alert(1)">'
      const clean = sanitizeHtml(dirty)
      expect(clean).not.toContain('onerror')
    })
  })

  describe('isValidJson', () => {
    it('should validate correct JSON', () => {
      expect(isValidJson('{"key": "value"}')).toBe(true)
      expect(isValidJson('{"number": 123}')).toBe(true)
      expect(isValidJson('["array", "values"]')).toBe(true)
    })

    it('should reject invalid JSON', () => {
      expect(isValidJson('not json')).toBe(false)
      expect(isValidJson('{"key": }')).toBe(false)
      expect(isValidJson('{key: value}')).toBe(false)
    })

    it('should handle empty strings', () => {
      expect(isValidJson('')).toBe(false)
      expect(isValidJson('   ')).toBe(false)
    })
  })

  describe('sanitizeJson', () => {
    it('should parse and stringify valid JSON', () => {
      const input = '{"key": "value"}'
      const result = sanitizeJson(input)
      expect(result).toBe('{"key":"value"}')
    })

    it('should detect prototype pollution', () => {
      const dangerous = '{"__proto__": {"polluted": true}}'
      const result = sanitizeJson(dangerous)
      expect(result).toBeNull()
    })

    it('should detect constructor pollution', () => {
      const dangerous = '{"constructor": {"polluted": true}}'
      const result = sanitizeJson(dangerous)
      expect(result).toBeNull()
    })

    it('should return null for invalid JSON', () => {
      expect(sanitizeJson('not json')).toBeNull()
      expect(sanitizeJson('')).toBeNull()
      expect(sanitizeJson('   ')).toBeNull()
    })

    it('should handle nested objects', () => {
      const input = '{"outer": {"inner": "value"}}'
      const result = sanitizeJson(input)
      expect(result).toBe('{"outer":{"inner":"value"}}')
    })

    it('should detect nested prototype pollution', () => {
      const dangerous = '{"safe": {"__proto__": {"polluted": true}}}'
      const result = sanitizeJson(dangerous)
      expect(result).toBeNull()
    })
  })

  describe('sanitizeWebhookUrl', () => {
    it('should allow valid HTTPS URLs', () => {
      const url = 'https://example.com/webhook'
      const result = sanitizeWebhookUrl(url)
      expect(result).toBe(url)
    })

    it('should allow HTTP in development', () => {
      const originalEnv = process.env.NODE_ENV
      ;(process.env as { NODE_ENV: string }).NODE_ENV = 'development'

      const url = 'http://example.com/webhook'
      const result = sanitizeWebhookUrl(url)
      expect(result).toBe(url)

      ;(process.env as { NODE_ENV: string }).NODE_ENV = originalEnv
    })

    it('should block localhost URLs', () => {
      expect(sanitizeWebhookUrl('http://localhost:3000')).toBeNull()
      expect(sanitizeWebhookUrl('https://localhost')).toBeNull()
      expect(sanitizeWebhookUrl('http://127.0.0.1')).toBeNull()
    })

    it('should block private IP ranges', () => {
      expect(sanitizeWebhookUrl('http://10.0.0.1')).toBeNull()
      expect(sanitizeWebhookUrl('http://172.16.0.1')).toBeNull()
      expect(sanitizeWebhookUrl('http://192.168.1.1')).toBeNull()
    })

    it('should block cloud metadata endpoints', () => {
      expect(sanitizeWebhookUrl('http://169.254.169.254')).toBeNull()
      expect(sanitizeWebhookUrl('http://[fd00:ec2::254]')).toBeNull()
    })

    it('should handle invalid URLs', () => {
      expect(sanitizeWebhookUrl('not a url')).toBeNull()
      expect(sanitizeWebhookUrl('')).toBeNull()
    })
  })

  describe('validateTemplateVariables', () => {
    it('should accept valid variables', () => {
      const template = 'Event: {{eventType}}, Agent: {{agentId}}'
      const result = validateTemplateVariables(template)
      expect(result.isValid).toBe(true)
      expect(result.invalidVars).toEqual([])
    })

    it('should detect invalid variables', () => {
      const template = 'Valid: {{eventType}}, Invalid: {{notAllowed}}'
      const result = validateTemplateVariables(template)
      expect(result.isValid).toBe(false)
      expect(result.invalidVars).toContain('notAllowed')
    })

    it('should handle multiple invalid variables', () => {
      const template = '{{invalid1}} {{invalid2}} {{eventType}}'
      const result = validateTemplateVariables(template)
      expect(result.isValid).toBe(false)
      expect(result.invalidVars).toHaveLength(2)
    })

    it('should handle template with no variables', () => {
      const template = 'No variables here'
      const result = validateTemplateVariables(template)
      expect(result.isValid).toBe(true)
      expect(result.invalidVars).toEqual([])
    })

    it('should trim whitespace in variable names', () => {
      const template = '{{ eventType }} {{  agentId  }}'
      const result = validateTemplateVariables(template)
      expect(result.isValid).toBe(true)
    })
  })

  describe('sanitizeConfigValue', () => {
    it('should handle string values', () => {
      const result = sanitizeConfigValue('simple string')
      expect(result).toBe('simple string')
    })

    it('should handle number values', () => {
      const result = sanitizeConfigValue(123)
      expect(result).toBe('123')
    })

    it('should handle boolean values', () => {
      expect(sanitizeConfigValue(true)).toBe('true')
      expect(sanitizeConfigValue(false)).toBe('false')
    })

    it('should sanitize objects', () => {
      const obj = { key: 'value', nested: { inner: 'data' } }
      const result = sanitizeConfigValue(obj)
      expect(result).toContain('key')
      expect(result).toContain('value')
    })

    it('should handle null/undefined', () => {
      // null and undefined both return empty string after sanitization
      expect(sanitizeConfigValue(null)).toBe('')
      expect(sanitizeConfigValue(undefined)).toBe('')
    })
  })

  describe('sanitizeErrorMessage', () => {
    it('should remove stack traces', () => {
      const error = new Error('Error message\n    at someFunction (file.ts:10:5)')
      const result = sanitizeErrorMessage(error)
      expect(result).not.toContain('at someFunction')
      expect(result).toContain('Error message')
    })

    it('should remove file paths', () => {
      const error = new Error('Error in /Users/path/to/file.ts')
      const result = sanitizeErrorMessage(error)
      expect(result).not.toContain('/Users/path/to/')
    })

    it('should remove line numbers', () => {
      const error = new Error('Error (file.ts:123:45)')
      const result = sanitizeErrorMessage(error)
      expect(result).not.toContain(':123:45')
    })

    it('should handle non-Error objects', () => {
      const result = sanitizeErrorMessage('string error')
      expect(result).toBe('string error')
    })

    it('should handle null/undefined', () => {
      expect(sanitizeErrorMessage(null)).toBe('An unexpected error occurred')
      expect(sanitizeErrorMessage(undefined)).toBe('An unexpected error occurred')
    })

    it('should take only first line of multi-line errors', () => {
      const error = new Error('First line\nSecond line\nThird line')
      const result = sanitizeErrorMessage(error)
      expect(result).toBe('First line')
    })
  })
})
