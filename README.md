# AgentAuri.AI

A modern AI-powered agent platform built with Next.js, React, and TypeScript.

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- pnpm 8.0.0 or higher

### Installation

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
agentauri.ai/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   └── ui/          # UI components (Logo, etc.)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── docs/                # Documentation
│   ├── setup.md         # Setup guide
│   └── testing.md       # Testing guide
├── .storybook/          # Storybook configuration
└── public/              # Static assets
```

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4
- **Component Library:** Custom components with Storybook
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + Prettier

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production
- `pnpm type-check` - Run TypeScript type checking

## Component Development

Components are developed in isolation using Storybook. To view the component library:

```bash
pnpm storybook
```

This will open Storybook at [http://localhost:6006](http://localhost:6006).

## Code Quality

The project uses:

- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for unit testing
- **React Testing Library** for component testing

Run type checking:

```bash
pnpm type-check
```

## Design System

The project uses a retro/terminal-inspired design with:

- Monospace fonts
- Green terminal color palette (#33FF33)
- Pixel art logo component
- Scanline and glow effects
- Dark mode by default

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- [Setup Guide](docs/setup.md) - Detailed setup instructions and configuration reference
- [Testing Guide](docs/testing.md) - Complete testing documentation and best practices

## Contributing

1. Ensure all tests pass: `pnpm test`
2. Ensure TypeScript types are valid: `pnpm type-check`
3. Ensure code is linted: `pnpm lint`
4. Add tests for new features
5. Update Storybook stories for UI components

## License

Proprietary
