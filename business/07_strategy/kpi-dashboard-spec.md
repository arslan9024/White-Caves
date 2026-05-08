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

| KPI                            | Definition                            | Formula                                     | Target               | Frequency | Source           |
| ------------------------------ | ------------------------------------- | ------------------------------------------- | -------------------- | --------- | ---------------- |
| Monthly Active Users (MAU)     | Unique authenticated users per month  | COUNT(users with session in month)          | 10,000 by Q4 2026    | Monthly   | MongoDB Activity |
| Monthly Leads Created          | New leads added to CRM                | COUNT(leads.createdAt in month)             | 200/month by Q4      | Monthly   | CRM leads        |
| Lead-to-Transaction Rate       | % of leads that result in closed deal | WON leads / total leads × 100               | > 10%                | Monthly   | CRM              |
| Revenue (Commissions Received) | Total commission income               | SUM(commissions.amount WHERE status='paid') | AED 2M/quarter by Q4 | Monthly   | Finance          |
| Active Property Listings       | Live listings on platform             | COUNT(properties WHERE status='PUBLISHED')  | 500 by Q3            | Weekly    | CRM              |
| Avg. Deal Cycle Time           | Days from lead creation to WON        | AVG(lead.wonAt - lead.createdAt)            | < 45 days            | Monthly   | CRM              |
| NPS (Net Promoter Score)       | Client satisfaction                   | (% Promoters − % Detractors) × 100          | > 70                 | Quarterly | Survey           |
| Platform Uptime                | % of time API is available            | (total mins - downtime mins) / total × 100  | ≥ 99.9%              | Monthly   | Monitoring       |

---

## 2. Sales Department KPIs

| KPI                      | Formula                                                             | Target         | Frequency |
| ------------------------ | ------------------------------------------------------------------- | -------------- | --------- |
| New leads (total)        | COUNT(leads WHERE month)                                            | 200/month      | Weekly    |
| Lead response time       | AVG(first activity - lead.createdAt)                                | < 2 hours      | Daily     |
| Hot lead conversion      | WON / hot leads × 100                                               | > 25%          | Monthly   |
| Pipeline value           | SUM(deal.expectedValue WHERE status IN [QUALIFIED, VIEWING, OFFER]) | AED 50M+       | Weekly    |
| Deals closed (WON)       | COUNT(leads WHERE status=WON, month)                                | 10/month by Q4 | Monthly   |
| Avg. commission per deal | SUM(commission) / COUNT(deals)                                      | AED 80,000     | Monthly   |
| Lead source breakdown    | COUNT by source (website/WA/portal/walkin/referral)                 | —              | Monthly   |
| Dormant lead rate        | % of leads auto-marked dormant                                      | < 15%          | Weekly    |

---

## 3. Operations Department KPIs

| KPI                         | Formula                                         | Target             | Frequency |
| --------------------------- | ----------------------------------------------- | ------------------ | --------- |
| Active listings             | COUNT(properties WHERE status=PUBLISHED)        | 500+               | Weekly    |
| Listing quality score       | AVG(photo count + description length / max)     | > 80%              | Monthly   |
| Ejari registrations         | COUNT(leases WHERE ejariNumber NOT NULL, month) | 20/month by Q3     | Monthly   |
| Maintenance resolution time | AVG(request.resolvedAt - request.createdAt)     | < 5 days           | Weekly    |
| Open maintenance requests   | COUNT(maintenance WHERE status != resolved)     | < 20               | Weekly    |
| Tenancy renewals            | COUNT(leases renewed vs expired)                | > 60% renewal rate | Monthly   |
| Landlord portal logins      | COUNT(sessions WHERE role=landlord, week)       | 50+/week by Q3     | Weekly    |
| Tenant portal logins        | COUNT(sessions WHERE role=tenant, week)         | 100+/week by Q3    | Weekly    |

---

## 4. Finance Department KPIs

| KPI                            | Formula                               | Target                | Frequency |
| ------------------------------ | ------------------------------------- | --------------------- | --------- |
| Total commission earned        | SUM(commission.baseAmount, month)     | AED 500k+/month by Q4 | Monthly   |
| Commission approval rate       | Approved / submitted × 100            | > 95%                 | Monthly   |
| Avg. commission approval time  | AVG(approvedAt - createdAt)           | < 24 hours            | Monthly   |
| Overdue commissions            | COUNT(commissions pending > 30 days)  | 0                     | Weekly    |
| Rent collection rate           | Paid payments / due payments × 100    | > 98%                 | Monthly   |
| Revenue by transaction type    | SUM by type (sale/rent/mgmt)          | —                     | Monthly   |
| Outstanding developer invoices | COUNT(invoices sent but unpaid > 30d) | 0                     | Weekly    |
| Recurring revenue (mgmt fees)  | SUM(property_management.fees, month)  | AED 50k/month by Q4   | Monthly   |

---

## 5. Marketing Department KPIs

| KPI                          | Formula                             | Target                          | Frequency    |
| ---------------------------- | ----------------------------------- | ------------------------------- | ------------ |
| Monthly website visitors     | COUNT(unique sessions, month)       | 500 by Q3, 5,000 by Q4          | Monthly      |
| Website lead conversion rate | Leads from website / visitors × 100 | > 5%                            | Monthly      |
| Google Search ranking        | Position for target keywords        | Top 10 for "DAMAC Hills 2 sale" | Monthly      |
| Organic traffic growth       | MoM change in organic sessions      | +20% MoM                        | Monthly      |
| WhatsApp opt-ins             | COUNT(WA contacts opted in)         | 500 by Q4                       | Monthly      |
| Email open rate              | Opened / sent × 100                 | > 35%                           | Per campaign |
| Social media followers       | COUNT(IG + LinkedIn followers)      | 5,000 by Q4                     | Monthly      |
| Cost per lead (paid)         | Ad spend / leads from paid          | < AED 200                       | Per campaign |

---

## 6. Compliance Department KPIs

| KPI                            | Formula                             | Target                            | Frequency |
| ------------------------------ | ----------------------------------- | --------------------------------- | --------- |
| KYC completion rate            | % of clients with complete KYC      | 100% (for transactions > AED 55k) | Monthly   |
| AML screening rate             | % of eligible clients screened      | 100%                              | Monthly   |
| RERA permit compliance         | % of listings with valid permit     | 100%                              | Weekly    |
| Open compliance breaches       | COUNT(compliance issues unresolved) | 0                                 | Weekly    |
| SAR filings (if applicable)    | COUNT(SARs filed)                   | As needed                         | Monthly   |
| Staff PDPL training completion | % of staff trained                  | 100% by Phase 5                   | Quarterly |
| Data subject requests handled  | Handled within 30 days / total      | 100%                              | Monthly   |
| RERA license renewals pending  | Days until renewal required         | Alert at 60 days                  | Monthly   |

---

## 7. Technology Department KPIs

| KPI                          | Formula                                   | Target       | Frequency    |
| ---------------------------- | ----------------------------------------- | ------------ | ------------ |
| API uptime                   | (minutes UP / total) × 100                | ≥ 99.9%      | Daily        |
| API response time (p95)      | 95th percentile response time             | < 300ms      | Daily        |
| Build success rate           | Passing builds / total builds × 100       | 100%         | Per commit   |
| Test coverage                | (passing tests / total test cases)        | 7,744+ cases | Per PR       |
| Open bugs (critical)         | COUNT(critical bugs)                      | 0            | Daily        |
| Open bugs (high)             | COUNT(high bugs)                          | < 5          | Weekly       |
| Deployment frequency         | Deploys to production per week            | 1–3/week     | Weekly       |
| MTTR (mean time to recovery) | AVG(incident resolved - incident started) | < 4 hours    | Per incident |
| npm vulnerabilities          | COUNT(audit vulnerabilities)              | 0            | Weekly       |
| TypeScript errors            | tsc --noEmit error count                  | 0            | Per commit   |

---

## 8. Customer Experience Department KPIs (Phase 9)

| KPI                       | Formula                            | Target            | Frequency       |
| ------------------------- | ---------------------------------- | ----------------- | --------------- |
| CSAT score                | AVG(satisfaction rating 1–10)      | > 8.5             | Per interaction |
| NPS                       | (% promoters - % detractors) × 100 | > 70              | Quarterly       |
| First contact resolution  | Resolved on first contact / total  | > 80%             | Monthly         |
| Response time (email)     | AVG(time to first email reply)     | < 4 hours         | Daily           |
| Complaint resolution time | AVG(complaint closed - opened)     | < 5 business days | Monthly         |
| Escalation rate           | Escalated / total contacts × 100   | < 5%              | Monthly         |
| Portal satisfaction       | Portal-specific NPS                | > 8.0             | Quarterly       |

---

## 9. HR / People Department KPIs

| KPI                           | Formula                                  | Target    | Frequency |
| ----------------------------- | ---------------------------------------- | --------- | --------- |
| Agent RERA compliance         | % agents with valid RERA BRN             | 100%      | Monthly   |
| Staff retention rate          | (staff at end - left) / start × 100      | > 90%     | Annually  |
| Time-to-hire                  | AVG days from job post to offer accepted | < 30 days | Per hire  |
| Training completion           | % staff completing required training     | 100%      | Quarterly |
| Onboarding time               | Days until new hire is productive        | < 14 days | Per hire  |
| Performance review completion | % completed on time                      | 100%      | Quarterly |

---

## 10. Data & AI Department KPIs (Phase 7)

| KPI                            | Formula                                      | Target        | Frequency |
| ------------------------------ | -------------------------------------------- | ------------- | --------- |
| Property valuation accuracy    | AVM price vs actual sale price, % difference | < 5%          | Monthly   |
| Lead score prediction accuracy | Score vs outcome correlation                 | Pearson > 0.7 | Monthly   |
| Recommendation CTR             | Properties clicked / recommended × 100       | > 15%         | Weekly    |
| Search latency (Elasticsearch) | AVG search response time                     | < 100ms       | Daily     |
| Data freshness                 | Time since last DLD data ingestion           | < 24 hours    | Daily     |
| ML model drift                 | Score distribution shift                     | Alert at >10% | Weekly    |

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

| Dashboard Section | Source                       | Refresh Rate        |
| ----------------- | ---------------------------- | ------------------- |
| Lead KPIs         | CRM leads collection         | Real-time (Phase 3) |
| Property KPIs     | CRM properties collection    | Every 5 min         |
| Finance KPIs      | Commissions + transactions   | Hourly              |
| Compliance KPIs   | Compliance collection        | Daily               |
| Tech KPIs         | Prometheus metrics (Phase 2) | Real-time           |
| Marketing KPIs    | Google Analytics + SendGrid  | Daily               |

---

## 12. Dashboard Technical Implementation Spec

### 12.1 React Component Architecture

```
src/
├── components/
│   └── dashboard/
│       ├── KPICard.tsx          # Single metric tile (value, trend, delta, status)
│       ├── KPIChart.tsx         # Line / bar / funnel chart wrapper (Recharts)
│       ├── KPITable.tsx         # Sortable, paginated table for tabular KPIs
│       ├── KPIDashboard.tsx     # Page-level layout: grid of cards + charts
│       ├── KPIAlertBanner.tsx   # Red/yellow banner for threshold breaches
│       ├── KPIDateFilter.tsx    # Date range selector (today/7d/30d/custom)
│       └── KPIExportButton.tsx  # Download CSV / PDF of current view
```

#### KPICard Props Interface

```typescript
interface KPICardProps {
  title: string; // e.g. "Monthly Active Users"
  value: number | string; // e.g. 1240 or "AED 2.1M"
  target: number | string; // e.g. 10000 or "AED 2M"
  delta: number; // % change from previous period (positive = good)
  trend: 'up' | 'down' | 'flat';
  status: 'green' | 'yellow' | 'red'; // derived from threshold rules (Section 13)
  unit?: string; // e.g. "%" or "AED" or "days"
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
  lastUpdated: Date;
  onClick?: () => void; // drill-down to detail view
}
```

#### KPIChart Props Interface

```typescript
interface KPIChartProps {
  type: 'line' | 'bar' | 'funnel' | 'pie' | 'area';
  data: KPIDataPoint[]; // { date: string; value: number; label?: string }[]
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  color?: string; // defaults to brand gold #C9A84C
  target?: number; // renders a reference line at target value
  height?: number; // defaults to 300px
  loading?: boolean;
}
```

### 12.2 Data Fetching Strategy

#### SWR (Standard for non-real-time dashboards)

```typescript
// 5-minute polling for most dashboard sections
import useSWR from 'swr';

const { data: executiveKPIs, isLoading } = useSWR('/api/kpis/executive', fetcher, {
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  revalidateOnFocus: true,
  dedupingInterval: 60 * 1000, // dedupe within 1 minute
});
```

#### WebSocket (Real-time: lead alerts, chat, active viewings)

```typescript
// Phase 4+ real-time: active lead count, WhatsApp messages
const ws = new WebSocket(process.env.WS_URL + '/kpis/live');
ws.onmessage = event => {
  const { metric, value } = JSON.parse(event.data);
  dispatch(updateLiveKPI({ metric, value }));
};
```

**Decision Rule:**

- Default to SWR 5-minute polling for all executive/finance/marketing/ops KPIs
- WebSocket ONLY for: active leads created today (ticks up live), WhatsApp message volume, Phase 4 bot session count
- Never use WebSocket for heavy aggregations (causes server thrashing under load)

### 12.3 Redis Caching Strategy

```
KPI Type                          Cache TTL     Cache Key Pattern
─────────────────────────────────────────────────────────────────
Executive summary (MAU, revenue)  1 hour        kpi:executive:YYYY-MM
Pipeline value (SUM aggregation)  5 minutes     kpi:pipeline:current
Monthly lead count                15 minutes    kpi:leads:YYYY-MM
Commission totals                 1 hour        kpi:commissions:YYYY-MM
Agent performance rankings        30 minutes    kpi:agents:rankings:YYYY-MM
Listing count by status           5 minutes     kpi:listings:summary
Compliance scorecard              6 hours       kpi:compliance:YYYY-MM
Property search aggregations      10 minutes    kpi:search:facets
```

**Cache Invalidation Rules:**

- On `POST /api/leads` → invalidate `kpi:leads:*` and `kpi:pipeline:*`
- On `PUT /api/leads/:id` (status change to WON) → invalidate `kpi:commissions:*` and `kpi:agents:rankings:*`
- On `POST /api/properties` → invalidate `kpi:listings:*`
- TTL-based expiry as fallback; do not rely on explicit invalidation alone

### 12.4 API Endpoint Definitions

| Endpoint                         | Auth Required                      | Response                                                              | Description                    |
| -------------------------------- | ---------------------------------- | --------------------------------------------------------------------- | ------------------------------ |
| `GET /api/kpis/executive`        | MD, Admin                          | `{ mau, leads, pipeline, revenue, uptime, nps }`                      | Executive summary card row     |
| `GET /api/kpis/executive/trends` | MD, Admin                          | `{ monthly: [{ month, leads, revenue }] }`                            | 12-month trend data for charts |
| `GET /api/kpis/sales`            | MD, SalesManager, Agent (own data) | `{ newLeads, responseTime, pipelineValue, dealsWon, conversionRate }` | Sales department KPIs          |
| `GET /api/kpis/sales/agents`     | MD, SalesManager                   | `[{ agentId, name, leads, deals, commission }]`                       | Agent performance table        |
| `GET /api/kpis/operations`       | MD, OpsManager                     | `{ listings, ejari, maintenance, tenancyRenewals }`                   | Operations KPIs                |
| `GET /api/kpis/finance`          | MD, Finance                        | `{ commissionsEarned, rentCollection, overdue, recurring }`           | Finance KPIs                   |
| `GET /api/kpis/marketing`        | MD, Marketing                      | `{ visitors, leadConversion, seoRankings, whatsappOptIns }`           | Marketing KPIs                 |
| `GET /api/kpis/compliance`       | MD, Compliance                     | `{ kycRate, amlRate, reraCompliance, openBreaches }`                  | Compliance scorecard           |
| `GET /api/kpis/tech`             | MD, TechLead                       | `{ uptime, responseTime, buildSuccessRate, testCoverage, npmVulns }`  | Tech health KPIs               |
| `GET /api/kpis/cx`               | MD, CX                             | `{ csat, nps, firstContactResolution, responseTime }`                 | Customer experience KPIs       |

**Query Parameters (all endpoints):**

- `?period=today|7d|30d|quarter|year` — default `30d`
- `?from=YYYY-MM-DD&to=YYYY-MM-DD` — custom date range
- `?agentId=xxx` — filter to specific agent (where applicable)

### 12.5 Loading and Empty States

```typescript
// KPICard loading state
if (isLoading) return <KPICardSkeleton />;  // gold shimmer animation

// KPICard empty state (no data for period)
if (!data || data.value === null) {
  return (
    <KPICardEmpty
      message="No data for selected period"
      action="Expand date range"
    />
  );
}

// KPIChart empty state (< 2 data points — can't draw a trend line)
if (data.length < 2) {
  return (
    <KPIChartEmpty
      message="More data needed to show trend"
      subtitle={`Only ${data.length} data point(s) available`}
    />
  );
}
```

---

## 13. Alert Thresholds

> For each critical KPI: warning threshold, critical threshold, alert channel, and auto-escalation rules.

### 13.1 Sales Alerts

| KPI                 | Warning Threshold   | Critical Threshold | Warning →               | Critical →                        | Auto-Escalation                                                          |
| ------------------- | ------------------- | ------------------ | ----------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| Lead response time  | > 2 hours           | > 8 hours          | Email to assigned agent | WhatsApp to agent + Sales Manager | If no response after 8h critical alert: auto-escalate to MD via WhatsApp |
| Lead dormant rate   | > 15% of pipeline   | > 25% of pipeline  | Dashboard yellow badge  | Email to Sales Manager            | Weekly report with dormant lead list if > 20%                            |
| Daily leads created | < 3/day (7-day avg) | < 1/day            | Dashboard warning       | Email to Marketing + MD           | Auto-pause any paused ad campaigns check                                 |
| Pipeline value      | < AED 30M           | < AED 10M          | Dashboard yellow        | Email to MD                       | —                                                                        |
| Deals WON (month)   | < 5 by mid-month    | 0 by mid-month     | Dashboard               | WhatsApp to MD                    | —                                                                        |

### 13.2 Technology Alerts

| KPI                          | Warning Threshold           | Critical Threshold          | Warning →                           | Critical →                           | Auto-Escalation                              |
| ---------------------------- | --------------------------- | --------------------------- | ----------------------------------- | ------------------------------------ | -------------------------------------------- |
| API uptime                   | < 99.9% (any 1-hour window) | < 99.0% (any 1-hour window) | PagerDuty alert to on-call engineer | PagerDuty + WhatsApp to Tech Lead    | If unresolved 30 min: escalate to CTO (Mira) |
| API response time p95        | > 500ms                     | > 2,000ms                   | Dashboard yellow                    | PagerDuty + Sentry alert             | Auto-trigger Redis cache flush               |
| npm critical vulnerabilities | Any new critical            | —                           | GitHub PR blocked                   | Email to Tech Lead + Security (Ecem) | CI pipeline fails — blocks all deployments   |
| TypeScript errors            | > 0 in PR                   | —                           | PR check fails                      | —                                    | Blocks merge to main                         |
| Build failure rate           | > 10% in 24h                | > 30% in 24h                | Slack to tech channel               | Email to Tech Lead                   | —                                            |

### 13.3 Finance Alerts

| KPI                           | Warning Threshold                    | Critical Threshold                   | Warning →                | Critical →                                       | Auto-Escalation                           |
| ----------------------------- | ------------------------------------ | ------------------------------------ | ------------------------ | ------------------------------------------------ | ----------------------------------------- |
| Rent payment overdue          | > 7 days past due date               | > 30 days past due date              | WhatsApp to tenant       | WhatsApp to tenant + Landlord + Property Manager | Legal notice workflow initiated (Phase 5) |
| Commission not approved       | > 3 business days since submission   | > 7 business days                    | Email to Finance Manager | WhatsApp to Finance Manager + MD                 | —                                         |
| Outstanding developer invoice | > 30 days unpaid                     | > 60 days unpaid                     | Email to Finance         | WhatsApp to Finance + MD                         | —                                         |
| Monthly revenue vs target     | < 70% of monthly target by mid-month | < 50% of monthly target by mid-month | Dashboard yellow         | Email to MD                                      | —                                         |

### 13.4 Compliance Alerts

| KPI                                 | Warning Threshold                               | Critical Threshold    | Warning →                | Critical →                                               | Auto-Escalation                         |
| ----------------------------------- | ----------------------------------------------- | --------------------- | ------------------------ | -------------------------------------------------------- | --------------------------------------- |
| Transaction missing KYC (> AED 55k) | Any transaction in QUALIFIED+ stage without KYC | —                     | Dashboard red badge      | Block stage advancement + WhatsApp to Compliance (Laila) | If unresolved 24h: escalate to MD       |
| RERA permit missing on live listing | Any published listing without valid permit      | —                     | Auto-unpublish listing   | Email to agent + Compliance                              | Stays unpublished until permit uploaded |
| AML screening not run               | Any transaction > AED 55k without screening     | —                     | Block deal progression   | WhatsApp to Compliance + MD                              |                                         |
| RERA license expiry                 | 60 days before expiry                           | 30 days before expiry | Email to MD + Compliance | Daily WhatsApp reminder                                  | —                                       |

### 13.5 Alert Channel Priority

```
CHANNEL         WHEN TO USE
────────────────────────────────────────────────────────
Dashboard badge  Low-priority warnings; passive awareness
Email            Standard warnings; no immediate action needed
WhatsApp         Requires action within 4 hours
PagerDuty        Infrastructure/API incidents requiring immediate action
Auto-block       System enforcement (e.g., block listing without RERA permit)
```

---

## 14. Report Scheduling

### 14.1 Daily Digest (Automated)

| Field                   | Value                                            |
| ----------------------- | ------------------------------------------------ |
| **Recipient**           | Managing Director (arslanmalikgoraha@gmail.com)  |
| **Delivery time**       | 08:00 GST every working day                      |
| **Format**              | Email (HTML, mobile-optimised)                   |
| **Generation**          | Automated cron job, 07:45 GST                    |
| **Fallback if no data** | Send "No activity yesterday" digest (never skip) |

**Content (5 Key Metrics):**

1. 🔵 Leads created yesterday (vs 7-day average)
2. 🟢 Pipeline value (AED, current)
3. 🟡 Lead response time average (yesterday)
4. 💰 Commissions pending approval (count + AED value)
5. ⚠️ Open alerts (any RED threshold breaches)

---

### 14.2 Weekly Sales Report (Automated)

| Field              | Value                                      |
| ------------------ | ------------------------------------------ |
| **Recipient**      | Sales Manager (Sophia) + Managing Director |
| **Delivery time**  | Monday 09:00 GST                           |
| **Format**         | PDF attachment + email summary             |
| **Period covered** | Previous Mon–Sun                           |
| **Generation**     | Automated, Sunday 23:00 GST                |

**Content:**

- New leads created (by source: website / WhatsApp / portal / walk-in / referral)
- Pipeline stage distribution (table: count + AED value per stage)
- Lead-to-viewing conversion rate
- Deals WON/LOST last week (with deal value)
- Agent performance table (leads owned, deals closed, avg response time)
- Top 5 dormant leads requiring follow-up (name, last activity, days dormant)

---

### 14.3 Monthly Finance Summary (Automated)

| Field              | Value                                          |
| ------------------ | ---------------------------------------------- |
| **Recipient**      | Managing Director + Finance Manager (Theodora) |
| **Delivery time**  | 1st of each month, 09:00 GST                   |
| **Format**         | Excel (.xlsx) — 3 tabs + email summary         |
| **Period covered** | Previous calendar month                        |
| **Generation**     | Last day of month, 23:00 GST                   |

**Excel Tabs:**

1. **Commission Summary** — all commissions by deal, status, agent, property
2. **Rent Collection** — all rent invoices: paid / overdue / pending by property + tenant
3. **P&L Summary** — revenue (commissions + management fees) vs estimated costs

---

### 14.4 Quarterly Board Pack (Manual + Automated)

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Recipient**      | Managing Director only (board distribution at MD discretion) |
| **Delivery time**  | 5th working day of new quarter                               |
| **Format**         | PDF (generated by system) + PPT template for MD to customise |
| **Period covered** | Previous quarter                                             |
| **Generation**     | Automated data extraction; MD reviews before distribution    |

**Content:**

- Company OKR scores with actuals vs targets (all 5 company objectives)
- Revenue dashboard: actual vs target (quarter + YTD)
- Lead funnel: volume, conversion rates, average deal cycle
- Compliance scorecard: KYC/AML/RERA metrics
- Tech health: uptime, performance, deployment frequency
- Hiring / team changes in quarter
- Next quarter OKRs (preview)

---

### 14.5 Report Generation Architecture

```
Cron Schedule (server/jobs/reports.ts)
├── Daily 07:45 GST  → generateDailyDigest() → sendEmail(MD)
├── Sunday 23:00 GST → generateWeeklySalesReport() → generatePDF() → sendEmail(Sales + MD)
├── Month end 23:00  → generateMonthlyFinanceSummary() → generateExcel() → sendEmail(Finance + MD)
└── Quarter end      → generateQuarterlyDataExport() → S3 upload → notify MD

All reports:
1. Pull data from Redis cache (if available) or MongoDB directly
2. Run through report template (Handlebars for email, Puppeteer for PDF, ExcelJS for Excel)
3. Store generated file in S3 under /reports/{type}/{YYYY-MM-DD}/
4. Send via SendGrid with S3 pre-signed URL link (valid 7 days)
5. Log delivery in reports_log collection (reportType, generatedAt, sentTo, s3Key)
```

---

## 15. Data Governance

### 15.1 KPI Access Control (RBAC)

> Who can see which KPI dashboards — enforced via existing RBAC middleware.

| Dashboard Section | Managing Director | Sales Manager | Agent (own data) | Finance Manager | Operations Manager | Compliance Officer | Tech Lead |
| ----------------- | :---------------: | :-----------: | :--------------: | :-------------: | :----------------: | :----------------: | :-------: |
| Executive KPIs    |        ✅         |      🔒       |        ❌        |  🔒 view-only   |         ❌         |         ❌         |    ❌     |
| Sales KPIs (team) |        ✅         |      ✅       |        ❌        |       ❌        |         ❌         |         ❌         |    ❌     |
| Sales KPIs (own)  |        ✅         |      ✅       |        ✅        |       ❌        |         ❌         |         ❌         |    ❌     |
| Finance KPIs      |        ✅         |      ❌       |        ❌        |       ✅        |         ❌         |         ❌         |    ❌     |
| Operations KPIs   |        ✅         |      ❌       |        ❌        |       ❌        |         ✅         |         ❌         |    ❌     |
| Compliance KPIs   |        ✅         |      ❌       |        ❌        |       ❌        |         ❌         |         ✅         |    ❌     |
| Technology KPIs   |        ✅         |      ❌       |        ❌        |       ❌        |         ❌         |         ❌         |    ✅     |
| Marketing KPIs    |        ✅         | 🔒 view-only  |        ❌        |       ❌        |         ❌         |         ❌         |    ❌     |
| CX / NPS          |        ✅         |      ✅       |        ❌        |       ❌        |         ✅         |         ❌         |    ❌     |

🔒 = Read-only, no export access

**Implementation Note:** The `/api/kpis/*` endpoints check `req.user.role` against this matrix via `kpiAccessMiddleware`. Agents calling `/api/kpis/sales` receive only their own `agentId`-scoped data; the full-team view requires `SalesManager` or higher role.

---

### 15.2 KPI History Data Retention

| Data Category                      | Retention Period              | Storage                                   | Archive Policy                                 |
| ---------------------------------- | ----------------------------- | ----------------------------------------- | ---------------------------------------------- |
| Raw KPI snapshots (daily)          | 2 years rolling               | MongoDB `kpi_snapshots` collection        | Auto-delete snapshots > 730 days via TTL index |
| Monthly aggregated KPI reports     | 7 years                       | S3 cold storage (`/kpi-archive/monthly/`) | Required for UAE VAT + financial compliance    |
| Generated PDF/Excel reports        | 7 years                       | S3 (`/reports/`)                          | Required for audit trail                       |
| Compliance-related KPIs (AML, KYC) | 10 years                      | S3 Glacier                                | UAE AML Law Article 14: 10-year retention      |
| Real-time Redis cache              | Matches TTL (5 min – 6 hours) | Redis                                     | Auto-expires; no archival                      |

**MongoDB TTL Index (kpi_snapshots):**

```javascript
db.kpi_snapshots.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 63072000 } // 730 days = 2 years
);
```

---

### 15.3 Data Quality Rules

> What happens when source data is missing or inconsistent.

| Scenario                                           | Detection Method                                       | Handling                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Lead created without source field                  | `leads.source = null`                                  | Default to `'unknown'`; surface in Data Quality dashboard alert; Sales Manager notified weekly to review |
| Commission without deal reference                  | `commissions.dealId = null`                            | Block commission creation — `dealId` is mandatory field since Phase 3                                    |
| Property listing without RERA permit               | `properties.reraPermit = null AND status = PUBLISHED`  | Auto-unpublish + alert Compliance + Operations (see Section 13.4)                                        |
| KYC expiry (passport > 2 years old)                | `kyc.passportExpiry < NOW()`                           | Flag in compliance dashboard; block from participating in new transactions                               |
| Duplicate lead (same phone + email within 30 days) | Duplicate detection on `POST /api/leads`               | Auto-merge into existing lead; log merge event; Sales Manager notified                                   |
| Stale CRM data (lead not updated > 60 days)        | `leads.updatedAt < NOW() - 60 days AND status != LOST` | Auto-mark as `DORMANT`; appear in weekly dormant report                                                  |

---

### 15.4 KPI Definition Versioning

> When a KPI formula changes, historical comparability must be preserved.

**Versioning Rules:**

1. Every KPI formula change must be documented in this spec with:
   - Version number (e.g., `v1.2`)
   - Date of change
   - Old formula
   - New formula
   - Reason for change

2. Historical data is **never retroactively recalculated** — it retains the formula version used at time of capture.

3. Charts that span a formula change boundary must display a **visual break line** with tooltip: _"KPI formula updated on [date] — see governance doc for details."_

4. The `kpi_snapshots` collection stores `formulaVersion: string` on every snapshot document.

**Example Formula Version Log:**

| KPI                      | Version | Date     | Old Formula                                      | New Formula                                                           | Reason                                                                                       |
| ------------------------ | ------- | -------- | ------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Lead Response Time       | v1.0    | Apr 2026 | `AVG(first_activity.createdAt - lead.createdAt)` | —                                                                     | Initial definition                                                                           |
| Lead Response Time       | v1.1    | TBD      | `AVG(first_activity.createdAt - lead.createdAt)` | `AVG(first_agent_message.sentAt - lead.createdAt)` (WhatsApp Phase 4) | Phase 4 adds WhatsApp as primary response channel; email activity no longer sufficient proxy |
| Lead-to-Transaction Rate | v1.0    | Apr 2026 | `WON leads / total leads × 100`                  | —                                                                     | Initial definition                                                                           |
| MAU                      | v1.0    | Apr 2026 | `COUNT(users with session in month)`             | —                                                                     | Initial definition                                                                           |

---

**Document Owner:** Analytics (Maven + Cassie)
**Update Trigger:** New metric agreed or target revised
**Related:** `business/07_strategy/okr-framework.md`, `business_docs/09_crm_features/analytics-reporting.md`
