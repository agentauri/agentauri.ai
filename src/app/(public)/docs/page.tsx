import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon, type IconName } from '@/components/atoms/icon'

const quickStartSteps = [
  {
    step: 1,
    title: 'CONNECT WALLET',
    time: '2 min',
    description:
      'Sign in with SIWE. Supports MetaMask, WalletConnect, and Coinbase Wallet.',
  },
  {
    step: 2,
    title: 'CREATE ORGANIZATION',
    time: '3 min',
    description:
      'Set up your organization to manage agents, API keys, and team members.',
  },
  {
    step: 3,
    title: 'LINK AGENT',
    time: '5 min',
    description:
      'Connect your ERC-8004 agent NFT to start tracking on-chain events.',
  },
  {
    step: 4,
    title: 'CREATE TRIGGER',
    time: '5 min',
    description:
      'Set up automated webhooks or MCP actions for blockchain events.',
  },
]

const registries = [
  {
    name: 'IDENTITY',
    icon: 'agents' as IconName,
    description: 'Discover agents and their capabilities',
    detail: 'Every agent gets a unique on-chain ID linked to metadata describing capabilities, supported protocols, and operational domains.',
  },
  {
    name: 'REPUTATION',
    icon: 'triggers' as IconName,
    description: 'Track performance with verifiable feedback',
    detail: 'Client-authorized feedback creates an on-chain audit trail. Build reputation that follows the agent across platforms.',
  },
  {
    name: 'VALIDATION',
    icon: 'check' as IconName,
    description: 'Verify task execution with proofs',
    detail: 'Support for crypto-economic staking, TEE oracles, or zero-knowledge proofs. Security scales with value at risk.',
  },
]

const useCases = [
  {
    title: 'AI AGENT MARKETPLACES',
    scenario: 'Alert when agents reach reputation > 90',
    detail: 'Build trust scores for agent discovery platforms',
    config: 'Event: ReputationUpdated | Filter: score ≥ 90 | Action: Telegram',
  },
  {
    title: 'AUTOMATED TASK DELEGATION',
    scenario: 'Verify agent identity before execution',
    detail: 'Check Identity Registry before delegating high-value tasks',
    config: 'Event: AgentRegistered | Action: MCP Server Update',
  },
  {
    title: 'COMPLIANCE & AUDITING',
    scenario: 'Log all validation events for reporting',
    detail: 'Maintain immutable audit trail of agent validations',
    config: 'Event: ValidationCompleted | Action: REST → Audit System',
  },
  {
    title: 'REPUTATION-GATED ACCESS',
    scenario: 'Grant API access on validation complete',
    detail: 'Automate credential issuance based on on-chain proofs',
    config: 'Event: ValidationCompleted | Action: REST → Access Control',
  },
  {
    title: 'FRAUD DETECTION',
    scenario: 'Alert on unexpected metadata changes',
    detail: 'Monitor suspicious activity in real-time',
    config: 'Event: AgentUpdated | Filter: frequency > N | Action: Telegram',
  },
  {
    title: 'MULTI-AGENT COORDINATION',
    scenario: 'Update orchestrator when agents register',
    detail: 'Coordinate complex multi-agent workflows',
    config: 'Event: AgentRegistered | Action: MCP → Orchestrator',
  },
  {
    title: 'REPUTATION ANALYTICS',
    scenario: 'Stream updates to analytics dashboard',
    detail: 'Build real-time agent performance dashboards',
    config: 'Event: ReputationUpdated | Action: REST → Analytics',
  },
  {
    title: 'AGENT DISCOVERY',
    scenario: 'Index new agents for search',
    detail: 'Power agent discovery and matching services',
    config: 'Event: AgentRegistered | Action: REST → Search Index',
  },
]

const differentiators = [
  {
    vs: 'Generic Webhooks (Zapier, IFTTT)',
    points: [
      'ERC-8004 native - built for agent trust infrastructure',
      'Multi-chain blockchain indexing out of the box',
      'Real-time event processing (< 1s latency)',
      'Circuit breaker pattern for reliability',
    ],
  },
  {
    vs: 'Custom Indexers (Ponder, The Graph)',
    points: [
      'Pre-built UI for non-developers',
      'No infrastructure management',
      'MCP integration for AI agents',
      'Credit-based pricing (not infra costs)',
    ],
  },
  {
    vs: 'Centralized Agent Platforms',
    points: [
      'Decentralized trust layer on Ethereum',
      'Portable reputation across platforms',
      'No vendor lock-in',
      'Open standard (ERC-8004)',
    ],
  },
]

const apiDocLinks = [
  { label: 'Events API', href: 'https://docs.agentauri.ai/api/events' },
  { label: 'Agents API', href: 'https://docs.agentauri.ai/api/agents' },
  { label: 'Triggers API', href: 'https://docs.agentauri.ai/api/triggers' },
  { label: 'Organizations API', href: 'https://docs.agentauri.ai/api/organizations' },
  { label: 'OpenAPI Spec', href: 'https://docs.agentauri.ai/openapi' },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-terminal">
      {/* Hero */}
      <section className="py-20 text-center border-b-2 border-terminal">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-2 mb-6">
            <span className="typo-ui text-[10px] border border-terminal-green text-terminal-green px-2 py-1">
              ERC-8004
            </span>
            <span className="typo-ui text-[10px] border border-terminal-dim text-terminal-dim px-2 py-1">
              MULTI-CHAIN
            </span>
            <span className="typo-ui text-[10px] border border-terminal-dim text-terminal-dim px-2 py-1">
              REAL-TIME
            </span>
          </div>
          <h1 className="typo-header text-terminal-green glow text-3xl md:text-4xl mb-4">
            THE TRUST LAYER FOR
            <br />
            AUTONOMOUS AI AGENTS
          </h1>
          <p className="typo-ui text-terminal-dim text-lg max-w-2xl mx-auto mb-6">
            First production infrastructure for ERC-8004 - enabling AI agents to discover,
            verify, and build reputation across organizational boundaries.
          </p>
          <p className="typo-ui text-terminal-green">
            Monitor agent activity. Automate workflows. Build trustless coordination.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] THE AGENT TRUST PROBLEM
          </h2>

          <Box variant="secondary" padding="lg" className="space-y-4">
            <p className="typo-ui text-terminal-dim">
              In the emerging AI agent economy, autonomous agents need to:
            </p>
            <ul className="space-y-2 typo-ui text-terminal-dim">
              <li className="flex items-start gap-2">
                <Icon name="chevron-right" size="sm" className="text-terminal-green mt-0.5" />
                <span>Discover other agents without pre-existing relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="chevron-right" size="sm" className="text-terminal-green mt-0.5" />
                <span>Verify capabilities and track record before delegating tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="chevron-right" size="sm" className="text-terminal-green mt-0.5" />
                <span>Build portable reputation across platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="chevron-right" size="sm" className="text-terminal-green mt-0.5" />
                <span>Coordinate trustlessly across organizational boundaries</span>
              </li>
            </ul>
            <div className="pt-4 border-t-2 border-terminal-dim">
              <p className="typo-ui text-terminal-green">
                Traditional solutions require centralized trust or manual verification.
                <br />
                The blockchain provides tamper-proof history, but lacked standardization.
              </p>
              <p className="typo-ui text-terminal-bright glow mt-2">
                That&apos;s where ERC-8004 comes in.
              </p>
            </div>
          </Box>
        </div>
      </section>

      {/* ERC-8004 Explained */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] ERC-8004: THE STANDARD
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8 max-w-2xl mx-auto">
            Proposed August 2025 by leaders from MetaMask, Google, and Coinbase.
            <br />
            Backed by Ethereum Foundation&apos;s dAI team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {registries.map((registry) => (
              <Box key={registry.name} variant="default" padding="lg" className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name={registry.icon} size="md" className="text-terminal-green" />
                  <h3 className="typo-ui text-terminal-green glow">{registry.name}</h3>
                </div>
                <p className="typo-ui text-terminal-bright text-sm">{registry.description}</p>
                <p className="typo-ui text-terminal-dim text-xs">{registry.detail}</p>
              </Box>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="typo-ui text-terminal-green glow">
              AgentAuri is the first production infrastructure implementing this standard.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] HOW IT WORKS
          </h2>

          <Box variant="secondary" padding="lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              <div className="space-y-2">
                <div className="typo-ui text-terminal-green glow">BLOCKCHAIN</div>
                <div className="typo-ui text-terminal-dim text-xs">Multi-chain events</div>
              </div>
              <Icon name="chevron-right" size="md" className="text-terminal-dim hidden md:block" />
              <Icon name="chevron-down" size="md" className="text-terminal-dim md:hidden" />
              <div className="space-y-2">
                <div className="typo-ui text-terminal-green glow">INDEXERS</div>
                <div className="typo-ui text-terminal-dim text-xs">Real-time processing</div>
              </div>
              <Icon name="chevron-right" size="md" className="text-terminal-dim hidden md:block" />
              <Icon name="chevron-down" size="md" className="text-terminal-dim md:hidden" />
              <div className="space-y-2">
                <div className="typo-ui text-terminal-green glow">TRIGGERS</div>
                <div className="typo-ui text-terminal-dim text-xs">Conditional matching</div>
              </div>
              <Icon name="chevron-right" size="md" className="text-terminal-dim hidden md:block" />
              <Icon name="chevron-down" size="md" className="text-terminal-dim md:hidden" />
              <div className="space-y-2">
                <div className="typo-ui text-terminal-green glow">ACTIONS</div>
                <div className="typo-ui text-terminal-dim text-xs">Telegram, REST, MCP</div>
              </div>
              <Icon name="chevron-right" size="md" className="text-terminal-dim hidden md:block" />
              <Icon name="chevron-down" size="md" className="text-terminal-dim md:hidden" />
              <div className="space-y-2">
                <div className="typo-ui text-terminal-green glow">YOUR SYSTEMS</div>
                <div className="typo-ui text-terminal-dim text-xs">Instant delivery</div>
              </div>
            </div>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Box variant="subtle" padding="sm" className="text-center">
              <div className="typo-ui text-terminal-green">&lt; 1s</div>
              <div className="typo-ui text-terminal-dim text-xs">Event processing</div>
            </Box>
            <Box variant="subtle" padding="sm" className="text-center">
              <div className="typo-ui text-terminal-green">6 CHAINS</div>
              <div className="typo-ui text-terminal-dim text-xs">Monitored in parallel</div>
            </Box>
            <Box variant="subtle" padding="sm" className="text-center">
              <div className="typo-ui text-terminal-green">99.9%</div>
              <div className="typo-ui text-terminal-dim text-xs">Uptime SLA</div>
            </Box>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] USE CASES
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8">
            Real-world scenarios for the AI agent economy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((useCase, index) => (
              <Box key={useCase.title} variant="default" padding="md" className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="typo-ui text-terminal-dim shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-1">
                    <h3 className="typo-ui text-terminal-green glow text-sm">{useCase.title}</h3>
                    <p className="typo-ui text-terminal-bright text-sm">{useCase.scenario}</p>
                    <p className="typo-ui text-terminal-dim text-xs">{useCase.detail}</p>
                    <p className="typo-code text-terminal-dim text-[10px] mt-2">{useCase.config}</p>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Why AgentAuri */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] WHY AGENTAURI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((diff) => (
              <Box key={diff.vs} variant="default" padding="lg" className="space-y-4">
                <h3 className="typo-ui text-terminal-dim text-sm">vs {diff.vs}</h3>
                <ul className="space-y-2">
                  {diff.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="typo-ui text-terminal-green shrink-0">+</span>
                      <span className="typo-ui text-terminal-bright text-xs">{point}</span>
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] QUICK START
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8">
            Get started in ~15 minutes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStartSteps.map((step) => (
              <Box key={step.step} variant="default" padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 border-2 border-terminal-green flex items-center justify-center typo-header text-terminal-green">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="typo-ui text-terminal-green glow">
                        &gt; {step.title}
                      </h3>
                      <span className="typo-ui text-terminal-dim text-[10px] border border-terminal-dim px-1">
                        {step.time}
                      </span>
                    </div>
                    <p className="typo-ui text-terminal-dim text-sm">{step.description}</p>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 px-4 border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] API DOCUMENTATION
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8 max-w-2xl mx-auto">
            Full programmatic access to all platform features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box variant="default" padding="lg">
              <h3 className="typo-ui text-terminal-green glow mb-4">&gt; API REFERENCE</h3>
              <ul className="space-y-2">
                {apiDocLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target="_blank"
                      className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors flex items-center gap-2"
                    >
                      <Icon name="chevron-right" size="sm" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Box>

            <Box variant="default" padding="lg">
              <h3 className="typo-ui text-terminal-green glow mb-4">&gt; QUICK REFERENCE</h3>
              <div className="space-y-4">
                <div>
                  <p className="typo-ui text-terminal-dim text-xs mb-1">BASE URL</p>
                  <code className="typo-code text-terminal-green text-sm">
                    https://api.agentauri.ai/api/v1
                  </code>
                </div>
                <div>
                  <p className="typo-ui text-terminal-dim text-xs mb-1">AUTHENTICATION</p>
                  <code className="typo-code text-terminal-green text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <div>
                  <p className="typo-ui text-terminal-dim text-xs mb-1">RATE LIMITS</p>
                  <code className="typo-code text-terminal-dim text-sm">
                    Free: 1K/mo | Pro: 50K/mo | Enterprise: Unlimited
                  </code>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="typo-header text-terminal-green glow text-2xl mb-4">
          READY TO BUILD?
        </h2>
        <p className="typo-ui text-terminal-dim mb-8 max-w-xl mx-auto">
          Join the first wave of builders on ERC-8004 infrastructure
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Box variant="default" padding="lg" className="text-center">
            <h3 className="typo-ui text-terminal-green glow mb-2">DEVELOPERS</h3>
            <p className="typo-ui text-terminal-dim text-xs mb-4">Start building in 15 minutes</p>
            <Button asChild className="typo-ui w-full">
              <Link href="/login">[START FREE]</Link>
            </Button>
            <p className="typo-ui text-terminal-dim text-[10px] mt-2">1K API calls free forever</p>
          </Box>

          <Box variant="default" padding="lg" className="text-center">
            <h3 className="typo-ui text-terminal-green glow mb-2">ENTERPRISES</h3>
            <p className="typo-ui text-terminal-dim text-xs mb-4">Custom SLA + dedicated support</p>
            <Button asChild variant="outline" className="typo-ui w-full">
              <Link href="mailto:enterprise@agentauri.ai">[CONTACT SALES]</Link>
            </Button>
            <p className="typo-ui text-terminal-dim text-[10px] mt-2">White-glove onboarding</p>
          </Box>

          <Box variant="default" padding="lg" className="text-center">
            <h3 className="typo-ui text-terminal-green glow mb-2">RESEARCHERS</h3>
            <p className="typo-ui text-terminal-dim text-xs mb-4">Exploring ERC-8004?</p>
            <Button asChild variant="outline" className="typo-ui w-full">
              <Link href="https://eips.ethereum.org/EIPS/eip-8004" target="_blank">
                [READ STANDARD]
              </Link>
            </Button>
            <p className="typo-ui text-terminal-dim text-[10px] mt-2">EIP-8004 specification</p>
          </Box>
        </div>

        <div className="border-t-2 border-terminal-dim pt-8">
          <p className="typo-ui text-terminal-dim mb-4">Questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="typo-ui">
              <Link href="https://discord.gg/agentauri" target="_blank">
                [JOIN DISCORD]
              </Link>
            </Button>
            <Button asChild variant="outline" className="typo-ui">
              <Link href="mailto:support@agentauri.ai">[EMAIL SUPPORT]</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
