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
 * Agents API client
 */
export const agentsApi = {
  /**
   * List linked agents for organization
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
   */
  async get(orgId: string, agentAddress: string): Promise<LinkedAgent> {
    const data = await apiClient.get<LinkedAgent>(
      `/organizations/${orgId}/agents/${agentAddress}`
    )
    return linkedAgentSchema.parse(data)
  },

  /**
   * Link an agent to organization
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
   */
  async unlink(orgId: string, agentAddress: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgId}/agents/${agentAddress}`)
  },
}
