# AgentAuri.AI - Piano di Lavoro

Ultimo aggiornamento: 28 Dicembre 2025

## Stato Attuale

### Completato Recentemente
- [x] OAuth flow (Google/GitHub) con gestione callback
- [x] Wallet connection con wagmi
- [x] Pagina Organizations con gestione multi-org
- [x] Sidebar riorganizzata con ORGANIZATION nav e UserInfo
- [x] Fix SYSTEM STATUS (schema Zod per health API)
- [x] Badge layout organization cards (CURRENT first, flex-wrap)
- [x] Documentazione aggiornata (README, CLAUDE.md, design-system.md)

### Metriche Codebase
| Area | Copertura | Note |
|------|-----------|------|
| Storybook Stories | 42% (36/86) | 50 componenti senza stories |
| Test Hooks | 27% (4/15) | 11 hooks non testati |
| Test API Modules | 40% (4/10) | 6 moduli non testati |
| Test Componenti | 0% (0/86) | Nessun test componenti |

---

## Fase 1: Type Safety (Alta Priorita)

### 1.1 Fix Trigger Form Types
I componenti form usano `any` invece di tipi appropriati.

**File da modificare:**
- [ ] `src/components/organisms/triggers/BasicInfoStep.tsx:17`
- [ ] `src/components/organisms/triggers/ConditionsStep.tsx:14`
- [ ] `src/components/organisms/triggers/ActionsStep.tsx:9`
- [ ] `src/components/organisms/triggers/ReviewStep.tsx:7`

**Azione:** Sostituire `UseFormReturn<any>` con `UseFormReturn<CreateTriggerRequest>`

---

## Fase 2: Test Coverage (Alta Priorita)

### 2.1 Test Hooks Mancanti
| Hook | Priorita | Complessita |
|------|----------|-------------|
| use-agents | Alta | Media |
| use-api-keys | Alta | Media |
| use-events | Alta | Media |
| use-billing | Media | Bassa |
| use-health | Media | Bassa |
| use-user-profile | Media | Bassa |
| use-glitch-animation | Bassa | Bassa |
| use-mouse-parallax | Bassa | Bassa |
| use-pixel-animation | Bassa | Bassa |
| use-warp-animation | Bassa | Bassa |

### 2.2 Test API Modules Mancanti
| Modulo | Priorita | Note |
|--------|----------|------|
| agents.ts | Alta | CRUD agenti |
| events.ts | Alta | Streaming eventi |
| billing.ts | Media | Crediti e transazioni |
| health.ts | Media | Health check |
| users.ts | Bassa | Profilo utente |

### 2.3 Test Componenti (Nice to Have)
Iniziare con smoke test per organismi critici:
- [ ] TriggerForm
- [ ] TriggersList
- [ ] AgentsList
- [ ] EventsList

---

## Fase 3: Storybook (Media Priorita)

### 3.1 Componenti Nuovi (Priorita Alta)
- [ ] EventTypeSelector.tsx
- [ ] SidebarUserInfo.tsx
- [ ] OAuthButtons.tsx
- [ ] WalletOptions.tsx
- [ ] CircuitBreakerStatus.tsx

### 3.2 Organismi Business (Media Priorita)
- [ ] AgentCard, AgentDetail, AgentsList
- [ ] EventCard, EventDetail, EventsList
- [ ] ApiKeyCard, ApiKeysList
- [ ] CreateApiKeyDialog
- [ ] CreateOrganizationDialog
- [ ] LinkAgentDialog

### 3.3 Atoms Form (Bassa Priorita)
- [ ] dialog.tsx
- [ ] select.tsx
- [ ] popover.tsx
- [ ] tabs.tsx
- [ ] form.tsx

---

## Fase 4: Accessibilita (Media Priorita)

### 4.1 Icon Buttons
Aggiungere `aria-label` a tutti i pulsanti icona:
- [ ] Sidebar collapse button
- [ ] Close buttons in dialogs
- [ ] Action buttons in cards

### 4.2 Form Fields
- [ ] Aggiungere `aria-describedby` per errori form
- [ ] Aggiungere `role="group"` per button groups
- [ ] Review keyboard navigation in complex components

---

## Fase 5: Refactoring (Bassa Priorita)

### 5.1 Deduplicazione Codice
- [ ] Estrarre pattern badge/status in utility condivisa
- [ ] Centralizzare logica filtri in ConditionsStep e simili
- [ ] Valutare memoization per animation hooks

### 5.2 Performance
- [ ] Profilare animation hooks (glitch, warp, parallax)
- [ ] Ottimizzare immagini pagine pubbliche
- [ ] Valutare lazy loading per pagine pesanti

---

## Backlog Funzionalita

### Da Implementare
- [ ] E2E tests con Playwright per flussi critici
- [ ] Notifiche real-time (WebSocket/SSE)
- [ ] Dark/Light theme toggle (attualmente solo dark)
- [ ] Export dati in CSV/JSON
- [ ] Filtri avanzati per eventi
- [ ] Grafici analytics per dashboard

### Da Valutare
- [ ] i18n (internazionalizzazione)
- [ ] PWA support
- [ ] Offline mode
- [ ] Rate limiting UI feedback

---

## Note per Sviluppatori

### Convenzioni
- Test files: `*.test.ts(x)` o `*.spec.ts(x)`
- Stories: `*.stories.tsx`
- Tipi: `UseFormReturn<T>` non `UseFormReturn<any>`

### Comandi Utili
```bash
pnpm test --watch             # Watch mode
pnpm test:coverage            # Coverage report
pnpm storybook                # Dev stories
pnpm lint:fix                 # Auto-fix lint
```

### File Modificati Recentemente
Vedi output `git status` per file in staging.
