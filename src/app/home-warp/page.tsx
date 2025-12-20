import type { Metadata } from 'next'
import { WarpHomepage } from '@/components/organisms/WarpHomepage'

export const metadata: Metadata = {
  title: 'WARP SPEED | agentauri.ai',
  description: 'Enter the AgentAuri universe - Reputation infrastructure for autonomous AI agents',
}

export default function HomeWarpPage() {
  return <WarpHomepage />
}
