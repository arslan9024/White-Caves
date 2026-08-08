# Clara — Leads CRM Manager

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Sales  
> **ID:** `clara`  
> **Color:** #EF4444  
> **Avatar:** 👩‍🎯
> **Status:** Active — requirement catalog expanded.

---

## Overview
Manages lead pipeline, qualification, nurturing workflows, and conversion tracking.

## Requirement catalog

### REQ-CLARA-001: Lead lifecycle and qualification management

The system shall manage lead records through qualification stages with clear ownership and stage history.

**Acceptance criteria:**

- [ ] Leads have consistent lifecycle states and owner assignment
- [ ] Qualification decisions are timestamped and attributable
- [ ] Stage changes are visible in timeline history

**Evidence:** lead lifecycle log and stage history snapshot.

### REQ-CLARA-002: Nurturing and activity orchestration

The system shall orchestrate follow-up activities, reminders, and nurturing actions for active leads.

**Acceptance criteria:**

- [ ] Follow-up tasks can be created automatically and manually
- [ ] Activity timeline merges outreach, notes, and status transitions
- [ ] Stalled leads are flagged for intervention

**Evidence:** activity timeline and follow-up queue output.

### REQ-CLARA-003: Conversion analytics and pipeline insights

The system shall expose pipeline conversion metrics by stage, source, and owner.

**Acceptance criteria:**

- [ ] Conversion and drop-off metrics are calculable per stage
- [ ] Source-level performance is visible in reports
- [ ] Manager views support team and individual filtering

**Evidence:** conversion dashboard and source breakdown report.

### REQ-CLARA-004: Lead scoring integration

The system shall integrate lead scoring signals for prioritization and routing decisions.

**Acceptance criteria:**

- [ ] Lead score and tier are visible in lead detail
- [ ] Score updates propagate to priority queues
- [ ] Manual overrides are tracked with justification

**Evidence:** lead scoring record and queue priority audit.

## Traceability

- Maps to `REQ-LT-001` through `REQ-LT-005`
- Aligns to `WC-SRS-002` and `WC-SRS-009`
- Feeds lead operations, routing, and conversion validation

## Capabilities
- Lead management
- Qualification
- Nurturing
- Conversion tracking
- Activity timeline
- Lead scoring

## API Endpoints
- `/api/leads`
- `/api/pipeline`
- `/api/activities`

## Data Flows
- **Receives from:** Nadia, Mary, Hunter
- **Sends to:** Mary, Sophia, Nadia

## Access Control
- **Viewable by:** Owner, Admin, Sales Manager, Agent
- **Accessible by:** Owner, Admin, Sales Manager
- **Data access level:** Departmental
