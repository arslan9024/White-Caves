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
   - _Input:_ PDF/JPEG Title Deed scan from DLD.
   - _Process:_ OCR parser extracting plot number, municipality, area name, owner name, and share percentage.
   - _Output:_ Normalized Title Deed JSON object.
   - _Verify:_ Validate DLD registration number format and ownership validity.
2. **`T-DOC-002` — Scan Emirates ID and Extract Identity:**
   - _Input:_ Front and back Emirates ID image.
   - _Process:_ Henry OCR parser extracting EID number, full name (EN/AR), nationality, DOB, and expiry.
   - _Output:_ Verified identity dossier with photo extraction.
   - _Verify:_ Check checksum digits and validity against GDRFA/ICP rules.
3. **`T-DOC-003` — Scan Passport and Extract Travel Details:**
   - _Input:_ Passport photo page scan.
   - _Process:_ MRZ reader extracting passport number, issuing country, nationality, and expiry.
   - _Output:_ Identity and international client profile.
   - _Verify:_ MRZ checksum verification.
4. **`T-DOC-004` — Scan Old Tenancy Contract and Extract Clauses:**
   - _Input:_ Signed legacy tenancy contract PDF.
   - _Process:_ NLP clause extractor identifying annual rent, cheque cadence, security deposit, maintenance cap, and special terms.
   - _Output:_ Structured tenancy term sheet.
   - _Verify:_ Ensure rent amount matches written word amounts.

#### 3.2 Statutory, Escrow & Brokerage Operational Tasks

5. **`T-FIN-001` — Escrow Account Balance & Milestone Verification:**
   - _Input:_ Developer project escrow ID & DLD project code.
   - _Process:_ Audit account balance against approved construction milestone percentage.
   - _Output:_ Escrow safety certificate & alert flags.
   - _Verify:_ Ensure project escrow balance $\ge$ required statutory retention.
6. **`T-REG-001` — Generate DLD Ejari Tenancy Contract & Certificate:**
   - _Input:_ Approved lease term sheet, tenant EID, landlord title deed.
   - _Process:_ Automated PDF generation conforming to unified Dubai Ejari standard.
   - _Output:_ Official Ejari draft ready for digital signature.
   - _Verify:_ Check all required Form B fields and RERA permit stamp.
7. **`T-CRM-001` — Trigger Automated WhatsApp Follow-Up Broadcast:**
   - _Input:_ Qualified lead ID, selected property brochure, agent schedule link.
   - _Process:_ Automated personalized message dispatch via `whatsapp-web.js`.
   - _Output:_ Message delivery status and thread initiation.
   - _Verify:_ Confirm valid UAE telephone formatting (`+971...`).

---

### 4. Turing Law T7: Migration & Zero-Breakage Standard

- Legacy `/dashboard2` remains intact as a fallback route.
- Each feature is cleanly wrapped as an executable task in `/dashboard/tasks`.
- Deletions in legacy code only occur after the task execution workbench passes automated tests.
