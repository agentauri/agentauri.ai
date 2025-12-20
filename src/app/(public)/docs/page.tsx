import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon, type IconName } from '@/components/atoms/icon'

const quickStartSteps = [
  {
    step: 1,
    title: 'CREATE AN ACCOUNT',
    description: 'Sign up with your wallet using SIWE (Sign In With Ethereum).',
    code: '// Connect your wallet and sign the authentication message',
  },
  {
    step: 2,
    title: 'LINK YOUR AGENT',
    description: 'Link an ERC-8004 agent NFT to your organization.',
    code: `// From the dashboard, click "Link Agent" and sign the proof message
// Or via API:
POST /api/v1/organizations/{orgId}/agents
{ "agentAddress": "0x1234...", "chainId": 1, "signature": "0x..." }`,
  },
  {
    step: 3,
    title: 'START QUERYING',
    description: 'Use the API to query events, set up triggers, and build automations.',
    code: `// Get your API key from the dashboard
curl -X GET "https://api.agentauri.ai/api/v1/events" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
  },
]

const docCategories: Array<{
  title: string
  description: string
  icon: IconName
  links: Array<{ label: string; href: string }>
}> = [
  {
    title: 'GETTING STARTED',
    description: 'Learn the basics and get up and running quickly.',
    icon: 'help',
    links: [
      { label: 'Introduction', href: '#intro' },
      { label: 'Authentication', href: '#auth' },
      { label: 'Quick Start Guide', href: '#quickstart' },
      { label: 'Concepts', href: '#concepts' },
    ],
  },
  {
    title: 'API REFERENCE',
    description: 'Complete reference for the AgentAuri REST API.',
    icon: 'api-keys',
    links: [
      { label: 'Events API', href: '#events' },
      { label: 'Agents API', href: '#agents' },
      { label: 'Triggers API', href: '#triggers' },
      { label: 'Organizations API', href: '#orgs' },
    ],
  },
  {
    title: 'TRIGGERS GUIDE',
    description: 'Set up automated workflows based on on-chain events.',
    icon: 'triggers',
    links: [
      { label: 'Creating Triggers', href: '#create' },
      { label: 'Conditions', href: '#conditions' },
      { label: 'Webhook Actions', href: '#webhooks' },
      { label: 'MCP Actions', href: '#mcp' },
    ],
  },
  {
    title: 'SDK & TOOLS',
    description: 'Libraries and tools for common languages and frameworks.',
    icon: 'chart',
    links: [
      { label: 'JavaScript SDK', href: '#js-sdk' },
      { label: 'Python SDK', href: '#py-sdk' },
      { label: 'CLI Tool', href: '#cli' },
      { label: 'Postman Collection', href: '#postman' },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-terminal">
      {/* Hero */}
      <section className="py-20 text-center border-b-2 border-terminal">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="typo-header text-terminal-green glow text-4xl md:text-5xl mb-4">
            DOCUMENTATION
          </h1>
          <p className="typo-ui text-terminal-dim text-lg max-w-2xl mx-auto">
            Everything you need to integrate with the AgentAuri platform.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] QUICK START
          </h2>

          <div className="space-y-6">
            {quickStartSteps.map((step) => (
              <Box key={step.step} variant="default" padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 border-2 border-terminal-green flex items-center justify-center typo-header text-terminal-green">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="typo-ui text-terminal-green glow mb-2">
                      &gt; {step.title}
                    </h3>
                    <p className="typo-ui text-terminal-dim mb-4">{step.description}</p>
                    <div className="bg-terminal-green/5 border border-terminal-dim p-4 overflow-x-auto">
                      <pre className="font-mono text-terminal-green text-base leading-relaxed">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Doc Categories */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] DOCUMENTATION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docCategories.map((category) => (
              <Box key={category.title} variant="default" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name={category.icon} size="md" className="text-terminal-green" />
                  <h3 className="typo-ui text-terminal-green glow">{category.title}</h3>
                </div>
                <p className="typo-ui text-terminal-dim mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors flex items-center gap-2"
                      >
                        <Icon name="chevron-right" size="sm" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* API Base URL */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] API INFORMATION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box variant="default" padding="lg">
              <h3 className="typo-ui text-terminal-green glow mb-2">&gt; BASE URL</h3>
              <code className="typo-ui text-terminal-bright block bg-terminal-green/10 p-3 border border-terminal-dim">
                https://api.agentauri.ai/api/v1
              </code>
            </Box>

            <Box variant="default" padding="lg">
              <h3 className="typo-ui text-terminal-green glow mb-2">&gt; AUTHENTICATION</h3>
              <code className="typo-ui text-terminal-bright block bg-terminal-green/10 p-3 border border-terminal-dim">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </Box>

            <Box variant="default" padding="lg">
              <h3 className="typo-ui text-terminal-green glow mb-2">&gt; RATE LIMITS</h3>
              <ul className="space-y-1 typo-ui text-terminal-dim">
                <li>Free: 1,000 requests/month</li>
                <li>Pro: 50,000 requests/month</li>
                <li>Enterprise: Unlimited</li>
              </ul>
            </Box>

            <Box variant="default" padding="lg">
              <h3 className="typo-ui text-terminal-green glow mb-2">&gt; OPENAPI SPEC</h3>
              <Link
                href="https://api.agentauri.ai/api/v1/openapi.json"
                target="_blank"
                className="typo-ui text-terminal-green hover:underline flex items-center gap-2"
              >
                <Icon name="arrow-right" size="sm" />
                View OpenAPI Specification
              </Link>
            </Box>
          </div>
        </div>
      </section>

      {/* SDK Coming Soon */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto text-center">
          <Box variant="default" padding="lg" className="glow-sm">
            <h2 className="typo-header text-terminal-green glow mb-4">
              [#] SDK COMING SOON
            </h2>
            <p className="typo-ui text-terminal-dim mb-6 max-w-lg mx-auto">
              Official SDKs for JavaScript/TypeScript and Python are in development.
              Sign up to be notified when they launch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Box variant="default" padding="md" className="inline-flex items-center gap-2">
                <span className="typo-ui text-terminal-green">@agentauri/sdk</span>
                <span className="typo-ui text-terminal-dim text-xs">[COMING Q1 2025]</span>
              </Box>
              <Box variant="default" padding="md" className="inline-flex items-center gap-2">
                <span className="typo-ui text-terminal-green">agentauri-py</span>
                <span className="typo-ui text-terminal-dim text-xs">[COMING Q2 2025]</span>
              </Box>
            </div>
          </Box>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t-2 border-terminal text-center">
        <h2 className="typo-header text-terminal-green glow text-2xl mb-4">
          NEED HELP?
        </h2>
        <p className="typo-ui text-terminal-dim mb-8 max-w-xl mx-auto">
          Join our Discord community or reach out to support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="typo-ui">
            <Link href="https://discord.gg/agentauri" target="_blank">
              [JOIN DISCORD]
            </Link>
          </Button>
          <Button asChild variant="outline" className="typo-ui">
            <Link href="mailto:support@agentauri.ai">[CONTACT SUPPORT]</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
