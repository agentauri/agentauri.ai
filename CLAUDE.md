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
│   ├── (auth)/            # Auth route group (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # Atomic Design structure
│   ├── atoms/             # Basic UI (Button, Input, Card, etc.)
│   ├── molecules/         # Composite components (SearchInput, StatCard)
│   ├── organisms/         # Complex components (TriggerForm, TriggersList)
│   └── templates/         # Page layouts
├── hooks/                 # Custom React hooks (use-auth, use-triggers)
├── lib/                   # Utilities and API clients
│   ├── api/               # API client modules (auth, triggers, organizations)
│   └── validations/       # Zod schemas
├── stores/                # Zustand stores (auth, organization, ui)
├── test/                  # Test setup (MSW server)
└── types/                 # TypeScript types and models
```

### Key Patterns

**Path Alias**: Use `@/` for imports from `src/` directory.

**Component Organization**: Components follow Atomic Design (atoms → molecules → organisms → templates). Each component can have a `.stories.tsx` file for Storybook.

**State Management**: Three persisted Zustand stores:
- `auth-store`: Authentication state
- `organization-store`: Current organization context
- `ui-store`: Theme and UI preferences

**API Layer**: API clients in `src/lib/api/` use a central `api-client.ts`. Backend handles all blockchain reads via Ponder indexers.

**Authentication**: JWT-based auth with middleware protection. Token stored in cookie, validated via jose library. Supports:
- OAuth (Google, GitHub) via `OAuthButtons` component
- Wallet connection via `WalletOptions` component
- Legacy `?token=` callback for backward compatibility

**Route Groups**:
- `(auth)` - login/register flows
- `(dashboard)` - protected routes (agents, triggers, events, etc.)
- `(public)` - landing and public pages

### Domain Models
Key entities defined in `src/types/models.ts`:
- User, Organization, OrganizationMember
- Trigger, TriggerCondition, TriggerAction
- ApiKey, LinkedAgent, BlockchainEvent
- CreditBalance, CreditTransaction

### Recent Components

**Auth Molecules** (`src/components/molecules/`):
- `OAuthButtons` - Google/GitHub OAuth login buttons
- `WalletOptions` - Wallet connection options (wagmi)

**Sidebar Components**:
- `SidebarUserInfo` - User/org info in sidebar footer
- `DashboardSidebar` - Main navigation with ORGANIZATION link

**Warp Homepage** (`src/components/organisms/`):
- `WarpHomepage` - Animated landing page
- `WarpStarField` - Background star animation
- `WarpLogoCenter`, `WarpNavMenu` - Homepage molecules

### Supported Chains
Mainnet, Base, Sepolia, Base Sepolia, Linea Sepolia, Polygon Amoy

## Code Style (Biome)

- Single quotes, no semicolons
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
