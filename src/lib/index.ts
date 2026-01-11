/**
 * Lib utilities barrel export
 *
 * Central export point for all utility modules used throughout the application.
 * Provides clean, organized imports for commonly used utilities.
 *
 * @module lib
 *
 * @example
 * ```ts
 * import {
 *   // API
 *   apiClient,
 *   ApiError,
 *
 *   // Configuration
 *   API_BASE_URL,
 *   SUPPORTED_CHAINS,
 *   type Registry,
 *
 *   // Helpers
 *   getChainName,
 *   formatDate,
 *   formatNumber,
 *
 *   // Error handling
 *   handleError,
 *   normalizeError,
 *
 *   // Utils
 *   cn,
 * } from '@/lib'
 * ```
 */

// ============================================================================
// API Client
// ============================================================================

export { apiClient, ApiError, clearCsrfToken } from './api-client'

// ============================================================================
// Configuration & Constants
// ============================================================================

export {
  API_BASE_URL,
  API_VERSION,
  APP_NAME,
  APP_DESCRIPTION,
  SUPPORTED_CHAINS,
  REGISTRIES,
  ACTION_TYPES,
  ORGANIZATION_ROLES,
  QUERY_TIERS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  type Registry,
  type SupportedChainId,
  type ActionType,
  type OrganizationRole,
  type QueryTier,
} from './constants'

// ============================================================================
// Config Helpers
// ============================================================================

export {
  getChainName,
  getChainOptions,
  getRegistryOptions,
  formatRegistryName,
  isSupportedChain,
  isValidRegistry,
  getOperatorLabel,
  getOperatorOptions,
  getActionTypeLabel,
  getActionTypeOptions,
  getConditionTypeOptions,
  getConditionFieldOptions,
  formatNumber,
  formatDate,
  formatRelativeTime,
} from './config-helpers'

// ============================================================================
// Error Handling
// ============================================================================

export {
  AppError,
  ERROR_CODES,
  normalizeError,
  getUserFriendlyMessage,
  logError,
  handleError,
  retryWithBackoff,
  type ErrorCode,
} from './error-handler'

// ============================================================================
// Form Utilities
// ============================================================================

export {
  createArrayFieldHandlers,
  useFormSteps,
  omitReadonlyFields,
  getFieldError,
  hasUnsavedChanges,
  formatReviewValue,
  normalizeFormData,
} from './form-utils'

// ============================================================================
// Rate Limiting
// ============================================================================

export {
  checkRateLimit,
  resetRateLimit,
  clearAllRateLimits,
  enforceRateLimit,
  withRateLimit,
  RateLimitError,
  RATE_LIMITS,
  type RateLimitConfig,
  type RateLimitResult,
} from './rate-limit'

// ============================================================================
// Sanitization
// ============================================================================

export {
  sanitizeHtml,
  sanitizeJson,
  sanitizeWebhookUrl,
  sanitizeConfigValue,
  validateTemplateVariables,
  sanitizeErrorMessage,
  isValidJson,
} from './sanitize'

// ============================================================================
// Security
// ============================================================================

export { SecurityUtils, getSecurityHeaders, sanitizeRedirectUrl, isSafeRedirectUrl } from './security-headers'

// ============================================================================
// Core Utils
// ============================================================================

export { cn } from './utils'
