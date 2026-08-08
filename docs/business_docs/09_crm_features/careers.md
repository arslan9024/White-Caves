# Careers Module Specification

> **Owner:** @Rachel
> **Purpose:** Hiring workflow and talent pipeline management for White Caves.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM careers module feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend hiring workflow/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

## 1. Overview

Careers module supports job posting, applications, and hiring pipeline tracking.

## 1.1 Requirement catalog

### REQ-HR-001: Job posting management

The system shall allow HR users to create, edit, publish, pause, and close job postings.

**Acceptance criteria:**

- [ ] Job postings include title, department, location, type, and status
- [ ] Posting status changes are audited
- [ ] Published jobs appear on the careers portal immediately

**Evidence:** job posting record and publication audit log.

### REQ-HR-002: Candidate application capture

The system shall collect candidate applications with CV, cover letter, certifications, and contact details.

**Acceptance criteria:**

- [ ] Application form accepts required profile and file attachments
- [ ] Missing required fields block submission
- [ ] Submission acknowledgement is sent to candidate

**Evidence:** application payload and confirmation log.

### REQ-HR-003: Hiring pipeline management

The system shall track candidate progression through screening, interview, offer, hired, and rejected states.

**Acceptance criteria:**

- [ ] Pipeline stages are visible on the hiring board
- [ ] Stage transitions are timestamped and attributed
- [ ] Rejected candidates retain auditable history

**Evidence:** hiring board snapshot and transition history.

### REQ-HR-004: Interview scheduling and feedback

The system shall support interview scheduling with calendar sync, reminders, and structured feedback capture.

**Acceptance criteria:**

- [ ] Interview slots can be scheduled against interviewer availability
- [ ] Reminder notifications are sent before the interview
- [ ] Feedback is captured and linked to the candidate record

**Evidence:** calendar event record and interview feedback log.

### REQ-HR-005: Role and compliance visibility

The system shall enforce role-based access and retention rules for candidate and employee records.

**Acceptance criteria:**

- [ ] Sensitive documents are visible only to authorized HR roles
- [ ] Consent and retention metadata are stored with the application
- [ ] Archived records respect the retention policy

**Evidence:** access-control audit and retention policy log.

## 2. Job Listing Schema

Title, department, location, type, license requirements, status.

## 3. Application Form Fields

Candidate profile, CV upload, cover letter, portfolio, certifications.

## 4. Hiring Pipeline Stages

Applied -> Screening -> Interview -> Offer -> Hired/Rejected.

## 5. Interview Scheduling

Calendar sync, interviewer assignment, reminders, and feedback capture.

## 6. Compliance and Documentation

Consent, document retention, and role-based visibility.

## 7. Analytics and KPIs

Time-to-hire, source effectiveness, stage conversion rates.

## 8. Acceptance Criteria and Tests

End-to-end application lifecycle is trackable and auditable.

## 9. Traceability

- Business owner: HR Manager / Talent Ops
- SRS counterpart: `WC-SRS-018` and `WC-SRS-016`
- Related upstream requirements: `POL-PDPL-001`, `SEC-DATA-001`
- Validation surfaces: careers portal audit trail, application pipeline, interview scheduling log
