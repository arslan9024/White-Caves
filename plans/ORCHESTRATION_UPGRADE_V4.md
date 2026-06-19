# White Caves Orchestration Upgrade V4

Date: 2026-06-10

## Objective

Make project progress visible, faster, and decision-ready by upgrading the full orchestration stack:

- Custom instruction execution quality
- Skills usage and validation discipline
- Agent/subagent routing quality
- Aegis runtime automation and progress forecasting

## What Is Upgraded

### 1) Aegis Progress Intelligence (new runtime layer)

- New script: `scripts/orchestrator/progress-intelligence.ps1`
- Produces durable state: `logs/orchestrator/progress-intelligence.json`
- Produces trend exports: `logs/orchestrator/progress-intelligence-trend.json` and `.csv`
- Computes:
  - Current completion
  - 24h / 7d / 30d velocity
  - Daily + monthly movement (`developed`, `fixed`, `upgraded`)
  - Quality trend (`cycle-log` pass rate)
  - ETA to reach `+30%` project completion (policy driven)
  - Confidence bands (optimistic / expected / conservative)
  - Lane-level ETA and confidence forecasts
  - Forecast drift alerts (ETA worsening streak detection)
  - Persistent progress history for trend-based intelligence
  - Reroute hints for capacity shifting during drift / stale blockers

### 2) Dashboard Control-Tower Visibility

- `scripts/orchestrator/dashboard.ps1` now renders **ORCHESTRATION PROGRESS INTELLIGENCE**:
  - Forecast target and ETA
  - Confidence bands for ETA
  - Lane-level ETA and confidence
  - Drift alert state and worsening streak
  - Reroute hint text
  - Blocker aging KPI (oldest/average/open > 4h)
  - Monthly sparkline over trend export
  - Confidence level
  - Velocity trend
  - Daily/monthly development movement
  - Quality trend (30d)

### 3) Autopilot Intelligence Refresh

- `scripts/orchestrator/agent-loop.ps1` now refreshes progress intelligence:
  - On preflight
  - After each completed task cadence (policy controlled)
- Ensures dashboard metrics stay fresh while autopilot runs.

### 4) Policy Controls

- `scripts/orchestrator/policy.json` added:
  - `aegis.progressIntelligenceEnabled`
  - `aegis.progressIntelligenceEveryNTasks`
  - `aegis.targetProjectBoostPct`
  - `aegis.progressDriftConsecutiveThreshold`
  - `aegis.blockerAgingWarnHours`

### 5) Command Surface

- `package.json` added:
  - `npm run orchestrator:progress:intel`
  - `npm run orchestrator:progress:intel:brief`

## Upgrade Scope Across Requested Areas

### Custom instructions

- Enforced by wiring policy-first execution and measurable outputs into runtime orchestration.
- Reduced instruction drift by turning expected outcomes into dashboard-visible metrics.

### Skills

- Skill outcomes are now indirectly quality-scored via cycle pass-rate and velocity impact.
- Enables comparison of “activity” vs “actual project movement”.

### Agents and subagents

- Agent execution now feeds project-intelligence state automatically.
- Subagent/planning output quality becomes observable through completion velocity and quality pass-rate trend.

### Aegis overall orchestration

- Upgraded from operational status dashboard to decision dashboard with predictive ETA.
- Enables proactive routing and pace control instead of reactive status checks.

## Operating Commands

- Live dashboard: `npm run orchestrator:dashboard:watch`
- Manual intelligence refresh: `npm run orchestrator:progress:intel`
- Brief snapshot: `npm run orchestrator:progress:intel:brief`
- Continuous autopilot loop: `npm run orchestrator:agent-loop:autopilot`

## Next Fast-Path Improvements (recommended)

1. Add lane-level quality trend (scan pass rate by lane).
2. Add automatic priority boost when blocker aging exceeds policy threshold.
3. Add forecast drift notification hooks for the dev runtime watcher.

## Success Criteria

- Dashboard always shows measurable movement (daily + monthly)
- ETA to `+30%` is visible and updates during autopilot
- No blind “working hard but unseen progress” periods
- Aegis optimization can be guided by data, not intuition
