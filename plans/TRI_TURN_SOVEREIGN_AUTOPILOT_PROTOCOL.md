# Tri-Turn Sovereign Autopilot Protocol

> **Protocol ID:** `TTSAP-333x3`  
> **Primary Command:** `npm run aegis:sovereign999`  
> **Lane Order:** docs-governance -> frontend -> backend  
> **Issue Quota:** `333` per lane turn (`999` per macro-cycle)  
> **Mode:** Unlimited AEGIS autopilot; retries until a fresh GitHub query reports zero open issues  
> **Canonical Runner:** `aegis/orchestrator/tri-turn-sovereign-autopilot.js`

---

## 1) Purpose

This protocol merges:

1. The prior high-volume AEGIS GitHub issue generation + solver model.
2. The current turn-based improvement loops:
   - docs/governance first,
   - frontend second,
   - backend third.

The objective is to keep discovery, execution, and closure deterministic while continuously improving the codebase and governance layers.

---

## 2) One-Command Entrypoint

```bash
npm run aegis:sovereign999
```

Human-style alias:

```bash
npm run aegis:run:tri-turn-sovereign-autopilot-protocol
```

Additional operational modes:

- Preflight (required before live autopilot):

```bash
npm run aegis:sovereign999:preflight
```

- Preflight + governance gates:

```bash
npm run aegis:sovereign999:preflight:gates
```

- Dry run (no GitHub writes):

```bash
npm run aegis:sovereign999:dry
```

- Continuous loop mode:

```bash
npm run aegis:sovereign999:loop
```

- Unlimited zero-open mode (canonical live behavior):

```bash
npm run aegis:tri-turn:sovereign
```

The canonical command runs with `--unlimited --auto-merge`. It does not finish
because a local queue is empty or because a cycle made no progress. It finishes
normally only after a fresh GitHub query confirms zero open issues (pull requests
are excluded from the issue count).

- Bounded single-cycle live run:

```bash
npm run aegis:sovereign999:once
```

---

## 3) Macro-Cycle Structure

Each macro-cycle executes three ordered turns:

1. **Turn 1 — Docs/Governance (333)**
   - scans `plans/`, `docs/`, `.github/`
   - finds governance debt (TODO/FIXME/TBD/PLACEHOLDER and stale status markers)
   - creates/syncs up to 333 issues

2. **Turn 2 — Frontend (333)**
   - scans `src/`
   - finds placeholder tests, explicit `any/as any`, weak test assertions
   - creates/syncs up to 333 issues

3. **Turn 3 — Backend (333)**
   - scans `server/` and `src/server/`
   - finds explicit `any/as any`, route validation gaps, and mutation error-boundary gaps
   - creates/syncs up to 333 issues

Total target per cycle: **999 issues**.

---

## 4) Fingerprint Dedupe Contract (Mandatory)

Each issue carries a stable fingerprint in body metadata:

```text
TTSAP_FINGERPRINT: <lane>|<rule>|<file>|L<line>
```

### Dedupe behavior

- If an open issue with the same fingerprint exists, protocol skips re-creation.
- This prevents duplicate issue storms across repeated cycles.

---

## 5) Milestone & Label Governance

### Milestones

Pattern:

```text
TTSAP-<cycleId>-<turnIndex>-<LANE>
```

Example:

```text
TTSAP-2026-09-05-C001-1-DOCS-GOVERNANCE
```

### Labels

Every created issue includes:

- `tri-turn-sovereign`
- `autopilot:solver`
- `lane:docs-governance` OR `lane:frontend` OR `lane:backend`
- `severity:p0|p1|p2|p3`
- `cycle:<cycleId>`
- `turn:<1|2|3>`

---

## 6) Solver Model (Reality-Only Closure)

After discovery turns complete, solver pass scans open `tri-turn-sovereign` issues.

The solver is strictly serial: it processes one issue at a time, reopens failures, records `retry-pending`, and does not advance past the unresolved issue unless the runner is explicitly configured to continue after failure.

An issue is auto-closed **only if** fingerprint verification proves the triggering rule is no longer reproducible in target scope.

This keeps closure tied to real remediation, not optimistic status drift.

---

## 7) Hard-Stop Gates (Safety)

In non-dry mode, the protocol runs strict quality gates before finalizing cycle:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`

Validation failures block the current issue and are retried by unlimited mode
with backoff and self-healing executor research. Only safety/authentication/API
failures that cannot be recovered, or an explicit operator stop, are hard stops.

### Normal completion condition

`BACKLOG_EMPTY` is valid only when the live GitHub issue query returns:

```text
open issues: 0
```

Blocked cycles, no-progress cycles, empty local queues, and pending PRs are not
completion conditions.

---

## 8) State, Reporting, and Resume

### State file

- `logs/orchestrator/tri-turn-sovereign-state.json`

Contains protocol name, last cycle summary, and rolling run history.

### Reports

- `plans/TRI_TURN_SOVEREIGN_AUTOPILOT_REPORT.md`
- `logs/orchestrator/tri-turn-sovereign-report.json`

Both summarize created/skipped/closed counts per turn and cycle metadata.

The state file also records the current blocking issue, retry count, halt reason, and the last known phase so interrupted runs can resume without losing the failure chain.

---

## 9) Step-by-Step Runtime Walkthrough

## Step 1 — Start command

Operator runs:

```bash
npm run aegis:sovereign999
```

## Step 2 — Create cycle ID

Runner creates cycle ID using current date and sequence index.

## Step 3 — Turn 1 (Docs/Governance)

- Discover lane issues
- Apply dedupe against open fingerprint map
- Create milestone and issue batch
- Persist interim counters

## Step 4 — Turn 2 (Frontend)

- Discover lane issues
- Apply dedupe
- Create milestone and issue batch
- Persist interim counters

## Step 5 — Turn 3 (Backend)

- Discover lane issues
- Apply dedupe
- Create milestone and issue batch
- Persist interim counters

## Step 6 — Hard-stop quality checks

- typecheck/lint/build
- abort cycle on any failure

## Step 7 — Solver verification close pass

- For each open tri-turn issue with fingerprint:
  - re-check triggering rule at target file/line/scope
  - close only if resolved

## Step 8 — Publish reports and state

- append markdown run report
- write json run report
- update state history for continuity

## Step 9 — Loop continuation

Unlimited mode automatically starts the next cycle after cooldown. Every cycle
re-fetches GitHub before deciding whether to continue. Broad issues are
decomposed, child issues are evidence-validated, and configured Git workflow
branches/commits/PRs/green auto-merges are processed before the next live count.

---

## 10) Suggested Operations Playbook

1. Run preflight first (`aegis:sovereign999:preflight`) to ensure required files + auth source are ready.
2. Run gate-aware preflight (`aegis:sovereign999:preflight:gates`) before first live cycle.
3. Run dry mode for visibility and packet verification.
4. Run the canonical unlimited command after preflight passes.
5. Keep GitHub auto-merge enabled only when the repository policy permits it;
   otherwise PRs remain review-gated and the live issue count remains nonzero.
6. Review the live open-issue count and report after each cycle.

### Launch Guardrail

Do not run the canonical command if preflight returns `FAIL`. Unlimited mode
must retain valid GitHub authentication because it cannot verify completion
without a live GitHub query.

---

## 11) Alignment with Existing AEGIS Rules

- Plan-first and governance-first ordering is preserved.
- Frontend and backend are isolated into separate improvement turns.
- Closure requires verification evidence, reducing false positives.
- Queue/report/state are persisted for multi-session continuity.
- Failed issues are retried in serial order before later items can close.
- `blocked-escalated` issues remain visible and must be resolved or manually reviewed before the cycle can continue.

### AEGIS Team System Integration (Mandatory)

Before solve phase, protocol must consume the canonical AEGIS Team files:

- `aegis/team/ROUTING_MATRIX.md`
- `aegis/team/SKILLS_CATALOG.md`
- `aegis/team/VALIDATION_GATEBOOK.md`
- `aegis/team/ESCALATION_POLICY.md`
- `aegis/team/ISSUE_WORK_PACKET_SCHEMA.md`
- `aegis/team/subagents/*.md`

For each issue, solver should resolve:

1. owner sub-agent + backup owner,
2. required skill pack,
3. validation commands,
4. retry and escalation policy,
5. closure evidence contract.

This ensures every issue closure reflects real implementation progress with accountable ownership.

---

## 12) Command Quick Reference

```bash
# Default one-cycle autopilot
npm run aegis:sovereign999

# Human-style alias
npm run aegis:run:tri-turn-sovereign-autopilot-protocol

# Dry-run (no GitHub writes)
npm run aegis:sovereign999:dry

# Continuous loop mode
npm run aegis:sovereign999:loop

# Legacy compatibility aliases (still available)
npm run aegis:tri-turn:sovereign
npm run aegis:tri-turn:sovereign:dry
npm run aegis:tri-turn:sovereign:loop
```
