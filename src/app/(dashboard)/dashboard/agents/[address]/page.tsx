interface AgentDetailPageProps {
  params: Promise<{ address: string }>
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { address } = await params

  return (
    <div className="h-screen bg-terminal flex items-center justify-center">
      <p className="text-terminal-green typo-ui glow">
        {'>'} AGENT DETAIL PAGE [{address}]_
      </p>
    </div>
  )
}
