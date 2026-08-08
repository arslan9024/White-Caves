# Property Valuation

> **Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** AVM engine, rental yield calculator and bank valuation request workflow.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM property valuation feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend valuation/insights refinement lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The valuation module provides AVM-based pricing, manual override controls, rental yield analysis, and bank valuation requests.

## Requirement catalog

### REQ-VAL-001: AVM inputs, outputs, and history

The system shall calculate estimated value using a documented input set and preserve valuation history.

**Acceptance criteria:**

- [ ] AVM uses location, size, bedroom, bathroom, floor, view, age, and transaction inputs
- [ ] Output includes estimated value, confidence, and comparable count
- [ ] Historical snapshots are retained for trend analysis

**Evidence:** valuation snapshot, comparable log, and history graph.

### REQ-VAL-002: Rental yield and investment metrics

The system shall calculate gross and net rental yield using the property’s financial inputs.

**Acceptance criteria:**

- [ ] Gross and net yield formulas are explicit
- [ ] Service charges are represented in the net calculation
- [ ] Yield values are visible in the property detail view

**Evidence:** yield calculation output and property analytics snapshot.

### REQ-VAL-003: Manual override and approval workflow

The system shall support manual valuation overrides by authorized valuers with manager approval.

**Acceptance criteria:**

- [ ] Override requires rationale and approver metadata
- [ ] Unauthorized users cannot submit overrides
- [ ] Override delta is auditable against the AVM baseline

**Evidence:** override log, approval record, and audit trail.

### REQ-VAL-004: Bank valuation request handling

The system shall submit valuation requests to banks with the required document set and status tracking.

**Acceptance criteria:**

- [ ] Title deed, floor plan, and snapshot are attached
- [ ] Request status is tracked from submission to response
- [ ] Bank-specific adapters preserve the request format

**Evidence:** bank request record and status timeline.

## Traceability

- Maps to `REQ-SP-003`, `REQ-FRPT-004`, and valuation visibility in `functional-requirements.md`
- Aligns to `WC-SRS-014` and valuation evidence artifacts
- Feeds pricing, yield, and bank request validation

## 2. AVM Inputs and Output Schema

AVM output should include value, confidence, comparison count, and method metadata, with explicit source references for each comparable.

## 3. Rental Yield Calculator

Property valuation requirements are now captured in the catalog below, covering AVM inputs, yield calculations, manual overrides, and bank valuation requests.

## 4. Comparable Selection Logic

- Minimum 3 comparables, preferred 5-8.
- Same community priority; fallback to nearest comparable district.
- Date window: most recent 12 months, weighted by recency.
- Outlier pruning when price/sqft deviates > 2.5 standard deviations.

## 5. Confidence Scoring

- Confidence factors:
  - Comparable count quality
  - Data freshness
  - Feature similarity (beds, baths, BUA, view)
  - Transaction reliability source
- Output confidence bands:
  - 85-100: high confidence
  - 60-84: medium confidence
  - <60: low confidence (manual valuer review required)

## 6. Manual Override Workflow

1. RERA valuer submits override value + rationale.
2. Manager approves/rejects override.
3. Final value tagged with `method=manual_override` and approver metadata.
4. Audit log stores AVM baseline and override delta.

## 7. Bank Valuation Request Path

- Initiated from property profile.
- Required attachments: title deed, floor plan, latest valuation snapshot.
- Bank-specific formats normalized through adapter layer.
- SLA tracking from request creation to bank response.

## 8. Data Storage and History

- Collection: `property_valuations`.
- Snapshot fields: `propertyId`, `estimatedValueAed`, `confidence`, `method`, `comparables[]`, `createdAt`.
- Historical trend graph sourced from monthly snapshots.
- TTL disabled (valuations are retained for compliance + analytics).

## 9. API Contract

- `GET /api/valuations/:propertyId` → latest valuation + history summary.
- `POST /api/valuations/:propertyId/recalculate` → triggers AVM recompute.
- `POST /api/valuations/:propertyId/override` → manual override (restricted role).
- `POST /api/valuations/:propertyId/bank-request` → submit bank valuation request.

## 10. Acceptance Criteria

- AVM returns value range and confidence for every active property.
- Override path requires authorized roles and audit trail.
- Rental yield shown as gross + net with explicit formula reference.
- Bank request path records status lifecycle and response artifacts.

## 11. Test Plan

- Unit: comparable selection and confidence scoring.
- Integration: recalculate endpoint persists new snapshot.
- Permission: override rejected for non-authorized users.
- Regression: valuation history chart remains stable with backfilled data.

## 12. Rollback Strategy

- Feature flag `VALUATION_V2_ENABLED` controls AVM rollout.
- Fallback to previous valuation snapshot when recompute fails.
- Full recompute jobs can be paused without data loss.
- Incident runbook includes recalculation replay by property batch.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
