import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'

const releases = [
  {
    version: 'v1.2.0',
    date: '2025-01-15',
    isLatest: true,
    changes: [
      {
        type: 'added' as const,
        items: [
          'Multi-chain support for Linea Sepolia and Polygon Amoy',
          'MCP action type for triggers',
          'Event streaming via WebSocket connections',
          'Bulk agent linking API endpoint',
        ],
      },
      {
        type: 'improved' as const,
        items: [
          'Dashboard performance with virtualized lists',
          'API rate limiting with per-key quotas',
          'Event query filters with date range support',
        ],
      },
      {
        type: 'fixed' as const,
        items: [
          'Webhook retry logic for failed deliveries',
          'Trigger condition evaluation edge cases',
          'Session token refresh race condition',
        ],
      },
    ],
  },
  {
    version: 'v1.1.0',
    date: '2024-12-01',
    isLatest: false,
    changes: [
      {
        type: 'added' as const,
        items: [
          'Trigger system with webhook actions',
          'API key management with tier-based access',
          'Credit-based billing system',
          'Organization member invitations',
        ],
      },
      {
        type: 'improved' as const,
        items: [
          'Event indexing performance (3x faster)',
          'Dashboard mobile responsiveness',
          'Error messages and user feedback',
        ],
      },
      {
        type: 'fixed' as const,
        items: [
          'Agent linking signature verification',
          'Pagination offset calculations',
          'Timezone handling in event timestamps',
        ],
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2024-10-15',
    isLatest: false,
    changes: [
      {
        type: 'added' as const,
        items: [
          'Initial release of AgentAuri platform',
          'ERC-8004 agent linking via SIWE',
          'Event monitoring for Ethereum and Base',
          'REST API with OpenAPI documentation',
          'Organization and team management',
          'Dashboard with terminal-inspired UI',
        ],
      },
    ],
  },
]

const typeLabels = {
  added: { label: 'ADDED', className: 'text-terminal-green border-terminal-green' },
  improved: { label: 'IMPROVED', className: 'text-blue-400 border-blue-400' },
  fixed: { label: 'FIXED', className: 'text-yellow-400 border-yellow-400' },
  deprecated: { label: 'DEPRECATED', className: 'text-orange-400 border-orange-400' },
  removed: { label: 'REMOVED', className: 'text-destructive border-destructive' },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-terminal">
      {/* Hero */}
      <section className="py-20 text-center border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="typo-header text-terminal-green glow text-4xl md:text-5xl mb-4">
            CHANGELOG
          </h1>
          <p className="typo-ui text-terminal-dim text-lg max-w-2xl mx-auto">
            Track all updates, improvements, and fixes to the AgentAuri platform.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-terminal-dim" />

            <div className="space-y-12">
              {releases.map((release) => (
                <div key={release.version} className="relative pl-12 md:pl-20">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2 md:left-6 w-4 h-4 border-2 ${
                      release.isLatest
                        ? 'border-terminal-green bg-terminal-green'
                        : 'border-terminal-dim bg-terminal'
                    }`}
                  />

                  <Box variant={release.isLatest ? 'success' : 'default'} padding="lg">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <h2 className="typo-header text-terminal-green glow">{release.version}</h2>
                      {release.isLatest && (
                        <span className="px-2 py-0.5 border border-terminal-green text-terminal-green typo-ui text-xs">
                          [LATEST]
                        </span>
                      )}
                      <span className="typo-ui text-terminal-dim">{release.date}</span>
                    </div>

                    {/* Changes */}
                    <div className="space-y-6">
                      {release.changes.map((changeGroup) => (
                        <div key={changeGroup.type}>
                          <div
                            className={`inline-block px-2 py-0.5 border typo-ui text-xs mb-3 ${
                              typeLabels[changeGroup.type].className
                            }`}
                          >
                            [{typeLabels[changeGroup.type].label}]
                          </div>
                          <ul className="space-y-2 pl-4">
                            {changeGroup.items.map((item) => (
                              <li
                                key={item}
                                className="typo-ui text-terminal-dim flex items-start gap-2"
                              >
                                <span className="text-terminal-green shrink-0">-</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Box>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto text-center">
          <Box variant="default" padding="lg">
            <h2 className="typo-header text-terminal-green glow mb-4">
              [#] STAY UPDATED
            </h2>
            <p className="typo-ui text-terminal-dim mb-6 max-w-lg mx-auto">
              Get notified about new releases and important updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="typo-ui">
                <Link href="https://github.com/agentauri/agentauri/releases" target="_blank">
                  [GITHUB RELEASES]
                </Link>
              </Button>
              <Button asChild variant="outline" className="typo-ui">
                <Link href="https://twitter.com/agentauri" target="_blank">
                  [FOLLOW ON X]
                </Link>
              </Button>
            </div>
          </Box>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t-2 border-terminal text-center">
        <h2 className="typo-header text-terminal-green glow text-2xl mb-4">
          SEE WHAT&apos;S NEW
        </h2>
        <p className="typo-ui text-terminal-dim mb-8 max-w-xl mx-auto">
          Try out the latest features in your dashboard.
        </p>
        <Button asChild className="typo-ui">
          <Link href="/login">[GO TO DASHBOARD]</Link>
        </Button>
      </section>
    </div>
  )
}
