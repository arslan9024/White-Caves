# Seven-Category Architecture Standard & Single Purpose File Law (Canonical)

> **Notice:** Upgraded from 6-Category to the Canonical **7-Category Architecture Standard** separating Tests and Workflows.
> See authoritative definition in [.github/instructions/seven-category-architecture.instructions.md](./seven-category-architecture.instructions.md).

---

## The 7-Way Co-Located Component Standard

Every feature, page, and complex component folder is strictly divided into **7 co-located, single-purpose files**:

```
[FeatureName]/
├── FeatureName.tsx         ← [1. VIEW]      Pure JSX rendering & presentation
├── FeatureName.logic.ts    ← [2. LOGIC]     Custom hooks, state, handlers, business rules
├── FeatureName.styles.ts   ← [3. STYLES]    Styled-components, design tokens, responsive CSS
├── FeatureName.data.ts     ← [4. DATA]      Static registries, options, mock seed lists
├── FeatureName.config.ts   ← [5. CONFIG]    TypeScript interfaces, types, schemas, flags
├── FeatureName.test.tsx    ← [6. TESTS]     Co-located Vitest/Jest unit and interaction tests
└── FeatureName.dnd.ts      ← [7. WORKFLOWS] Autonomous pipelines, drag-and-drop choreography, multi-step orchestration
    (or *.workflow.ts)
```

## Systemic 7-Category Directory Architecture:

1. **Views:** UI components, pages, templates (`src/components/`, `src/pages/`)
2. **Config & Core:** System constants, DLD maps, logger & singletons (`src/config/`, `src/core/`)
3. **State:** Central reactive stores, slices, memoized selectors (`src/store/`, `src/context/`)
4. **Handlers & API:** Express routes, controllers, middleware (`server/routes/`, `src/handlers/`)
5. **Engines & Services:** Deterministic calculation engines, PDF/crypto services (`src/services/`, `server/services/`)
6. **Workflows:** Multi-step pipelines, autonomous workflows, DND choreographies (`src/workflows/`, `*.workflow.ts`, `*.dnd.ts`)
7. **Tests:** Automated test suites, SQA matrices, Vitest / Playwright / Jest verification specs (`tests/`, `*.test.tsx`, `*.spec.ts`)
