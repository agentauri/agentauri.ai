import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'

const features = [
  {
    id: 'events',
    icon: 'events' as const,
    title: 'REAL-TIME EVENT STREAMING',
    description: 'Monitor every on-chain action your agents take. From transfers to contract interactions, get instant visibility into agent behavior.',
    capabilities: [
      'Automatic event indexing across supported chains',
      'Historical event queries with advanced filters',
      'Real-time websocket streaming',
      'Detailed transaction metadata and gas analytics',
    ],
  },
  {
    id: 'triggers',
    icon: 'triggers' as const,
    title: 'AUTOMATED TRIGGERS',
    description: 'Set up powerful automation rules that fire when specific on-chain conditions are met. Connect to webhooks, MCP actions, or custom endpoints.',
    capabilities: [
      'Condition-based trigger execution',
      'Webhook notifications with customizable payloads',
      'MCP action integration for AI agents',
      'Retry logic and failure handling',
    ],
  },
  {
    id: 'api-keys',
    icon: 'api-keys' as const,
    title: 'DEVELOPER API',
    description: 'Production-ready REST API with comprehensive documentation. Query agent reputation, events, and manage triggers programmatically.',
    capabilities: [
      'RESTful endpoints with OpenAPI spec',
      'Rate limiting and usage analytics',
      'Multiple API key tiers',
      'SDK support (coming soon)',
    ],
  },
  {
    id: 'agents',
    icon: 'agents' as const,
    title: 'AGENT LINKING',
    description: 'Link any ERC-8004 compatible agent NFT to your organization. Monitor multiple agents across chains from a single dashboard.',
    capabilities: [
      'SIWE-based wallet verification',
      'Multi-chain agent support',
      'Automatic event aggregation',
      'Agent reputation scoring',
    ],
  },
]

const chains = [
  { name: 'Ethereum', status: 'live' as const },
  { name: 'Base', status: 'live' as const },
  { name: 'Sepolia', status: 'live' as const },
  { name: 'Base Sepolia', status: 'live' as const },
  { name: 'Linea Sepolia', status: 'live' as const },
  { name: 'Polygon Amoy', status: 'live' as const },
  { name: 'Arbitrum', status: 'coming' as const },
  { name: 'Optimism', status: 'coming' as const },
]

const codeExample = `// Query agent events with the AgentAuri API
const response = await fetch(
  'https://api.agentauri.ai/api/v1/events?agentId=0x1234...&limit=10',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const { data: events } = await response.json();
// Returns: [{ eventType: 'Transfer', timestamp: '2025-01-15T...' }, ...]`

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-terminal">
      {/* Hero */}
      <section className="py-20 text-center border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="typo-header text-terminal-green glow text-4xl md:text-5xl mb-4">
            THE COMPLETE ERC-8004
            <br />
            REPUTATION INFRASTRUCTURE
          </h1>
          <p className="typo-ui text-terminal-dim text-lg max-w-2xl mx-auto">
            Everything you need to monitor, analyze, and automate your AI agents on-chain reputation.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 border-2 border-terminal-green bg-terminal-green/10">
                    <Icon name={feature.icon} size="lg" className="text-terminal-green" />
                  </div>
                  <h2 className="typo-header text-terminal-green glow">{feature.title}</h2>
                </div>
                <p className="typo-ui text-terminal-dim mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2">
                      <Icon name="check" size="sm" className="text-terminal-green mt-0.5 shrink-0" />
                      <span className="typo-ui text-terminal-dim">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Box
                variant="default"
                padding="lg"
                className={`h-full flex items-center justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}
              >
                <div className="text-center">
                  <Icon name={feature.icon} size="xl" className="text-terminal-green glow mx-auto mb-4" />
                  <div className="typo-ui text-terminal-dim">
                    [FEATURE_{feature.id.toUpperCase()}]
                  </div>
                </div>
              </Box>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Chain Support */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] MULTI-CHAIN SUPPORT
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8 max-w-2xl mx-auto">
            Monitor your agents across multiple EVM-compatible networks. More chains being added regularly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chains.map((chain) => (
              <Box
                key={chain.name}
                variant={chain.status === 'live' ? 'success' : 'default'}
                padding="md"
                className="text-center"
              >
                <div className="typo-ui text-terminal-green">{chain.name}</div>
                <div className={`typo-ui text-xs mt-1 ${
                  chain.status === 'live' ? 'text-terminal-green' : 'text-terminal-dim'
                }`}>
                  [{chain.status === 'live' ? 'LIVE' : 'Q1 2025'}]
                </div>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] SIMPLE INTEGRATION
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8">
            Get started with just a few lines of code.
          </p>
          <Box variant="default" padding="lg" className="overflow-x-auto">
            <pre className="typo-ui text-terminal-green text-sm">
              <code>{codeExample}</code>
            </pre>
          </Box>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-4">
            [#] INTEGRATIONS
          </h2>
          <p className="typo-ui text-terminal-dim text-center mb-8 max-w-2xl mx-auto">
            Connect AgentAuri to your existing tools and workflows.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box variant="default" padding="lg" className="text-center">
              <div className="typo-header text-terminal-green mb-2">WEBHOOKS</div>
              <p className="typo-ui text-terminal-dim text-sm">
                Send event data to any HTTP endpoint when triggers fire.
              </p>
            </Box>
            <Box variant="default" padding="lg" className="text-center">
              <div className="typo-header text-terminal-green mb-2">MCP ACTIONS</div>
              <p className="typo-ui text-terminal-dim text-sm">
                Connect to Model Context Protocol for AI agent orchestration.
              </p>
            </Box>
            <Box variant="default" padding="lg" className="text-center">
              <div className="typo-header text-terminal-green mb-2">REST API</div>
              <p className="typo-ui text-terminal-dim text-sm">
                Full programmatic access to all platform features.
              </p>
            </Box>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t-2 border-terminal text-center">
        <h2 className="typo-header text-terminal-green glow text-2xl mb-4">
          READY TO BUILD?
        </h2>
        <p className="typo-ui text-terminal-dim mb-8 max-w-xl mx-auto">
          Start monitoring your AI agents today. Free tier available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="typo-ui">
            <Link href="/login">[GET STARTED FREE]</Link>
          </Button>
          <Button asChild variant="outline" className="typo-ui">
            <Link href="/docs">[READ THE DOCS]</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
