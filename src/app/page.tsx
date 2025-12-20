import type { Metadata } from 'next'
import { WarpHomepage } from '@/components/organisms/WarpHomepage'

export const metadata: Metadata = {
  title: 'agentauri.ai | ERC-8004 Reputation Infrastructure',
  description: 'Reputation infrastructure for autonomous AI agents',
}

export default function Home() {
  return <WarpHomepage />
}
