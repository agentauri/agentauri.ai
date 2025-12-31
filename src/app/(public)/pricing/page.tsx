import Link from 'next/link'
import { Box } from '@/components/atoms/box'
import { Button } from '@/components/atoms/button'
import { Icon } from '@/components/atoms/icon'
import { Collapsible } from '@/components/atoms/collapsible'

const tiers = [
  {
    name: 'FREE',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1,000 API calls/month',
      '1 linked agent',
      'Basic event queries',
      'Community support',
      'Public dashboard',
    ],
    cta: 'GET STARTED',
    highlighted: false,
  },
  {
    name: 'PRO',
    price: '$49',
    period: '/month',
    description: 'For growing projects',
    features: [
      '50,000 API calls/month',
      '10 linked agents',
      'Advanced queries',
      'Webhook triggers',
      'Priority support',
      'Custom dashboards',
      'Multi-chain support',
    ],
    cta: 'START FREE TRIAL',
    highlighted: true,
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    period: '',
    description: 'For large scale operations',
    features: [
      'Unlimited API calls',
      'Unlimited agents',
      'Full query access',
      'MCP actions',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Custom integrations',
    ],
    cta: 'CONTACT SALES',
    highlighted: false,
  },
]

const faqs = [
  {
    question: 'How do credits work?',
    answer:
      'Credits are consumed with each API call. Different endpoints consume different amounts based on complexity. Unused credits roll over to the next month on paid plans.',
  },
  {
    question: 'Can I switch plans anytime?',
    answer:
      'Yes! You can upgrade or downgrade at any time. When upgrading, you pay the prorated difference. When downgrading, the new rate applies at your next billing cycle.',
  },
  {
    question: 'What chains are supported?',
    answer:
      'We support Ethereum Mainnet, Base, Sepolia, Base Sepolia, Linea Sepolia, and Polygon Amoy. More chains coming in Q1 2025.',
  },
  {
    question: 'Is there an SLA?',
    answer:
      'Enterprise plans include a 99.9% uptime SLA. Pro plans have a 99.5% target uptime with no SLA guarantees.',
  },
  {
    question: 'How do webhook triggers work?',
    answer:
      'You can set up automated webhooks that fire when specific on-chain events occur for your linked agents. Configure conditions and actions through our dashboard.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-terminal">
      {/* Hero */}
      <section className="py-20 text-center border-b-2 border-terminal">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="typo-header text-terminal-green glow text-4xl md:text-5xl mb-4">
            TRANSPARENT. SCALABLE.
            <br />
            PAY AS YOU GROW.
          </h1>
          <p className="typo-ui text-terminal-dim text-lg max-w-2xl mx-auto">
            Start free and scale with your needs. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Box
                key={tier.name}
                variant={tier.highlighted ? 'success' : 'default'}
                padding="lg"
                className={tier.highlighted ? 'glow-sm' : ''}
              >
                <div className="text-center mb-6">
                  <h2 className="typo-header text-terminal-green">{tier.name}</h2>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-terminal-bright">{tier.price}</span>
                    <span className="typo-ui text-terminal-dim">{tier.period}</span>
                  </div>
                  <p className="typo-ui text-terminal-dim mt-2">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Icon name="check" size="sm" className="text-terminal-green shrink-0" />
                      <span className="typo-ui text-terminal-dim">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full typo-ui"
                  variant={tier.highlighted ? 'default' : 'outline'}
                >
                  <Link href="/login">[{tier.cta}]</Link>
                </Button>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] FEATURE COMPARISON
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-2 border-terminal">
              <thead>
                <tr className="border-b-2 border-terminal">
                  <th scope="col" className="text-left p-4 typo-ui text-terminal-dim">FEATURE</th>
                  <th scope="col" className="text-center p-4 typo-ui text-terminal-dim">FREE</th>
                  <th scope="col" className="text-center p-4 typo-ui text-terminal-green">PRO</th>
                  <th scope="col" className="text-center p-4 typo-ui text-terminal-dim">ENTERPRISE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['API Calls', '1K/mo', '50K/mo', 'Unlimited'],
                  ['Linked Agents', '1', '10', 'Unlimited'],
                  ['Event History', '7 days', '90 days', 'Unlimited'],
                  ['Triggers', '3', '25', 'Unlimited'],
                  ['Webhooks', '-', 'check', 'check'],
                  ['MCP Actions', '-', '-', 'check'],
                  ['Multi-chain', '-', 'check', 'check'],
                  ['Support', 'Community', 'Priority', 'Dedicated'],
                ].map(([feature, free, pro, enterprise]) => (
                  <tr key={feature as string} className="border-b border-terminal-dim">
                    <td className="p-4 typo-ui text-terminal-green">{feature}</td>
                    <td className="p-4 text-center">
                      {free === 'check' ? (
                        <Icon name="check" size="sm" className="text-terminal-green mx-auto" />
                      ) : free === '-' ? (
                        <span className="text-terminal-dim">-</span>
                      ) : (
                        <span className="typo-ui text-terminal-dim">{free}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {pro === 'check' ? (
                        <Icon name="check" size="sm" className="text-terminal-green mx-auto" />
                      ) : (
                        <span className="typo-ui text-terminal-green">{pro}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {enterprise === 'check' ? (
                        <Icon name="check" size="sm" className="text-terminal-green mx-auto" />
                      ) : (
                        <span className="typo-ui text-terminal-dim">{enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t-2 border-terminal">
        <div className="max-w-4xl mx-auto">
          <h2 className="typo-header text-terminal-green glow text-center mb-8">
            [#] FAQ
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Collapsible key={faq.question} title={`> ${faq.question}`}>
                <p className="typo-ui text-terminal-dim">{faq.answer}</p>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t-2 border-terminal text-center">
        <h2 className="typo-header text-terminal-green glow text-2xl mb-4">
          READY TO GET STARTED?
        </h2>
        <p className="typo-ui text-terminal-dim mb-8 max-w-xl mx-auto">
          Join thousands of developers building with ERC-8004 reputation infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="typo-ui">
            <Link href="/login">[START FREE]</Link>
          </Button>
          <Button asChild variant="outline" className="typo-ui">
            <Link href="/docs">[READ DOCS]</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
