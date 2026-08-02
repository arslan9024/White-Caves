# Maintenance Management

> **Owner:** @Corinne | **Tool:** DeepSeek Chat (DeepSeek V3)  
> **Purpose:** Tenant maintenance request system with contractor assignment, SLA tracking, landlord approval, and closure QA.  
> **Status:** ✅ Implementation-ready (P0 operations hardening)

---

## 1. Overview

The Maintenance module manages the full lifecycle of property issues from intake to verified closure. It is designed to protect tenant experience, maintain landlord trust, and enforce SLA-driven operations with auditable controls.

### Core outcomes

- Fast and deterministic handling of urgent and high-priority issues.
- Transparent cost and approval workflow for landlords.
- Controlled contractor assignment with quality checks.
- Clear communication at every stage for tenants and landlords.

---

## 2. Maintenance Request Schema

### Core fields

```typescript
MaintenanceRequest {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  agentId?: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'appliance' | 'pest' | 'other'
  priority: 'emergency' | 'high' | 'medium' | 'low'
  description: string
  photos?: string[]
  status: 'open' | 'assigned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'reopened'
  assignedContractorId?: string
  estimatedCostAed?: number
  approvedCostAed?: number
  requiresLandlordApproval: boolean
  scheduledAt?: Date
  resolvedAt?: Date
  resolutionNotes?: string
  tenantRating?: 1 | 2 | 3 | 4 | 5
  createdAt: Date
  updatedAt: Date
}
```

### Validation rules

- Priority and category are mandatory at ticket creation.
- Emergency tickets require immediate dispatch path eligibility.
- Photo attachments are optional but strongly recommended for diagnostics.

---

## 3. Contractor Assignment and SLA Breach Alerts

### Assignment model

- Auto-suggest contractor by category, area, availability, and quality score.
- Allow manual override with mandatory reason logging.
- Contractor declines trigger immediate reassignment queue.

### Alerting model

- SLA risk alert before breach threshold.
- Hard breach alert at threshold crossing.
- Escalation alerts to operations manager for unresolved high-risk tickets.

---

## 4. Ticket Lifecycle

- States: `open`, `assigned`, `scheduled`, `in_progress`, `completed`, `cancelled`, `reopened`.
- State transitions enforce timestamp and actor logging.
- Reopen path requires root-cause annotation and owner reassignment.

### Lifecycle controls

1. `open -> assigned`: contractor selected.
2. `assigned -> scheduled`: appointment confirmed.
3. `scheduled -> in_progress`: work started confirmation.
4. `in_progress -> completed`: evidence uploaded and QA checklist passed.
5. `completed -> reopened`: tenant/landlord challenge with reason.

---

## 5. Priority and SLA Matrix

| Priority  | First Action SLA | Resolution Target | Escalation Trigger         |
| --------- | ---------------- | ----------------- | -------------------------- |
| Emergency | < 1 hour         | < 4 hours         | Any delay beyond 2 hours   |
| High      | < 4 hours        | < 24 hours        | At 12-hour unresolved mark |
| Medium    | < 24 hours       | < 72 hours        | At 48-hour unresolved mark |
| Low       | < 48 hours       | < 7 days          | At 5-day unresolved mark   |

---

## 6. Landlord Approval Workflow

- Repairs above configured cost threshold require landlord approval before execution.
- Approval channels: landlord portal + WhatsApp one-click confirmation.
- No approval path fallback: manager escalation and policy-based hold handling.

### Approval timeline

- Approval request sent immediately after estimate creation.
- Reminder at configured interval if no response.
- Timeout triggers manager intervention queue.

---

## 7. Contractor Management

- Approved contractor pool by specialization and service area.
- Assignment confidence uses availability + rating + recent SLA adherence.
- Mandatory completion evidence: before/after proof + invoice + work notes.

### Contractor KPIs

- On-time arrival rate
- SLA compliance rate
- First-time fix rate
- Reopen rate per contractor

---

## 8. API Contract

- `POST /api/maintenance` — create request
- `PATCH /api/maintenance/:id/assign` — assign/reassign contractor
- `PATCH /api/maintenance/:id/status` — status transition with validation
- `POST /api/maintenance/:id/approve-cost` — landlord approval capture
- `POST /api/maintenance/:id/reopen` — controlled reopen path

---

## 9. Tenant and Landlord Communication

- Auto-acknowledgement on ticket creation.
- Scheduling updates and ETA notifications.
- Progress updates at key lifecycle milestones.
- Closure message includes rating prompt and reopen window details.

### Communication standards

- Every message includes case ID, owner, next step, and expected timeline.
- Tenant communication is empathy-forward and clear.
- Landlord communication includes cost impact and approval status.

---

## 10. KPI Dashboard

- Open tickets by priority and aging bucket.
- SLA breach rate by property/contractor/category.
- Mean time to first action and mean time to resolution.
- Tenant satisfaction score and reopen ratio.
- Landlord approval turnaround time.

---

## 11. Acceptance Criteria

- [ ] SLA alerts trigger before and at breach thresholds.
- [ ] Approval gate is enforced for high-cost repairs.
- [ ] Status transitions are deterministic and auditable.
- [ ] Contractor reassignment flow is available and traceable.
- [ ] Closure requires evidence and supports controlled reopen.
- [ ] Communication logs are complete and visible by role.

---

## 12. Test Plan

1. Emergency ticket fast-path with SLA timers and escalation.
2. Approval timeout path and manager intervention.
3. Contractor decline and deterministic reassignment.
4. Completion with missing evidence (must fail closure).
5. End-to-end closure with tenant rating capture.
6. Reopen flow with reason code and root-cause logging.
