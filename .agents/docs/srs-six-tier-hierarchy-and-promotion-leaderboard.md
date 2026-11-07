# Software Requirements Specification (SRS)

## Six-Tier Corporate Hierarchy (L0–L5) & Gamified Promotion Leaderboard Engine

**Document Reference:** `SRS-CORP-HIERARCHY-LEADERBOARD-002`  
**Standard Compliance:** AEGIS Canonical 7-Category Architecture Standard & Single Purpose File Law (< 350 lines)  
**Governance Protocol:** Bhakti Protocol & Turing Protocol (Spatial Anchoring & Universal Discrete Enumeration)  
**Author:** @Margaret (Strategic Planner) & @Ada (Chief Architect)  
**Status:** Approved & Implemented  
**Date:** 2026-11-05

---

### 1. Executive Summary

This specification formalizes the **Six-Tier Corporate Hierarchy (L0 to L5)** for **White Caves Real Estate LLC** and defines the **Gamified Meritocratic Promotion Engine** and **Real-Time Leaderboard System**.

Under the **Bhakti Protocol** and **Turing Protocol**:

1. **Spatial Coordinates are Fixed (Bhakti Law):** 12 Directors (`D01`–`D12`) and 108 Managers (`M01`–`M108`) are permanent corporate coordinates. Personnel and tasks are swapped or assigned into coordinates; deleted entities move into Unassigned Pools (`EMP-POOL`, `TASK-POOL`).
2. **Every Entity Counts with Universal Unique IDs (Turing Law):** Every personnel record, supervisor, manager, director, and task is assigned a discrete, non-conflicting unique ID (`MD-01`, `D01`–`D12`, `M01`–`M108`, `SUP-001`+, `EMP-001`+, `T001`+).
3. **Pure State Transitions ($\delta$):** Promotion from Employee to Supervisor, Manager, and Director is calculated mathematically via verifiable completed task points (XP).

---

### 2. Six-Tier Corporate Hierarchy Architecture (L0–L5)

```
========================================================================================
[L0] MANAGING DIRECTOR (MD / Board Governance)
  │  Scope: Corporate Strategy, Risk Governance, Equity, and Final Sign-Off
  ▼
[L1] DEPARTMENT DIRECTORS (12 Corporate Directors: D01 to D12)
  │  Scope: Departmental P&L, DLD/RERA Liaison, Strategic OKRs, Division Oversight
  ▼
[L2] DIVISION MANAGERS (108 Managers: M01 to M108 — 9 per Department)
  │  Scope: Functional Division Delivery, Process Workflows, Form Approvals
  ▼
[L3] OPERATIONAL SUPERVISORS (Team Leads & Field Controllers)
  │  Scope: Day-to-Day Team Direction, Task QA, SLA Compliance, Escalations
  ▼
[L4] FRONTLINE EMPLOYEES (Brokers, Specialists, Coordinators, Analysts)
  │  Scope: Direct Execution of Operational, Legal, Financial & Marketing Tasks
  ▼
[L5] OPERATIONAL & STATUTORY TASKS (Task Catalog: T001–T324+)
     Scope: Atomic Work Units (P0/P1/P2/P3 Priority with Strict SLA & Statutory Gates)
========================================================================================
```

---

### 3. Tier Definition & Organizational Matrix

| Tier Level       | Designation                       | Count / Capacity          | Primary Responsibilities                                                                                  | Data Source Reference                    |
| :--------------- | :-------------------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| **Level 0 (L0)** | **Managing Director (MD)**        | 1 (Executive Board)       | Overall company strategy, investor relations, corporate governance, ultimate dispute sign-off.            | Executive Council                        |
| **Level 1 (L1)** | **Department Directors**          | 12 Directors              | P&L ownership of the 12 core departments (D01 Leasing, D02 Secondary Sales, D03 Compliance, etc.).        | `File 1.csv`                             |
| **Level 2 (L2)** | **Division Managers**             | 108 Managers (9 per Dept) | Oversee the 9 functional task groups per department (e.g., Residential Leasing, Resale Listing, AML/KYC). | `File 1.csv` (`M01`–`M108`)              |
| **Level 3 (L3)** | **Operational Supervisors**       | 216+ Supervisors          | Lead specific operational cells, verify task execution quality, enforce SLAs, coach L4 staff.             | `File 1.csv` & `File 4.csv`              |
| **Level 4 (L4)** | **Employees & Specialists**       | Scalable (All Personnel)  | Execute frontline tasks (viewings, Trakheesi permits, Ejari, contracts, client calls, audits).            | `EmployeeManager.data.ts`                |
| **Level 5 (L5)** | **Operational & Statutory Tasks** | 324+ Atomic Tasks         | Explicit task units with SLA, frequency, statutory authority, and priority (P0, P1, P2, P3).              | `File 2.csv`, `File 3.csv`, `File 4.csv` |

---

### 4. Gamified Meritocratic Promotion Engine

#### 4.1. Task Experience Points (XP) Economy

Every task completed by an L4 employee generates verifiable Experience Points (XP) and updates their merit profile:

$$\text{Task XP} = \text{Base XP} \times (1 + \text{OnTime Bonus} + \text{ZeroDefect Bonus})$$

- **Base XP by Priority:**
  - **P0 (Critical / Statutory):** $100\text{ XP}$ (e.g., Trakheesi permit, Ejari registration, AML verification)
  - **P1 (High Operational):** $50\text{ XP}$ (e.g., Form A collection, lead qualification, viewing coordination)
  - **P2 (Standard Operational):** $25\text{ XP}$ (e.g., CRM hygiene, weekly report compilation, social post)
  - **P3 (Maintenance / Low):** $10\text{ XP}$ (e.g., photo tagging, celebration logs)
- **Multipliers:**
  - **On-Time SLA Bonus:** $+20\%$ if resolved $\ge 25\%$ before SLA deadline.
  - **Zero-Defect Statutory Compliance:** $+15\%$ for audit-validated perfection.

#### 4.2. Promotion Criteria Gates (Dummy & Production Standard)

```
[Level 4: Employee / Specialist]
       │
       ▼  Criteria: ≥ 25 Tasks Completed + ≥ 2,500 XP + ≥ 90% SLA On-Time + Supervisor Endorsement
[Level 3: Operational Supervisor]
       │
       ▼  Criteria: ≥ 75 Team Tasks Supervised + ≥ 7,500 XP + ≥ 95% SLA + Leadership Score ≥ 85/100
[Level 2: Division Manager]
       │
       ▼  Criteria: ≥ 200 Division Tasks Delivered + ≥ 20,000 XP + ≥ 98% SLA + Dept P&L/OKR Cleared
[Level 1: Department Director]
       │
       ▼  Criteria: Outstanding Leadership + Board Approval + MD Nomination
[Level 0: Managing Director / Executive Council]
```

---

### 5. Gamified Leaderboard Architecture

The **Leaderboard View** provides transparent, real-time meritocracy across the enterprise:

1. **Podium Deck:** Top 3 performers celebrated with Gold, Silver, and Bronze badges.
2. **Dynamic Ranking Table:** Filterable by Department (`D01`–`D12`), Tier Level (`L1`–`L4`), and Timeframe (Weekly, Monthly, All-Time).
3. **Promotion Progress Meters:** Visual progress bars displaying exact XP distance and remaining tasks needed for the next tier promotion.
4. **Promotion Action Drawer:** When an employee meets all criteria, a prominent `PROMOTE NOW` badge triggers the pure 4-stage workflow to advance their tier.

---

### 6. Architectural Compliance Checklist

- [x] **AEGIS 7-Category Compliance:** View, Logic, Styles, Data, Config/Types, Tests, Workflows cleanly separated.
- [x] **Single Purpose File Law:** All files strictly $< 350$ lines.
- [x] **Zero-Delete Preservation Law:** Demotions and lateral shifts retain full historical merit records.
- [x] **Bhakti Protocol Integrity:** Department and Manager coordinates remain permanent anchors.
