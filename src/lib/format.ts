/**
 * Date and value formatting utilities
 *
 * Provides consistent formatting for dates, numbers, blockchain data,
 * and currency values throughout the application.
 *
 * @module lib/format
 */

/**
 * Format a date to a localized date string
 *
 * @param date - Date string (ISO) or Date object
 * @returns Localized date string (e.g., "1/15/2024")
 *
 * @example
 * ```ts
 * formatDate('2024-01-15T10:30:00Z')
 * // => '1/15/2024' (in en-US locale)
 * ```
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString()
}

/**
 * Format a date to a localized date and time string
 *
 * @param date - Date string (ISO) or Date object
 * @returns Localized datetime string (e.g., "1/15/2024, 10:30:00 AM")
 *
 * @example
 * ```ts
 * formatDateTime('2024-01-15T10:30:00Z')
 * // => '1/15/2024, 10:30:00 AM' (in en-US locale)
 * ```
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString()
}

/**
 * Format a date or return a fallback string if null/undefined
 *
 * @param date - Date string, Date object, or null/undefined
 * @param fallback - String to return if date is null/undefined (default: 'Never')
 * @returns Formatted date or fallback string
 *
 * @example
 * ```ts
 * formatDateOrDefault(user.lastLogin)
 * // => '1/15/2024' or 'Never'
 *
 * formatDateOrDefault(null, 'N/A')
 * // => 'N/A'
 * ```
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
 *
 * @param blockNumber - Blockchain block number
 * @returns Formatted block number with thousand separators
 *
 * @example
 * ```ts
 * formatBlockNumber(19234567)
 * // => '19,234,567' (in en-US locale)
 * ```
 */
export function formatBlockNumber(blockNumber: number): string {
  return blockNumber.toLocaleString()
}

/**
 * Truncate an Ethereum address or transaction hash
 *
 * @param hash - Full hash or address string
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated string with ellipsis (e.g., "0x1234...5678")
 *
 * @example
 * ```ts
 * truncateHash('0x1234567890abcdef1234567890abcdef12345678')
 * // => '0x1234...5678'
 *
 * truncateHash('0x1234567890abcdef', 10, 6)
 * // => '0x12345678...abcdef'
 * ```
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
 *
 * Uses longer truncation (10 + 8 chars) for better identification.
 *
 * @param hash - Full transaction hash (66 chars with 0x prefix)
 * @returns Truncated hash (e.g., "0x12345678...12345678")
 *
 * @example
 * ```ts
 * formatTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
 * // => '0x12345678...90abcdef'
 * ```
 */
export function formatTxHash(hash: string): string {
  return truncateHash(hash, 10, 8)
}

/**
 * Format an Ethereum address for display
 *
 * Standard truncation (6 + 4 chars) for addresses.
 *
 * @param address - Full Ethereum address (42 chars with 0x prefix)
 * @returns Truncated address (e.g., "0x1234...5678")
 *
 * @example
 * ```ts
 * formatAddress('0x1234567890abcdef1234567890abcdef12345678')
 * // => '0x1234...5678'
 * ```
 */
export function formatAddress(address: string): string {
  return truncateHash(address, 6, 4)
}

/**
 * Format a balance with currency
 *
 * Assumes balance is stored in cents (smallest unit).
 *
 * @param balance - Balance in cents
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$12.34")
 *
 * @example
 * ```ts
 * formatBalance(1234)
 * // => '$12.34'
 *
 * formatBalance(5000, 'EUR')
 * // => '€50.00'
 * ```
 */
export function formatBalance(balance: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(balance / 100) // Assuming balance is in cents
}

/**
 * Format a number with thousand separators
 *
 * @param value - Number to format
 * @returns Locale-formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1234567)
 * // => '1,234,567' (in en-US locale)
 * ```
 */
export function formatNumber(value: number): string {
  return value.toLocaleString()
}
