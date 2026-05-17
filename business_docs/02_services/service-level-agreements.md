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

## 10. SLA Breach Consequences & Financial Penalties

### Breach Definition

An SLA breach occurs when White Caves fails to meet a committed SLA metric within the measurement period, after excluding agreed exempt events (scheduled maintenance, third-party outages, force majeure).

### Financial Penalty Schedule by Contract Tier

#### Professional Tier — SLA Breach Penalties

| Breach Scenario | Threshold | Penalty (% of Monthly Fee) | Maximum Penalty/Month |
|-----------------|-----------|---------------------------|----------------------|
| Uptime below 99.9% for the month | < 99.9% uptime | 10% credit | 100% of monthly fee |
| Uptime below 99.0% | < 99.0% uptime | 25% credit | 100% of monthly fee |
| Uptime below 95.0% | < 95.0% uptime | 50% credit | 100% of monthly fee |
| Uptime below 90.0% | < 90.0% uptime | 100% credit | 100% of monthly fee |
| S1 response time breach (> 1 hour) | Per incident | AED 500 credit/incident | AED 5,000/month |
| S1 resolution time breach (> 8 hours) | Per incident | AED 1,000 credit/incident | AED 10,000/month |
| Data backup RPO breach | > 6 hours actual RPO | AED 2,500 credit | One-time per incident |
| Security patch critical (> 72 hours) | Per CVE | AED 2,500 credit | AED 10,000/month |
| API rate limit false rejection | > 5 incidents/day | AED 250 credit/day | AED 2,500/month |

#### Enterprise Tier — SLA Breach Penalties

| Breach Scenario | Threshold | Penalty | Maximum Penalty/Month |
|-----------------|-----------|---------|----------------------|
| Uptime below 99.95% | < 99.95% uptime | Negotiated; minimum 15% credit | Per contract |
| S1 response breach (> 15 minutes) | Per incident | AED 2,000 credit/incident | AED 20,000/month |
| S1 resolution breach (> 4 hours) | Per incident | AED 5,000 credit/incident | AED 50,000/month |
| Data loss event (any records lost) | Any confirmed data loss | AED 50,000 + root cause analysis | Per incident |
| Security breach resulting in data exposure | Any confirmed exposure | AED 100,000 + forensic audit | Per incident |
| API response p95 > 500ms sustained (> 30 min) | Per episode | AED 1,000 credit | AED 5,000/month |
| WhatsApp API downtime > 1 hour | Per hour beyond 1h | AED 500/hour credit | AED 10,000/month |

### Contractual Penalty Conditions

| Condition | Rule |
|-----------|------|
| **Credit-only policy** | Penalties are applied as service credits against future invoices, not cash refunds, unless otherwise agreed in writing |
| **Request window** | Customer must submit penalty claim within **30 calendar days** of the breach occurrence |
| **Dispute process** | White Caves validates against monitoring data within **5 business days**; disputed findings escalated to L4 management within **10 business days** |
| **Maximum annual liability** | Total annual credits capped at 3× monthly contract value for Professional; negotiated cap for Enterprise |
| **Exclusions** | UAE public holidays (see Section 11), client-caused issues, force majeure events, Meta/WhatsApp API outages, DLD/Ejari system downtime |
| **Contractual basis** | All SLA commitments governed by UAE law; disputes subject to Dubai Courts jurisdiction or DIAC arbitration per contract terms |

---

## 11. UAE Public Holiday Impact on SLAs

### UAE Public Holidays 2026

> Source: UAE Government Portal (government.ae). Islamic calendar holidays subject to moon sighting confirmation — dates may shift by ±1 day.

| Holiday | Date (2026) | Type | Duration |
|---------|------------|------|---------|
| New Year's Day | January 1 | Fixed | 1 day |
| Eid Al Fitr (end of Ramadan) | ~March 29–31 | Islamic | 3 days (approx.) |
| Eid Al Fitr Holiday Extension | ~April 1 | Islamic | 1 day |
| Arafat Day (Eid Al Adha Eve) | ~June 5 | Islamic | 1 day |
| Eid Al Adha | ~June 6–8 | Islamic | 3 days |
| Islamic New Year (Hijri New Year) | ~June 26 | Islamic | 1 day |
| Prophet's Birthday (Mawlid) | ~September 4 | Islamic | 1 day |
| UAE National Day | December 2–3 | Fixed | 2 days |
| **Total statutory days** | | | **~13 days** |

### Impact on SLA Measurements

| SLA Category | Holiday Treatment | Rationale |
|-------------|-------------------|-----------|
| **Platform Uptime** | SLA measured 24/7/365 including holidays. Uptime % is not adjusted for holidays — system must remain available. | Infrastructure availability is independent of working calendar |
| **Support Response Times (Basic, Professional)** | Support hours exclude UAE public holidays. Holiday days do not count against response-time SLA for non-Critical issues. | Basic/Professional support runs Sun–Thu business hours |
| **Support Response Times (Enterprise — Critical/S1)** | S1 response SLA applies 24/7/365 including public holidays. Enterprise customers are guaranteed 15-minute response always. | Enterprise is a 24/7 commitment |
| **Support Response Times (Enterprise — S2/S3/S4)** | Business-day SLA excludes UAE public holidays. Clock pauses on holiday start, resumes next business day. | Standard enterprise support is business-hours based for non-critical |
| **Scheduled Maintenance Windows** | Maintenance windows may be scheduled during public holidays to minimise business impact. Advance notice still required (72 hours). | Holidays are preferred maintenance windows |
| **SLA Credit Claims** | Holiday days are excluded when calculating the 30-day credit request window for Basic/Professional. Enterprise: calendar days apply. | Aligns with business-day support hours |
| **Integration SLAs (DLD/Ejari)** | DLD and government portal integrations may be unavailable on UAE public holidays and weekends. Downtime during government closures is excluded from integration SLA. | Government systems follow UAE public calendar |
| **Ejari & DLD Submission Deadlines** | The 30-day Ejari registration window and DLD transfer appointments exclude public holidays (government offices closed). | Statutory deadlines per RERA/DLD follow working day calendar |

### Ramadan Operating Notes

| Aspect | Policy |
|--------|--------|
| **Support Hours (Ramadan)** | Business hours adjusted to 9am–3pm GST for non-critical support during Ramadan (approximately March 1–29, 2026) |
| **WhatsApp Campaign Restrictions** | RERA/Meta guidelines recommend reduced marketing intensity during Ramadan. Broadcast campaigns reduced to ≤ 50% of normal volume during daylight hours |
| **System Maintenance** | Preferred window during Ramadan: 1am–5am GST (outside Suhoor period) |

---

## 12. SLA Measurement Methodology

### How Uptime SLA Percentage Is Calculated

```
Uptime % = ((Total Minutes in Month - Downtime Minutes) / Total Minutes in Month) × 100

Where:
  Total Minutes in Month = calendar days × 24 hours × 60 minutes
  Example (March 2026 = 31 days): 31 × 24 × 60 = 44,640 minutes

  Downtime Minutes = Sum of all minutes where platform returns:
    - HTTP 5xx errors on health check endpoint (/api/health)
    - Connection timeout (> 30 seconds no response)
    - WebSocket server unavailable

  Excluded from Downtime Minutes:
    - Scheduled maintenance (announced 72h+ in advance)
    - Third-party outages (Meta WhatsApp, MongoDB Atlas, Vercel CDN)
    - Client network/ISP issues (verified by check from multiple regions)
    - DDoS attack periods (force majeure)
```

### Monitoring Infrastructure

| Component | Tool | Check Frequency | Regions |
|-----------|------|----------------|---------|
| Platform health check | External synthetic monitoring | Every 60 seconds | UAE (Dubai), EU (Frankfurt), APAC (Singapore) |
| API endpoint availability | Uptime Robot + Custom health probe | Every 60 seconds | 3 regions |
| Database connectivity | Internal probe on `/api/health/db` | Every 30 seconds | Internal |
| WhatsApp API health | Meta webhook delivery tracking | Real-time | Meta infrastructure |
| Frontend availability | Vercel analytics + synthetic | Every 60 seconds | Global CDN |

### How Support Response Time SLA Is Measured

```
Response Time = Timestamp of first meaningful agent reply - Timestamp of ticket creation

"Meaningful reply" = Human response that:
  - Acknowledges the issue with a ticket reference number, AND
  - Indicates initial triage has begun (not a generic auto-acknowledgment)

Auto-acknowledgment emails (system-generated) do NOT count as SLA response.
```

### How API p95 Response Time Is Measured

```
p95 Response Time = The 95th percentile value of all API response times
                    measured in the trailing 5-minute rolling window.

Measured at: API gateway layer (before authentication middleware)
Excludes: File upload endpoints (/api/upload/*), Report generation (/api/reports/*)
Tool: APM (Application Performance Monitoring) — e.g., Datadog, New Relic, or custom middleware
Alert threshold: p95 > 350ms triggers performance alert; p95 > 500ms triggers S2 incident
```

### How Backup RPO Is Verified

```
RPO Test (automated, weekly):
  1. Identify timestamp of most recent data mutation in production DB
  2. Measure elapsed time since last successful incremental backup
  3. RPO = (current time) - (timestamp of most recent backup)
  4. Pass if RPO ≤ committed value; fail if exceeded

Verification logged to: /admin/system/backup-status
Frequency: Automated weekly test on Saturday 04:00 GST
```

---

## 13. SLA Reporting Cadence

### Standard Reporting Schedule

| Report | Frequency | Delivery Method | Recipients | Contents |
|--------|-----------|----------------|------------|---------|
| **Real-Time Status Page** | Live (continuous) | status.whitecaves.ae | All customers | Current uptime, active incidents, resolved incidents (30-day history) |
| **Daily Uptime Summary** | Daily (08:00 GST) | Email + in-app | Enterprise customers | Prior day uptime %, API p95, incident summary |
| **Weekly SLA Report** | Weekly (Monday 09:00 GST) | Email | Professional + Enterprise | 7-day uptime, incident count by severity, response/resolution times, top 5 slow endpoints |
| **Monthly SLA Statement** | Monthly (1st of month, 09:00 GST) | Email + PDF download | All tiers | Full uptime % vs committed, incident log, credit entitlement, next month forecast |
| **Quarterly Business Review (QBR)** | Quarterly | Video call + report | Enterprise | SLA trend (3-month), usage analytics, roadmap preview, credit reconciliation |
| **Annual SLA Audit Report** | Annual (January) | PDF + email | Enterprise | Full-year SLA performance, trend analysis, improvement plan, updated SLA terms if any |

### Incident Communication Schedule

| Severity | Communication Timeline | Channel | Template |
|----------|----------------------|---------|---------|
| **S1 — Critical** | T+15 min: Initial alert | Status page + email + WhatsApp | "We are investigating an issue affecting [system]. Impact: [description]. Next update in 30 minutes." |
| | T+30 min, T+60 min, T+90 min... | Status page + email + WhatsApp | Progress update with timeline estimate |
| | T+Resolution: All-clear | Status page + email + WhatsApp | "Issue resolved. Duration: [X min]. Root cause summary. Full RCA in 48h." |
| **S2 — High** | T+2 hours: Initial | Email + in-app notification | "Degraded service on [feature]. Workaround: [if available]. Tracking ID: [ID]." |
| | T+4 hours, T+8 hours | Email | Progress update |
| | Resolution | Email | All-clear + summary |
| **S3 — Medium** | Resolution | Email | "Issue resolved: [description]. No further action needed." |
| **S4 — Low** | Next release notes | In-app release notes | Included in release changelog |

### Post-Incident Review (PIR) Process

| Step | Timeline | Owner | Output |
|------|----------|-------|--------|
| Incident timeline documented | Within 4 hours of resolution | On-call engineer | Incident timeline in incident tracker |
| Preliminary root cause identified | Within 24 hours | Senior engineer | Email to affected Enterprise customers |
| Full Root Cause Analysis (RCA) | Within 48 hours (S1) / 5 days (S2) | Engineering Manager | RCA document: what happened, why, what we're fixing |
| Corrective actions assigned | Within 48 hours | CTO / Lead Developer | Action items with owners and deadlines in backlog |
| Customer RCA delivered | Within 48 hours of completion | Account Manager | PDF RCA sent to Enterprise customers; summary sent to Professional |
| Corrective actions verified closed | Within 30 days | Engineering Manager | Follow-up report to Enterprise customers |

---

## 14. Escalation Matrix — Named Contacts

> Contact details are internal and not published externally. For customer-facing escalation, customers should use the standard support channels.

### Internal Escalation Contacts

| Level | Role | Escalation Trigger | Internal Contact | Response Commitment |
|-------|------|--------------------|-----------------|-------------------|
| **L1 — First Response** | Support Agent | Any new ticket | Support queue (support@whitecaves.ae) | Per severity SLA |
| **L2 — Engineering** | On-Call Engineer | L1 cannot resolve within SLA; any S1 | On-call rotation (PagerDuty alert) | 30-minute response |
| **L3 — Senior Engineering** | Lead Developer / Senior Engineer | Complex issue; architecture impact; 2+ hours on S1 | Lead Developer (direct message) | 1-hour response |
| **L4 — Management** | Engineering Manager + CTO | SLA breach confirmed; customer escalation; any S1 > 2h | Engineering Manager + CTO (Aurora AI oversight) | 30-minute response |
| **L5 — Executive** | Managing Director | Data loss; security breach; regulatory notification trigger; public-facing outage > 4h | Managing Director | 1-hour response |

### Customer-Facing Escalation Path

| Step | Action | Contact |
|------|--------|---------|
| 1 | Submit ticket with full description and severity | support@whitecaves.ae or in-app chat |
| 2 | Reference ticket number in follow-up | Ticket ID provided in auto-acknowledgment |
| 3 | If no meaningful response within SLA | Reply to ticket requesting L2 escalation; or WhatsApp Enterprise Slack (Enterprise only) |
| 4 | If still unresolved | Email account manager (Enterprise: named contact) |
| 5 | If SLA breach confirmed | Submit credit claim via support ticket citing SLA clause |
| 6 | Formal dispute | Send written notice to legal@whitecaves.ae; resolved under Dubai Courts or DIAC arbitration per contract |

### Escalation Contact by Issue Type

| Issue Type | Primary Contact | Secondary Contact | Regulatory Contact (if applicable) |
|------------|----------------|-------------------|-----------------------------------|
| Platform availability (S1/S2) | support@whitecaves.ae | On-call engineer (via ticket escalation) | — |
| Data breach / security incident | security@whitecaves.ae | Managing Director | UAE TDRA (within 72h): tdra.gov.ae |
| AML / KYC compliance failure | compliance@whitecaves.ae | Managing Director | UAE FIU via goAML |
| RERA compliance question | compliance@whitecaves.ae | Legal Specialist | RERA portal: rera.gov.ae |
| DLD transaction error | legal@whitecaves.ae | Managing Director | DLD eServices portal |
| VAT / invoice dispute | finance@whitecaves.ae | Finance Director | UAE FTA: tax.gov.ae |
| Commission dispute | finance@whitecaves.ae | Sales Manager → Managing Director | — |
| API integration failure (Tier 1) | support@whitecaves.ae | IT Lead Developer | Partner-specific support |
| WhatsApp/Meta API issue | support@whitecaves.ae | IT Lead Developer | Meta Business Support: business.facebook.com |

---

*SLAs are reviewed and updated annually. Current terms effective from April 1, 2026.*
*For platform architecture details, see [../14_devops/README.md](../14_devops/README.md).*
*For incident response procedures, see [../14_devops/incident-response.md](../14_devops/incident-response.md).*
