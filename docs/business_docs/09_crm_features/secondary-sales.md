# Secondary Sales

> **Owner:** @Anima | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Secondary market transaction workflow, dual-agency disclosure and DLD transfer fee breakdown.
> **Status:** Stub -- awaiting expansion by @Anima.

---

## 1. Overview

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 2. Transaction Workflow (Seller Instruction to Commission Disbursement)

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 3. Dual Agency Disclosure (RERA Form A, B, I)

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

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
