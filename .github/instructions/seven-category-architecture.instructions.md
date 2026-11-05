# Seven-Category Architecture Standard & Single Purpose File Law

> **Canonical Architecture Rule — White Caves Real Estate LLC**  
> Enforced across all domains, features, pages, components, and server architectures.

---

## 1. The 7-Way Co-Located Component Standard

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

### Layer Definitions & Responsibilities

| Layer                 | File Pattern                                   | Allowed Content                                                                                                 | Strictly Forbidden Content                                            |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **1. View**           | `*.tsx` / `*.view.tsx`                         | JSX markup, semantic HTML, layout composition                                                                   | Inline business logic, direct network fetches, raw style declarations |
| **2. Logic**          | `*.logic.ts` / `use*.ts`                       | Custom React hooks (`useState`, `useMemo`), handlers, calculations                                              | JSX markup, DOM styling, hardcoded static lists                       |
| **3. Styles**         | `*.styles.ts`                                  | Styled-components, CSS variables, Tailwind maps, `@media` queries                                               | State hooks, API calls, business logic                                |
| **4. Data**           | `*.data.ts` / `*.registries.ts`                | Static arrays, dropdown options, lookup maps                                                                    | Runtime state hooks, side-effects, mutable data                       |
| **5. Config / Types** | `*.config.ts` / `*.types.ts`                   | TypeScript `interface`, `type`, Zod schemas, feature flags                                                      | Component rendering, hooks, side-effects                              |
| **6. Tests**          | `*.test.tsx` / `*.spec.ts`                     | Vitest / Jest unit tests, user interaction tests, SQA matrices                                                  | Production business code, exports consumed outside testing            |
| **7. Workflows**      | `*.workflow.ts` / `*.dnd.ts` / `*.pipeline.ts` | Multi-step user journeys, drag-and-drop choreography, autonomous execution pipelines, and transaction workflows | Raw DOM rendering, direct database connection strings                 |

---

## 2. The 7-Category Systemic Directory Architecture

All production files in the repository belong strictly to one of the 7 functional architectural categories:

|         Category          | Type & Role                    | Canonical Locations                                           | Invariant Constraints                                                                                      |
| :-----------------------: | :----------------------------- | :------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------- |
|       **1. VIEWS**        | Pure Rendering & UI            | `src/components/`, `src/pages/`, `src/templates/`             | Built via design system primitives; zero business math; zero raw regex; zero direct API calls.             |
|   **2. CONFIG & CORE**    | Constants, Regs & Shared Core  | `src/config/`, `src/constants/`, `src/core/`                  | Frozen immutable constants; DLD coordinate maps; theme tokens; logger & service singletons.                |
|       **3. STATE**        | Central Reactive Store         | `src/store/`, `src/context/`                                  | Pure Redux Toolkit / Zustand slices; memoized selectors (`createSelector`); immutable state mutations.     |
|   **4. HANDLERS & API**   | Event Bridges & REST Routing   | `server/routes/`, `src/handlers/`, `server/api/`              | Schema validation on ingestion; dispatches intentions to workflows or state; formats API output.           |
| **5. ENGINES & SERVICES** | Pure Computational Logic       | `src/services/`, `server/services/*Engine.ts`, `src/engines/` | Deterministic, pure functions `input -> output`; zero DOM; zero side-effects; 100% unit-tested.            |
|     **6. WORKFLOWS**      | State Machines & Pipelines     | `src/workflows/`, co-located `*.workflow.ts`, `*.dnd.ts`      | Enforces the Universal 4-Stage **I-P-O-V** pipeline; drag-and-drop orchestration; multi-step transactions. |
|       **7. TESTS**        | SQA Test Matrices & Automation | `tests/`, co-located `*.test.ts(x)`, `*.spec.ts`              | Vitest / Jest / Playwright test suites, boundary validations, SQA verification gates.                      |

---

## 3. The Universal 4-Stage Engine Pattern (I-P-O-V)

Every business workflow and calculation engine adheres to the **I-P-O-V** pipeline:

```mermaid
flowchart LR
    I["Stage 1: Input\n(Schema & Ingestion Guard)"] --> P["Stage 2: Processing\n(Idempotent Business Rules)"]
    P --> O["Stage 3: Output\n(Artifact & Vault Persistence)"]
    O --> V["Stage 4: View\n(UI Notification & State Sync)"]
```

1. **Stage 1 (Input):** Validates and normalizes parameters using schemas. Invalid inputs are rejected before processing.
2. **Stage 2 (Processing):** Executes business rules deterministically. Pure business operations without UI side-effects.
3. **Stage 3 (Output):** Generates immutable result payload, logs to audit trail / vault, and prepares persistence.
4. **Stage 4 (View):** Dispatches resulting state to reactive UI views, toast notifications, and event subscribers.

---

## 4. The Single Purpose File Law (Hard Ceiling: 350 Lines)

1. **One Responsibility:** Every file has exactly one clear reason to change.
2. **Strict 350-Line Hard Ceiling:** No file in the repository may exceed **350 lines of code** (excluding generated package locks).
3. **Automated Decomposition Trigger:** When a file approaches 300 lines:
   - Views must be extracted into co-located child components (`Header.view.tsx`, `Grid.view.tsx`).
   - Complex logic must be split into sub-hooks or helper workflow choreographies (`*.dnd.ts`, `*.workflow.ts`).
   - Large styles must be split into dedicated modular token sheets.
