/**
 * React hooks barrel export
 *
 * Central export point for all custom React hooks used in the AgentAuri platform.
 * Hooks are organized into three categories: API/data hooks, utility hooks, and animation hooks.
 *
 * @module hooks
 *
 * @example
 * ```tsx
 * import {
 *   // API & data hooks
 *   useAuth,
 *   useSession,
 *   useOrganizations,
 *   useAgents,
 *   useTriggers,
 *   useEvents,
 *   useApiKeys,
 *   useCreditBalance,
 *
 *   // Utility hooks
 *   useCopyToClipboard,
 *   useFormSteps,
 *
 *   // Animation hooks
 *   useGlitchAnimation,
 *   useWarpAnimation,
 *   usePixelAnimation,
 *   useMouseParallax,
 * } from '@/hooks'
 * ```
 */

// ============================================================================
// API & Data Hooks
// ============================================================================

export * from './use-agents'
export * from './use-api-keys'
export * from './use-auth'
export * from './use-billing'
export * from './use-events'
export * from './use-health'
export * from './use-organizations'
export * from './use-triggers'
export * from './use-trigger-form'
export * from './use-user-profile'

// ============================================================================
// Utility Hooks
// ============================================================================

export * from './use-copy-to-clipboard'
export * from './use-form-steps'

// ============================================================================
// Animation Hooks
// ============================================================================

export * from './use-pixel-animation'
export * from './use-glitch-animation'
export * from './use-warp-animation'
export * from './use-mouse-parallax'
