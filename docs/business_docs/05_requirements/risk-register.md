# Risk Register — White Caves CRM Platform

<!-- markdownlint-disable MD022 MD032 MD040 MD060 -->

**Status:** Active  
**Owner:** Risk + Compliance + Delivery Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-layer risk governance baseline mapped to requirement/control families

> **Document ID:** WC-RSK-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Review Frequency:** Quarterly

## Canonical governance links

- [`README.md`](./README.md)
- [`requirements-framework.md`](./requirements-framework.md)
- [`compliance-requirements.md`](./compliance-requirements.md)
- [`POLICY_CONTROL_INDEX_POL_SEED.md`](./POLICY_CONTROL_INDEX_POL_SEED.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../plans/waves/README.md`](../../plans/waves/README.md)

## Feed targets

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/plans/waves/WAVE_36_IMPLEMENTATION_BACKLOG.md`
- `docs/business_docs/13_testing/qa-checklist.md`
- `docs/business_docs/15_release_management/business-release-and-incident-communication-sop.md`

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

## Requirement and control crosswalk

| Control ID | Related requirement families | Primary evidence |
|-----------|------------------------------|------------------|
| RSK-C-001 | `REQ-COMP-001`, `REQ-COMP-002` | listing audit, permit report |
| RSK-C-002 | `REQ-COMP-003` | AML review log, SAR workflow |
| RSK-C-003 | `REQ-COMP-004` | consent record, access audit |
| RSK-B-002 | `REQ-LEAD-001`, `REQ-TP-003` | adoption dashboard, usage trend |
| RSK-T-003 | `REQ-WA-001`, `REQ-WA-002` | provider outage log, retry queue |

### Risk review evidence standard

- Each high or critical risk must link to at least one concrete requirement family.
- Mitigation actions must point to a reviewable artifact: dashboard, log, test, or policy record.
- Quarterly risk review outputs should be versioned alongside the active requirement baseline.

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

**Document ID:** WC-RSK-001 | **Version:** 1.1 | **Date:** June 2026

---

## Regulatory Compliance Risk Register (Extended)

### RSK-C-006: Data Breach — PDPL Violation

**Risk ID:** RSK-C-006  
**Risk Category:** Data Protection — UAE PDPL  
**Description:** A personal data breach (unauthorised access, disclosure, or loss of UAE residents' personal data) exposes White Caves to regulatory fines and reputational damage.

| Attribute | Value |
|-----------|-------|
| Probability | 2 (Unlikely) |
| Impact | 5 (Critical) |
| **Risk Score** | **10 (High)** |
| Regulatory Penalty | Up to AED 5,000,000 per breach (UAE Federal Law 45/2021 — PDPL Art. 10) |
| Detection Method | SIEM alerts; penetration test findings; user reports; abnormal API activity |
| Inherent Risk Rating | 🔴 Critical |
| Residual Risk Rating | 🟠 High (after controls) |

**Mitigation Controls:**
- AES-256 encryption for all data at rest; TLS 1.2+ for all data in transit
- Role-based access control (RBAC) — minimum privilege principle
- 72-hour breach notification procedure (COMP-PDPL-006)
- Quarterly penetration testing by accredited third party
- Staff data protection training (annual)
- Incident response plan with dedicated PDPL breach response playbook

**Action Plan:**
- [ ] Designate Data Protection Officer (DPO) role — by June 2026
- [ ] Complete data mapping exercise (personal data inventory) — by July 2026
- [ ] Penetration test scheduled — Q3 2026
- [ ] PDPL-compliant Data Processing Agreement (DPA) signed with all third-party processors

---

### RSK-C-007: Unlicensed Agent Conducting Transactions

**Risk ID:** RSK-C-007  
**Risk Category:** RERA Regulatory — Agent Licensing  
**Description:** An agent whose RERA BRN has expired or who has never obtained a BRN conducts property transactions, exposing White Caves to fines and transaction invalidity.

| Attribute | Value |
|-----------|-------|
| Probability | 2 (Unlikely — if BRN tracking controls are active) |
| Impact | 4 (High) |
| **Risk Score** | **8 (Medium)** |
| Regulatory Penalty | AED 50,000 fine + license suspension (RERA Law No. 16/2007 Art. 22) |
| Secondary Impact | Transaction may be declared void; commission clawback risk |

**Mitigation Controls:**
- CRM blocks lead assignment and listing creation for agents with `brnStatus ≠ "Active"`
- 30-day, 14-day, and 7-day BRN expiry alerts to agent + HR + Compliance
- Monthly compliance report: all agents with BRN expiring within 60 days
- Onboarding checklist requires BRN upload before agent account activation

**Action Plan:**
- [ ] Automated RERA Trakheesi API BRN validation — if API available (check Q3 2026)
- [ ] HR to confirm all current agent BRNs and expiry dates in system — immediate

---

### RSK-C-008: Ejari Non-Registration

**Risk ID:** RSK-C-008  
**Risk Category:** DLD Regulatory — Lease Registration  
**Description:** Leases are not registered in the Ejari system, rendering them legally unenforceable and exposing White Caves and the landlord to regulatory penalties.

| Attribute | Value |
|-----------|-------|
| Probability | 2 (Unlikely — if Ejari gate is enforced) |
| Impact | 3 (Moderate) |
| **Risk Score** | **6 (Medium)** |
| Regulatory Penalty | AED 100/day for unregistered lease (Dubai Decree 26/2013); lease unenforceable in RDC |
| Secondary Impact | Landlord cannot pursue eviction through RERA if lease not Ejari-registered |

**Mitigation Controls:**
- CRM hard blocks lease activation without `ejariContractNumber`
- 7-day post-signing alert if Ejari not registered
- Monthly Ejari coverage KPI (target: 100% of active leases)
- Leasing agent training on Ejari registration process

**Action Plan:**
- [ ] Ejari API integration for real-time registration status — target Q4 2026
- [ ] Weekly Ejari gap report delivered to Leasing Manager every Monday

---

### RSK-C-009: Trakheesi Advertising Violation

**Risk ID:** RSK-C-009  
**Risk Category:** RERA Regulatory — Advertising Compliance  
**Description:** Properties advertised on portals (PropertyFinder, Bayut) or social media without a valid Trakheesi permit, or with misleading information.

| Attribute | Value |
|-----------|-------|
| Probability | 2 (Unlikely — with permit gate active) |
| Impact | 4 (High) |
| **Risk Score** | **8 (Medium)** |
| Regulatory Penalty | AED 50,000 per listing without permit (RERA Circular 4/2021); AED 100,000+ for repeated violations |
| Secondary Impact | Portal suspension of White Caves account; RERA public warning |

**Mitigation Controls:**
- CRM blocks property status → "Available" without valid `permitNumber` and `permitExpiryDate`
- Portal syndication API blocks listings without permit (double validation)
- Nightly permit expiry job unpublishes expired listings automatically
- All property descriptions auto-checked against RERA Advertising Standards (no superlatives without evidence)

**Action Plan:**
- [ ] Trakheesi API integration for real-time permit validation — Q3 2026
- [ ] Monthly spot-check: compare live PropertyFinder listings vs CRM permit database

---

### RSK-C-010: SAR Filing Failure (Money Laundering)

**Risk ID:** RSK-C-010  
**Risk Category:** AML/CFT — Reporting Obligations  
**Description:** White Caves fails to file a Suspicious Activity Report (SAR) with the UAE FIU via goAML within the required timeframe, or at all.

| Attribute | Value |
|-----------|-------|
| Probability | 1 (Rare — with AML training and automated triggers) |
| Impact | 5 (Critical) |
| **Risk Score** | **5 (Medium)** |
| Regulatory Penalty | AED 50,000–1,000,000 fine + criminal prosecution of responsible officer (UAE AML Law 20/2018) |
| Secondary Impact | International reporting to FATF; reputational destruction; business license revocation |

**Mitigation Controls:**
- AML system flags high-risk transactions for Compliance Officer review within 24 hours
- SAR creation workflow in CRM with mandatory fields and goAML template
- "Tipping off" prevention: SAR in progress status hidden from involved agents
- MLRO (Money Laundering Reporting Officer) designated and trained
- Annual AML training for all staff; refresher upon major regulatory updates
- Quarterly AML compliance self-assessment

**Action Plan:**
- [ ] Designate MLRO with formal appointment letter — immediate
- [ ] goAML portal registration completed — Q3 2026
- [ ] AML training for all agents scheduled — Q3 2026

---

### RSK-C-011: DLD Oqood Non-Registration (Off-Plan)

**Risk ID:** RSK-C-011  
**Risk Category:** DLD Regulatory — Off-Plan Sales  
**Description:** Off-plan unit sales are not registered with DLD via the Oqood system within the required timeframe.

| Attribute | Value |
|-----------|-------|
| Probability | 2 (Unlikely — with Oqood gate active) |
| Impact | 5 (Critical) |
| **Risk Score** | **10 (High)** |
| Regulatory Penalty | AED 50,000–500,000 per unregistered unit (Dubai Law No. 13/2008) |
| Secondary Impact | Title deed cannot be issued; buyer can rescind contract; criminal liability for developer/broker |

**Mitigation Controls:**
- CRM blocks SPA execution for off-plan units without Oqood registration
- Developer RERA license validation before any off-plan unit is listed
- Oqood registration deadline tracked (within 30 days of SPA — per DLD policy)
- Off-plan transaction checklist includes Oqood certificate upload as mandatory item

**Action Plan:**
- [ ] DLD Oqood API integration for automated registration status — Q4 2026
- [ ] Off-plan developer onboarding checklist review — Q3 2026

---

### RSK-C-012: PDPL Cross-Border Data Transfer Violation

**Risk ID:** RSK-C-012  
**Risk Category:** Data Protection — Cross-Border Transfers  
**Description:** Personal data of UAE residents is transferred to systems in countries not approved by UAE TDRA, without Standard Contractual Clauses (SCCs) in place.

| Attribute | Value |
|-----------|-------|
| Probability | 3 (Possible — common with SaaS third-party tools) |
| Impact | 4 (High) |
| **Risk Score** | **12 (High)** |
| Regulatory Penalty | Up to AED 5,000,000 + business suspension (UAE PDPL Art. 22-23) |
| Secondary Impact | TDRA investigation; requirement to delete all illegally transferred data; reputational harm |

**Mitigation Controls:**
- Integration Registry with data residency country documented for all third-party services
- PDPL transfer compliance badge on integration admin screen
- Standard Contractual Clauses (SCC) signed with non-approved-country processors before go-live
- Annual review of all integrations for data residency status
- Legal review of new SaaS vendors before onboarding

**Action Plan:**
- [ ] Complete Integration Registry with residency mapping — Q3 2026
- [ ] Legal team to review all current integrations for PDPL cross-border compliance — Q3 2026
- [ ] Data Processing Agreements (DPAs) signed with: Resend, SendGrid, Twilio, MongoDB Atlas, OpenAI — Q3 2026

---

## Updated Risk Priority Matrix

| Risk Score | Level | Count (Current Register) | Required Response |
|:----------:|-------|:------------------------:|-------------------|
| 15–25 | 🔴 Critical | 0 | Immediate executive action; work stoppage if needed |
| 10–14 | 🟠 High | 4 (RSK-T-001, RSK-C-006, RSK-C-011, RSK-C-012) | Action plan within 2 weeks; C-suite owner |
| 5–9 | 🟡 Medium | 8 (RSK-T-002, RSK-C-001–005, RSK-C-007–010) | Action plan within 1 month; departmental owner |
| 1–4 | 🟢 Low | 1 (RSK-T-003) | Monitor quarterly; team lead owner |

---

## Mitigation Status Tracker

| Risk ID | Risk Name | Owner | Status | Target Date | RAG |
|---------|-----------|-------|--------|-------------|-----|
| RSK-T-001 | Performance Degradation | @Ruchi (Engineering) | 🔄 In Progress | Q3 2026 | 🟡 |
| RSK-T-002 | Third-Party API Failure | @Mira (CTO) | 🔄 In Progress | Q3 2026 | 🟡 |
| RSK-T-003 | Data Loss | @Barbara (DB Lead) | ✅ Controls Active | Q3 2026 | 🟢 |
| RSK-C-001 | RERA BRN Expiry | Compliance Officer | ✅ Controls Active | Monthly | 🟢 |
| RSK-C-002 | AML SAR Failure | MLRO | 🔴 Action Required | Q3 2026 | 🔴 |
| RSK-C-003 | Ejari Non-Registration | Leasing Manager | 🔄 In Progress | Q3 2026 | 🟡 |
| RSK-C-004 | Commission Dispute | Finance Director | ✅ Controls Active | Ongoing | 🟢 |
| RSK-C-005 | Data Privacy Breach | DPO | 🔴 Action Required | Q3 2026 | 🔴 |
| RSK-C-006 | PDPL Data Breach | DPO | 🔴 Action Required | Q3 2026 | 🔴 |
| RSK-C-007 | Unlicensed Agent | HR + Compliance | ✅ Controls Active | Monthly | 🟢 |
| RSK-C-008 | Ejari Non-Registration | Leasing Manager | 🔄 In Progress | Q3 2026 | 🟡 |
| RSK-C-009 | Trakheesi Violation | Compliance Officer | ✅ Controls Active | Monthly | 🟢 |
| RSK-C-010 | SAR Filing Failure | MLRO | 🔴 Action Required | Q3 2026 | 🔴 |
| RSK-C-011 | DLD Oqood Non-Reg | Off-Plan Lead | 🔄 In Progress | Q4 2026 | 🟡 |
| RSK-C-012 | PDPL Cross-Border | DPO | 🔴 Action Required | Q3 2026 | 🔴 |

---

**Document ID:** WC-RSK-001 | **Version:** 1.1 | **Date:** June 2026  
**Change Log:** v1.0 — Initial register RSK-T-001 to RSK-C-005 (March 2026); v1.1 — Added RSK-C-006 to RSK-C-012, updated priority matrix, added mitigation status tracker (June 2026)
