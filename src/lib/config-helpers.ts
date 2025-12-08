/**
 * Configuration helpers for common data transformations
 */

import { REGISTRIES, SUPPORTED_CHAINS, type Registry, type SupportedChainId } from './constants'

/**
 * Get chain name from ID
 */
export function getChainName(chainId: number): string {
  const entry = Object.entries(SUPPORTED_CHAINS).find(([_, id]) => id === chainId)
  return entry ? entry[0] : `Chain ${chainId}`
}

/**
 * Get all chain options for select inputs
 */
export function getChainOptions(): Array<{ value: number; label: string }> {
  return Object.entries(SUPPORTED_CHAINS).map(([name, id]) => ({
    value: id,
    label: name.replace(/_/g, ' '),
  }))
}

/**
 * Get all registry options for select inputs
 */
export function getRegistryOptions(): Array<{ value: Registry; label: string }> {
  return REGISTRIES.map((registry) => ({
    value: registry,
    label: registry.toUpperCase(),
  }))
}

/**
 * Format registry name for display
 */
export function formatRegistryName(registry: Registry): string {
  return registry.charAt(0).toUpperCase() + registry.slice(1)
}

/**
 * Check if chain ID is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId)
}

/**
 * Check if registry is valid
 */
export function isValidRegistry(registry: string): registry is Registry {
  return REGISTRIES.includes(registry as Registry)
}

/**
 * Get operator display label
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
 * Get all operator options
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
 * Get all action type options
 */
export function getActionTypeOptions(): Array<{ value: string; label: string }> {
  return [
    { value: 'telegram', label: 'Telegram Message' },
    { value: 'rest', label: 'REST API Call' },
    { value: 'mcp', label: 'MCP Protocol' },
  ]
}

/**
 * Get condition type options
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
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format date for display
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
 * Format relative time (e.g., "2 hours ago")
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
