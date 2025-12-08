import { describe, expect, it } from 'vitest'
import { SUPPORTED_CHAINS } from '../constants'
import {
  formatDate,
  formatNumber,
  formatRegistryName,
  formatRelativeTime,
  getActionTypeLabel,
  getActionTypeOptions,
  getChainName,
  getChainOptions,
  getConditionFieldOptions,
  getConditionTypeOptions,
  getOperatorLabel,
  getOperatorOptions,
  getRegistryOptions,
  isSupportedChain,
  isValidRegistry,
} from '../config-helpers'

describe('config-helpers', () => {
  describe('getChainName', () => {
    it('should return chain name for valid ID', () => {
      expect(getChainName(SUPPORTED_CHAINS.MAINNET)).toBe('MAINNET')
      expect(getChainName(SUPPORTED_CHAINS.BASE)).toBe('BASE')
      expect(getChainName(SUPPORTED_CHAINS.SEPOLIA)).toBe('SEPOLIA')
    })

    it('should return fallback for unknown chain ID', () => {
      expect(getChainName(99999)).toBe('Chain 99999')
    })
  })

  describe('getChainOptions', () => {
    it('should return array of chain options', () => {
      const options = getChainOptions()

      expect(Array.isArray(options)).toBe(true)
      expect(options.length).toBeGreaterThan(0)
      expect(options[0]).toHaveProperty('value')
      expect(options[0]).toHaveProperty('label')
    })

    it('should format labels correctly', () => {
      const options = getChainOptions()
      const sepolia = options.find((opt) => opt.value === SUPPORTED_CHAINS.SEPOLIA)

      expect(sepolia?.label).toBe('SEPOLIA')
    })
  })

  describe('getRegistryOptions', () => {
    it('should return registry options', () => {
      const options = getRegistryOptions()

      expect(Array.isArray(options)).toBe(true)
      expect(options.length).toBe(3)
      expect(options.map((o) => o.value)).toContain('identity')
      expect(options.map((o) => o.value)).toContain('reputation')
      expect(options.map((o) => o.value)).toContain('validation')
    })

    it('should uppercase labels', () => {
      const options = getRegistryOptions()

      options.forEach((opt) => {
        expect(opt.label).toBe(opt.label.toUpperCase())
      })
    })
  })

  describe('formatRegistryName', () => {
    it('should capitalize registry names', () => {
      expect(formatRegistryName('identity')).toBe('Identity')
      expect(formatRegistryName('reputation')).toBe('Reputation')
      expect(formatRegistryName('validation')).toBe('Validation')
    })
  })

  describe('isSupportedChain', () => {
    it('should return true for supported chains', () => {
      expect(isSupportedChain(SUPPORTED_CHAINS.MAINNET)).toBe(true)
      expect(isSupportedChain(SUPPORTED_CHAINS.BASE)).toBe(true)
    })

    it('should return false for unsupported chains', () => {
      expect(isSupportedChain(99999)).toBe(false)
      expect(isSupportedChain(0)).toBe(false)
    })
  })

  describe('isValidRegistry', () => {
    it('should return true for valid registries', () => {
      expect(isValidRegistry('identity')).toBe(true)
      expect(isValidRegistry('reputation')).toBe(true)
      expect(isValidRegistry('validation')).toBe(true)
    })

    it('should return false for invalid registries', () => {
      expect(isValidRegistry('invalid')).toBe(false)
      expect(isValidRegistry('')).toBe(false)
    })
  })

  describe('getOperatorLabel', () => {
    it('should return friendly operator labels', () => {
      expect(getOperatorLabel('eq')).toBe('Equals (=)')
      expect(getOperatorLabel('ne')).toBe('Not Equals (≠)')
      expect(getOperatorLabel('gt')).toBe('Greater Than (>)')
      expect(getOperatorLabel('contains')).toBe('Contains')
    })

    it('should return operator as-is for unknown operators', () => {
      expect(getOperatorLabel('unknown')).toBe('unknown')
    })
  })

  describe('getOperatorOptions', () => {
    it('should return all operator options', () => {
      const options = getOperatorOptions()

      expect(options.length).toBe(10)
      expect(options.map((o) => o.value)).toContain('eq')
      expect(options.map((o) => o.value)).toContain('contains')
    })
  })

  describe('getActionTypeLabel', () => {
    it('should return friendly action type labels', () => {
      expect(getActionTypeLabel('telegram')).toBe('Telegram Message')
      expect(getActionTypeLabel('rest')).toBe('REST API Call')
      expect(getActionTypeLabel('mcp')).toBe('MCP Protocol')
    })

    it('should uppercase unknown types', () => {
      expect(getActionTypeLabel('unknown')).toBe('UNKNOWN')
    })
  })

  describe('getActionTypeOptions', () => {
    it('should return all action type options', () => {
      const options = getActionTypeOptions()

      expect(options.length).toBe(3)
      expect(options.map((o) => o.value)).toContain('telegram')
      expect(options.map((o) => o.value)).toContain('rest')
      expect(options.map((o) => o.value)).toContain('mcp')
    })
  })

  describe('getConditionTypeOptions', () => {
    it('should return condition type options', () => {
      const options = getConditionTypeOptions()

      expect(options.length).toBeGreaterThan(0)
      expect(options[0]).toHaveProperty('value')
      expect(options[0]).toHaveProperty('label')
    })
  })

  describe('getConditionFieldOptions', () => {
    it('should return field options', () => {
      const options = getConditionFieldOptions('event_filter')

      expect(Array.isArray(options)).toBe(true)
      expect(options.length).toBeGreaterThan(0)
      expect(options.map((o) => o.value)).toContain('eventType')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with thousands separator', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(123456789)).toBe('123,456,789')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(1)).toBe('1')
      expect(formatNumber(99)).toBe('99')
    })
  })

  describe('formatDate', () => {
    it('should format dates consistently', () => {
      const date = new Date('2025-12-01T10:30:00Z')
      const formatted = formatDate(date)

      expect(formatted).toContain('2025')
      expect(formatted).toContain('Dec')
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2025-12-01T10:30:00Z')

      expect(formatted).toBeTruthy()
      expect(typeof formatted).toBe('string')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format recent times', () => {
      const now = new Date()
      const result = formatRelativeTime(now)

      expect(result).toBe('just now')
    })

    it('should format minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      const result = formatRelativeTime(date)

      expect(result).toBe('5 minutes ago')
    })

    it('should format hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      const result = formatRelativeTime(date)

      expect(result).toBe('2 hours ago')
    })

    it('should format days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      const result = formatRelativeTime(date)

      expect(result).toBe('3 days ago')
    })

    it('should handle singular units', () => {
      const date = new Date(Date.now() - 60 * 1000) // 1 minute ago
      const result = formatRelativeTime(date)

      expect(result).toBe('1 minute ago')
    })
  })
})
