'use client'

import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { CircuitBreakerStatus } from '@/components/molecules'

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-terminal pb-6">
        <h1 className="typo-header text-terminal-green glow mb-2">[#] DASHBOARD</h1>
        <p className="typo-ui text-terminal-dim">
          Welcome to your ERC-8004 Reputation Dashboard. Monitor blockchain events, create
          automated triggers, and query agent reputation data.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Box variant="default" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="typo-ui text-terminal-dim">&gt; TOTAL TRIGGERS</span>
            <Icon name="triggers" size="sm" className="text-terminal-green" />
          </div>
          <p className="typo-header text-terminal-green text-3xl">0</p>
        </Box>

        <Box variant="default" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="typo-ui text-terminal-dim">&gt; ACTIVE TRIGGERS</span>
            <Icon name="check" size="sm" className="text-terminal-green" />
          </div>
          <p className="typo-header text-terminal-green text-3xl">0</p>
        </Box>

        <Box variant="default" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="typo-ui text-terminal-dim">&gt; EVENTS (24H)</span>
            <Icon name="events" size="sm" className="text-terminal-green" />
          </div>
          <p className="typo-header text-terminal-green text-3xl">0</p>
        </Box>

        <Box variant="default" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <span className="typo-ui text-terminal-dim">&gt; API CALLS (24H)</span>
            <Icon name="api-keys" size="sm" className="text-terminal-green" />
          </div>
          <p className="typo-header text-terminal-green text-3xl">0</p>
        </Box>
      </div>

      {/* System Status */}
      <CircuitBreakerStatus />

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Box variant="default" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="typo-ui text-terminal-green glow">&gt; RECENT EVENTS</h3>
            <Button variant="outline" size="sm" asChild className="typo-ui">
              <Link href="/dashboard/events">[VIEW ALL]</Link>
            </Button>
          </div>
          <p className="typo-ui text-terminal-dim">No events yet.</p>
        </Box>

        <Box variant="default" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="typo-ui text-terminal-green glow">&gt; TRIGGER EXECUTIONS</h3>
            <Button variant="outline" size="sm" asChild className="typo-ui">
              <Link href="/dashboard/triggers">[VIEW ALL]</Link>
            </Button>
          </div>
          <p className="typo-ui text-terminal-dim">No executions yet.</p>
        </Box>
      </div>

      {/* Quick Actions */}
      <Box variant="default" padding="lg">
        <h3 className="typo-ui text-terminal-green glow mb-4">&gt; QUICK ACTIONS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" asChild className="typo-ui">
            <Link href="/dashboard/triggers/new">
              <Icon name="add" size="sm" className="mr-2" />
              NEW TRIGGER
            </Link>
          </Button>
          <Button variant="outline" asChild className="typo-ui">
            <Link href="/dashboard/agents">
              <Icon name="agents" size="sm" className="mr-2" />
              LINK AGENT
            </Link>
          </Button>
          <Button variant="outline" asChild className="typo-ui">
            <Link href="/dashboard/api-keys">
              <Icon name="api-keys" size="sm" className="mr-2" />
              API KEYS
            </Link>
          </Button>
          <Button variant="outline" asChild className="typo-ui">
            <Link href="/docs">
              <Icon name="help" size="sm" className="mr-2" />
              DOCS
            </Link>
          </Button>
        </div>
      </Box>
    </div>
  )
}
