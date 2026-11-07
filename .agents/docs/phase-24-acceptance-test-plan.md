# Phase 24 — Acceptance Test Plan

**Date:** May 3, 2026  
**Created By:** @Katherine (QA Lead)  
**Status:** Blueprint for Phase 25 Implementation  
**Purpose:** Define audit-testable acceptance criteria for all 6 core modules.

---

## Overview

This document provides executable test scenarios for validating Phase 24 completion. Each module has:

- **Role-based access tests** (RBAC enforcement)
- **Business rule tests** (workflow/state machine)
- **Integration tests** (cross-module dependencies)
- **Data integrity tests** (immutability, audit trails)

---

## Test Coverage Summary

| Module     | RBAC Tests | Business Rule Tests | Integration Tests | Data Integrity Tests | Test Count |
| ---------- | ---------- | ------------------- | ----------------- | -------------------- | ---------- |
| Leads      | 7          | 6                   | 4                 | 5                    | **22**     |
| Inventory  | 8          | 7                   | 3                 | 4                    | **22**     |
| Sales      | 7          | 8                   | 5                 | 4                    | **24**     |
| Commission | 7          | 8                   | 6                 | 5                    | **26**     |
| Leasing    | 8          | 9                   | 4                 | 5                    | **26**     |
| WhatsApp   | 7          | 8                   | 5                 | 4                    | **24**     |
| **TOTAL**  | **44**     | **46**              | **27**            | **27**               | **144**    |

---

## Module: LEADS (`/api/leads`)

### Role-Based Access Tests (RBAC-7)

**RBAC-L1:** Agent can CREATE own leads only

```
Test: POST /api/leads { agentId: self, lead_data }
Expected: ✅ 201 Created, lead assigned to self
Test: POST /api/leads { agentId: other_agent, lead_data }
Expected: ❌ 403 Forbidden (scope: own only)
```

**RBAC-L2:** Manager can CREATE leads for any agent

```
Test: Manager POST /api/leads { agentId: agent_x, lead_data }
Expected: ✅ 201 Created, lead assigned to agent_x
```

**RBAC-L3:** Agent READ visibility: own + team assigned only

```
Test: Agent GET /api/leads (no filter)
Expected: ✅ 200 OK, array contains only (own leads + assigned-to-me)
Test: Agent GET /api/leads (filter: other_agent_leads)
Expected: ❌ 403 Forbidden or empty array (depends on implementation)
```

**RBAC-L4:** Manager READ visibility: team + direct reports

```
Test: Manager GET /api/leads
Expected: ✅ 200 OK, array contains team leads + direct report leads
```

**RBAC-L5:** Executive READ visibility: aggregated metadata only (no PII)

```
Test: Executive GET /api/leads
Expected: ✅ 200 OK, array contains {id, stage, value, source_category} (no names/emails)
```

**RBAC-L6:** Finance CANNOT READ leads

```
Test: Finance GET /api/leads
Expected: ❌ 403 Forbidden
```

**RBAC-L7:** Compliance can READ with compliance fields only

```
Test: Compliance GET /api/leads
Expected: ✅ 200 OK, includes {compliance_status, dld_check, document_refs}
```

### Business Rule Tests (BR-6)

**BR-L1:** Source attribution immutable after creation

```
Test: Create lead with source=HOMEPAGE
Test: UPDATE lead source=WHATSAPP
Expected: ❌ 400 Bad Request or source unchanged (immutable validation)
Test: View lead.source_audit_trail
Expected: ✅ {source: HOMEPAGE, created_at: ..., modified_at: null}
```

**BR-L2:** Stage history retained forever (no deletion)

```
Test: Create lead (stage: VIEWING)
Test: Move to OFFER
Test: Move to CLOSED_LOST
Test: Move back to VIEWING
Test: Query lead.stage_history
Expected: ✅ [{stage: VIEWING, date: ...}, {stage: OFFER, date: ...}, {stage: CLOSED_LOST, date: ...}, {stage: VIEWING, date: ...}]
```

**BR-L3:** Invalid stage transitions blocked

```
Test: Create lead (stage: VIEWING)
Test: UPDATE stage = CLOSED_WON (skip OFFER/NEGOTIATION)
Expected: ❌ 400 Bad Request (invalid transition)
Test: UPDATE stage = OFFER
Expected: ✅ 200 OK (valid transition)
```

**BR-L4:** SLA follow-up reminders fire correctly

```
Test: Create lead at 10:00 AM
Test: Query /api/leads/sla-alerts at 10:25 AM
Expected: ❌ 200 OK, empty (no alerts yet)
Test: Query /api/leads/sla-alerts at 10:01 AM + 24h
Expected: ✅ 200 OK, array includes {leadId, reason: "24h_follow_up", agentId}
Test: Query at 10:01 AM + 48h
Expected: ✅ 200 OK, array includes {leadId, reason: "48h_follow_up"}
```

**BR-L5:** Lead can be reopened from CLOSED_LOST (requalified)

```
Test: Lead in CLOSED_LOST state
Test: Manager PATCH /api/leads/{id} { status: VIEWING, reopen_reason: "client_requalified" }
Expected: ✅ 200 OK, status=VIEWING, reopen_reason logged in history
Test: Query history
Expected: ✅ [..., {action: CLOSED_LOST, date: ...}, {action: REOPENED, date: ..., reason: ...}]
```

**BR-L6:** Export functionality respects role (exported data filtered by role scope)

```
Test: Agent POST /api/leads/export
Expected: ✅ 200 OK, CSV contains only own + assigned-to-me leads
Test: Manager POST /api/leads/export
Expected: ✅ 200 OK, CSV contains team + direct report leads
Test: Executive POST /api/leads/export
Expected: ✅ 200 OK, CSV contains aggregated/anonymized data
```

### Integration Tests (INT-4)

**INT-L1:** Lead creates sales deal when moved to OFFER stage + property selected

```
Test: Create lead + property selection
Test: PATCH lead.status = OFFER, lead.selected_property_id = <id>
Expected: ✅ Lead updated, new Deal auto-created in `/api/deals`
Test: GET /api/deals?leadId=<id>
Expected: ✅ 200 OK, array contains auto-created deal
```

**INT-L2:** WhatsApp inbound creates lead with source attribution

```
Test: Inbound WhatsApp message from +971501234567 (new number)
Test: POST /api/whatsapp/incoming { phone, message, ... }
Expected: ✅ New Lead auto-created with source=WHATSAPP, phone captured
Test: GET /api/leads?source=WHATSAPP
Expected: ✅ Array includes newly created lead
```

**INT-L3:** Homepage contact form creates lead

```
Test: POST /api/contact { name, email, phone, message }
Expected: ✅ 201 Created, Lead auto-created with source=HOMEPAGE
Test: GET /api/leads?source=HOMEPAGE
Expected: ✅ Array includes newly created lead
```

**INT-L4:** Lead data visible in Executive dashboard (aggregated)

```
Test: Executive GET /api/dashboard/overview
Expected: ✅ 200 OK, includes {total_leads, leads_by_stage, conversion_rate, top_sources}
Test: Drill into leads_by_stage
Expected: ✅ 200 OK, breakdown by pipeline stage (no PII)
```

### Data Integrity Tests (DI-5)

**DI-L1:** Audit trail immutable (no edits to source_audit_trail)

```
Test: Create lead
Test: Direct DB UPDATE lead.source_audit_trail (tamper attempt)
Expected: ❌ DB constraint prevents update
Test: Query lead.source_audit_trail
Expected: ✅ Original value unchanged
```

**DI-L2:** Soft delete on archive (lead not deleted, just marked archived)

```
Test: Create lead, then DELETE /api/leads/{id}
Expected: ✅ 200 OK, lead.is_archived = true
Test: GET /api/leads (default query)
Expected: ✅ Archived lead NOT included
Test: GET /api/leads?include_archived=true
Expected: ✅ Archived lead included
```

**DI-L3:** Lead ID immutable (cannot change after creation)

```
Test: Create lead { id: auto-generated }
Test: PATCH /api/leads/{id} { id: new_id }
Expected: ❌ 400 Bad Request or id unchanged
```

**DI-L4:** Stage history preserved across lead updates (no truncation)

```
Test: Cycle lead through 10 stage transitions
Test: GET lead.stage_history
Expected: ✅ Array length = 10 (all transitions preserved)
Test: Update other fields (name, value, etc.)
Expected: ✅ stage_history still length = 10 (unchanged)
```

**DI-L5:** Timestamps immutable (created_at, first_contact_at)

```
Test: Create lead { created_at: 2026-05-03T10:00:00Z }
Test: PATCH /api/leads/{id} { created_at: 2026-04-01T10:00:00Z }
Expected: ❌ 400 Bad Request or created_at unchanged
Test: Query lead.created_at
Expected: ✅ Original timestamp preserved
```

---

## Module: INVENTORY (`/api/properties` + `/api/listings`)

### Role-Based Access Tests (RBAC-8)

**RBAC-I1:** Agent can CREATE property in DRAFT state only

```
Test: Agent POST /api/properties { title, address, price, status: DRAFT }
Expected: ✅ 201 Created, status=DRAFT, owned_by=self
Test: Agent POST /api/properties { status: ACTIVE }
Expected: ❌ 400 Bad Request (can't create active directly)
```

**RBAC-I2:** Agent cannot APPROVE own listings (manager required)

```
Test: Agent PATCH /api/properties/{id} { status: APPROVED }
Expected: ❌ 403 Forbidden
Test: Manager PATCH /api/properties/{id} { status: APPROVED }
Expected: ✅ 200 OK, status=APPROVED
```

**RBAC-I3:** Compliance must be consulted on APPROVE (adds compliance_sign_off)

```
Test: Manager tries to APPROVE without compliance check
Expected: ✅ 200 OK but compliance_approved_by = null (warning/log)
Test: Compliance POST /api/properties/{id}/compliance-check { approved: true, dld_id: ... }
Expected: ✅ 200 OK, compliance_approved_by=compliance_user_id
Test: Manager now APPROVE
Expected: ✅ 200 OK, full approval workflow completed
```

**RBAC-I4:** Agent can UPDATE fields in DRAFT/APPROVED (not ACTIVE)

```
Test: Property in DRAFT, Agent PATCH title
Expected: ✅ 200 OK, title updated
Test: Property in ACTIVE, Agent PATCH title
Expected: ❌ 403 Forbidden (active is locked)
Test: Manager PATCH title (active property)
Expected: ✅ 200 OK (manager can edit)
```

**RBAC-I5:** Agent can ARCHIVE own completed properties

```
Test: Agent PATCH /api/properties/{id} { status: ARCHIVED }
Expected: ✅ 200 OK (if sold/leased)
Test: Manager POST /api/properties/{id}/archive
Expected: ✅ 200 OK, status=ARCHIVED
```

**RBAC-I6:** Syndication requires Manager + Compliance approval

```
Test: Agent POST /api/properties/{id}/syndicate
Expected: ❌ 403 Forbidden
Test: Manager POST /api/properties/{id}/syndicate
Expected: ✅ 200 OK (if compliance_approved_by present)
Test: Syndicate without compliance check
Expected: ❌ 400 Bad Request or warning logged
```

**RBAC-I7:** Finance can VIEW active + archived only (pricing/valuation)

```
Test: Finance GET /api/properties?status=ACTIVE
Expected: ✅ 200 OK, array includes active
Test: Finance GET /api/properties?status=DRAFT
Expected: ❌ 403 Forbidden or empty (draft is private)
```

**RBAC-I8:** Executive sees summary only (no addresses/PII)

```
Test: Executive GET /api/properties
Expected: ✅ 200 OK, array includes {id, district, property_type, price_range, status}
Test: Query includes address field
Expected: ❌ address field excluded or null
```

### Business Rule Tests (BR-7)

**BR-I1:** Compliance fields required before APPROVAL (DLD ID, title deed, permit refs)

```
Test: Property DRAFT without dld_id, Manager tries APPROVE
Expected: ❌ 400 Bad Request (missing required field: dld_id)
Test: Add dld_id, retry APPROVE
Expected: ✅ 200 OK (validation passes)
```

**BR-I2:** Lifecycle enforced (Draft→Pending→Active→Completed/Archived)

```
Test: New property (status: DRAFT)
Test: PATCH status: ACTIVE (skip Pending)
Expected: ❌ 400 Bad Request (invalid transition)
Test: PATCH status: PENDING (correct next state)
Expected: ✅ 200 OK
Test: PATCH status: ACTIVE (correct next state)
Expected: ✅ 200 OK
```

**BR-I3:** Stale properties flagged/archived (no update >90 days)

```
Test: Create property, don't update for 91 days
Test: Scheduled job runs or manual check: GET /api/properties/stale-check
Expected: ✅ property flagged with is_stale=true, or auto-archived (depends on policy)
Test: Query /api/properties (default, exclude stale)
Expected: ✅ Property not included (unless include_stale=true)
```

**BR-I4:** Syndication fires portal updates (webhooks/feeds updated)

```
Test: Property ACTIVE, syndicate_enabled=true
Expected: ✅ Webhook sent to property finder/Bayut (logged in syndication_history)
Test: Query property.syndication_history
Expected: ✅ [{provider: PROPERTY_FINDER, sent_at: ..., status: SUCCESS}, ...]
```

**BR-I5:** Price changes tracked (immutable history, historical pricing)

```
Test: Create property { price: 1000000 }
Test: PATCH price: 950000
Expected: ✅ 200 OK, property.price=950000
Test: Query property.price_history
Expected: ✅ [{price: 1000000, updated_at: ...}, {price: 950000, updated_at: ...}]
```

**BR-I6:** Published properties cannot be deleted (soft delete only)

```
Test: Property in ACTIVE state
Test: DELETE /api/properties/{id}
Expected: ❌ 403 Forbidden (cannot delete active)
Test: PATCH { status: ARCHIVED }, then DELETE
Expected: ✅ 200 OK or still soft-delete (archived marked, not hard deleted)
```

**BR-I7:** Duplicate detection (same address, unit type cannot have 2 active listings)

```
Test: Create property { address: "JBR Tower 1 #2405", type: "Studio" }
Test: Create second property { same address, same unit, type: "Studio" }
Expected: ❌ 400 Bad Request (duplicate detected)
```

### Integration Tests (INT-3)

**INT-I1:** Property availability checked by Sales during deal creation

```
Test: Sales agent creates deal with property_id=X
Test: Property is DRAFT or ARCHIVED
Expected: ❌ 400 Bad Request (can't sell draft/archived property)
Test: Property is ACTIVE
Expected: ✅ 200 OK, deal created
```

**INT-I2:** Leasing module checks property availability

```
Test: Leasing agent creates lease with property_id=X
Test: Property is ARCHIVED (sold) or not status=ACTIVE
Expected: ❌ 400 Bad Request (property not available for lease)
```

**INT-I3:** Portal feeds updated on syndication

```
Test: Manager POST /api/properties/{id}/syndicate
Expected: ✅ 200 OK, webhook fires to Property Finder/Bayut
Test: Check portal within 5 min
Expected: ✅ Listing appears on portal
```

### Data Integrity Tests (DI-4)

**DI-I1:** DLD ID immutable (audited for compliance)

```
Test: Property dld_id = "ABC123"
Test: PATCH dld_id = "XYZ789"
Expected: ❌ 400 Bad Request or dld_id unchanged
```

**DI-I2:** Compliance approval immutable (once given, can't be revoked without reason)

```
Test: Compliance approves property
Test: PATCH compliance_approved_by = null
Expected: ❌ 400 Bad Request or requires compliance_revoke_reason
```

**DI-I3:** Price history immutable (no truncation/deletion)

```
Test: Update price 10 times
Test: Query price_history
Expected: ✅ Length = 11 (original + 10 updates)
```

**DI-I4:** Syndication history immutable (permanent record)

```
Test: Syndicate to portal A
Test: Syndicate to portal B
Test: Query syndication_history
Expected: ✅ [{provider: A, sent_at: ...}, {provider: B, sent_at: ...}]
```

---

## Module: SALES PIPELINE (`/api/deals`)

### Role-Based Access Tests (RBAC-7)

**RBAC-S1:** Agent can CREATE deal from lead + property

```
Test: Agent POST /api/deals { leadId: own_lead, propertyId: available_property }
Expected: ✅ 201 Created, deal.agent_id = self
Test: POST with another agent's lead
Expected: ❌ 403 Forbidden (lead scope enforcement)
```

**RBAC-S2:** Agent can UPDATE own deal (stage, offers, notes)

```
Test: Agent PATCH own deal { stage: NEGOTIATION }
Expected: ✅ 200 OK
Test: Agent PATCH other agent's deal { stage: NEGOTIATION }
Expected: ❌ 403 Forbidden
```

**RBAC-S3:** Manager can CREATE deal for any agent (override)

```
Test: Manager POST /api/deals { agent_id: agent_x, leadId, propertyId }
Expected: ✅ 201 Created, deal assigned to agent_x
```

**RBAC-S4:** Manager can override agent-entered deal data

```
Test: Manager PATCH /api/deals/{id} (owned by agent_x) { offer_price: modified_value }
Expected: ✅ 200 OK, change logged with manager_override_reason
```

**RBAC-S5:** Finance can VIEW all deals (pricing verification)

```
Test: Finance GET /api/deals
Expected: ✅ 200 OK, array includes all deals
Test: Finance PATCH /api/deals/{id}
Expected: ❌ 403 Forbidden (cannot modify)
```

**RBAC-S6:** Executive can VIEW deals (aggregated forecast only, no PII)

```
Test: Executive GET /api/deals?summary=true
Expected: ✅ 200 OK, includes {total_deal_value, close_probability, revenue_forecast}
```

**RBAC-S7:** Compliance cannot access individual deals (summary only)

```
Test: Compliance GET /api/deals
Expected: ❌ 403 Forbidden or summary only
Test: GET /api/deals/summary
Expected: ✅ 200 OK, aggregated deal metrics
```

### Business Rule Tests (BR-8)

**BR-S1:** Deal stage transitions validated (Viewing→Offer→Negotiation→Closed)

```
Test: Deal in VIEWING
Test: PATCH stage: CLOSED_WON (skip Offer/Negotiation)
Expected: ❌ 400 Bad Request (invalid transition)
Test: PATCH stage: OFFER
Expected: ✅ 200 OK
Test: PATCH stage: NEGOTIATION
Expected: ✅ 200 OK
```

**BR-S2:** OFFER stage requires lead + property + buyer profile match

```
Test: Deal in VIEWING, no lead/property
Test: PATCH stage: OFFER
Expected: ❌ 400 Bad Request (precondition: lead required)
Test: Add lead + property, retry
Expected: ✅ 200 OK
```

**BR-S3:** Closed-Won immediately triggers Commission creation

```
Test: Deal PATCH { stage: CLOSED_WON }
Expected: ✅ 200 OK, deal.status = CLOSED_WON
Test: GET /api/commissions?dealId={id}
Expected: ✅ 200 OK, array contains auto-created commission
```

**BR-S4:** Closed-Lost requires reason (logged for analysis)

```
Test: Deal PATCH { stage: CLOSED_LOST } (no reason)
Expected: ❌ 400 Bad Request (reason required)
Test: Deal PATCH { stage: CLOSED_LOST, lost_reason: "CLIENT_BUDGET" }
Expected: ✅ 200 OK, lost_reason logged in history
```

**BR-S5:** Reopen lost deal (manager only, with reason)

```
Test: Deal in CLOSED_LOST
Test: Agent PATCH { stage: VIEWING, reopen_reason: "client_requalified" }
Expected: ❌ 403 Forbidden (agent can't reopen)
Test: Manager PATCH { stage: VIEWING, reopen_reason: "client_requalified" }
Expected: ✅ 200 OK, reopen logged in history
```

**BR-S6:** Forecast calculation weighted by stage probability

```
Test: Deal A in VIEWING (10% probability, value 1M)
Test: Deal B in NEGOTIATION (50% probability, value 2M)
Test: GET /api/deals/forecast
Expected: ✅ 200 OK, forecast = (1M * 0.1) + (2M * 0.5) = 1.1M
```

**BR-S7:** Offer preconditions enforced (buyer credit check, property available)

```
Test: Add offer to deal (buyer without credit check)
Expected: ❌ 400 Bad Request (credit check required) or warning
Test: Add credit check, retry
Expected: ✅ 200 OK (offer created)
```

**BR-S8:** Multiple offers allowed (track all, mark accepted one)

```
Test: Add offer A (price: 1M)
Test: Add offer B (price: 1.1M, accepted: true)
Expected: ✅ 200 OK, deal.accepted_offer = offer_B
Test: GET deal.offers
Expected: ✅ Array includes both offers, one marked accepted
```

### Integration Tests (INT-5)

**INT-S1:** Deal creation updates Lead status (Viewing→Offer pipeline reflects in Leads)

```
Test: POST /api/deals { leadId: L1, ... }
Expected: ✅ Deal created, Lead.status auto-updated to reflect deal stage
```

**INT-S2:** Closed-Won triggers Financial Reporting update

```
Test: Deal PATCH { stage: CLOSED_WON, value: 1M }
Expected: ✅ Financial reporting monthly P&L updated (+1M revenue)
Test: GET /api/finance/reporting?month=current
Expected: ✅ Latest deal value reflected in monthly total
```

**INT-S3:** Closed-Won triggers Commission creation (already tested in BR-S3, but cross-module verification)

```
Test: Deal CLOSED_WON
Test: GET /api/commissions
Expected: ✅ Commission exists, status: PENDING
Test: GET /api/leads (same lead)
Expected: ✅ Lead also reflects commission created (metadata)
```

**INT-S4:** Agent dashboard shows only own deals + assigned deals

```
Test: Agent A GET /api/dashboard/deals
Expected: ✅ Array includes (agent_A's deals + assigned-to-A deals)
Test: Array excludes agent B's deals (not assigned)
Expected: ✅ Verified
```

**INT-S5:** Manager dashboard aggregates team deals + forecasts

```
Test: Manager GET /api/dashboard/team-forecast
Expected: ✅ Includes {total_pipeline_value, weighted_forecast, stage_breakdown, agents_list}
```

### Data Integrity Tests (DI-4)

**DI-S1:** Stage history immutable (all transitions preserved)

```
Test: Cycle deal through 8 stage transitions
Test: Query deal.stage_history
Expected: ✅ Array length = 8 (all preserved)
```

**DI-S2:** Deal ID immutable (cannot change after creation)

```
Test: Deal { id: auto-generated }
Test: PATCH /api/deals/{id} { id: new_id }
Expected: ❌ 400 Bad Request or id unchanged
```

**DI-S3:** Lost reason immutable (cannot change after setting)

```
Test: Deal { stage: CLOSED_LOST, lost_reason: "CLIENT_BUDGET" }
Test: PATCH { lost_reason: "OTHER_REASON" }
Expected: ❌ 400 Bad Request or lost_reason unchanged
```

**DI-S4:** Offer acceptance immutable (once accepted, can't unaccept)

```
Test: Deal with offer A (accepted: true)
Test: PATCH offer_A { accepted: false }
Expected: ❌ 400 Bad Request (immutable once accepted)
```

---

## Module: COMMISSION (`/api/commissions`)

### Role-Based Access Tests (RBAC-7)

[Abbreviated for brevity; structure identical to above — 7 tests covering CREATE/READ/APPROVE/PAY/UPDATE/DELETE/STATEMENT actions]

**Key enforcement:**

- Agent: VIEW own only
- Manager: APPROVE pending (own team)
- Finance: PROCESS payment (all)
- Owner: FULL access

### Business Rule Tests (BR-8)

**BR-C1:** Auto-created on deal CLOSED_WON (within 5 min)
**BR-C2:** Default rates applied (2% sale, 5% lease)
**BR-C3:** Default split applied (50/50 agent/broker)
**BR-C4:** Approval required before payment (manager gate)
**BR-C5:** Payment marks status PAID (immutable afterward)
**BR-C6:** Rejection triggers Transaction review workflow
**BR-C7:** Commission statement generated on request (PDF, audit trail)
**BR-C8:** VAT/tax calculations included (if applicable per UAE rules)

### Data Integrity Tests (DI-5)

**DI-C1:** Paid records fully immutable (no edits/deletes)
**DI-C2:** Approval audit trail preserved (who approved, when)
**DI-C3:** Payment proof stored (bank transfer ref, date, method)
**DI-C4:** Agent scope isolation (can't access other agent commissions)
**DI-C5:** Commission ID immutable

---

## Module: LEASING/EJARI (`/api/tenants` + `/api/leases`)

### Role-Based Access Tests (RBAC-8)

[Abbreviated — 8 tests covering CREATE/SUBMIT/APPROVE/REGISTER/SCHEDULE/FEE/RENEW/VIEW]

**Key enforcement:**

- Agent: CREATE draft tenant, SUBMIT lease for approval
- Manager: APPROVE lease draft
- Compliance: VALIDATE Ejari requirements
- Finance: RECORD late fees
- Owner: Full access

### Business Rule Tests (BR-9)

**BR-Le1:** Ejari required for ACTIVE lease (activation blocked without)
**BR-Le2:** Payment schedule locked post-Ejari (no modification)
**BR-Le3:** Late fee triggers follow-up workflow (email/SMS/WhatsApp)
**BR-Le4:** Renewal auto-triggered at 30 days before expiry
**BR-Le5:** Tenant KYC check required before lease creation
**BR-Le6:** PDC (post-dated checks) tracked if applicable
**BR-Le7:** Lease documents immutable after tenant signature
**BR-Le8:** Ejari cancellation tracked (reason + date)
**BR-Le9:** Multiple lease renewal cycles supported (track all)

### Data Integrity Tests (DI-5)

**DI-Le1:** Payment schedule immutable post-Ejari
**DI-Le2:** Ejari number immutable (once registered, can't change)
**DI-Le3:** Document audit trail complete (all edits tracked)
**DI-Le4:** Lease ID immutable
**DI-Le5:** Tenant ID immutable (link to lease permanent)

---

## Module: WHATSAPP (`/api/whatsapp/*`)

### Role-Based Access Tests (RBAC-7)

[Abbreviated — 7 tests covering RECEIVE/ASSIGN/SEND/ESCALATE/RESOLVE/HISTORY/CAMPAIGN]

**Key enforcement:**

- Agent: ASSIGN own, SEND assigned only
- Manager: ASSIGN team, ESCALATE, RESOLVE
- Compliance: LOGGING + opt-in audit
- Owner: Full access

### Business Rule Tests (BR-8)

**BR-W1:** Inbound messages persistent (never deleted, archived only)
**BR-W2:** Bot-to-human escalation (2 failures → escalate to agent)
**BR-W3:** Message metadata logged (timestamp, sender, handler, SLA)
**BR-W4:** Source-to-lead mapping (inbound → auto-create or link Lead)
**BR-W5:** SLA alert fires for overdue (>4h unresolved → manager notified)
**BR-W6:** Webhook auth + retry queue (no lost messages)
**BR-W7:** Bulk campaigns queue + rate-limit (respect Opt-In/Opt-Out)
**BR-W8:** Conversation escalation workflow (agent → manager → owner)

### Data Integrity Tests (DI-4)

**DI-W1:** Message persistence verified (0 lost messages)
**DI-W2:** Webhook audit trail complete (received, processed, response sent)
**DI-W3:** Conversation ID immutable
**DI-W4:** Message timestamp immutable (server-assigned, tamper-proof)

---

## Acceptance Criteria — Phase 24 Completion Gate

**All of the following must PASS before Phase 25 begins:**

- [ ] **RBAC Tests (44 total):** ≥43 passing (98%+)
- [ ] **Business Rule Tests (46 total):** ≥45 passing (98%+)
- [ ] **Integration Tests (27 total):** ≥26 passing (96%+)
- [ ] **Data Integrity Tests (27 total):** ≥27 passing (100%)
- [ ] **Overall Coverage:** ≥140/144 tests passing (97%+)
- [ ] **No role bypass vulnerabilities** detected (security audit)
- [ ] **No data tampering** scenarios succeed
- [ ] **Cross-module workflows** validated end-to-end

---

## Test Execution Plan (Phase 25)

### Week 1: Unit + Integration Tests

- Monday: Leads RBAC + Business Rules (14 tests)
- Tuesday: Inventory RBAC + Business Rules (15 tests)
- Wednesday: Sales RBAC + Business Rules (15 tests)
- Thursday: Commission RBAC + Business Rules (15 tests)
- Friday: Leasing + WhatsApp RBAC + Business Rules (15 tests)

### Week 2: Integration + E2E Tests

- Monday: Leads integration (4 tests)
- Tuesday: Inventory integration (3 tests)
- Wednesday: Sales integration (5 tests)
- Thursday: Commission integration (6 tests)
- Friday: Leasing + WhatsApp integration (9 tests)

### Week 3: Data Integrity + Security

- Monday–Wednesday: Data integrity tests (all 27 tests)
- Thursday–Friday: Security audit (role bypass + tampering scenarios)

### Sign-Off

**QA Lead (@Katherine):** Approve test results  
**Arch Lead (@Ada):** Approve role design  
**Business (@Dena):** Approve business rules  
**Owner:** Final sign-off for Phase 25 start

---

## Next Steps

1. Code test suite for all 144 scenarios (can use Vitest + Playwright for E2E)
2. Implement role matrices at API middleware level (ensure all tests pass)
3. Document any deviations from spec (with rationale)
4. Schedule Phase 25 start after sign-off
