# Phase 24 — Module Traceability Matrix

**Date:** May 3, 2026  
**Status:** Active  
**Related Plan:** `PHASE_23_24_25_IMPLEMENTATION_PLAN.md`

---

## Purpose

Create a single source of truth mapping each core module to business rules, UI surfaces, API namespaces, role controls, and acceptance gates.

---

## Traceability Matrix

| Module          | Business Status       | Primary UI/Flow                               | Canonical API Namespace                                          | Role Control Summary                                 | Key Business Rules                                                                                   | Acceptance Gate Summary                                                  |
| --------------- | --------------------- | --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Leads           | Active                | Clara Leads CRM / homepage source capture     | `/api/leads`                                                     | Agent own + manager/team + executive overview        | Source attribution immutable, stage-history retained, SLA follow-up rules                            | source tags preserved, stage transitions valid, role visibility enforced |
| Inventory       | Active (Optimization) | Mary Inventory + Pipeline tabs                | `/api/properties`, `/api/listings`                               | Agent own portfolio + manager approvals              | Lifecycle state machine (draft->pending->active->completed/archived), compliance fields required     | approval gates enforced, stale/invalid records blocked                   |
| Sales Pipeline  | Active                | Sophia Sales CRM pipeline + forecasting       | `/api/deals` (or module route), integrates with leads/properties | Agent + manager override + executive view            | Ordered stage transitions, offer/negotiation preconditions, closed-won triggers downstream workflows | transition preconditions pass, closed-lost reason required               |
| Commission      | Active (Enhancement)  | Theodora commission dashboards/statements     | `/api/commissions`                                               | Approval: manager/owner; Payment: finance/owner      | Auto-create on close, immutable paid records, split/rate policy                                      | approval/payment lifecycle complete, agent scope isolation               |
| Leasing / Ejari | In Progress           | Daisy leasing tabs and renewal flows          | `/api/tenants`, `/api/leases`                                    | Agent/manager/compliance/finance scoped actions      | Ejari required for active lease, payment schedule/late fee logic, renewal controls                   | activation blocked without Ejari, reminders and overdue workflows valid  |
| WhatsApp        | In Progress           | Nadia/Nina conversation surfaces + assignment | `/api/whatsapp/*`                                                | Agent handling + manager reassignment + admin policy | Inbound persistence, bot-to-human escalation, source-to-lead mapping                                 | webhook/auth reliability, SLA alerts, retry/queue behavior observable    |

---

## Detailed Role Access Matrix

### LEADS Module — `/api/leads`

| Action                | Agent                  | Manager                  | Finance | Executive        | Compliance           | Owner               |
| --------------------- | ---------------------- | ------------------------ | ------- | ---------------- | -------------------- | ------------------- |
| **CREATE** lead       | ✅ Own only            | ✅ Any                   | ❌      | ❌               | ❌                   | ✅                  |
| **READ** lead         | ✅ Own + team assigned | ✅ Team + direct reports | ❌      | ✅ Metadata only | ✅ Compliance fields | ✅                  |
| **UPDATE** stage      | ✅ Own                 | ✅ Own/team (override)   | ❌      | ❌               | ❌                   | ✅                  |
| **UPDATE** source     | ❌ (immutable)         | ❌ (immutable)           | ❌      | ❌               | ❌                   | ✅ (admin override) |
| **DELETE** draft lead | ✅ Own                 | ✅ Team                  | ❌      | ❌               | ❌                   | ✅                  |
| **VIEW** history      | ✅ Own                 | ✅ Team                  | ❌      | ✅ Summary       | ✅                   | ✅                  |
| **EXPORT** pipeline   | ✅ Own                 | ✅ Team                  | ❌      | ✅ Aggregated    | ✅                   | ✅                  |

**Key Rules:**

- Source tag immutable once set (audit trail)
- Stage history retained forever (compliance)
- SLA follow-up rules: auto-reminder at 24/48/72h
- Role scope: Agent sees own + assigned-to-me leads; Manager sees team + directs; Executive sees aggregated only

**Acceptance Criteria:**

- [ ] Source attribution persists across updates (no deletion/modification)
- [ ] Stage transitions validated (prevent invalid jumps, e.g., Viewing→Closed without Offer stage)
- [ ] Role visibility enforced at query level (API filters returned leads by role)
- [ ] Lead history/audit trail immutable and complete

---

### INVENTORY Module — `/api/properties` + `/api/listings`

| Action                  | Agent               | Manager               | Finance             | Executive  | Compliance          | Owner |
| ----------------------- | ------------------- | --------------------- | ------------------- | ---------- | ------------------- | ----- |
| **CREATE** property     | ✅ Draft            | ❌                    | ❌                  | ❌         | ❌                  | ✅    |
| **SUBMIT** for approval | ✅ Own draft        | ✅ (manager override) | ❌                  | ❌         | ❌                  | ✅    |
| **APPROVE** listing     | ❌                  | ✅ Manager            | ❌                  | ❌         | ✅ Compliance check | ✅    |
| **PUBLISH** active      | ✅ Approved own     | ✅ Approved any       | ❌                  | ❌         | ❌                  | ✅    |
| **UPDATE** fields       | ✅ Draft/active own | ✅ Approved           | ❌                  | ❌         | ❌                  | ✅    |
| **ARCHIVE** completed   | ✅ Own              | ✅ Team               | ❌                  | ❌         | ❌                  | ✅    |
| **SYNDICATE** to portal | ❌                  | ✅ Manager            | ❌                  | ❌         | ✅ Metadata         | ✅    |
| **VIEW** all listings   | ✅ Published only   | ✅ All status         | ✅ Active + archive | ✅ Summary | ✅ All              | ✅    |

**Key Rules:**

- Lifecycle: Draft → Pending Approval → Active → Completed/Archived
- Compliance fields required: DLD ID, title deed status, permit document refs
- Syndication triggers on Publish (updates portal feeds)
- Invalid/stale records blocked (>90 days without update → auto-archive flag)

**Acceptance Criteria:**

- [ ] State machine enforced (can't jump: Draft→Active without Approval)
- [ ] Approval gates block publication if compliance fields missing
- [ ] Stale/invalid listings prevent showing on portal
- [ ] Syndication updates fire correctly on state transitions

---

### SALES PIPELINE Module — `/api/deals` + integrates Leads/Inventory

| Action                | Agent              | Manager                | Finance       | Executive        | Compliance | Owner |
| --------------------- | ------------------ | ---------------------- | ------------- | ---------------- | ---------- | ----- |
| **CREATE** deal       | ✅ From lead       | ✅ Force-create        | ❌            | ❌               | ❌         | ✅    |
| **UPDATE** stage      | ✅ Own             | ✅ Own/team + override | ❌            | ❌               | ❌         | ✅    |
| **ADD** offer         | ✅ Own             | ✅ Own/team            | ❌            | ❌               | ❌         | ✅    |
| **CLOSE** deal (won)  | ✅ Own             | ✅ Validate rules      | ✅ Can view   | ✅ View only     | ❌         | ✅    |
| **CLOSE** deal (lost) | ✅ Reason required | ✅ Validate + override | ❌            | ✅ Reason needed | ❌         | ✅    |
| **REOPEN** lost deal  | ❌                 | ✅ Manager             | ❌            | ❌               | ❌         | ✅    |
| **FORECAST** revenue  | ✅ Own             | ✅ Team + weighted     | ✅ Aggregated | ✅ Company total | ❌         | ✅    |

**Key Rules:**

- Stage transitions: Viewing → Offer → Negotiation → Closed (Won/Lost)
- Closed-Won **immediately triggers** Commission creation + Financial reporting update
- Closed-Lost **requires reason** (logged for trend analysis)
- Offer preconditions: lead + property + buyer profile match required
- Forecast calculation: (deal_value × close_probability) by stage

**Acceptance Criteria:**

- [ ] Stage transitions enforce preconditions (Offer requires lead + property)
- [ ] Closed-Won automatically creates commission record
- [ ] Closed-Lost reason captured and immutable
- [ ] Forecast revenue correctly weighted by stage probability
- [ ] Manager can override agent-entered data (with audit logging)

---

### COMMISSION Module — `/api/commissions`

| Action                 | Agent  | Manager    | Finance    | Executive     | Compliance | Owner          |
| ---------------------- | ------ | ---------- | ---------- | ------------- | ---------- | -------------- |
| **VIEW** own           | ✅     | ✅ Team    | ✅         | ✅ Aggregated | ❌         | ✅             |
| **VIEW** all           | ❌     | ✅ Team    | ✅         | ✅ Aggregated | ❌         | ✅             |
| **APPROVE** pending    | ❌     | ✅ Manager | ❌         | ❌            | ❌         | ✅             |
| **REJECT** with reason | ❌     | ✅ Manager | ❌         | ❌            | ❌         | ✅             |
| **PROCESS** payment    | ❌     | ❌         | ✅ Finance | ❌            | ❌         | ✅             |
| **UPDATE** after paid  | ❌     | ❌         | ❌         | ❌            | ❌         | ❌ (immutable) |
| **GENERATE** statement | ✅ Own | ✅ Team    | ✅         | ✅            | ✅         | ✅             |

**Key Rules:**

- Auto-created on Closed-Won deal
- Default rates: 2% sale, 5% lease (configurable in settings)
- Default split: 50/50 agent/broker (adjustable per manager)
- Immutable once status=PAID (no edits, deletions blocked)
- Rejection triggers Transaction review workflow (investigate deal integrity)

**Acceptance Criteria:**

- [ ] Commission auto-created within 5 min of deal close
- [ ] Approval/payment lifecycle complete end-to-end
- [ ] Agent scope isolation (agent can't access other agent commissions)
- [ ] Paid records fully immutable (no updates/deletes after payment)
- [ ] Rejection reason logged + triggers transaction audit

---

### LEASING/EJARI Module — `/api/tenants` + `/api/leases`

| Action                      | Agent         | Manager          | Finance    | Executive  | Compliance    | Owner |
| --------------------------- | ------------- | ---------------- | ---------- | ---------- | ------------- | ----- |
| **CREATE** tenant record    | ✅            | ✅ Validate      | ❌         | ❌         | ✅ KYC check  | ✅    |
| **CREATE** lease            | ✅ Draft      | ✅ Approve draft | ❌         | ❌         | ✅ Doc check  | ✅    |
| **REGISTER** Ejari          | ❌            | ✅ Manager       | ❌         | ❌         | ✅ Compliance | ✅    |
| **UPDATE** payment schedule | ✅ Draft      | ✅               | ✅         | ❌         | ❌            | ✅    |
| **RECORD** late fee         | ❌            | ✅ Manager       | ✅ Finance | ❌         | ❌            | ✅    |
| **INITIATE** renewal        | ✅ 30d before | ✅               | ❌         | ❌         | ✅            | ✅    |
| **VIEW** lease terms        | ✅ Own        | ✅               | ✅         | ✅ Summary | ✅            | ✅    |

**Key Rules:**

- Ejari required for active lease (activation blocked without)
- Payment schedule locked after Ejari registration (no modification)
- Late fee triggers follow-up workflow (email, SMS, WhatsApp reminder)
- Renewal must start 30 days before expiration (automated trigger)
- Lease documents immutable after tenant signature

**Acceptance Criteria:**

- [ ] Activation blocked without Ejari number (validation enforced)
- [ ] Payment schedule immutable post-Ejari (no edits allowed)
- [ ] Late fee reminders sent via configured channels (email + SMS + WhatsApp)
- [ ] Renewal workflow auto-triggered at 30-day mark
- [ ] Document audit trail complete (who, what, when for all edits)

---

### WHATSAPP Module — `/api/whatsapp/*`

| Action                      | Agent              | Manager             | Finance | Executive        | Compliance      | Owner |
| --------------------------- | ------------------ | ------------------- | ------- | ---------------- | --------------- | ----- |
| **RECEIVE** inbound message | ✅ Auto-assign     | ✅ View all         | ❌      | ❌               | ✅ Logging      | ✅    |
| **ASSIGN** conversation     | ✅ Accept assigned | ✅ Reassign         | ❌      | ❌               | ❌              | ✅    |
| **SEND** message            | ✅ Assigned only   | ✅ All              | ❌      | ❌               | ✅ Logging      | ✅    |
| **ESCALATE** to manager     | ✅ Flag & escalate | ✅ Receive & handle | ❌      | ❌               | ❌              | ✅    |
| **RESOLVE** & close         | ✅ Own             | ✅ Team             | ❌      | ❌               | ✅ Archive      | ✅    |
| **VIEW** history            | ✅ Own             | ✅ Team             | ❌      | ✅ Leads created | ✅ Logs         | ✅    |
| **SEND** bulk campaign      | ❌                 | ✅ Manager (queue)  | ❌      | ❌               | ✅ Opt-in audit | ✅    |

**Key Rules:**

- Inbound messages persistent (never deleted, archived after resolution)
- Bot-to-human escalation: if bot fails 2x, auto-escalate to assigned agent
- Message metadata logged: timestamp, sender, channel, agent handler, SLA
- Source-to-lead mapping: WhatsApp sender → new Lead or link to existing
- SLA alert: escalations + unresolved >4h trigger manager notification

**Acceptance Criteria:**

- [ ] Webhook auth + reliability verified (retry queue + dead letter log)
- [ ] Message persistence confirmed (0 lost messages, audit trail complete)
- [ ] Bot-to-human escalation triggers correctly (2 failures → escalate)
- [ ] SLA alerts fire for overdue conversations (>4h unresolved)
- [ ] Source-to-lead mapping tested (inbound creates Lead automatically)

---

## Cross-Module Dependency Chain

```
Homepage/Search
    ↓
Leads (captured from homepage, WhatsApp, manual)
    ↓
Sales Pipeline (deal created from lead + inventory)
    ↓
Commission (auto-created on Closed-Won)
    ├→ Financial Reporting (commission adds to P&L)
    └→ Payment Processing (finance processes payment)

Supporting Rails:
- WhatsApp: feeds inbound messages → Leads source + SLA workflows
- Inventory: context for Sales (property matching), Leasing (unit info)
- Leasing: separate track from Sales (parallel lease + commission workflows)
```

---

## Canonical Namespace Policy Reminder

- Primary module namespace must be used in all new docs/tests.
- Legacy aliases are compatibility-only and must be labeled as such.

**Namespace Registry:**

- Leads: `/api/leads` (primary)
- Inventory: `/api/properties` + `/api/listings` (both primary, different contexts)
- Sales: `/api/deals` (primary) + integrates `/api/leads` + `/api/properties`
- Commission: `/api/commissions` (primary, legacy: `/api/finance/commissions` deprecated)
- Leasing: `/api/tenants` + `/api/leases` (primary)
- WhatsApp: `/api/whatsapp/messages` + `/api/whatsapp/conversations` (primary)

---

## Phase 24 Completion Criteria

- [x] All six core modules have aligned status + endpoint namespace + role control notes.
- [x] Role access matrices defined for all modules (CREATE/READ/UPDATE/DELETE per role).
- [x] Business rules explicit and enforcement method specified per module.
- [x] Acceptance criteria checklist available per module (audit-testable).
- [x] No contradictions between requirements docs and CRM feature docs.
- [ ] (Phase 25) Role matrices added to individual module docs in `business_docs/09_crm_features/`.
- [ ] (Phase 25) Acceptance criteria tests added to test suite.
- [ ] (Phase 25) Link this matrix in `business_docs/09_crm_features/README.md` and `plans/INDEX.md`.

---

## Next Actions (Phase 25)

1. **Update individual module docs** with role matrix tables (copy from this matrix into each `.md` file).
2. **Create acceptance test checklist** per module (can be added as appendix or separate `.test-plan.md`).
3. **Add API endpoint verification** tests (ensure role enforcement at middleware level).
4. **Link this matrix** in `business_docs/09_crm_features/README.md` as authoritative reference.
5. **Run role-based API tests** to validate all role matrices are correctly enforced (automated gate for Phase 25).
