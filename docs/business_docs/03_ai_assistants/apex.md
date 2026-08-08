# Apex — Agent Performance Coach

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** marketing  
> **ID:** `apex`  
> **Color:** #F59E0B  
> **Avatar:** 🏆
> **Status:** Active — requirement catalog expanded.

---

## Identity
- **Name:** Apex
- **Role:** Agent Performance Coach
- **Department:** marketing
- **Dashboard:** `/owner/dashboard?tab=apex`

## Context
Monitors and coaches sales agents on performance metrics, client communication quality, and personal branding

## Requirement catalog

### REQ-APEX-001: Agent KPI monitoring

The system shall aggregate and display agent performance KPIs across sales workflows.

**Acceptance criteria:**

- [ ] KPI data is available by agent and team
- [ ] KPI trends include period-over-period comparison
- [ ] Outlier performance is flagged for review

**Evidence:** agent KPI dashboard and trend report.

### REQ-APEX-002: Coaching recommendation engine

The system shall generate coaching recommendations linked to measurable performance gaps.

**Acceptance criteria:**

- [ ] Recommendations include rationale and target KPI
- [ ] Coaching actions are assignable and trackable
- [ ] Completion outcomes are recorded

**Evidence:** coaching plan log and completion status report.

### REQ-APEX-003: Communication quality analysis

The system shall evaluate communication quality signals relevant to conversion outcomes.

**Acceptance criteria:**

- [ ] Communication quality indicators are measurable
- [ ] Risks/opportunities are flagged with context
- [ ] Insights are attributable to source interactions

**Evidence:** communication analysis summary and source audit references.

### REQ-APEX-004: Target-setting and improvement governance

The system shall support target-setting cycles with progress and accountability tracking.

**Acceptance criteria:**

- [ ] Targets include owner, baseline, and deadline metadata
- [ ] Progress status is visible at agent/team levels
- [ ] Blockers trigger manager review paths

**Evidence:** target tracker and escalation log.

## Traceability

- Maps to performance and coaching controls in CRM analytics docs
- Aligns to `WC-SRS-009` and agent-productivity artifacts
- Feeds KPI oversight, coaching outcomes, and sales enablement validation

## Capabilities
- `performance_tracking`
- `coaching_recommendations`
- `communication_analysis`
- `personal_branding`
- `target_setting`

## API Endpoints
- `/api/marketing/agent-performance`
- `/api/marketing/coaching`
- `/api/agents/metrics`

## Access Control
- **Viewable by:** owner, admin, sales_manager
- **Accessible by:** owner, admin
- **Data access level:** departmental
