# Olivia — Marketing & Automation Manager

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Marketing  
> **ID:** `olivia`  
> **Color:** #EC4899  
> **Avatar:** 👩‍🎨
> **Status:** Active — requirement catalog expanded.

---

## Overview
Manages marketing campaigns, social media, property listings, market intelligence, and brand communications.

## Requirement catalog

### REQ-OLIVIA-001: Campaign lifecycle management

The system shall manage campaign setup, scheduling, execution, and closeout.

**Acceptance criteria:**

- [ ] Campaigns include objective, audience, channel, and owner
- [ ] Campaign states are auditable from draft to completion
- [ ] Schedule and send outcomes are logged

**Evidence:** campaign lifecycle log and execution report.

### REQ-OLIVIA-002: Social and listing optimization orchestration

The system shall coordinate social promotion and listing optimization workflows.

**Acceptance criteria:**

- [ ] Listing promotions map to channel-specific requirements
- [ ] Content variants and performance are trackable
- [ ] Optimization actions are tied to measurable outcomes

**Evidence:** listing optimization report and channel performance snapshot.

### REQ-OLIVIA-003: Marketing analytics and intelligence feedback

The system shall expose campaign analytics and feed insights back to planning workflows.

**Acceptance criteria:**

- [ ] Analytics include reach, engagement, conversion, and spend efficiency
- [ ] Attribution supports source/channel comparisons
- [ ] Insight exports are consumable by leadership dashboards

**Evidence:** analytics export and attribution report.

### REQ-OLIVIA-004: Content automation and governance

The system shall automate approved content operations with governance controls.

**Acceptance criteria:**

- [ ] Content templates are versioned and approval-gated
- [ ] Automated runs honor consent/suppression policies
- [ ] Exceptions and failures are alertable

**Evidence:** content automation log and governance audit snapshot.

## Traceability

- Maps to `REQ-MKT-001` through `REQ-MKT-005` and `REQ-MKT-AUT-001`
- Aligns to `WC-SRS-008` and campaign governance artifacts
- Feeds marketing execution, attribution, and compliance validation

## Capabilities
- Campaign management
- Social media
- Listing optimization
- Analytics
- Market intelligence
- Content automation

## API Endpoints
- `/api/marketing`
- `/api/campaigns`
- `/api/social`

## Data Flows
- **Receives from:** Mary
- **Sends to:** Zoe

## Access Control
- **Viewable by:** Owner, Admin, Marketing Manager
- **Accessible by:** Owner, Admin, Marketing Manager
- **Data access level:** Departmental
