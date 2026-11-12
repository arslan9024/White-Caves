---
description: 'UI Component Single Purpose & Hierarchy Law (TURING-RULE-008) for White Caves'
applyTo: 'src/components/**,src/pages/**,src/features/**'
---

# UI Component Hierarchy Instructions (TURING-RULE-008)

Companion to the Seven-Category Architecture Standard
(`./seven-category-architecture.instructions.md`). Mechanically enforced by
`scripts/validate-structure.mjs` and the Turing audit rules
(`.agents/aegis/core-loop/turingRules.ts`).

The mechanical gate covers dependencies, naming, frozen-directory paths and
per-file size regressions. Presentation purity, single responsibility and
appropriate primitive reuse additionally require code review; a green count
ratchet alone does not establish architectural compliance.

## 1. Single purpose per view file

- **Exactly one exported component per view file.** Helper subcomponents either
  get their own co-located `*.view.tsx` file or do not exist.
- View files contain JSX composition only: no business math, no raw fetches,
  no inline styled-component definitions beyond trivial wrappers.

## 2. 7-way co-location (components with logic)

```
ComponentName/
├── ComponentName.tsx          ← view (pure JSX)
├── ComponentName.logic.ts     ← hooks, handlers, business rules
├── ComponentName.styles.ts    ← styled-components, tokens
├── ComponentName.data.ts      ← static registries/options (when needed)
├── ComponentName.config.ts    ← types, schemas, flags (when needed)
├── ComponentName.test.tsx     ← co-located tests
└── ComponentName.workflow.ts  ← multi-step orchestration (when needed)
```

Trivial leaf components (pure presentation, no state) may be a single `.tsx`
file, but split on the first hook or handler.

## 3. Canonical hierarchy — exactly four homes

| Home                       | Contents                                                                        |
| -------------------------- | ------------------------------------------------------------------------------- |
| `src/components/ui/`       | Design-system primitives only (Button, Badge, Card, Modal, SearchableSelect, …) |
| `src/components/shared/`   | Cross-domain composites built from primitives                                   |
| `src/components/<domain>/` | Domain-owned components (`crm/`, `portal/`, `homepage/`, `dashboard/`, …)       |
| `src/pages/`               | Route-level composition only                                                    |

- **Frozen:** `src/components/common/` and `src/components/molecules/` accept
  no new files. Their contents migrate into the four homes whenever a
  touch-refactor reaches them.
- Feature modules under `src/features/<feature>/components/` follow the same
  co-location rules as domain folders.

## 4. Language and size

- New UI files are **`.tsx` with strict TypeScript** — never `.jsx`
  (TURING-RULE-009). Converting a `.jsx` file you are already refactoring is
  mandatory.
- 350-line hard ceiling per file; decompose at 300 (Single Purpose File Law).
- Never create a same-basename `.jsx`/`.tsx` twin (TURING-RULE-007); the twin
  that loses module resolution becomes invisible dead code.

## 5. Styling and libraries

- Styling: styled-components in `*.styles.ts` using tokens from
  `src/styles/theme/` only. Brand palette is locked: White Caves Red `#EF4444`,
  Crisp White `#FFFFFF`, Deep Slate `#1E293B`.
- **Component frameworks are banned** (Chakra, MUI, Ant, Bootstrap, …): this
  project extends its own design system. Headless primitives (Radix, React
  Aria) are the only admissible additions, and only when building the behavior
  well in-house is impractical — requires an ADR note.
- Reuse existing design-system components before authoring new ones.

## 6. Required UX states

Every data-driven surface ships loading, error, and empty states, preserves
accessibility semantics (roles, labels, keyboard flow), and uses the shared
`BackendStatusBanner`/`fetchWithRetry` resilience utilities where backend
availability matters.
