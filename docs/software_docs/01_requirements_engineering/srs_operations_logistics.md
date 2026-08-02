# Software Requirements Specification (SRS): Operations & Logistics

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
