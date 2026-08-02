# 🔱 White Caves Real Estate — Core Engineering Manifest & RUP Software Framework

**Document Class:** Immutable Constitutional Standard  
**Version:** 2026.07-RUP-V1  
**Authority:** @Ada (Chief Architect) + @Grace (CTO)  
**Scope:** All code, documentation, autonomous agent workflows, and agentic orchestration sessions  
**Last Updated:** 2026-07-29  
**Hierarchy Position:** `software_docs/` → Architecture-Sovereign (reads `business_docs/`, governs `plans/`)

---

## 🏛️ 1. Rational Unified Process (RUP) Engineering Framework

White Caves strictly follows a tailored Rational Unified Process (RUP) methodology. Software development is systematically executed across four disciplined phases. **Premature code generation is strictly prohibited** before Elaboration gate passage.

### Phase 1 — Inception (Scope Allocation)

Define the functional boundaries of the target feature. Business logic must be documented entirely within `/business_docs/` before software architecture mapping begins.

**Deliverables required before exit:**
- [ ] Feature scope statement in `business_docs/` (1–2 pages max)
- [ ] Identified actors, triggers, and outcome expectations
- [ ] Confirmed non-overlap with existing components (deduplication check)
- [ ] Entry in `plans/PENDING_TASKS_ONLY.md` with Task ID assigned

### Phase 2 — Elaboration (The 90% Readiness Gate)

Forensic definition of file paths, TypeScript types, data contracts, and local fallback mocks. **Coding tasks are strictly barred until requirements reach a verified 90% completion mark.**

**Deliverables required before exit:**
- [ ] SDD entry created in `software_docs/01_sdd/`
- [ ] Use case written in `software_docs/02_use_cases/`
- [ ] All TypeScript interfaces defined (no `any` types permitted)
- [ ] Prisma schema fields confirmed or mock data contracts written
- [ ] @Ada readiness sign-off: `Context Ready (90%) — Coding Phase Approved`

### Phase 3 — Construction (Isolated Implementation)

Surgical code block creation following the Single-File Isolation rule. Sub-agents must write production-ready code with **no truncation markers, ellipses, or placeholder comments**.

**Active laws:**
- **Single-File Isolation:** Load and edit ONLY the precise target file assigned to the active turn. Global repository re-scans on subsequent loops are banned.
- **The 3-Turn Short Circuit:** If an agent takes more than 3 consecutive turns resolving a single compilation error, it must abort, dump the console error trace into `plans/COMPILER_ERRORS.txt`, and yield to the developer.
- **No Dead Code:** All written code must be consumed. Unused imports, unused variables, and orphaned functions are prohibited per the AEGIS Continuous Deduplication Law.

### Phase 4 — Transition (Zero-Token Quality Verification)

Native local compilation runs (`npm run build`) to clear linter errors before deploying to production hooks.

**Exit sequence (must be executed in order):**
1. `npm run build` → Exit code `0` required
2. `git checkout develop` → `git add .` → `git commit -m "aegis/…"` → `git checkout main` → `git pull origin main --rebase` → `git merge develop` → `git push origin main`
3. Log entry added to `plans/DAILY_MILESTONE_TRACKER.md`
4. `plans/PENDING_TASKS_ONLY.md` task marked `✅ Complete`

---

## 💻 2. Canonical Technology Stack Specification

The platform environment is locked to this high-performance core framework. **Utilizing unapproved dependencies or alternative styling structures is strictly prohibited.**

| Layer | Technology | Constraint |
|---|---|---|
| **Frontend Engine** | React 19 + Vite | Functional components with hooks; no class components |
| **Design Tokens** | Vanilla CSS + CSS Variables | Strict brand palette variables; Tailwind utility permitted for layout only |
| **Component Isolation** | Styled-Components | For interactive widgets requiring scoped animations only |
| **State Management** | Redux Toolkit | Centralized single-source-of-truth slice architecture |
| **Backend Runtime** | Node.js + Express (TypeScript) | All routes must be `.ts`; legacy `.js` routes must be migrated |
| **Database ORM** | Prisma Client Singleton | Configured for MongoDB Atlas; strict transaction handling |
| **Auth Layer** | Firebase Auth + Custom RBAC | 5-level access control; JWT token lifecycle managed by `server/middleware/auth.ts` |
| **Dev Watcher** | Nodemon | Background hot-reload; config in `nodemon.json` |
| **PDF Generation** | `pdf-lib` | Approved only for import report exports |
| **Build Tool** | `npm run build` (Vite) | Absolute quality gate; `--max-old-space-size=4096` required |

---

## 🎨 3. The Color Lockdown (Non-Negotiable Brand Palette)

```
┌─────────────────────────────────────────────────────────┐
│  WHITE CAVES CORPORATE PALETTE — IMMUTABLE              │
├──────────────────┬──────────────────┬───────────────────┤
│  White Caves Red │  Brilliant White │  Deep Slate Gray  │
│     #EF4444      │     #FFFFFF      │     #1E293B       │
│  Primary CTAs    │  Background      │  Body Text        │
│  Active States   │  Card Canvases   │  Structural Bdr   │
│  Brand Badges    │  Modal Overlays  │  Headers          │
└──────────────────┴──────────────────┴───────────────────┘
```

**Absolutely banned colors:** Emerald Green, Metallic Gold (#FFD700), Obsidian Dark, Navy Blue, Purple, Pink. Any component referencing these colors must be immediately refactored.

---

## 🧹 4. Institutional Code Hygiene & Deduplication Laws

### The Singular Component Principle
Only **one global version** of any interface component may exist across the repository. Duplicate navigations, duplicate cards, and duplicate modal dialogs must be shredded. The canonical shared component library lives at `src/components/shared/`.

### Atomic Shared Reusability Standard
Core elements must be built as stateless functional components:
- `<CavesButton>` — `src/components/shared/CavesButton.tsx`
- `<CavesInput>` — `src/components/shared/CavesInput.tsx`
- `<CavesCard>` — `src/components/shared/CavesCard.tsx`
- `<CavesModal>` — `src/components/shared/CavesModal.tsx`
- `<CavesBadge>` — `src/components/shared/CavesBadge.tsx`

### Content and Text Separation Law
Hardcoding raw text strings into page layouts is strictly forbidden. All copy variables must reside in localized translation sheets:
- `src/locales/en.json` — English (primary)
- `src/locales/ar.json` — Arabic (secondary, RTL layout required)

### TypeScript Strictness Law
- `any` type is **banned** across all `.ts` and `.tsx` files
- Permissible alternatives: `unknown`, `Record<string, unknown>`, precise interfaces
- All function parameters must have explicit types
- All exported functions must have explicit return types

### Pure Logic Decoupling
Heavy dataset calculations, multi-currency reductions, and analytical counters must be offloaded from view layers into:
- Custom hooks: `src/hooks/useWorkspaceEngine.ts`, `src/hooks/useDashboardMetrics.ts`
- Finance engine: `src/mocks/dubaiFinanceEngine.ts`
- Utility layer: `src/utils/`

---

## 🤖 5. Autonomous Agentic Workflow Governance

### The Hybrid Task Division Model
- **Context-wide structural analysis:** Use Gemini (large context window) for repository scans, deduplication checks, and architectural reviews
- **Surgical code implementation:** Use Claude (high precision) for single-file isolated edits
- **Planning & documentation:** Use Gemini Flash (free tier) for business doc expansion and plan updates

### AEGIS Budget Guard Laws
| Rule | Specification |
|---|---|
| **Global Scan Blockade** | Running global repository re-scans on subsequent task loops is banned |
| **Single-File Isolation** | Load and edit ONLY the precise target file for the active turn |
| **3-Turn Short Circuit** | Abort after 3 failed consecutive fix attempts; dump errors to `plans/COMPILER_ERRORS.txt` |
| **Token Budget Cap** | No session may exceed 500 lines of diff per turn |
| **Plan-First Mandate** | No premium coding turn begins without a documented task in `plans/PENDING_TASKS_ONLY.md` |

### AEGIS 12-Target Autopilot Law
Every autopilot cycle must identify and resolve exactly **12 critical targets** across the codebase. Targets must be diversified: max 4 per category (Frontend, Server, Tests, Security). The scanner runs via `npm run aegis:autopilot:top12`.

### Production Sync Pipeline (Automated)
```bash
git checkout develop
git add .
git commit -m "aegis/<module>: <description>"
git checkout main && git pull origin main --rebase
git merge develop && git push origin main
```

---

## 🔗 Inter-Linked Navigation References

- [Database Design](./02_software_design/database_architecture_sdd.md) — Core database schema, Prisma singleton connection, and MongoDB index topology.
- [Navigation Map](./04_flowcharts/universal_navigation_map.md) — ASCII visual interaction maps tracing user routing and canvas views.

---

## 📂 6. The Three-Folder Knowledge Hierarchy

```
White Caves Repository
├── business_docs/          ← BUSINESS LAYER (RERA, DLD, Workflows, CRM Features)
│   ├── 01_company/         Org structure, agent roles, commission policy
│   ├── 02_products/        Property types, off-plan developer matrix
│   ├── 04_workflows/       Lead lifecycle, tenancy, leasing playbooks
│   ├── 05_requirements/    Compliance, RERA 2024, UAE PDPL
│   └── 09_crm_features/    Financial reporting, analytics dashboards
│
├── software_docs/          ← ARCHITECTURE LAYER (SDDs, Use Cases, Flowcharts)
│   ├── 01_sdd/             Database topology, RBAC state machine
│   ├── 02_use_cases/       Lead ingestion, commission ledger, auth flows
│   ├── 03_flowcharts/      Universal navigation map, finance approval stepper
│   └── adr/                Architecture Decision Records
│
└── plans/                  ← ROADMAP LAYER (Tasks, Milestones, History)
    ├── MASTER_PLAN.md       Phase architecture and wave roadmap
    ├── PENDING_TASKS_ONLY.md Active backlog with Task IDs
    ├── DAILY_MILESTONE_TRACKER.md Session-by-session log
    └── COMPILER_ERRORS.txt  Build failure dump (3-turn short circuit output)
```

**Reading order for any agent initialization:**
1. Read `plans/MASTER_PLAN.md` → understand current wave and phase
2. Read `plans/PENDING_TASKS_ONLY.md` → identify active task
3. Read relevant `software_docs/` SDD or use case → understand architecture
4. Read relevant `business_docs/` section → understand domain rules
5. Execute single-file isolated code change → run `npm run build`

---

## 🔐 7. RBAC Security Architecture Summary

| Access Level | Role | Dashboard Entry Point | Permissions |
|---|---|---|---|
| **Level 5 — Master** | Managing Director (`arslanmalikgoraha@gmail.com`) | `ExecutiveFlightDeckView` | All departments, all data, impersonation |
| **Level 4 — Director** | Department Head | Department-specific flight deck | Own department + reports |
| **Level 3 — Senior** | Senior Broker / Team Lead | Broker dashboard + team metrics | Own leads + team KPIs |
| **Level 2 — Standard** | Broker / Agent | Standard broker dashboard | Own leads and pipeline only |
| **Level 1 — Client** | Property Buyer / Tenant | Client portal | Own listings, contracts, viewings |

**Founder Short-Circuit:** Profile `arslanmalikgoraha@gmail.com` is force-injected with `accessLevel: 5` (`LEVEL_5_MASTER`), bypassing all RBAC gates and landing directly on the Managing Director Executive Flight Deck.

---

## ✅ 8. RUP Readiness Gate Checklist

Before any Construction phase begins, the following must all be checked:

```
[ ] business_docs/ entry exists for the feature domain
[ ] software_docs/01_sdd/ SDD entry exists with data contracts
[ ] software_docs/02_use_cases/ use case written with step sequences
[ ] All TypeScript types defined (no any permitted)
[ ] Prisma schema fields confirmed or mock data contracts in place
[ ] plans/PENDING_TASKS_ONLY.md Task ID created and assigned
[ ] @Ada readiness sign-off logged: "Context Ready (90%) — Coding Phase Approved"
[ ] npm run build exits with code 0 on current codebase
```

---

*This manifest is constitutional. No agent, sub-agent, or developer may override its provisions without explicit written approval from @Ada and logged in `plans/MASTER_PLAN.md` under a version bump.*
