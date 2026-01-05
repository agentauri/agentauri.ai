# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentAuri.AI is an ERC-8004 Reputation Dashboard - a Next.js application for monitoring blockchain events, creating automated triggers, and querying agent reputation data. It uses a retro/terminal-inspired design aesthetic.

## Development Commands

```bash
pnpm dev              # Start dev server (turbopack, port 8004)
pnpm build            # Production build
pnpm lint             # Biome lint (./src)
pnpm lint:fix         # Biome lint with auto-fix
pnpm typecheck        # TypeScript type checking
pnpm test             # Run tests (Vitest)
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Playwright E2E tests
pnpm storybook        # Storybook dev server (port 6006)
pnpm build-storybook  # Build Storybook
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript (strict mode, noUncheckedIndexedAccess)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (persisted stores)
- **Data Fetching**: TanStack Query
- **Web3**: Wagmi + Viem (wallet connection and signing only - backend handles blockchain reads)
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library + MSW for mocking
- **Linting**: Biome (not ESLint/Prettier)
- **Component Docs**: Storybook 10

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register, callback)
│   ├── (dashboard)/       # Protected routes (agents, triggers, events, api-keys, billing, etc.)
│   ├── (public)/          # Public pages (docs, features, pricing, changelog)
│   ├── api/               # API routes (auth token management)
│   └── maintenance/       # Maintenance page
├── components/            # Atomic Design structure
│   ├── atoms/             # Basic UI (Button, Input, Card, Icon, Checkbox, WarpStarField, etc.)
│   ├── molecules/         # Composite components (SearchInput, WalletOptions, OAuthButtons, etc.)
│   ├── organisms/         # Complex components (TriggerForm, WarpHomepage, DashboardSidebar)
│   └── templates/         # Layout re-exports (DashboardSidebar, PublicNav, BottomNav)
├── hooks/                 # Custom React hooks
│   ├── use-auth, use-organizations, use-agents, use-api-keys
│   ├── use-billing, use-events, use-triggers, use-health
│   └── Animation hooks (use-warp-animation, use-glitch-animation, etc.)
├── lib/                   # Utilities and API clients
│   ├── api/               # API client modules (auth, agents, api-keys, billing, events, health, organizations, triggers, users)
│   ├── api-client.ts      # Central API client with auth handling
│   └── validations/       # Zod schemas
├── stores/                # Zustand stores (auth, organization, ui)
├── test/                  # Test setup (MSW server)
└── types/                 # TypeScript types and models
```

### Key Patterns

**Path Alias**: Use `@/` for imports from `src/` directory.

**Component Organization**: Components follow Atomic Design (atoms → molecules → organisms). Page layouts live in App Router route groups. Each component can have a `.stories.tsx` file for Storybook.

**State Management**: Three persisted Zustand stores:
- `auth-store`: Authentication state
- `organization-store`: Current organization context
- `ui-store`: Theme and UI preferences

**API Layer**: API clients in `src/lib/api/` use the central `src/lib/api-client.ts`. Backend handles all blockchain reads via Ponder indexers.

**Authentication**: JWT-based auth with proxy-based protection (Next.js 16+). Features:
- httpOnly cookies for secure token storage (XSS protection)
- Automatic token refresh before expiration via `/api/auth/refresh`
- CSRF protection for state-changing requests
- OAuth (Google, GitHub) via `OAuthButtons` component
- Wallet connection via `WalletOptions` component (SIWE)
- Token management via `/api/auth/*` routes (set-tokens, refresh, logout, exchange)

**Route Groups**:
- `(auth)` - login, register, OAuth callback
- `(dashboard)` - protected routes (agents, triggers, events, api-keys, billing, organizations, settings)
- `(public)` - landing, features, pricing, docs, changelog

### Domain Models
Key entities defined in `src/types/models.ts`:
- User, Organization, OrganizationMember
- Trigger, TriggerCondition, TriggerAction
- ApiKey, LinkedAgent, BlockchainEvent
- CreditBalance, CreditTransaction

### Key Components

**Design System** (`src/components/atoms/`):
- Terminal-styled UI with pixel font ('Press Start 2P')
- SVG pixel art wallet icons (`wallet-icons.tsx`)
- `Checkbox` - Terminal-styled checkbox component
- `Icon` - Centralized icon system

**Auth & Navigation** (`src/components/molecules/`):
- `OAuthButtons` - Google/GitHub OAuth with pixel art icons
- `WalletOptions` - Wallet connection with MetaMask, WalletConnect, Coinbase
- `PublicMobileNav` - Command Prompt style mobile navigation

**Dashboard** (`src/components/organisms/`):
- `DashboardSidebar` - Main navigation with collapsible sections
- `TriggerForm` - Multi-step trigger creation wizard

**Warp Homepage**:
- `WarpHomepage` - Animated landing page with star field (`organisms/`)
- `WarpStarField` - Canvas-based star animation (`atoms/`)
- `WarpLogoCenter`, `WarpNavMenu` - Homepage UI (`molecules/`)

### Supported Chains
Mainnet, Base, Sepolia, Base Sepolia, Linea Sepolia, Polygon Amoy

## Design System

Terminal/retro aesthetic with green phosphor CRT styling. See `docs/design-system.md` for details.

**Typography Classes** (defined in `globals.css`):
- `typo-header` - Section headers (13px pixel font)
- `typo-ui` - UI text, buttons, labels (11px pixel font)
- `typo-code` - Code blocks (21px VT323 monospace)
- `typo-hero` - Large hero headings (responsive clamp)

**Color Palette**:
- `--terminal-green: #33FF33` - Primary text
- `--terminal-green-dim: #1FA91F` - Secondary/muted (WCAG AA compliant)
- `--terminal-green-bright: #66FF66` - Highlights
- `--terminal-bg: #0A0A0A` - Background

**Effects**:
- `.glow`, `.glow-sm`, `.glow-lg` - Text glow effects
- `.scanlines` - CRT scanline overlay
- `.pixel-pulse` - Pulsing glow animation
- `prefers-reduced-motion` respected for all animations

**Styling Rules**:
- No `rounded-*` classes (pixel-perfect edges, border-radius: 0)
- Use CSS custom properties for colors
- Mobile-first responsive typography

## Code Style (Biome)

- Single quotes, semicolons as needed (omitted where possible)
- 2-space indentation, 100 char line width
- Import type for type-only imports (`useImportType`, `useExportType`)
- Node.js import protocol required (`node:fs` not `fs`)

## Testing

Tests use Vitest with jsdom environment. MSW handles API mocking via `src/test/setup.ts`. Test files use `.test.ts(x)` or `.spec.ts(x)` suffix.

Run single test file:
```bash
pnpm test src/lib/utils.test.ts
```

## CI Pipeline

GitHub Actions runs on push/PR to main:
1. Lint (Biome)
2. Type check
3. Unit tests with coverage
4. Build (depends on lint + typecheck)
5. Storybook build
