# ADR-007: Design Token System & Theme Architecture

**Status:** Accepted  
**Date:** 2026-03-31  
**Deciders:** Platform Team  

## Context

The platform UI uses styled-components and needs:

- Consistent branding (RED #E31E24 primary, GOLD #D4AF37 accent)
- Dark/light mode support
- Accessible color contrast (WCAG 2.1 AA)
- Team-wide enforcement of brand standards

Early development used hardcoded hex values across components and config files. A brand refresh (from green to red+gold in 2026) required touching 100+ files.

## Decision

Implement a **centralised design token system** at `src/styles/theme/`.

### Token files (8 modules)

| Token File | Exports | Token Count |
|---|---|---|
| `colors.ts` | colours, departments, badges, roles, status, dark mode | 90+ |
| `typography.ts` | font families (5), sizes (10), weights (6), line heights (5) | 26+ |
| `spacing.ts` | 8px base grid, xs→xxxl | 7 |
| `radius.ts` | border radii 2px→16px + pill/full | 8 |
| `shadows.ts` | 6 elevation levels + interactive states | 10 |
| `zIndex.ts` | 41 named z-index levels | 41 |
| `breakpoints.ts` | mobile, tablet, desktop, desktopMd | 4 |
| `transitions.ts` | duration + easing + keyframes | 10+ |

### Combined theme export

```typescript
// src/styles/theme/index.ts
export const theme = {
  colors, spacing, radius, typography, fonts,
  zIndex, breakpoints, mediaQueries, shadows,
  transitions, keyframes,
};
```

### Usage patterns

**Styled-components (theme prop):**
```typescript
font-family: ${props => props.theme.typography.fontFamily.heading};
color: ${props => props.theme.colors.primary};
```

**Direct import (config files):**
```typescript
import { colors } from '../styles/theme/colors';
color: colors.badges.blue;
```

### Enforcement

- `statusConfig.ts` — All 50+ badge colours → `colors.badges.*`
- `roles.ts` — All 24 role colours → `colors.roles.*`
- Font-family — All styled-component files → `typography.fontFamily.*`
- CSS variable fallbacks (e.g., `var(--font-heading, ...)`) acceptable for non-styled-component CSS

### Font families defined

| Token | Value | Use Case |
|---|---|---|
| `primary` | Inter, Segoe UI, Roboto | Body text, inputs, buttons |
| `heading` | Poppins, Inter, Segoe UI | Headings, logos, nav |
| `mono` | JetBrains Mono, Fira Code | Code blocks, timestamps |
| `serif` | Georgia, Times New Roman | Decorative quotes |
| `system` | -apple-system stack | System-native UI |

## Consequences

### Positive
- Brand refresh requires updating only `colors.ts` — cascades to all components
- Dark mode ready (separate dark colour palette included)
- WCAG contrast can be validated once per token, not per-component
- New components get consistent styling automatically

### Negative
- Config files (statusConfig, roles) use direct imports, not ThemeProvider
- CSS variable files (VirtualTourGallery, DubaiMap, etc.) use fallback pattern — not fully integrated
- `assistantRegistry.ts` still has some hardcoded colours (lower priority)

## Files
- `src/styles/theme/` — All 8 token files + index
- `src/config/statusConfig.ts` — Migrated to `colors.badges.*`
- `src/config/roles.ts` — Migrated to `colors.roles.*`
- 9 styled-component files — Migrated to `typography.fontFamily.*`
