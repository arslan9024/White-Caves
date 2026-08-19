# AEGIS 2.0 Planning Governance & 90% Readiness Standard

**Version:** 2026.08-AEGIS-V4-chronicle-tips  
**Control Plane Policy:** `scripts/orchestrator/policy.json`  
**Governance Authority:** Executive Council (@Ada, @Margaret, @Grace, @Elena, @Zoe)  
**Last Updated:** 2026-07-27

---

## 🛡️ The 90% Readiness Checkpoint Framework (Immutable Law)

Under AEGIS 2.0 operational rules, **no AI sub-agent or implementation agent is permitted to write or modify application code (.ts, .tsx, .css)** until the target feature or module achieves the **90% Readiness Gate**.

```
[Phase 1: Free Agent Planning]
          │
          ▼
[90% Readiness Checkpoint Audit] ──► [Unmet (<90%)] ──► [Route to Free Agents for Expansion]
          │
          ├────────────────────────┐
          ▼ (≥90% Passed)          ▼
[Dual Threshold Unlock (60%)]  [Target Readiness (90%)]
          │                        │
          └───────────┬────────────┘
                      │
                      ▼
[Executive Council (@Ada) Sign-Off]
                      │
                      ▼
[Phase 2: Premium Implementation Coding Sprint]
```

---

## 📋 The 6-Point Readiness Criteria

Before any code modification turn, the following six criteria must be documented on disk within `plans/` or `business_docs/`:

1. **Target File Paths Defined**: Exact relative file paths for all new or modified components, hooks, styles, and routes.
2. **TypeScript Interface & Schema Definitions**: Complete type contracts, props, state objects, and database models.
3. **Component Hierarchy & Layout Wireframes**: Visual ASCII wireframes detailing container bounds, flex grids, and styling tokens.
4. **Corporate Brand Palette Token Mapping**: Explicit binding to White Caves Red (`#EF4444`) for primary success badges, active menu highlights, and buttons; Brilliant Crisp White (`#FFFFFF`) for backdrop canvas; and Deep Slate Gray (`#1E293B`) for typography. Deprecates emerald, gold, or dark obsidian schemes.
5. **Mock & Synthetic Data Fallbacks**: Direct alignment with `src/mocks/dubaiRealEstateMocks.ts` and `src/mocks/dubaiFinanceEngine.ts`.
6. **Acceptance Criteria & Test Matrix**: Quantitative testable definitions for pass/fail verification via `npm run build` and unit test specs.

---

## ⚖️ Executive Clearance Matrix

| Clearance Level          | Role Class                                   | Permission Boundary                                      | Gate Gatekeeper |
| ------------------------ | -------------------------------------------- | -------------------------------------------------------- | --------------- |
| **Level 5 (Master)**     | Founder & MD (`arslanmalikgoraha@gmail.com`) | Unrestricted administrative bypass, instant profile land | Auto-injected   |
| **Level 4 (Dept Head)**  | CSO, VP Sales, Finance Director              | Full department modification & transaction sign-off      | @Ada Sign-Off   |
| **Level 3 (Power User)** | Senior Brokers, Account Directors            | Managed record mutations & pipeline updates              | Standard RBAC   |
| **Level 2 (Restricted)** | Mid Brokers, Coordinators                    | Assigned record view/edit only                           | Standard RBAC   |
| **Level 1 (Read Only)**  | Interns, External Vendors                    | Public portfolio metrics & read-only views               | Standard RBAC   |

---

## 🔄 Anti-Wastage & Context Preservation Rules

- **Single-File Isolation**: Edits during code implementation turns must target ONLY the precise file assigned. Global re-scans are strictly prohibited.
- **Zero-Token Local Verification**: All syntax, linting, and type checking MUST be executed locally on the machine via `npm run build`.
- **Deduplication Enforcement**: Any redundant navigation layout, duplicate component, or conflicting style file MUST be shredded immediately upon discovery.

---

## 🔁 5. The 6-Stage RUP Operational Cycle (Absolute Engineering Law)

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 1_ANALYZE_GAP   ├───►│ 2_RESEARCH_BEST  ├───►│ 3_PLAN_Backlog   │
│ (Gemini)        │    │ (Gemini)         │    │ (Gemini)         │
└─────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                        │
┌─────────────────┐    ┌──────────────────┐             │
│ 6_REMOTE_SYNC   │◄───┤ 5_LOCAL_VALIDATE │◄────────────┘
│ (Git Engine)    │    │ (Laptop CPU)     │  4_CODE_REFACTOR (Claude)
└─────────────────┘    └──────────────────┘
```

| Cycle Stage | Execution Engine | Algorithmic Directive | Token Preservation Rule |
|---|---|---|---|
| **`1_ANALYZE_GAP`** | Gemini | Scan codebase locally to compare actual frontend component state against `software_docs/` functional requirements specifications | Zero-overhead local static folder comparison |
| **`2_RESEARCH_BEST`**| Gemini | Perform deep search query sweeps across global SaaS and Dubai real estate frameworks to pull latest design layouts | Filter out conversational padding text |
| **`3_PLAN_Backlog`** | Gemini | Dynamically rewrite `plans/PENDING_TASKS_ONLY.md` adding itemized wireframe constraints and RUP use cases before touching code files | Immutable disk state snapshot preservation |
| **`4_CODE_REFACTOR`**| Claude | Execute surgical Single-File Isolation refactors using the 3-folder component split (`.tsx` View \| `.logic.ts` Hook \| `.style.ts` Style) | Omit truncated blocks or incomplete stubs |
| **`5_LOCAL_VALIDATE`**| Laptop CPU | Execute local machine build verification gates: `npm run build` and verify hot-reloading stability via `nodemon` thread | 0-token loop termination on compilation errors |
| **`6_REMOTE_SYNC`** | Git Engine | Run `git checkout main` ➔ `git pull origin main` ➔ `git checkout develop` ➔ `git rebase main` ➔ `git merge develop` ➔ `git push origin main` | Automated secure deployment webhook firing |

---

## 🤖 6. AEGIS 2.0 Autopilot 100-Turn Orchestration Core Protocol

```
business_docs/ ➔ software_docs/ ➔ plans/ ➔ aegis/
```

- **Target Total Loops**: 100 Continuous Autopilot Turns.
- **Dry-Run Prevention**: Forced global codebase gap scan across `/src` and `/server` whenever backlog items complete.
- **Deduplication Law**: Continuous deduplication across views, logic, styles, and docs. All redundant stubs are shredded immediately.
- **Single-File Isolation**: View (`.tsx`), Logic (`.logic.ts`), Style (`.style.ts`), and Dictionary (`locales/en.json` & `ar.json`).
- **Level 5 God-Mode**: Unrestricted administrative bypass for `arslanmalikgoraha@gmail.com` / `the.white.caves@gmail.com` unmasking the `[Managing Director Hub]` sidebar group.


---

## 📋 7. Chronicle Tips — Applied 2026-08-18

> From `/chronicle tips` pattern analysis of 31 sessions. Follow these rules every session.

**Rule 1 — No `--no-verify` commits.** Fix the root cause (lint/CSS/build error) instead. Consult `docs/plans/SESSION_TIPS_2026-08-18.md`.

**Rule 2 — Always use a named branch.** Convention: `copilot/wave-NN-<feature-slug>`. Never commit directly to `main` or `develop`.

**Rule 3 — Batch `plans/` edits into one session.** All related plan files for a wave must be updated together via the `Planner` agent.

**Rule 4 — Co-generate tests with source files.** Use the `QA` agent to scaffold tests at the same time as source creation.

**Rule 5 — Start every session with progress intel.** Run `npm run orchestrator:progress:intel:brief` first. See `docs/plans/SESSION_START_CHECKLIST.md`.

**Rule 6 — Delegate doc conflicts to the Architect agent.** Planning file conflicts go to `Architect`. `package-lock.json` conflicts: run `npm install` fresh.

**Rule 7 — Tag completed waves before merging to main.** Run `git tag wave-NN-complete` and update `docs/plans/DEPLOYMENT.md`.

Policy machine-readable enforcement: `aegis/orchestrator/policy.json` → `mergePolicy`, `waveTagging`, `sessionStart`.
