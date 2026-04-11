# Marketing Campaigns — CRM Feature Specification

> **Status:** Planned  
> **Module Owner:** Olivia (Marketing Manager AI)  
> **API Endpoints:** `/api/campaigns` (planned), WhatsApp broadcast via Nadia  
> **Priority:** Medium

---

## Overview

The Marketing Campaigns module allows the marketing team to plan, execute, and analyse multi-channel campaigns. The primary channel is WhatsApp broadcast (via Nadia), complemented by email newsletters and portal listing promotion.

---

## User Stories

- As a **marketing manager**, I want to create a WhatsApp broadcast campaign with an audience filter, so that I send relevant messages to interested leads.
- As a **marketing manager**, I want to see campaign performance (sent, delivered, read, replied), so that I measure ROI.
- As a **marketing manager**, I want to see which lead source generates the highest conversion rate, so that I optimise spend.
- As a **manager**, I want to see a monthly marketing report showing campaigns, leads generated, and cost per lead.

---

## Campaign Types

| Type | Channel | Audience | Template Required |
|------|---------|----------|-------------------|
| Property Announcement | WhatsApp | Filtered leads | Yes (Meta-approved) |
| Market Update | WhatsApp + Email | All active leads | Yes |
| Follow-up Campaign | WhatsApp | Dormant leads | Yes |
| Open Day Invitation | WhatsApp | Qualified leads | Yes |
| Email Newsletter | Email | All subscribed leads | No |
| Portal Boost | PropertyFinder / Bayut | N/A (listing promotion) | N/A |

---

## Campaign Workflow

```
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

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/campaigns` | Marketing, Manager, Owner | List campaigns |
| POST | `/api/campaigns` | Marketing | Create campaign |
| GET | `/api/campaigns/:id` | Marketing, Manager | Campaign detail + analytics |
| PATCH | `/api/campaigns/:id/send` | Marketing | Execute / schedule send |
| PATCH | `/api/campaigns/:id/pause` | Marketing | Pause active campaign |
| GET | `/api/campaigns/:id/analytics` | Marketing, Manager | Delivery + conversion analytics |
| GET | `/api/leads/attribution` | Marketing, Manager | Lead source attribution report |

---

## Acceptance Criteria

- [ ] Audience builder shows estimated audience size before sending
- [ ] Opt-out contacts automatically excluded
- [ ] Campaign delivery tracked per recipient (sent / delivered / read)
- [ ] Reply auto-routes to agent inbox
- [ ] Attribution correctly links leads to campaign source
- [ ] Campaign cannot use unapproved WhatsApp templates
- [ ] Marketing report exportable with campaign performance summary

---

**Version:** 1.0 | **Last Updated:** March 2026
