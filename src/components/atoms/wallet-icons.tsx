'use client'

import { cn } from '@/lib/utils'

interface WalletIconProps {
  /** Icon size in pixels */
  size?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * SVG Pixel Art Icons for Wallets and OAuth providers
 * All icons use terminal green (#33FF33) color palette
 * Designed on 24x24 grid for pixel-perfect rendering
 */

// MetaMask Fox - simplified pixel art
export function MetaMaskIcon({ size = 24, className }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-terminal-green', className)}
      aria-hidden="true"
    >
      {/* Fox head shape - pixel art style */}
      <path
        d="M12 4L6 8L4 12L6 16L8 18L12 20L16 18L18 16L20 12L18 8L12 4Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 4L6 8M12 4L18 8M6 8L4 12L6 16M18 8L20 12L18 16M6 16L8 18L12 20M18 16L16 18L12 20M8 10L12 8L16 10M8 14L12 16L16 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* Eyes */}
      <rect x="9" y="11" width="2" height="2" fill="currentColor" />
      <rect x="13" y="11" width="2" height="2" fill="currentColor" />
    </svg>
  )
}

// WalletConnect - stylized W
export function WalletConnectIcon({ size = 24, className }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-terminal-green', className)}
      aria-hidden="true"
    >
      {/* W shape with connecting arcs */}
      <path
        d="M4 8L8 16L12 10L16 16L20 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Connection dots */}
      <circle cx="4" cy="8" r="1.5" fill="currentColor" />
      <circle cx="20" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Coinbase - C in square
export function CoinbaseIcon({ size = 24, className }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-terminal-green', className)}
      aria-hidden="true"
    >
      {/* Square border */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* C letter */}
      <path
        d="M15 9H11C10 9 9 10 9 11V13C9 14 10 15 11 15H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  )
}

// Google - G letter pixel style
export function GoogleIcon({ size = 24, className }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-terminal-green', className)}
      aria-hidden="true"
    >
      {/* G shape */}
      <path
        d="M20 12H12V14H18C17.5 16.5 15 18 12 18C8.5 18 6 15.5 6 12C6 8.5 8.5 6 12 6C14 6 15.5 7 16.5 8L18.5 6C17 4.5 14.5 4 12 4C7.5 4 4 7.5 4 12C4 16.5 7.5 20 12 20C16.5 20 20 16.5 20 12Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M20 12H12M12 12V14H18M12 4C7.5 4 4 7.5 4 12C4 16.5 7.5 20 12 20C16.5 20 20 16.5 20 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  )
}

// GitHub - Octocat simplified
export function GitHubIcon({ size = 24, className }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-terminal-green', className)}
      aria-hidden="true"
    >
      {/* Cat head shape */}
      <path
        d="M12 4C8 4 5 7 5 11C5 14 7 16.5 10 17.5V20H14V17.5C17 16.5 19 14 19 11C19 7 16 4 12 4Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 4C8 4 5 7 5 11C5 14 7 16.5 10 17.5V20H14V17.5C17 16.5 19 14 19 11C19 7 16 4 12 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* Eyes */}
      <rect x="8" y="10" width="2" height="2" fill="currentColor" />
      <rect x="14" y="10" width="2" height="2" fill="currentColor" />
      {/* Ears */}
      <path d="M6 6L5 4M18 6L19 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

// Generic wallet icon
export function WalletIcon({ size = 24, className }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-terminal-green', className)}
      aria-hidden="true"
    >
      {/* Wallet body */}
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Card slot */}
      <rect x="14" y="10" width="4" height="4" fill="currentColor" />
      {/* Fold line */}
      <path d="M4 10H10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * Get the appropriate wallet icon component for a connector ID
 */
export function getWalletIcon(connectorId: string) {
  switch (connectorId) {
    case 'injected':
      return MetaMaskIcon
    case 'walletConnect':
      return WalletConnectIcon
    case 'coinbaseWalletSDK':
      return CoinbaseIcon
    default:
      return WalletIcon
  }
}

/**
 * Get the appropriate OAuth icon component for a provider ID
 */
export function getOAuthIcon(providerId: string) {
  switch (providerId) {
    case 'google':
      return GoogleIcon
    case 'github':
      return GitHubIcon
    default:
      return WalletIcon
  }
}
