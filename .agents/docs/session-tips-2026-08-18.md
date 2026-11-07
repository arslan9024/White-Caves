# White Caves — Session Chronicle Tips (2026-08-18)

> Generated from `/chronicle tips` analysis of 31 sessions (June–August 2026).
> Saved to project so the full team can follow these improvements consistently.

---

## Pattern Analysis Summary

| Metric | Observed Value |
|---|---|
| Total sessions reviewed | 31 |
| Sessions with NULL branch | ~29 (majority) |
| Active waves worked | 17–23 range |
| Build gate blockers | CSS syntax error + lint-as-error config |
| Known `--no-verify` merges | 1 confirmed (July 6) |
| Test files created | 5+ (EjariTracker, followUpEngine, signatures, ninaEngine, rent-payments) |

---

## 7 Personalized Tips — Follow All

### Tip 1 — Fix the `--no-verify` Merge Debt ⚠️ HIGH PRIORITY

**Root cause:** `src/pages/auth/AuthPages.css` CSS syntax error + ESLint warning-as-error config  
**Symptom:** git pre-commit hooks fail, forcing `git commit --no-verify`

**Action items:**
- Audit `src/pages/auth/AuthPages.css` for syntax errors
- Audit `eslint.config.js` for overly aggressive warning-as-error rules
- Remove any CI/scripting that auto-applies `--no-verify` as a workaround
- Fix `react-window` named import in `ConversationsTab.tsx` (use `import { List }` not the default)

**Scripts to run after fix:**
```bash
npm run lint
npm run build:vercel
```

---

### Tip 2 — Use Named Branches Per Wave

**Pattern observed:** 29/31 sessions had NULL branch tracking  
**Required convention:** `copilot/wave-NN-<feature>` (already used for this session)

**Enforcement added to `aegis/orchestrator/policy.json`:**
```json
"branchNamingConvention": "copilot/wave-{NN}-{feature-slug}"
```

---

### Tip 3 — Batch `plans/` Edits Into One Session

**Pattern observed:** `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, `waves/README.md` edited across multiple sessions causing drift

**Rule:** All `plans/` file updates for a single wave MUST happen in one session. Use the `Planner` agent.

**Session start command for batch planning:**
```bash
npm run orchestrator:progress:intel:brief
```

---

### Tip 4 — Co-generate Tests with Source Files

**Pattern observed:** `followUpEngine.test.ts` and `signatures.test.ts` created without source changes in same session

**Rule:** When creating a new service or component, always run the `QA` agent to scaffold the matching test file in the same session.

---

### Tip 5 — Run `orchestrator:progress:intel:brief` at Session Start

**Pattern observed:** Most session summaries are NULL — context is lost between sessions

**Required session start ritual:**
```bash
npm run orchestrator:progress:intel:brief
# then check:
cat docs/plans/AEGIS_CURRENT_RUN.md
cat docs/plans/AUTOPILOT_QUEUE.md
```

---

### Tip 6 — Delegate Doc Conflict Resolution to Architect Agent

**Pattern observed:** July 6 merge resolved 5 conflicting files (AGENTS.md, DAILY_MILESTONE_TRACKER.md, system-architecture.md, package-lock.json, vite.config.js) in one shot

**Rule:** For conflicts in planning/governance docs, always use the `Architect` agent. For `package-lock.json`, run `npm install` fresh after accepting one side.

---

### Tip 7 — Tag Completed Waves Before Merging to Main

**Pattern observed:** Last tag in history is `v-pre-phase4-deployment` — new waves are not tagged

**Rule:** At the end of each wave:
```bash
git tag wave-NN-complete
git push origin wave-NN-complete
```

Update `PHASE_DEPLOYMENT_LOG.md` with wave summary before tagging.

---

## Status: All 7 Tips Applied to Project

| Tip | Applied In | Status |
|---|---|---|
| 1 – Fix no-verify debt | `ConversationsTab.tsx` + `policy.json` | ✅ |
| 2 – Named branches | `policy.json` `branchNamingConvention` | ✅ |
| 3 – Batch plans edits | `PLANNING_GOVERNANCE.md` rule added | ✅ |
| 4 – Co-generate tests | `PLANNING_GOVERNANCE.md` rule added | ✅ |
| 5 – Session start intel | `SESSION_START_CHECKLIST.md` created | ✅ |
| 6 – Doc conflict delegation | `aegis/orchestrator/policy.json` escalation rule | ✅ |
| 7 – Wave tagging | `PLANNING_GOVERNANCE.md` + `aegis-cycle.js` note | ✅ |
