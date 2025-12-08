import { PixelLogo } from '@/components/atoms/pixel-logo'

export default function Home() {
  return (
    <div className="h-screen bg-terminal scanlines overflow-y-auto overflow-x-hidden">
      {/* CRT Screen Container - Full Screen */}
      <div className="crt-screen screen-glow w-full min-h-full p-4 md:p-6">
        {/* Terminal Window - Full Height, No Border */}
        <div className="min-h-full flex flex-col">
          {/* Terminal Header */}
          <div className="terminal-header">
            <div className="flex items-center justify-between typo-ui">
              <span className="text-terminal-dim">AGENTAURI.AI SYSTEM TERMINAL v1.0</span>
              <span className="text-terminal-dim">(C) 2025 ERC-8004</span>
            </div>
          </div>

          {/* Pixel Art Logo - 80s Style */}
          <PixelLogo animation="boot" bootDuration={2000} className="mb-8" />

          {/* Boot Sequence */}
          <div className="space-y-2 mb-8 typo-ui">
            <div className="animate-boot delay-100">
              <span className="text-terminal-dim">&gt;</span> INITIALIZING SYSTEM...
            </div>
            <div className="animate-boot delay-300">
              <span className="text-terminal-dim">&gt;</span> LOADING AGENT REPUTATION PROTOCOL
            </div>
            <div className="animate-boot delay-500">
              <span className="text-terminal-dim">&gt;</span> CONNECTING TO BLOCKCHAIN NETWORKS...
            </div>
            <div className="animate-boot delay-700">
              <span className="text-terminal-dim">&gt;</span> ETHEREUM <span className="text-terminal-bright">[OK]</span>
            </div>
            <div className="animate-boot delay-800">
              <span className="text-terminal-dim">&gt;</span> BASE <span className="text-terminal-bright">[OK]</span>
            </div>
            <div className="animate-boot delay-900">
              <span className="text-terminal-dim">&gt;</span> LINEA <span className="text-terminal-bright">[OK]</span>
            </div>
            <div className="animate-boot delay-1000">
              <span className="text-terminal-dim">&gt;</span> POLYGON <span className="text-terminal-bright">[OK]</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-terminal-dim my-6" />

          {/* System Status */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 typo-ui">
            <div className="border border-terminal-dim p-4">
              <div className="text-terminal-dim mb-2">NETWORKS</div>
              <div className="typo-header glow">6</div>
              <div className="text-terminal-dim typo-ui mt-1">CHAINS ONLINE</div>
            </div>
            <div className="border border-terminal-dim p-4">
              <div className="text-terminal-dim mb-2">LATENCY</div>
              <div className="typo-header glow pulse-glow">&lt;1s</div>
              <div className="text-terminal-dim typo-ui mt-1">EVENT INDEXING</div>
            </div>
            <div className="border border-terminal-dim p-4">
              <div className="text-terminal-dim mb-2">TRIGGERS</div>
              <div className="typo-header glow">3</div>
              <div className="text-terminal-dim typo-ui mt-1">ACTION TYPES</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-terminal-dim my-6" />

          {/* Main Menu */}
          <div className="mb-8">
            <div className="typo-ui text-terminal-bright mb-4 glow-sm">
              AVAILABLE COMMANDS:
            </div>
            <div className="text-terminal-dim mb-4">━━━━━━━━━━━━━━━━━━━</div>

            <div className="space-y-3 typo-ui">
              <a
                href="/dashboard"
                className="block hover:text-terminal-bright hover:glow transition-all"
              >
                <span className="text-terminal-bright">[1]</span> VIEW DASHBOARD
                <span className="text-terminal-dim ml-2">- Monitor agent activity</span>
              </a>
              <a
                href="/triggers"
                className="block hover:text-terminal-bright hover:glow transition-all"
              >
                <span className="text-terminal-bright">[2]</span> CREATE TRIGGER
                <span className="text-terminal-dim ml-2">- Automate actions</span>
              </a>
              <a
                href="/agents"
                className="block hover:text-terminal-bright hover:glow transition-all"
              >
                <span className="text-terminal-bright">[3]</span> CHECK REPUTATION
                <span className="text-terminal-dim ml-2">- Query agent scores</span>
              </a>
              <a
                href="/login"
                className="block hover:text-terminal-bright hover:glow transition-all"
              >
                <span className="text-terminal-bright">[4]</span> CONNECT WALLET
                <span className="text-terminal-dim ml-2">- Authenticate</span>
              </a>
              <a
                href="/docs"
                className="block hover:text-terminal-bright hover:glow transition-all"
              >
                <span className="text-terminal-bright">[5]</span> READ DOCS
                <span className="text-terminal-dim ml-2">- API reference</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-terminal-dim my-6" />

          {/* Features Info */}
          <div className="mb-8 typo-ui text-terminal-dim">
            <div className="mb-2 text-terminal-green">SUPPORTED INTEGRATIONS:</div>
            <div className="flex flex-wrap gap-4">
              <span>[ TELEGRAM ]</span>
              <span>[ WEBHOOKS ]</span>
              <span>[ MCP ]</span>
              <span>[ REST API ]</span>
            </div>
          </div>

          {/* Spacer to push prompt to bottom */}
          <div className="flex-1" />

          {/* Command Prompt */}
          <div className="border-t border-terminal-dim pt-6">
            <div className="flex items-center typo-ui">
              <span className="text-terminal-bright mr-2">guest@agentauri:~$</span>
              <span className="cursor-blink glow">█</span>
            </div>
            <div className="mt-2 typo-ui text-terminal-dim">
              READY. TYPE COMMAND OR SELECT OPTION.
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-terminal-dim typo-ui text-terminal-dim">
            <div className="flex flex-wrap justify-between gap-4">
              <span>MEMORY: 640K OK</span>
              <span>PROTOCOL: ERC-8004</span>
              <span>INDEXER: PONDER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
