'use client'

import { useState } from 'react'
import { Badge } from '@/components/atoms/badge'
import { Icon } from '@/components/atoms/icon'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AgentAddressBadgeProps {
  address: string
  className?: string
  truncate?: boolean
  copyable?: boolean
}

export function AgentAddressBadge({
  address,
  className,
  truncate = true,
  copyable = true,
}: AgentAddressBadgeProps) {
  const [copied, setCopied] = useState(false)

  const displayAddress = truncate
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address

  const handleCopy = async () => {
    if (!copyable) return

    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'typo-ui border-2 bg-terminal-dim/10 text-terminal-green border-terminal-dim',
        'font-mono',
        copyable && 'cursor-pointer hover:border-terminal-green hover:text-terminal-bright',
        className
      )}
      onClick={copyable ? handleCopy : undefined}
      role={copyable ? 'button' : undefined}
      aria-label={copyable ? `Copy address ${displayAddress}` : undefined}
    >
      {displayAddress}
      {copyable && (
        <Icon name={copied ? 'check' : 'copy'} size="xs" className="ml-1" />
      )}
    </Badge>
  )
}
