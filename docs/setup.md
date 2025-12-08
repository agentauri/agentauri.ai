# Project Setup Guide

This document outlines all the configuration files that have been created for the AgentAuri.AI project.

## Configuration Files Created

### Core Package Configuration

#### 1. `package.json`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/package.json`

Main dependencies:
- **React 18.3.1** - UI library
- **Next.js 15.0.3** - React framework
- **TypeScript 5.6.3** - Type safety
- **clsx 2.1.1** - Conditional class names
- **tailwind-merge 2.5.4** - Tailwind class merging

Development dependencies:
- **Storybook 8.4.2** - Component development
- **Jest 29.7.0** - Testing framework
- **React Testing Library 16.0.1** - Component testing
- **ESLint 8.57.1** - Code linting
- **Prettier 3.3.3** - Code formatting
- **Tailwind CSS 3.4.14** - Styling

Scripts available:
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run Jest tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm storybook        # Start Storybook dev server
pnpm build-storybook  # Build Storybook
pnpm type-check       # Run TypeScript checks
```

### TypeScript Configuration

#### 2. `tsconfig.json`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/tsconfig.json`

Key settings:
- **Strict mode enabled** - Maximum type safety
- **Path aliases** - `@/*` maps to `./src/*`
- **Target ES2022** - Modern JavaScript features
- **JSX preserve** - For Next.js
- **Incremental compilation** - Faster builds

Additional strict checks:
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

### ESLint Configuration

#### 3. `.eslintrc.json`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.eslintrc.json`

Extends:
- `next/core-web-vitals` - Next.js best practices
- `plugin:@typescript-eslint/recommended` - TypeScript rules
- `plugin:react/recommended` - React best practices
- `plugin:react-hooks/recommended` - Hooks rules
- `plugin:storybook/recommended` - Storybook rules
- `prettier` - Prettier compatibility

Custom rules:
- Unused vars with underscore prefix allowed
- Console logs allowed (warn/error only)
- Type imports preferred
- Strict equality required

### Prettier Configuration

#### 4. `.prettierrc.json`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.prettierrc.json`

Settings:
- No semicolons
- Single quotes
- 2 space indentation
- 100 character line width
- Trailing commas (ES5)

#### 5. `.prettierignore`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.prettierignore`

Ignores: node_modules, .next, build artifacts, lock files

### Tailwind CSS Configuration

#### 6. `tailwind.config.ts`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/tailwind.config.ts`

Features:
- Terminal green color palette (`#33FF33`)
- Monospace font stack
- Custom animations (glow, pulse-slow)
- Retro/terminal design system

#### 7. `postcss.config.mjs`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/postcss.config.mjs`

Plugins:
- `tailwindcss` - Process Tailwind utilities
- `autoprefixer` - Add vendor prefixes

#### 8. `src/app/globals.css`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/src/app/globals.css`

Includes:
- Tailwind directives
- Terminal/retro theme
- Pixel logo animations
- Scanline effects
- Glow effects
- Custom utility classes

### Next.js Configuration

#### 9. `next.config.ts`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/next.config.ts`

Features:
- React strict mode enabled
- SWC minification
- Console log removal in production
- Typed routes (experimental)
- Security headers configured

#### 10. `src/app/layout.tsx`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/src/app/layout.tsx`

Root layout component with metadata and global styles.

### Jest Configuration

#### 11. `jest.config.ts`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/jest.config.ts`

Configuration:
- jsdom test environment
- Next.js integration
- Path alias support (`@/*`)
- Coverage collection configured
- Excludes stories and test files from coverage

#### 12. `jest.setup.ts`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/jest.setup.ts`

Imports @testing-library/jest-dom for enhanced matchers.

### Storybook Configuration

#### 13. `.storybook/main.ts`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.storybook/main.ts`

Configuration:
- Stories in `src/**/*.stories.@(js|jsx|ts|tsx)`
- Essential addons included
- Webpack alias for `@/*` paths
- Autodocs enabled

#### 14. `.storybook/preview.ts`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.storybook/preview.ts`

Settings:
- Imports global CSS
- Dark background by default
- Terminal background option
- Control matchers configured

### Version Management

#### 15. `.nvmrc`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.nvmrc`

Specifies Node.js version: **18.18.0**

#### 16. `.node-version`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.node-version`

Alternative version file for other version managers.

### Git Configuration

#### 17. `.gitignore`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.gitignore`

Ignores:
- Dependencies (node_modules)
- Build artifacts (.next, dist, out)
- Environment files (.env*.local)
- Test coverage
- IDE files
- OS files

### Environment Configuration

#### 18. `.env.example`
**Location:** `/Users/matteoscurati/work/agentauri.ai/agentauri.ai/.env.example`

Template for environment variables:
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- API configuration placeholders
- Analytics configuration placeholders

## Next Steps

### 1. Install Dependencies

```bash
cd /Users/matteoscurati/work/agentauri.ai/agentauri.ai
pnpm install
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` with your specific configuration.

### 3. Verify Setup

```bash
# Type check
pnpm type-check

# Lint check
pnpm lint

# Run tests
pnpm test
```

### 4. Start Development

```bash
# Start Next.js dev server
pnpm dev

# OR start Storybook
pnpm storybook
```

## Project Architecture

```
agentauri.ai/
├── .storybook/          # Storybook configuration
│   ├── main.ts
│   └── preview.ts
├── docs/                # Documentation
│   ├── setup.md         # This file
│   └── testing.md       # Testing documentation
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/      # React components
│   │   └── ui/
│   │       ├── logo.tsx
│   │       └── logo.stories.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── use-pixel-animation.ts
│   └── lib/             # Utilities
│       └── utils.ts
├── .eslintrc.json       # ESLint config
├── .gitignore           # Git ignore rules
├── .node-version        # Node version
├── .nvmrc               # NVM version
├── .prettierrc.json     # Prettier config
├── .prettierignore      # Prettier ignore
├── jest.config.ts       # Jest config
├── jest.setup.ts        # Jest setup
├── next.config.ts       # Next.js config
├── package.json         # Dependencies
├── postcss.config.mjs   # PostCSS config
├── README.md            # Project overview
├── tailwind.config.ts   # Tailwind config
└── tsconfig.json        # TypeScript config
```

## Technology Choices

### Why Next.js 15?
- App router with server components
- Built-in TypeScript support
- Optimized production builds
- API routes
- Image optimization

### Why Strict TypeScript?
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Safer refactoring

### Why Tailwind CSS?
- Utility-first approach
- Small bundle size
- Easy customization
- No CSS naming conflicts

### Why Storybook?
- Component isolation
- Visual documentation
- Design system development
- Interactive testing

### Why Jest + RTL?
- Industry standard
- React-specific matchers
- Excellent TypeScript support
- Fast and reliable

## Code Quality Standards

### TypeScript
- Strict mode required
- No `any` types (use `unknown`)
- Prefer type imports
- Document complex types

### React
- Functional components only
- Use hooks for state/effects
- Proper dependency arrays
- Memoization when needed

### Styling
- Tailwind utilities preferred
- Custom CSS only when needed
- Consistent spacing scale
- Mobile-first responsive

### Testing
- Unit tests for utilities
- Component tests for UI
- Integration tests for flows
- 80%+ coverage target

### Git
- Conventional commits
- Feature branches
- PR reviews required
- No direct main commits

## Troubleshooting

### Port conflicts
If port 3000 is in use:
```bash
PORT=3001 pnpm dev
```

### TypeScript errors
Clear Next.js cache:
```bash
rm -rf .next
pnpm type-check
```

### Test failures
Clear Jest cache:
```bash
pnpm exec jest --clearCache
pnpm test
```

### Storybook issues
Clear Storybook cache:
```bash
rm -rf node_modules/.cache
pnpm storybook
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Jest Documentation](https://jestjs.io/docs)
- [React Testing Library](https://testing-library.com/react)
