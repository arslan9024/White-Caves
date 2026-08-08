# Secondary Sales

> **Owner:** @Anima | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Secondary market transaction workflow, dual-agency disclosure and DLD transfer fee breakdown.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM secondary sales feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend workflow/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The secondary sales module manages resale transactions, disclosure forms, transfer fees, and settlement controls.

## Requirement catalog

### REQ-SEC-001: Secondary sale transaction workflow

The system shall track a resale transaction from seller instruction through DLD transfer completion.

**Acceptance criteria:**

- [ ] Workflow stages are recorded in order
- [ ] Stage transitions require mandatory documents
- [ ] Settlement completion is auditable

**Evidence:** secondary sale timeline and stage audit.

### REQ-SEC-002: Dual-agency disclosure enforcement

The system shall require dual-agency disclosure forms before offer acceptance when applicable.

**Acceptance criteria:**

- [ ] Form A, B, and I controls are available where required
- [ ] Missing disclosures block progress
- [ ] Signed copies are stored with the deal record

**Evidence:** disclosure log and signed form archive.

### REQ-SEC-003: DLD transfer fee and commission breakdown

The system shall calculate transfer fees, trustee costs, and commission splits with auditability.

**Acceptance criteria:**

- [ ] Fee breakdown shows buyer/seller shares and fixed admin fees
- [ ] Commission split is configurable and documented
- [ ] Calculations are reproducible from deal inputs

**Evidence:** fee worksheet and payout audit.

### REQ-SEC-004: NOC and escalation handling

The system shall manage NOC requests, delay handling, and transfer exceptions.

**Acceptance criteria:**

- [ ] NOC requests are tracked until resolved
- [ ] Delay and rejection paths escalate to the owner or manager
- [ ] Transfer status updates reach the dashboard

**Evidence:** NOC log, escalation record, and transfer status snapshot.

## Traceability

- Maps to `REQ-OFF-001`, `REQ-OFF-003`, and `REQ-FRPT-002`
- Aligns to `WC-SRS-011` and resale compliance artifacts
- Feeds transfer, fee, and disclosure validation

## 2. Transaction Workflow (Seller Instruction to Commission Disbursement)

Transaction workflow should remain stage-gated and disclosure-aware from seller instruction to commission release.

## 3. Dual Agency Disclosure (RERA Form A, B, I)

Secondary sales requirements are now captured in the catalog below, covering resale workflow, disclosure enforcement, fee breakdowns, and NOC handling.

## 4. Fee and Cost Breakdown

- DLD transfer fee (4%), admin fee, trustee fee bands.
- Buyer/seller split logic configurable by deal.
- Commission split to company and assigned agent.

## 5. Workflow Stages

1. Seller instruction and listing activation.
2. Offer negotiation and acceptance.
3. MOU signing and deposit confirmation.
4. NOC request and trustee scheduling.
5. DLD transfer completion and settlement.

## 6. Compliance Rules

- Mandatory dual-agency disclosure before offer acceptance.
- Form A/B/I validation and signed copy storage.
- AML and source-of-funds checks before transfer.

## 7. API Contract

- `POST /api/secondary-sales`
- `PATCH /api/secondary-sales/:id/stage`
- `POST /api/secondary-sales/:id/disclosures`
- `POST /api/secondary-sales/:id/transfer`

## 8. KPI Tracking

- Days from listing to transfer.
- Offer acceptance ratio.
- Commission per closed deal.
- Stage fall-off analysis.

## 9. Exceptions Handling

- NOC delay workflow and escalation.
- Transfer appointment failure retry.
- Buyer financing rejection branch.

## 10. Acceptance Criteria

- Stage transitions enforce mandatory documents.
- Fee calculations are auditable and accurate.
- Compliance disclosures captured for all dual-agency deals.
- Transfer status sync updates dashboard correctly.

## 11. Test Scenarios

- Happy-path sale to transfer completion.
- Missing form blocks stage advancement.
- Fee split edge cases validated.
- NOC delay triggers escalation rules.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
