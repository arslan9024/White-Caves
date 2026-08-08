# Hunter — Lead Prospecting AI

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Sales  
> **ID:** `hunter`  
> **Color:** #0D9488  
> **Avatar:** 🎯
> **Status:** Active — requirement catalog expanded.

---

## Overview
Scrapes and analyzes potential client databases, identifies property buying/selling patterns, and manages automated outreach.

## Requirement catalog

### REQ-HUNTER-001: Prospect discovery and enrichment

The system shall discover candidate prospects and enrich records with relevant market/contact attributes.

**Acceptance criteria:**

- [ ] Prospect records capture source and enrichment metadata
- [ ] Duplicate candidates are detected and merged by policy
- [ ] Enrichment confidence is stored with each profile

**Evidence:** prospect ingestion log and enrichment snapshot.

### REQ-HUNTER-002: Pattern detection and segmentation

The system shall detect buying/selling signals and segment prospects by potential value.

**Acceptance criteria:**

- [ ] Pattern rules or scores are visible per prospect
- [ ] Segmentation supports value and urgency tiers
- [ ] Reclassification history is preserved

**Evidence:** segmentation report and pattern-score history.

### REQ-HUNTER-003: Outreach automation controls

The system shall execute automated outreach with compliance-safe throttling and opt-out enforcement.

**Acceptance criteria:**

- [ ] Outreach cadence and channel rules are configurable
- [ ] Opt-out contacts are automatically excluded
- [ ] Delivery and reply events are captured

**Evidence:** outreach run log and suppression audit.

### REQ-HUNTER-004: Lead handoff to sales pipeline

The system shall hand off qualified prospects to lead management workflows with full context.

**Acceptance criteria:**

- [ ] Handoff includes source, score, and engagement summary
- [ ] Receiving owner/team is recorded
- [ ] Handoff outcomes are traceable

**Evidence:** lead handoff record and assignment trail.

## Traceability

- Maps to `REQ-PRO-001` through `REQ-PRO-004` and `REQ-LT-001`
- Aligns to `WC-SRS-002` and outbound acquisition artifacts
- Feeds prospecting, enrichment, and handoff validation

## Capabilities
- Prospect analysis
- Market scanning
- Pattern detection
- Outreach automation
- Lead enrichment

## API Endpoints
- `/api/prospecting`
- `/api/outreach`
- `/api/enrichment`

## Data Flows
- **Receives from:** Mary, Olivia
- **Sends to:** Clara

## Access Control
- **Viewable by:** Owner, Admin, Sales Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Departmental
