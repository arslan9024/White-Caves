# Investment Management

> **Owner:** @Mary | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** MavenInvestment module for investor profiles, portfolio dashboards and deal flow pipeline.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM investment management feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend dashboard/decision-support lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The investment management module tracks investor profiles, portfolio performance, and high-value deal approval flows.

## Requirement catalog

### REQ-INV-001: Investor profile and eligibility model

The system shall store investor risk, horizon, and eligibility criteria for freehold and restricted zones.

**Acceptance criteria:**

- [ ] Investor profile includes risk appetite and horizon
- [ ] Eligibility checks are visible by area
- [ ] Profile changes are auditable

**Evidence:** investor profile record and eligibility audit.

### REQ-INV-002: Portfolio dashboard and KPI tracking

The system shall show portfolio value, yields, occupancy, and unrealized gain/loss.

**Acceptance criteria:**

- [ ] Dashboard shows current value and total invested
- [ ] Yield and occupancy are visible per property and portfolio
- [ ] Historical trends are available for comparison

**Evidence:** portfolio dashboard and trend snapshot.

### REQ-INV-003: Deal flow pipeline and governance

The system shall track deal stages and require committee approval for large investments.

**Acceptance criteria:**

- [ ] Pipeline stages are recorded with probability
- [ ] High-value deals require committee approval
- [ ] Decision logs are retained

**Evidence:** deal pipeline log and committee decision record.

### REQ-INV-004: ROI tools and investor reports

The system shall calculate ROI scenarios and generate investor reports.

**Acceptance criteria:**

- [ ] Cash vs mortgage comparisons are available
- [ ] Scenario outputs are labeled conservative/base/optimistic
- [ ] Reports can be exported in approved formats

**Evidence:** ROI calculation output and report export.

## Traceability

- Maps to `REQ-FRPT-001`, `REQ-FRPT-003`, and finance analytics coverage
- Aligns to `WC-SRS-010`, `WC-SRS-014`, and investment evidence artifacts
- Feeds portfolio, pipeline, and reporting validation

## 2. Investor Profile Fields

Investor profiles should include risk appetite, investment horizon, preferred areas, liquidity profile, and citizenship-based eligibility checks.

## 3. Portfolio Dashboard KPIs

Investment management requirements are now captured in the catalog below, covering investor profiles, dashboard KPIs, deal flow, and ROI reporting.

## 4. Investor Profiling Model

- Risk appetite, horizon, preferred areas, and liquidity profile.
- Eligibility checks for freehold/restricted zones.

## 5. Portfolio Analytics

- Unrealized gain/loss, occupancy, cash flow trend.
- Yield breakdown by asset and area.

## 6. Deal Flow Pipeline

- Stages: opportunity, diligence, LOI, transfer, portfolio.
- Probability-weighted forecasting.

## 7. ROI Tools

- Cash vs mortgage comparison.
- Scenario planning (conservative/base/optimistic).
- Breakeven and payback calculations.

## 8. Reporting and Exports

- Quarterly investor report PDF.
- Export to Excel for committee review.

## 9. Governance Workflow

- Committee approval for high-value investments.
- Decision log and sign-off capture.

## 10. API Contract

- `GET /api/investors/:id/portfolio`
- `POST /api/investors/:id/deals`
- `GET /api/investors/:id/reports`

## 11. Acceptance Criteria

- Portfolio KPIs render accurately with historical context.
- Deal pipeline states are auditable and role-controlled.
- Reports export without data loss.

## 12. Test Plan

- ROI formula correctness tests.
- Pipeline stage transition tests.
- Reporting export and permissions tests.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
