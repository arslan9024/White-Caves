# White Caves Real Estate LLC — Project Vision & Corporate Master Plan

> **Canonical governance revision:** 2026-10-24  
> **Authority:** Managing Director Arslan Malik Bashir Ahmad (Level 5)  
> **Formula:** **1 – 12 – 108** (fixed staff) + **≥121 agents** (organised under the same formula)

---

## 🌟 Executive Summary & Strategic Vision

**White Caves Real Estate LLC** is an elite digital asset ecosystem for the Dubai ultra-high-net-worth (UHNW) real estate market. It combines Quiet Luxury aesthetics, high-precision financial algorithms, automated Dubai Land Department (DLD) / RERA compliance, and a full **AEGIS** autonomous operating system.

**Staff structure is fixed.** Agent mesh is organised under the same hierarchy and must remain at **minimum 121 agents** so every department can run and report progress independently.

---

## 🏛️ Corporate Identity & Official Accreditations

- **Corporate Entity:** White Caves Real Estate LLC
- **Managing Director:** Arslan Malik Bashir Ahmad (`arslanmalikgoraha@gmail.com`)
- **Official Portal:** `https://whitecaves.com`
- **DET Commercial License:** `1388443`
- **RERA ORN:** `44483`
- **HQ Ejari:** `0120250814005322` (Office D-72, El Shaye - 4 Building)
- **ICP / MOL Establishment Card:** `2/1/1192499`

---

## 🎨 Design Philosophy & Brand Palette

**High-Density Quiet Luxury** — brand lockdown is mandatory:

| Token | Hex | Use |
|-------|-----|-----|
| White Caves Red | `#EF4444` | Primary accent, CTAs, active states |
| Crisp White | `#FFFFFF` | Light canvas, elevated surfaces |
| Deep Slate | `#0F172A` / `#1E293B` | Dark luxury backdrops, contrast text |

No off-palette colours in product UI. Motion via Framer Motion with reduced-motion respect.

---

## 👥 Fixed Staff Hierarchy: 1 – 12 – 108

| Level | Title | Count | Rule |
|-------|--------|-------|------|
| **5** | Managing Director | **1** | Sovereign authority, capital, system bypass |
| **4** | Department Managers | **12** | One head per department |
| **3** | Supervisors | **108** | **Exactly 9 supervisors per department** (12 × 9) |
| **2** | Junior Agents (human) | Variable | Sales, leasing, off-plan pipelines |
| **1** | Interns & Trainees | Variable | Onboarding |

### The 12 Corporate Departments (fixed)

1. Executive & Architecture  
2. Research Intelligence  
3. Frontend & UX Architecture  
4. Backend & API Systems  
5. Database & Data Pipelines  
6. Security, Compliance & Legal  
7. DevOps & Infrastructure  
8. **Software Quality & Testing (SQA)**  
9. Finance & VAT Analytics  
10. Sales & CRM Operations  
11. Communications & Marketing  
12. Operations & Facility Maintenance  

> **Note:** Department 8 is explicitly the **Software Quality & Testing** domain so testing is owned, measured, and not buried inside generic “Compliance”.

---

## 🤖 Agent Mesh: Organised Under 1 – 12 – 108 (Minimum 121)

- **Do not reduce** the agent roster below **121** total agents.
- Agents are **organised** (not trimmed) so each of the 12 departments has a clear cohort and progress can be tracked separately.
- Recommended layout (minimum):
  - **12** department lead agents (one per department)
  - **108** supervisor-aligned agents (9 per department)
  - **≥1** cross-cutting orchestrator / AEGIS core agent  
  → **≥121** agents total

Additional specialist agents may be added; they must still map to a department and reporting lane.

Full named registry lives in `docs/governance/AGENT_ROSTER_1_12_108.md` and under `.agents/` (organised by department folders).

---

## 🌐 4-Language Universal Accessibility (i18n)

- **English (`en`)** — LTR primary  
- **Arabic (`ar`)** — RTL native UAE  
- **Spanish (`es`)** — LTR international  
- **Russian (`ru`)** — LTR international  

No hardcoded product strings; use locale keys.

---

## 🚀 Architectural Technical Standards (Mandatory)

### 1. Four-Way File Separation — **ALL components**

Every UI component **must** use co-located four-way separation:

```text
ComponentName/
  ComponentName.tsx          # View only (presentation)
  ComponentName.logic.ts     # Behaviour / hooks / state wiring
  ComponentName.style.ts     # Styles / tokens only
  ComponentName.data.ts      # Static copy, maps, constants
```

Enforcement: see `docs/governance/FOUR_WAY_RULE.md` and CI checklist. New or changed components that violate this rule are not mergeable.

### 2. Deterministic state

Redux Toolkit with domain slices and memoized selectors (`createSelector`).

### 3. Quality gates

- `npm run typecheck` → **0** TypeScript errors  
- Unit/integration tests via Vitest (lean, high-value)  
- Critical path E2E via Playwright  
- See `docs/governance/TESTING_POLICY.md`

### 4. Brand & z-index tokens

Only design tokens; no raw hex or ad-hoc z-index in feature code.

---

## 📦 Sibling repositories (retained for future)

| Repo | Role |
|------|------|
| `White-Caves-DB` | Future database / data tooling |
| `white-caves-real-estate` | Future product surface / split deploy |

Do not delete; leave idle until a dedicated milestone activates them.

---

## 🔱 AEGIS

AEGIS is the orchestration layer. **Do not trim** scripts or agents for “simplicity”. **Do organise** lanes, naming, and department ownership so progress is visible per department. See `docs/governance/AEGIS_ORGANISATION.md`.
