# Wave 18 — KPI Dashboard Baseline (CRM + Server Excellence)

**Date:** 2026-05-26  
**Purpose:** define baseline metrics and release-gate thresholds for server + CRM/dashboard modernization.

---

## Baseline Metric Set (Locked)

### Reliability & Platform

1. API p95 response time (core CRM routes)
2. API error rate (5xx + critical 4xx classes)
3. Uptime (service and dependency-aware)
4. DB dependency availability
5. Security incident count (auth abuse, blocked high-risk actions, secret/webhook violations)

### CRM Revenue & Execution

6. Lead response SLA (median first response time)
7. Lead→Viewing conversion rate
8. Viewing→Offer conversion rate
9. Offer submission rate
10. Mobile CRM task completion rate

### Lifecycle & Experience

11. Tenant portal monthly active usage
12. Landlord portal monthly active usage
13. Critical workflow completion time (lead import, KYC gate, Ejari/rent tasks)
14. Regression count per release (auth/profile/routing/dashboard critical paths)

---

## 90-Day Targets (Aligned to Wave 18.1)

- Lead response time: **-40%**
- Viewing booking conversion: **+25%**
- Offer submission rate: **+20%**
- Listing completeness score: **+30%**
- Mobile CRM completion rate: **+35%**
- Tenant/Landlord portal MAU: **+30%**

---

## Release Gate Thresholds

| Gate | Threshold | Action if failed |
| --- | --- | --- |
| API p95 latency | No regression beyond agreed tolerance per critical route group | Block release + open P0 perf task |
| API error rate | No sustained increase in 5xx class error budget | Block release + incident review |
| Auth/routing regression | 0 critical regressions in focused suite | Block release |
| Compliance gate integrity | 100% pass for KYC/Ejari/permit critical checks | Block release |
| Plans governance | `npm run plans:validate` green | Do not close wave |

---

## Data Sources (Current)

- Backend route/service telemetry and logs.
- Reporting/analytics workflow outputs.
- CRM operational event streams (lead, viewing, offer, activity).
- Weekly parity matrix and backlog delta docs.

---

## Weekly KPI Review Checklist

- [ ] Refresh KPI trend lines and annotate major deltas.
- [ ] Map each negative delta to an active backlog item.
- [ ] Confirm release gate status for current sprint.
- [ ] Publish summary in wave tracker update.
