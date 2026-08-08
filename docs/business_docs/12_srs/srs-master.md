# Software Requirements Specification (SRS)
# White Caves Real Estate CRM Platform

> **Document ID:** WC-SRS-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Status:** Approved  
> **Standard:** Based on IEEE Std 830-1998 / ISO/IEC 25010  
> **Author:** Technical & Product Teams, White Caves Real Estate LLC  
> **Classification:** Internal — Confidential

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [External Interface Requirements](#3-external-interface-requirements)
4. [System Features (Functional Requirements Summary)](#4-system-features)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Constraints](#6-constraints)
7. [Assumptions and Dependencies](#7-assumptions-and-dependencies)
8. [Appendix](#8-appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete requirements for the **White Caves CRM Platform** — a cloud-based real estate Customer Relationship Management system for White Caves Real Estate LLC, Dubai, UAE.

This document is intended for:
- Development engineers implementing the system
- QA engineers writing and executing test plans
- Business stakeholders reviewing scope and coverage
- Regulatory bodies auditing the software's compliance capabilities
- Third-party integrators connecting external systems

### 1.2 Scope

The White Caves CRM Platform (hereafter "the System") is a full-stack web application that provides:

- **Lead & Sales Pipeline Management** — Capture, score, qualify, and convert real estate prospects
- **Property Inventory Management** — Manage 9,378+ property listings across DAMAC Hills 2 and greater Dubai
- **WhatsApp CRM** — Unified multi-agent WhatsApp inbox with AI bot automation
- **Tenancy & Lease Management** — Full rental lifecycle with Ejari compliance
- **Finance & Commission Management** — Transaction and agent commission tracking with approval workflows
- **Compliance Management** — RERA, DLD, KYC/AML, and UAE PDPL compliance
- **AI Assistant Hub** — 24 named AI assistants representing every business function
- **Executive Reporting** — Real-time KPIs and business intelligence

**Current SRS posture note:** This document is the formal business SRS wrapper for White Caves.
The counted canonical business requirement ledger remains `../05_requirements/functional-requirements.md`
plus active `REQ-PDPL-*` entries under `../10_design_system_and_security/uae-pdpl-compliance.md`.
The current authoritative baseline is **58 unique business `REQ-*` definitions**; this document will
be expanded toward the 12-department master SRS structure as the counted full-SRS program progresses.

**Out of Scope (this version):**

- Native iOS/Android mobile applications
- On-premises deployment
- Multi-company / multi-tenancy (single company deployment)
- IoT sensor integration (Sentinel — deferred to Phase F)

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| CRM | Customer Relationship Management |
| RERA | Real Estate Regulatory Agency (Dubai) |
| DLD | Dubai Land Department |
| Ejari | UAE government tenancy contract registration system |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| KYC | Know Your Customer |
| AML | Anti-Money Laundering |
| PDPL | UAE Personal Data Protection Law |
| BANT | Budget, Authority, Need, Timeline (lead qualification) |
| WABA | WhatsApp Business Account |
| BRN | Broker Registration Number (RERA agent license) |
| SPA | Sales & Purchase Agreement |
| NFR | Non-Functional Requirement |
| UI | User Interface |
| API | Application Programming Interface |
| SPA | Single Page Application (frontend context) |
| CDN | Content Delivery Network |
| ORM | Object-Relational Mapping |
| P&L | Profit and Loss |
| SAR | Suspicious Activity Report |
| PEP | Politically Exposed Person |
| UAT | User Acceptance Testing |
| SLA | Service Level Agreement |
| CSAT | Customer Satisfaction Score |

### 1.4 References

| Document | Location |
|----------|---------|
| Functional Requirements | `business_docs/05_requirements/functional-requirements.md` |
| Non-Functional Requirements | `business_docs/05_requirements/non-functional-requirements.md` |
| Business Rules | `business_docs/05_requirements/business-rules.md` |
| Compliance Requirements | `business_docs/05_requirements/compliance-requirements.md` |
| Integration Requirements | `business_docs/05_requirements/integration-requirements.md` |
| System Architecture | `business_docs/06_design_architecture/system-architecture.md` |
| Database Schema | `business_docs/06_design_architecture/database-schema.md` |
| API Reference | `business_docs/06_design_architecture/api-reference.md` |
| Implementation Plan | `business_docs/implementation-plan.md` |
| Business-to-Software SRS Bridge | `business_docs/12_srs/README.md` |
| Requirement Crosswalk | `plans/documentation/REQ_CROSSWALK.md` |
| Requirement Taxonomy Mapping | `business_docs/05_requirements/REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md` |
| Software Master SRS Structure | `software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md` |
| RERA Law No. 16 of 2007 | RERA official publications |
| UAE AML Law No. 20 of 2018 | UAE Federal Register |
| UAE PDPL Law No. 45 of 2021 | UAE Federal Register |

### 1.5 Overview

Section 2 describes the product perspective, user classes, and operating environment. Section 3 details external interface requirements. Section 4 summarises system features (full details in referenced documents). Section 5 defines non-functional requirements. Section 6 and 7 document constraints, assumptions, and dependencies.

The current version remains a legacy summary-oriented SRS and should be read together with the
counted requirement baseline and business-to-software bridge artifacts above.

---

## 2. Overall Description

### 2.1 Product Perspective

The White Caves CRM Platform is a **new standalone system** replacing a combination of manual processes, spreadsheets, and generic CRM tools previously used by the sales team. It interfaces with several external systems:

```text
┌──────────────────────────────────────────────────────┐
│                WHITE CAVES CRM                        │
│  (Web Application — cloud hosted, UAE data residency) │
└─────────────────┬────────────────────────────────────┘
                  │ External Interfaces
    ┌─────────────┼──────────────────────────┐
    │             │              │            │
    ▼             ▼              ▼            ▼
WhatsApp     PropertyFinder   Bayut      Firebase Auth
Cloud API    (listing sync)  (listing    (OAuth login)
(Meta)       + lead capture   sync +
                              lead
                              capture)
    │             │              │            │
    └─────────────┴──────────────┴────────────┘
                  │
    ┌─────────────┼─────────────────┐
    │             │                 │
    ▼             ▼                 ▼
  Stripe      SendGrid           ExchangeRate
 (Payments)  (Email)             (FX Rates)
```

### 2.2 Product Functions (Top-Level)

1. **User Authentication and Role-Based Access Control**
2. **Lead Capture and Pipeline Management**
3. **Property Inventory Management**
4. **WhatsApp Communication Hub (Multi-Agent + Bot)**
5. **Sales Transaction and Deal Tracking**
6. **Lease and Tenancy Management**
7. **Commission Calculation and Approval**
8. **Financial Reporting and KPIs**
9. **Compliance Management (KYC/AML/RERA)**
10. **Executive Dashboard and Analytics**
11. **AI Assistant Hub (24 Named Assistants)**
12. **System Administration and Configuration**

### 2.2A Enterprise SRS alignment direction

The active upgrade path for this SRS is to align its long-form structure with the 12-department
master contract defined in `software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`.
That means future full-SRS expansion should group requirements and traceability by these
departmental lanes:

1. Executive Council & Strategy
2. Sales & Brokerage
3. Leasing & Tenancy
4. Property & Facilities Operations
5. Finance, Treasury & Revenue Assurance
6. Compliance, Regulatory & Risk
7. Legal, Disputes & Contracts
8. Marketing, Growth & Brand
9. Communications, Client Care & WhatsApp
10. Technology, Platform & DevOps
11. Data, AI & Business Intelligence
12. HR, Talent & Workforce Operations

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Skill | Frequency |
|-----------|-------------|-----------------|-----------|
| **Owner / MD** | Managing Director; views all KPIs and approves strategic decisions | Low–Medium | Daily (read) |
| **Admin** | System administrator; manages users, settings, access | High | Weekly |
| **Sales Manager** | Manages sales team, approves commissions, reviews pipeline | Medium | Daily |
| **Sales Agent** | Creates leads, manages pipeline, arranges viewings | Medium | Daily |
| **Leasing Manager** | Manages leasing team, approves leases | Medium | Daily |
| **Leasing Agent** | Manages tenant applications, creates leases | Medium | Daily |
| **Finance Director** | Manages commissions, reconciliation, P&L reporting | Medium | Daily |
| **Compliance Officer** | Reviews KYC, manages AML, RERA compliance | Medium | Weekly |
| **HR Manager** | Manages employee profiles and credentials | Medium | Weekly |
| **Marketing Manager** | Creates campaigns, reviews analytics | Medium | Weekly |
| **Landlord** | Views own properties and lease data (limited portal) | Low | Monthly |
| **Tenant** | Views own lease and payment schedule (limited portal) | Low | Monthly |

### 2.4 Operating Environment

| Component | Environment |
|-----------|-------------|
| Frontend hosting | Vercel (CDN, global edge) |
| API hosting | Railway / Render / AWS ECS (Node.js container) |
| Database | MongoDB Atlas (UAE North region, M20+ tier) |
| File storage | AWS S3 or Cloudflare R2 (UAE region) |
| Browser support | Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ |
| Mobile | Responsive web (360px+); PWA (Phase F) |
| Screen readers | Compliant (WCAG 2.1 AA) |

### 2.5 Design and Implementation Constraints

1. **UAE Data Residency**: All personal data must reside in UAE or GCC cloud regions (PDPL requirement).
2. **HTTPS Only**: All traffic must use HTTPS with TLS 1.2 minimum.
3. **RERA Compliance**: Property listings must carry valid RERA permit numbers.
4. **AML Threshold**: EDD mandatory for all transactions above AED 55,000.
5. **Ejari Mandatory**: Active leases cannot exist without Ejari registration numbers.
6. **React 18 + TypeScript**: Frontend must use this stack; no class components.
7. **MongoDB with Prisma ORM**: No raw MongoDB queries in application code; use Prisma client only.
8. **No Secrets in Code**: All credentials via environment variables; never committed to Git.

### 2.6 User Documentation

The following user documentation is provided:
- This SRS (technical reference)
- User stories (`business_docs/05_requirements/user-stories.md`)
- API Reference (`business_docs/06_design_architecture/api-reference.md`)
- UI/UX Specification (`business_docs/06_design_architecture/ui-ux-specification.md`)
- Deployment Runbook (`business_docs/14_devops/deployment-runbook.md`)

### 2.7 Assumptions and Dependencies

Refer to Section 7 for the complete list.

---

## 3. External Interface Requirements

### 3.1 User Interfaces

**UI-1: Login Screen**
- Email/password form with "Remember me" checkbox
- "Sign in with Google" button (Firebase)
- "Forgot password" link
- Error states for invalid credentials (no user enumeration)

**UI-2: CRM Dashboard (Role-Adaptive)**
- Left sidebar navigation with role-appropriate menu items
- Top header with user avatar, notifications, and role indicator
- Main content area with KPI cards and data tables
- Responsive: sidebar collapses to hamburger on ≤ 1024px viewport

**UI-3: Lead Management (Clara)**
- Tabbed view: Kanban pipeline | List view | Analytics
- Filter bar: status, source, score, assigned agent, date range
- Lead card: name, score badge, source icon, last activity
- Detail drawer: full lead info + activity timeline + quick actions

**UI-4: Property Inventory (Mary)**
- Grid / list toggle
- Filter bar with all property attributes
- Property card: primary image, title, price, beds/baths, status badge
- Detail page: image gallery, specs, map, linked leads

**UI-5: WhatsApp Inbox (Nadia)**
- Split-pane: conversation list (left) + message thread (right)
- Conversation status indicators: online/away agent badges
- Template picker modal
- Bot handover toggle per conversation

**UI-6: Finance Dashboard (Theodora)**
- KPI summary cards row
- Commission list table with bulk actions
- Charts: revenue trend, commission by agent

**UI-7: AI Assistant Hub**
- Grid of 24 assistant cards with avatar, name, status
- Click to open assistant detail: capabilities, endpoints, plan editor

### 3.2 Hardware Interfaces

Not applicable. The system is entirely web-based and cloud-hosted.

### 3.3 Software Interfaces

| Interface | Protocol | Format | Auth Method |
|-----------|---------|--------|-------------|
| Meta WhatsApp Cloud API | HTTPS/REST | JSON | Bearer token (Meta system user) |
| PropertyFinder API | HTTPS/REST | XML or JSON | API Key |
| Bayut API | HTTPS/REST | XML or JSON | API Key |
| Firebase Auth | HTTPS/REST + SDK | JSON | Firebase Admin SDK (service account) |
| Stripe | HTTPS/REST + Webhooks | JSON | Secret Key + HMAC webhook |
| SendGrid | HTTPS/REST | JSON | API Key |
| ExchangeRate-API | HTTPS/REST | JSON | API Key |
| MongoDB Atlas | TCP (Prisma ORM) | BSON | Database URI (env var) |

### 3.4 Communication Interfaces

- All client-server communication: HTTPS with TLS 1.3 preferred
- WebSocket (future): Real-time WhatsApp message notifications
- Webhooks (inbound): Meta WhatsApp, PropertyFinder, Bayut, Stripe — all HMAC-verified
- Email (SMTP): Via SendGrid API
- MongoDB Atlas: TCP connection over TLS

---

## 4. System Features

This section summarises the major system features. Full requirement details, acceptance criteria, and implementation status are documented in `business_docs/05_requirements/functional-requirements.md`.

### 4.1 Authentication & User Management
**Priority:** Critical

The system shall support:
- Email/password login with JWT token issuance (REQ-AUTH-001)
- Google OAuth via Firebase (REQ-AUTH-003)
- TOTP-based 2FA (REQ-AUTH-002)
- Role-based access control across 22 user roles (REQ-AUTH-004)
- Password reset via email link (REQ-AUTH-005)
- User profile management (REQ-AUTH-006)

### 4.2 Lead Management (Clara CRM)
**Priority:** Critical

The system shall support:
- Lead creation from multiple entry points (REQ-LEAD-001)
- Filtered lead list with pagination (REQ-LEAD-002)
- Lead detail with activity timeline (REQ-LEAD-003)
- Kanban pipeline with drag-and-drop (REQ-LEAD-004)
- Automatic lead scoring (REQ-LEAD-005)
- Activity logging (REQ-LEAD-006)
- Lead assignment and routing (REQ-LEAD-007)
- Excel/CSV import (REQ-LEAD-008)
- Export (REQ-LEAD-009)
- Follow-up reminders (REQ-LEAD-010)

### 4.3 Property Inventory (Mary CRM)
**Priority:** Critical

The system shall support:
- Property CRUD with RERA permit enforcement (REQ-PROP-001 to REQ-PROP-008)
- Advanced filtered search (REQ-PROP-002)
- Media upload (photos, videos, floor plans) (REQ-PROP-005)
- Bulk import from Excel (REQ-PROP-006)
- Portal syndication to PropertyFinder and Bayut (REQ-PROP-008)

### 4.4 WhatsApp Communication (Nadia + Nina)
**Priority:** Critical

The system shall support:
- Multi-agent inbox (REQ-WA-001)
- Approved message templates (REQ-WA-002)
- Lead creation from WhatsApp (REQ-WA-003)
- Automated bot with escalation (REQ-WA-004)
- Broadcast campaigns (REQ-WA-005)

### 4.5 Sales Pipeline & Transactions (Sophia)
**Priority:** Critical

The system shall support:
- Visual pipeline dashboard (REQ-PIPELINE-001)
- Transaction CRUD (REQ-PIPELINE-002)
- Sales forecasting (REQ-PIPELINE-003)
- Commission calculation (REQ-PIPELINE-004)

### 4.6 Finance Management (Theodora)
**Priority:** High

The system shall support:
- Commission management with approval workflow (REQ-FIN-001)
- Financial summary dashboard (REQ-FIN-002)
- Financial report export (REQ-FIN-003)
- Rent collection tracking (REQ-FIN-004)

### 4.7 Tenant & Lease Management (Daisy)
**Priority:** High

The system shall support:
- Tenant onboarding with KYC document upload (REQ-TENANT-001)
- Lease agreement management (REQ-TENANT-002)
- Ejari registration tracking (REQ-TENANT-003)
- Maintenance request management (REQ-TENANT-004)

### 4.8 Compliance Management (Laila)
**Priority:** Critical

The system shall support:
- RERA compliance dashboard (REQ-COMP-001)
- KYC verification workflow with AML screening (REQ-COMP-002)
- Immutable audit log (REQ-COMP-003)

### 4.9 Reporting & Analytics (Zoe)
**Priority:** High

The system shall support:
- Executive dashboard (REQ-RPT-001)
- Agent performance reports (REQ-RPT-002)
- Property performance reports (REQ-RPT-003)

### 4.10 System Administration
**Priority:** High

The system shall support:
- User management (REQ-ADMIN-001)
- System settings configuration (REQ-ADMIN-002)
- Database backup and restore (REQ-ADMIN-003)

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Requirement | Target | Reference |
|-------------|--------|-----------|
| API read (list) p95 | < 300 ms | NFR-PERF-001 |
| API write p95 | < 500 ms | NFR-PERF-001 |
| Frontend initial load | < 3 s on 4G | NFR-PERF-002 |
| Concurrent active users | 500 without degradation | NFR-PERF-003 |
| WhatsApp webhook acknowledgement | < 5 seconds | REQ-WA-001 |

### 5.2 Security

| Requirement | Standard | Reference |
|-------------|---------|-----------|
| Password hashing | bcrypt cost factor ≥ 12 | NFR-SEC-001 |
| Transport security | TLS 1.2 minimum, HSTS enforced | NFR-SEC-002 |
| Input sanitisation | All API inputs | NFR-SEC-003 |
| Data at rest encryption | AES-256 (MongoDB Atlas) | NFR-SEC-004 |
| Audit logging | All mutations, logins | NFR-SEC-005 |
| Rate limiting | Per IP, per endpoint | NFR-SEC-003 |

### 5.3 Reliability and Availability

| Requirement | Target |
|-------------|--------|
| System uptime | 99.5% monthly |
| Data durability | Zero data loss for committed writes |
| Backup frequency | Daily automated |
| Recovery point objective (RPO) | 1 hour |
| Recovery time objective (RTO) | 2 hours (P1 incident) |
| Planned maintenance | Sundays 02:00–04:00 UAE time |

### 5.4 Scalability

The system must support the following data growth projections without architectural changes:

| Entity | Year 1 | Year 3 |
|--------|--------|--------|
| Properties | 15,000 | 50,000 |
| Leads | 30,000 | 100,000 |
| Users | 100 | 300 |
| WhatsApp messages/month | 200,000 | 1,000,000 |

### 5.5 Usability

- Responsive: desktop (1920×1080) through tablet (1024×768)
- WCAG 2.1 Level AA accessibility
- English (default) and Arabic (RTL) language support (Phase F)
- All async operations show loading states
- Form errors displayed inline at the field level

### 5.6 Maintainability

- TypeScript strict mode throughout
- ESLint + Prettier enforced in CI
- Minimum 80% unit test coverage for business logic
- Zero-downtime deployments
- All APIs documented in API reference

### 5.7 Legal and Regulatory

| Law | Requirement | Reference |
|-----|-------------|-----------|
| RERA Law No. 16/2007 | Permit number on all listings | COMP-RERA-001 |
| UAE AML Law No. 20/2018 | KYC + EDD + SAR + 5-year retention | COMP-AML-001–005 |
| UAE PDPL Law No. 45/2021 | Consent, data rights, residency | COMP-PDPL-001–005 |
| Dubai Decree No. 26/2013 | Ejari mandatory for all leases | COMP-EJARI-001 |

---

## 6. Constraints

### 6.1 Regulatory Constraints
- RERA broker license must be displayed on all listings and agent profiles
- AML records must be retained for 5 years; system must prevent deletion
- Ejari number required before any lease can be activated
- PDPL: data collected must not be transferred outside UAE/GCC without adequate safeguards

### 6.2 Technical Constraints
- MongoDB is the only database (no PostgreSQL or relational DB)
- Prisma ORM v5.x — schema changes require migration files
- React 18 + TypeScript + Vite build stack (cannot switch frameworks)
- JWT expiry 24 hours; cannot be extended without re-authentication
- WhatsApp free-form messages restricted to 24-hour conversation window (Meta policy)

### 6.3 Business Constraints
- Only AED-denominated transactions in system core; other currencies display-only
- Commission rates configurable but minimum 1%; maximum 10%
- All agent actions visible to manager and owner roles
- Financial data accessible only to Finance Director and Owner

### 6.4 Resource Constraints
- API rate limits from third parties must be respected (WhatsApp: 80 msg/sec/number, PropertyFinder: per agreement)
- File uploads capped at 50 MB per file, 500 MB per property

---

## 7. Assumptions and Dependencies

### 7.1 Assumptions

1. White Caves Real Estate LLC has a valid RERA broker license throughout the system's operation.
2. Meta WhatsApp Business Account (WABA) will be approved before Phase C deployment.
3. PropertyFinder and Bayut partner agreements will be signed before Phase D portal syndication.
4. At least one dedicated server/hosting account will be maintained for production deployment.
5. All staff will have internet-connected devices with modern web browsers.
6. Company banking relationship supports outbound bank transfers for commission payments.
7. UAE FIU goAML portal access has been registered for SAR submissions.

### 7.2 Dependencies

| Dependency | Type | Risk if Unavailable |
|-----------|------|-------------------|
| MongoDB Atlas | Infrastructure | System inoperable |
| Firebase Auth | External service | Google OAuth login fails; email/password still works |
| Meta WhatsApp Cloud API | External service | WhatsApp features unavailable |
| SendGrid | External service | Transactional emails fail |
| PropertyFinder API | External service | Portal sync unavailable |
| Bayut API | External service | Portal sync unavailable |
| Stripe | External service | Online payments unavailable |
| ExchangeRate-API | External service | Currency conversion shows cached/stale rates |
| Vercel | Hosting | Frontend unavailable |
| ComplyAdvantage (AML) | External service | Manual KYC review required |

---

## 8. Appendix

### 8.0 Counted requirement baseline and expansion target

| Metric | Value | Notes |
|--------|------:|-------|
| Current unique business `REQ-*` definitions | 58 | Canonical baseline for counted-SRS program |
| Current `REQ-*` headings | 63 | Includes enhanced/duplicate headings |
| Duplicate/enhanced headings excluded from total | 5 | Do not increment canonical requirement count |
| Canonical software-side `REQ-*` definitions | 0 | Software docs are downstream mirrors during business-first expansion |
| First complete business SRS target | 420-650 | Target band for the first enterprise-grade counted SRS wave |

### 8.0A Counting rules

- Count only unique canonical business requirement definitions.
- Do not count scenario references, software-doc references, or enhanced appendix headings toward the canonical total.
- Preserve `REQ-*` IDs as stable business identifiers even as software taxonomy expands to `FR/BR/NFR/POL/INT/SEC/OBS/AC`.

### 8.0B First-wave family numbering ranges (governance baseline)

| Family | Approved range |
|--------|----------------|
| `REQ-EXEC-*` | `REQ-EXEC-001..015` |
| `REQ-AUTH-*` | `REQ-AUTH-001..020` |
| `REQ-ADMIN-*` | `REQ-ADMIN-001..020` |
| `REQ-CLIENT-*` | `REQ-CLIENT-001..020` |
| `REQ-LEAD-*` | `REQ-LEAD-001..040` |
| `REQ-TASK-*` | `REQ-TASK-001..015` |
| `REQ-PROP-*` | `REQ-PROP-001..035` |
| `REQ-SENTINEL-*` | `REQ-SENTINEL-001..015` |
| `REQ-PIPELINE-*` | `REQ-PIPELINE-001..025` |
| `REQ-OFFER-*` | `REQ-OFFER-001..020` |
| `REQ-VIEWING-*` | `REQ-VIEWING-001..020` |
| `REQ-COMMISSION-*` | `REQ-COMMISSION-001..020` |
| `REQ-FIN-*` | `REQ-FIN-001..025` |
| `REQ-CURRENCY-*` | `REQ-CURRENCY-001..010` |
| `REQ-TENANCY-*` | `REQ-TENANCY-001..030` |
| `REQ-EJARI-*` | `REQ-EJARI-001..015` |
| `REQ-PORTAL-TENANT-*` | `REQ-PORTAL-TENANT-001..015` |
| `REQ-PORTAL-LANDLORD-*` | `REQ-PORTAL-LANDLORD-001..015` |
| `REQ-MAINT-*` | `REQ-MAINT-001..025` |
| `REQ-HANDOVER-*` | `REQ-HANDOVER-001..020` |
| `REQ-COMMUNITY-*` | `REQ-COMMUNITY-001..015` |
| `REQ-COMP-*` | `REQ-COMP-001..020` |
| `REQ-PDPL-*` | `REQ-PDPL-001..020` |
| `REQ-AML-*` | `REQ-AML-001..015` |
| `REQ-RERA-*` | `REQ-RERA-001..015` |
| `REQ-LEGAL-*` | `REQ-LEGAL-001..025` |
| `REQ-DLD-*` | `REQ-DLD-001..020` |
| `REQ-DOC-*` | `REQ-DOC-001..020` |
| `REQ-MKT-*` | `REQ-MKT-001..020` |
| `REQ-MARKET-*` | `REQ-MARKET-001..020` |
| `REQ-WA-*` | `REQ-WA-001..030` |
| `REQ-EMAIL-*` | `REQ-EMAIL-001..015` |
| `REQ-FOLLOWUP-*` | `REQ-FOLLOWUP-001..020` |
| `REQ-AI-*` | `REQ-AI-001..020` |
| `REQ-ANALYTICS-*` | `REQ-ANALYTICS-001..025` |
| `REQ-RPT-*` | `REQ-RPT-001..020` |
| `REQ-OFFPLAN-*` | `REQ-OFFPLAN-001..025` |
| `REQ-SECONDARY-*` | `REQ-SECONDARY-001..020` |
| `REQ-INVEST-*` | `REQ-INVEST-001..020` |
| `REQ-PROSPECT-*` | `REQ-PROSPECT-001..020` |
| `REQ-OPS-*` | `REQ-OPS-001..015` |
| `REQ-HR-*` | `REQ-HR-001..015` |

### 8.1 Requirements Traceability Matrix (Summary)

| Req ID | Module | Priority | Status | Test Reference |
|--------|--------|----------|--------|---------------|
| REQ-AUTH-001–006 | Authentication | Critical–Medium | Implemented | UT-AUTH-001–006 |
| REQ-LEAD-001–010 | Lead Management | Critical–Medium | Impl/Planned | UT-LEAD-001–010 |
| REQ-PROP-001–008 | Properties | Critical–High | Impl/Planned | UT-PROP-001–008 |
| REQ-WA-001–005 | WhatsApp | Critical–Medium | Partial/Planned | UT-WA-001–005 |
| REQ-PIPELINE-001–004 | Pipeline/Transactions | Critical–High | Impl/Planned | UT-PIPE-001–004 |
| REQ-FIN-001–004 | Finance | Critical–High | Impl/Planned | UT-FIN-001–004 |
| REQ-TENANT-001–004 | Tenant/Lease | High–Medium | Partial/Planned | UT-TEN-001–004 |
| REQ-COMP-001–003 | Compliance | Critical–High | Partial/Planned | UT-COMP-001–003 |
| REQ-RPT-001–003 | Reporting | Critical–Medium | Impl/Planned | UT-RPT-001–003 |
| REQ-ADMIN-001–003 | Administration | Critical–High | Impl/Planned | UT-ADM-001–003 |

### 8.2 Change History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.1 | January 2026 | Product Team | Initial draft |
| 0.5 | February 2026 | Technical Team | Architecture confirmed, constraints added |
| 1.0 | March 2026 | Product + Technical | Full SRS approved |

---

**Document ID:** WC-SRS-001 | **Version:** 1.0 | **Classification:** Internal — Confidential  
**Next Review:** September 2026 | **Owner:** Product Team, White Caves Real Estate LLC
