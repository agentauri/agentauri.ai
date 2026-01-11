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
 * Authentication API client for AgentAuri
 *
 * Supports multiple authentication methods:
 * - OAuth (Google, GitHub) via redirect flow
 * - SIWE (Sign-In With Ethereum) for wallet authentication
 * - Classic email/password login
 *
 * @see https://docs.agentauri.ai/api/auth
 */
export const authApi = {
  /**
   * Get OAuth authorization URL for redirect
   *
   * User should be redirected to this URL to start OAuth flow.
   * After authentication, user is redirected back to the callback URL.
   *
   * @param provider - OAuth provider ('google' | 'github')
   * @param redirectAfter - URL to redirect to after successful authentication
   * @returns Full URL for OAuth redirect
   *
   * @example
   * ```ts
   * const url = authApi.getOAuthUrl('google', '/dashboard')
   * window.location.href = url
   * ```
   */
  getOAuthUrl(provider: OAuthProvider, redirectAfter?: string): string {
    const url = new URL(`/api/${API_VERSION}/auth/${provider}`, OAUTH_BASE_URL)
    if (redirectAfter) {
      url.searchParams.set('redirect_after', redirectAfter)
    }
    return url.toString()
  },

  /**
   * Get account linking URL for authenticated users to add OAuth providers
   *
   * Used when a user wants to connect additional OAuth providers to their account.
   *
   * @param provider - OAuth provider to link ('google' | 'github')
   * @param redirectAfter - URL to redirect to after linking
   * @returns Full URL for OAuth linking redirect
   *
   * @example
   * ```ts
   * const url = authApi.getLinkUrl('github', '/settings')
   * window.location.href = url
   * ```
   */
  getLinkUrl(provider: OAuthProvider, redirectAfter?: string): string {
    const url = new URL(`/api/${API_VERSION}/auth/link/${provider}`, OAUTH_BASE_URL)
    if (redirectAfter) {
      url.searchParams.set('redirect_after', redirectAfter)
    }
    return url.toString()
  },

  /**
   * Get nonce for SIWE (Sign-In With Ethereum) authentication
   *
   * Returns a pre-formatted EIP-4361 message to sign with the wallet.
   * Nonce expires after 5 minutes.
   *
   * @param address - Ethereum wallet address (0x...)
   * @returns Nonce response with message to sign
   * @throws {ApiError} 400 - Invalid address format
   *
   * @example
   * ```ts
   * const { nonce, message } = await authApi.getNonce('0x1234...')
   * const signature = await wallet.signMessage(message)
   * ```
   */
  async getNonce(address: string): Promise<NonceResponse> {
    const data = await apiClient.post<NonceResponse>('/auth/nonce', { address })
    return nonceResponseSchema.parse(data)
  },

  /**
   * Login with wallet signature (SIWE)
   *
   * Verifies the signed message and creates a session.
   * Returns access and refresh tokens.
   *
   * @param request - Wallet login request with signature and message
   * @returns Login response with tokens and user info
   * @throws {ApiError} 401 - Invalid signature or expired nonce
   * @throws {ApiError} 400 - Malformed request
   *
   * @example
   * ```ts
   * const response = await authApi.loginWithWallet({
   *   signature: '0x...',
   *   message: nonceResponse.message,
   * })
   * // Store tokens securely
   * ```
   */
  async loginWithWallet(request: WalletLoginRequest): Promise<WalletLoginResponse> {
    const data = await apiClient.post<WalletLoginResponse>('/auth/wallet', request)
    return walletLoginResponseSchema.parse(data)
  },

  /**
   * Login with email/username and password
   *
   * @param request - Login credentials
   * @returns Login response with tokens and user info
   * @throws {ApiError} 401 - Invalid credentials
   * @throws {ApiError} 429 - Too many attempts, rate limited
   *
   * @example
   * ```ts
   * const response = await authApi.loginWithPassword({
   *   email: 'user@example.com',
   *   password: 'securepassword',
   * })
   * ```
   */
  async loginWithPassword(request: ClassicLoginRequest): Promise<ClassicLoginResponse> {
    const data = await apiClient.post<ClassicLoginResponse>('/auth/login', request)
    return classicLoginResponseSchema.parse(data)
  },

  /**
   * Logout current session
   *
   * Invalidates the current session and clears auth cookies.
   *
   * @returns Logout confirmation
   * @throws {ApiError} 401 - Not authenticated
   *
   * @example
   * ```ts
   * await authApi.logout()
   * // Redirect to login page
   * ```
   */
  async logout(): Promise<LogoutResponse> {
    const data = await apiClient.post<LogoutResponse>('/auth/logout')
    return logoutResponseSchema.parse(data)
  },

  /**
   * Refresh access token using refresh token
   *
   * Backend implements token rotation: old refresh token is invalidated
   * and a new pair of tokens is returned.
   *
   * @param refreshToken - Current refresh token
   * @returns New access and refresh tokens
   * @throws {ApiError} 401 - Invalid or expired refresh token
   *
   * @example
   * ```ts
   * const { accessToken, refreshToken: newRefresh } = await authApi.refreshToken(oldRefresh)
   * ```
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const data = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return refreshTokenResponseSchema.parse(data)
  },

  /**
   * Exchange OAuth authorization code for tokens
   *
   * Called after OAuth callback redirects with ?code=oac_xxx.
   * Code is one-time use and expires in 5 minutes.
   *
   * @param code - Authorization code from OAuth callback
   * @returns Login response with tokens and user info
   * @throws {ApiError} 400 - Invalid or expired code
   *
   * @example
   * ```ts
   * // In OAuth callback handler
   * const code = searchParams.get('code')
   * const response = await authApi.exchangeCode(code)
   * ```
   */
  async exchangeCode(code: string): Promise<WalletLoginResponse> {
    const data = await apiClient.post<WalletLoginResponse>('/auth/exchange', { code })
    return exchangeCodeResponseSchema.parse(data)
  },

  /**
   * Get current user session
   *
   * Works with both Bearer token and httpOnly cookie authentication.
   *
   * @returns Current user session with user info and organizations
   * @throws {ApiError} 401 - Not authenticated or token expired
   *
   * @example
   * ```ts
   * const session = await authApi.getSession()
   * console.log(`Logged in as ${session.user.email}`)
   * ```
   */
  async getSession(): Promise<UserSession> {
    const data = await apiClient.get<UserSession>('/auth/me')
    return userSessionSchema.parse(data)
  },

  /**
   * @deprecated Use loginWithWallet instead
   */
  async login(request: WalletLoginRequest): Promise<WalletLoginResponse> {
    return this.loginWithWallet(request)
  },

  /**
   * @deprecated Use getNonce instead
   */
  async getNonceForAddress(address: string): Promise<NonceResponse> {
    return this.getNonce(address)
  },
}
