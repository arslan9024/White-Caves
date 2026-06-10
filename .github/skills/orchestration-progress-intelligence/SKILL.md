---
name: orchestration-progress-intelligence
description: 'Generates and interprets Aegis progress intelligence (daily/monthly movement, velocity, and ETA forecasting)'
---

# Orchestration Progress Intelligence

Use this skill when leadership asks: "Are we really progressing?", "How fast are we improving?", or "When will we gain +30% completion?"

## Scope

- Daily and monthly movement by category:
  - developed
  - fixed
  - upgraded
- Throughput velocity across 24h/7d/30d windows
- Forecast ETA to policy target improvement (`targetProjectBoostPct`)
- Quality signal via cycle scan pass-rate trend

## Workflow

1. Run `npm run orchestrator:progress:intel` to refresh state.
2. Open `npm run orchestrator:dashboard:watch` and validate the control-tower section.
3. Check confidence and ETA stability against real throughput.
4. If metrics are missing or stale, fix observability before continuing feature work.

## Output Format

- **Now**: current completion and active velocity
- **Next**: ETA to target and confidence
- **Movement**: daily/monthly developed/fixed/upgraded
- **Quality**: 30-day scan pass-rate

## Decision Rules

- If ETA worsens for 2+ runs in a row, prioritize blocker reduction over new feature fanout.
- If quality trend < 70%, shift capacity to stabilization and verification.
- If confidence is low, report forecast as directional (not committed).

## Gotchas

- Do not treat raw task count as real value without quality signal.
- Do not close waves when dashboard shows missing progress intelligence data.

<!-- White Caves orchestration observability skill -->
