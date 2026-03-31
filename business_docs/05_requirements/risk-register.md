# Risk Register — White Caves CRM Platform

> **Document ID:** WC-RSK-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Review Frequency:** Quarterly

---

## Risk Assessment Matrix

**Probability:** 1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Almost Certain  
**Impact:** 1=Negligible, 2=Minor, 3=Moderate, 4=Major, 5=Catastrophic  
**Risk Score = Probability × Impact**

| Score | Risk Level |
|-------|-----------|
| 1–4 | Low — Monitor |
| 5–9 | Medium — Manage |
| 10–16 | High — Priority Action |
| 17–25 | Critical — Immediate Action |

---

## Technical Risks

| ID | Risk | Prob | Impact | Score | Level | Mitigation | Owner |
|----|------|------|--------|-------|-------|-----------|-------|
| RSK-T-001 | MongoDB Atlas outage | 2 | 5 | 10 | High | Daily backups; Atlas M20+ SLA 99.95%; RTO 2h procedures | Dev Lead |
| RSK-T-002 | Data breach / unauthorised access | 2 | 5 | 10 | High | JWT auth; bcrypt; HTTPS; rate limiting; PDPL notification plan | Compliance |
| RSK-T-003 | WhatsApp API account suspension (Meta) | 2 | 4 | 8 | Medium | Message quality monitoring; template pre-approval; backup communication via email | Dev Lead |
| RSK-T-004 | Performance degradation under high load | 3 | 3 | 9 | Medium | Monitoring alerts; auto-scaling; performance test baseline | Dev Lead |
| RSK-T-005 | Third-party API failure (PropertyFinder, Bayut) | 3 | 2 | 6 | Medium | Graceful degradation; manual listing fallback | Dev Lead |
| RSK-T-006 | Developer dependency / bus factor = 1 | 3 | 4 | 12 | High | Document codebase thoroughly; cross-train 2nd developer; SDD maintained | MD |
| RSK-T-007 | Security vulnerability in dependencies | 3 | 3 | 9 | Medium | Monthly `npm audit`; automated Dependabot alerts | Dev Lead |
| RSK-T-008 | Bad deployment breaks production | 2 | 4 | 8 | Medium | Staging environment; rollback procedure; deployment runbook | Dev Lead |

---

## Business / Operational Risks

| ID | Risk | Prob | Impact | Score | Level | Mitigation | Owner |
|----|------|------|--------|-------|-------|-----------|-------|
| RSK-B-001 | RERA license lapse | 1 | 5 | 5 | Medium | Compliance dashboard tracks expiry; 60-day auto-reminder | Compliance |
| RSK-B-002 | Agent non-adoption of CRM | 3 | 4 | 12 | High | Training program; champion users; simple UX; management buy-in | Sales Manager |
| RSK-B-003 | Key agent departure with client relationships | 3 | 3 | 9 | Medium | All client data in CRM (not in agent's phone); handover workflow | Manager |
| RSK-B-004 | Commission dispute leading to legal action | 2 | 4 | 8 | Medium | Immutable records; clear commission policy; dispute resolution SLA | Finance Director |
| RSK-B-005 | Lead data quality degradation | 3 | 3 | 9 | Medium | Mandatory fields; duplicate detection; score decay for stale leads | Manager |
| RSK-B-006 | Competitor CRM offering superior features | 3 | 3 | 9 | Medium | Regular feature roadmap review; AI-differentiated features | MD |
| RSK-B-007 | Market downturn reducing transaction volume | 2 | 4 | 8 | Medium | Diversify revenue: increase management + leasing share | MD |

---

## Compliance / Regulatory Risks

| ID | Risk | Prob | Impact | Score | Level | Mitigation | Owner |
|----|------|------|--------|-------|-------|-----------|-------|
| RSK-C-001 | RERA audit finds non-compliant listings | 2 | 4 | 8 | Medium | Permit enforcement in CRM; compliance dashboard; monthly self-audit | Compliance |
| RSK-C-002 | AML failure — undetected suspicious transaction | 2 | 5 | 10 | High | Mandatory KYC; EDD for AED 55K+; SAR workflow; staff training | Compliance |
| RSK-C-003 | PDPL breach — unauthorised data sharing | 2 | 5 | 10 | High | Data residency UAE; access controls; consent tracking; 72h breach notification plan | Compliance |
| RSK-C-004 | Ejari non-compliance — lease without registration | 2 | 3 | 6 | Medium | System blocks lease activation without Ejari number | Compliance |
| RSK-C-005 | UAE PDPL regulatory change | 2 | 3 | 6 | Medium | Monitor UAEDP announcements; legal retainer on standby | Compliance |

---

## Risk Priority Matrix

```
         │ Catastrophic │   High    │  Medium   │   Low     │ Negligible
         │     (5)      │   (4)     │   (3)     │   (2)     │   (1)
─────────┼──────────────┼───────────┼───────────┼───────────┼───────────
Almost   │     25       │   20      │   15      │   10      │    5
Certain  │              │           │           │           │
(5)      │              │           │           │           │
─────────┼──────────────┼───────────┼───────────┼───────────┼───────────
Likely   │     20       │   16      │   12      │    8      │    4
(4)      │              │ RSK-T-006 │ RSK-B-002 │           │
         │              │           │ RSK-B-005 │           │
─────────┼──────────────┼───────────┼───────────┼───────────┼───────────
Possible │     15       │   12      │    9      │    6      │    3
(3)      │              │           │ RSK-T-004 │ RSK-T-005 │
         │              │           │ RSK-T-007 │ RSK-C-004 │
         │              │           │ RSK-B-003 │           │
         │              │           │ RSK-B-006 │           │
─────────┼──────────────┼───────────┼───────────┼───────────┼───────────
Unlikely │     10       │    8      │    6      │    4      │    2
(2)      │ RSK-T-001    │ RSK-T-002 │           │           │
         │ RSK-C-002    │ RSK-T-003 │           │           │
         │ RSK-C-003    │ RSK-T-008 │           │           │
         │              │ RSK-B-004 │           │           │
         │              │ RSK-C-001 │           │           │
         │              │ RSK-B-007 │           │           │
─────────┼──────────────┼───────────┼───────────┼───────────┼───────────
Rare     │      5       │    4      │    3      │    2      │    1
(1)      │ RSK-C-004    │ RSK-B-001 │           │           │
         │              │           │           │           │
```

---

## Risk Action Plan (Top 5 Risks)

### RSK-T-006: Developer Bus Factor
**Actions:**
- [ ] Complete this business_docs documentation set (done)
- [ ] Hire/contract second developer by Q2 2026
- [ ] Schedule monthly tech knowledge-sharing sessions
- [ ] Ensure all ADRs are documented in `docs/adr/`

### RSK-B-002: Agent Non-Adoption
**Actions:**
- [ ] Mandatory CRM training for all agents (tracked in HR)
- [ ] "CRM Champion" in each team — peer support
- [ ] Monthly usage report reviewed by manager
- [ ] Link commission approval to CRM activity compliance

### RSK-C-002 & RSK-C-003: AML + PDPL
**Actions:**
- [ ] Complete KYC workflow implementation (Phase D)
- [ ] Annual AML training for all agents (tracked compliance record)
- [ ] Data residency confirmed with cloud provider
- [ ] 72-hour breach notification procedure in incident-response.md

### RSK-T-001: Database Outage
**Actions:**
- [ ] Upgrade MongoDB Atlas to M20+ tier before Phase D launch
- [ ] Test restore procedure quarterly
- [ ] Confirm RTO/RPO targets in SLA

---

## Risk Review Schedule

| Review | When | Participants |
|--------|------|-------------|
| Full risk register review | Quarterly | MD, Compliance Officer, Dev Lead |
| New risk identification | Before each major release | Dev Lead + Product Owner |
| Incident-triggered review | After any P1 incident | All stakeholders |

---

**Document ID:** WC-RSK-001 | **Version:** 1.0 | **Date:** March 2026
