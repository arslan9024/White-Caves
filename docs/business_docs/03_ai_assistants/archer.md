# Archer — Lead Scoring Engine

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** sales  
> **ID:** `archer`  
> **Color:** #EF4444  
> **Avatar:** 🎯
> **Status:** Active — requirement catalog expanded.

---

## Identity
- **Name:** Archer
- **Role:** Lead Scoring Engine
- **Department:** sales
- **Dashboard:** `/owner/dashboard?tab=archer`

## Context
Calculates lead conversion probability scores (0–100) using enquiry source, budget signals, area preference, and engagement history

## Requirement catalog

### REQ-ARCHER-001: Lead score computation consistency

The system shall compute lead scores using a defined, auditable scoring policy.

**Acceptance criteria:**

- [ ] Inputs used for scoring are traceable per lead
- [ ] Score outputs are bounded and reproducible
- [ ] Policy changes are versioned

**Evidence:** scoring audit report and policy version log.

### REQ-ARCHER-002: Conversion prediction transparency

The system shall provide interpretable conversion signals supporting agent decisions.

**Acceptance criteria:**

- [ ] Score explanations include top contributing factors
- [ ] Prediction confidence is surfaced
- [ ] Low-confidence scores flag manual review

**Evidence:** conversion explanation output and confidence report.

### REQ-ARCHER-003: Priority ranking and pipeline orchestration

The system shall rank leads for action sequencing and pipeline optimization.

**Acceptance criteria:**

- [ ] Priority ordering is available per queue and assignee
- [ ] Rank shifts are trackable over time
- [ ] Ranking supports SLA-aware task batching

**Evidence:** ranked lead queue snapshot and rank-change history.

### REQ-ARCHER-004: Scoring history and governance controls

The system shall preserve historical scoring events for review and compliance.

**Acceptance criteria:**

- [ ] Score history captures timestamps and model/rule context
- [ ] Access to score history follows RBAC policy
- [ ] Correction overrides require attribution

**Evidence:** scoring history export and override audit log.

## Traceability

- Maps to lead-scoring and pipeline controls in CRM specs
- Aligns to `WC-SRS-008` and qualification intelligence artifacts
- Feeds lead prioritization, assignment, and conversion validation

## Capabilities
- `lead_scoring`
- `conversion_prediction`
- `engagement_tracking`
- `budget_analysis`
- `priority_ranking`
- `pipeline_optimization`

## API Endpoints
- `/api/leads/:id/score`
- `/api/scoring/rules`
- `/api/scoring/history`

## Access Control
- **Viewable by:** owner, admin, sales_manager
- **Accessible by:** owner, admin
- **Data access level:** departmental
