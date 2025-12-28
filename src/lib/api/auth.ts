import { apiClient } from '@/lib/api-client'
import { API_VERSION, OAUTH_BASE_URL } from '@/lib/constants'
import {
  type ClassicLoginRequest,
  type ClassicLoginResponse,
  classicLoginResponseSchema,
  exchangeCodeResponseSchema,
  type LogoutResponse,
  logoutResponseSchema,
  type NonceResponse,
  nonceResponseSchema,
  type OAuthProvider,
  type RefreshTokenResponse,
  refreshTokenResponseSchema,
  type UserSession,
  userSessionSchema,
  type WalletLoginRequest,
  type WalletLoginResponse,
  walletLoginResponseSchema,
} from '@/lib/validations'

/**
 * Auth API client
 * Updated to match backend spec from api.agentauri.ai
 */
export const authApi = {
  /**
   * Get OAuth authorization URL for redirect
   * User should be redirected to this URL to start OAuth flow
   * Note: OAuth requires direct backend URL (can't use proxy for browser redirects)
   */
  getOAuthUrl(provider: OAuthProvider, redirectAfter?: string): string {
    const url = new URL(`/api/${API_VERSION}/auth/${provider}`, OAUTH_BASE_URL)
    if (redirectAfter) {
      url.searchParams.set('redirect_after', redirectAfter)
    }
    return url.toString()
  },

  /**
   * Get account linking URL (for authenticated users to add providers)
   * Note: Uses direct backend URL like OAuth
   */
  getLinkUrl(provider: OAuthProvider, redirectAfter?: string): string {
    const url = new URL(`/api/${API_VERSION}/auth/link/${provider}`, OAUTH_BASE_URL)
    if (redirectAfter) {
      url.searchParams.set('redirect_after', redirectAfter)
    }
    return url.toString()
  },

  /**
   * Get nonce for SIWE (wallet) authentication
   * Returns a pre-formatted message to sign
   */
  async getNonce(): Promise<NonceResponse> {
    const data = await apiClient.post<NonceResponse>('/auth/nonce')
    return nonceResponseSchema.parse(data)
  },

  /**
   * Login with wallet signature (SIWE)
   */
  async loginWithWallet(request: WalletLoginRequest): Promise<WalletLoginResponse> {
    const data = await apiClient.post<WalletLoginResponse>('/auth/wallet', request)
    return walletLoginResponseSchema.parse(data)
  },

  /**
   * Login with username/email and password
   */
  async loginWithPassword(request: ClassicLoginRequest): Promise<ClassicLoginResponse> {
    const data = await apiClient.post<ClassicLoginResponse>('/auth/login', request)
    return classicLoginResponseSchema.parse(data)
  },

  /**
   * Logout current session
   * Clears the auth-token cookie
   */
  async logout(): Promise<LogoutResponse> {
    const data = await apiClient.post<LogoutResponse>('/auth/logout')
    return logoutResponseSchema.parse(data)
  },

  /**
   * Refresh access token using refresh token
   * Backend implements token rotation: old refresh token is invalidated
   * Returns new access token and new refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const data = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return refreshTokenResponseSchema.parse(data)
  },

  /**
   * Exchange OAuth authorization code for tokens
   * Called after OAuth callback redirects with ?code=oac_xxx
   * Code is one-time use and expires in 5 minutes
   */
  async exchangeCode(code: string): Promise<WalletLoginResponse> {
    const data = await apiClient.post<WalletLoginResponse>('/auth/exchange', { code })
    return exchangeCodeResponseSchema.parse(data)
  },

  /**
   * Get current user session
   * Works with both Bearer token and cookie auth
   */
  async getSession(): Promise<UserSession> {
    const data = await apiClient.get<UserSession>('/auth/me')
    return userSessionSchema.parse(data)
  },

  // Legacy method aliases for backward compatibility
  /** @deprecated Use loginWithWallet instead */
  async login(request: WalletLoginRequest): Promise<WalletLoginResponse> {
    return this.loginWithWallet(request)
  },

  /** @deprecated Use getNonce instead (no address param needed) */
  async getNonceForAddress(_address: string): Promise<NonceResponse> {
    return this.getNonce()
  },
}
