# WAVE_02_DATA_CONTRACT_INVENTORY

**Date:** May 15, 2026  
**Source:** `prisma/schema.prisma` + wave docs  
**Status:** ACTIVE BASELINE FOR WAVES 03–11

---

## Core Entities (System of Record)

### Identity / RBAC

- `User`
  - authoritative for role, status, identity, and role-linked ownership checks

### CRM Core

- `Lead`
  - source-of-truth for lead lifecycle, assignment, and source attribution (`source=whatsapp` for Wave 03)
- `Property`
  - source-of-truth for listing state and compliance-gated publish behavior
- `Transaction`
  - source-of-truth for financial transaction lifecycle, compliance-gated write flows
- `Activity`
  - event/audit activity feed foundation for user and lead actions

### Compliance-touching structures

- `Document` (existing in repo context)
  - KYC, compliance artifacts, review states
- consent model/workflow (to be enforced in Wave 04 where missing)

---

## Wave 03 Contract Focus (WhatsApp)

Primary entities:

- conversation/message storage entities (Nadia/Nina/queue models per existing implementation)
- `Lead` for auto-capture and source attribution
- `Activity` for operational traceability

Required invariants:

1. inbound message processing must be idempotent,
2. conversation assignment state must be consistent,
3. lead source tagging must be deterministic (`whatsapp`).

---

## Wave 04 Contract Focus (Compliance)

Primary entities:

- `Property` permit-gated listing state
- `Document` KYC/compliance artifacts and review state
- `Transaction` blocked when required compliance checks fail
- consent records for PDPL actions

Required invariants:

1. listing activation cannot bypass permit validations,
2. transaction creation cannot bypass KYC validation where required,
3. consent state transitions are traceable and reversible via policy.

---

## Index and Query Guidance

- Preserve existing Prisma indexes on high-query fields (`status`, `role`, `source`, `createdAt`, ownership ids)
- Add/adjust indexes only with clear query evidence and rollback plan
- Avoid cross-wave schema churn without contract update in wave SDD/readiness packet

---

## Merge Policy Link

For all waves, apply merge policy from the 11-wave execution program:

- micro-wave merges,
- build/type/lint gate,
- targeted unit/integration/e2e validation,
- rollback note required.
