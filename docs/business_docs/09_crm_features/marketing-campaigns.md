# Marketing Campaigns — CRM Feature Specification

> **Status:** Active -- requirement catalog expanded.  
> **Module Owner:** Olivia (Marketing Manager AI)  
> **API Endpoints:** `/api/campaigns` (planned), WhatsApp broadcast via Nadia  
> **Priority:** Medium  
> **Last Updated:** 2026-08-07  
> **Next Review:** 2026-08-21  
> **Source of Truth:** CRM marketing campaigns feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/integration-requirements.md`](../05_requirements/integration-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend communication/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## Overview

The Marketing Campaigns module allows the marketing team to plan, execute, and analyse multi-channel campaigns. The primary channel is WhatsApp broadcast (via Nadia), complemented by email newsletters and portal listing promotion.

## Requirement catalog

### REQ-MKT-001: Campaign creation and ownership

The system shall allow marketing users to create a campaign with a name, goal, channel, owner, schedule, and status.

**Acceptance criteria:**

- [ ] Campaign creation requires name, channel, owner, and objective
- [ ] Campaign status is tracked as Draft, Scheduled, Live, Paused, or Completed
- [ ] Campaign ownership is visible in the detail header and reporting views

**Evidence:** campaign record, audit log, and dashboard snapshot.

### REQ-MKT-002: Audience segmentation and opt-out enforcement

The system shall build campaign audiences from lead status, area, budget, source, language, and last-activity filters while excluding opted-out recipients.

**Acceptance criteria:**

- [ ] Audience builder supports at least 6 filter dimensions
- [ ] Opt-out recipients are excluded automatically
- [ ] Estimated audience size is shown before send

**Evidence:** audience preview export and recipient inclusion/exclusion log.

### REQ-MKT-003: Template and compliance validation

The system shall block campaign sends unless the selected WhatsApp template is approved and compliant with the active channel rules.

**Acceptance criteria:**

- [ ] Unapproved templates cannot be sent
- [ ] Each template references its approval state and version
- [ ] Compliance warnings appear before scheduling

**Evidence:** template approval record and pre-send validation log.

### REQ-MKT-004: Campaign delivery analytics

The system shall track send, delivery, open/read, reply, and conversion metrics for each campaign.

**Acceptance criteria:**

- [ ] Delivery funnel is visible per campaign
- [ ] Conversion to viewing or inquiry is attributable to the campaign
- [ ] Metrics can be exported for executive reporting

**Evidence:** campaign analytics export and KPI dashboard snapshot.

### REQ-MKT-005: Budget and spend governance

The system shall support budget caps and overspend warnings for marketing campaigns.

**Acceptance criteria:**

- [ ] Campaign budget can be recorded before send
- [ ] Overspend warning appears when spend exceeds threshold
- [ ] Budget tracking is visible in campaign detail and reporting views

**Evidence:** spend ledger, warning event, and campaign report export.

---

## User Stories

- As a **marketing manager**, I want to create a WhatsApp broadcast campaign with an audience filter, so that I send relevant messages to interested leads.
- As a **marketing manager**, I want to see campaign performance (sent, delivered, read, replied), so that I measure ROI.
- As a **marketing manager**, I want to see which lead source generates the highest conversion rate, so that I optimise spend.
- As a **manager**, I want to see a monthly marketing report showing campaigns, leads generated, and cost per lead.

---

## Campaign Types

| Type                  | Channel                | Audience                | Template Required   |
| --------------------- | ---------------------- | ----------------------- | ------------------- |
| Property Announcement | WhatsApp               | Filtered leads          | Yes (Meta-approved) |
| Market Update         | WhatsApp + Email       | All active leads        | Yes                 |
| Follow-up Campaign    | WhatsApp               | Dormant leads           | Yes                 |
| Open Day Invitation   | WhatsApp               | Qualified leads         | Yes                 |
| Email Newsletter      | Email                  | All subscribed leads    | No                  |
| Portal Boost          | PropertyFinder / Bayut | N/A (listing promotion) | N/A                 |

---

## Campaign Workflow

```text
1. Create Campaign
   ├── Campaign name, type, channel
   ├── Audience builder (filters: status, score, area, type, last activity)
   ├── Estimated audience size preview
   └── Budget allocation (optional)

2. Content
   ├── Select approved WhatsApp template
   ├── Insert personalisation variables
   └── Preview message with sample data

3. Schedule
   ├── Send now
   └── Schedule for future (date + time)

4. Pre-Send Validation
   ├── All recipients have valid phone numbers
   ├── Template is Meta-approved
   ├── Recipients not on opt-out list
   └── Daily limit check

5. Execution
   ├── Batch processing (50 msg/sec max)
   └── Per-recipient personalisation

6. Tracking
   ├── Delivery: Sent → Delivered → Read (per recipient)
   ├── Reply rate (replied within 48h)
   └── Lead conversion (viewed → became qualified/offer)

7. Post-Campaign Actions
   ├── Recipients who replied → Route to agent inbox
   ├── Undelivered → Flag for data cleanup
   └── Campaign report generated
```

---

## Lead Source Attribution

The system tracks lead source throughout the lifecycle:

- Source captured at lead creation: WhatsApp, Website, PropertyFinder, Bayut, Referral, Cold Call
- Campaign ID stamped on leads generated from a campaign broadcast
- Attribution report shows: leads per source, conversion rate per source, commission value per source

---

## API Endpoints

| Method | Path                           | Access                    | Description                     |
| ------ | ------------------------------ | ------------------------- | ------------------------------- |
| GET    | `/api/campaigns`               | Marketing, Manager, Owner | List campaigns                  |
| POST   | `/api/campaigns`               | Marketing                 | Create campaign                 |
| GET    | `/api/campaigns/:id`           | Marketing, Manager        | Campaign detail + analytics     |
| PATCH  | `/api/campaigns/:id/send`      | Marketing                 | Execute / schedule send         |
| PATCH  | `/api/campaigns/:id/pause`     | Marketing                 | Pause active campaign           |
| GET    | `/api/campaigns/:id/analytics` | Marketing, Manager        | Delivery + conversion analytics |
| GET    | `/api/leads/attribution`       | Marketing, Manager        | Lead source attribution report  |

---

## Acceptance Criteria

- [ ] Audience builder shows estimated audience size before sending
- [ ] Opt-out contacts automatically excluded
- [ ] Campaign delivery tracked per recipient (sent / delivered / read)
- [ ] Reply auto-routes to agent inbox
- [ ] Attribution correctly links leads to campaign source
- [ ] Campaign cannot use unapproved WhatsApp templates
- [ ] Marketing report exportable with campaign performance summary

## Traceability

- Business owner: Marketing Manager
- SRS counterpart: `WC-SRS-008`
- Related upstream requirements: `COMP-RERA-001`, `COMP-RERA-004`, `COMP-PDPL-001`
- Validation surfaces: campaign report export, audit trail, and dashboard analytics

---

## A/B Testing Framework

- Headline vs description variants.
- Audience split rules and confidence thresholds.
- Auto-promote winning variant option.

## Budget and Spend Controls

- Daily/monthly caps by channel.
- Planned vs actual spend tracking.
- Overspend alerts for managers.

## Compliance and Consent Controls

- Enforce opt-in for promotional outreach.
- Consent proof stored with timestamp/source.
- Audit logs for campaign execution.

## KPI Dashboard and Reporting Cadence

- Delivery, open, reply, and conversion funnels.
- Weekly and monthly executive reports.
- Campaign ROI attribution.

## Test Plan

- Audience filter correctness tests.
- Template approval gating tests.
- Attribution and reporting consistency tests.

---

**Version:** 1.0 | **Last Updated:** March 2026
