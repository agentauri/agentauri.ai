import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/setup'
import { API_BASE_URL, API_VERSION } from '@/lib/constants'
import { useTriggerForm, type TriggerFormStep } from '../use-trigger-form'

const baseUrl = `${API_BASE_URL}/api/${API_VERSION}`

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useTriggerForm', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const mockOrgId = '550e8400-e29b-41d4-a716-446655440000'

  const mockTrigger = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    organizationId: mockOrgId,
    name: 'Existing Trigger',
    description: 'An existing trigger',
    chainId: 1,
    registry: 'identity' as const,
    enabled: true,
    isStateful: false,
    executionCount: 5,
    lastExecutedAt: '2025-01-01T00:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    conditions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        triggerId: '550e8400-e29b-41d4-a716-446655440001',
        conditionType: 'event_filter',
        field: 'eventType',
        operator: 'eq' as const,
        value: 'transfer',
        config: {},
        createdAt: '2025-01-01T00:00:00Z',
      },
    ],
    actions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        triggerId: '550e8400-e29b-41d4-a716-446655440001',
        actionType: 'telegram' as const,
        priority: 0,
        config: { chatId: '123456' },
        createdAt: '2025-01-01T00:00:00Z',
      },
    ],
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
    mockPush.mockClear()
  })

  afterEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize in create mode with default values', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      expect(result.current.mode).toBe('create')
      expect(result.current.form.getValues('name')).toBe('')
      expect(result.current.form.getValues('chainId')).toBe(1) // MAINNET
      expect(result.current.form.getValues('registry')).toBe('reputation')
      expect(result.current.form.getValues('enabled')).toBe(true)
    })

    it('should initialize in edit mode with existing trigger values', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId, mockTrigger, 'edit'), {
        wrapper: createWrapper(),
      })

      expect(result.current.mode).toBe('edit')
      expect(result.current.form.getValues('name')).toBe('Existing Trigger')
      expect(result.current.form.getValues('description')).toBe('An existing trigger')
      expect(result.current.form.getValues('chainId')).toBe(1)
      expect(result.current.form.getValues('registry')).toBe('identity')
    })

    it('should initialize conditions from existing trigger', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId, mockTrigger, 'edit'), {
        wrapper: createWrapper(),
      })

      const conditions = result.current.form.getValues('conditions')
      expect(conditions).toHaveLength(1)
      expect(conditions[0].conditionType).toBe('event_filter')
      expect(conditions[0].field).toBe('eventType')
      expect(conditions[0].value).toBe('transfer')
    })

    it('should initialize actions from existing trigger', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId, mockTrigger, 'edit'), {
        wrapper: createWrapper(),
      })

      const actions = result.current.form.getValues('actions')
      expect(actions).toHaveLength(1)
      expect(actions[0].actionType).toBe('telegram')
      expect(actions[0].config).toEqual({ chatId: '123456' })
    })
  })

  describe('step management', () => {
    it('should start at basic step', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      expect(result.current.steps.currentStep).toBe('basic')
      expect(result.current.steps.isFirst).toBe(true)
      expect(result.current.steps.isLast).toBe(false)
    })

    it('should have correct step progression', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      const expectedSteps: TriggerFormStep[] = ['basic', 'conditions', 'actions', 'review']

      // Manually go through steps using goTo
      for (let i = 0; i < expectedSteps.length; i++) {
        act(() => {
          result.current.steps.goTo(expectedSteps[i])
        })
        expect(result.current.steps.currentStep).toBe(expectedSteps[i])
      }
    })

    it('should track progress correctly', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      // First step: 25% progress
      expect(result.current.steps.progress).toBe(25)

      // Go to last step
      act(() => {
        result.current.steps.goTo('review')
      })

      // Last step: 100% progress
      expect(result.current.steps.progress).toBe(100)
    })
  })

  describe('validateStep', () => {
    it('should validate basic step fields', async () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      // With empty name, validation should fail
      let isValid: boolean
      await act(async () => {
        isValid = await result.current.validateStep('basic')
      })

      expect(isValid!).toBe(false)

      // Set valid name
      act(() => {
        result.current.form.setValue('name', 'Valid Trigger Name')
      })

      await act(async () => {
        isValid = await result.current.validateStep('basic')
      })

      expect(isValid!).toBe(true)
    })

    it('should validate conditions step', async () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      // With empty condition, validation should fail
      let isValid: boolean
      await act(async () => {
        isValid = await result.current.validateStep('conditions')
      })

      expect(isValid!).toBe(false)

      // Set valid condition
      act(() => {
        result.current.form.setValue('conditions', [
          {
            conditionType: 'event_filter',
            field: 'eventType',
            operator: 'eq',
            value: 'transfer',
            config: {},
          },
        ])
      })

      await act(async () => {
        isValid = await result.current.validateStep('conditions')
      })

      expect(isValid!).toBe(true)
    })

    it('should always pass review step validation', async () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      let isValid: boolean
      await act(async () => {
        isValid = await result.current.validateStep('review')
      })

      expect(isValid!).toBe(true)
    })
  })

  describe('onSubmit - create mode', () => {
    it('should create trigger and redirect', async () => {
      const createdTrigger = {
        ...mockTrigger,
        id: '550e8400-e29b-41d4-a716-446655440005',
      }

      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/triggers`, async () => {
          return HttpResponse.json(createdTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      // Set valid form data
      act(() => {
        result.current.form.setValue('name', 'New Trigger')
        result.current.form.setValue('conditions', [
          {
            conditionType: 'event_filter',
            field: 'eventType',
            operator: 'eq',
            value: 'transfer',
            config: {},
          },
        ])
        result.current.form.setValue('actions', [
          {
            actionType: 'telegram',
            priority: 0,
            config: { chatId: '123' },
          },
        ])
      })

      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues())
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(`/dashboard/triggers/${createdTrigger.id}`)
      })
    })
  })

  describe('onSubmit - edit mode', () => {
    it('should update trigger and redirect', async () => {
      server.use(
        http.patch(`${baseUrl}/triggers/${mockTrigger.id}`, async () => {
          return HttpResponse.json({ ...mockTrigger, name: 'Updated Name' })
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useTriggerForm(mockOrgId, mockTrigger, 'edit'), {
        wrapper: createWrapper(),
      })

      // Update name
      act(() => {
        result.current.form.setValue('name', 'Updated Name')
      })

      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues())
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(`/dashboard/triggers/${mockTrigger.id}`)
      })
    })
  })

  describe('isSubmitting', () => {
    it('should start as not submitting', () => {
      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      expect(result.current.isSubmitting).toBe(false)
    })

    it('should return to not submitting after completion', async () => {
      server.use(
        http.post(`${baseUrl}/organizations/${mockOrgId}/triggers`, async () => {
          return HttpResponse.json(mockTrigger)
        }),
        http.get(`${baseUrl}/csrf-token`, () => {
          return HttpResponse.json({ token: 'test-csrf' })
        })
      )

      const { result } = renderHook(() => useTriggerForm(mockOrgId), {
        wrapper: createWrapper(),
      })

      // Set valid form data
      act(() => {
        result.current.form.setValue('name', 'Test Trigger')
        result.current.form.setValue('conditions', [
          {
            conditionType: 'event_filter',
            field: 'eventType',
            operator: 'eq',
            value: 'transfer',
            config: {},
          },
        ])
        result.current.form.setValue('actions', [
          {
            actionType: 'telegram',
            priority: 0,
            config: { chatId: '123' },
          },
        ])
      })

      // Submit and wait for completion
      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues())
      })

      // Should be done submitting
      expect(result.current.isSubmitting).toBe(false)
    })
  })
})
