# Property Valuation

> **Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** AVM engine, rental yield calculator and bank valuation request workflow.
> **Status:** Stub -- awaiting expansion by @Fei-Fei.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. AVM Inputs and Output Schema

> _TODO: expand this section with full spec._

## 3. Rental Yield Calculator

> _TODO: expand this section with full spec._

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
