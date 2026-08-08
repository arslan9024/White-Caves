# WhatsApp Integration — CRM Feature Specification

> **Status:** In Progress (UI strong, full Meta automation hardening pending)  
> **Module Owners:** Nadia (WhatsApp CRM), Nina (Bot CRM)  
> **Priority:** High  
> **Primary Integration:** Meta WhatsApp Cloud API  
> **Last Updated:** 2026-08-07  
> **Next Review:** 2026-08-21  
> **Source of Truth:** CRM WhatsApp integration feature specification (business layer)

## Canonical governance links

- [`../05_requirements/integration-requirements.md`](../05_requirements/integration-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend reliability and notification lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## Current State (Truth Source)

### Implemented

- WhatsApp-centric CRM UI surfaces exist for conversation handling.
- Conversation views and agent workflows are available in CRM pages.
- Lead capture pathways from messaging channel are partially integrated.

### In Progress / Pending Hardening

- Complete production-grade send/receive reliability with retry queues.
- Full webhook signature verification + observability coverage.
- Production template management and approval lifecycle.
- SLA automation for response-time escalation and assignment controls.

---

## Business Rules

1. Inbound message must be acknowledged quickly and persisted.
2. Customer identity and source attribution must map into lead records.
3. Escalation to human agent required when bot confidence is below threshold.
4. High-priority leads from WhatsApp must trigger assignment workflow.
5. Outbound template usage must follow approved compliance templates.

## Requirement catalog

### REQ-WA-001: Inbound webhook verification and persistence

The system shall verify WhatsApp webhook signatures before persisting inbound message events.

**Acceptance criteria:**

- [ ] Invalid signatures are rejected without processing payload content
- [ ] Valid webhook events are stored with source, timestamp, and message metadata
- [ ] Webhook acknowledgement completes within the documented service budget

**Evidence:** webhook verification log, persisted event record, and monitoring trace.

### REQ-WA-002: Outbound send orchestration and retries

The system shall send approved outbound messages through the WhatsApp provider and retry transient failures.

**Acceptance criteria:**

- [ ] Approved templates can be sent from the CRM inbox
- [ ] Transient failures retry with exponential backoff
- [ ] Permanent failures are surfaced in the operator queue

**Evidence:** send job log, retry queue entry, and failure audit.

### REQ-WA-003: Bot-to-human handoff controls

The system shall transfer conversations to a human agent when confidence or intent rules require it.

**Acceptance criteria:**

- [ ] Handoff triggers when the configured confidence threshold is not met
- [ ] Conversation context is preserved on assignment
- [ ] Assigned agent receives a visible SLA timer and backlog state

**Evidence:** handoff audit record, assignment event, and SLA dashboard snapshot.

### REQ-WA-004: Template governance and locale compliance

The system shall manage WhatsApp template approvals, locale variants, and consent status.

**Acceptance criteria:**

- [ ] Templates carry draft, pending, approved, or rejected status
- [ ] English and Arabic template variants are stored separately
- [ ] Opt-out and consent status are respected before marketing sends

**Evidence:** template registry, locale audit, and consent log.

### REQ-WA-005: Conversation analytics and SLA monitoring

The system shall expose response-time, queue-depth, and conversion analytics for WhatsApp conversations.

**Acceptance criteria:**

- [ ] Dashboard shows first response time and resolution time
- [ ] Queue depth is visible by assignment bucket
- [ ] Conversion metrics can be filtered by source and agent

**Evidence:** analytics snapshot, KPI export, and SLA report.

## Traceability

- Maps to `REQ-INT-001` through `REQ-INT-005` in `docs/business_docs/05_requirements/integration-requirements.md`
- Supports `WC-SRS-015` and `WC-SRS-009` integration coverage
- Feeds webhook, lead-assignment, and compliance validation artifacts

---

## Integration Contract

### Primary endpoints (module perspective)

- `POST /api/whatsapp/webhook` (inbound events)
- `POST /api/whatsapp/send` (outbound send orchestration)
- `GET /api/whatsapp/conversations` (agent inbox retrieval)
- `PATCH /api/whatsapp/conversations/:id/assign` (agent assignment)

### Upstream/Downstream

- Upstream: Meta Cloud API webhooks
- Downstream: Leads CRM, assignment engine, notifications, analytics

---

## Role Access

- **Agent:** handle assigned conversations, send approved templates
- **Manager:** reassign, monitor SLA, escalate priority queues
- **Owner/Admin:** full visibility + policy configuration

---

## Acceptance Criteria

- [ ] Webhook verification and persistence reliability validated
- [ ] Lead source tagging = `whatsapp` for converted conversations
- [ ] Assignment SLA alerts trigger for delayed first response
- [ ] Outbound send failures are retried and tracked
- [ ] KPI dashboard includes response time, conversion rate, and backlog queue depth

---

## Template Governance

- Template catalog by category: utility, marketing, authentication.
- Approval state tracked (draft, pending, approved, rejected).
- Locale variants for EN/AR with compliance checks.

## Retry and Delivery Reliability

- Retry queue with exponential backoff for transient failures.
- Dead-letter queue for permanent failures.
- Idempotency keys to prevent duplicate sends.

## Bot-to-Human Handoff

- Handoff trigger when confidence below threshold or explicit user intent.
- Preserve full conversation context for assigned human agent.
- SLA timer starts at handoff event.

## Observability and KPI

- Metrics: first response time, resolution time, conversion rate, queue depth.
- Webhook success/failure counters with alerting thresholds.
- Agent dashboard includes backlog aging view.

## Implementation handoff

- Primary operational evidence lives in the WhatsApp webhook audit log and outbound message queue.
- Any template or locale change must be reflected in the approval registry before release.

## Security and Compliance

- Webhook signature verification mandatory.
- Consent and opt-out tracking for marketing templates.
- Role-based controls for broadcast and template management.

---

**Last Updated:** May 2026
