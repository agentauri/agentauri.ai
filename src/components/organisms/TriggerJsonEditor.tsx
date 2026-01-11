/**
 * TriggerJsonEditor
 *
 * A JSON text editor for trigger configuration with real-time validation.
 * Provides formatting, reset, and schema guidance for power users.
 *
 * @module components/organisms/TriggerJsonEditor
 *
 * @example
 * ```tsx
 * <TriggerJsonEditor
 *   value={{ name: 'My Trigger', conditions: [], actions: [] }}
 *   onChange={(updated) => console.log('JSON updated:', updated)}
 * />
 * ```
 */
'use client'

import { useEffect, useState } from 'react'
import { Box } from '@/components/atoms/box'
import { Collapsible } from '@/components/atoms/collapsible'
import { Button } from '@/components/atoms/button'
import { Textarea } from '@/components/atoms/textarea'
import { createTriggerRequestSchema, type CreateTriggerRequest } from '@/lib/validations/trigger'
import { cn } from '@/lib/utils'

/**
 * Props for the TriggerJsonEditor component.
 */
interface TriggerJsonEditorProps {
  /** The current trigger request value */
  value: CreateTriggerRequest
  /** Callback when the JSON is modified and valid */
  onChange: (value: CreateTriggerRequest) => void
  /** Additional CSS classes */
  className?: string
}

export function TriggerJsonEditor({ value, onChange, className }: TriggerJsonEditorProps) {
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  // Initialize JSON text from value
  useEffect(() => {
    if (!touched) {
      setJsonText(JSON.stringify(value, null, 2))
    }
  }, [value, touched])

  const validateAndUpdate = (text: string) => {
    try {
      // Try to parse JSON
      const parsed = JSON.parse(text)

      // Validate against schema
      const result = createTriggerRequestSchema.safeParse(parsed)

      if (!result.success) {
        const firstError = result.error.issues[0]
        setError(
          `Validation error: ${firstError?.path.join('.')} - ${firstError?.message}`
        )
        return
      }

      // Valid - update parent
      setError(null)
      onChange(result.data)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(`JSON Syntax Error: ${err.message}`)
      } else {
        setError('Unknown error parsing JSON')
      }
    }
  }

  const handleChange = (text: string) => {
    setJsonText(text)
    setTouched(true)
  }

  const handleBlur = () => {
    if (jsonText.trim()) {
      validateAndUpdate(jsonText)
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonText(formatted)
      validateAndUpdate(formatted)
    } catch {
      // Ignore formatting errors
    }
  }

  const handleReset = () => {
    setJsonText(JSON.stringify(value, null, 2))
    setError(null)
    setTouched(false)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <Box variant="default" className="flex items-center justify-between p-2">
        <div className="typo-ui text-terminal-green glow">&gt; JSON EDITOR</div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            className="typo-ui h-auto py-1 px-2"
          >
            [FORMAT]
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="typo-ui h-auto py-1 px-2"
          >
            [RESET]
          </Button>
        </div>
      </Box>

      {/* Editor */}
      <div className="relative">
        <Textarea
          value={jsonText}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={cn(
            'typo-code min-h-[400px] sm:min-h-[500px]',
            'bg-terminal/20 text-terminal-bright',
            'pl-12',
            'border-2',
            error ? 'border-destructive' : 'border-terminal',
            'focus:border-terminal-green',
            'resize-y'
          )}
          placeholder="Paste or edit trigger JSON here..."
          spellCheck={false}
        />

        {/* Line numbers overlay (optional enhancement) */}
        <div className="absolute top-2 left-2 w-8 text-right typo-code text-terminal-dim/50 pointer-events-none select-none">
          {jsonText.split('\n').map((_, i) => (
            <div key={i} className="leading-none">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Box variant="error" padding="sm">
          <div className="typo-ui text-destructive mb-1">[ERROR]</div>
          <div className="typo-code text-destructive/80">{error}</div>
        </Box>
      )}

      {/* Success Indicator */}
      {!error && touched && jsonText.trim() && (
        <Box variant="success" padding="sm">
          <div className="typo-ui text-terminal-green glow">
            ✓ JSON is valid and synced
          </div>
        </Box>
      )}

      {/* Help Text */}
      <Box variant="subtle" padding="sm" className="space-y-2">
        <div className="typo-ui text-terminal-green mb-2">&gt; JSON SCHEMA GUIDE</div>
        <div className="typo-ui text-terminal-dim space-y-1">
          <div>• <span className="text-terminal-bright">name</span>: string (2-100 chars)</div>
          <div>• <span className="text-terminal-bright">description</span>: string | null (max 500 chars)</div>
          <div>• <span className="text-terminal-bright">chainId</span>: number (1, 8453, 11155111, etc.)</div>
          <div>• <span className="text-terminal-bright">registry</span>: "identity" | "reputation" | "validation"</div>
          <div>• <span className="text-terminal-bright">enabled</span>: boolean</div>
          <div>• <span className="text-terminal-bright">isStateful</span>: boolean</div>
          <div>
            • <span className="text-terminal-bright">conditions</span>: array (min 1, max 20)
          </div>
          <div>• <span className="text-terminal-bright">actions</span>: array (min 1, max 10)</div>
        </div>
      </Box>

      {/* Example Template */}
      <Collapsible title="SHOW EXAMPLE TEMPLATE" variant="subtle">
        <pre className="typo-code text-terminal-dim overflow-x-auto">
          {JSON.stringify(
            {
              name: 'High Reputation Alert',
              description: 'Alert when reputation exceeds threshold',
              chainId: 1,
              registry: 'reputation',
              enabled: true,
              isStateful: true,
              conditions: [
                {
                  conditionType: 'reputation_threshold',
                  field: 'reputation_score',
                  operator: 'gt',
                  value: '800',
                  config: {},
                },
              ],
              actions: [
                {
                  actionType: 'telegram',
                  priority: 0,
                  config: {
                    chatId: '123456789',
                    message: 'Alert: {{agentAddress}} reputation is {{reputationScore}}',
                  },
                },
              ],
            },
            null,
            2
          )}
        </pre>
      </Collapsible>
    </div>
  )
}
