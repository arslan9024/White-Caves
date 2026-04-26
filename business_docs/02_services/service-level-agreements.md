# Service Level Agreements (SLAs)

Formal SLA definitions for the White Caves Real Estate CRM platform — covering availability, performance, support, and integration guarantees.

> Last Updated: April 2026

---

## Table of Contents

1. [Platform Availability](#1-platform-availability)
2. [Response Time SLAs](#2-response-time-slas)
3. [Support Tiers](#3-support-tiers)
4. [Escalation Procedures](#4-escalation-procedures)
5. [Downtime Compensation](#5-downtime-compensation)
6. [Data Backup Guarantees](#6-data-backup-guarantees)
7. [Security SLAs](#7-security-slas)
8. [WhatsApp Integration SLAs](#8-whatsapp-integration-slas)
9. [Custom Integration Support](#9-custom-integration-support)

---

## 1. Platform Availability

### Uptime Commitment

| Tier | Uptime SLA | Monthly Downtime Budget | Annual Downtime Budget |
|------|-----------|------------------------|----------------------|
| **Basic** | 99.5% | 3h 39m | 43h 48m |
| **Professional** | 99.9% | 43m 28s | 8h 45m |
| **Enterprise** | 99.95% | 21m 44s | 4h 22m |

### Measurement

- **Uptime** is calculated as: `((Total Minutes - Downtime Minutes) / Total Minutes) × 100`
- **Measurement period**: Calendar month (UTC)
- **Monitoring**: External uptime checks every 60 seconds from 3 global regions
- **Excluded from downtime calculation**:
  - Scheduled maintenance windows (announced 72h in advance)
  - Third-party service outages (WhatsApp, payment gateways, portals)
  - Force majeure events
  - Client-side network issues

### Scheduled Maintenance

| Attribute | Policy |
|-----------|--------|
| Window | Tuesdays 02:00–06:00 GST (UTC+4) |
| Frequency | Up to 2 per month |
| Advance notice | 72 hours minimum (email + in-app banner) |
| Emergency maintenance | 4 hours notice where possible |
| Maximum duration | 4 hours per window |
| Expected downtime | Typically < 15 minutes (rolling deployment) |

---

## 2. Response Time SLAs

### API Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p50) | < 100ms | Median response across all endpoints |
| API Response Time (p95) | < 200ms | 95th percentile |
| API Response Time (p99) | < 500ms | 99th percentile |
| Search API (p95) | < 300ms | Property search endpoint |
| File Upload | < 2s for 5MB | Image/document upload |
| Report Generation | < 10s | Standard reports; < 30s for complex |

### Frontend Performance

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| First Input Delay (FID) | < 100ms | Chrome UX Report |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| Full page load (UI) | < 2s | Real User Monitoring |

### Database Performance

| Metric | Target |
|--------|--------|
| Query response (simple) | < 10ms |
| Query response (complex join) | < 100ms |
| Connection pool utilization | < 80% |
| Replication lag | < 1s |

### Real-Time Features

| Feature | Latency Target |
|---------|---------------|
| WebSocket messages | < 200ms |
| Notification delivery | < 5s |
| Dashboard data refresh | < 10s |
| WhatsApp message relay | < 3s |

---

## 3. Support Tiers

### Tier Overview

| Feature | Basic | Professional | Enterprise |
|---------|-------|-------------|-----------|
| **Monthly Price** | AED 1,500 | AED 5,000 | Custom |
| **Support Hours** | Sun–Thu 9am–6pm GST | Sun–Thu 8am–8pm GST | 24/7/365 |
| **Response Time (Critical)** | 4 hours | 1 hour | 15 minutes |
| **Response Time (High)** | 8 hours | 4 hours | 1 hour |
| **Response Time (Medium)** | 24 hours | 8 hours | 4 hours |
| **Response Time (Low)** | 48 hours | 24 hours | 8 hours |
| **Support Channels** | Email, Help Center | Email, Chat, WhatsApp | Email, Chat, WhatsApp, Phone, Dedicated Slack |
| **Dedicated Account Manager** | ❌ | ❌ | ✅ |
| **Onboarding Assistance** | Self-service guides | 2 training sessions | Unlimited, on-site option |
| **Custom Integrations** | ❌ | Limited (API access) | ✅ Full support |
| **SLA Credits** | ❌ | ✅ | ✅ |
| **Uptime SLA** | 99.5% | 99.9% | 99.95% |

### Severity Definitions

| Severity | Definition | Examples |
|----------|-----------|---------|
| **Critical (S1)** | Platform completely unavailable or data loss occurring | Site down, database corruption, authentication failure |
| **High (S2)** | Major feature unusable, no workaround | Search broken, lead import failing, WhatsApp disconnected |
| **Medium (S3)** | Feature degraded but workaround exists | Slow report generation, UI rendering issue on one browser |
| **Low (S4)** | Minor issue, cosmetic, or feature request | Typo in UI, color inconsistency, enhancement suggestion |

### Response vs. Resolution Times

| Severity | Response Time (Enterprise) | Resolution Target |
|----------|--------------------------|-------------------|
| Critical (S1) | 15 minutes | 4 hours |
| High (S2) | 1 hour | 8 hours |
| Medium (S3) | 4 hours | 3 business days |
| Low (S4) | 8 hours | Next release cycle |

---

## 4. Escalation Procedures

### Escalation Matrix

| Level | Trigger | Contact | Response |
|-------|---------|---------|----------|
| **L1 — Support** | Initial ticket | Support team | Triage, known-issue check, basic resolution |
| **L2 — Engineering** | L1 cannot resolve within SLA | On-call engineer | Technical investigation, hotfix if needed |
| **L3 — Senior Engineering** | Complex issue, architecture impact | Senior/Lead engineer | Root cause analysis, code fix |
| **L4 — Management** | SLA breach, customer escalation, SEV-1 | Engineering Manager + CTO | Executive oversight, customer communication |

### Escalation Triggers

| Condition | Action |
|-----------|--------|
| No response within SLA | Auto-escalate to L2 |
| 2 hours without progress on S1 | Escalate to L3 |
| SLA breach | Escalate to L4 + notify account manager |
| Customer requests escalation | Immediate L3 minimum |
| Data security incident | Immediate L4 + security team |

### Communication During Incidents

| Severity | Update Frequency | Channel |
|----------|-----------------|---------|
| Critical (S1) | Every 30 minutes | Status page + email + WhatsApp |
| High (S2) | Every 2 hours | Email + in-app notification |
| Medium (S3) | On resolution | Email |
| Low (S4) | On resolution | Ticket update |

---

## 5. Downtime Compensation

### SLA Credit Schedule

| Monthly Uptime | Service Credit (% of monthly fee) |
|---------------|----------------------------------|
| 99.9% – 99.95% | 0% (within SLA for Professional) |
| 99.0% – 99.9% | 10% |
| 95.0% – 99.0% | 25% |
| 90.0% – 95.0% | 50% |
| < 90.0% | 100% |

### Credit Terms

- Credits are applied to the **next monthly invoice** (not refunded as cash).
- Customer must **request credits** within 30 days of the incident.
- Maximum credit per month: **100% of monthly fee** (not exceeding fees paid).
- Credits do not apply to: scheduled maintenance, client-caused issues, or force majeure.
- Enterprise tier: Custom compensation terms as negotiated in contract.

### Credit Request Process

1. Customer submits credit request via support ticket or account manager
2. White Caves validates downtime against monitoring data (within 5 business days)
3. Approved credits applied to next invoice
4. Disputed claims reviewed by management within 10 business days

---

## 6. Data Backup Guarantees

### Backup Schedule

| Backup Type | Frequency | Retention | Recovery Point Objective (RPO) |
|-------------|-----------|-----------|-------------------------------|
| Continuous replication | Real-time | N/A | < 1 minute |
| Incremental backup | Every 6 hours | 30 days | 6 hours |
| Full backup | Daily (02:00 GST) | 90 days | 24 hours |
| Weekly archive | Sunday 03:00 GST | 1 year | 7 days |
| Monthly archive | 1st of month | 7 years | 30 days |

### Recovery Time Objectives (RTO)

| Scenario | RTO | Procedure |
|----------|-----|-----------|
| Single record recovery | < 1 hour | Restore from continuous replication |
| Table/collection recovery | < 4 hours | Restore from incremental backup |
| Full database recovery | < 8 hours | Restore from full backup |
| Complete disaster recovery | < 24 hours | Full infrastructure rebuild + data restore |

### Data Integrity

| Guarantee | Details |
|-----------|---------|
| Encryption at rest | AES-256 for all backups |
| Encryption in transit | TLS 1.3 for backup transfers |
| Geographic redundancy | Backups stored in 2 separate regions |
| Backup verification | Automated restore test weekly |
| Data retention (deletion) | Customer data purged within 30 days of contract termination |

---

## 7. Security SLAs

### Vulnerability Response

| Severity | Patch Timeline | Notification |
|----------|---------------|-------------|
| **Critical** (CVSS 9.0–10.0) | < 24 hours | Immediate email to all customers |
| **High** (CVSS 7.0–8.9) | < 72 hours | Email within 24 hours |
| **Medium** (CVSS 4.0–6.9) | < 14 days | Next release notes |
| **Low** (CVSS 0.1–3.9) | Next release cycle | Release notes |

### Security Commitments

| Commitment | SLA |
|-----------|-----|
| Penetration testing | Annual (by third-party) |
| Dependency vulnerability scanning | Daily (automated) |
| Security incident response | < 1 hour (investigation start) |
| Data breach notification | < 72 hours (per UAE PDPL) |
| Access log retention | 2 years |
| MFA enforcement | Required for all admin accounts |
| SOC 2 Type II compliance | In progress (target Q4 2026) |
| ISO 27001 certification | Planned (2027) |

### Data Privacy

| Requirement | Implementation |
|------------|---------------|
| UAE PDPL compliance | Full compliance |
| GDPR compliance | For EU data subjects |
| Data residency | UAE-based primary servers |
| Right to deletion | Processed within 30 days |
| Data portability | Export in CSV/JSON within 48 hours |

---

## 8. WhatsApp Integration SLAs

### Message Delivery

| Metric | SLA |
|--------|-----|
| Message send latency | < 3 seconds (platform to WhatsApp) |
| Message delivery rate | > 98% (dependent on recipient availability) |
| Template approval turnaround | < 48 hours (WhatsApp review) |
| Webhook processing | < 1 second |
| Daily message capacity | 100,000+ (Business API tier) |

### WhatsApp-Specific Guarantees

| Feature | SLA |
|---------|-----|
| API connection uptime | 99.9% (mirrors platform SLA) |
| Message history retention | 2 years in CRM |
| Media attachment support | Images, PDFs, location (< 16MB) |
| Template message support | Unlimited approved templates |
| Interactive message support | Buttons, lists, quick replies |
| Multi-agent routing | < 5 seconds to route to available agent |

### WhatsApp Limitations (Outside White Caves Control)

| Limitation | Details |
|-----------|---------|
| WhatsApp API outages | Covered by Meta's SLA, not White Caves |
| Message delivery failures | Recipient phone off, number changed |
| Template rejection | Meta policy compliance required |
| Rate limiting | WhatsApp-imposed limits per business number |
| 24-hour messaging window | Free-form messages only within 24h of last user message |

---

## 9. Custom Integration Support

### Integration Categories

| Category | Examples | Support Level |
|----------|---------|--------------|
| **Tier 1 — Native** | PropertyFinder, Bayut, Dubizzle, WhatsApp | Full SLA, monitored 24/7 |
| **Tier 2 — Supported** | Ejari, DLD, popular accounting (Xero, QuickBooks) | Best-effort, 8h response |
| **Tier 3 — API** | Customer-built integrations via REST API | API documentation + community support |
| **Tier 4 — Custom** | Bespoke integrations (Enterprise only) | Dedicated integration engineer |

### API SLAs

| Metric | SLA |
|--------|-----|
| API availability | Same as platform SLA (99.5–99.95%) |
| Rate limit (Basic) | 100 requests/minute |
| Rate limit (Professional) | 500 requests/minute |
| Rate limit (Enterprise) | 2,000 requests/minute (negotiable) |
| API response time (p95) | < 200ms |
| Breaking changes notice | 90 days minimum |
| API version support | 12 months after deprecation notice |
| Webhook delivery | At-least-once, < 5 second latency |

### Custom Integration Terms (Enterprise)

| Feature | Details |
|---------|---------|
| Dedicated integration engineer | Assigned for implementation phase |
| Custom webhook endpoints | Up to 20 custom webhooks |
| Data sync frequency | Real-time (webhooks) or batch (hourly) |
| Integration testing environment | Dedicated sandbox with test data |
| Documentation | Custom integration guide provided |
| Support | Direct Slack channel with engineering team |
| SLA | Custom, negotiated per integration |
| Maintenance | Included in Enterprise subscription |

### Integration Development Timeline

| Integration Complexity | Estimated Timeline | Cost (Enterprise) |
|-----------------------|-------------------|-------------------|
| Simple (webhook, single endpoint) | 1–2 weeks | Included |
| Medium (bidirectional sync, 5–10 endpoints) | 3–6 weeks | AED 10,000–25,000 |
| Complex (custom middleware, data transformation) | 6–12 weeks | AED 25,000–75,000 |
| Enterprise (full ERP/SAP integration) | 12–24 weeks | AED 75,000–200,000 |

---

## SLA Summary Table

| SLA Category | Basic | Professional | Enterprise |
|-------------|-------|-------------|-----------|
| Uptime | 99.5% | 99.9% | 99.95% |
| API p95 Response | < 200ms | < 200ms | < 200ms |
| UI Load Time | < 2s | < 2s | < 2s |
| Support Response (S1) | 4h | 1h | 15min |
| Support Response (S2) | 8h | 4h | 1h |
| SLA Credits | ❌ | ✅ | ✅ |
| Backup RPO | 6h | 6h | < 1min |
| Backup RTO | 8h | 4h | 1h |
| Security Patch (Critical) | < 24h | < 24h | < 24h |
| WhatsApp Latency | < 3s | < 3s | < 3s |
| API Rate Limit | 100/min | 500/min | 2,000/min |

---

*SLAs are reviewed and updated annually. Current terms effective from April 1, 2026.*

*For platform architecture details, see [../14_devops/README.md](../14_devops/README.md).*
*For incident response procedures, see [../14_devops/incident-response.md](../14_devops/incident-response.md).*
