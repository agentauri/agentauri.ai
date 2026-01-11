import { apiClient } from '@/lib/api-client'
import {
  type AgentFilters,
  agentListResponseSchema,
  type LinkedAgent,
  linkedAgentSchema,
  type LinkAgentRequest,
} from '@/lib/validations/agent'
import type { PaginationParams } from '@/types/api'

/**
 * Agents API client for managing ERC-8004 agent NFTs
 *
 * Agents are blockchain-based AI agents linked to organizations for monitoring.
 *
 * @see https://docs.agentauri.ai/api/agents
 */
export const agentsApi = {
  /**
   * List linked agents for an organization
   *
   * Returns paginated list of agents with optional filtering.
   *
   * @param orgId - Organization UUID
   * @param params - Pagination and filter parameters
   * @returns Paginated list of linked agents
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member of organization)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const { data: agents, pagination } = await agentsApi.list('org-uuid', {
   *   limit: 10,
   *   chainId: 1,
   * })
   * ```
   */
  async list(
    orgId: string,
    params?: PaginationParams & AgentFilters
  ): Promise<{ data: LinkedAgent[]; pagination: { total: number; hasMore: boolean } }> {
    const data = await apiClient.get(`/organizations/${orgId}/agents`, { params })
    return agentListResponseSchema.parse(data)
  },

  /**
   * Get agent by address
   *
   * Retrieves detailed information about a specific linked agent.
   *
   * @param orgId - Organization UUID
   * @param agentAddress - Agent's Ethereum address (0x...)
   * @returns Linked agent details
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (not a member of organization)
   * @throws {ApiError} 404 - Agent or organization not found
   *
   * @example
   * ```ts
   * const agent = await agentsApi.get('org-uuid', '0x1234...')
   * console.log(`Agent: ${agent.name} on chain ${agent.chainId}`)
   * ```
   */
  async get(orgId: string, agentAddress: string): Promise<LinkedAgent> {
    const data = await apiClient.get<LinkedAgent>(
      `/organizations/${orgId}/agents/${agentAddress}`
    )
    return linkedAgentSchema.parse(data)
  },

  /**
   * Link an agent to organization
   *
   * Associates an ERC-8004 agent NFT with the organization for monitoring.
   * Requires owner or admin role in the organization.
   *
   * @param orgId - Organization UUID
   * @param request - Link agent request with address and chain
   * @returns Newly linked agent details
   * @throws {ApiError} 400 - Invalid agent address or already linked
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Organization not found
   *
   * @example
   * ```ts
   * const agent = await agentsApi.link('org-uuid', {
   *   agentAddress: '0x1234...',
   *   chainId: 1,
   *   name: 'My Trading Agent',
   * })
   * ```
   */
  async link(orgId: string, request: LinkAgentRequest): Promise<LinkedAgent> {
    const data = await apiClient.post<LinkedAgent>(
      `/organizations/${orgId}/agents`,
      request
    )
    return linkedAgentSchema.parse(data)
  },

  /**
   * Unlink agent from organization
   *
   * Removes the association between an agent and the organization.
   * Historical events are preserved. Requires owner or admin role.
   *
   * @param orgId - Organization UUID
   * @param agentAddress - Agent's Ethereum address to unlink
   * @throws {ApiError} 401 - Unauthorized
   * @throws {ApiError} 403 - Forbidden (insufficient permissions)
   * @throws {ApiError} 404 - Agent or organization not found
   *
   * @example
   * ```ts
   * await agentsApi.unlink('org-uuid', '0x1234...')
   * ```
   */
  async unlink(orgId: string, agentAddress: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgId}/agents/${agentAddress}`)
  },
}
