# CURRENT SPRINT — 40% Baseline to 75% Verified Recovery

**Sprint Goal:** Establish one truthful completion baseline and execute the highest-value lanes that can move the project to **75% verified completion**.  
**Date:** 2026-05-12  
**Status:** Ready

---

## P0 Must Ship

| ID  | Milestone                   | Owner Lane | Acceptance Criteria                                                                             | Verification Owner | Status          |
| --- | --------------------------- | ---------- | ----------------------------------------------------------------------------------------------- | ------------------ | --------------- |
| S0  | Baseline reset              | Lane A     | Canonical roadmap, progress ledger, sprint board, and tracker are aligned                       | guardian           | In Verification |
| S1  | Homepage verification slice | Lane B     | Search flow, mobile, accessibility, and performance tasks are sequenced with proof requirements | QA                 | Ready           |
| S2  | Portal verification slice   | Lane C     | Portal integration gaps and UX-state coverage are enumerated and assigned                       | QA                 | Ready           |
| S3  | CRM integration slice       | Lane D     | Remaining mock-backed CRM priorities are identified and ordered                                 | Security + QA      | Ready           |
| S4  | Hardening slice             | Lane E     | Lint/test/build blockers are recorded and triaged without overstating readiness                 | guardian           | Ready           |

---

## P1 If Capacity

- refine weighted milestone accounting
- split CRM lane into module-specific sub-sprints
- add release evidence links for staging/runtime verification

---

## Dependency Map

1. **S0** must complete before any % claim changes.
2. **S1–S3** can run in parallel once acceptance criteria are approved.
3. **S4** consumes outputs from S1–S3 for build/QA/security sign-off.
4. No milestone becomes **Verified** until recorded in `PROJECT_PROGRESS.md`.

---

## Verification Queue

| Item            | Needed Evidence                                         |
| --------------- | ------------------------------------------------------- |
| Baseline reset  | updated docs + reviewer confirmation                    |
| Homepage slice  | targeted tests/build/accessibility/performance evidence |
| Portal slice    | targeted UI/API verification evidence                   |
| CRM slice       | module inventory + real API coverage evidence           |
| Hardening slice | lint/test/build/security findings with disposition      |
