/**
 * Lib utilities barrel export
 * Provides clean imports for commonly used utilities
 */

// API
export { apiClient, ApiError, clearCsrfToken } from './api-client'

// Configuration
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

// Config helpers
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

// Error handling
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

// Form utilities
export {
  createArrayFieldHandlers,
  useFormSteps,
  omitReadonlyFields,
  getFieldError,
  hasUnsavedChanges,
  formatReviewValue,
  normalizeFormData,
} from './form-utils'

// Rate limiting
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

// Sanitization
export {
  sanitizeHtml,
  sanitizeJson,
  sanitizeWebhookUrl,
  sanitizeConfigValue,
  validateTemplateVariables,
  sanitizeErrorMessage,
  isValidJson,
} from './sanitize'

// Security
export { SecurityUtils, getSecurityHeaders, sanitizeRedirectUrl, isSafeRedirectUrl } from './security-headers'

// Utils
export { cn } from './utils'
