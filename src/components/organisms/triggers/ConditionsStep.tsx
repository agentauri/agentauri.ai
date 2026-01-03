'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Icon } from '@/components/atoms/icon'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Textarea } from '@/components/atoms/textarea'
import { EVENT_TYPES, EVENT_TYPE_INFO, type EventType, type Registry } from '@/lib/constants'
import type { CreateTriggerFormValues } from '@/lib/validations/trigger'

interface ConditionsStepProps {
  form: UseFormReturn<CreateTriggerFormValues>
}

type ConditionOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'startsWith' | 'endsWith'

interface FieldFilter {
  field: string
  operator: ConditionOperator
  value: string
}

const EVENT_TYPE_LIST = Object.values(EVENT_TYPES) as EventType[]

export function ConditionsStep({ form }: ConditionsStepProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FieldFilter[]>([])
  const [selectedEventType, setSelectedEventType] = useState<EventType | ''>('')

  const updateConditions = (eventType: string, fieldFilters: FieldFilter[]) => {
    if (!eventType) {
      form.setValue('conditions', [])
      return
    }

    const conditions: CreateTriggerFormValues['conditions'] = [
      // Primary event type condition
      {
        conditionType: 'event_filter',
        field: 'event_type',
        operator: 'eq' as const,
        value: eventType,
        config: {},
      },
      // Additional field filters
      ...fieldFilters
        .filter((f) => f.field && f.value)
        .map((f) => ({
          conditionType: 'field_comparison',
          field: f.field,
          operator: f.operator,
          value: f.value,
          config: {},
        })),
    ]
    form.setValue('conditions', conditions)
  }

  const addFilter = () => {
    const newFilter: FieldFilter = { field: '', operator: 'eq', value: '' }
    const newFilters = [...filters, newFilter]
    setFilters(newFilters)
    updateConditions(selectedEventType, newFilters)
  }

  const updateFilter = (index: number, filter: FieldFilter) => {
    const newFilters = [...filters]
    newFilters[index] = filter
    setFilters(newFilters)
    updateConditions(selectedEventType, newFilters)
  }

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
    updateConditions(selectedEventType, newFilters)
  }

  const handleEventTypeChange = (value: EventType) => {
    setSelectedEventType(value)
    updateConditions(value, filters)

    // Auto-set registry based on event type
    const eventInfo = EVENT_TYPE_INFO[value]
    if (eventInfo) {
      form.setValue('registry', eventInfo.registry as Registry)
    }
  }

  const selectedInfo = selectedEventType ? EVENT_TYPE_INFO[selectedEventType] : null

  return (
    <Box variant="secondary" padding="md" className="space-y-6">
      <div className="typo-ui text-terminal-green glow mb-4">[2] EVENT TYPE</div>

      {/* Primary Event Type Selection */}
      <FormField
        control={form.control}
        name="conditions"
        render={() => (
          <FormItem>
            <FormLabel className="typo-ui">TRIGGER ON EVENT</FormLabel>
            <FormControl>
              <div className="space-y-3">
                <Select value={selectedEventType} onValueChange={handleEventTypeChange}>
                  <SelectTrigger className="typo-ui">
                    <SelectValue placeholder="Select event type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPE_LIST.map((eventType) => (
                      <SelectItem key={eventType} value={eventType} className="typo-ui">
                        <div className="flex items-center gap-2">
                          <Icon name="lightning" size="sm" />
                          <span>{eventType}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedInfo && (
                  <Box variant="subtle" padding="sm">
                    <div className="flex items-start gap-2">
                      <Icon name="lightning" size="md" className="text-terminal-green" />
                      <div className="flex-1 space-y-1">
                        <div className="typo-ui text-terminal-green">{selectedEventType}</div>
                        <div className="typo-ui text-terminal-dim">{selectedInfo.description}</div>
                        <div className="typo-ui text-terminal-dim/70">
                          Registry: <span className="text-terminal-green">{selectedInfo.registry.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </Box>
                )}
              </div>
            </FormControl>
            <FormDescription className="typo-ui">
              Select which blockchain event triggers this automation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Optional Field Filters - Collapsible Section */}
      <div className="border-t-2 border-terminal-dim pt-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 typo-ui text-terminal-dim hover:text-terminal-green transition-colors"
        >
          <Icon name={showFilters ? 'chevron-down' : 'chevron-right'} size="sm" />
          ADVANCED FILTERS (OPTIONAL)
        </button>

        {showFilters && (
          <div className="pt-4 space-y-4">
            <p className="typo-ui text-terminal-dim">
              Add field filters to narrow down which events trigger this automation
            </p>

            {/* Quick Filters for ReputationUpdated */}
            {selectedEventType === 'ReputationUpdated' && (
              <Box variant="subtle" padding="sm" className="space-y-3">
                <div className="typo-ui text-terminal-green">&gt; REPUTATION FILTERS</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="typo-ui">MINIMUM SCORE</Label>
                    <div className="flex gap-2">
                      <Select
                        defaultValue="gte"
                        onValueChange={(op) => {
                          const existingIndex = filters.findIndex((f) => f.field === 'score')
                          if (existingIndex >= 0) {
                            const existingFilter = filters[existingIndex]
                            if (existingFilter) {
                              updateFilter(existingIndex, { ...existingFilter, operator: op as ConditionOperator })
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="typo-ui w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gte" className="typo-ui">≥</SelectItem>
                          <SelectItem value="gt" className="typo-ui">&gt;</SelectItem>
                          <SelectItem value="eq" className="typo-ui">=</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="e.g., 80"
                        className="typo-ui flex-1"
                        onChange={(e) => {
                          const value = e.target.value
                          const existingIndex = filters.findIndex((f) => f.field === 'score')
                          if (existingIndex >= 0) {
                            const existingFilter = filters[existingIndex]
                            if (existingFilter) {
                              updateFilter(existingIndex, { ...existingFilter, value })
                            }
                          } else if (value) {
                            const newFilters: FieldFilter[] = [...filters, { field: 'score', operator: 'gte' as const, value }]
                            setFilters(newFilters)
                            updateConditions(selectedEventType, newFilters)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Box>
            )}

            {/* Agent Address Filter */}
            <Box variant="subtle" padding="sm" className="space-y-3">
              <div className="typo-ui text-terminal-green">&gt; AGENT FILTER</div>
              <div className="space-y-2">
                <Label className="typo-ui">AGENT ADDRESS(ES)</Label>
                <Textarea
                  placeholder="0x1234..., 0x5678... (comma-separated)"
                  className="typo-code"
                  rows={2}
                  onChange={(e) => {
                    const value = e.target.value.trim()
                    const existingIndex = filters.findIndex((f) => f.field === 'agent_address')
                    if (existingIndex >= 0) {
                      if (value) {
                        const existingFilter = filters[existingIndex]
                        if (existingFilter) {
                          updateFilter(existingIndex, { ...existingFilter, value })
                        }
                      } else {
                        removeFilter(existingIndex)
                      }
                    } else if (value) {
                      const newFilters: FieldFilter[] = [...filters, { field: 'agent_address', operator: 'in' as const, value }]
                      setFilters(newFilters)
                      updateConditions(selectedEventType, newFilters)
                    }
                  }}
                />
                <p className="typo-ui text-terminal-dim/70">Leave empty to match all agents</p>
              </div>
            </Box>

            {/* Custom Field Filters */}
            <div className="space-y-3">
              <div className="typo-ui text-terminal-dim">&gt; CUSTOM FIELD FILTERS</div>
              {filters
                .filter((f) => !['score', 'agent_address'].includes(f.field))
                .map((filter) => {
                  const actualIndex = filters.indexOf(filter)
                  return (
                    <Box key={actualIndex} variant="subtle" padding="sm">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div className="space-y-1">
                          <Label className="typo-ui">FIELD</Label>
                          <Input
                            value={filter.field}
                            onChange={(e) => updateFilter(actualIndex, { ...filter, field: e.target.value })}
                            placeholder="e.g., metadata.type"
                            className="typo-code"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="typo-ui">OPERATOR</Label>
                          <Select
                            value={filter.operator}
                            onValueChange={(op) => updateFilter(actualIndex, { ...filter, operator: op as ConditionOperator })}
                          >
                            <SelectTrigger className="typo-ui">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="eq" className="typo-ui">= (equals)</SelectItem>
                              <SelectItem value="ne" className="typo-ui">≠ (not equals)</SelectItem>
                              <SelectItem value="gt" className="typo-ui">&gt; (greater)</SelectItem>
                              <SelectItem value="gte" className="typo-ui">≥ (greater or equal)</SelectItem>
                              <SelectItem value="lt" className="typo-ui">&lt; (less)</SelectItem>
                              <SelectItem value="lte" className="typo-ui">≤ (less or equal)</SelectItem>
                              <SelectItem value="contains" className="typo-ui">contains</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="typo-ui">VALUE</Label>
                          <Input
                            value={filter.value}
                            onChange={(e) => updateFilter(actualIndex, { ...filter, value: e.target.value })}
                            placeholder="Value"
                            className="typo-ui"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFilter(actualIndex)}
                          className="typo-ui text-red-400 hover:text-red-300"
                        >
                          <Icon name="close" size="sm" />
                        </Button>
                      </div>
                    </Box>
                  )
                })}
              <Button type="button" variant="outline" size="sm" onClick={addFilter} className="typo-ui">
                <Icon name="add" size="sm" className="mr-1" />
                ADD CUSTOM FILTER
              </Button>
            </div>
          </div>
        )}
      </div>
    </Box>
  )
}
