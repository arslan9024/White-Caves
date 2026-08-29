# White Caves Real Estate LLC — Pending Tasks & RUP System Ledger

> **Status:** ACTIVE | **Canonical Path:** `plans/PENDING_TASKS_ONLY.md` | **Archive Copy:** `docs/plans/PENDING_TASKS_ONLY.md`  
> **System Version:** 2.0.26  
> **Last Updated:** 2026-08-26  
> **Active Stream:** `MASTER_PLAN.md`  
> **Active Wave Bundle:** Wave 45 (Arabic RTL Support & PWA Offline Engine — SRS Final Phase)  
> **Engineering Model:** Rational Unified Process (RUP)  
> **Hierarchy:** 1 Managing Director (Arsalan Malik) | 12 Department Managers | 108 Supervisors  
> **Brand Palette:** Red (`#EF4444`) | White (`#FFFFFF`) | Slate (`#1E293B`)  
> **Forbidden Colors:** Emerald Green | Metallic Gold | Obsidian Black  
> **Build Gate Status:** 0-Token Local Machine Compilation Checks via `npm run build` & `npm run next:build` (PASSED)

---

## 🏛️ Master Company Credentials Ledger (`src/mocks/companyMasterLedger.json`)

| Document Type | Document No. | Issue Date | Expiry Date | 90-Day Alert | 30-Day Alert | Governing Authority |
|---|---|---|---|---|---|---|
| **DET License** | `1388443` | 31-07-2024 | 30-07-2026 | 01-05-2026 | 30-06-2026 | Dubai Economy & Tourism (DET) |
| **RERA ORN** | `44483` | 31-07-2024 | 30-07-2026 | 01-05-2026 | 30-06-2026 | Real Estate Regulatory Agency (RERA) |
| **HQ Ejari** | `0120250814005322` | 14-08-2025 | 13-08-2026 | 15-05-2026 | 14-07-2026 | Dubai Land Department (DLD) |
| **ICP Est Card** | `2/1/1192499` | 31-07-2024 | 31-08-2026 | 02-06-2026 | 01-08-2026 | Federal Authority for Identity & Citizenship |

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

## 🎨 Multi-Zone UI/UX Upgrade Parameters (@Ada RUP Construction)

| Viewport Target | Architecture Tier | Action Directive | UI Pattern | Status |
| :--- | :--- | :--- | :--- | :--- |
| `src/components/navigation/TopNavbar.tsx` | GLOBAL_SHELL | Remove written text strings, double logo vector boundaries to 76px x 76px (`h-[76px] w-[76px]`). Enforce 50% vertical overhang past bottom red header line. Shift right. | `OverhangingLogoShell` | ✅ COMPLETED |
| `src/components/navigation/TopNavbar.tsx` | GLOBAL_SHELL | Inject binary light/dark switch (`#FFFFFF` + `#EF4444` vs `#0F172A` + `#EF4444`). | `ThemeToggle` | ✅ COMPLETED |
| `src/components/navigation/TopNavbar.tsx` | GLOBAL_SHELL | Fluid dropdown lists: hover opens micro-shadow glassmorphic container, click locks open. | `FluidDropdownFlow` | ✅ COMPLETED |
| `src/components/home/HeroSection.tsx` | HOMEPAGE | Re-align search pill items, integrate live monochrome Google Maps module with red listing pins from local property ledger. | `UnifiedHomepageView` | ✅ COMPLETED |
| `src/pages/crm/ProfilePage.tsx` | AUTH_PROFILE | Founder summary card with interactive milestone line, session IP tickers, document expiration badges (DET `1388443`, RERA ORN `44483`, HQ Ejari, ICP card) with 90/60/30-day renewal countdown notifications. | `SovereignProfilePage` | ✅ COMPLETED |
| `src/pages/crm/UnifiedDashboardPage.tsx` | CRM_COCKPIT | High-density analytics tokens, live cross-department action trackers, draggable widget modules, micro-sparkline graphs next to manager profiles. | `ExecutiveFlightDeck` | ✅ COMPLETED |

---

## 📐 Algorithms Domain Manifest Index (`software_docs/05_algorithms/`)

| File Path | Department | Algorithm Name | Mathematical / Logic Protocol | SDD Reference |
| :--- | :--- | :--- | :--- | :--- |
| `software_docs/05_algorithms/lead_sla_decay.md` | `comms` | Lead SLA Decay & Escalation Algorithm | Weight-Based TTL Decay Penalty Counters | `../02_software_design/rbac_state_gating_sdd.md` |
| `software_docs/05_algorithms/commission_tier_acceleration.md` | `finance` | Dynamic Commission Tier Accelerator | Threshold-Trigger Split Math (50/50 to 70/30 Split) | `../02_software_design/database_architecture_sdd.md` |
| `software_docs/05_algorithms/predictive_roi_appraisal.md` | `intelligence` | Predictive Property ROI Appraisal | Linear Regression DLD Density Arrays | `../02_software_design/tech_replacement_rules.md` |
| `software_docs/05_algorithms/noc_express_pathfinder.md` | `conveyancing` | NOC Express Pathfinder Logic | Graph-Based Delay Analysis across developers | `../02_software_design/tech_replacement_rules.md` |

---

## 🚀 Global Repository Structural Rearrangement & Deduplication Pass (2026-08-26)

> **Directive Token:** `@Ada — Context Ready (95% Readiness) — High-Fidelity RUP Construction Phase`  
> **Target:** `GLOBAL_REPOSITORY_STRUCTURAL_REARRANGEMENT_AND_DEDUPLICATION_PASS`

- [x] **Blueprint Ledger Ingestion:** Credit Preservation Law (`strategies/CREDIT_PRESERVATION_LAW.md`) registered.
- [x] **Duplicate Folder Pruning:** Purge legacy `backend/services/whatsapp/` (superseded by `server/services/whatsappService.ts`).
- [x] **Documentation Hub Parity:** Complete 16-Module HTML suites for Zoe AI (`zoeBusinessDocsRegistry.ts`) and Aurora AI (`auroraSoftwareDocsRegistry.ts`).
- [x] **Unified Workspace Layout:** Standardize `UnifiedWorkspaceLayout.tsx` (TopNavbar + Level 5 MD Hub Sidebar).
- [x] **Zero-Overhead Local Gates:** Validated via `npm run build`, `npm run typecheck`, and `npm run plans:validate`.

