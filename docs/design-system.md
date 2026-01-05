# AgentAuri.AI Design System

Guida completa al sistema di design per AgentAuri.AI. Questo documento definisce le regole per creare e organizzare componenti React seguendo l'Atomic Design.

## Sommario

- [Principi di Design](#principi-di-design)
- [Atomic Design](#atomic-design)
- [Convenzioni Componenti](#convenzioni-componenti)
- [Sistema Varianti (CVA)](#sistema-varianti-cva)
- [Mobile-Readiness](#mobile-readiness)
- [Color Palette](#color-palette)
- [Typography](#typography)

---

## Principi di Design

### Estetica Terminal/Retro

AgentAuri.AI adotta un'estetica **terminal/retro** ispirata ai computer degli anni '80:

- **Pixel Art**: Logo e icone seguono una griglia pixel (16x16)
- **Glow Effects**: Effetti di bagliore verde terminale
- **Scanlines**: Effetto CRT opzionale
- **Bordi Spessi**: `border-2` su tutti i contenitori
- **Uppercase**: Testo UI in maiuscolo con tracking largo

### Principi Chiave

1. **Minimalismo**: Solo elementi essenziali, niente decorazioni superflue
2. **Consistenza**: Pattern ripetuti in tutto il sistema
3. **Accessibilità**: Contrasto sufficiente, focus visibile, aria-labels
4. **Responsiveness**: Mobile-first, funziona su tutti i dispositivi

---

## Atomic Design

Organizziamo i componenti in 4 livelli seguendo l'Atomic Design di Brad Frost.

### Atoms (< 80 righe)

Componenti base indivisibili. Non hanno logica di stato interna.

```
src/components/atoms/
├── Button.tsx        # Pulsanti con varianti
├── Input.tsx         # Campo input
├── Textarea.tsx      # Area di testo
├── Card.tsx          # Contenitore card
├── Badge.tsx         # Badge con varianti
├── Icon.tsx          # Sistema icone SVG
├── Box.tsx           # Contenitore generico
├── Skeleton.tsx      # Placeholder loading
├── Spinner.tsx       # Loading spinner
├── Label.tsx         # Etichetta form
├── Separator.tsx     # Separatore
├── Avatar.tsx        # Avatar utente
├── Tooltip.tsx       # Tooltip
├── Popover.tsx       # Popover
├── Dialog.tsx        # Modal dialog
├── Sheet.tsx         # Side panel
├── Select.tsx        # Dropdown select
├── Tabs.tsx          # Tab navigation
├── Table.tsx         # Tabella dati
└── ...
```

**Caratteristiche Atoms:**
- Singola responsabilità
- Props semplici (variant, size, className)
- Nessun useState/useEffect
- Completamente controllati dall'esterno

### Molecules (80-150 righe)

Composizione di 2-5 atoms con logica semplice.

```
src/components/molecules/
├── SearchInput.tsx       # Input + Button + Icon
├── StatCard.tsx          # Card + Icon + text
├── AlertBanner.tsx       # Box + Icon + Button
├── InfoCard.tsx          # Card + typography
├── EmptyState.tsx        # Icon + text + Button
├── FilterBar.tsx         # Box + children slots
├── CodeBlock.tsx         # Pre + Button (copy)
├── FormStepIndicator.tsx # Box + Icon steps
├── ArrayFieldBuilder.tsx # List + Button
├── LoadingSkeleton.tsx   # Multiple Skeleton
├── ConfirmDialog.tsx     # Dialog + Button
├── Pagination.tsx        # Button list
├── StatusBadge.tsx       # Badge + Icon
├── ChainBadge.tsx        # Badge + chain logic
├── RegistryBadge.tsx     # Badge + registry logic
├── OAuthButtons.tsx      # Google/GitHub OAuth buttons
├── WalletOptions.tsx     # Wallet connection options
├── SidebarUserInfo.tsx   # User/org info per sidebar
├── OrganizationSwitcher.tsx # Dropdown cambio org
├── CircuitBreakerStatus.tsx # System health status
└── WarpLogoCenter.tsx    # Logo animato homepage
```

**Caratteristiche Molecules:**
- Compongono 2-5 atoms
- Possono avere stato locale semplice (toggle, input value)
- Logica di presentazione (non business logic)
- Riutilizzabili in contesti diversi

### Organisms (> 150 righe)

Componenti complessi con state management e business logic.

```
src/components/organisms/
├── TriggerForm.tsx           # Multi-step form
├── TriggerCard.tsx           # Card con actions
├── TriggersList.tsx          # List + filters
├── ConditionBuilder.tsx      # Complex builder
├── ActionBuilder.tsx         # Complex builder
├── TriggerJsonEditor.tsx     # Code editor
├── ConditionTypeSelector.tsx # Selector + preview
├── JsonEditorToggle.tsx      # Mode toggle
├── PublicNav.tsx             # Desktop navigation
├── DashboardSidebar.tsx      # Sidebar + state
├── BottomNav.tsx             # Mobile navigation
├── MobileMenu.tsx            # Fullscreen menu
├── ErrorBoundary.tsx         # Error handling
├── WarpHomepage.tsx          # Landing page animata
├── WarpStarField.tsx         # Background stelle
├── EventTypeSelector.tsx     # Selettore tipo evento
├── CreateOrganizationDialog.tsx # Modal creazione org
└── triggers/
    ├── BasicInfoStep.tsx
    ├── ConditionsStep.tsx
    ├── ActionsStep.tsx
    └── ReviewStep.tsx
```

**Caratteristiche Organisms:**
- Composizione complessa di molecules e atoms
- State management (useState, useContext, Zustand)
- Integrazione con API (React Query mutations)
- Business logic specifica del dominio
- Possono contenere form validation

### Templates

Il quarto livello dell'Atomic Design. In questo progetto i layout di pagina sono gestiti tramite Next.js App Router `layout.tsx` files nelle route groups.

```
src/components/templates/
└── index.ts              # Re-exports layout organisms (DashboardSidebar, PublicNav, BottomNav)

src/app/
├── (auth)/layout.tsx     # Auth layout (centered card)
├── (dashboard)/layout.tsx # Dashboard layout (sidebar + main)
└── (public)/layout.tsx   # Public layout (header + footer)
```

**Caratteristiche Templates:**
- Layout definiti nei `layout.tsx` delle route groups
- `templates/` contiene solo re-exports per comodita
- Combinano organisms di navigazione
- Gestiscono responsive layout (mobile vs desktop)
- Non contengono business logic

---

## Convenzioni Componenti

### File Naming

```
✓ PascalCase per tutti i file componenti
  AlertBanner.tsx
  TriggerForm.tsx
  SearchInput.tsx

✓ PascalCase per stories
  AlertBanner.stories.tsx

✗ NON usare kebab-case
  alert-banner.tsx (NO)
```

### Struttura File

```tsx
// 1. Imports
import { type ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 2. Types/Interfaces
interface ComponentNameProps extends ComponentProps<'div'> {
  variant?: 'default' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

// 3. Variants (se CVA)
const componentVariants = cva('base-classes', {
  variants: { ... },
  defaultVariants: { ... }
})

// 4. Component
export function ComponentName({
  variant,
  size,
  className,
  ...props
}: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### Props Interface

```tsx
// Naming: ComponentNameProps
interface ButtonProps { ... }
interface SearchInputProps { ... }
interface TriggerFormProps { ... }

// Required vs Optional
interface ComponentProps {
  // Required: dati essenziali
  title: string
  onSubmit: () => void

  // Optional: styling e configurazione
  variant?: 'default' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

// Callback naming: on* prefix
onSubmit, onChange, onDismiss, onClick, onSearch
```

### data-slot Attribute

Ogni componente DEVE avere `data-slot` per styling e testing:

```tsx
// Atoms
<button data-slot="button" ... />
<div data-slot="card" ... />
<span data-slot="badge" ... />

// Compound components
<div data-slot="card">
  <div data-slot="card-header" ... />
  <div data-slot="card-content" ... />
  <div data-slot="card-footer" ... />
</div>
```

### Export Pattern

```tsx
// Barrel export in index.ts
export { Button } from './Button'
export { Card, CardHeader, CardContent, CardFooter } from './Card'
export type { ButtonProps, CardProps } from './types'

// Named exports (NO default exports)
export function Button() { ... }  // ✓
export default Button             // ✗
```

---

## Sistema Varianti (CVA)

Usa [Class Variance Authority](https://cva.style/) per gestire varianti di stile.

### Pattern Base

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base classes (sempre applicate)
  'inline-flex items-center justify-center rounded font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-terminal-green text-terminal hover:bg-terminal-green/90',
        secondary: 'bg-terminal text-terminal-green hover:bg-terminal/80',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border-2 border-terminal-green bg-transparent',
        ghost: 'bg-transparent hover:bg-terminal/50',
        link: 'underline-offset-4 hover:underline'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

// Usage in component
interface ButtonProps
  extends ComponentProps<'button'>,
          VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### Varianti Standard

```typescript
// Semantic variants
variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'

// Size variants
size: 'sm' | 'md' | 'lg' | 'icon'

// Status variants (per feedback)
status: 'info' | 'success' | 'warning' | 'error'
```

---

## Mobile-Readiness

### Breakpoints Standard

```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
2xl: 1536px  (extra large)
```

### Pattern Responsive

```tsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Auto-fit grid (preferito per liste)
<div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">

// Flex responsive
<div className="flex flex-col sm:flex-row gap-4">

// Hide/show by breakpoint
<nav className="hidden md:flex">  {/* Desktop only */}
<nav className="md:hidden">       {/* Mobile only */}
```

### Touch Targets

Minimo **44x44px** per elementi interattivi su mobile:

```tsx
// Button sizes
<Button size="sm" />   // h-8 (32px) - OK per desktop
<Button size="md" />   // h-10 (40px) - borderline
<Button size="lg" />   // h-12 (48px) - OK per mobile

// Icon buttons
<Button size="icon" /> // h-10 w-10 (40x40px)
```

### Checklist Mobile

- [ ] Nessuna larghezza fissa (`w-72`) su mobile - usa `max-w-*`
- [ ] Grid responsive: `grid-cols-1 md:grid-cols-2`
- [ ] Touch targets >= 44px
- [ ] No hover-only interactions
- [ ] Scroll orizzontale per tabelle: `overflow-x-auto`
- [ ] Text leggibile senza zoom (min 16px)

---

## Color Palette

### Terminal Colors

```css
--terminal:        hsl(120, 100%, 50%)     /* #00FF00 - Verde brillante */
--terminal-green:  hsl(120, 100%, 40%)     /* Verde principale */
--terminal-bright: hsl(120, 100%, 60%)     /* Verde chiaro (success) */
--terminal-dim:    hsl(120, 30%, 40%)      /* Verde scuro (muted) */
--terminal-bg:     hsl(0, 0%, 4%)          /* Nero profondo */
```

### Semantic Colors

```css
--destructive:     hsl(0, 84%, 60%)        /* Rosso (errori, delete) */
--warning:         hsl(45, 100%, 50%)      /* Giallo (warning) */
--info:            hsl(200, 100%, 50%)     /* Blu (info) */
```

### Usage

```tsx
// Text
<span className="text-terminal-green">Primary</span>
<span className="text-terminal-dim">Secondary</span>
<span className="text-destructive">Error</span>

// Backgrounds
<div className="bg-terminal">Dark container</div>
<div className="bg-terminal-green/10">Subtle highlight</div>

// Borders
<div className="border-terminal">Primary border</div>
<div className="border-terminal-dim">Secondary border</div>
<div className="border-destructive">Error border</div>

// Glow effects
<span className="glow">Glowing text</span>
<span className="glow-sm">Subtle glow</span>
```

---

## Typography

### Font Families

```css
--font-sans:  'JetBrains Mono', monospace  /* UI text, headers, data */
--font-mono:  'JetBrains Mono', monospace  /* Code */
```

### Typography Classes

```tsx
// UI text (Press Start 2P)
<span className="typo-ui">LABEL TEXT</span>
<h1 className="typo-header">HEADER</h1>

// Code text (VT323)
<code className="typo-code">console.log()</code>

// Sizes
<span className="text-xs">Extra small</span>   /* 10px */
<span className="text-sm">Small</span>         /* 12px */
<span className="text-base">Base</span>        /* 14px */
<span className="text-lg">Large</span>         /* 16px */
<span className="text-xl">Extra large</span>   /* 18px */
```

### Text Patterns

```tsx
// Uppercase UI labels
<span className="uppercase tracking-wider text-terminal-dim">
  STATUS
</span>

// Terminal prompt prefix
<span className="text-terminal-green">{'>'}</span> Command

// Dimmed secondary text
<p className="text-terminal-dim/80">
  Optional description text
</p>
```

---

## Esempi Pratici

### Creare un Nuovo Atom

```tsx
// src/components/atoms/MyAtom.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const myAtomVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-styles',
      secondary: 'secondary-styles'
    }
  },
  defaultVariants: { variant: 'default' }
})

interface MyAtomProps
  extends React.ComponentProps<'div'>,
          VariantProps<typeof myAtomVariants> {}

export function MyAtom({ variant, className, ...props }: MyAtomProps) {
  return (
    <div
      data-slot="my-atom"
      className={cn(myAtomVariants({ variant }), className)}
      {...props}
    />
  )
}
```

### Creare una Nuova Molecule

```tsx
// src/components/molecules/MyMolecule.tsx
import { Button, Icon, Box } from '@/components/atoms'

interface MyMoleculeProps {
  title: string
  onAction: () => void
  variant?: 'default' | 'highlight'
  className?: string
}

export function MyMolecule({
  title,
  onAction,
  variant = 'default',
  className
}: MyMoleculeProps) {
  return (
    <Box variant={variant} className={cn('flex items-center gap-4', className)}>
      <Icon name="info" />
      <span className="typo-ui">{title}</span>
      <Button onClick={onAction} size="sm">
        ACTION
      </Button>
    </Box>
  )
}
```

---

## Checklist Nuovo Componente

- [ ] File in PascalCase (`MyComponent.tsx`)
- [ ] `data-slot` attribute presente
- [ ] Props interface con naming corretto (`MyComponentProps`)
- [ ] CVA per varianti (se applicabile)
- [ ] Mobile-responsive (`grid-cols-1 md:grid-cols-2`)
- [ ] Accessibilità (aria-labels, focus states)
- [ ] Story file (`MyComponent.stories.tsx`)
- [ ] Export in `index.ts`
