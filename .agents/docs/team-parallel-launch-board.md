# White Caves 4-Team Priority Launch Board

**Date:** May 16, 2026
**Owner:** @Margaret
**Purpose:** Run the four highest-priority workstreams in parallel across the 40-agent planning pool.

---

## Overview

The planning pool is split into 4 teams of 10 agents each. Each team owns **one priority stream** so the organization can advance **4 different tasks in parallel**.

## Execution Mode

- **Run all four teams together**: Team A, Team B, Team C, and Team D should all be active at the same time.
- **Use the full 40-agent pool**: every agent stays assigned inside one of the 4 teams.
- **Speed priority**: choose the shortest path to a usable result for each stream; avoid side quests.
- **Phase closeout order**:
  1.  Complete all 4 priority streams
  2.  Update `DAILY_MILESTONE_TRACKER.md`
  3.  Update `PROJECT_PROGRESS_REPORT.md`
  4.  Then start the app with `npm run dev`

### Launch Rule

- One priority stream per team
- One primary output file per stream
- One review gate per completed stream
- No team may overwrite another team’s owned files

---

## Team A — Google Login + Full CRM Refactor

**Priority goal:** Make Google login the first gate, grant the owner full CRM visibility, and refactor the CRM design/flows to remove current UX and workflow issues.

**Primary docs:**

- `business_docs/06_flowcharts/user-authentication-flow.md`
- `business_docs/06_design_architecture/ui-ux-specification.md`
- `business_docs/09_user_roles_permissions/expanded_roles.md`
- `AUTONOMOUS_UPGRADE.md`

**Prompt to run:**
`Team A — EXPAND: user-authentication-flow.md + ui-ux-specification.md → define Google login flow, owner-only full CRM visibility, role gating, and a CRM refactor plan for design and workflow issues`

---

## Team B — Linda + Henry AI Assistants

**Priority goal:** Bring Linda and Henry to 100% functional status as quickly as possible.

**Primary docs:**

- `backend/services/whatsapp/WHATSAPP_INTEGRATION_README.md`
- `plans/ai_assistants/28-henry.md`
- `plans/ai_assistants/17-nadia.md`
- `business_docs/03_ai_assistants/README.md`

**Prompt to run:**
`Team B — AUDIT: WhatsApp integration + Henry assistant docs → identify Linda and Henry reliability gaps, functional blockers, fallback behavior, and completion checklist to reach 100% functionality`

---

## Team C — Leasing Department A to Z

**Priority goal:** Own the entire leasing department end-to-end, including all leasing AI assistants.

**Primary docs:**

- `plans/ai_assistants/09-daisy.md`
- `plans/departments/03-operations.md`
- `business_docs/09_crm_features/tenancy-ejari.md`
- `business_docs/09_crm_features/landlord-portal.md`
- `plans/IMPROVEMENTS_INCOMPLETE_FEATURES.md`

**Prompt to run:**
`Team C — EXPAND: leasing department docs → define A-to-Z leasing workflow, portal touchpoints, and leasing AI assistant coverage from lead to renewals`

---

## Team D — HR Department

**Priority goal:** Own the HR department end-to-end, including hiring, onboarding, employee lifecycle, and HR assistant coverage.

**Primary docs:**

- `plans/ai_assistants/10-nancy.md`
- `plans/departments/03-operations.md`
- `business_docs/09_operations/onboarding-checklist.md`
- `business_docs/09_user_roles_permissions/expanded_roles.md`

**Prompt to run:**
`Team D — EXPAND: HR department docs → define hiring, onboarding, employee lifecycle, and HR assistant workflows with clear acceptance criteria`

---

## Team Execution Snapshot

| Team | Priority Stream                  | Status |
| ---- | -------------------------------- | ------ |
| A    | Google login + full CRM refactor | Ready  |
| B    | Linda + Henry assistants         | Ready  |
| C    | Leasing department A to Z        | Ready  |
| D    | HR department                    | Ready  |

---

## Output Expectations

Each team should return:

1. Updated content pasted into the owned `business_docs/` or `plans/` file
2. A short completion note with the key sections added
3. A handoff line in the required format:
   - `CONSUMES←@Agent: file#section`
   - `FEEDS→@Agent: file#section`

---

## Initial Rotation Order

1. Team A starts first: Google login + CRM refactor
2. Team B starts second: Linda + Henry assistants
3. Team C starts third: leasing department
4. Team D starts fourth: HR department

---

## Review Gate

When all 4 teams complete their active stream, @Margaret should:

- update `DAILY_MILESTONE_TRACKER.md`
- record the completed outputs in `PROJECT_PROGRESS_REPORT.md`
- assign the next REVIEW task to each idle team

---

**End of Launch Board**
