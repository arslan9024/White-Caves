# White Caves Real Estate LLC — Pending Tasks & RUP System Ledger

> **System Version:** 2.0.26  
> **Last Updated:** 2026-08-07  
> **Active Stream:** `MASTER_PLAN.md`  
> **Active Wave Bundle:** Wave 31 (Corporate credentials & compliance automation)  
> **Engineering Model:** Rational Unified Process (RUP)  
> **Hierarchy:** 1 Managing Director (Arsalan Malik) | 12 Department Managers | 108 Supervisors  
> **Brand Palette:** Red (`#EF4444`) | White (`#FFFFFF`) | Slate (`#1E293B`)  
> **Forbidden Colors:** Emerald Green | Metallic Gold | Obsidian Black  
> **Build Gate Status:** 0-Token Local Machine Compilation Checks via `npm run build` & `npm run next:build` (PASSED)

---

## 🏛️ Master Company Credentials Ledger (`src/mocks/companyMasterLedger.json`)

| Document Type    | Document No.       | Issue Date | Expiry Date | 90-Day Alert | 30-Day Alert | Governing Authority                          |
| ---------------- | ------------------ | ---------- | ----------- | ------------ | ------------ | -------------------------------------------- |
| **DET License**  | `1388443`          | 31-07-2024 | 30-07-2026  | 01-05-2026   | 30-06-2026   | Dubai Economy & Tourism (DET)                |
| **RERA ORN**     | `44483`            | 31-07-2024 | 30-07-2026  | 01-05-2026   | 30-06-2026   | Real Estate Regulatory Agency (RERA)         |
| **HQ Ejari**     | `0120250814005322` | 14-08-2025 | 13-08-2026  | 15-05-2026   | 14-07-2026   | Dubai Land Department (DLD)                  |
| **ICP Est Card** | `2/1/1192499`      | 31-07-2024 | 31-08-2026  | 02-06-2026   | 01-08-2026   | Federal Authority for Identity & Citizenship |

---

## 🏢 12 Corporate Departments

1. **`sales`** — Luxury Sales & Brokerage (Manager Level 4 + 9 Supervisors)
2. **`offplan`** — Strategic Off-Plan & Project Development (Manager Level 4 + 9 Supervisors)
3. **`commercial`** — Commercial Real Estate & Investment (Manager Level 4 + 9 Supervisors)
4. **`leasing`** — Portfolio Management & Residential Leasing (Manager Level 4 + 9 Supervisors)
5. **`asset_mgmt`** — Asset Management & Facilities (DH2 Hub - 9,378 Managed Dubai Units)
6. **`finance`** — Revenue Finance & Treasury (Escrow Audit / FTA VAT / Currency Cache)
7. **`marketing`** — Performance Marketing & Lead Acquisition (CPL Bounds / Portals Webhooks)
8. **`comms`** — Corporate Communications & Client Experience (Nadia WhatsApp Array Routing)
9. **`executive`** — Executive Office & Corporate Governance (Founder Vision Center Viewport)
10. **`compliance`** — Regulatory Affairs & RERA Compliance (Trakheesi Permits / AML Filters)
11. **`conveyancing`** — Conveyancing & Transaction Management (DLD Title Transfers & Developer NOCs)
12. **`intelligence`** — Market Intelligence & IoT Data Science (Sentinel Telemetry Ingestion Hub)

---

## 🔄 RUP Pipeline Execution Stages

- [x] **SYNC_01 (1_APPEND_PLAN):** Document dynamic requirements evolution in `plans/PENDING_TASKS_ONLY.md`
- [x] **SYNC_02 (2_ISOLATE_FILE):** Separate presentation, logic, and styles into atomic 3-folder layout (`.tsx`, `.logic.ts`, `.css`/`.style.ts`)
- [x] **SYNC_03 (3_EXTRACT_TEXT):** Centralize copywriting parameters in local i18n JSON files (`TranslationContext.tsx`)
- [x] **SYNC_04 (4_TERMINAL_CHECK):** Zero-token local compilation checks via `npm run build` and `npm run next:build`
- [x] **SYNC_05 (5_HOT_RELOAD):** Runtime stability verification with zero log exceptions
- [x] **SYNC_06 (6_REMOTE_RELEASE):** Remote release workflow ready for Vercel deployment hooks

---

## 📚 Documentation Modernization Queue (Docs-First, 2026-08-02)

| Task ID    | Priority | Stream        | Task                                                                                                                                        | Status      |
| ---------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| DOC-31-001 | P0       | plans         | Confirm canonical docs folder structure and normalize all plan references to `docs/plans/*`                                                 | ✅ Complete |
| DOC-31-002 | P0       | plans         | Reorganize planning index + wave index to reflect current wave ordering and canonical ownership                                             | ✅ Complete |
| DOC-31-003 | P0       | business_docs | Publish company-wide coverage matrix (profile, org, services, inventory, finance/accounts, HR, policies, vision) with Dubai trend alignment | ✅ Complete |
| DOC-31-004 | P1       | business_docs | Add business docs upgrade roadmap with section owners, due windows, and compliance evidence expectations                                    | ✅ Complete |
| DOC-31-005 | P0       | software_docs | Upgrade software docs index for project management governance (SDLC, RACI, quality gates, release discipline, traceability)                 | ✅ Complete |
| DOC-31-006 | P1       | software_docs | Add software documentation upgrade roadmap tied to Wave 31/Wave 32 planning dependency chain                                                | ✅ Complete |

**Dependency Note:** Wave 31 implementation execution should continue only against canonical documents under `docs/` after DOC-31-001..006 are complete and validated.

## 🚀 Wave 31 Execution Delta (2026-08-08)

| Task ID | Scope | Execution Update | Validation Evidence | Status |
| --- | --- | --- | --- | --- |
| W31-004 | Expiry status engine | Boundary handling normalized for overdue corporate documents (`<=0` routed to threshold day-zero alert type) | `server/services/compliance/__tests__/corporateDocumentExpiryScheduler.test.ts` | ✅ Complete slice |
| W31-005 | Scheduler + threshold alerts | Daily scheduler tick + dedupe alert flow hardened with metadata for threshold vs actual day delta | Same focused scheduler test pack | ✅ Complete slice |
| W31-006 | Notification fanout | In-app fanout kept primary; optional email + optional WhatsApp fanout added behind explicit env flags | New scheduler unit test for delivery event emissions + focused regression (`23/23`) | ✅ Complete slice |
| W31-007 | Immutable audit guarantees | Explicit corporate document archive action implemented (`/api/compliance/corporate-documents/:id/archive`) with append-only audit log records and role guard | `corporateDocumentService.test.ts` + `compliance.test.ts` + scheduler suite (`89/89` backend focused tests) | ✅ Complete slice |
| W31-008 | Compliance UI register | Corporate credentials register panel active with filters, status badges, countdowns, import + acknowledge actions | `src/pages/crm/ComplianceDepartmentView.test.tsx` | ✅ Complete slice |
| W31-009 | Executive KPI panel | Board-level credential exposure/KPI panel active in executive workspace view | `src/pages/crm/ExecutiveDepartmentView.test.tsx` | ✅ Complete slice |
| W31-010 | Wave closeout regression + governance | Consolidated targeted regression run completed after W31-004..009 implementation slices and tracker sync | `npm run test:run -- [wave31 targeted pack]` (`105/105`) + `npm run plans:validate` ✅ | ✅ Complete slice |

## 📈 Wave 32 — Documentation Governance & Progress Intelligence Queue

| Task ID | Priority | Stream | Task | Status |
| --- | --- | --- | --- | --- |
| W32-001 | P0 | business_docs | Normalize `docs/business_docs/README.md` as canonical business entrypoint and remove stale navigation drift | ✅ Complete |
| W32-002 | P0 | software_docs | Normalize `docs/software_docs/INDEX.md` and `docs/software_docs/adr/README.md` with canonical/historical separation | ✅ Complete |
| W32-003 | P0 | plans | Publish `docs/plans/PROGRESS_DASHBOARD.md` with status, lanes, and uplift KPI framing | ✅ Complete |
| W32-004 | P0 | plans | Publish `docs/plans/WAVE_PROGRESS_SUMMARY.md` with active/planned wave summary and contradiction cleanup notes | ✅ Complete |
| W32-005 | P1 | plans | Create requirement crosswalk seed between business requirement IDs and software realization IDs | ✅ Complete |
| W32-006 | P1 | plans | Create RBAC role-to-level bridge between business role catalogs and software access levels | ✅ Complete |
| W32-007 | P1 | plans | Create SLA reconciliation matrix bridging business promises and software timers | ✅ Complete |
| W32-008 | P1 | plans | Create compliance control matrix linking `COMP-*` controls to design/test surfaces | ✅ Complete |
| W32-009 | P0 | project_progress | Reconcile `PROJECT_PROGRESS.md` with actual wave reality and remove false full-completion claims | ✅ Complete |
| W32-010 | P0 | plans | Sync `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, and `waves/README.md` to include Wave 32 | ✅ Complete |
| W32-011 | P1 | business_docs | Normalize `docs/business_docs/09_crm_features/README.md` and align it to canonical requirements/software traceability links | ✅ Complete |
| W32-012 | P1 | software_docs | Add canonical traceability framing to `functional_specifications.md` and `rbac_state_gating.md` | ✅ Complete |
| W32-013 | P0 | business_docs | Run dedicated structural normalization pass for `docs/business_docs/05_requirements/functional-requirements.md` to resolve large markdown-format debt while preserving requirement IDs | ✅ Complete |

## ✅ SRS-5000 Priority-First Milestone Sync (2026-08-07)

| Task ID | Priority | Stream | Task | Status |
| --- | --- | --- | --- | --- |
| SRS-5000-001 | P0 | software_docs | Publish canonical 5000-ID enterprise register in `SRS_MASTER_12_DEPARTMENTS.md` with listings → leasing → receipts lane priority | ✅ Complete |
| SRS-5000-002 | P0 | tooling | Upgrade `aegis/scripts/srs-audit.js` to count explicit IDs and canonical ranges (`FR-XXX-0001..1200`) | ✅ Complete |
| SRS-5000-003 | P0 | validation | Re-run governance and SRS audits and publish updated evidence artifacts (`SRS_INSIGHTS_REPORT_2026-08-07.md`, `srs-audit-summary.json`) | ✅ Complete |

**Validated result:** `5121 total / 5061 unique` requirement IDs.

## 📌 Upgrade Reference Closure Queue (2026-08-07)

| Task ID | Priority | Stream | Task | Status |
| --- | --- | --- | --- | --- |
| UPG-REF-001 | P0 | docs-governance | Publish canonical readiness scorecard for future upgrades and link it across canonical indexes | ✅ Complete |
| UPG-REF-002 | P0 | docs-governance | Use scorecard to drive stale narrative + endpoint contract + source-of-truth closure wave | ✅ Complete (business-doc upgrade lanes closed, transitional supersession mapped, and tracker narratives synchronized) |
| UPG-REF-003 | P1 | srs-governance | Add semantic traceability gate for priority lanes (Listings/Leasing/Receipts) | ✅ Complete (priority-lane gate closed in `docs/plans/documentation/REQ_CROSSWALK.md` with requirement, route, service, test, and governance evidence for Listings, Leasing, and Receipts) |
| UPG-REF-004 | P1 | docs-autopilot | Run docs-only AEGIS autopilot lane (100 turns) with bundle-based checkpoints and governance validation | 🟡 In Progress (`docs/plans/AEGIS_DOCS_AUTOPILOT_100_TURN_2026-08-07.md`) |

## 🧭 Future Documentation Implementation Waves (Prepared 2026-08-07)

| Task ID | Priority | Priority Tag | Stream | Task | Artifact Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| W33-PREP | P0 | Frontend-First + Docs | business_docs | Register Wave 33 bundle for business-doc canonicalization and coverage completion | [`WAVE_33_SDD.md`](./waves/WAVE_33_SDD.md), [`WAVE_33_READINESS_PACKET.md`](./waves/WAVE_33_READINESS_PACKET.md), [`WAVE_33_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_33_IMPLEMENTATION_BACKLOG.md), [`WAVE_33_TEST_ROLLOUT.md`](./waves/WAVE_33_TEST_ROLLOUT.md) | ✅ Prepared |
| W34-PREP | P0 | Frontend-First + Docs | software_docs | Register Wave 34 bundle for software-doc canon sync and architecture reconciliation | [`WAVE_34_SDD.md`](./waves/WAVE_34_SDD.md), [`WAVE_34_READINESS_PACKET.md`](./waves/WAVE_34_READINESS_PACKET.md), [`WAVE_34_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_34_IMPLEMENTATION_BACKLOG.md), [`WAVE_34_TEST_ROLLOUT.md`](./waves/WAVE_34_TEST_ROLLOUT.md) | ✅ Prepared |
| W35-PREP | P0 | Frontend-First + SRS | srs-governance | Register Wave 35 bundle for SRS semantic completeness and requirement traceability | [`WAVE_35_SDD.md`](./waves/WAVE_35_SDD.md), [`WAVE_35_READINESS_PACKET.md`](./waves/WAVE_35_READINESS_PACKET.md), [`WAVE_35_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_35_IMPLEMENTATION_BACKLOG.md), [`WAVE_35_TEST_ROLLOUT.md`](./waves/WAVE_35_TEST_ROLLOUT.md) | ✅ Prepared |
| W36-PREP | P1 | Frontend-First + Release | release-governance | Register Wave 36 bundle for release readiness, ops evidence, and documentation closeout | [`WAVE_36_SDD.md`](./waves/WAVE_36_SDD.md), [`WAVE_36_READINESS_PACKET.md`](./waves/WAVE_36_READINESS_PACKET.md), [`WAVE_36_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_36_IMPLEMENTATION_BACKLOG.md), [`WAVE_36_TEST_ROLLOUT.md`](./waves/WAVE_36_TEST_ROLLOUT.md) | ✅ Prepared |
| W37-SCAFFOLD | P0 | Frontend-First | frontend-refactor | Scaffold Wave 37 for frontend architecture decomposition | [`WAVE_37_SDD.md`](./waves/WAVE_37_SDD.md), [`WAVE_37_READINESS_PACKET.md`](./waves/WAVE_37_READINESS_PACKET.md), [`WAVE_37_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_37_IMPLEMENTATION_BACKLOG.md), [`WAVE_37_TEST_ROLLOUT.md`](./waves/WAVE_37_TEST_ROLLOUT.md), [`WAVE_37_FLOWCHARTS.md`](./waves/WAVE_37_FLOWCHARTS.md) | ✅ Prepared |
| W38-SCAFFOLD | P0 | Frontend-First | frontend-refactor | Scaffold Wave 38 for frontend state/performance optimization | [`WAVE_38_SDD.md`](./waves/WAVE_38_SDD.md), [`WAVE_38_READINESS_PACKET.md`](./waves/WAVE_38_READINESS_PACKET.md), [`WAVE_38_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_38_IMPLEMENTATION_BACKLOG.md), [`WAVE_38_TEST_ROLLOUT.md`](./waves/WAVE_38_TEST_ROLLOUT.md), [`WAVE_38_FLOWCHARTS.md`](./waves/WAVE_38_FLOWCHARTS.md) | ✅ Prepared |
| W39-SCAFFOLD | P0 | Frontend-First | frontend-refactor | Scaffold Wave 39 for frontend reliability/accessibility hardening | [`WAVE_39_SDD.md`](./waves/WAVE_39_SDD.md), [`WAVE_39_READINESS_PACKET.md`](./waves/WAVE_39_READINESS_PACKET.md), [`WAVE_39_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_39_IMPLEMENTATION_BACKLOG.md), [`WAVE_39_TEST_ROLLOUT.md`](./waves/WAVE_39_TEST_ROLLOUT.md), [`WAVE_39_FLOWCHARTS.md`](./waves/WAVE_39_FLOWCHARTS.md) | ✅ Prepared |
| W40-SCAFFOLD | P0 | Frontend-First + Closeout | full-project | Scaffold Wave 40 for full-project closure and supersession lock | [`WAVE_40_SDD.md`](./waves/WAVE_40_SDD.md), [`WAVE_40_READINESS_PACKET.md`](./waves/WAVE_40_READINESS_PACKET.md), [`WAVE_40_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_40_IMPLEMENTATION_BACKLOG.md), [`WAVE_40_TEST_ROLLOUT.md`](./waves/WAVE_40_TEST_ROLLOUT.md), [`WAVE_40_FLOWCHARTS.md`](./waves/WAVE_40_FLOWCHARTS.md) | ✅ Prepared |

Reference:

- `docs/UPGRADE_REFERENCE_READINESS_SCORECARD_2026-08.md`

## 🧮 SRS-10K Macro Campaign Queue (single-pass with hard checkpoints)

| Task ID | Priority | Stream | Task | Checkpoint | Status |
| --- | --- | --- | --- | --- | --- |
| SRS-10K-001 | P0 | srs-governance | Publish canonical 10k ID allocation matrix (family/domain/range) | Pre-C1 | ✅ Complete — `docs/plans/documentation/SRS_10K_ID_ALLOCATION_MATRIX_2026-08-07.md` |
| SRS-10K-002 | P0 | srs-governance | Publish SRS writing style guide + glossary + modal verb policy | Pre-C1 | ✅ Complete — `docs/plans/documentation/SRS_10K_WRITING_STYLE_GUIDE_2026-08-07.md` |
| SRS-10K-003 | P0 | traceability | Publish hybrid registry schema (requirements + UC linkage fields) | Pre-C1 | ✅ Complete — `docs/plans/documentation/SRS_10K_HYBRID_REGISTRY_SCHEMA_2026-08-07.md` |
| SRS-10K-C1 | P0 | validation | Validate first 1,000 requirement checkpoint (collision/orphan/traceability) | C1 | 📋 Planned |
| SRS-10K-C2 | P0 | validation | Validate 2,000 requirement checkpoint | C2 | 📋 Planned |
| SRS-10K-C3 | P0 | validation | Validate 3,000 requirement checkpoint | C3 | 📋 Planned |
| SRS-10K-C4 | P0 | validation | Validate 4,000 requirement checkpoint | C4 | 📋 Planned |
| SRS-10K-C5 | P0 | validation | Validate 5,000 requirement checkpoint | C5 | 📋 Planned |
| SRS-10K-C6 | P0 | validation | Validate 6,000 requirement checkpoint | C6 | 📋 Planned |
| SRS-10K-C7 | P0 | validation | Validate 7,000 requirement checkpoint | C7 | 📋 Planned |
| SRS-10K-C8 | P0 | validation | Validate 8,000 requirement checkpoint | C8 | 📋 Planned |
| SRS-10K-C9 | P0 | validation | Validate 9,000 requirement checkpoint | C9 | 📋 Planned |
| SRS-10K-C10 | P0 | validation | Validate final 10,000 requirement checkpoint and closure report | C10 | 📋 Planned |
