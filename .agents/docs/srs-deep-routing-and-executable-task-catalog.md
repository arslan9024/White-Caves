# Software Requirements Specification (SRS)

## Deep Routing Architecture & Executable Task Catalog (Feature-as-a-Task)

**Document Reference:** `SRS-ROUTING-TASK-CATALOG-003`  
**Standard Compliance:** AEGIS Canonical 7-Category Architecture Standard & Single Purpose File Law (< 350 lines)  
**Governance Protocol:** Bhakti Protocol & Turing Protocol (Law T7: Migration & Zero-Breakage)  
**Author:** @Margaret (Strategic Planner) & @Ada (Chief Architect)  
**Status:** Approved & Specified  
**Date:** 2026-11-05

---

### 1. Executive Summary

This specification defines two critical architectural upgrades for **White Caves Real Estate LLC**:

1. **URL-First Deep Routing Architecture:** Replacing ephemeral in-memory state with deep nested URLs (`/dashboard/departments/:deptId?`, `/dashboard/employees/:empId?`, `/dashboard/tasks/:taskId?`, `/dashboard/leaderboard`) wrapped in strict authentication gates (`ProtectedRoute`).
2. **Feature-as-a-Task Functional Catalog:** Decomposing all standalone CRM features, AI engines, scanners, and statutory tools into atomic, executable **Level 5 Tasks (L5)** under the **Turing Protocol**, each with discrete inputs, processing logic, outputs, and verification checks.

---

### 2. URL-First Deep Routing Architecture

#### 2.1 Route Matrix & Authentication Enforcement

All `/dashboard` routes are strictly wrapped in `ProtectedRoute`. Unauthenticated visitors are immediately redirected to `/signin?returnTo=/dashboard/...`.

| URL Path                         | Target Viewport Component       | URL Parameter            | Description                                          |
| :------------------------------- | :------------------------------ | :----------------------- | :--------------------------------------------------- |
| `/dashboard`                     | Default Landing                 | None                     | Redirects to `/dashboard/departments`                |
| `/dashboard/departments`         | `DepartmentManagementWorkspace` | None                     | Full 12-slot corporate grid & 108 managers           |
| `/dashboard/departments/:deptId` | `DepartmentDetailView` / Modal  | `deptId` (e.g. `D01`)    | Direct deep-link to specific department & sub-squads |
| `/dashboard/employees`           | `EmployeeManagerView`           | None                     | Personnel roster & role tiers                        |
| `/dashboard/employees/:empId`    | `EmployeeDetailDrawer`          | `empId` (e.g. `EMP-001`) | Direct deep-link to specific employee career dossier |
| `/dashboard/tasks`               | `TaskManagerView`               | None                     | 200+ statutory & operational task catalog            |
| `/dashboard/tasks/:taskId`       | `TaskExecutionWorkbench`        | `taskId` (e.g. `T001`)   | Interactive task execution canvas with live I-P-O-V  |
| `/dashboard/leaderboard`         | `LeaderboardView`               | None                     | Corporate merit leaderboard & podium                 |
| `/dashboard/documents`           | `HenryEmiratesIdScannerView`    | None                     | Document OCR studio & scanner tools                  |
| `/dashboard/audit`               | `ComplianceAuditView`           | None                     | RERA compliance & DLD Escrow oversight               |
| `/dashboard/settings`            | `SovereignSettingsView`         | None                     | Platform settings & RBAC controls                    |

#### 2.2 Navigation State Synchronization

- Clicking any left Activity Bar icon calls `navigate('/dashboard/' + tab)`.
- Selecting an item from the sidebar updates the deep URL (e.g. `navigate('/dashboard/tasks/' + taskCode)`).
- Browser Back and Forward buttons navigate seamlessly between selected tasks and departments.

---

### 3. Feature-as-a-Task Functional Catalog (Atomic Decomposition)

Under **Turing Law T1 & Law T3**, all existing CRM tools and capabilities are converted into discrete, reusable L5 Tasks with explicit 4-Stage contracts:

#### 3.1 Document Scanning & Computer Vision Tasks

1. **`T-DOC-001` — Scan Title Deed and Extract Coordinates:**
   - _Input:_ PDF/JPEG Title Deed scan from DLD (`plotNumber`, `ownerName`).
   - _Process:_ OCR parser extracting plot number, municipality, area name, owner name, and share percentage.
   - _Output:_ Normalized Title Deed JSON object with geocodes.
   - _Verify:_ Validate DLD electronic registry query returned 100% clean title status.
2. **`T-DOC-002` — Scan Emirates ID and Extract Identity:**
   - _Input:_ Front and back Emirates ID image (`idNumber`, `holderName`).
   - _Process:_ Henry OCR parser extracting EID number, full name (EN/AR), nationality, DOB, and expiry.
   - _Output:_ Verified identity dossier with photo extraction.
   - _Verify:_ Check checksum digits and validity against GDRFA/ICP rules.
3. **`T-DOC-003` — Scan Passport and Extract Travel Details:**
   - _Input:_ Passport photo page scan (`passportNumber`, `nationality`).
   - _Process:_ MRZ reader extracting passport number, issuing country, nationality, and expiry.
   - _Output:_ Identity and international client profile.
   - _Verify:_ MRZ line 1 & line 2 checksums verified with GDRFA standards.
4. **`T-DOC-004` — Scan Tenancy Contract and Extract Clauses:**
   - _Input:_ Signed legacy tenancy contract PDF (`annualRent`, `cheques`).
   - _Process:_ NLP clause extractor identifying annual rent, cheque cadence, security deposit, and special terms.
   - _Output:_ Structured tenancy term sheet.
   - _Verify:_ RERA rental index brackets applied; digital signature logged.

#### 3.2 Finance, Accounting & Statutory Compliance Tasks

5. **`T-FIN-001` — Escrow Account Milestone & Liquidity Audit:**
   - _Input:_ Project escrow ID, statutory retention rate, milestone completion percentage.
   - _Process:_ Audit bank escrow balance against certified project construction milestones.
   - _Output:_ Escrow liquidity certificate & release authorization status.
   - _Verify:_ Bank escrow balance $\ge$ statutory retention requirement.
6. **`T-FIN-002` — Corporate VAT 5% Quarterly Return Generator:**
   - _Input:_ Standard rated supplies AED, zero-rated supplies AED, input tax recovery AED.
   - _Process:_ Computes 5% VAT on supplies, deducts recoverable input tax, calculates net payable/refundable.
   - _Output:_ Official FTA Form VAT201 filing payload with TRN verification.
   - _Verify:_ FTA TRN format verified (`100-XXXX-XXXX-XXXX`).
7. **`T-FIN-003` — PDC Post-Dated Cheque Batch Clearing & Bounced Cheque Tracking:**
   - _Input:_ Cheques count, batch total AED, drawer bank code, tenor date.
   - _Process:_ Central Bank of UAE Image Cheque Clearing System (ICCS) simulation and risk scoring.
   - _Output:_ Clearing batch manifest with bounced cheque early warning flag.
   - _Verify:_ Cheque serials and MICR band checksum validated.

#### 3.3 Regulatory, Ejari & Brokerage Operations

8. **`T-REG-001` — DLD Ejari Tenancy Contract & Certificate Electronic Registration:**
   - _Input:_ Tenancy term sheet, tenant EID, landlord title deed, premises number.
   - _Process:_ Automated Ejari registration payload generation with official barcoded certificate.
   - _Output:_ Official Ejari contract number and unified QR code verification hash.
   - _Verify:_ RERA rental index compliance threshold satisfied.
9. **`T-REG-002` — RERA Broker Card Electronic Verification & License Renewal Desk:**
   - _Input:_ Broker card number, broker name, CPD points accumulated.
   - _Process:_ Real-time validation against DLD Trakheesi broker registry.
   - _Output:_ Broker compliance clearance and renewal eligibility badge.
   - _Verify:_ Mandatory 20 CPD training hours confirmed.

#### 3.4 Omnichannel Marketing, Syndication & Security

10. **`T-CRM-001` — Omnichannel WhatsApp Client Follow-Up Broadcast:**
    - _Input:_ Recipient telephone (`+971...`), client name, property brochure ID.
    - _Process:_ Meta WhatsApp Business API template dispatch and webhook callback logging.
    - _Output:_ Message dispatch receipt with delivery timestamp and status tracking ID.
    - _Verify:_ E.164 UAE telephone formatting verified.
11. **`T-PORTAL-001` — Syndicated Bayut & Dubizzle XML/JSON Feed Sync with Trakheesi Permit:**
    - _Input:_ Listing ID, Trakheesi permit number, portal targets (`bayut`, `dubizzle`).
    - _Process:_ Validation of listing photos, floor plans, and XML/JSON syndication payload push.
    - _Output:_ Syndication feed status with live listing URLs.
    - _Verify:_ Trakheesi permit QR verified and active in DLD system.
12. **`T-VAL-001` — AI Automated Valuation Model (AVM) & Comparative Market Analysis (CMA):**
    - _Input:_ Property location, built-up area sqft, bedrooms, view type.
    - _Process:_ Hedonic price regression against DLD recorded transactions in past 90 days.
    - _Output:_ Estimated fair market value AED, price per sqft, and confidence index.
    - _Verify:_ DLD transaction sample size $\ge 15$ comparable units.
13. **`T-SEC-001` — UAE Pass / Multi-Factor Biometric Session Integrity Audit:**
    - _Input:_ User email, session token, WebAuthn credential public key.
    - _Process:_ Cryptographic challenge verification and hardware authenticator audit.
    - _Output:_ High-assurance session stamp with FIDO2 Level 2 certification.
    - _Verify:_ Nonce timestamp freshness $< 60$ seconds.

#### 3.5 Master 600+ Operational Tasks Partitioning

The master task catalog contains **612 discrete Level 5 Tasks** partitioned across 6 modular definitions adhering to the Single Purpose File Law:

1. **`OPERATIONAL_TOOL_TASKS` (13 Tasks):** `T-DOC-001` to `T-SEC-001` covering all primary standalone operational tools and scanner services.
2. **`RAW_TASKS_PART1` (`TSK-001` to `TSK-100`):** Pillar I Legal & Regulatory, Form A/B/F/U, Title Deeds, Escrow, and RERA broker compliance.
3. **`RAW_TASKS_PART2` (`TSK-101` to `TSK-200`):** Pillar II Finance, Pillar III Human Capital, Pillar IV Sales Operations, Pillar V Marketing, Pillar VI Tech, Pillar VII Operations.
4. **`RAW_TASKS_PART3` (`TSK-201` to `TSK-300`):** Pillar VIII Client Experience & VIP Concierge, Pillar IX Secondary Market & Luxury Resale, Pillar X International Investments, Pillar XI Commercial & Retail Leasing, Pillar XII Research & Market Intelligence.
5. **`RAW_TASKS_PART4` (`TSK-301` to `TSK-400`):** The 20 Flagship End-to-End Real Estate Journeys (`J01` to `J20`) decomposed into 100 discrete operational tasks across 5 lifecycle stages each.
6. **`RAW_TASKS_PART5` (`TSK-401` to `TSK-500`):** 40 Specialist AI Assistants & Technical Systems Infrastructure (Henry OCR Studio, Theodora Finance AI, Nadia & Linda WhatsApp AI, Mary Inventory AI, Clara Leads AI, Sophia Sales AI, Daisy Leasing AI, Laila Compliance AI, Aurora & Willow Systems Infrastructure).
7. **`RAW_TASKS_PART6` (`TSK-501` to `TSK-600`):** Dubai Land Department Sovereign Cadastre, Trustee Registration Offices, Escrow Law No. 8 of 2007 audits, RERA Trakheesi permits, Dubai Courts & RDC disputes, FTA Corporate Tax 9%, and Central Bank goAML reporting.

---

### 4. Turing Law T7: Migration & Zero-Breakage Standard

1. **Atomic Parity Precondition:** No legacy route or service is pruned until its atomic Level 5 Task equivalent is verified with 100% green test coverage.
2. **Graceful Backward Compatibility:** `/dashboard2` remains a functional secondary route, routing to the executive workspace, while modern URL-first `/dashboard` is the default landing for all new user sessions.
3. **Composable Enterprise Modules:** Once tools are atomic tasks, they can be composed into multi-step journeys (e.g. Journey J-01: Onboarding Tenant executes `T-DOC-002` $\rightarrow$ `T-REG-001` $\rightarrow$ `T-CRM-001`).
