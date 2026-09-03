# White Caves Real Estate LLC — Pending Tasks & RUP System Ledger

> **Status:** ACTIVE | **Canonical Path:** `plans/PENDING_TASKS_ONLY.md` | **Archive Copy:** `docs/plans/PENDING_TASKS_ONLY.md`  
> **System Version:** 2.0.26  
> **Last Updated:** 2026-09-03  
> **Active Stream:** `MASTER_PLAN.md`  
> **Active Wave Bundle:** Wave 46 (Deduplication & Canonicalization Program)  
> **Engineering Model:** Rational Unified Process (RUP)  
> **Hierarchy:** 1 Managing Director (Arsalan Malik) | 12 Department Managers | 108 Supervisors  
> **Brand Palette:** Red (`#EF4444`) | White (`#FFFFFF`) | Slate (`#1E293B`)  
> **Forbidden Colors:** Emerald Green | Metallic Gold | Obsidian Black  
> **Build Gate Status:** 0-Token Local Machine Compilation Checks via `npm run build` & `npm run next:build` (PASSED)

---

## ✅/📋 Wave 46 Deduplication Program Status

- ✅ **W46-001 complete:** duplication baseline inventory captured in `plans/DEDUP_INVENTORY_BASELINE_2026-09-03.md`.
- ✅ **W46-002 complete:** canonical path policy tagging applied to planning mirrors with explicit reference-copy banners.
- ✅ **W46-003 complete:** planning truth-set reconciled across canonical trackers and governance validation passed.
- ✅ **W46-004 complete:** documentation dedup matrix published in `plans/WAVE_46_DOCS_PLANS_DEDUP_MATRIX_2026-09-03.md`.
- ✅ **W46-005 complete:** business-doc canonical root set to `docs/business_docs/` with phased migration/pointer map.
- ✅ **W46-006 complete:** frontend overlap audit + route-entry conflict report published.
- ✅ **W46-007 complete:** backend overlap audit + duplicate handler map published.
- ✅ **W46-008 complete:** safe-delete wave executed with verified unreferenced mirror cleanup.
- ✅ **W46-009 complete:** CI anti-duplication guardrails added to local/PR/CI workflows.
- ✅ **W46-010 complete:** Wave 46 closure metrics and final report published.
- ✅ **Wave 46 complete:** all W46-001…W46-010 tasks delivered and validated.
- ✅ **W46-ops hardening complete (2026-09-03):** prompts/queue orchestration stability improved (fallback path resolution, verify-prompts metadata target resolution, stale prompt-key pruning to active queue IDs, zero-error/zero-warning prompt validation).
- ✅ **Autopilot queue cycle complete (2026-09-03):** active orchestrator queue drained from `0/51 done` to `51/51 done`; FEEDS_ACK transitions auto-resolved; blocker report now `READY: 0 | BLOCKED: 0`.
- Backlog source: `docs/plans/waves/WAVE_46_IMPLEMENTATION_BACKLOG.md`.

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

## 🎨 Multi-Zone UI/UX Upgrade Parameters (@Ada RUP Construction)

| Viewport Target                                     | Architecture Tier | Action Directive                                                                                                                                                         | UI Pattern                | Status       |
| :-------------------------------------------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ | :----------- |
| `src/components/navigation/TopNavbar.tsx`           | GLOBAL_SHELL      | Remove written text strings, double logo vector boundaries to 76px x 76px (`h-[76px] w-[76px]`). Enforce 50% vertical overhang past bottom red header line. Shift right. | `OverhangingLogoShell`    | ✅ COMPLETED |
| `src/components/navigation/Sidebar108/`             | CRM_SIDEBAR       | Unified Collapsible 1-12-108 Command Panel with Founder Sovereign Bypass for `arslanmalikgoraha@gmail.com` [Managing Director Hub].                                      | `Sidebar108Panel`         | 🚀 ACTIVE    |
| `src/components/layout/WorkspaceShell/`             | WORKSPACE_SHELL   | Eliminates layout shifts with `margin-top: 64px; margin-left: 280px; padding: 24px;` and red/white skeleton screens.                                                     | `WorkspaceShellCanvas`    | 🚀 ACTIVE    |
| `src/components/navigation/CavesFloatingSearch/`    | FLOATING_DOCK     | Balanced symmetrical floating search pill (bottom-left) + WhatsApp orb (bottom-right).                                                                                   | `SymmetricalFloatingPill` | 🚀 ACTIVE    |
| `src/components/analytics/GamifiedAnalyticsPodium/` | ANALYTICS_PODIUM  | 3-Tier Victory Podiums (AED volume closed), 7-day mini sparklines, and 15-minute pulsing SLA tickers.                                                                    | `GamifiedLuxuryPodium`    | 🚀 ACTIVE    |

---

## 📐 Algorithms Domain Manifest Index (`software_docs/05_algorithms/`)

| File Path                                                     | Department     | Algorithm Name                        | Mathematical / Logic Protocol                       | SDD Reference                                        |
| :------------------------------------------------------------ | :------------- | :------------------------------------ | :-------------------------------------------------- | :--------------------------------------------------- |
| `software_docs/05_algorithms/lead_sla_decay.md`               | `comms`        | Lead SLA Decay & Escalation Algorithm | Weight-Based TTL Decay Penalty Counters             | `../02_software_design/rbac_state_gating_sdd.md`     |
| `software_docs/05_algorithms/commission_tier_acceleration.md` | `finance`      | Dynamic Commission Tier Accelerator   | Threshold-Trigger Split Math (50/50 to 70/30 Split) | `../02_software_design/database_architecture_sdd.md` |
| `software_docs/05_algorithms/predictive_roi_appraisal.md`     | `intelligence` | Predictive Property ROI Appraisal     | Linear Regression DLD Density Arrays                | `../02_software_design/tech_replacement_rules.md`    |
| `software_docs/05_algorithms/noc_express_pathfinder.md`       | `conveyancing` | NOC Express Pathfinder Logic          | Graph-Based Delay Analysis across developers        | `../02_software_design/tech_replacement_rules.md`    |

---

## 🚀 Global Repository Structural Rearrangement & Deduplication Pass (2026-08-26)

> **Directive Token:** `@Ada — Context Ready (95% Readiness) — High-Fidelity RUP Construction Phase`  
> **Target:** `GLOBAL_REPOSITORY_STRUCTURAL_REARRANGEMENT_AND_DEDUPLICATION_PASS`

- [x] **Blueprint Ledger Ingestion:** Credit Preservation Law (`strategies/CREDIT_PRESERVATION_LAW.md`) registered.
- [x] **Duplicate Folder Pruning:** Purge legacy `backend/services/whatsapp/` (superseded by `server/services/whatsappService.ts`).
- [x] **Documentation Hub Parity:** Complete 16-Module HTML suites for Zoe AI (`zoeBusinessDocsRegistry.ts`) and Aurora AI (`auroraSoftwareDocsRegistry.ts`).
- [x] **Unified Workspace Layout:** Standardize `UnifiedWorkspaceLayout.tsx` (TopNavbar + Level 5 MD Hub Sidebar).
- [x] **Zero-Overhead Local Gates:** Validated via `npm run build`, `npm run typecheck`, and `npm run plans:validate`.

---

## 🔱 Deep Psychology & Forensic Engine Audit Ledger

```json
{
  "target": "WHITE_CAVES_FRONTEND_DEEP_PSYCHOLOGY_AND_ENGINE_AUDIT",
  "directiveToken": "@Ada — Context Ready (95% Readiness) — High-Fidelity Forensic Resolution Phase",
  "metadata": {
    "officialDomain": "https://whitecaves.com",
    "brandingColors": {
      "whiteCavesRed": "#EF4444",
      "brilliantWhite": "#FFFFFF",
      "deepSlateText": "#1E293B",
      "darkCanvasBg": "#0F172A"
    }
  },
  "verifiedCredentialsStorage": {
    "profileTarget": "arslanmalikgoraha@gmail.com",
    "accessLevel": 5,
    "wildcardPermissions": ["*"],
    "embeddedCorporateDocuments": [
      { "type": "DET_Trade_License", "id": "1388443", "expiryDate": "2026-07-30" },
      { "type": "RERA_Office_Registration", "id": "44483", "expiryDate": "2026-07-30" },
      { "type": "HQ_Office_Ejari", "id": "0120250814005322", "expiryDate": "2026-08-13" },
      { "type": "ICP_eEstablishment_Card", "id": "2/1/1192499", "expiryDate": "2026-08-31" }
    ]
  },
  "status": "FORENSIC_RESOLUTION_ACTIVE"
}
```
