# Stakeholder Register — White Caves CRM Platform

> **Document ID:** WC-STK-001  
> **Version:** 1.0  
> **Date:** March 2026

---

## Purpose
Identifies all stakeholders in the White Caves CRM Platform: who they are, what they need from the system, how they are involved, and how to communicate with them.

---

## Internal Stakeholders

| ID | Stakeholder | Role | Interest in System | Influence | Priority |
|----|-------------|------|-------------------|-----------|---------|
| STK-001 | Managing Director | Owner / Sponsor | Full business visibility; ROI; compliance | High | Critical |
| STK-002 | Sales Manager | Feature user | Pipeline management; team performance; commissions | High | High |
| STK-003 | Sales Agents (team) | Primary users | Lead capture; pipeline; activity logging | Medium | Critical |
| STK-004 | Leasing Manager | Feature user | Lease management; Ejari; renewals | Medium | High |
| STK-005 | Leasing Agents | Primary users | Tenant applications; contracts; maintenance | Medium | High |
| STK-006 | Finance Director | Feature user | Commission approval; P&L; reporting | High | High |
| STK-007 | Compliance Officer | Feature user | KYC/AML; RERA compliance; audit logs | High | Critical |
| STK-008 | HR Manager | Occasional user | Agent profiles; credentials; onboarding | Low | Medium |
| STK-009 | Marketing Manager | Occasional user | Campaign analytics; lead sources | Medium | Medium |
| STK-010 | IT / Lead Developer | System builder | Technical architecture; performance | High | Critical |
| STK-011 | Operations Manager | Power user | System configuration; reports | Medium | Medium |

## External Stakeholders

| ID | Stakeholder | Type | Interest | Communication |
|----|-------------|------|---------|--------------|
| STK-020 | Buyers / Clients | End user (limited portal) | Property listings; document signing | WhatsApp, email, portal |
| STK-021 | Tenants | End user (limited portal) | Lease status; payment schedule | WhatsApp, email, portal |
| STK-022 | Landlords | End user (limited portal) | Property + revenue reports | Monthly email report, portal |
| STK-023 | RERA (Regulator) | Regulatory | RERA compliance; permit verification | Annual audit; RERA portal |
| STK-024 | DLD (Regulator) | Regulatory | Transaction records; title deeds | Per transaction |
| STK-025 | UAE FIU (AML) | Regulatory | SAR filings; AML records | On SAR submission via goAML |
| STK-026 | Developer Partners (DAMAC, Emaar, etc.) | Business partner | Property inventory data; deal tracking | Partner portal/email |
| STK-027 | MongoDB Atlas | Infrastructure | SLA; data residency | Support tickets |
| STK-028 | Meta (WhatsApp) | Technology partner | WABA compliance; API access | Developer portal |
| STK-029 | Vercel | Infrastructure | Frontend hosting | Support tickets |
| STK-030 | PropertyFinder | Portal partner | Listing syndication | Partner account manager |
| STK-031 | Bayut | Portal partner | Listing syndication | Partner account manager |

---

## Stakeholder Communication Plan

| Stakeholder | Method | Frequency | Content |
|-------------|--------|-----------|---------|
| Managing Director (STK-001) | Executive dashboard + weekly email | Daily view; weekly summary | KPIs, deals, revenue, issues |
| Sales Manager (STK-002) | CRM system + daily Slack | Real-time | Pipeline, team activity, approvals |
| Sales Agents (STK-003) | CRM system + WhatsApp | Real-time | Lead assignments, reminders, commissions |
| Finance Director (STK-006) | Finance dashboard + monthly report | Daily view; monthly | Commissions, P&L, forecasts |
| Compliance Officer (STK-007) | Compliance dashboard | Weekly + on trigger | KYC queue, RERA issues, AML alerts |
| Tenants / Landlords | Email + portal | Monthly | Lease status, payment, maintenance |
| All staff | WhatsApp group | On release | System updates, new features |

---

## Stakeholder Requirements Summary

| Stakeholder | Top 3 Requirements |
|-------------|-------------------|
| Managing Director | 1. Real-time business KPIs 2. Compliance confidence 3. Revenue visibility |
| Sales Manager | 1. Full team pipeline view 2. One-click commission approval 3. Agent performance |
| Sales Agents | 1. Fast lead capture 2. Easy WhatsApp integration 3. Activity logging |
| Finance Director | 1. Accurate commission tracking 2. Financial reports 3. Payment processing |
| Compliance Officer | 1. KYC review workflow 2. RERA audit readiness 3. AML alert management |
| Landlords | 1. Monthly revenue report 2. Tenant status 3. Maintenance updates |
| Tenants | 1. Lease document access 2. Payment schedule 3. Maintenance request |

---

## Power / Interest Grid

> Maps each stakeholder by **Power** (ability to influence project decisions) and **Interest** (degree of concern about project outcomes). Use this to prioritise engagement strategy.

```
HIGH POWER
    │
    │  [KEEP SATISFIED]          [MANAGE CLOSELY]
    │  STK-023 RERA              STK-001 MD/Owner
    │  STK-024 DLD               STK-010 IT Lead Dev
    │  STK-025 UAE FIU           STK-006 Finance Director
    │  STK-027 MongoDB Atlas     STK-007 Compliance Officer
    │  STK-028 Meta (WhatsApp)   STK-002 Sales Manager
    │                            STK-004 Leasing Manager
    │                            STK-029 Vercel (hosting)
    │────────────────────────────────────────────────────────→ HIGH INTEREST
    │
    │  [MONITOR]                 [KEEP INFORMED]
    │  STK-032 CBUAE (AML)       STK-003 Sales Agents
    │  STK-033 UAE TDRA (PDPL)   STK-005 Leasing Agents
    │  STK-034 UAE FTA (VAT)     STK-021 Tenants
    │  STK-008 HR Manager        STK-022 Landlords
    │  STK-009 Marketing Mgr     STK-020 Buyers/Clients
    │                            STK-026 Developer Partners
    │                            STK-030 PropertyFinder
    │                            STK-031 Bayut
LOW POWER
```

### Engagement Strategy by Quadrant

| Quadrant | Strategy | Action |
|----------|----------|--------|
| **Manage Closely** (High Power, High Interest) | Deep engagement, frequent updates, involve in key decisions | Weekly sync, dashboard access, direct escalation path |
| **Keep Satisfied** (High Power, Low Interest) | Meet their requirements without burdening them | Compliance reports, on-demand regulatory submissions |
| **Keep Informed** (Low Power, High Interest) | Regular updates, self-service portals | Monthly reports, portal access, WhatsApp notifications |
| **Monitor** (Low Power, Low Interest) | Minimal engagement; monitor for changes | Quarterly compliance checks, automated regulatory reporting |

---

## Expanded Internal Stakeholder Register

| ID | Stakeholder | Role | Interest in System | Power | Interest | Engagement | Priority |
|----|-------------|------|--------------------|-------|----------|------------|---------|
| STK-001 | Managing Director | Owner / Sponsor | Full business visibility; ROI; RERA compliance | High | High | Daily dashboard; weekly exec summary | Critical |
| STK-002 | Sales Manager | Feature user | Pipeline management; team performance; commissions | High | High | Real-time CRM; daily Slack | High |
| STK-003 | Sales Agents (team) | Primary users | Lead capture; pipeline; activity logging | Medium | High | CRM + WhatsApp; real-time | Critical |
| STK-004 | Leasing Manager | Feature user | Lease management; Ejari; renewals | Medium | High | CRM; weekly report | High |
| STK-005 | Leasing Agents | Primary users | Tenant applications; contracts; maintenance | Medium | High | CRM + WhatsApp; daily | High |
| STK-006 | Finance Director | Feature user | Commission approval; P&L; reporting | High | High | Finance dashboard; monthly P&L | High |
| STK-007 | Compliance Officer | Feature user | KYC/AML; RERA compliance; audit logs | High | High | Compliance dashboard; alert-driven | Critical |
| STK-008 | HR Manager | Occasional user | Agent profiles; credentials; onboarding | Low | Medium | Monthly HR report | Medium |
| STK-009 | Marketing Manager | Occasional user | Campaign analytics; lead sources | Medium | Medium | Weekly analytics; portal | Medium |
| STK-010 | IT / Lead Developer | System builder | Technical architecture; performance; uptime | High | High | Real-time monitoring; Slack | Critical |
| STK-011 | Operations Manager | Power user | System configuration; reports; inventory | Medium | Medium | Weekly ops report; CRM access | Medium |

---

## Expanded External Stakeholder Register

| ID | Stakeholder | Type | Interest | Communication | Priority |
|----|-------------|------|---------|--------------|---------|
| STK-020 | Buyers / Clients | End user (portal) | Property listings; document signing | WhatsApp, email, portal | High |
| STK-021 | Tenants | End user (portal) | Lease status; payment schedule; maintenance | WhatsApp, email, portal | High |
| STK-022 | Landlords | End user (portal) | Property + revenue reports; tenant status | Monthly email report, portal | High |
| STK-023 | RERA (Regulator) | Regulatory — Manage Closely | RERA compliance; permit verification; BRN management | Annual audit; RERA portal submissions; on-demand | Critical |
| STK-024 | DLD (Regulator) | Regulatory — Manage Closely | Transaction records; title deeds; Oqood/Ejari | Per transaction via DLD APIs | Critical |
| STK-025 | UAE FIU (AML) | Regulatory — Manage Closely | SAR filings; AML records; CDD compliance | On SAR submission via goAML portal | Critical |
| STK-026 | Developer Partners (DAMAC, Emaar, etc.) | Business partner | Property inventory data; off-plan deal tracking; commissions | Partner portal/email; monthly meeting | High |
| STK-027 | MongoDB Atlas | Infrastructure | SLA; data residency; UAE data hosting | Support tickets; SLA monitoring | High |
| STK-028 | Meta (WhatsApp) | Technology partner | WABA compliance; API access; template approvals | Developer portal; Meta Business Manager | High |
| STK-029 | Vercel | Infrastructure | Frontend hosting; deployment pipeline | Support tickets; status.vercel.com | High |
| STK-030 | PropertyFinder | Portal partner | Listing syndication; lead generation | Partner account manager; monthly review | Medium |
| STK-031 | Bayut | Portal partner | Listing syndication; lead generation | Partner account manager; monthly review | Medium |
| STK-032 | CBUAE (Central Bank UAE) | Regulatory — Monitor | AML/CFT program compliance; financial activity reporting | Annual AML policy submission; on SAR | High |
| STK-033 | UAE TDRA (Data Authority) | Regulatory — Monitor | UAE PDPL compliance; data breach notification | Breach notification within 72h; annual review | Medium |
| STK-034 | UAE FTA (Federal Tax Authority) | Regulatory — Monitor | VAT registration; quarterly returns; compliance | Quarterly VAT return via EmaraTax portal | High |
| STK-035 | Dubai Courts / RDC | Regulatory — Monitor | RERA Dispute Resolution; court orders | On dispute filing; RDC case management | Low |
| STK-036 | Dubizzle / Houza | Portal partner | Listing syndication | Partner portal; automated sync | Medium |

---

## RERA / DLD Regulatory Stakeholder Deep Dive

### STK-023 — Real Estate Regulatory Agency (RERA)

| Attribute | Details |
|-----------|---------|
| **Authority** | RERA — Real Estate Regulatory Agency (under DLD) |
| **Primary Legal Basis** | Dubai Law No. 85 of 2006 (Brokers); Dubai Law No. 26 of 2007 (Tenancy); Dubai Law No. 8 of 2007 (Escrow) |
| **Key Obligations on White Caves** | Maintain valid ORN; ensure all agents have BRN; submit RERA Form A before listing; RERA Form B before sale; Ejari for all leases; RERA rental index compliance |
| **Key Reporting to RERA** | Annual broker license renewal; agent BRN updates; Ejari registration per tenancy; RERA Form 7 (rent increase notice); RERA Form 12 (eviction notice) |
| **Consequence of Non-Compliance** | Fines: AED 50,000–200,000 per violation; license suspension; agent BRN revocation; potential criminal prosecution |
| **Communication Channel** | RERA portal (rera.gov.ae); DLD eServices; direct contact: compliance@rera.gov.ae |
| **Frequency** | Continuous (Ejari per lease) + Annual (license renewal) |
| **CRM Integration** | System submits Ejari via DLD API; tracks RERA form status; alerts Compliance Officer 60 days before ORN expiry |

### STK-024 — Dubai Land Department (DLD)

| Attribute | Details |
|-----------|---------|
| **Authority** | DLD — Dubai Land Department |
| **Primary Legal Basis** | Dubai Law No. 7 of 2006 (Property Ownership); Dubai Law No. 13 of 2008 (Interim Real Property); Dubai Law No. 14 of 2008 (Escrow Accounts) |
| **Key Obligations on White Caves** | Register all sales transactions; submit Oqood for off-plan; facilitate title deed transfers; pay DLD transfer fee (4% of sale price) |
| **Key Reporting to DLD** | Oqood off-plan registration (per off-plan sale); title deed transfer (per resale); Ejari tenancy registration; NOC from developer before transfer |
| **Consequence of Non-Compliance** | Invalid title deed transfer; legal ownership disputes; fines; transaction reversal |
| **Communication Channel** | DLD REST API (for Oqood, Ejari); DLD eServices portal; Dubai REST app |
| **Fee Schedule** | Transfer fee: 4% of sale price; DLD admin: AED 580; trustee fee: AED 4,000–10,000 depending on property value |
| **CRM Integration** | System calls DLD API for: property ownership verification, Oqood registration, title deed status lookup, Ejari submission |

### STK-025 — UAE Financial Intelligence Unit (UAE FIU)

| Attribute | Details |
|-----------|---------|
| **Authority** | UAE FIU — under Ministry of Economy |
| **Primary Legal Basis** | UAE AML Law — Federal Decree-Law No. 20 of 2019; CBUAE AML/CFT Standards; FATF Recommendations |
| **Key Obligations on White Caves** | KYC/CDD for all clients; Enhanced Due Diligence (EDD) for PEPs, high-risk nationalities, cash transactions > AED 55,000; SAR filing on suspicion |
| **Reporting Mechanism** | goAML portal (goaml.uae.gov.ae) — mandatory for all real estate brokers |
| **Key Filing** | Suspicious Activity Report (SAR): filed within 2 business days of suspicion; Threshold Report: cash/wire transactions above AED 55,000 per Ministerial Resolution No. 45 of 2022 |
| **Consequence of Non-Compliance** | Fines: AED 10,000–1,000,000; criminal prosecution; company license revocation |
| **CRM Integration** | KYC workflow in Compliance module; automatic PEP screening via third-party API; SAR draft auto-generated on risk flag; goAML submission tracked |

### STK-034 — UAE Federal Tax Authority (FTA)

| Attribute | Details |
|-----------|---------|
| **Authority** | FTA — Federal Tax Authority |
| **Applicable Tax** | Value Added Tax (VAT) — 5% on commercial real estate services; residential lease rentals are exempt |
| **VAT Registration** | Mandatory if taxable supplies > AED 375,000/year (mandatory threshold); White Caves is registered |
| **Reporting Obligation** | Quarterly VAT return via EmaraTax portal; Tax Registration Number (TRN) on all invoices |
| **Key VAT Rules** | Sales brokerage commission: 5% VAT applicable; property management fee: 5% VAT; residential rent: exempt; commercial rent: 5% VAT |
| **Consequence of Non-Compliance** | Late filing penalty: AED 1,000 (first time), AED 2,000 (repeat); incorrect return: up to 50% of difference |
| **CRM Integration** | Theodora Finance automatically applies correct VAT rate based on transaction type; invoice PDF includes TRN; VAT summary report generated quarterly |

---

## Communication Frequency Matrix

| Stakeholder | Channel | Frequency | Content | Owner |
|-------------|---------|-----------|---------|-------|
| STK-001 MD | Executive dashboard + weekly email digest | Daily (dashboard) + weekly (email) | Revenue KPIs, pipeline value, RERA status, open risks | Zoe AI + IT |
| STK-002 Sales Manager | CRM + daily Slack summary | Real-time (CRM) + daily (Slack 5pm) | Pipeline, agent activity, leads, conversions | Clara AI |
| STK-003 Sales Agents | CRM + WhatsApp | Real-time (24/7) | Lead assignments, reminders, commissions, activity | Clara / Nadia AI |
| STK-004 Leasing Manager | CRM + weekly report | Real-time (CRM) + weekly (Friday) | Lease renewals, Ejari queue, maintenance SLA | Daisy AI |
| STK-005 Leasing Agents | CRM + WhatsApp | Real-time | Tenant applications, maintenance, rent alerts | Daisy / Nadia AI |
| STK-006 Finance Director | Finance dashboard + monthly P&L | Daily (dashboard) + monthly (1st of month) | Revenue, commissions, VAT, P&L, forecasts | Theodora AI |
| STK-007 Compliance Officer | Compliance dashboard + alert triggers | Real-time alerts + weekly summary | KYC queue, RERA issues, AML flags, audit trail | Laila AI |
| STK-008 HR Manager | HR dashboard + monthly report | Monthly | Agent profiles, onboarding, BRN status, leave | Nancy AI |
| STK-009 Marketing Manager | Analytics + campaign reports | Weekly | CPL, campaign ROI, lead source analysis | Olivia AI |
| STK-010 IT/Dev | Monitoring dashboard + Slack | Real-time + on-incident | Uptime, errors, deployment status | Aurora AI |
| STK-020 Buyers | Portal + WhatsApp | On-demand (buyer-initiated) + listing alerts | New listings, viewing confirmations, offer status | Nina bot / Nadia |
| STK-021 Tenants | Tenant portal + email + WhatsApp | Monthly (statement) + event-triggered | Lease statement, rent reminders, maintenance updates | Daisy AI |
| STK-022 Landlords | Landlord portal + monthly email | Monthly (report) + event-triggered | Rent received, tenancy status, maintenance invoices | Daisy AI |
| STK-023 RERA | RERA portal submissions + email | Annual (license) + per transaction (Ejari/Forms) | BRN renewals, Ejari filings, Form A/B, audit responses | Compliance Officer |
| STK-024 DLD | DLD API + eServices portal | Per transaction | Oqood registration, title deed transfers, Ejari | Compliance Officer + Legal |
| STK-025 UAE FIU | goAML portal | On SAR trigger + threshold reports | SAR filings, CDD records, transaction reports | Compliance Officer |
| STK-026 Developers | Partner portal + email + monthly meeting | Monthly meeting + deal-triggered | Off-plan inventory, commission payments, deal status | Sales Manager |
| STK-030/031/036 Portals | API sync + account manager | Daily (auto-sync) + monthly (review) | Listing updates, lead source data, performance | Marketing Manager |

---

## Escalation Paths by Stakeholder Type

### Internal Escalation

```
Level 1: Individual Agent / Specialist
  ↓ (unresolved in 4h)
Level 2: Department Manager / Head
  ↓ (unresolved in 1 business day)
Level 3: Managing Director / Owner
  ↓ (regulatory / legal trigger)
Level 4: External Legal Counsel / RERA / DLD
```

### Escalation by Issue Type

| Issue Type | Initial Contact | Escalation Path | SLA to Resolve |
|------------|----------------|-----------------|---------------|
| **Lead dispute** (ownership conflict) | Sales Manager | MD | 2 business days |
| **Commission dispute** | Finance Director | MD → Legal (if > AED 50K) | 5 business days |
| **Tenant complaint** | Leasing Agent | Leasing Manager → Operations Manager → MD | 3 business days |
| **Landlord complaint** | Leasing Manager | Operations Manager → MD | 2 business days |
| **RERA compliance query** | Compliance Officer | Legal → MD | 24 hours |
| **RERA/DLD audit notice** | Compliance Officer | Legal → MD → External counsel | 48 hours (initial response) |
| **AML/SAR trigger** | Compliance Officer | MD (mandatory notification) → UAE FIU | 2 business days for SAR filing |
| **System downtime (S1)** | IT Lead Developer | CTO (Aurora) → MD (if > 2h) | 4 hours resolution |
| **Data breach / security incident** | IT Lead Developer | MD + Compliance → UAE TDRA notification within 72h | 72 hours |
| **Partner portal failure (PropertyFinder/Bayut)** | Marketing Manager | IT Lead → Partner account manager | 1 business day |
| **VAT/FTA query** | Finance Director | External tax advisor → MD | 5 business days |
| **Buyer / tenant legal dispute** | Legal Specialist | MD → External legal counsel → RERA RDC (if property) | 5–30 days (RDC timelines) |

---

**Document ID:** WC-STK-001 | **Version:** 2.0 | **Date:** June 2026
