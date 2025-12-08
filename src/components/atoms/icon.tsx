/**
 * Pixel-art SVG icon library
 * All icons are designed on a 16x16 grid with sharp, pixel-perfect edges
 */

import type * as React from 'react'
import { cn } from '@/lib/utils'

export type IconName =
  // Navigation
  | 'dashboard'
  | 'triggers'
  | 'events'
  | 'agents'
  | 'api-keys'
  | 'settings'
  // Actions
  | 'close'
  | 'add'
  | 'remove'
  | 'help'
  | 'warning'
  | 'info'
  | 'check'
  | 'retry'
  // Status
  | 'active'
  | 'inactive'
  | 'star'
  // Arrows
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-up'
  | 'chevron-down'
  | 'expand'
  | 'collapse'
  | 'active-nav'
  // Operators
  | 'not-equal'
  | 'greater-equal'
  | 'less-equal'
  // Conditions
  | 'chart'
  | 'robot'
  | 'lightning'
  | 'search'
  | 'clock'
  // Special
  | 'logo'
  | 'menu'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
}

// All icons are pixel-art style on 16x16 grid
const icons: Record<IconName, React.ReactNode> = {
  // === NAVIGATION ===

  // Dashboard: Terminal cursor prompt >_
  dashboard: (
    <path d="M2 7h2v2H2zM4 7h2v2H4zM6 7h2v2H6zM10 7h2v2h-2zM10 9h2v2h-2zM12 9h2v2h-2z" />
  ),

  // Triggers: Hash/grid #
  triggers: (
    <path d="M5 2h2v12H5zM9 2h2v12H9zM2 5h12v2H2zM2 9h12v2H2z" />
  ),

  // Events: Wave/pulse ~
  events: (
    <path d="M1 8h2v2H1zM3 6h2v2H3zM5 8h2v2H5zM7 6h2v2H7zM9 8h2v2H9zM11 6h2v2h-2zM13 8h2v2h-2z" />
  ),

  // Agents: At symbol @
  agents: (
    <path d="M5 2h6v2H5zM3 4h2v2H3zM11 4h2v2h-2zM2 6h2v6H2zM12 6h2v4h-2zM6 6h4v2H6zM5 8h2v2H5zM9 8h2v4H9zM6 10h4v2H6zM5 12h6v2H5zM12 12h2v2h-2z" />
  ),

  // API Keys: Key shape *
  'api-keys': (
    <path d="M7 2h2v2H7zM4 4h2v2H4zM10 4h2v2h-2zM2 6h2v2H2zM12 6h2v2h-2zM4 8h2v2H4zM10 8h2v2h-2zM7 10h2v2H7zM7 12h2v2H7z" />
  ),

  // Settings: Sliders/hamburger
  settings: (
    <path d="M2 3h12v2H2zM2 7h12v2H2zM2 11h12v2H2zM4 2h2v4H4zM10 6h2v4h-2zM6 10h2v4H6z" />
  ),

  // === ACTIONS ===

  // Close: X mark
  close: (
    <path d="M3 3h2v2H3zM11 3h2v2h-2zM5 5h2v2H5zM9 5h2v2H9zM7 7h2v2H7zM5 9h2v2H5zM9 9h2v2H9zM3 11h2v2H3zM11 11h2v2h-2z" />
  ),

  // Add: Plus +
  add: (
    <path d="M7 3h2v4H7zM3 7h10v2H3zM7 9h2v4H7z" />
  ),

  // Remove: Minus -
  remove: (
    <path d="M3 7h10v2H3z" />
  ),

  // Help: Question mark ?
  help: (
    <path d="M5 3h6v2H5zM4 5h2v2H4zM10 5h2v2h-2zM10 7h2v2h-2zM8 9h2v2H8zM6 11h2v2H6zM7 13h2v2H7z" />
  ),

  // Warning: Exclamation !
  warning: (
    <path d="M7 1h2v2H7zM6 3h4v2H6zM5 5h6v2H5zM4 7h8v2H4zM3 9h10v2H3zM2 11h12v2H2zM7 5h2v4H7zM7 11h2v2H7z" />
  ),

  // Info: Letter i in circle
  info: (
    <path d="M5 2h6v2H5zM3 4h2v2H3zM11 4h2v2h-2zM2 6h2v4H2zM12 6h2v4h-2zM3 10h2v2H3zM11 10h2v2h-2zM5 12h6v2H5zM7 5h2v2H7zM7 8h2v4H7z" />
  ),

  // Check: Checkmark
  check: (
    <path d="M12 3h2v2h-2zM10 5h2v2h-2zM8 7h2v2H8zM6 9h2v2H6zM4 7h2v2H4zM2 5h2v2H2z" />
  ),

  // Retry: Circular arrow
  retry: (
    <path d="M6 2h6v2H6zM4 4h2v2H4zM12 4h2v2h-2zM2 6h2v4H2zM12 6h2v2h-2zM4 10h2v2H4zM6 12h6v2H6zM10 6h2v2h-2zM8 6h2v2H8zM6 6h2v2H6z" />
  ),

  // === STATUS ===

  // Active: Filled circle
  active: (
    <path d="M5 3h6v2H5zM3 5h2v6H3zM11 5h2v6h-2zM5 11h6v2H5zM5 5h6v6H5z" />
  ),

  // Inactive: Empty circle
  inactive: (
    <path d="M5 3h6v2H5zM3 5h2v6H3zM11 5h2v6h-2zM5 11h6v2H5z" />
  ),

  // Star: 5-point star
  star: (
    <path d="M7 1h2v2H7zM7 3h2v2H7zM1 5h4v2H1zM5 5h2v2H5zM9 5h2v2H9zM11 5h4v2h-4zM5 7h6v2H5zM4 9h2v2H4zM10 9h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2zM2 13h2v2H2zM12 13h2v2h-2z" />
  ),

  // === ARROWS ===

  // Arrow right: →
  'arrow-right': (
    <path d="M2 7h8v2H2zM8 5h2v2H8zM10 7h2v2h-2zM8 9h2v2H8zM12 7h2v2h-2z" />
  ),

  // Arrow up: ↑
  'arrow-up': (
    <path d="M7 2h2v10H7zM5 4h2v2H5zM9 4h2v2H9zM3 6h2v2H3zM11 6h2v2h-2z" />
  ),

  // Arrow down: ↓
  'arrow-down': (
    <path d="M7 2h2v10H7zM5 10h2v2H5zM9 10h2v2H9zM3 8h2v2H3zM11 8h2v2h-2z" />
  ),

  // Chevron right: >
  'chevron-right': (
    <path d="M5 3h2v2H5zM7 5h2v2H7zM9 7h2v2H9zM7 9h2v2H7zM5 11h2v2H5z" />
  ),

  // Chevron left: <
  'chevron-left': (
    <path d="M9 3h2v2H9zM7 5h2v2H7zM5 7h2v2H5zM7 9h2v2H7zM9 11h2v2H9z" />
  ),

  // Chevron up: ^
  'chevron-up': (
    <path d="M7 5h2v2H7zM5 7h2v2H5zM9 7h2v2H9zM3 9h2v2H3zM11 9h2v2h-2z" />
  ),

  // Chevron down: v
  'chevron-down': (
    <path d="M3 5h2v2H3zM11 5h2v2h-2zM5 7h2v2H5zM9 7h2v2H9zM7 9h2v2H7z" />
  ),

  // Expand: <<
  expand: (
    <path d="M7 3h2v2H7zM5 5h2v2H5zM3 7h2v2H3zM5 9h2v2H5zM7 11h2v2H7zM11 3h2v2h-2zM9 5h2v2H9zM7 7h2v2H7zM9 9h2v2H9zM11 11h2v2h-2z" />
  ),

  // Collapse: >>
  collapse: (
    <path d="M3 3h2v2H3zM5 5h2v2H5zM7 7h2v2H7zM5 9h2v2H5zM3 11h2v2H3zM7 3h2v2H7zM9 5h2v2H9zM11 7h2v2h-2zM9 9h2v2H9zM7 11h2v2H7z" />
  ),

  // Active nav: >>>
  'active-nav': (
    <path d="M1 3h2v2H1zM3 5h2v2H3zM5 7h2v2H5zM3 9h2v2H3zM1 11h2v2H1zM5 3h2v2H5zM7 5h2v2H7zM9 7h2v2H9zM7 9h2v2H7zM5 11h2v2H5zM9 3h2v2H9zM11 5h2v2h-2zM13 7h2v2h-2zM11 9h2v2h-2zM9 11h2v2H9z" />
  ),

  // === OPERATORS ===

  // Not equal: ≠
  'not-equal': (
    <path d="M3 5h10v2H3zM3 9h10v2H3zM10 3h2v2h-2zM8 5h2v2H8zM6 7h2v2H6zM4 9h2v2H4z" />
  ),

  // Greater or equal: ≥
  'greater-equal': (
    <path d="M3 3h2v2H3zM5 5h2v2H5zM7 7h2v2H7zM5 9h2v2H5zM3 11h2v2H3zM3 13h8v2H3z" />
  ),

  // Less or equal: ≤
  'less-equal': (
    <path d="M11 3h2v2h-2zM9 5h2v2H9zM7 7h2v2H7zM9 9h2v2H9zM11 11h2v2h-2zM5 13h8v2H5z" />
  ),

  // === CONDITIONS ===

  // Chart: Bar chart
  chart: (
    <path d="M2 10h2v4H2zM5 7h2v7H5zM8 4h2v10H8zM11 6h2v8h-2z" />
  ),

  // Robot: Robot face
  robot: (
    <path d="M7 1h2v2H7zM6 3h4v2H6zM4 5h8v2H4zM3 7h10v6H3zM5 9h2v2H5zM9 9h2v2H9zM6 12h4v2H6z" />
  ),

  // Lightning: Lightning bolt
  lightning: (
    <path d="M8 1h2v2H8zM7 3h2v2H7zM6 5h4v2H6zM5 7h2v2H5zM7 9h2v2H7zM6 11h2v2H6zM8 13h2v2H8z" />
  ),

  // Search: Magnifying glass
  search: (
    <path d="M5 2h4v2H5zM3 4h2v2H3zM9 4h2v2H9zM2 6h2v2H2zM10 6h2v2h-2zM3 8h2v2H3zM9 8h2v2H9zM5 10h4v2H5zM10 10h2v2h-2zM12 12h2v2h-2z" />
  ),

  // Clock: Clock face
  clock: (
    <path d="M5 2h6v2H5zM3 4h2v2H3zM11 4h2v2h-2zM2 6h2v4H2zM12 6h2v4h-2zM3 10h2v2H3zM11 10h2v2h-2zM5 12h6v2H5zM7 5h2v4H7zM9 7h2v2H9z" />
  ),

  // === SPECIAL ===

  // Logo: Stylized 8
  logo: (
    <path d="M5 2h6v2H5zM3 4h2v2H3zM11 4h2v2h-2zM5 6h6v2H5zM3 8h2v2H3zM11 8h2v2h-2zM3 10h2v2H3zM11 10h2v2h-2zM5 12h6v2H5z" />
  ),

  // Menu: Hamburger menu
  menu: (
    <path d="M2 3h12v2H2zM2 7h12v2H2zM2 11h12v2H2z" />
  ),
}

export function Icon({ name, size = 'md', className, ...props }: IconProps) {
  const s = sizeMap[size]

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn('inline-block shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      {icons[name]}
    </svg>
  )
}

export { icons }
