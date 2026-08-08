# Activity Feed

> **Owner:** @Hedy | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** CRM activity timeline showing all agent and system events in real time.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM activity feed feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend workflow visibility lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The activity feed is the real-time timeline of CRM events across agents, managers, and system automations. It supports personal, team, and company views with searchable history and digests.

## Requirement catalog

### REQ-ACT-001: Activity event capture and rendering

The system shall capture key CRM events and render them in readable timeline cards.

**Acceptance criteria:**

- [ ] Lead, lease, payment, maintenance, and messaging events are captured
- [ ] Each event renders with an actor, entity reference, and timestamp
- [ ] Display text is contextual and safe for end users

**Evidence:** activity event log and rendered feed snapshot.

### REQ-ACT-002: Feed scoping and visibility controls

The system shall support personal, team, and company feed scopes with role-based restrictions.

**Acceptance criteria:**

- [ ] Personal feed shows only the user’s own events
- [ ] Team and company scopes respect role permissions
- [ ] Sensitive events are masked where required

**Evidence:** scope filter log and access-control check.

### REQ-ACT-003: Pagination, performance, and digest delivery

The system shall paginate feed items efficiently and generate digest notifications.

**Acceptance criteria:**

- [ ] Recent-first retrieval is performant at scale
- [ ] Infinite scroll or paging returns stable result sets
- [ ] Daily digest notifications can be sent from the feed queue

**Evidence:** pagination test, feed performance snapshot, and digest log.

### REQ-ACT-004: Search and notification behavior

The system shall allow searching the feed and pushing priority notifications for high-value events.

**Acceptance criteria:**

- [ ] Feed search supports actor, entity, and date filters
- [ ] Priority events trigger visible alerts where enabled
- [ ] Search results preserve the underlying scope rules

**Evidence:** search response log and priority alert record.

## Traceability

- Maps to `REQ-LEAD-006`, `REQ-MNT-001`, and `REQ-WA-007`
- Aligns to `WC-SRS-009` and activity evidence artifacts
- Feeds dashboards, notifications, and digest validation

## 2. Activity Event Types and Display Templates

Event templates should include actor, action verb, entity display name, and relative time, with safe fallbacks for missing context.

## 3. Activity Card Component Spec

Cards should include avatar, sentence, deep link, and hover timestamp, with keyboard focus support and responsive truncation.

## 4. Feed Segmentation

- Personal feed vs team feed vs company-wide feed.
- Role-based visibility controls.

## 5. Pagination and Performance

- Infinite scroll with 20-item pages.
- Query optimization for recent-first retrieval.

## 6. API Contract

- `GET /api/activities`
- `GET /api/activities?scope=my|team|company`
- `POST /api/activities/digest/send`

## 7. Notification and Digest

- Daily digest emails.
- Priority event push notifications.

## 8. Acceptance Criteria and Tests

- Event templates render correct contextual text.
- Filters and scopes return expected activity sets.
- Feed performance remains stable under high event volume.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
