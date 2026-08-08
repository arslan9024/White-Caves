# Offers Management — Business Specification

<!-- markdownlint-disable MD022 MD031 MD032 MD040 MD060 -->

**Owner:** @Jaime (Llama 3.1 70B — Groq Console)
**Status:** 🟡 [Pending specific implementation definition per 90% readiness guidelines] — awaiting @Jaime Task 1
**Target:** 12 sections
**API Route:** `/api/offers`
**Related:** properties, leads, leases, documents (MOU/LOI generation)
**Last Updated:** 2026-08-07
**Next Review:** 2026-08-21
**Source of Truth:** CRM offers management feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend workflow/reliability closure lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## Overview

The offers module manages the negotiation workflow between buyers/tenants and sellers/landlords. It tracks every offer, counter-offer, and final acceptance — then automatically triggers MOU/LOI document generation upon acceptance.

## Requirement catalog

### REQ-OFF-001: Offer submission and participant validation

The system shall accept offers only when required fields and participant rules are satisfied.

**Acceptance criteria:**

- [ ] Offer records store property, agent, price, type, and expiry
- [ ] Exactly one participant field is allowed: buyer or tenant
- [ ] Validation errors explain the missing or invalid field

**Evidence:** offer record, validation log, and participant audit.

### REQ-OFF-002: Counter-offer history and governance

The system shall preserve every counter-offer round with actor, timestamp, and note.

**Acceptance criteria:**

- [ ] Counter-offer history is append-only
- [ ] Final accepted round is locked from editing
- [ ] Max counter rounds trigger escalation when exceeded

**Evidence:** counter-offer history and escalation log.

### REQ-OFF-003: Acceptance triggers and downstream documents

The system shall generate downstream documents and tasks when an offer is accepted.

**Acceptance criteria:**

- [ ] Accepted offers generate MOU or LOI artifacts
- [ ] Notifications are sent to relevant parties
- [ ] RERA/compliance tasks are created where required

**Evidence:** document generation log and task queue record.

### REQ-OFF-004: Expiry and comparison views

The system shall expire offers automatically and support side-by-side comparison of active offers.

**Acceptance criteria:**

- [ ] Offers transition to expired after validUntil
- [ ] Comparison view shows price, conditions, and buyer profile
- [ ] Expired offers remain read-only with reason code

**Evidence:** expiry job log and comparison snapshot.

## Traceability

- Supports `REQ-LEAD-003`, `REQ-TENANT-002`, and transaction workflow coverage
- Aligns to `WC-SRS-011`, `WC-SRS-012`, and downstream document artifacts
- Feeds negotiation, acceptance, and compliance validation

**Key Capabilities:**

- Offer submission from buyer or tenant side
- Counter-offer rounds with full history tracking
- Multi-offer comparison table (side-by-side for same property)
- Automated offer expiry (cron sets status = expired after validUntil)
- Offer acceptance triggers: MOU/LOI PDF generation + WhatsApp notifications to all parties
- Offer analytics: average offers per property, negotiation rounds, price vs asking ratio

---

## Implementation handoff

The planning prompts above are superseded by the requirement catalog in this document. The active specification now covers offer creation, counter-offers, ranking, expiry, acceptance triggers, and analytics.

## Offer Data Model

- Required fields: `propertyId`, `agentId`, `offerType`, `offerPriceAed`, `validUntil`.
- Participant rule: exactly one of `buyerId` or `tenantId` must be present.
- Conditions captured as structured flags (`mortgageSubject`, `cashPurchase`, `furnitureIncluded`, `subjectToNOC`).
- History array stores all counter-offer rounds with timestamps.

## Offer Lifecycle Workflow

1. Offer submitted and set to `pending`.
2. Agent reviews and forwards to owner/landlord.
3. Counter-offer rounds continue until accepted/rejected/expired.
4. Accepted offers trigger MOU/LOI pipeline and compliance checklist.

## Counter-Offer Governance

- Every round requires actor, amount, note, and timestamp.
- Counter rounds limited by configurable max (default 8) before escalation.
- Price delta warnings when deviation exceeds threshold.
- Final accepted round locked from editing.

## Comparison and Ranking View

- Side-by-side compare by price, conditions, funding path, and profile quality.
- Ranking score factors: price strength, certainty, timeline readiness.
- Conflicts flagged when two accepted offers target same property.
- Manager override required for non-top-ranked acceptance.

## Expiry and Automation Rules

- Cron marks offers `expired` after `validUntil`.
- Pre-expiry reminder notifications at 24h and 2h.
- Expired offers remain read-only with reason code.
- Reopen flow requires fresh `validUntil` and audit reason.

## Acceptance Triggers

- Generate MOU/LOI document package.
- Send WhatsApp + email updates to all relevant parties.
- Create downstream tasks (RERA forms, compliance checks, transaction prep).
- Update property state to `under_offer` or `reserved` based on policy.

## Offer Analytics and KPIs

- Average offers per property.
- Average negotiation rounds to closure.
- Price achieved vs listing price percentage.
- Offer-to-close conversion by agent and segment.

## API Contract

- `POST /api/offers` create offer.
- `PATCH /api/offers/:id/counter` submit counter-offer.
- `PATCH /api/offers/:id/accept` accept final offer.
- `PATCH /api/offers/:id/reject` reject offer.
- `GET /api/offers?propertyId=` list and compare offers.

## Test Plan

- Validation tests for required fields and participant rule.
- Workflow tests across pending/counter/accepted/rejected/expired.
- Cron expiry and reminder dispatch tests.
- Trigger tests for document generation and notifications.

## Rollback Plan

- Feature flag for offer ranking and automation triggers.
- Fallback to manual acceptance workflow if notification chain fails.
- Preserve all offer history snapshots for incident replay.
- Backfill script for reconciliation after rollback.
