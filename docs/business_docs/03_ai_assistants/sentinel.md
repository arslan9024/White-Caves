# Sentinel — Property Monitoring AI

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Operations  
> **ID:** `sentinel`  
> **Color:** #7C3AED  
> **Avatar:** 🛡️
> **Status:** Active — requirement catalog expanded.

---

## Overview
IoT integration for property condition monitoring, predictive maintenance scheduling, and emergency response coordination.

## Requirement catalog

### REQ-SENTINEL-001: Property telemetry monitoring

The system shall ingest and monitor property telemetry for condition and alerting signals.

**Acceptance criteria:**

- [ ] Telemetry records include source, timestamp, and monitored metric
- [ ] Abnormal readings trigger alert workflows
- [ ] Monitoring gaps are surfaced for operational follow-up

**Evidence:** telemetry monitor log and anomaly alert report.

### REQ-SENTINEL-002: Predictive maintenance scheduling

The system shall predict maintenance needs and generate proactive service schedules.

**Acceptance criteria:**

- [ ] Prediction rules identify high-risk assets
- [ ] Scheduled actions include owner, due date, and priority
- [ ] Completed actions feed back into model inputs

**Evidence:** predictive schedule output and completion audit.

### REQ-SENTINEL-003: Inspection and vendor workflow

The system shall coordinate inspections, vendor assignment, and outcome tracking.

**Acceptance criteria:**

- [ ] Inspection requests track status and assigned vendor
- [ ] Vendor performance signals are retained
- [ ] Escalations are triggered for missed SLAs

**Evidence:** inspection queue and vendor performance report.

### REQ-SENTINEL-004: Emergency response coordination

The system shall support emergency incident routing and response tracking.

**Acceptance criteria:**

- [ ] Emergency incidents include severity and response timeline
- [ ] Responsible responders are notified by policy
- [ ] Resolution and post-incident notes are mandatory

**Evidence:** incident response log and closure report.

## Traceability

- Maps to `REQ-MNT-001` through `REQ-MNT-004`
- Aligns to `WC-SRS-016` and maintenance-intelligence artifacts
- Feeds monitoring, vendor, and incident-response validation

## Capabilities
- IoT monitoring
- Predictive maintenance
- Inspection scheduling
- Vendor management
- Emergency response

## API Endpoints
- `/api/monitoring`
- `/api/maintenance`
- `/api/inspections`

## Data Flows
- **Receives from:** Mary
- **Sends to:** Mary, Daisy

## Access Control
- **Viewable by:** Owner, Admin, Operations Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Departmental
