'use client'

import { Box } from '@/components/atoms/box'
import { EventsList } from '@/components/organisms'

export default function EventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-terminal pb-6">
        <div>
          <h1 className="typo-header text-terminal-green glow mb-2">[#] EVENTS</h1>
          <p className="typo-ui text-terminal-dim">
            Real-time blockchain events from ERC-8004 registries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; EVENTS (24H)</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; ACTIVE AGENTS</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
        <Box variant="default" padding="md">
          <div className="typo-ui text-terminal-dim mb-1">&gt; LATEST BLOCK</div>
          <div className="typo-header text-terminal-green">-</div>
        </Box>
      </div>

      {/* Events List */}
      <EventsList />
    </div>
  )
}
