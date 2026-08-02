# Investment Management

> **Owner:** @Mary | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** MavenInvestment module for investor profiles, portfolio dashboards and deal flow pipeline.
> **Status:** Stub -- awaiting expansion by @Mary.

---

## 1. Overview

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 2. Investor Profile Fields

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 3. Portfolio Dashboard KPIs

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

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
