# ADR 008: Component Consolidation — Design System Governance

> **Status**: Accepted  
> **Date**: April 14, 2026  
> **Decision Makers**: Development Team  
> **Scope**: `src/components/ui/`, `src/components/design-system/`, `src/components/common/`

---

## Context

The codebase had three overlapping component directories with duplicate components:
- `src/components/design-system/` — Properly structured with types, tested, theme-token aware
- `src/components/ui/` — Mixed bag: some unique components, some duplicates of design-system
- `src/components/common/` — Unclear purpose, holds domain-specific and utility components

### Duplicates Found
| Component | design-system/ | ui/ | Status |
|-----------|:-:|:-:|--------|
| Badge | ✅ | ✅ (+ subfolder) | Different APIs — cannot merge yet |
| Pagination | ✅ | ✅ | Different APIs — cannot merge yet |
| Spinner | ✅ | ✅ | **Deleted** ui/ copy (0 imports) |
| Tooltip | ✅ | ✅ | **Deleted** ui/ copy (0 imports) |
| Toast | ❌ | ✅ | Kept in ui/ (no design-system version) |

---

## Decision

### Phase 0.5 (This PR)
1. **Deleted** `ui/Spinner.tsx` — 0 imports, design-system version is canonical
2. **Deleted** `ui/Tooltip.tsx` — 0 imports, design-system version is canonical
3. **Deleted** `ui/Badge/` subfolder — Dead code duplicate (ui/Badge.tsx is the active file)
4. **Re-exported** Spinner and Tooltip from design-system in ui/index.ts for backward compatibility

### Deferred (Future PR)
5. **Badge consolidation** — ui/Badge.tsx (feature-rich: shapes, dots, dismissible, max count) vs design-system/Badge (simpler, token-aware). Need API unification before merge. **Recommended**: Enhance design-system Badge to support ui/Badge features, then migrate 9+ imports.
6. **Pagination consolidation** — ui/Pagination (totalItems/itemsPerPage API, 7 imports) vs design-system/Pagination (totalPages API). **Recommended**: Add backward-compatible props to design-system version.
7. **Orphaned ui/ components** — Dropdown, FormField, Popover, Tabs, ProgressBar should eventually move to design-system/ when proper typed versions are built.

---

## Component Directory Rules (Going Forward)

| Directory | Purpose | Who adds here |
|-----------|---------|---------------|
| `design-system/` | **Canonical** branded components. Theme-token aware, typed, tested. | Design system team |
| `ui/` | **Advanced patterns** not yet in design-system. Complex components, compositions. | Any developer |
| `common/` | **Shared utilities** (SuspenseLoader, CommandPalette). NOT for visual UI. | Any developer |
| `layout/` | **Page structure** (Sidebar, TopBar, etc.) | Layout team |

### Import Priority
```
1. import { Button } from '@/components/design-system';  // FIRST CHOICE
2. import { Tabs } from '@/components/ui';               // If not in design-system
3. Do NOT create new components in common/ — use design-system/ or ui/
```

---

## Consequences

### Positive
- Single source of truth for Spinner and Tooltip (design-system/)
- Backward-compatible — all existing imports from ui/ still work
- Clear governance rules for future development
- 4 duplicate files removed (~200 lines of dead code)

### Negative / Risk
- Badge and Pagination still have two versions (API mismatch blocks merge)
- ui/index.ts has re-exports that add indirection
- Need future PR to complete Badge/Pagination unification

---

## Architecture Notes

### WhatsApp Channels (Not Duplicates)
- **Nadia** (`server/routes/nadia.ts`) — AI queue system via Meta Business API (Cloud API)
- **Linda** (`server/routes/linda.ts`) — WhatsApp Web LocalAuth via whatsapp-web.js
- **Communications** (`server/routes/communications.ts`) — General messaging infrastructure
- These are **three distinct channels**, not duplicates.

### Hardcoded Colors
- 200+ files contain hardcoded hex colors
- Top offenders: AgentTabs.tsx (~35), ClickToChat.styles.ts (~25), LandlordTabs.tsx (~30)
- Theme tokens exist in `src/styles/theme/colors.ts` (150+ definitions)
- **Recommendation**: Migrate in dedicated PR with ESLint rule to prevent regression

### Dependencies
- **0 unused dependencies** confirmed via codebase audit
- express-validator, passport, socket.io, lodash — not installed (correct: using alternatives)
