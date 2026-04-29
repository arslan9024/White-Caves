# KPI Dashboard Specification
# White Caves Real Estate Platform

> **Document ID:** WC-KPI-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Analytics Department (Maven — Analytics Lead, Cassie — Decision Scientist)
> **Scope:** KPI definitions for all 12 departments, data sources, targets, reporting frequency

---

## Purpose

This document defines every Key Performance Indicator used across White Caves' 12 departments. Each KPI includes: definition, calculation formula, data source, target, reporting frequency, and responsible owner. This spec is the single source of truth for the executive KPI dashboard and all departmental reports.

---

## 1. Executive / Company KPIs

| KPI | Definition | Formula | Target | Frequency | Source |
|-----|-----------|---------|--------|-----------|--------|
| Monthly Active Users (MAU) | Unique authenticated users per month | COUNT(users with session in month) | 10,000 by Q4 2026 | Monthly | MongoDB Activity |
| Monthly Leads Created | New leads added to CRM | COUNT(leads.createdAt in month) | 200/month by Q4 | Monthly | CRM leads |
| Lead-to-Transaction Rate | % of leads that result in closed deal | WON leads / total leads × 100 | > 10% | Monthly | CRM |
| Revenue (Commissions Received) | Total commission income | SUM(commissions.amount WHERE status='paid') | AED 2M/quarter by Q4 | Monthly | Finance |
| Active Property Listings | Live listings on platform | COUNT(properties WHERE status='PUBLISHED') | 500 by Q3 | Weekly | CRM |
| Avg. Deal Cycle Time | Days from lead creation to WON | AVG(lead.wonAt - lead.createdAt) | < 45 days | Monthly | CRM |
| NPS (Net Promoter Score) | Client satisfaction | (% Promoters − % Detractors) × 100 | > 70 | Quarterly | Survey |
| Platform Uptime | % of time API is available | (total mins - downtime mins) / total × 100 | ≥ 99.9% | Monthly | Monitoring |

---

## 2. Sales Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| New leads (total) | COUNT(leads WHERE month) | 200/month | Weekly |
| Lead response time | AVG(first activity - lead.createdAt) | < 2 hours | Daily |
| Hot lead conversion | WON / hot leads × 100 | > 25% | Monthly |
| Pipeline value | SUM(deal.expectedValue WHERE status IN [QUALIFIED, VIEWING, OFFER]) | AED 50M+ | Weekly |
| Deals closed (WON) | COUNT(leads WHERE status=WON, month) | 10/month by Q4 | Monthly |
| Avg. commission per deal | SUM(commission) / COUNT(deals) | AED 80,000 | Monthly |
| Lead source breakdown | COUNT by source (website/WA/portal/walkin/referral) | — | Monthly |
| Dormant lead rate | % of leads auto-marked dormant | < 15% | Weekly |

---

## 3. Operations Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Active listings | COUNT(properties WHERE status=PUBLISHED) | 500+ | Weekly |
| Listing quality score | AVG(photo count + description length / max) | > 80% | Monthly |
| Ejari registrations | COUNT(leases WHERE ejariNumber NOT NULL, month) | 20/month by Q3 | Monthly |
| Maintenance resolution time | AVG(request.resolvedAt - request.createdAt) | < 5 days | Weekly |
| Open maintenance requests | COUNT(maintenance WHERE status != resolved) | < 20 | Weekly |
| Tenancy renewals | COUNT(leases renewed vs expired) | > 60% renewal rate | Monthly |
| Landlord portal logins | COUNT(sessions WHERE role=landlord, week) | 50+/week by Q3 | Weekly |
| Tenant portal logins | COUNT(sessions WHERE role=tenant, week) | 100+/week by Q3 | Weekly |

---

## 4. Finance Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Total commission earned | SUM(commission.baseAmount, month) | AED 500k+/month by Q4 | Monthly |
| Commission approval rate | Approved / submitted × 100 | > 95% | Monthly |
| Avg. commission approval time | AVG(approvedAt - createdAt) | < 24 hours | Monthly |
| Overdue commissions | COUNT(commissions pending > 30 days) | 0 | Weekly |
| Rent collection rate | Paid payments / due payments × 100 | > 98% | Monthly |
| Revenue by transaction type | SUM by type (sale/rent/mgmt) | — | Monthly |
| Outstanding developer invoices | COUNT(invoices sent but unpaid > 30d) | 0 | Weekly |
| Recurring revenue (mgmt fees) | SUM(property_management.fees, month) | AED 50k/month by Q4 | Monthly |

---

## 5. Marketing Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Monthly website visitors | COUNT(unique sessions, month) | 500 by Q3, 5,000 by Q4 | Monthly |
| Website lead conversion rate | Leads from website / visitors × 100 | > 5% | Monthly |
| Google Search ranking | Position for target keywords | Top 10 for "DAMAC Hills 2 sale" | Monthly |
| Organic traffic growth | MoM change in organic sessions | +20% MoM | Monthly |
| WhatsApp opt-ins | COUNT(WA contacts opted in) | 500 by Q4 | Monthly |
| Email open rate | Opened / sent × 100 | > 35% | Per campaign |
| Social media followers | COUNT(IG + LinkedIn followers) | 5,000 by Q4 | Monthly |
| Cost per lead (paid) | Ad spend / leads from paid | < AED 200 | Per campaign |

---

## 6. Compliance Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| KYC completion rate | % of clients with complete KYC | 100% (for transactions > AED 55k) | Monthly |
| AML screening rate | % of eligible clients screened | 100% | Monthly |
| RERA permit compliance | % of listings with valid permit | 100% | Weekly |
| Open compliance breaches | COUNT(compliance issues unresolved) | 0 | Weekly |
| SAR filings (if applicable) | COUNT(SARs filed) | As needed | Monthly |
| Staff PDPL training completion | % of staff trained | 100% by Phase 5 | Quarterly |
| Data subject requests handled | Handled within 30 days / total | 100% | Monthly |
| RERA license renewals pending | Days until renewal required | Alert at 60 days | Monthly |

---

## 7. Technology Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| API uptime | (minutes UP / total) × 100 | ≥ 99.9% | Daily |
| API response time (p95) | 95th percentile response time | < 300ms | Daily |
| Build success rate | Passing builds / total builds × 100 | 100% | Per commit |
| Test coverage | (passing tests / total test cases) | 7,744+ cases | Per PR |
| Open bugs (critical) | COUNT(critical bugs) | 0 | Daily |
| Open bugs (high) | COUNT(high bugs) | < 5 | Weekly |
| Deployment frequency | Deploys to production per week | 1–3/week | Weekly |
| MTTR (mean time to recovery) | AVG(incident resolved - incident started) | < 4 hours | Per incident |
| npm vulnerabilities | COUNT(audit vulnerabilities) | 0 | Weekly |
| TypeScript errors | tsc --noEmit error count | 0 | Per commit |

---

## 8. Customer Experience Department KPIs (Phase 9)

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| CSAT score | AVG(satisfaction rating 1–10) | > 8.5 | Per interaction |
| NPS | (% promoters - % detractors) × 100 | > 70 | Quarterly |
| First contact resolution | Resolved on first contact / total | > 80% | Monthly |
| Response time (email) | AVG(time to first email reply) | < 4 hours | Daily |
| Complaint resolution time | AVG(complaint closed - opened) | < 5 business days | Monthly |
| Escalation rate | Escalated / total contacts × 100 | < 5% | Monthly |
| Portal satisfaction | Portal-specific NPS | > 8.0 | Quarterly |

---

## 9. HR / People Department KPIs

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Agent RERA compliance | % agents with valid RERA BRN | 100% | Monthly |
| Staff retention rate | (staff at end - left) / start × 100 | > 90% | Annually |
| Time-to-hire | AVG days from job post to offer accepted | < 30 days | Per hire |
| Training completion | % staff completing required training | 100% | Quarterly |
| Onboarding time | Days until new hire is productive | < 14 days | Per hire |
| Performance review completion | % completed on time | 100% | Quarterly |

---

## 10. Data & AI Department KPIs (Phase 7)

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Property valuation accuracy | AVM price vs actual sale price, % difference | < 5% | Monthly |
| Lead score prediction accuracy | Score vs outcome correlation | Pearson > 0.7 | Monthly |
| Recommendation CTR | Properties clicked / recommended × 100 | > 15% | Weekly |
| Search latency (Elasticsearch) | AVG search response time | < 100ms | Daily |
| Data freshness | Time since last DLD data ingestion | < 24 hours | Daily |
| ML model drift | Score distribution shift | Alert at >10% | Weekly |

---

## 11. Dashboard Implementation Spec

### 11.1 Executive Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  KPI CARD ROW 1: MAU │ Active Leads │ Pipeline Value │ Commissions  │
├──────────────────────────────────────────────────────────────────────┤
│  CHART 1: Lead volume trend (12 months bar chart)                   │
│  CHART 2: Pipeline stage distribution (funnel)                      │
│  CHART 3: Revenue trend (monthly commission bar)                    │
├──────────────────────────────────────────────────────────────────────┤
│  TABLE: Top agents this month (name, leads, deals, commission)       │
│  MAP: Property listings heatmap (Google Maps)                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 11.2 Data Sources

| Dashboard Section | Source | Refresh Rate |
|------------------|--------|-------------|
| Lead KPIs | CRM leads collection | Real-time (Phase 3) |
| Property KPIs | CRM properties collection | Every 5 min |
| Finance KPIs | Commissions + transactions | Hourly |
| Compliance KPIs | Compliance collection | Daily |
| Tech KPIs | Prometheus metrics (Phase 2) | Real-time |
| Marketing KPIs | Google Analytics + SendGrid | Daily |

---

**Document Owner:** Analytics (Maven + Cassie)
**Update Trigger:** New metric agreed or target revised
**Related:** `business/07_strategy/okr-framework.md`, `business_docs/09_crm_features/analytics-reporting.md`
