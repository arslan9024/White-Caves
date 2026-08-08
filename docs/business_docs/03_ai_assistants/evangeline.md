# Evangeline — Legal Risk Analyst

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Legal  
> **ID:** `evangeline`  
> **Color:** #DC2626  
> **Avatar:** 👩‍⚖️
> **Status:** Active — requirement catalog expanded.

---

## Overview
Proactively identifies, documents, and helps resolve legal issues. Monitors contracts, regulations, and transaction compliance.

## Requirement catalog

### REQ-EVAN-001: Legal risk identification and scoring

The system shall identify legal risk indicators and assign severity bands for triage.

**Acceptance criteria:**

- [ ] Risk records include source, severity, and owner
- [ ] Critical risks generate immediate escalation signals
- [ ] Risk status changes are audit-tracked

**Evidence:** legal risk register and escalation log.

### REQ-EVAN-002: Contract compliance monitoring

The system shall monitor contracts for clause, deadline, and obligation compliance.

**Acceptance criteria:**

- [ ] Contracts expose compliance checkpoints and deadlines
- [ ] Missed obligations are flagged before breach windows
- [ ] Variance actions are documented with reviewer identity

**Evidence:** contract compliance report and obligation audit trail.

### REQ-EVAN-003: Regulatory change tracking

The system shall track applicable legal/regulatory updates and map them to impacted workflows.

**Acceptance criteria:**

- [ ] Regulatory updates include effective date and scope
- [ ] Impacted policies/workflows are linked
- [ ] Acknowledgement and rollout actions are traceable

**Evidence:** regulatory update ledger and policy linkage record.

### REQ-EVAN-004: Dispute prevention and best-practice guidance

The system shall publish legal best-practice guidance and preventive controls for common dispute patterns.

**Acceptance criteria:**

- [ ] Guidance entries are versioned and reviewable
- [ ] Preventive controls map to dispute categories
- [ ] Usage/adoption signals are observable

**Evidence:** guidance library snapshot and control adoption report.

## Traceability

- Maps to `REQ-LGL-001` through `REQ-LGL-004` and `REQ-COMP-001`
- Aligns to `WC-SRS-006` and legal-governance artifacts
- Feeds contract, compliance, and dispute-prevention validation

## Capabilities
- Legal risk analysis
- Contract monitoring
- Regulatory tracking
- Dispute prevention
- Best practices library

## API Endpoints
- `/api/legal`
- `/api/risks`
- `/api/contracts`

## Data Flows
- **Receives from:** Laila, Theodora, Clara
- **Sends to:** Zoe, Laila

## Access Control
- **Viewable by:** Owner, Admin, Legal Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Full
