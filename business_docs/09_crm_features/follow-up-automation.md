# Follow-Up Automation

> **Owner:** @Hedy | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** Automated sequence engine for lead nurture, lease renewal reminders and post-viewing flows.
> **Status:** Stub -- awaiting expansion by @Hedy.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. Sequence Builder (Triggers and Actions)

> _TODO: expand this section with full spec._

## 3. Execution Engine and Opt-Out Rules

> _TODO: expand this section with full spec._

## 4. Sequence Templates

- New lead nurture.
- Viewing follow-up.
- Lease renewal sequence.

## 5. Trigger Conditions

- Stage change, inactivity window, event completion.
- Timezone-aware schedule execution.

## 6. Action Types

- Send WhatsApp template.
- Send email.
- Create task.
- Add CRM note.

## 7. Pause and Resume Logic

- Manual agent activity pauses automation.
- Resume policies configurable by sequence.

## 8. Reporting and Effectiveness

- Open/reply/conversion metrics by sequence.
- A/B comparison support for variants.

## 9. API Contract

- `POST /api/follow-ups/sequences`
- `POST /api/follow-ups/run`
- `GET /api/follow-ups/metrics`

## 10. Acceptance Criteria and Tests

- Triggers fire exactly once per event.
- Pause/resume logic prevents duplicate outreach.
- Metrics reflect sequence outcomes accurately.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
