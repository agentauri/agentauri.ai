# UI/UX Improvement Plan - AgentAuri.AI

## Executive Summary

Three specialized agents evaluated the AgentAuri.AI UI/UX:
- **Frontend Developer**: 7.1/10
- **Code Reviewer**: 78/100
- **UX Analyst**: 7.1/10

This plan consolidates their findings into actionable improvements, prioritized by impact and effort.

---

## High Priority Issues (Week 1)

### 1. Remove `rounded-*` Classes

**Problem**: Design system specifies 0px border-radius (pixel-perfect aesthetic), but multiple components use `rounded-lg`, `rounded-md`, etc.

**Files to Fix**:
| File | Line | Current | Fix |
|------|------|---------|-----|
| `src/app/(auth)/login/page.tsx` | 63, 79, 110, 172 | `rounded-lg` | Remove class |
| `src/components/atoms/button.tsx` | 8 | `rounded-md` | Remove class |
| `src/components/atoms/card.tsx` | - | `rounded-xl` | Remove class |

**Effort**: 1 hour

---

### 2. Fix `terminal-dim` Color Contrast

**Problem**: `#1A8C1A` on `#0A0A0A` has ~3.5:1 contrast ratio - fails WCAG AA (4.5:1 required).

**Fix in `src/app/globals.css`**:
```css
/* Change from */
--terminal-green-dim: #1A8C1A;

/* To (verified 4.5:1 contrast) */
--terminal-green-dim: #2AAA2A;
```

**Effort**: 15 minutes

---

### 3. Replace Emoji Icons with Terminal-Style Icons

**Problem**: Wallet and OAuth buttons use emojis breaking the pixel aesthetic.

**Files to Fix**:
- `src/components/molecules/WalletOptions.tsx` (lines 27-44)
- `src/components/molecules/OAuthButtons.tsx` (lines 19-25)

**Solution**: Create ASCII/pixel representations:
```tsx
// Instead of emoji
const WALLET_ICONS = {
  metamask: '[ M ]',
  walletConnect: '[ W ]',
  coinbase: '[ C ]',
}

// Or use Icon component with terminal-styled icons
<Icon name="wallet" className="text-terminal-green" />
```

**Effort**: 2 hours

---

### 4. Add ARIA Attributes to Collapsible

**Problem**: Missing `aria-expanded`, `aria-controls` for screen readers.

**File**: `src/components/atoms/collapsible.tsx`

**Fix**:
```tsx
export function Collapsible({ title, children, className, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className={cn('border-2 border-terminal-dim', className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
        className="..."
      >
        ...
      </button>
      {isOpen && (
        <div id={contentId} className="...">
          {children}
        </div>
      )}
    </div>
  )
}
```

**Effort**: 30 minutes

---

### 5. Add aria-label to Icon-Only Buttons

**Problem**: Buttons with only icons lack screen reader labels.

**File**: `src/components/molecules/SearchInput.tsx` (line 55)

**Fix**:
```tsx
<Button
  type="button"
  variant="ghost"
  size="sm"
  onClick={handleClear}
  aria-label="Clear search"
  className="..."
>
  <Icon name="close" size="sm" />
</Button>
```

**Effort**: 15 minutes

---

### 6. Add Mobile Navigation

**Problem**: `PublicNav` is `hidden md:flex` - no mobile menu for public pages.

**Solution**: Create hamburger menu component.

**New File**: `src/components/molecules/MobileNav.tsx`
```tsx
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        <Icon name={isOpen ? 'close' : 'menu'} />
      </Button>
      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-terminal border-t-2 border-terminal-dim">
          {/* Navigation links */}
        </nav>
      )}
    </div>
  )
}
```

**Files to Modify**:
- `src/components/organisms/PublicNav.tsx`
- `src/components/atoms/icon.tsx` (add `menu` icon)

**Effort**: 3 hours

---

## Medium Priority Issues (Week 2)

### 7. Scale Typography for Mobile

**Problem**: 11px pixel font is too small on mobile screens.

**Fix in `src/app/globals.css`**:
```css
@media (max-width: 640px) {
  .typo-ui {
    font-size: 12px !important;
  }
  .typo-header {
    font-size: 14px !important;
  }
}
```

**Effort**: 30 minutes

---

### 8. Create Hero Typography Variant

**Problem**: Pages use `text-4xl` overriding `typo-header` 13px size.

**Fix in `src/app/globals.css`**:
```css
.typo-hero {
  font-family: var(--font-pixel), monospace;
  font-size: clamp(1.5rem, 5vw, 3rem);
  line-height: 1.3;
  text-transform: uppercase;
}
```

**Files to Update**:
- `src/app/(public)/features/page.tsx:88`
- `src/app/(public)/pricing/page.tsx:94`

**Effort**: 1 hour

---

### 9. Add Reduced Motion Support

**Problem**: Glow animations don't respect `prefers-reduced-motion`.

**Fix in `src/app/globals.css`**:
```css
@media (prefers-reduced-motion: reduce) {
  .pulse-glow,
  .crt-flicker,
  .pixel-pulse,
  .glow,
  .glow-sm {
    animation: none !important;
  }
}
```

**Effort**: 15 minutes

---

### 10. Standardize Container Widths

**Problem**: Inconsistent `max-w-3xl`, `max-w-4xl`, `max-w-6xl` usage.

**Standard**:
- Hero sections: `max-w-4xl`
- Content grids: `max-w-6xl`
- Single-column: `max-w-3xl`

**Files to Update**:
- `src/app/(public)/features/page.tsx`
- `src/app/(public)/pricing/page.tsx`
- `src/app/(public)/docs/page.tsx`

**Effort**: 1 hour

---

### 11. Apply Scanlines to Auth Layout

**Problem**: Auth layout lacks scanlines overlay present in other layouts.

**File**: `src/app/(auth)/layout.tsx`

**Add after body content**:
```tsx
<div className="scanlines" aria-hidden="true" />
```

**Effort**: 15 minutes

---

### 12. Move Inline Styles to CSS

**Problem**: `WarpLogoCenter.tsx` uses inline styles bypassing design system.

**File**: `src/components/molecules/WarpLogoCenter.tsx`

**Fix**: Add utility classes to `globals.css`:
```css
.typo-logo-center {
  font-family: var(--font-pixel), monospace;
  font-size: clamp(2rem, 7vw, 5rem);
  line-height: 1.2;
}
```

**Effort**: 30 minutes

---

### 13. Consolidate Color Constants

**Problem**: `WarpStarField.tsx` hardcodes hex values duplicating CSS variables.

**File**: `src/components/atoms/WarpStarField.tsx`

**Solution**: Create shared theme file:
```typescript
// src/lib/theme-colors.ts
export const TERMINAL_COLORS = {
  green: 'hsl(120, 100%, 60%)', // #33FF33
  greenDim: 'hsl(120, 70%, 32%)', // Updated to #2AAA2A
  greenBright: 'hsl(120, 100%, 70%)', // #66FF66
  bg: 'hsl(0, 0%, 4%)', // #0A0A0A
}
```

**Effort**: 1 hour

---

## Low Priority Issues (Week 3+)

### 14. Remove Session Expired Amber Colors

**Problem**: Amber colors break green-only palette.

**File**: `src/app/(auth)/login/page.tsx:63-68`

**Fix**: Use terminal-green variant for warnings:
```tsx
// Instead of border-amber-500/50 and text-amber-400
className="border-terminal-dim bg-terminal/50 text-terminal-green"
```

**Effort**: 15 minutes

---

### 15. Rename "CONNECT" to "LOGIN"

**Problem**: Confusing - users expect wallet connection, not login page.

**File**: `src/components/molecules/WarpNavMenu.tsx:15`

**Effort**: 5 minutes

---

### 16. Add Table Scope Attributes

**Problem**: Pricing table headers lack `scope` for accessibility.

**File**: `src/app/(public)/pricing/page.tsx`

**Fix**:
```tsx
<th scope="col" className="...">FEATURE</th>
```

**Effort**: 15 minutes

---

### 17. Complete Register Page

**Problem**: `/register` is placeholder showing only "> REGISTER PAGE_".

**File**: `src/app/(auth)/register/page.tsx`

**Effort**: 4+ hours (new feature)

---

## Storybook Compatibility Notes

All proposed changes are compatible with Storybook because:

1. **CSS Changes**: `globals.css` is imported in `.storybook/preview.tsx`
2. **Component Changes**: No breaking prop changes
3. **New Components**: `MobileNav` needs new story
4. **Icon Additions**: Update icon stories to include new icons

**Stories to Add/Update**:
- `MobileNav.stories.tsx` (new)
- `Collapsible.stories.tsx` (update for ARIA)
- `Icon.stories.tsx` (add menu icon)

---

## Summary by Effort

| Priority | Issue Count | Total Effort |
|----------|-------------|--------------|
| High (Week 1) | 6 | ~7 hours |
| Medium (Week 2) | 7 | ~5 hours |
| Low (Week 3+) | 4 | ~5 hours |
| **Total** | **17** | **~17 hours** |

---

## Metrics to Track

After implementation, verify:
- [ ] All WCAG AA contrast ratios pass (use axe DevTools)
- [ ] No `rounded-*` classes in codebase (grep audit)
- [ ] No emoji icons in components (visual audit)
- [ ] Mobile navigation works on all viewports
- [ ] Storybook builds successfully
- [ ] No TypeScript errors

---

*Generated from UI/UX evaluation by 3 specialized agents*
