# Offers Management — Business Specification

**Owner:** @Jaime (Llama 3.1 70B — Groq Console)
**Status:** 🟡 [Pending specific implementation definition per 90% readiness guidelines] — awaiting @Jaime Task 1
**Target:** 12 sections
**API Route:** `/api/offers`
**Related:** properties, leads, leases, documents (MOU/LOI generation)

---

## Overview

The offers module manages the negotiation workflow between buyers/tenants and sellers/landlords. It tracks every offer, counter-offer, and final acceptance — then automatically triggers MOU/LOI document generation upon acceptance.

**Key Capabilities:**

- Offer submission from buyer or tenant side
- Counter-offer rounds with full history tracking
- Multi-offer comparison table (side-by-side for same property)
- Automated offer expiry (cron sets status = expired after validUntil)
- Offer acceptance triggers: MOU/LOI PDF generation + WhatsApp notifications to all parties
- Offer analytics: average offers per property, negotiation rounds, price vs asking ratio

---

## [Action Required: Enforce production-ready engineering constraints] — @Jaime Task 1

Paste the output from this prompt into the sections below:

```
@Jaime — DRAFT: offers.md → spec /api/offers route: offer schema (propertyId, buyerId or tenantId, agentId, offerPrice AED, offerType: purchase/lease, validUntil date, status: pending/countered/accepted/rejected/expired, conditions: mortgageSubject/cashPurchase/furnitureIncluded/subjectToNOC, counterOfferHistory array of {price, date, fromParty, notes}), offer workflow (buyer submits → agent presents to seller/landlord → counter offer round → acceptance → auto-generate MOU or LOI PDF), offer comparison table (multiple offers on same property: side-by-side price, conditions, buyer profile), automated expiry cron (set status=expired when validUntil passed), offer acceptance triggers (generate MOU PDF, WhatsApp notification to all parties, create RERA form task), offer analytics (average offers per property, average negotiation rounds, price achieved vs asking %).
```

## [Action Required: Enforce production-ready engineering constraints] — @Jaime Task 2

```
@Jaime — DRAFT: whatsapp-integration.md → spec Meta WhatsApp Business API: WABA setup checklist, message template categories (UTILITY/MARKETING/AUTHENTICATION) with examples, webhook handler spec (/api/webhooks/meta), 24-hour conversation window management, opt-in/opt-out database tracking, rate limits and pricing tiers.
```

## [Action Required: Enforce production-ready engineering constraints] — @Jaime Task 3

```
@Jaime — EXPAND: whatsapp-integration.md → add NinaChatbot conversation flows (property enquiry, maintenance submission, payment reminder), human handoff triggers, broadcast campaign rate limits, WhatsApp Business widget embed spec.
```

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
