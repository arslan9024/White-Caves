# Software Requirements Specification (SRS): Operations & Logistics

<!-- markdownlint-disable MD022 MD032 -->

## 1. Scope & System Overview

The **Operations & Property Logistics Module** manages physical unit handovers, statutory Ejari contract renewals, Form 12 eviction legal notices, Post-Dated Cheque (PDC) vault management, and smart lock viewing logs across all managed units.

---

## 🎨 Brand Palette Enforcement

- Primary Red (`#EF4444`): Eviction warning banners, expiring Ejari alerts, urgent PDC notifications.
- Pure White (`#FFFFFF`): Property inspection forms and vault tables.
- Slate Text (`#1E293B`): Executive logs, contractor rating headers.

---

## 🔗 Inter-Linked Navigation References

- [Change Log](./change_log_v2026.md) — Requirements change tracking ledger and version history.
- [Database Design](../02_software_design/database_architecture_sdd.md) — System database schema, MongoDB indexes, and connection caching.

---

## 2. Detailed Functional Requirements

### 2.1 Statutory Form 12 Ejari Eviction Workflow
- **REQ-OPS-01**: Generate statutory Form 12 eviction notices for landlord personal use or property sale requiring 12 months' written notice as per Dubai Law No. 33 of 2008.
- **REQ-OPS-02**: Track 365-day statutory countdown tickers with automated milestone reminders at 180, 90, 60, and 30 days.

### 2.2 PDC Vault & Financial Instrument Management
- **REQ-OPS-03**: Securely track Post-Dated Cheques (PDC) deposited by tenants, recording bank code, cheque number, due date, AED amount, and clearance status.
- **REQ-OPS-04**: Alert property managers 7 days prior to cheque deposit due dates to ensure funds verification.

### 2.3 Smart Lock Viewing Log (Sentinel AI Integration)
- **REQ-OPS-05**: Log digital access events across managed units, capturing broker ID, timestamp, viewing duration, and access method.

### 2.4 P0 Leasing Operations Extension (MD + Leasing Agent)

- **REQ-OPS-06**: Leasing workflows shall enforce qualification → viewing → lease-signing → Ejari activation status continuity without skipped transitions.
- **REQ-OPS-07**: Lease activation shall remain blocked until mandatory Ejari and tenancy-compliance fields are complete.
- **REQ-OPS-08**: Payment-confirmed tenancy events shall publish receipt lifecycle checkpoints (issued, delivered, archived).
- **REQ-OPS-09**: MD oversight surfaces shall expose unresolved leasing operational blockers and receipt-related exceptions.

### 2.5 Traceability anchors for P0 extension

- Business linkage: `docs/business_docs/09_crm_features/tenancy-ejari.md`
- Listing linkage: `docs/business_docs/09_crm_features/sentinel-property.md`
- Workflow linkage: `docs/business_docs/04_workflows/rental-management-flowchart.md`
