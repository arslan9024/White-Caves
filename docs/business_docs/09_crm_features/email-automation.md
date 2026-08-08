# Email Automation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** Automated email triggers via Resend API for lease reminders, rent due alerts and maintenance updates.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM email automation feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/integration-requirements.md`](../05_requirements/integration-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend communication/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The email automation module dispatches lease, maintenance, onboarding, and rent reminders through Resend with governed retry, consent, and logging rules.

## Requirement catalog

### REQ-EML-001: Triggered email workflows

The system shall send emails on configured tenancy and operational events.

**Acceptance criteria:**

- [ ] Lease expiry reminders can be scheduled at 90/60/30 days
- [ ] Rent due reminders can trigger before and on due dates
- [ ] Maintenance and onboarding emails are event-driven

**Evidence:** trigger log and message send record.

### REQ-EML-002: Retry and delivery reliability

The system shall retry transient email failures and record permanent failures.

**Acceptance criteria:**

- [ ] Retry attempts use capped backoff
- [ ] Dead-letter records are created for permanent failure
- [ ] Idempotency prevents duplicate sends

**Evidence:** retry log, dead-letter queue, and send audit.

### REQ-EML-003: Consent and unsubscribe handling

The system shall respect category-level consent and unsubscribe choices.

**Acceptance criteria:**

- [ ] Unsubscribe links are present in eligible emails
- [ ] Opt-out changes are persisted immediately
- [ ] Consent state is checked before every broadcast or workflow send

**Evidence:** consent record and unsubscribe audit.

### REQ-EML-004: CRM timeline logging and template governance

The system shall log delivery activity in the CRM timeline and use approved templates.

**Acceptance criteria:**

- [ ] Delivery status appears in the CRM activity trail
- [ ] Templates are versioned and categorized
- [ ] Delivery metrics can be reviewed by marketing and operations

**Evidence:** activity timeline entry and template registry.

## Traceability

- Maps to `REQ-MKT-AUT-001` through `REQ-MKT-AUT-004`
- Aligns to `WC-SRS-008`, `WC-SRS-009`, and email delivery artifacts
- Feeds reminders, consent, and delivery validation

## 2. Automated Email Triggers

Triggers should map to lease, rent, maintenance, and onboarding events with explicit delay rules and templates.

## 3. Resend API Integration and Retry Logic

Resend integration should include provider abstraction, retry/backoff control, and failure logging for all send attempts.

## 4. Template Catalog

- Lease expiry reminders.
- Rent due notices.
- Maintenance status updates.
- Tenant onboarding welcome emails.

## 5. Trigger Schedule

- Lease reminders at 90/60/30 days.
- Rent reminders at T-3 days and due date.
- Maintenance updates on each status change.

## 6. Delivery Reliability

- Retry attempts with backoff.
- Dead-letter tracking for failed sends.
- Idempotent send keys.

## 7. Unsubscribe and Consent

- One-click unsubscribe links.
- Category-level subscription controls.
- Consent logging for compliance.

## 8. Acceptance Criteria and Tests

- Trigger execution coverage for all scenarios.
- Retry and unsubscribe flows validated.
- Email activity logged in CRM timeline.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
