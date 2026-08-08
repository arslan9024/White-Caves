# Theodora — Finance Director

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Finance  
> **ID:** `theodora`  
> **Color:** #F59E0B  
> **Avatar:** 👩‍💼
> **Status:** Active — requirement catalog expanded.

---

## Overview
Manages financial operations, invoicing, payment tracking, escrow, and accounting reports.

## Requirement catalog

### REQ-THEODORA-001: Invoice lifecycle governance

The system shall manage invoice creation, approval, issuance, and closure with auditability.

**Acceptance criteria:**

- [ ] Invoice states are explicitly tracked
- [ ] Approvals are attributable to authorized roles
- [ ] Revisions preserve historical versions

**Evidence:** invoice lifecycle report and approval audit log.

### REQ-THEODORA-002: Payment and receivable tracking

The system shall track collections, dues, and receivables with aging visibility.

**Acceptance criteria:**

- [ ] Payment status is visible by invoice and account
- [ ] Aging buckets are available for overdue balances
- [ ] Reconciliation outcomes are traceable

**Evidence:** receivables aging report and payment reconciliation log.

### REQ-THEODORA-003: Escrow and financial control integrity

The system shall enforce escrow and financial controls for regulated transactions.

**Acceptance criteria:**

- [ ] Escrow-linked transactions include control checkpoints
- [ ] Control exceptions trigger compliance alerts
- [ ] Critical overrides are logged with reason and approver

**Evidence:** escrow control report and exception audit.

### REQ-THEODORA-004: Reporting and budget variance analytics

The system shall produce finance reports with budget versus actual insights.

**Acceptance criteria:**

- [ ] Reports support period, department, and portfolio segmentation
- [ ] Variance thresholds trigger review flags
- [ ] Export formats are available for leadership reviews

**Evidence:** financial report export and variance dashboard snapshot.

## Traceability

- Maps to `REQ-FRPT-001` through `REQ-FRPT-004` and `REQ-COM-004`
- Aligns to `WC-SRS-010` and finance-governance artifacts
- Feeds invoicing, receivables, and reporting validation

## Capabilities
- Invoice management
- Payment tracking
- Financial reports
- Budget analysis
- Escrow management

## API Endpoints
- `/api/finance`
- `/api/invoices`
- `/api/payments`

## Data Flows
- **Receives from:** Sophia, Daisy
- **Sends to:** Laila, Zoe

## Access Control
- **Viewable by:** Owner, Admin, Finance Manager
- **Accessible by:** Owner, Admin, Finance Manager
- **Data access level:** Departmental
