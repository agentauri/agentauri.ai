/**
 * Date and value formatting utilities
 */

/**
 * Format a date to a localized date string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString()
}

/**
 * Format a date to a localized date and time string
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString()
}

/**
 * Format a date or return a fallback string if null/undefined
 */
export function formatDateOrDefault(
  date?: string | Date | null,
  fallback = 'Never'
): string {
  if (!date) return fallback
  return new Date(date).toLocaleDateString()
}

/**
 * Format a block number with locale-aware separators
 */
export function formatBlockNumber(blockNumber: number): string {
  return blockNumber.toLocaleString()
}

/**
 * Truncate an Ethereum address or transaction hash
 */
export function truncateHash(
  hash: string,
  startChars = 6,
  endChars = 4
): string {
  if (hash.length <= startChars + endChars) return hash
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`
}

/**
 * Format a transaction hash for display
 */
export function formatTxHash(hash: string): string {
  return truncateHash(hash, 10, 8)
}

/**
 * Format an Ethereum address for display
 */
export function formatAddress(address: string): string {
  return truncateHash(address, 6, 4)
}

/**
 * Format a balance with currency
 */
export function formatBalance(balance: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(balance / 100) // Assuming balance is in cents
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString()
}
