# Juno — Smart Community & Facilities Manager

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Operations  
> **ID:** `juno`  
> **Color:** #14B8A6  
> **Avatar:** 🏢
> **Status:** Active — requirement catalog expanded.

---

## Overview
Integrates with building IoT systems for energy optimization, manages community events, and automates facility service requests.

## Requirement catalog

### REQ-JUNO-001: IoT telemetry integration

The system shall ingest and normalize building telemetry for facilities operations.

**Acceptance criteria:**

- [ ] Sensor data includes timestamped source metadata
- [ ] Telemetry anomalies are flagged for review
- [ ] Ingestion failures are observable and retryable

**Evidence:** telemetry ingestion log and anomaly report.

### REQ-JUNO-002: Energy and utility optimization insights

The system shall provide energy/utility optimization recommendations based on monitored consumption.

**Acceptance criteria:**

- [ ] Consumption trends are available by building/zone
- [ ] Optimization recommendations include rationale
- [ ] Utility threshold breaches generate alerts

**Evidence:** utility dashboard and optimization insight report.

### REQ-JUNO-003: Community events and facility service workflow

The system shall manage event scheduling and facility service requests with status tracking.

**Acceptance criteria:**

- [ ] Event records track ownership, schedule, and outcomes
- [ ] Service requests include lifecycle status and assignee
- [ ] SLA and completion notes are retained

**Evidence:** event ledger and service ticket audit.

### REQ-JUNO-004: Access and automation governance

The system shall enforce role-based access and automation controls for facilities workflows.

**Acceptance criteria:**

- [ ] Access rights are role-scoped and auditable
- [ ] Automated actions are logged with trigger context
- [ ] Override actions require attribution

**Evidence:** access audit and automation action log.

## Traceability

- Maps to `REQ-COMM-001` through `REQ-COMM-004` and `REQ-MNT-002`
- Aligns to `WC-SRS-016` and facilities-governance artifacts
- Feeds community operations, utility monitoring, and SLA validation

## Capabilities
- IoT integration
- Energy optimization
- Event management
- Service automation
- Access control
- Utility monitoring

## API Endpoints
- `/api/facilities`
- `/api/iot`
- `/api/community`

## Data Flows
- **Receives from:** Sentinel, Mary
- **Sends to:** Nina, Sentinel

## Access Control
- **Viewable by:** Owner, Admin, Operations Manager, Community Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Departmental
