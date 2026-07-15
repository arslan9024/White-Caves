# Next Phase Implementation Plan — Turn 1348

> Generated automatically by Aegis autopilot per-turn planning upgrade
> Generated at: 2026-05-27 03:22:07
> Previous turn selected task: AUTO-918

## Candidate for Next Turn

- **Task ID:** AUTO-919
- **Source ID:** GENERATED-919
- **Title:** Generated follow-up: harden unresolved diagnostics and regressions
- **Priority:** P1
- **Owner:** @Mira + @Katherine
- **Owner Agent:** @Mira
- **Team:** Platform
- **Current Score:** 88

## Planning Evidence Inputs

### Full Codebase Context Read

```text
⟳  White Caves — Codebase Scan starting…

  [1/5] Scanning source code… 1287 findings in 2120 files
  [2/5] Running TypeScript check… 0 error(s)
  [3/5] Running build check… ✓ pass
  [4/5] Scanning open waves… 2 wave(s) found
  [5/5] Checking doc completeness… 93 incomplete doc(s)

──────────────────────────────────────────────────────────────────────
  WHITE CAVES — CODEBASE SCAN REPORT
  2026-05-26T23:21:42.691Z
──────────────────────────────────────────────────────────────────────
  Source files scanned : 2120
  Total findings       : 1287
  TypeScript errors    : 0
  Build                : ✓ PASS
  Open waves           : 2 (0 ready)
  Incomplete docs      : 93
──────────────────────────────────────────────────────────────────────

  TOP PRIORITY ITEMS:

  1. 🟡 [P2] Resolve 1008 [Action Required: Enforce production-ready engineering constraints]/FIXME/[Pending specific implementation definition per 90% readiness guidelines] comment(s) in source code
     Score: 10080 | Category: todos
     Agents: @Mira, @Una, @Barbara
     • src/components/crm/AICommandCenter.test.tsx (109 [Action Required: Enforce production-ready engineering constraints]s)
     • src/components/layout/SidebarContainer/SidebarContainer.test.tsx (48 [Action Required: Enforce production-ready engineering constraints]s)
     • src/components/OffPlanTracker.test.tsx (38 [Action Required: Enforce production-ready engineering constraints]s)

  2. 🔴 [P0] Review 80 potential security issue(s)
     Score: 2400 | Category: security
     Agents: @Radia, @Ecem, @Daniela
     • src/components/crm/shared/PaymentInstructionDeck.test.tsx:37
     • src/components/PropertyMap.test.tsx:75
     • src/components/PropertyMap.test.tsx:85

  3. 🟠 [P1] Implement 131 stub/empty API handler(s)
     Score: 1572 | Category: stub-handlers
     Agents: @Mira, @Ruchi, @Joelle
     • src/store/crmDataSlice.tsx (43 stubs)
     • src/components/dashboard/AgentTabs.tsx (10 stubs)
     • src/store/slices/lindaSlice.ts (7 stubs)

  4. 🟡 [P2] Add tests for 68 untested route(s)
     Score: 544 | Category: missing-tests
     Agents: @Katherine, @Sal ... [truncated]
```

### Online Research Upgrade Signals

```text
> white-caves-real-estate@1.0.0 orchestrator:discover-upgrade:report
> node scripts/orchestrator/discover-upgrade.js --json

{
  "generatedAt": "2026-05-26T23:22:06.740Z",
  "dryRun": false,
  "maxInject": 3,
  "skipped": false,
  "skipReason": null,
  "scanDate": "2026-05-26T23:21:42.691Z",
  "summary": {
    "totalSourceFiles": 2120,
    "totalFindings": 1287,
    "tsErrors": 0,
    "buildOk": true,
    "openWaves": 2,
    "readyWaves": 0,
    "incompleteDocs": 93,
    "priorityItems": 7
  },
  "featuresAnalyzed": 39,
  "gapsDetected": 37,
  "selectedFeatures": [
    {
      "featureId": "security-csrf-mutation-routes",
      "name": "CSRF coverage for mutation routes",
      "score": 155,
      "agent": "@S5",
      "targetFile": "business_docs/09_crm_features/wave-16-security-hardening.md",
      "signatureMatches": {
        "matched": 0,
        "total": 2
      },
      "planMentions": 5,
      "scanMentions": 1
    },
    {
      "featureId": "leasing-pdc-bounce-escalation",
      "name": "PDC bounce escalation",
      "score": 155,
      "agent": "@Victoria",
      "targetFile": "business_docs/09_crm_features/tenancy-ejari.md",
      "signatureMatches": {
        "matched": 0,
        "total": 2
      },
      "planMentions": 7,
      "scanMentions": 1
    },
    {
      "featureId": "finance-vat-fta-filing",
      "name": "VAT FTA filing workflow",
      "score": 155,
      "agent": "@Invoice",
      "targetFile": "business_docs/09_crm_features/financial-reporting.md",
      "signatureMatches": {
        "matched": 0,
        "total": 2
      },
      "planMentions": 6,
      "scanMentions": 1
    }
  ],
  "tasksGenerated": [
    {
      "taskId": "DU001",
      "featureId": "security-csrf-mutation-routes",
      "agent": "@S5",
      "targetFile": "business_d ... [truncated]
```

## Implementation Checklist (Next Turn)

- [ ] Confirm latest contracts/requirements for this task in plans/PENDING_TASKS_ONLY.md
- [ ] Execute target implementation command for this task
- [ ] Run focused diagnostics for touched files
- [ ] Update AUTOPILOT_QUEUE and AGENT_LOGS with execution evidence

## Notes

This file is regenerated each turn to keep one fresh, execution-ready plan for the next loop iteration.
