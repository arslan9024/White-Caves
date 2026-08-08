# Sales Pipeline — CRM Feature Specification

> **Status:** Active (Implemented + Optimization)  
> **Module Owner:** Sophia (Sales Director AI)  
> **Priority:** High  
> **Primary Surfaces:** `SophiaSalesCRM_NEW`, pipeline/forecasting dashboards  
> **Last Updated:** 2026-08-07  
> **Next Review:** 2026-08-21  
> **Source of Truth:** CRM sales pipeline feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend state/performance/reliability lanes in `docs/plans/waves/WAVE_38_*` through `WAVE_40_*`

---

## Overview

The Sales Pipeline module governs deal progression from lead qualification to closing, with forecasting and stage-control logic for managers and executives.

---

## Business Rules

1. Every deal must be linked to a valid lead and property context.
2. Deals move through ordered stages only (no skipping approval-controlled stages).
3. Stage updates require activity evidence (call, viewing, offer, negotiation note).
4. Forecast values must be probability-weighted by stage.
5. Closed-won deals trigger downstream financial/commission workflows.

---

## Canonical Stage Flow

`new -> contacting -> viewing -> offering -> negotiation -> closed_won / closed_lost`

### Stage Governance

- `new -> contacting`: agent assignment required
- `contacting -> viewing`: scheduled viewing record required
- `viewing -> offering`: property fit confirmation + intent score threshold
- `offering -> negotiation`: formal offer submitted
- `negotiation -> closed_won`: acceptance confirmation and transaction creation
- any stage -> `closed_lost`: reason required (budget/timing/location/competitor/etc.)

---

## Role Access

- **Agent:** create/update own deals and stage notes
- **Manager:** view all team deals, override stages with audit note
- **Owner/Executive:** full visibility + forecast oversight

---

## Integration Points

- Leads module: source, score, and activity timeline
- Inventory module: property availability + pricing context
- Commission module: closed-won payout generation
- Executive dashboards: conversion and forecast KPIs

---

## Acceptance Criteria

- [ ] Stage transitions enforce required preconditions
- [ ] Closed-lost requires reason
- [ ] Closed-won triggers transaction/finance hooks
- [ ] Pipeline KPI cards update by stage movement
- [ ] Forecast accuracy metrics visible at manager/executive layer

---

**Last Updated:** May 2026
