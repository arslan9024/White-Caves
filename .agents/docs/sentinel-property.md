# Sentinel Property Management — Business Specification

**Owner:** @Mary (DeepSeek V3 — DeepSeek Chat)  
**Status:** ✅ Implementation-ready (P0 inventory hardening)  
**Target:** 12 sections  
**CRM Module:** SentinelPropertyCRM (`src/components/crm/SentinelPropertyCRM/`)  
**API Base:** `/api/properties`

---

## 1) Overview

SentinelPropertyCRM manages the full inventory lifecycle for White Caves, with DAMAC Hills 2 as a primary operational focus. The module ensures every listing is complete, compliant, priced with comp-backed logic, and operationally ready for leasing or sale.

### Core outcomes

- Reduce listing defects and compliance misses before publication.
- Increase conversion through complete media and quality scoring.
- Protect data integrity via duplicate controls and import validation.
- Improve landlord confidence through transparent audit and status logs.

---

## 2) Property Lifecycle State Machine

### States

`draft -> pending_review -> listed -> under_offer -> reserved -> sold_or_leased -> withdrawn -> relisted`

### Transition rules

| From                            | To             | Gate Conditions                                   |
| ------------------------------- | -------------- | ------------------------------------------------- |
| draft                           | pending_review | Mandatory base fields complete                    |
| pending_review                  | listed         | Compliance checks passed + manager approval       |
| listed                          | under_offer    | Valid offer attached                              |
| under_offer                     | reserved       | Offer accepted + reservation terms confirmed      |
| reserved                        | sold_or_leased | Contract signed + transaction completion evidence |
| listed / under_offer / reserved | withdrawn      | Withdrawal reason + owner/manager signoff         |
| withdrawn                       | relisted       | Repricing + freshness checks complete             |

### State integrity

- No direct jumps that bypass compliance gates.
- Every transition writes actor, timestamp, reason, and previous state.

---

## 3) Mandatory Listing Data and Compliance Gates

### Universal mandatory fields

- Property type, area, community, building, unit
- Bedrooms, bathrooms, BUA, asking price/rent
- Title deed or ownership evidence reference
- Minimum media pack (photos + floor plan)
- Assigned agent and listing intent (sale/lease)

### Conditional compliance fields

| Scenario         | Additional Required Data                                          |
| ---------------- | ----------------------------------------------------------------- |
| Resale listing   | Title deed number + ownership proof                               |
| Off-plan listing | Permit/approval references + developer NOC/approval if applicable |
| Lease listing    | Lease-ready fields and tenancy constraints                        |

### Publication gate

Listings cannot move to `listed` until all mandatory and conditional checks pass.

---

## 4) Property Quality Score Model (0–100)

Quality score is used for internal ranking, activation confidence, and portal publishing readiness.

| Component           | Rule                                    | Weight |
| ------------------- | --------------------------------------- | ------ |
| Photos              | Sufficient high-quality photo set       | 10     |
| Description quality | > 100 words and complete key details    | 15     |
| Floor plan          | Valid floor plan attached               | 20     |
| Virtual tour        | 3D/interactive tour provided            | 25     |
| 360 media/video     | 360 media or equivalent rich tour media | 30     |

### Score policy

- < 60: blocked for premium publication lanes.
- 60–79: publishable with improvement prompts.
- > = 80: premium-ready badge and distribution priority.

---

## 5) Duplicate Detection and Override Controls

### Match keys

High-confidence duplicate detection uses:

- community
- building
- unit number

Secondary confidence signals:

- title deed number
- geolocation proximity + same BUA + same owner reference

### Override policy

- Overrides require mandatory reason code.
- Manager approval required for high-confidence duplicate override.
- Override decisions are fully auditable and reviewable.

---

## 6) Bulk CSV Import Specification

### Required import columns

`propertyType, area, community, building, unit, bedrooms, bathrooms, BUA, price, agentId`

### Validation rules

- Required fields cannot be null.
- Numeric fields must be valid numeric ranges.
- Enum fields must map to supported values.
- Agent IDs must resolve to active users.
- Duplicate checks run before commit.

### Import behavior

- Supports partial success with row-level reject report.
- Reject report includes row number, field, and failure reason.
- Import summary includes total, accepted, rejected, duplicate-flagged.

---

## 7) API Contract (Business-Level)

- `POST /api/properties/import` — bulk ingestion with validation report
- `PATCH /api/properties/:id/state` — state transition with gate checks
- `GET /api/properties/:id/quality-score` — score breakdown and recommendations
- `POST /api/properties/:id/duplicate-override` — controlled override path

---

## 8) Operational Views and Controls

### Inventory manager dashboard

- Listings by state
- Listings blocked by compliance gate
- Quality score distribution
- Duplicate queue and override queue

### Agent view

- My listings by quality and readiness
- Missing field prompts
- Repricing and activity timeline

---

## 9) DAMAC Hills 2 Execution Rules

- Every DAMAC Hills 2 listing must include cluster/segment tag.
- Comp references must prioritize DAMAC Hills 2 equivalents.
- Weekly pricing review required for all active DAMAC Hills 2 listings.
- Stale listings (> configured threshold) auto-enter manager review queue.

---

## 10) Compliance, Audit, and Traceability

- Every state change is append-only logged.
- Every compliance block records exact failed rule and remediation hint.
- Every duplicate override stores approver + reason + timestamp.
- All import jobs store request metadata and immutable result summary.

---

## 11) KPIs and Quality Targets

| KPI                                     | Target      |
| --------------------------------------- | ----------- |
| Listing completeness before publish     | >= 98%      |
| Duplicate false negatives               | <= 1%       |
| Average time draft to listed            | <= 48 hours |
| Listings with quality score >= 80       | >= 70%      |
| Import reject rate due to schema errors | <= 5%       |

---

## 12) Acceptance Criteria and Test Plan

- [ ] Invalid listings are blocked from `listed` with explicit reasons.
- [ ] Duplicate detection catches high-confidence collisions deterministically.
- [ ] Duplicate override requires reason + manager approval at high confidence.
- [ ] Bulk import produces row-level deterministic success/failure output.
- [ ] Quality score endpoint returns reproducible scoring breakdown.
- [ ] DAMAC Hills 2 listings enforce segment tag and comp-policy checks.

### Test scenarios

1. Publish attempt with missing required fields -> blocked.
2. High-confidence duplicate import row -> flagged and held.
3. Override without manager approval -> rejected.
4. Mixed valid/invalid CSV -> partial success with reject report.
5. Quality score recalc after media upload -> score updates correctly.
