# Aegis Upgrade-Day Runbook (vNext v2)

## Scope
- Applies to orchestrator policy upgrades in `scripts/orchestrator/policy.json`.
- Baseline: `2026.05.27-aegis-vnext-v2` (`schemaVersion: 2.0.0`).

## Pre-Upgrade
1. Run policy validation and diff gate:
   - `npm run aegis:policy:gate`
2. Capture baseline health:
   - `npm run aegis:health`
   - `npm run aegis:gates:report` (if available)
3. Confirm rollout mode and canary configuration in policy:
   - `rollout.environment`
   - `rollout.policyModeByEnv`
   - `rollout.canaryPercentByEnv`

## Upgrade Rollout
1. Start in `shadow` or `canary` mode (never direct full cutover for high-risk changes).
2. Run canary checks:
   - `npm run aegis:gates`
   - `npm run aegis:route:batch`
   - `npm run aegis:bench:record -- --task policy-upgrade --outcome pass`
3. Verify no regression against benchmark threshold.

## Rollback Triggers
- Policy diff gate fails without ACK for critical paths.
- Verification gates produce hard fail.
- Confidence routing degrades into unexpected high-risk approvals.
- Benchmark regression exceeds policy threshold.

## Rollback Procedure
1. Trigger rollback plan:
   - `npm run aegis:rollback:status`
   - `npm run aegis:rollback:trigger -- <taskId> --reason "policy-regression"`
2. Re-run:
   - `npm run aegis:health`
   - `npm run aegis:gates`
3. Move rollout mode back to stable/approval-only path.

## Post-Upgrade Review
1. Run consolidated health check and archive output.
2. Record benchmark comparison for 7-day window.
3. Governance decision:
   - Keep
   - Tune thresholds/weights
   - Roll back to previous baseline
