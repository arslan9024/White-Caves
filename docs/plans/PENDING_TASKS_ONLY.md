# White Caves Real Estate LLC — Pending Tasks & RUP System Ledger

> **System Version:** 2.0.26  
> **Last Updated:** 2026-08-02  
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
