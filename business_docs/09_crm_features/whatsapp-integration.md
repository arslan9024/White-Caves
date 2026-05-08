# WhatsApp Integration — CRM Feature Specification

> **Status:** In Progress (UI strong, full Meta automation hardening pending)  
> **Module Owners:** Nadia (WhatsApp CRM), Nina (Bot CRM)  
> **Priority:** High  
> **Primary Integration:** Meta WhatsApp Cloud API

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

**Last Updated:** May 2026
