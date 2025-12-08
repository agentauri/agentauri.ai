'use client'

import { useState } from 'react'
import { ActionLabel } from '@/components/atoms/action-label'
import { Box } from '@/components/atoms/box'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Textarea } from '@/components/atoms/textarea'
import { ACTION_TYPES, type ActionType } from '@/lib/constants'
import {
  isValidJson,
  sanitizeJson,
  sanitizeWebhookUrl,
  validateTemplateVariables,
} from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import type { TriggerAction } from '@/lib/validations/trigger'

interface ActionBuilderProps {
  action: Partial<TriggerAction> & { tempId?: string }
  onChange: (action: Partial<TriggerAction> & { tempId?: string }) => void
  onRemove: () => void
  canRemove: boolean
}

export function ActionBuilder({ action, onChange, onRemove, canRemove }: ActionBuilderProps) {
  const actionType = action.actionType
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({})
  const [urlError, setUrlError] = useState<string>('')
  const [templateError, setTemplateError] = useState<string>('')

  const updateConfig = (key: string, value: unknown) => {
    onChange({
      ...action,
      config: {
        ...(action.config ?? {}),
        [key]: value,
      },
    })
  }

  const getConfigValue = (key: string): string => {
    const value = action.config?.[key]
    if (typeof value === 'string') return value
    if (value !== undefined && value !== null) return JSON.stringify(value)
    return ''
  }

  const handleJsonChange = (key: string, value: string) => {
    updateConfig(key, value)

    // Validate JSON on blur
    if (value.trim()) {
      if (!isValidJson(value)) {
        setJsonErrors((prev) => ({ ...prev, [key]: 'Invalid JSON syntax' }))
      } else {
        const sanitized = sanitizeJson(value)
        if (!sanitized) {
          setJsonErrors((prev) => ({
            ...prev,
            [key]: 'Dangerous JSON detected (prototype pollution)',
          }))
        } else {
          setJsonErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[key]
            return newErrors
          })
        }
      }
    } else {
      setJsonErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const handleUrlChange = (value: string) => {
    updateConfig('url', value)

    if (value.trim()) {
      const sanitized = sanitizeWebhookUrl(value)
      if (!sanitized) {
        setUrlError('Invalid or unsafe URL (private IPs, localhost not allowed)')
      } else {
        setUrlError('')
      }
    } else {
      setUrlError('')
    }
  }

  const handleTemplateChange = (key: string, value: string) => {
    updateConfig(key, value)

    if (value.trim()) {
      const validation = validateTemplateVariables(value)
      if (!validation.isValid) {
        setTemplateError(
          `Invalid template variables: ${validation.invalidVars.join(', ')}`
        )
      } else {
        setTemplateError('')
      }
    } else {
      setTemplateError('')
    }
  }

  return (
    <Box variant="secondary" padding="md" className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="typo-ui text-terminal-green">[ACTION]</div>
        {canRemove && (
          <ActionLabel
            variant="destructive"
            icon="close"
            onClick={onRemove}
          >
            REMOVE
          </ActionLabel>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Action Type */}
        <div className="space-y-2">
          <Label htmlFor={`action-type-${action.tempId}`} className="typo-ui">
            TYPE
          </Label>
          <Select
            value={actionType ?? ''}
            onValueChange={(value) => onChange({ ...action, actionType: value as ActionType, config: {} })}
          >
            <SelectTrigger id={`action-type-${action.tempId}`} className="typo-ui">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {ACTION_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="typo-ui">
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor={`action-priority-${action.tempId}`} className="typo-ui">
            PRIORITY (0-100)
          </Label>
          <Input
            id={`action-priority-${action.tempId}`}
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={action.priority ?? 0}
            onChange={(e) => onChange({ ...action, priority: Number.parseInt(e.target.value) || 0 })}
            className="typo-ui"
          />
        </div>
      </div>

      {/* Type-specific Configuration */}
      {actionType === 'telegram' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; TELEGRAM CONFIG</div>

          <div className="space-y-2">
            <Label htmlFor={`action-chat-id-${action.tempId}`} className="typo-ui">
              CHAT ID
            </Label>
            <Input
              id={`action-chat-id-${action.tempId}`}
              type="text"
              placeholder="123456789"
              value={getConfigValue('chatId')}
              onChange={(e) => updateConfig('chatId', e.target.value)}
              className="typo-ui"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`action-message-${action.tempId}`} className="typo-ui">
              MESSAGE TEMPLATE
            </Label>
            <Textarea
              id={`action-message-${action.tempId}`}
              placeholder="Alert: {{eventType}} on agent {{agentId}}"
              value={getConfigValue('message')}
              onChange={(e) => handleTemplateChange('message', e.target.value)}
              className={cn(
                'typo-code',
                templateError && 'border-destructive'
              )}
              rows={3}
              maxLength={1000}
            />
            {templateError && (
              <p className="typo-ui text-destructive">{templateError}</p>
            )}
            <div className="typo-ui text-terminal-dim/80">
              Use {'{{'}{'}}'} for variables like agentId, eventType, etc.
            </div>
          </div>
        </div>
      )}

      {actionType === 'rest' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; REST API CONFIG</div>

          <div className="space-y-2">
            <Label htmlFor={`action-url-${action.tempId}`} className="typo-ui">
              URL
            </Label>
            <Input
              id={`action-url-${action.tempId}`}
              type="url"
              placeholder="https://api.example.com/webhook"
              value={getConfigValue('url')}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={cn('typo-ui', urlError && 'border-destructive')}
            />
            {urlError && <p className="typo-ui text-destructive">{urlError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`action-method-${action.tempId}`} className="typo-ui">
              METHOD
            </Label>
            <Select
              value={getConfigValue('method') || 'POST'}
              onValueChange={(value) => updateConfig('method', value)}
            >
              <SelectTrigger id={`action-method-${action.tempId}`} className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET" className="typo-ui">GET</SelectItem>
                <SelectItem value="POST" className="typo-ui">POST</SelectItem>
                <SelectItem value="PUT" className="typo-ui">PUT</SelectItem>
                <SelectItem value="PATCH" className="typo-ui">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`action-headers-${action.tempId}`} className="typo-ui">
              HEADERS (JSON)
            </Label>
            <Textarea
              id={`action-headers-${action.tempId}`}
              placeholder='{"Content-Type": "application/json"}'
              value={getConfigValue('headers')}
              onChange={(e) => handleJsonChange('headers', e.target.value)}
              onBlur={(e) => handleJsonChange('headers', e.target.value)}
              className={cn(
                'typo-code',
                jsonErrors.headers && 'border-destructive'
              )}
              rows={2}
              maxLength={2000}
            />
            {jsonErrors.headers && (
              <p className="typo-ui text-destructive">{jsonErrors.headers}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`action-body-${action.tempId}`} className="typo-ui">
              BODY TEMPLATE (JSON)
            </Label>
            <Textarea
              id={`action-body-${action.tempId}`}
              placeholder='{"event": "{{eventType}}", "agentId": "{{agentId}}"}'
              value={getConfigValue('body')}
              onChange={(e) => handleJsonChange('body', e.target.value)}
              onBlur={(e) => handleJsonChange('body', e.target.value)}
              className={cn(
                'typo-code',
                jsonErrors.body && 'border-destructive'
              )}
              rows={4}
              maxLength={5000}
            />
            {jsonErrors.body && (
              <p className="typo-ui text-destructive">{jsonErrors.body}</p>
            )}
            <div className="typo-ui text-terminal-dim/80">
              Use {'{{'}{'}}'} for variables
            </div>
          </div>
        </div>
      )}

      {actionType === 'mcp' && (
        <div className="space-y-4 pt-2 border-t-2 border-terminal-dim">
          <div className="typo-ui text-terminal-green">&gt; MCP CONFIG</div>

          <div className="space-y-2">
            <Label htmlFor={`action-command-${action.tempId}`} className="typo-ui">
              COMMAND
            </Label>
            <Input
              id={`action-command-${action.tempId}`}
              type="text"
              placeholder="log_event"
              value={getConfigValue('command')}
              onChange={(e) => updateConfig('command', e.target.value)}
              className="typo-ui"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`action-params-${action.tempId}`} className="typo-ui">
              PARAMETERS (JSON)
            </Label>
            <Textarea
              id={`action-params-${action.tempId}`}
              placeholder='{"level": "info", "message": "{{eventType}}"}'
              value={getConfigValue('parameters')}
              onChange={(e) => handleJsonChange('parameters', e.target.value)}
              onBlur={(e) => handleJsonChange('parameters', e.target.value)}
              className={cn(
                'typo-code',
                jsonErrors.parameters && 'border-destructive'
              )}
              rows={4}
              maxLength={5000}
            />
            {jsonErrors.parameters && (
              <p className="typo-ui text-destructive">{jsonErrors.parameters}</p>
            )}
            <div className="typo-ui text-terminal-dim/80">
              Use {'{{'}{'}}'} for variables
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="typo-ui text-terminal-dim/80 mt-2">
        <span>&gt;</span> Actions execute in priority order (higher = first)
      </div>
    </Box>
  )
}
