# Session Start Checklist — White Caves Aegis

> Run these steps at the start of every new Copilot coding session.
> Based on `/chronicle tips` pattern analysis — 2026-08-18.

## Step 1 — Get Current State (Required)

```bash
npm run orchestrator:progress:intel:brief
```

Then read:
```bash
cat docs/plans/AEGIS_CURRENT_RUN.md | head -40
cat docs/plans/AUTOPILOT_QUEUE.md | head -30
```

## Step 2 — Confirm Your Branch

```bash
git branch
```

You MUST be on a named branch matching the convention:
```
copilot/wave-NN-<feature-slug>
```

If you are on `main` or `develop` directly, create a branch before making any changes:
```bash
git checkout -b copilot/wave-NN-<feature-slug>
```

## Step 3 — Check Build Health

```bash
npm run typecheck 2>&1 | tail -5
```

If typecheck passes, the environment is healthy. If it fails, fix blockers before starting.

## Step 4 — Check for Outstanding Blockers

```bash
npm run orchestrator:blockers:brief 2>/dev/null || cat docs/plans/AEGIS_AUTOPILOT_ISSUES_BACKLOG.md | head -30
```

## Step 5 — Identify Your Wave

Open the relevant wave backlog before writing any code:
```
docs/plans/waves/WAVE_NN_IMPLEMENTATION_BACKLOG.md
```

---

## End-of-Wave Checklist

Before merging a completed wave to `main`:

- [ ] All wave tasks in `IMPLEMENTATION_BACKLOG.md` marked ✅
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build:vercel` passes
- [ ] Tests pass: `npm run test:run`
- [ ] Tag the wave:
  ```bash
  git tag wave-NN-complete
  # engine-tools-report_progress handles the push
  ```
- [ ] Update `PHASE_DEPLOYMENT_LOG.md` with wave summary
- [ ] Update `docs/plans/DAILY_MILESTONE_TRACKER.md`

---

## Commit Message Conventions

```
feat(scope): short description
fix(scope): short description
docs(plans): update wave NN backlog
test(scope): add coverage for X
refactor(scope): dedup / optimize Y
```

Do NOT use `--no-verify` to bypass hooks. Fix the root cause instead.

---

## Conflict Resolution Rules

| File type | Agent to delegate to |
|---|---|
| `AGENTS.md`, `MASTER_PLAN.md`, governance docs | `Architect` agent |
| `package-lock.json` | Run `npm install` fresh, accept one side |
| TypeScript source files | `Coder` agent |
| Test files | `QA` agent |
| CSS/styling | `Designer` agent |
