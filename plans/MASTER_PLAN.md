# White Caves Real Estate — Master Plan

> **Single Source of Truth** — Updated May 12, 2026  
> **Goal**: Move from a stale 40% headline to a **verified 75% completion target**  
> **Canonical Path**: `/plans/MASTER_PLAN.md`

---

## Program Reset: 40% Stale Baseline → 75% Verified Target

### Why this reset exists

- `PROJECT_OVERVIEW.md` still reports a January 2026 **40%** snapshot.
- `PROJECT_PROGRESS.md` contains conflicting **82%** and **95%** readiness claims.
- Several older docs describe work as incomplete even though the routes, models, and UI shells now exist in code.

### Verification rule

Progress only counts when all of the following are true:

1. The feature exists in code.
2. Acceptance criteria are satisfied.
3. Required tests/build checks have passed for the changed scope.
4. A verifier other than the implementer signs off.
5. `PROJECT_PROGRESS.md` is updated with evidence.

### Status language

- **Planned**
- **Ready**
- **In Progress**
- **Code Complete**
- **In Verification**
- **Verified**
- **Blocked**
- **Shipped**

---

## Verified Baseline (May 12, 2026)

### Already verified in code

| Area                                     | Evidence                                                                                    | Status   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| Homepage shell + aggregate API           | `src/pages/HomePage.tsx`, `server/routes/homepage.ts`                                       | Verified |
| Landlord portal APIs                     | `server/routes/landlord.ts`                                                                 | Verified |
| Tenant portal APIs                       | `server/routes/tenantPortal.ts`                                                             | Verified |
| CRM dashboard shell + assistant plan API | `src/pages/UnifiedDashboardPage.tsx`, `server/routes/crm.ts`, `server/routes/assistants.ts` | Verified |
| Contracts CRUD                           | `server/routes/contracts.ts`                                                                | Verified |
| Appointments CRUD                        | `server/routes/appointments.ts`                                                             | Verified |
| Role request workflow                    | `server/routes/roleRequests.ts`, `server/index.ts`                                          | Verified |
| Tenancy agreements alias                 | `server/index.ts` → `/api/tenancy-agreements`                                               | Verified |
| TOTP 2FA                                 | `server/routes/auth.ts`                                                                     | Verified |

### Current completion framing

- **Reported baseline to retire:** 40%
- **Current truth:** strong platform foundation with incomplete polish and uneven verification
- **Execution target:** 75% **verified** completion
- **Measurement method:** weighted milestone verification, not narrative estimates

---

## New Priority Order

The fastest path to a real +35% gain is to finish the highest-value visible product areas first.

| Priority            | Lane   | Description                         | Verification Outcome                                     |
| ------------------- | ------ | ----------------------------------- | -------------------------------------------------------- |
| **#1 — Now**        | Lane B | Public homepage completion          | Search flow, mobile, accessibility, performance verified |
| **#2 — Now**        | Lane C | Landlord + tenant portal completion | Real integrations, empty/loading/error states verified   |
| **#3 — High**       | Lane D | CRM real-API completion             | Remaining mock-backed modules reduced and verified       |
| **#4 — High**       | Lane E | DevOps / production hardening       | CI, security review, runtime checks verified             |
| **#5 — Continuous** | Lane A | Planning / truth maintenance        | Baseline, ledger, dependencies, blockers kept accurate   |

---

## Multi-Agent Execution Model

Not all 35 named personas are directly callable subagents in this environment. The usable execution agents here are:

- **Architect**
- **Planner**
- **Explore**
- **Coder**
- **Database**
- **Designer**
- **Security**
- **SEO**
- **DevOps**
- **QA**
- **guardian**

### How to use them together

1. **Architect** defines the slice and boundaries.
2. **Planner** turns the slice into task IDs and acceptance criteria.
3. **Explore** confirms what is already implemented.
4. **Database / Designer / Security / SEO / DevOps** add parallel constraints for that slice.
5. **Coder** implements one vertical slice end-to-end.
6. **QA** verifies behavior and fixes regressions.
7. **guardian** signs off on readiness before the milestone counts toward completion.

### Execution lanes

| Lane   | Focus                           | Primary callable agents    |
| ------ | ------------------------------- | -------------------------- |
| Lane A | Planning / truth / dependencies | Planner, Explore, guardian |
| Lane B | Public website                  | Designer, SEO, Coder, QA   |
| Lane C | Portal completion               | Coder, Database, QA        |
| Lane D | CRM integration                 | Coder, Security, QA        |
| Lane E | DevOps / release                | DevOps, Security, guardian |

### Operating rules

- Do **not** run multiple coding agents on the same file at once.
- Use **vertical slices**, not scattered edits.
- No feature starts without acceptance criteria.
- A milestone only changes the project percentage after independent verification.
- Documentation/spec agents feed coding lanes first; they do not replace verification.

---

## Five-Day Recovery Milestones

| Day   | Theme                | Target Output                                                            | Weight |
| ----- | -------------------- | ------------------------------------------------------------------------ | ------ |
| Day 1 | Truth reset          | Canonical baseline, lane ownership, blocker map, verified ledger         | 10%    |
| Day 2 | Backend unblock      | Remaining blocked APIs/uploads/payments priorities clarified and started | 20%    |
| Day 3 | Frontend integration | Homepage + portals wired/polished against real APIs                      | 20%    |
| Day 4 | CRM readiness        | Highest-value CRM mock gaps removed, key user flows verified             | 15%    |
| Day 5 | Hardening            | QA, accessibility, security, CI/build evidence captured                  | 10%    |

**Total recovery target:** **+35% verified movement** from the stale 40% headline to a 75% verified target.

---

## Definition of Done

A milestone is **done** only when:

- code or documentation is complete for the committed scope
- acceptance criteria are checked off
- required tests/build checks pass
- security/accessibility review runs where applicable
- progress ledger is updated with evidence
- verification owner is named

---

## Verification Gates

### Gate 1 — Scope gate

- task IDs defined
- dependencies recorded
- acceptance criteria written

### Gate 2 — Implementation gate

- feature is code complete
- no unresolved blockers inside the slice

### Gate 3 — Quality gate

- QA executed
- security/accessibility checks run where applicable

### Gate 4 — Runtime gate

- build succeeds for changed code
- targeted runtime or integration checks pass

### Gate 5 — Truth gate

- `PROJECT_PROGRESS.md` updated
- `CURRENT_SPRINT.md` and `DAILY_MILESTONE_TRACKER.md` reflect actual status
- verifier is recorded

---

## Foundation Already Built (Do Not Re-Do)

| Item                              | Description                                                                     | Status   |
| --------------------------------- | ------------------------------------------------------------------------------- | -------- |
| TypeScript strict mode foundation | TS project structure and mixed JS/TS compatibility are in place                 | Verified |
| Build pipeline                    | Vite production build succeeds                                                  | Verified |
| Design system                     | Gold/dark theme, styled-components, tokens                                      | Verified |
| Auth infrastructure               | JWT, bcrypt, Firebase/OAuth support, 2FA routes, rate limiting                  | Verified |
| Core backend routes               | properties, leads, crm, assistants, portals, contracts, appointments, reporting | Verified |
| CRM dashboard shell               | Unified dashboard layout and assistant registry                                 | Verified |
| Homepage shell                    | Hero, sections, homepage data flow                                              | Verified |
| Portal shells                     | Landlord and tenant pages plus backend APIs                                     | Verified |

---

## Current Delivery Focus

### Lane B — Public website

- homepage hero integration and cleanup
- search-to-lead verification
- mobile polish
- Lighthouse/performance evidence
- accessibility review

### Lane C — Portal completion

- documents, payments, maintenance, and dashboard states
- empty/loading/error state consistency
- landlord/tenant regression verification

### Lane D — CRM completion

- remaining mock-backed modules inventory
- real API connection priorities
- tab readiness alignment

### Lane E — Hardening

- CI/CD truth audit
- security review of auth/uploads/assistant endpoints
- test expansion on critical paths

---

## Archive and Historical Docs

- `IMPLEMENTATION_STATUS.md` is archived and not a live status source.
- `PROJECT_OVERVIEW.md` should be treated as a January 2026 historical snapshot.
- `PROJECT_PROGRESS.md`, `CURRENT_SPRINT.md`, and `DAILY_MILESTONE_TRACKER.md` are live only when updated with verified evidence.
