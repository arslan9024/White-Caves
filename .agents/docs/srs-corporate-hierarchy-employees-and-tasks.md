# Software Requirements Specification (SRS)

## Corporate Hierarchy, Employee Management & 200+ Core Tasks Engine

**System:** White Caves Real Estate LLC — Executive Operating System  
**Document ID:** `SRS-CORP-HIERARCHY-EMP-TASKS-2026-V1`  
**Standard:** Canonical 7-Category Architecture & Bhakti Protocol  
**Jurisdiction:** Dubai, UAE (RERA / DLD / DET / UAE Labor Law / FTA)

---

## 1. Executive Summary & Purpose

This specification governs the architectural expansion of the White Caves Executive Operating System to implement:

1. **4-Tier Corporate Hierarchy (150 Operational Units across 7 Pillars + Governance)**.
2. **Dedicated Employee Management System (Separated from Departments with Full CRUD)**.
3. **200+ Canonical Statutory & Operational Tasks Catalog** with strict 4-level reporting escalation:
   $$\text{Task} \longrightarrow \text{Supervisor (L3)} \longrightarrow \text{Division Manager (L2)} \longrightarrow \text{Department Director (L1)} \longrightarrow \text{Managing Director (L0)}$$
4. **Tri-Pane VS Code Sidebar Navigation**:
   - Icon 1: Explorer
   - Icon 2: AI Mesh
   - Icon 3: Documents / Henry OCR
   - Icon 4: Compliance & Audit
   - Icon 5: Departments Hub (12 Slots / 7 Pillars)
   - Icon 6: **Employees Hub** (Full Roster & CRUD)
   - Icon 7: **Tasks Hub** (200+ Dubai Statutory & Operational Tasks with Reporting Chains)
   - Icon 8: Settings

---

## 2. The 4-Tier Corporate Architecture

### Tier 1: Executive Management & Corporate Governance

- Office of the Managing Director & Strategy (Corporate Strategy, Board Relations, Risk Management)
- Corporate Secretariat & Executive Support (Executive Administration, Office Operations)

### Tier 2: The 7 Core Operational Pillars

1. **Pillar I: Legal, Regulatory & Government Relations (PRO)**
   - Real Estate Regulatory & Compliance (RERA Desk, DLD/Escrow Liaison, Ejari Registration)
   - Corporate Law & Risk Mitigation (Contracts, AML/KYC Desk, Rental Dispute Advisory)
   - Government Relations (Immigration/Visa Unit, DET Licensing, Notary/Legalization)
2. **Pillar II: Finance, Accounting & Financial Control**
   - General Accounting & Bookkeeping (GL, AP, AR)
   - Financial Planning & Treasury (FP&A, Treasury, Escrow & Trust Accounting)
   - Tax & Payroll Compliance (Corporate Tax & VAT 5%, Payroll WPS, External Audit)
3. **Pillar III: Human Capital, Recruitment & Culture**
   - Talent Acquisition & Onboarding (Headhunting, RERA Agent Licensing, Graduate Pipelines)
   - Employee Relations & Performance (KPI Tracking, Comp & Benefits, Labor Law Compliance)
   - Training & Development (Sales Training Academy, Leadership Development)
4. **Pillar IV: Sales Operations & Brokerage Divisions**
   - Residential Sales & Leasing (DAMAC Hills 2 Specialist, Primary Off-Plan, Secondary Resale, Leasing)
   - Luxury, Commercial & Specialized Sales (Ultra-Prime Desk, Commercial, Short-Term Homes)
   - Sales Support & Transaction Management (Lead Distribution, Mortgage Advisory, Snagging Unit)
5. **Pillar V: Marketing, Brand & Digital Growth**
   - Brand & Creative Production (Brand Strategy, Media/Drone Production, Copywriting)
   - Digital Performance & Growth (Meta/Google Paid Ads, Portal Management, SEO/Web)
   - Lead Generation & Events (Telesales/Inbound, Launch Events, Reputation Management)
6. **Pillar VI: Technology, CRM & Data Infrastructure**
   - Enterprise Software & CRM (CRM Admin, AI & Zapier Automation, Document Storage)
   - Infrastructure & Security (IT Helpdesk, Zero-Trust Cyber Security, BI Dashboards)
7. **Pillar VII: Customer Success, Property Management & Operations**
   - Post-Sale Client Experience (Onboarding/Concierge, Retention/LTV, QA Audit)
   - Property Management Operations (Tenant Relations, DEWA/Empower Settlement, Facility Vendors)
   - General Office Operations (Office Facilities, Asset & Inventory Control)

---

## 3. Dedicated Employee Management System (Separation of Concerns)

### 3.1 Motivation

Departments represent organizational mandates and slot structures (governed by the Bhakti Protocol). Personnel are dynamic assets assigned to departments, supervisors, and tasks. Separating the Employee module enables:

- Independent lifecycle management (hiring, onboarding, RERA exam verification, promotion, offboarding).
- Transferring employees between departments and pillars without mutating departmental slot numbers.
- Fine-grained commission tier, WPS compliance, and labor contract tracking.

### 3.2 Canonical Data Model (`EmployeeNode`)

- `_id`: string
- `employeeId`: string (e.g. `EMP-0142`)
- `fullName`: string
- `email`: string
- `phone`: string
- `designation`: string
- `roleTier`: `'EXECUTIVE' | 'DIRECTOR' | 'MANAGER' | 'SUPERVISOR' | 'SPECIALIST' | 'BROKER'`
- `pillarId`: string
- `departmentId`: string
- `supervisorId`: string
- `reraCardNumber`?: string
- `reraExpiry`?: string
- `status`: `'active' | 'onboarding' | 'probation' | 'leave' | 'standby'`
- `salaryOrCommission`: { baseSalaryAED: number; commissionRatePct: number }

---

## 4. Minimum 200 Statutory & Operational Tasks Catalog

### 4.1 Categorization Structure

The 200 tasks span the entire Dubai real estate brokerage lifecycle:

1. **Statutory & Regulatory (Tasks 1–35)**: DLD Form A/B/F/I, Ejari registration, RERA broker renewals, Escrow trustee approvals, AML compliance screening, STR holiday home permits.
2. **Financial, Tax & Trust (Tasks 36–65)**: 5% VAT filings, FTA invoice verification, WPS salary processing, broker commission disbursements, security deposit escrow holding, bank mortgage liaison.
3. **Primary & Secondary Brokerage (Tasks 66–110)**: DAMAC Hills 2 off-plan developer allocations, title deed conveyancing, NOC applications, VIP investor roadshows, secondary villa viewings, price negotiation logs.
4. **Marketing, Portals & Media (Tasks 111–145)**: Property Finder / Bayut / Dubizzle API syncing, 4K walkthrough video shoots, drone permit clearances, Google Ads campaign optimization, client testimonial verifications.
5. **Technology, AI & CRM Ops (Tasks 146–175)**: Lead routing rule calibration, Zapier webhook auditing, E-signature audit trails, zero-trust SSO enforcement, IoT telemetry alerts.
6. **Property Management, Snagging & Operations (Tasks 176–200+)**: Post-handover snagging reports, DEWA / Empower meter transfers, facility maintenance dispatch, move-in permit clearances, office inventory auditing.

### 4.2 Reporting Escalation Chain

Each task explicitly binds to:

- Assigned Execution Agent / Supervisor (`L3`)
- Tactical Reviewing Manager (`L2`)
- Strategic Governance Director (`L1`)
- Ultimate Sovereign Reviewer (`Managing Director / Board`)
