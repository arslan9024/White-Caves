# Handover Management

> **Owner:** @Maya | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** VestaHandover module for snagging checklists, punch list tracking and keys issuance log.
> **Status:** Stub -- awaiting expansion by @Maya.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. Snagging Checklist Template

> _TODO: expand this section with full spec._

## 3. Punch List Tracking and Sign-Off Workflow

> _TODO: expand this section with full spec._

## 4. Handover Appointment Workflow

- Multi-party scheduling (buyer, agent, developer rep).
- Time slot locking and reminder notifications.

## 5. Defect Classification

- Categories: structural, electrical, plumbing, finishing, appliances.
- Severity levels with SLA expectations.

## 6. Snagging Report Generation

- PDF report with photos, defect details, and deadlines.
- Versioning for reinspection cycles.

## 7. Keys and Access Issuance

- Track key IDs, remotes, access cards.
- Signature capture on issuance and return.

## 8. DEWA and Utility Tracking

- Application reference, meter status, activation date.
- Escalation for delayed utility activation.

## 9. API Contract

- `POST /api/handover/checklists`
- `PATCH /api/handover/punch-list/:id`
- `POST /api/handover/appointments`

## 10. Acceptance Criteria

- Full snagging lifecycle captured with auditability.
- Punch-list closure requires verification evidence.
- Keys/utilities checklist complete before final handover.

## 11. Test Plan

- Defect lifecycle tests from open to sign-off.
- Reinspection and deadline breach scenarios.
- Appointment conflict and reminder delivery tests.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
