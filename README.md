# AgentAuri.AI

ERC-8004 Reputation Dashboard - A Next.js application for monitoring blockchain events, creating automated triggers, and querying agent reputation data.

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- pnpm 10.0.0 or higher

### Installation

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:8004](http://localhost:8004) with your browser to see the result.

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
agentauri.ai/
├── src/
│   ├── app/                    # Next.js App Router (route groups)
│   ├── components/            # Atomic Design (atoms/molecules/organisms)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and API clients
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript types
├── docs/                      # Documentation
├── .storybook/                # Storybook configuration
└── public/                    # Static assets
```

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## Tech Stack

- **Framework:** Next.js 16 with App Router and Turbopack
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand (persisted stores)
- **Data Fetching:** TanStack Query
- **Web3:** Wagmi + Viem (wallet connection)
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + Testing Library + MSW + Playwright
- **Linting:** Biome
- **Component Docs:** Storybook 10

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (port 8004) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Run Biome with auto-fix |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run Vitest tests |
| `pnpm test:coverage` | Tests with coverage |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm storybook` | Storybook dev (port 6006) |
| `pnpm build-storybook` | Build Storybook |

## Component Development

Components are developed in isolation using Storybook:

```bash
pnpm storybook
```

Opens at [http://localhost:6006](http://localhost:6006).

## Code Quality

The project uses:

- **TypeScript** with strict mode and `noUncheckedIndexedAccess`
- **Biome** for linting and formatting (single quotes, no semicolons)
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **MSW** for API mocking in tests

Run type checking:

```bash
pnpm typecheck
```

## Design System

Retro/terminal-inspired design with:

- Pixel font (Press Start 2P) and monospace (VT323)
- Terminal green color palette (#33FF33)
- Scanline and glow effects
- Dark mode by default
- Atomic Design methodology

See [docs/design-system.md](docs/design-system.md) for full reference.
See [CLAUDE.md](CLAUDE.md) for architecture and development patterns.

## Supported Chains

Mainnet, Base, Sepolia, Base Sepolia, Linea Sepolia, Polygon Amoy

## Contributing

1. Ensure all tests pass: `pnpm test`
2. Ensure TypeScript types are valid: `pnpm typecheck`
3. Ensure code is linted: `pnpm lint`
4. Add tests for new features
5. Update Storybook stories for UI components

## License

Proprietary
