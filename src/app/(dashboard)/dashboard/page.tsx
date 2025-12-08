import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="typo-header terminal-glow mb-6">&gt; DASHBOARD</h1>
      <p className="typo-ui text-muted-foreground">
        Welcome to your ERC-8004 Reputation Dashboard. Monitor blockchain events, create automated
        triggers, and query agent reputation data.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="typo-ui text-muted-foreground">Total Triggers</h3>
          <p className="typo-header mt-2 text-terminal-green">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="typo-ui text-muted-foreground">Active Triggers</h3>
          <p className="typo-header mt-2 text-terminal-green">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="typo-ui text-muted-foreground">Events (24h)</h3>
          <p className="typo-header mt-2 text-terminal-green">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="typo-ui text-muted-foreground">API Calls (24h)</h3>
          <p className="typo-header mt-2 text-terminal-green">0</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="typo-header mb-4">Recent Events</h3>
          <p className="typo-ui text-muted-foreground">No events yet.</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="typo-header mb-4">Trigger Executions</h3>
          <p className="typo-ui text-muted-foreground">No executions yet.</p>
        </div>
      </div>
    </div>
  )
}
