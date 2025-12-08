/**
 * Code block component with copy functionality
 * Terminal/brutalist design
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  maxHeight?: string
  copyable?: boolean
  className?: string
  title?: string
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  maxHeight,
  copyable = true,
  className,
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className={cn('border-2 border-terminal bg-terminal/20', className)}>
      {/* Header */}
      {(title || language || copyable) && (
        <div className="flex items-center justify-between border-b-2 border-terminal px-4 py-2 bg-terminal/30">
          <div className="flex items-center gap-3">
            {title && (
              <span className="typo-ui text-terminal-green">{title}</span>
            )}
            {language && (
              <span className="typo-ui text-terminal-dim">
                [{language.toUpperCase()}]
              </span>
            )}
          </div>

          {copyable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="typo-ui h-auto py-1 px-2"
            >
              {copied ? '[COPIED!]' : '[COPY]'}
            </Button>
          )}
        </div>
      )}

      {/* Code content */}
      <div
        className={cn('overflow-auto', maxHeight && `max-h-[${maxHeight}]`)}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <pre className="p-4">
          <code className="typo-code text-terminal-bright">
            {showLineNumbers ? (
              <table className="w-full border-spacing-0">
                <tbody>
                  {lines.map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Code lines are static, index is appropriate
                    <tr key={i}>
                      <td className="text-terminal-dim/50 select-none pr-4 text-right align-top">
                        {i + 1}
                      </td>
                      <td className="align-top">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

/**
 * Inline code component
 */
interface InlineCodeProps {
  children: string
  className?: string
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={`typo-code-inline px-1 py-0.5 bg-terminal/30 text-terminal-bright ${className ?? ''}`}
    >
      {children}
    </code>
  )
}
