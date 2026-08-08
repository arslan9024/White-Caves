# Daisy — Leasing & Tenant Manager

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Operations  
> **ID:** `daisy`  
> **Color:** #14B8A6  
> **Avatar:** 👩‍🔧
> **Status:** Active — requirement catalog expanded.

---

## Overview
Manages rental properties, tenant communications, lease agreements, and maintenance requests.

## Requirement catalog

### REQ-DAISY-001: Lease lifecycle management

The system shall manage lease records from draft to renewal/closure with auditable transitions.

**Acceptance criteria:**

- [ ] Lease states and transition history are retained
- [ ] Renewal and expiry milestones are visible in advance
- [ ] Invalid lease transition actions are blocked

**Evidence:** lease timeline and transition audit log.

### REQ-DAISY-002: Tenant communication orchestration

The system shall track tenant-facing communications and link them to lease and unit context.

**Acceptance criteria:**

- [ ] Messages are linked to tenant and lease records
- [ ] Communication history is searchable by tenant and date
- [ ] Escalation flags are visible for unresolved issues

**Evidence:** tenant communication thread and escalation record.

### REQ-DAISY-003: Maintenance request coordination

The system shall manage maintenance requests, assignments, and resolution updates.

**Acceptance criteria:**

- [ ] Requests track status, assignee, and resolution timestamps
- [ ] Priority/SLA class is visible per ticket
- [ ] Closure includes resolution notes and audit history

**Evidence:** maintenance ticket log and SLA status report.

### REQ-DAISY-004: Rental analytics and operational insight

The system shall expose rental health metrics for leasing operations.

**Acceptance criteria:**

- [ ] Occupancy and renewal indicators are available
- [ ] Aging and unresolved-request metrics are reportable
- [ ] Data can be filtered by property and time window

**Evidence:** leasing operations dashboard and analytics export.

## Traceability

- Maps to `REQ-TENANT-001` through `REQ-TENANT-006` and `REQ-MNT-001`
- Aligns to `WC-SRS-012` and `WC-SRS-016`
- Feeds leasing execution, tenant support, and maintenance validation

## Capabilities
- Lease management
- Tenant communications
- Maintenance tracking
- Rental analytics

## API Endpoints
- `/api/leasing`
- `/api/tenants`
- `/api/maintenance`

## Data Flows
- **Receives from:** Mary, Sentinel
- **Sends to:** Mary, Theodora

## Access Control
- **Viewable by:** Owner, Admin, Leasing Manager
- **Accessible by:** Owner, Admin, Leasing Manager
- **Data access level:** Departmental
