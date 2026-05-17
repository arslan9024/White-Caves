# Maintenance Management

> **Owner:** @Corinne | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Tenant maintenance request system with contractor assignment, SLA tracking and landlord approval.
> **Status:** Stub -- awaiting expansion by @Corinne.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. Maintenance Request Schema

> _TODO: expand this section with full spec._

## 3. Contractor Assignment and SLA Breach Alerts

> _TODO: expand this section with full spec._

## 4. Ticket Lifecycle

- States: open, assigned, scheduled, in_progress, completed, cancelled.
- State transitions enforce timestamp and actor logging.
- Reopen path available with root-cause requirement.

## 5. Priority and SLA Matrix

- Emergency: 4h response.
- High: 24h response.
- Medium: 72h response.
- Low: 7 days response.

## 6. Landlord Approval Workflow

- Repairs above threshold require landlord approval before execution.
- Approval via portal and WhatsApp one-click action.
- Timeout escalation to manager if no response.

## 7. Contractor Management

- Approved contractor pool by specialization.
- Availability and rating influence auto-assignment.
- Invoice and completion proof attachment required.

## 8. API Contract

- `POST /api/maintenance`
- `PATCH /api/maintenance/:id/assign`
- `PATCH /api/maintenance/:id/status`
- `POST /api/maintenance/:id/approve-cost`

## 9. Tenant Communication

- Auto-acknowledgement on ticket creation.
- Schedule and status updates pushed to tenant.
- Closure message includes rating prompt.

## 10. KPI Dashboard

- Open ticket count by priority.
- SLA breach rate.
- Mean time to resolve.
- Tenant satisfaction score.

## 11. Acceptance Criteria

- SLA alerts trigger on threshold breach.
- Approval gate enforced for high-cost repairs.
- Status and communication logs are complete.
- Contractor assignment rules execute deterministically.

## 12. Test Plan

- Emergency ticket fast-path handling.
- Approval timeout escalation.
- Contractor reassignment after decline.
- End-to-end closure with rating capture.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
