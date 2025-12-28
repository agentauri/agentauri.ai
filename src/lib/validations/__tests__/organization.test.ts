import { describe, expect, it } from 'vitest'
import {
  createOrganizationRequestSchema,
  inviteMemberRequestSchema,
  organizationMemberSchema,
  organizationSchema,
  organizationWithRoleSchema,
  updateMemberRoleRequestSchema,
  updateOrganizationRequestSchema,
} from '../organization'

describe('Organization validation schemas', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'
  const validDatetime = '2025-01-01T00:00:00Z'

  describe('organizationSchema', () => {
    const validOrganization = {
      id: validUuid,
      name: 'Test Organization',
      slug: 'test-org',
      description: 'A test organization',
      is_personal: false,
      created_at: validDatetime,
      updated_at: validDatetime,
    }

    it('should accept valid organization', () => {
      const result = organizationSchema.parse(validOrganization)
      expect(result.name).toBe('Test Organization')
      expect(result.slug).toBe('test-org')
    })

    it('should accept nullable description', () => {
      const org = { ...validOrganization, description: null }
      const result = organizationSchema.parse(org)
      expect(result.description).toBeNull()
    })

    it('should enforce name min length', () => {
      expect(() => organizationSchema.parse({ ...validOrganization, name: '' })).toThrow()
    })

    it('should enforce name max length', () => {
      expect(() => organizationSchema.parse({ ...validOrganization, name: 'a'.repeat(101) })).toThrow()
    })

    it('should enforce slug format (lowercase alphanumeric with hyphens)', () => {
      expect(() => organizationSchema.parse({ ...validOrganization, slug: 'Valid-Slug' })).toThrow()
      expect(() => organizationSchema.parse({ ...validOrganization, slug: 'invalid_slug' })).toThrow()
      expect(() => organizationSchema.parse({ ...validOrganization, slug: 'valid-slug-123' })).not.toThrow()
    })

    it('should enforce description max length', () => {
      expect(() => organizationSchema.parse({ ...validOrganization, description: 'a'.repeat(501) })).toThrow()
    })

    it('should require boolean is_personal', () => {
      const result = organizationSchema.parse({ ...validOrganization, is_personal: true })
      expect(result.is_personal).toBe(true)
    })
  })

  describe('organizationWithRoleSchema', () => {
    // Flat structure matching backend response
    const validOrgWithRole = {
      id: validUuid,
      name: 'Test Organization',
      slug: 'test-org',
      description: null,
      is_personal: false,
      created_at: validDatetime,
      updated_at: validDatetime,
      my_role: 'owner' as const,
    }

    it('should accept valid organization with role', () => {
      const result = organizationWithRoleSchema.parse(validOrgWithRole)
      expect(result.name).toBe('Test Organization')
      expect(result.my_role).toBe('owner')
    })

    it('should accept all valid roles', () => {
      const roles = ['owner', 'admin', 'member', 'viewer'] as const

      for (const role of roles) {
        const orgWithRole = { ...validOrgWithRole, my_role: role }
        expect(() => organizationWithRoleSchema.parse(orgWithRole)).not.toThrow()
      }
    })

    it('should reject invalid role', () => {
      const orgWithRole = { ...validOrgWithRole, my_role: 'superadmin' }
      expect(() => organizationWithRoleSchema.parse(orgWithRole)).toThrow()
    })
  })

  describe('organizationMemberSchema', () => {
    const validMember = {
      id: validUuid,
      userId: validUuid,
      organizationId: validUuid,
      role: 'member' as const,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: validDatetime,
    }

    it('should accept valid member', () => {
      const result = organizationMemberSchema.parse(validMember)
      expect(result.username).toBe('testuser')
      expect(result.role).toBe('member')
    })

    it('should reject invalid email', () => {
      expect(() => organizationMemberSchema.parse({ ...validMember, email: 'not-an-email' })).toThrow()
    })

    it('should accept all valid roles', () => {
      const roles = ['owner', 'admin', 'member', 'viewer'] as const

      for (const role of roles) {
        const member = { ...validMember, role }
        expect(() => organizationMemberSchema.parse(member)).not.toThrow()
      }
    })
  })

  describe('createOrganizationRequestSchema', () => {
    const validRequest = {
      name: 'New Organization',
    }

    it('should accept valid request with name only', () => {
      const result = createOrganizationRequestSchema.parse(validRequest)
      expect(result.name).toBe('New Organization')
    })

    it('should accept request with optional slug', () => {
      const result = createOrganizationRequestSchema.parse({ ...validRequest, slug: 'new-org' })
      expect(result.slug).toBe('new-org')
    })

    it('should accept request with optional description', () => {
      const result = createOrganizationRequestSchema.parse({ ...validRequest, description: 'A new org' })
      expect(result.description).toBe('A new org')
    })

    it('should enforce name min length', () => {
      expect(() => createOrganizationRequestSchema.parse({ name: 'a' })).toThrow()
    })

    it('should enforce name max length', () => {
      expect(() => createOrganizationRequestSchema.parse({ name: 'a'.repeat(101) })).toThrow()
    })

    it('should enforce slug min length when provided', () => {
      expect(() => createOrganizationRequestSchema.parse({ ...validRequest, slug: 'a' })).toThrow()
    })

    it('should enforce slug max length', () => {
      expect(() => createOrganizationRequestSchema.parse({ ...validRequest, slug: 'a'.repeat(51) })).toThrow()
    })

    it('should enforce slug format', () => {
      expect(() => createOrganizationRequestSchema.parse({ ...validRequest, slug: 'Invalid_Slug' })).toThrow()
      expect(() => createOrganizationRequestSchema.parse({ ...validRequest, slug: 'valid-slug' })).not.toThrow()
    })

    it('should enforce description max length', () => {
      expect(() => createOrganizationRequestSchema.parse({ ...validRequest, description: 'a'.repeat(501) })).toThrow()
    })
  })

  describe('updateOrganizationRequestSchema', () => {
    it('should accept empty object', () => {
      const result = updateOrganizationRequestSchema.parse({})
      expect(result).toEqual({})
    })

    it('should accept partial update with name', () => {
      const result = updateOrganizationRequestSchema.parse({ name: 'Updated Name' })
      expect(result.name).toBe('Updated Name')
    })

    it('should accept nullable description', () => {
      const result = updateOrganizationRequestSchema.parse({ description: null })
      expect(result.description).toBeNull()
    })

    it('should validate name when provided', () => {
      expect(() => updateOrganizationRequestSchema.parse({ name: 'a' })).toThrow()
      expect(() => updateOrganizationRequestSchema.parse({ name: 'a'.repeat(101) })).toThrow()
    })

    it('should validate description when provided', () => {
      expect(() => updateOrganizationRequestSchema.parse({ description: 'a'.repeat(501) })).toThrow()
    })
  })

  describe('inviteMemberRequestSchema', () => {
    const validInvite = {
      email: 'newmember@example.com',
      role: 'member' as const,
    }

    it('should accept valid invite', () => {
      const result = inviteMemberRequestSchema.parse(validInvite)
      expect(result.email).toBe('newmember@example.com')
      expect(result.role).toBe('member')
    })

    it('should reject invalid email', () => {
      expect(() => inviteMemberRequestSchema.parse({ ...validInvite, email: 'invalid' })).toThrow()
    })

    it('should accept admin role', () => {
      const result = inviteMemberRequestSchema.parse({ ...validInvite, role: 'admin' })
      expect(result.role).toBe('admin')
    })

    it('should accept member role', () => {
      const result = inviteMemberRequestSchema.parse({ ...validInvite, role: 'member' })
      expect(result.role).toBe('member')
    })

    it('should accept viewer role', () => {
      const result = inviteMemberRequestSchema.parse({ ...validInvite, role: 'viewer' })
      expect(result.role).toBe('viewer')
    })

    it('should reject owner role (cannot invite as owner)', () => {
      expect(() => inviteMemberRequestSchema.parse({ ...validInvite, role: 'owner' })).toThrow()
    })
  })

  describe('updateMemberRoleRequestSchema', () => {
    it('should accept admin role', () => {
      const result = updateMemberRoleRequestSchema.parse({ role: 'admin' })
      expect(result.role).toBe('admin')
    })

    it('should accept member role', () => {
      const result = updateMemberRoleRequestSchema.parse({ role: 'member' })
      expect(result.role).toBe('member')
    })

    it('should accept viewer role', () => {
      const result = updateMemberRoleRequestSchema.parse({ role: 'viewer' })
      expect(result.role).toBe('viewer')
    })

    it('should reject owner role (cannot change to owner)', () => {
      expect(() => updateMemberRoleRequestSchema.parse({ role: 'owner' })).toThrow()
    })

    it('should reject invalid role', () => {
      expect(() => updateMemberRoleRequestSchema.parse({ role: 'superadmin' })).toThrow()
    })
  })
})
