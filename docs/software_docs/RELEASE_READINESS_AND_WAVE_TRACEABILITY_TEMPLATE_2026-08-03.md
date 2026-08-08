# Release Readiness and Wave Traceability Template

**Status:** Active  
**Owner:** Software Delivery Governance  
**Last Updated:** 2026-08-03  
**Purpose:** Give the software delivery stack a reusable template for release readiness, quality evidence, and wave-to-requirement traceability.

This template is intended to bridge the business documentation layer, the software design layer, and the planning stack so each implementation wave can be reviewed in a consistent way.

## 1) Wave summary

| Field | Description |
| --- | --- |
| Wave ID | Short identifier for the implementation wave |
| Business objective | Business outcome the wave is intended to support |
| Primary business reference | Link to the relevant business document |
| Primary software reference | Link to the relevant software requirement or design artifact |
| Planning artifact | Link to the wave backlog or planning entry |
| Owner | Responsible delivery owner |
| Target release | Planned release or deployment milestone |

## 2) Requirement and design traceability

| Requirement or business rule | Related software artifact | Evidence expected | Status |
| --- | --- | --- | --- |
| Example: lead should have a clear next action | Functional spec / use case / component design | Acceptance criteria and test evidence | Planned |
| Example: compliance event must be auditable | Design contract / audit trail spec | Evidence log and test case | Planned |

## 3) Quality gate checklist

- [ ] Business outcome documented and linked
- [ ] Requirement or design artifact updated
- [ ] Acceptance criteria are testable
- [ ] Relevant tests or validation steps defined
- [ ] Release risk and rollback notes captured
- [ ] Planning artifact updated with current status

## 4) Validation evidence

| Check | Command or evidence path | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | Pending |
| Lint | `npm run lint` | Pending |
| Targeted tests | Example: `npm run test:run:unit -- <scope>` | Pending |
| Plans validation | `npm run plans:validate` | Pending |

## 5) Release readiness decision

Use the following decision structure before release:

- **Ready** — all required evidence exists and no unresolved blockers remain.
- **Conditional** — evidence exists, but a small risk or follow-up remains.
- **Blocked** — critical traceability, test evidence, or release controls are missing.

## 6) Recommended usage

Use this template for each significant implementation wave, feature rollout, or release candidate. Keep the references updated as the work progresses so the project remains reviewable and auditable.
