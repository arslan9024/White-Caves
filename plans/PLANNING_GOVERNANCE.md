# AEGIS 2.0 Planning Governance & 90% Readiness Standard

**Version:** 2026.07-AEGIS-V2  
**Control Plane Policy:** `scripts/orchestrator/policy.json`  
**Governance Authority:** Executive Council (@Ada, @Margaret, @Grace, @Elena, @Zoe)

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
4. **Quiet Luxury Design Token Mapping**: Explicit binding to Obsidian Dark (`#0f0f0f`), Metallic Gold (`#C9A84C`), and Emerald Green (`#10B981`).
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
