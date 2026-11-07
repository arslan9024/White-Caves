# AEGIS V4.1 Governance Laws & Canonical Architecture Standards

> **Authoritative Engineering Law for White Caves Real Estate LLC**  
> **Protocol:** Bhakti Protocol (1 Core Sovereign | 12 Departments | 108 Engineering Nodes)  
> **Dedicated Home:** `.agents/`  
> **Enforcement:** Automated via CI/CD, pre-commit hooks, and AEGIS orchestrator gates.

---

## Law 1: The Canonical 7-Category Architecture Standard

All frontend, dashboard, component, and full-stack feature modules MUST follow the **Canonical 7-Category Architecture Standard**.

### A. Co-Located 7-Way Component Structure

Co-located under each feature or component folder:

| Category              | File Extension                | Responsibility & Restrictions                                                                                              |
| :-------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **1. View**           | `*.view.tsx` or `*.tsx`       | Pure presentational rendering and JSX layout. Zero complex business calculations. Zero direct external API calls.          |
| **2. Logic**          | `*.logic.ts`                  | Custom React hooks, business state, handler callbacks, form submission, and event logic. Zero JSX/DOM rendering.           |
| **3. Styles**         | `*.styles.ts`                 | Tailwind CSS class string maps, design token bindings, Framer Motion variants, and color constants. Zero logic.            |
| **4. Data**           | `*.data.ts`                   | Static data records, mock fallback fixtures, table column configurations, initial option lists. Pure data structures only. |
| **5. Config / Types** | `*.config.ts` or `*.types.ts` | TypeScript interfaces, Zod schemas, route metadata, feature flags, and environment constants.                              |
| **6. Tests**          | `*.test.tsx` or `*.spec.ts`   | Co-located Vitest/Jest unit, interaction, and component specs. SQA verification matrices.                                  |

### B. Systemic 7-Category Directory Architecture

Every file in the repository belongs to one of the 7 canonical functional categories:

1. **VIEWS:** Pure rendering & UI (`src/components/`, `src/pages/`, `src/templates/`)
2. **CONFIG & CORE:** System constants, DLD maps, logger & service singletons (`src/config/`, `src/constants/`, `src/core/`)
3. **STATE:** Central reactive store, Redux / Zustand slices, memoized selectors (`src/store/`)
4. **HANDLERS & API:** Event bridges, REST routes, controller routers (`server/routes/`, `src/handlers/`)
5. **ENGINES & SERVICES:** Pure computational logic, financial calculators (`src/services/`, `server/services/`, `src/engines/`)
6. **WORKFLOWS & TESTS:** I-P-O-V state pipelines, SQA test matrices (`src/workflows/`, `tests/`)

---

## Law 2: The Single Purpose File Law & 350-Line Hard Ceiling

1. **Maximum File Size:** No file in the codebase may exceed **350 lines of code** (excluding generated vendor locks).
2. **Single Responsibility:** Every file must have exactly one reason to change.
3. **Automatic Splitting Protocol:**
   - When a component view approaches 300 lines, extract its sub-sections into co-located child components (`Header.view.tsx`, `Grid.view.tsx`, `Footer.view.tsx`).
   - When business logic exceeds 300 lines, split into specialized hooks (`useFilterState.ts`, `useSyncDriver.ts`).
   - When styles exceed 300 lines, split into modular token sheets.

---

## Law 3: Zero Ghost Mirror Directory Law

1. **Monolith Single Source of Truth:** All agent specifications, prompt templates, subagent registries, and orchestrator scripts MUST reside strictly in `.agents/`.
2. **Permanent Prohibition:** Ghost mirror directories outside `.agents/` (such as `aegis/`, `business/`, `codebase/`, `scratch/`) are strictly forbidden and pruned automatically.
3. **Directory Ownership:**
   - `.agents/aegis-engineering/`: All 12 software engineering departments and 108 nodes.
   - `.agents/zoe-business-assistants/`: All 12 real estate corporate business departments.
   - `.agents/orchestrator/`: Canonical orchestrator engines, runners, and schemas.
   - `.agents/skills/`: Reusable specialized agent skill folders.
   - `.agents/scripts/`: Operational dev, SQA, and deployment scripts.

---

## Law 4: Token Preservation Shield (Aegis V4.1)

1. **15,000 Token Ceiling:** Tasks must be scoped to complete within a strict 15,000 token context window.
2. **Child-Slice Anti-Explosion Filter:** Batch related child tasks into single parent execution prompts, eliminating 70%+ redundant prompt context.
3. **Deterministic Local AST Execution:** Formatting, linting, imports, and trivial adjustments must be executed with local scripts with zero LLM API calls.
4. **Minimal Context Loading:** Load only the active wave bundle and required file definitions into prompt buffers.

---

## Law 5: Zero-Backlog Law & Branch Lifecycle SOP

1. **Zero Open Sprint Blockers:** All pull requests and issues within an active wave must be resolved before advancing.
2. **Automated Review Thread Resolution:** Open bot comments are automatically resolved via `aegis-unblock-pr.js`.
3. **Linear Rebase & Prune:** Feature branches must be merged into `main` and pruned from both local and remote immediately. Only `main` exists as the permanent tracking branch.

---

## Automated Verification Commands

```bash
# Verify 7-category co-location & file size limits:
node .agents/orchestrator/check-five-way-and-file-limits.js

# Verify AEGIS health & policy compliance:
npm run aegis:health

# Verify deduplication status:
npm run aegis:dedup

# Verify TypeScript compilation:
npm run typecheck
```
