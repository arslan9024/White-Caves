# Email Automation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** Automated email triggers via Resend API for lease reminders, rent due alerts and maintenance updates.
> **Status:** Stub -- awaiting expansion by @Annie.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. Automated Email Triggers

> _TODO: expand this section with full spec._

## 3. Resend API Integration and Retry Logic

> _TODO: expand this section with full spec._

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
