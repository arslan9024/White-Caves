# Sophia — Sales Pipeline Manager

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Sales  
> **ID:** `sophia`  
> **Color:** #8B5CF6  
> **Avatar:** 👩‍💻
> **Status:** Active — requirement catalog expanded.

---

## Overview
Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics.

## Requirement catalog

### REQ-SOPHIA-001: Pipeline stage governance

The system shall manage opportunities through defined sales stages with auditable transitions.

**Acceptance criteria:**

- [ ] Pipeline stages are explicitly defined and role-controlled
- [ ] Stage changes capture actor, timestamp, and reason
- [ ] Invalid stage jumps are blocked by policy

**Evidence:** opportunity timeline and stage transition audit.

### REQ-SOPHIA-002: Lead assignment and workload balancing

The system shall assign opportunities using configurable ownership and balancing rules.

**Acceptance criteria:**

- [ ] Assignment supports manager override and auto-routing
- [ ] Workload distribution is visible by agent
- [ ] Reassignment events are logged

**Evidence:** assignment ledger and workload dashboard.

### REQ-SOPHIA-003: Deal tracking and forecasting

The system shall track deal value, probability, expected close date, and forecast rollups.

**Acceptance criteria:**

- [ ] Deal cards include value, probability, and expected close date
- [ ] Forecast output is available by team and period
- [ ] Forecast variance can be reviewed against actuals

**Evidence:** forecasting report and variance comparison.

### REQ-SOPHIA-004: Commission and performance analytics

The system shall expose commission calculations and sales performance KPIs.

**Acceptance criteria:**

- [ ] Commission values are calculated from deal rules
- [ ] KPIs include win rate, cycle time, and average deal size
- [ ] Exportable reports are available for managers

**Evidence:** commission report and KPI export.

## Traceability

- Maps to `REQ-FRPT-002`, `REQ-OFF-003`, and `REQ-APR-001`
- Aligns to `WC-SRS-010` and `WC-SRS-011`
- Feeds sales execution, forecasting, and payout validation

## Capabilities
- Pipeline management
- Lead assignment
- Deal tracking
- Sales forecasting
- Commission calculation

## API Endpoints
- `/api/sales`
- `/api/pipeline`
- `/api/deals`

## Data Flows
- **Receives from:** Clara
- **Sends to:** Theodora, Zoe

## Access Control
- **Viewable by:** Owner, Admin, Sales Manager, Agent
- **Accessible by:** Owner, Admin, Sales Manager
- **Data access level:** Departmental
