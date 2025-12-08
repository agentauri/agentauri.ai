'use client'

import { useState } from 'react'
import { ActionLabel } from '@/components/atoms/action-label'
import { Box } from '@/components/atoms/box'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Textarea } from '@/components/atoms/textarea'
import { cn } from '@/lib/utils'
import type { TriggerCondition } from '@/lib/validations/trigger'
import { ConditionTypeSelector, type ConditionType } from './ConditionTypeSelector'

interface ConditionBuilderProps {
  condition: Partial<TriggerCondition> & { tempId?: string }
  onChange: (condition: Partial<TriggerCondition> & { tempId?: string }) => void
  onRemove: () => void
  canRemove: boolean
}

const OPERATORS: Array<{ value: string; label: string; types: string[] }> = [
  { value: 'eq', label: 'Equals (=)', types: ['all'] },
  { value: 'ne', label: 'Not Equals (≠)', types: ['all'] },
  { value: 'gt', label: 'Greater Than (>)', types: ['number', 'time'] },
  { value: 'gte', label: 'Greater or Equal (≥)', types: ['number', 'time'] },
  { value: 'lt', label: 'Less Than (<)', types: ['number', 'time'] },
  { value: 'lte', label: 'Less or Equal (≤)', types: ['number', 'time'] },
  { value: 'in', label: 'In List', types: ['text', 'address'] },
  { value: 'contains', label: 'Contains', types: ['text'] },
  { value: 'startsWith', label: 'Starts With', types: ['text'] },
  { value: 'endsWith', label: 'Ends With', types: ['text'] },
]

export function ConditionBuilder({ condition, onChange, onRemove, canRemove }: ConditionBuilderProps) {
  const [preview, setPreview] = useState('')
  const conditionType = condition.conditionType as ConditionType | undefined

  // Update preview when condition changes
  const updatePreview = () => {
    if (condition.field && condition.operator && condition.value) {
      setPreview(`${condition.field} ${condition.operator} ${condition.value}`)
    } else {
      setPreview('')
    }
  }

  const handleTypeChange = (newType: ConditionType) => {
    // Reset fields when type changes
    const baseUpdate = {
      ...condition,
      conditionType: newType,
      config: {},
    }

    // Set sensible defaults based on type
    switch (newType) {
      case 'reputation_threshold':
        onChange({
          ...baseUpdate,
          field: 'reputation_score',
          operator: 'gt',
          value: '',
        })
        break
      case 'agent_filter':
        onChange({
          ...baseUpdate,
          field: 'agent_address',
          operator: 'in',
          value: '',
        })
        break
      case 'event_filter':
        onChange({
          ...baseUpdate,
          field: 'event_type',
          operator: 'eq',
          value: '',
        })
        break
      case 'field_comparison':
        onChange({
          ...baseUpdate,
          field: '',
          operator: 'gte',
          value: '',
        })
        break
      case 'time_condition':
        onChange({
          ...baseUpdate,
          field: 'event_timestamp',
          operator: 'gt',
          value: '',
        })
        break
      default:
        onChange(baseUpdate)
    }
  }

  // Get relevant operators for current field type
  const getRelevantOperators = () => {
    if (!conditionType) return OPERATORS

    switch (conditionType) {
      case 'reputation_threshold':
      case 'time_condition':
        return OPERATORS.filter((op) => op.types.includes('number') || op.types.includes('time'))
      case 'agent_filter':
        return OPERATORS.filter((op) => op.types.includes('address') || op.value === 'eq')
      case 'event_filter':
      case 'field_comparison':
        return OPERATORS
      default:
        return OPERATORS
    }
  }

  return (
    <Box variant="secondary" padding="md" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="typo-ui text-terminal-green glow">[CONDITION]</div>
        {canRemove && (
          <ActionLabel
            variant="destructive"
            icon="close"
            onClick={onRemove}
            className="self-end sm:self-auto"
          >
            REMOVE
          </ActionLabel>
        )}
      </div>

      {/* Condition Type Selector */}
      <div className="space-y-2">
        <Label className="typo-ui">CONDITION TYPE</Label>
        <ConditionTypeSelector
          value={condition.conditionType ?? ''}
          onChange={handleTypeChange}
          showPreview={true}
        />
      </div>

      {/* Type-specific Configuration */}
      {conditionType === 'reputation_threshold' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; REPUTATION CONFIG</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`cond-operator-${condition.tempId}`} className="typo-ui">
                OPERATOR
              </Label>
              <Select
                value={condition.operator ?? ''}
                onValueChange={(value) => {
                  onChange({ ...condition, operator: value as TriggerCondition['operator'] })
                  updatePreview()
                }}
              >
                <SelectTrigger id={`cond-operator-${condition.tempId}`} className="typo-ui">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getRelevantOperators().map((op) => (
                    <SelectItem key={op.value} value={op.value} className="typo-ui">
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`cond-value-${condition.tempId}`} className="typo-ui">
                SCORE THRESHOLD
              </Label>
              <Input
                id={`cond-value-${condition.tempId}`}
                type="number"
                placeholder="e.g., 800"
                value={condition.value ?? ''}
                onChange={(e) => {
                  onChange({ ...condition, value: e.target.value })
                  updatePreview()
                }}
                onBlur={updatePreview}
                className="typo-ui"
              />
            </div>
          </div>
        </div>
      )}

      {conditionType === 'agent_filter' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; AGENT FILTER CONFIG</div>

          <div className="space-y-2">
            <Label htmlFor={`cond-operator-${condition.tempId}`} className="typo-ui">
              MATCH TYPE
            </Label>
            <Select
              value={condition.operator ?? 'in'}
              onValueChange={(value) => {
                onChange({ ...condition, operator: value as TriggerCondition['operator'] })
                updatePreview()
              }}
            >
              <SelectTrigger id={`cond-operator-${condition.tempId}`} className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eq" className="typo-ui">
                  Exact Match
                </SelectItem>
                <SelectItem value="in" className="typo-ui">
                  In List (comma-separated)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`cond-value-${condition.tempId}`} className="typo-ui">
              AGENT ADDRESS(ES)
            </Label>
            <Textarea
              id={`cond-value-${condition.tempId}`}
              placeholder={
                condition.operator === 'in'
                  ? '0x1234...,0x5678...,0x9abc...'
                  : '0x1234567890abcdef...'
              }
              value={condition.value ?? ''}
              onChange={(e) => {
                onChange({ ...condition, value: e.target.value })
                updatePreview()
              }}
              onBlur={updatePreview}
              className="typo-code"
              rows={2}
            />
            <div className="typo-ui text-terminal-dim/80">
              {condition.operator === 'in'
                ? 'Enter multiple addresses separated by commas'
                : 'Enter a single Ethereum address'}
            </div>
          </div>
        </div>
      )}

      {conditionType === 'event_filter' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; EVENT FILTER CONFIG</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`cond-operator-${condition.tempId}`} className="typo-ui">
                MATCH TYPE
              </Label>
              <Select
                value={condition.operator ?? 'eq'}
                onValueChange={(value) => {
                  onChange({ ...condition, operator: value as TriggerCondition['operator'] })
                  updatePreview()
                }}
              >
                <SelectTrigger id={`cond-operator-${condition.tempId}`} className="typo-ui">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eq" className="typo-ui">
                    Exact Match
                  </SelectItem>
                  <SelectItem value="in" className="typo-ui">
                    In List
                  </SelectItem>
                  <SelectItem value="contains" className="typo-ui">
                    Contains
                  </SelectItem>
                  <SelectItem value="startsWith" className="typo-ui">
                    Starts With
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`cond-value-${condition.tempId}`} className="typo-ui">
                EVENT TYPE
              </Label>
              <Input
                id={`cond-value-${condition.tempId}`}
                type="text"
                placeholder="e.g., ReputationUpdated"
                value={condition.value ?? ''}
                onChange={(e) => {
                  onChange({ ...condition, value: e.target.value })
                  updatePreview()
                }}
                onBlur={updatePreview}
                className="typo-ui"
              />
            </div>
          </div>

          <div className="typo-ui text-terminal-dim/80 p-2 bg-terminal/20 border border-terminal-dim">
            💡 Common events: ReputationUpdated, ReputationCreated, AgentRegistered
          </div>
        </div>
      )}

      {conditionType === 'field_comparison' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; FIELD COMPARISON CONFIG</div>

          <div className="space-y-2">
            <Label htmlFor={`cond-field-${condition.tempId}`} className="typo-ui">
              FIELD PATH
            </Label>
            <Input
              id={`cond-field-${condition.tempId}`}
              type="text"
              placeholder="e.g., metadata.score, data.value"
              value={condition.field ?? ''}
              onChange={(e) => {
                onChange({ ...condition, field: e.target.value })
                updatePreview()
              }}
              onBlur={updatePreview}
              className="typo-code"
            />
            <div className="typo-ui text-terminal-dim/80">
              Use dot notation for nested fields (e.g., metadata.score)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`cond-operator-${condition.tempId}`} className="typo-ui">
                OPERATOR
              </Label>
              <Select
                value={condition.operator ?? 'gte'}
                onValueChange={(value) => {
                  onChange({ ...condition, operator: value as TriggerCondition['operator'] })
                  updatePreview()
                }}
              >
                <SelectTrigger id={`cond-operator-${condition.tempId}`} className="typo-ui">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getRelevantOperators().map((op) => (
                    <SelectItem key={op.value} value={op.value} className="typo-ui">
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`cond-value-${condition.tempId}`} className="typo-ui">
                VALUE
              </Label>
              <Input
                id={`cond-value-${condition.tempId}`}
                type="text"
                placeholder="Comparison value"
                value={condition.value ?? ''}
                onChange={(e) => {
                  onChange({ ...condition, value: e.target.value })
                  updatePreview()
                }}
                onBlur={updatePreview}
                className="typo-ui"
              />
            </div>
          </div>
        </div>
      )}

      {conditionType === 'time_condition' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; TIME CONDITION CONFIG</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`cond-operator-${condition.tempId}`} className="typo-ui">
                TIME COMPARISON
              </Label>
              <Select
                value={condition.operator ?? 'gt'}
                onValueChange={(value) => {
                  onChange({ ...condition, operator: value as TriggerCondition['operator'] })
                  updatePreview()
                }}
              >
                <SelectTrigger id={`cond-operator-${condition.tempId}`} className="typo-ui">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt" className="typo-ui">
                    After (&gt;)
                  </SelectItem>
                  <SelectItem value="gte" className="typo-ui">
                    On or After (≥)
                  </SelectItem>
                  <SelectItem value="lt" className="typo-ui">
                    Before (&lt;)
                  </SelectItem>
                  <SelectItem value="lte" className="typo-ui">
                    On or Before (≤)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`cond-value-${condition.tempId}`} className="typo-ui">
                UNIX TIMESTAMP
              </Label>
              <Input
                id={`cond-value-${condition.tempId}`}
                type="number"
                placeholder="e.g., 1704067200"
                value={condition.value ?? ''}
                onChange={(e) => {
                  onChange({ ...condition, value: e.target.value })
                  updatePreview()
                }}
                onBlur={updatePreview}
                className="typo-code"
              />
              <div className="typo-ui text-terminal-dim/80">
                Enter Unix timestamp in seconds
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="border-t-2 border-terminal-dim pt-3">
          <div className="typo-ui text-terminal-dim mb-1">&gt; Preview:</div>
          <div className="typo-code text-terminal-green bg-terminal/30 p-2 border border-terminal-dim">
            {preview}
          </div>
        </div>
      )}
    </Box>
  )
}
