# Implementation Execution Playbook

**Status:** Active  
**Owner:** Documentation Governance + Delivery Operations  
**Last Updated:** 2026-08-03  
**Purpose:** Give contributors a concise, repeatable path from business intent to implementation, validation, and handoff.

---

## 1) What this playbook is for

Use this document when a feature, workflow, compliance change, or delivery wave needs to move from planning into execution.

It answers four questions quickly:

1. Where should I start?
2. Which documents are authoritative?
3. What validation is required before I hand off work?
4. How do I leave behind a clean, traceable result?

---

## 2) Source-of-truth map

### Business layer

Use these for business intent, operating rules, compliance obligations, and acceptance expectations:

- [business_docs/README.md](./business_docs/README.md)
- [business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md](./business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md)
- [business_docs/AI_AUTOMATION_AND_ASSISTANT_MAP_2026-08-03.md](./business_docs/AI_AUTOMATION_AND_ASSISTANT_MAP_2026-08-03.md)
- [business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md](./business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md)
- [business_docs/WAVE_TO_REQUIREMENT_AND_RELEASE_MAPPING_2026-08-03.md](./business_docs/WAVE_TO_REQUIREMENT_AND_RELEASE_MAPPING_2026-08-03.md)

### Software layer

Use these for technical design, implementation contracts, and release readiness:

- [software_docs/INDEX.md](./software_docs/INDEX.md)
- [software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md](./software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md)
- [software_docs/IMPLEMENTATION_READINESS_CHECKLIST_2026-08-03.md](./software_docs/IMPLEMENTATION_READINESS_CHECKLIST_2026-08-03.md)
- [software_docs/RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md](./software_docs/RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md)

### Planning and execution layer

Use these for the active roadmap, queue, and wave bundles:

- [plans/MASTER_PLAN.md](./plans/MASTER_PLAN.md)
- [plans/PENDING_TASKS_ONLY.md](./plans/PENDING_TASKS_ONLY.md)
- [plans/waves/README.md](./plans/waves/README.md)
- [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)
- [DAILY_MILESTONE_TRACKER.md](./DAILY_MILESTONE_TRACKER.md)

---

## 3) Recommended execution flow

### Step 1 — Start from outcome, not code

Before editing anything, find the matching business reference:

- If the task is a feature or workflow, open the relevant business doc in [business_docs/09_crm_features](./business_docs/09_crm_features).
- If the task is compliance, security, or legal, review [business_docs/05_requirements](./business_docs/05_requirements).
- If the task is a cross-functional release or wave, consult [business_docs/WAVE_TO_REQUIREMENT_AND_RELEASE_MAPPING_2026-08-03.md](./business_docs/WAVE_TO_REQUIREMENT_AND_RELEASE_MAPPING_2026-08-03.md).

### Step 2 — Confirm the implementation contract

Once the business intent is clear, check the relevant software contract:

- use-case or behavior reference in [software_docs/03_use_cases](./software_docs/03_use_cases);
- technical design in [software_docs/02_software_design](./software_docs/02_software_design);
- flow or sequence reference in [software_docs/04_flowcharts](./software_docs/04_flowcharts).

### Step 3 — Work from the active wave backlog

Use the active wave bundle rather than ad-hoc task lists:

- open the matching wave implementation backlog in [plans/waves](./plans/waves);
- confirm the task is still relevant against the latest tracker files;
- keep the scope narrow and avoid parallel edits to the same artifact.

### Step 4 — Validate before handoff

Every meaningful change should be validated with the appropriate checks:

- documentation updates: run `npm run plans:validate`;
- implementation changes: run `npm run typecheck`, `npm run lint`, and `npm run build` where the scope justifies it;
- feature or regression work: run targeted tests for the affected area.

### Step 5 — Leave behind traceable evidence

Before marking a task complete, ensure:

- the implementation or doc change exists;
- the relevant business/software/planning link is updated;
- the tracker reflects the new status;
- any blocker or follow-up is documented clearly.

---

## 4) Handoff packet template

Use this structure for any non-trivial task handoff:

- **Task ID** — the wave or task identifier
- **Owner** — who is accountable
- **Objective** — the business outcome being delivered
- **Input artifact(s)** — exact business/software/planning file links
- **Output artifact** — the file or module expected to change
- **Acceptance criteria** — at least three measurable checks
- **Validation steps** — the commands or review checks to run
- **Blocker status** — clear note of what remains unresolved

Example:

```text
Task ID: W32-001
Owner: Documentation Governance
Objective: Consolidate business/software/planning traceability for a feature wave
Input artifacts: docs/business_docs/..., docs/software_docs/..., docs/plans/...
Output artifact: docs/IMPLEMENTATION_EXECUTION_PLAYBOOK_2026-08-03.md
Acceptance criteria: navigation is clearer, the playbook is linked from the canonical indexes, plans validation passes
Validation steps: npm run plans:validate
Blocker status: none
```

---

## 5) Quality gates for delivery

A task should not be considered complete until the following are true:

1. The relevant business intent is documented.
2. The technical contract or implementation reference exists.
3. The task is linked to the active planning wave or backlog.
4. Validations relevant to the scope have been run and reviewed.
5. The change is discoverable from the canonical entry points.

---

## 6) Role-based starting points

### For founders or executives

Start with:

- [business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md](./business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md)
- [business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md](./business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md)
- [plans/MASTER_PLAN.md](./plans/MASTER_PLAN.md)

### For product or business analysts

Start with:

- [business_docs/README.md](./business_docs/README.md)
- [business_docs/WAVE_TO_REQUIREMENT_AND_RELEASE_MAPPING_2026-08-03.md](./business_docs/WAVE_TO_REQUIREMENT_AND_RELEASE_MAPPING_2026-08-03.md)
- [software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md](./software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md)

### For engineers and implementers

Start with:

- [software_docs/INDEX.md](./software_docs/INDEX.md)
- [software_docs/IMPLEMENTATION_READINESS_CHECKLIST_2026-08-03.md](./software_docs/IMPLEMENTATION_READINESS_CHECKLIST_2026-08-03.md)
- the matching wave backlog in [plans/waves](./plans/waves)

### For QA or operational reviewers

Start with:

- [software_docs/RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md](./software_docs/RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md)
- [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)
- [DAILY_MILESTONE_TRACKER.md](./DAILY_MILESTONE_TRACKER.md)

---

## 7) Current priority focus

The current governance emphasis is to keep the repository navigable, traceable, and execution-ready. The highest-value actions remain:

- keep business docs tied to software design and planning;
- keep wave bundles and task trackers synchronized;
- ensure every major change leaves behind a clear discoverable path for the next contributor.
