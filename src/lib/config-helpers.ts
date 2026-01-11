/**
 * Configuration helpers for common data transformations
 *
 * Provides utilities for converting between:
 * - Chain IDs and display names
 * - Registry identifiers and labels
 * - Operator codes and human-readable labels
 * - Action type codes and descriptions
 *
 * Also provides option arrays for select inputs throughout the UI.
 *
 * @module lib/config-helpers
 */

import { REGISTRIES, SUPPORTED_CHAINS, type Registry, type SupportedChainId } from './constants'

/**
 * Get chain name from chain ID
 *
 * @param chainId - EIP-155 chain ID
 * @returns Human-readable chain name or fallback
 *
 * @example
 * ```ts
 * getChainName(1)           // => 'MAINNET'
 * getChainName(8453)        // => 'BASE'
 * getChainName(999999)      // => 'Chain 999999'
 * ```
 */
export function getChainName(chainId: number): string {
  const entry = Object.entries(SUPPORTED_CHAINS).find(([_, id]) => id === chainId)
  return entry ? entry[0] : `Chain ${chainId}`
}

/**
 * Get all chain options for select inputs
 *
 * @returns Array of chain options with value (ID) and label (name)
 *
 * @example
 * ```tsx
 * <Select options={getChainOptions()} />
 * // [{ value: 1, label: 'MAINNET' }, { value: 8453, label: 'BASE' }, ...]
 * ```
 */
export function getChainOptions(): Array<{ value: number; label: string }> {
  return Object.entries(SUPPORTED_CHAINS).map(([name, id]) => ({
    value: id,
    label: name.replace(/_/g, ' '),
  }))
}

/**
 * Get all registry options for select inputs
 *
 * @returns Array of registry options with value and uppercase label
 *
 * @example
 * ```tsx
 * <Select options={getRegistryOptions()} />
 * // [{ value: 'identity', label: 'IDENTITY' }, ...]
 * ```
 */
export function getRegistryOptions(): Array<{ value: Registry; label: string }> {
  return REGISTRIES.map((registry) => ({
    value: registry,
    label: registry.toUpperCase(),
  }))
}

/**
 * Format registry name for display with title case
 *
 * @param registry - Registry identifier
 * @returns Title-cased registry name
 *
 * @example
 * ```ts
 * formatRegistryName('identity')   // => 'Identity'
 * formatRegistryName('reputation') // => 'Reputation'
 * ```
 */
export function formatRegistryName(registry: Registry): string {
  return registry.charAt(0).toUpperCase() + registry.slice(1)
}

/**
 * Check if chain ID is supported
 *
 * Type guard that narrows chain ID to SupportedChainId type.
 *
 * @param chainId - Chain ID to check
 * @returns True if chain is supported
 *
 * @example
 * ```ts
 * if (isSupportedChain(chainId)) {
 *   // chainId is now typed as SupportedChainId
 * }
 * ```
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId)
}

/**
 * Check if registry string is valid
 *
 * Type guard that narrows string to Registry type.
 *
 * @param registry - Registry string to validate
 * @returns True if registry is valid
 *
 * @example
 * ```ts
 * if (isValidRegistry(input)) {
 *   // input is now typed as Registry
 * }
 * ```
 */
export function isValidRegistry(registry: string): registry is Registry {
  return REGISTRIES.includes(registry as Registry)
}

/**
 * Get operator display label
 *
 * Converts operator codes to human-readable labels with symbols.
 *
 * @param operator - Operator code (eq, ne, gt, gte, lt, lte, in, contains, etc.)
 * @returns Human-readable label with symbol
 *
 * @example
 * ```ts
 * getOperatorLabel('eq')  // => 'Equals (=)'
 * getOperatorLabel('gte') // => 'Greater or Equal (≥)'
 * getOperatorLabel('xyz') // => 'xyz' (fallback)
 * ```
 */
export function getOperatorLabel(operator: string): string {
  const labels: Record<string, string> = {
    eq: 'Equals (=)',
    ne: 'Not Equals (≠)',
    gt: 'Greater Than (>)',
    gte: 'Greater or Equal (≥)',
    lt: 'Less Than (<)',
    lte: 'Less or Equal (≤)',
    in: 'In List',
    contains: 'Contains',
    startsWith: 'Starts With',
    endsWith: 'Ends With',
  }
  return labels[operator] ?? operator
}

/**
 * Get all operator options for select inputs
 *
 * @returns Array of operator options for condition building
 */
export function getOperatorOptions(): Array<{ value: string; label: string }> {
  return [
    { value: 'eq', label: 'Equals (=)' },
    { value: 'ne', label: 'Not Equals (≠)' },
    { value: 'gt', label: 'Greater Than (>)' },
    { value: 'gte', label: 'Greater or Equal (≥)' },
    { value: 'lt', label: 'Less Than (<)' },
    { value: 'lte', label: 'Less or Equal (≤)' },
    { value: 'in', label: 'In List' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
  ]
}

/**
 * Get action type display label
 *
 * @param actionType - Action type code (telegram, rest, mcp)
 * @returns Human-readable label
 *
 * @example
 * ```ts
 * getActionTypeLabel('telegram') // => 'Telegram Message'
 * getActionTypeLabel('rest')     // => 'REST API Call'
 * ```
 */
export function getActionTypeLabel(actionType: string): string {
  const labels: Record<string, string> = {
    telegram: 'Telegram Message',
    rest: 'REST API Call',
    mcp: 'MCP Protocol',
  }
  return labels[actionType] ?? actionType.toUpperCase()
}

/**
 * Get all action type options for select inputs
 *
 * @returns Array of action type options for trigger configuration
 */
export function getActionTypeOptions(): Array<{ value: string; label: string }> {
  return [
    { value: 'telegram', label: 'Telegram Message' },
    { value: 'rest', label: 'REST API Call' },
    { value: 'mcp', label: 'MCP Protocol' },
  ]
}

/**
 * Get condition type options for select inputs
 *
 * @returns Array of condition type options for trigger configuration
 */
export function getConditionTypeOptions(): Array<{ value: string; label: string }> {
  return [
    { value: 'event_filter', label: 'Event Filter' },
    { value: 'agent_filter', label: 'Agent Filter' },
    { value: 'registry_filter', label: 'Registry Filter' },
    { value: 'threshold', label: 'Threshold' },
    { value: 'time_window', label: 'Time Window' },
  ]
}

/**
 * Get condition field options based on condition type
 *
 * Returns available fields for the given condition type.
 * Currently returns common fields for all types but can be
 * extended to return type-specific fields.
 *
 * @param _conditionType - The condition type (currently unused)
 * @returns Array of field options
 */
export function getConditionFieldOptions(_conditionType: string): Array<{ value: string; label: string }> {
  const commonFields = [
    { value: 'eventType', label: 'Event Type' },
    { value: 'agentId', label: 'Agent ID' },
    { value: 'registry', label: 'Registry' },
    { value: 'blockNumber', label: 'Block Number' },
    { value: 'timestamp', label: 'Timestamp' },
    { value: 'reputationScore', label: 'Reputation Score' },
    { value: 'transactionHash', label: 'Transaction Hash' },
  ]

  // Could be extended to return different fields based on conditionType
  return commonFields
}

/**
 * Format number with locale-specific thousands separator
 *
 * @param num - Number to format
 * @returns Formatted string with thousand separators
 *
 * @example
 * ```ts
 * formatNumber(1234567) // => '1,234,567' (en-US)
 * ```
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format date for display with date and time
 *
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., 'Jan 15, 2024, 02:30 PM')
 *
 * @example
 * ```ts
 * formatDate('2024-01-15T14:30:00Z')
 * // => 'Jan 15, 2024, 02:30 PM'
 * ```
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Format date as relative time string
 *
 * @param date - Date string or Date object
 * @returns Relative time string (e.g., '2 hours ago', 'just now')
 *
 * @example
 * ```ts
 * // If now is 2024-01-15T15:00:00Z
 * formatRelativeTime('2024-01-15T13:00:00Z') // => '2 hours ago'
 * formatRelativeTime('2024-01-14T15:00:00Z') // => '1 day ago'
 * formatRelativeTime('2024-01-15T14:59:30Z') // => 'just now'
 * ```
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
    }
  }

  return 'just now'
}
