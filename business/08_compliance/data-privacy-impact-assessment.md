# Data Privacy Impact Assessment (DPIA)
# White Caves Real Estate Platform

> **Document ID:** WC-DPIA-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active — Annual Review Required
> **Owner:** Compliance Department (Laila) + Technology (Radia)
> **Legal Basis:** UAE PDPL Federal Decree-Law No. 45 of 2021
> **Classification:** Confidential — Regulatory Document

---

## 1. Introduction

### 1.1 Purpose

This Data Privacy Impact Assessment (DPIA) identifies and mitigates privacy risks for the White Caves Real Estate CRM Platform. It is required under the UAE Personal Data Protection Law (PDPL) for processing operations that are likely to result in a high risk to the rights and freedoms of natural persons.

### 1.2 Scope

All personal data processing activities conducted by White Caves Real Estate LLC through its CRM platform, public website, Landlord Portal, Tenant Portal, and AI Assistant Hub.

### 1.3 Data Controller

| Field | Details |
|-------|---------|
| Controller | White Caves Real Estate LLC |
| RERA License | [License Number] |
| TRN | [Tax Registration Number] |
| Data Protection Contact | compliance@whitecaves.ae |
| Address | Dubai, UAE |

---

## 2. Processing Activities Register

### 2.1 Activity A: Property Buyer/Seller Lead Capture

| Field | Detail |
|-------|--------|
| Purpose | Respond to property enquiries; match buyers with properties |
| Legal basis | Consent (website form); Contract (client relationship) |
| Data categories | Name, email, phone, nationality, budget, property preferences |
| Special categories | None |
| Data subjects | Prospective buyers, sellers, investors |
| Retention | 3 years (no transaction); 7 years (transaction completed) |
| Recipients | Assigned agent, manager, AI assistant (anonymised) |
| Cross-border transfers | None — UAE data residency (MongoDB Atlas UAE) |
| Risk level | **LOW** |

---

### 2.2 Activity B: Client KYC/AML Processing

| Field | Detail |
|-------|--------|
| Purpose | Legal obligation: UAE AML Law compliance; identity verification |
| Legal basis | Legal obligation (UAE AML Law No. 20 of 2018, RERA) |
| Data categories | Passport copy, visa, Emirates ID, financial statements, source of funds |
| Special categories | Biometric data in passport photo (processed but not analysed) |
| Data subjects | All clients in property transactions > AED 55,000 |
| Retention | 5 years minimum (UAE AML Law requirement) |
| Recipients | Compliance officer, MD, UAE FIU (if SAR filed) |
| Cross-border transfers | None — UAE residency |
| Risk level | **HIGH** — sensitive identity + financial data |

**High Risk Mitigation Measures:**
- Encrypted storage (AES-256 at rest, TLS 1.3 in transit)
- Role-based access: Compliance officer + MD only
- Immutable audit log for every access
- Documents not indexed for search (direct access only)
- Auto-deletion after retention period expires

---

### 2.3 Activity C: Tenant Rent Payment Processing

| Field | Detail |
|-------|--------|
| Purpose | Facilitate online rent payment; maintain payment records |
| Legal basis | Contract (lease agreement) |
| Data categories | Name, bank details (tokenised via Stripe), payment history |
| Special categories | Financial data |
| Data subjects | All tenants using online payment |
| Retention | 7 years (financial records — UAE Commercial Law) |
| Recipients | White Caves finance team, Stripe (payment processor) |
| Cross-border transfers | Stripe (US) — Standard Contractual Clauses applied |
| Risk level | **MEDIUM** — financial data; Stripe is PCI-DSS compliant |

---

### 2.4 Activity D: WhatsApp Communication Processing

| Field | Detail |
|-------|--------|
| Purpose | CRM communication; lead capture; bot-assisted qualification |
| Legal basis | Consent (user initiated contact); Contract (existing clients) |
| Data categories | Phone number, message content, contact name, conversation history |
| Special categories | None |
| Data subjects | All WhatsApp users who message White Caves |
| Retention | 3 years (leads); 7 years (clients in transaction) |
| Recipients | Assigned agent, WhatsApp bot (automated processing), Meta |
| Cross-border transfers | Meta/WhatsApp (US) — SCCs; message content processed by Meta |
| Risk level | **MEDIUM** — consent required; Meta processes data in US |

---

### 2.5 Activity E: Firebase OAuth Authentication

| Field | Detail |
|-------|--------|
| Purpose | User authentication via Google OAuth |
| Legal basis | Consent (user chooses Google login) |
| Data categories | Email, display name, Google UID, profile photo |
| Special categories | None |
| Data subjects | Staff and portal users who choose Google SSO |
| Retention | Duration of employment / active portal account |
| Recipients | Firebase (Google) — processes for authentication only |
| Cross-border transfers | Firebase (US/global) — Google Cloud Standard Contractual Clauses |
| Risk level | **LOW** — Google Cloud GDPR/PDPL compliant |

---

### 2.6 Activity F: Staff HR Records

| Field | Detail |
|-------|--------|
| Purpose | Employment records, RERA compliance, payroll |
| Legal basis | Contract (employment contract) |
| Data categories | Name, passport, visa, Emirates ID, salary, performance records |
| Special categories | None |
| Data subjects | All White Caves employees and contractors |
| Retention | Duration of employment + 2 years |
| Recipients | MD, HR manager, RERA (for agent license verification) |
| Cross-border transfers | None |
| Risk level | **LOW** — standard HR processing |

---

## 3. Risk Assessment

| Risk | Likelihood | Impact | Rating | Mitigation |
|------|-----------|--------|--------|-----------|
| Unauthorised access to KYC documents | Low | High | **HIGH** | Strict RBAC, encrypted storage, audit logs |
| Data breach via MongoDB Atlas | Low | High | **HIGH** | Atlas encryption, VPC, IP whitelist |
| Phishing attack on agent account | Medium | High | **HIGH** | 2FA (Phase 9), security training |
| Third-party data leak (Stripe, Meta, Firebase) | Low | Medium | **MEDIUM** | SCCs, DPA agreements signed |
| Excessive data collection beyond purpose | Low | Medium | **MEDIUM** | Data minimisation review quarterly |
| Retention period exceeded | Medium | Medium | **MEDIUM** | Automated deletion cron (Phase 2) |
| Subject access request not fulfilled in time | Low | Medium | **MEDIUM** | 30-day SLA tracking in CRM |
| WhatsApp messages accessed by unauthorised staff | Medium | Medium | **MEDIUM** | Role-based WhatsApp inbox (Phase 4) |
| npm vulnerability exploited | Medium | High | **HIGH** | 0 vulnerabilities policy (Phase 2) |

---

## 4. Mitigation Measures Register

| Measure | Description | Status | Owner |
|---------|------------|--------|-------|
| Encryption at rest | MongoDB Atlas AES-256 | ✅ Active | Tech (Radia) |
| Encryption in transit | TLS 1.3 on all connections | ✅ Active | Tech (Radia) |
| RBAC enforcement | 29 roles, JWT middleware | ✅ Active | Tech (Daniela) |
| Audit logging | All data access logged (Activity model) | ✅ Active | Tech (Aurora) |
| UAE data residency | MongoDB Atlas UAE region | ✅ Active | Tech (Lisa) |
| Privacy policy published | Clear consent language on website | ⏳ Phase 2 | Compliance (Laila) |
| Cookie consent banner | Granular consent before tracking | ⏳ Phase 2 | Tech (Lea) |
| Data retention automation | Auto-delete expired records | ⏳ Phase 2 | Tech + Compliance |
| Staff PDPL training | Annual privacy training programme | ⏳ Phase 5 | HR + Compliance |
| 2FA for all staff | TOTP mandatory | ⏳ Phase 9 | Tech (Daniela) |
| DPA with Stripe | Data Processing Agreement signed | ⏳ Phase 2 | Compliance (Laila) |
| DPA with Meta | WhatsApp Business Data Processing | ⏳ Phase 4 | Compliance (Laila) |
| Subject rights procedure | Documented + accessible | ✅ Documented | Compliance (Laila) |
| npm vulnerability patches | 0-vulnerability target | ⚠️ 7 pending | Tech (Ecem) |
| Security penetration test | Annual external pentest | ⏳ Phase 5 | Tech (Ecem) |

---

## 5. Data Subject Rights Implementation

| Right | Process | Response Time | Status |
|-------|---------|--------------|--------|
| Access (SAR) | Email to privacy@whitecaves.ae | 30 days | ✅ Procedure documented |
| Correction | CRM update by agent + log | Immediate | ✅ Available |
| Erasure | Compliance review → anonymisation | 30 days | ✅ Procedure documented |
| Portability | JSON export generated | 30 days | ✅ Procedure documented |
| Restriction | Processing halted pending review | Immediate | ⏳ Phase 2 (system control) |
| Objection | Compliance officer review | 30 days | ✅ Via email |

---

## 6. Third-Party Processors

| Processor | Service | Location | DPA Status | PDPL Basis |
|----------|---------|----------|-----------|-----------|
| MongoDB Atlas | Database hosting | UAE (primary) + US (backup) | ✅ DPA in place | Data residency compliant |
| Google Firebase | Authentication | US (GCP) | ✅ DPA in place | SCCs apply |
| Stripe | Payment processing | US | ⏳ DPA needed Phase 2 | SCCs apply |
| Meta / WhatsApp | Messaging | US | ⏳ DPA needed Phase 4 | SCCs apply |
| SendGrid (Twilio) | Email delivery | US | ⏳ DPA needed Phase 2 | SCCs apply |
| Vercel | Hosting (frontend) | Global | ✅ DPA available | SCCs apply |
| Railway/Render | Hosting (API) | US | ⏳ DPA needed Phase 2 | SCCs apply |

---

## 7. DPIA Conclusions

**Overall Privacy Risk:** MEDIUM (manageable with implemented controls)

**Key findings:**
1. UAE data residency maintained for all primary data storage ✅
2. KYC/AML data has highest risk — strict access controls in place ✅
3. US-based third parties (Meta, Stripe, Firebase) require SCCs — action in Phase 2/4 ⚠️
4. 2FA gap: credential compromise is the highest risk until Phase 9 ⚠️
5. Cookie consent and privacy policy needed before public traffic (Phase 2) ⚠️

**Recommendation:** This DPIA is sufficient for current pre-launch operations. Refresh required before Phase 4 (WhatsApp) and Phase 8 (portal syndication) when new high-risk processing begins.

---

## 8. DPIA Review Schedule

| Trigger | Action |
|---------|--------|
| Annually | Full DPIA review |
| Before Phase 4 (WhatsApp) | New section for WhatsApp mass communication |
| Before Phase 8 (portal syndication) | New section for third-party lead sharing |
| After any data breach | Emergency DPIA update |
| When UAE PDPL guidance updated | Regulation alignment check |

---

**Document Owner:** Compliance (Laila) + Technology (Radia)
**Next Review:** Before Phase 4 (WhatsApp) launch
**Related:** `business/06_flowcharts/data-privacy-flow.md`, `business/08_compliance/gdpr-equivalence-assessment.md`

---

## 9. Privacy by Design Implementation

The seven Privacy by Design principles (Cavoukian, 2009) are embedded throughout the White Caves platform architecture:

### 9.1 Proactive Not Reactive — Preventative Not Remedial
White Caves does not wait for privacy failures before acting. Measures implemented before launch:
- Threat modelling completed during Phase 1 architecture review
- Data flows documented (this DPIA) before any personal data collected
- Security header defaults (Helmet.js) active from day one
- No analytics or tracking cookies activated without consent banner live first

### 9.2 Privacy as the Default
If a user does nothing, their privacy is protected automatically:
- New leads assigned only to the handling agent — no broadcast to full team
- API responses return only fields the requesting role is authorised to see (RBAC projection)
- KYC documents accessible to Compliance Officer + MD only — not general agents
- Logs retain 90 days by default; full 7-year audit log is compliance-tier only

### 9.3 Privacy Embedded into Design
Privacy is not bolted on — it is part of core data architecture:
- MongoDB schema: sensitive fields (passport, source of funds) stored in separate sub-document with tighter ACL
- Prisma models have `@omit` annotations to prevent accidental serialisation of sensitive fields
- AI assistants process anonymised data only — lead name replaced with leadId before passing to inference layer
- WhatsApp conversations stored with phone number tokenised — original number accessible only via compliance decrypt

### 9.4 Full Functionality — Positive-Sum
Privacy and functionality are not traded off:
- Agents can see the data they need to do their job (full lead profile) without seeing KYC documents they don't need
- Compliance officer has deep access to KYC without seeing full sales pipeline (role separation)
- Analytics use aggregated/anonymised data — individual PII never sent to analytics layer

### 9.5 End-to-End Security — Full Lifecycle Protection
Data is protected from collection to deletion:
```
Collection → Transmission → Storage → Processing → Retention → Deletion
   HTTPS       TLS 1.3      AES-256    RBAC filter   Auto-cron   Shred
```
- Deletion is cryptographic erasure: AES key destroyed → data unreadable even if bytes remain
- Backups deleted in sync with primary retention policies (MongoDB Atlas point-in-time recovery within retention window only)

### 9.6 Visibility and Transparency
White Caves is open about its data practices:
- Privacy policy published on website (Phase 2) — plain English summary + full legal text
- All data categories, purposes, and retention listed in this DPIA (public summary version available)
- Data subject rights mechanism published and accessible without login
- Annual DPIA review published as internal report; summary shared with staff

### 9.7 Respect for User Privacy
Data subjects are the priority:
- Subject access requests fulfilled in 30 days (faster if possible)
- Erasure requests actioned promptly — exceptions communicated with legal basis
- Consent is granular — users can consent to email but not WhatsApp marketing independently
- Right to be forgotten honoured for all personal data not subject to legal retention (AML records exempt for 5 years)

---

## 10. Data Subject Rights Request Procedure

### 10.1 How to Submit a Request

Data subjects can submit requests by:
- **Email:** privacy@whitecaves.ae (primary channel)
- **Written letter:** White Caves Real Estate LLC, [Office Address], Dubai
- **CRM portal:** Data subjects with portal accounts can submit via their account settings (Phase 3)

### 10.2 Identity Verification

Before processing any request, verify identity:
```
For clients:
1. Email from registered email address → acceptable for low-risk requests
2. Phone call + CRM reference → for higher-risk requests (erasure, correction)
3. Emirates ID copy + selfie → for KYC document access requests
4. Notarised ID → for requests from third parties on behalf of data subject

For staff:
1. Internal request via HR system with manager approval
```

### 10.3 Processing Each Right

| Right | Steps | Response Template | Timeline |
|-------|-------|------------------|----------|
| **Access (SAR)** | 1. Log request in CRM with timestamp; 2. Extract all data via CRM admin export; 3. Review for third-party data (remove if they don't have right to see); 4. Package as PDF + JSON; 5. Deliver via secure email | "Attached is all personal data we hold about you..." | 30 calendar days |
| **Rectification** | 1. Verify claim with supporting evidence; 2. Update CRM record; 3. Log correction in audit trail; 4. Confirm change to data subject | "We have updated your [field] to [new value]..." | 10 business days |
| **Erasure** | 1. Check if legal hold applies (AML: 5yr, Finance: 7yr, RERA: ongoing); 2. If no hold: anonymise PII in place (do not delete record IDs for audit integrity); 3. Mark record as `deleted=true`; 4. Confirm to data subject with exceptions noted | "We have erased your personal data. Note: [exception if any]..." | 30 calendar days |
| **Portability** | 1. Export all data in machine-readable format (JSON); 2. Include: contact details, property preferences, activity log, communications history; 3. Exclude: internal scoring, compliance notes, third-party data | "Attached is your data in machine-readable JSON format..." | 30 calendar days |
| **Restriction** | 1. Flag record in CRM as `processingRestricted=true`; 2. Suspend all automated processing (scoring, AI, marketing); 3. Manual-only access permitted; 4. Notify data subject when restriction lifted | "We have restricted processing of your data pending review..." | Immediate (restriction), 30 days (decision) |
| **Object** | 1. Receive objection (must specify grounds — legitimate interests override or direct marketing); 2. For direct marketing: immediate cessation; 3. For other processing: assess compelling legitimate grounds; 4. Respond with decision | "We have stopped [processing] / We have assessed your objection and..." | 10 business days |

### 10.4 Conflicts with Legal Retention

| Scenario | Resolution |
|---------|-----------|
| Erasure requested but AML retention applies (5 years) | Partial erasure: erase marketing data, retain AML records with legal basis communicated |
| Erasure requested but Finance records required (7 years) | Partial erasure: erase contact preferences, retain transaction records |
| Erasure requested but RERA Form A on file | Retain Form A (RERA audit requirement); erase supplementary personal data |
| SAR requested for data subject about a third party | Redact third-party personal data before disclosure |

---

## 11. Data Breach Response Plan

### 11.1 Breach Detection Sources
- Automated: MongoDB Atlas security alerts, API error rate spikes, unusual access patterns
- Staff report: Any staff member who suspects a breach must report to compliance@whitecaves.ae immediately
- Vendor notification: Third-party processor notifies White Caves of breach affecting White Caves data
- Security researcher disclosure: Bug bounty / responsible disclosure

### 11.2 Severity Classification

| Severity | Description | Examples | Response SLA |
|---------|------------|---------|-------------|
| **Critical** | Mass personal data exposure, KYC documents accessed unauthorised | Database dump exfiltrated; all KYC documents downloaded | Immediate (< 1 hour) |
| **High** | Limited PII exposure, financial data at risk | Single agent account compromised; 10–100 records exposed | < 4 hours |
| **Medium** | Internal access violation, no external exposure | Staff member accessed records outside their role | < 24 hours |
| **Low** | No personal data at risk | System misconfiguration detected before exploitation | < 72 hours |

### 11.3 Response Steps by Severity

**Critical / High Breach:**
```
HOUR 0-1:  Detection → Immediate containment (disable affected account/endpoint)
HOUR 1-4:  Assess scope (how many records? what data categories?)
HOUR 4-24: Begin UAE Data Office notification preparation (required ≤ 72h)
HOUR 24-48: Individual notifications if high risk to rights/freedoms
HOUR 48-72: UAE Data Office formal notification via uaedata.gov.ae portal
WEEK 2:    Post-mortem → root cause → remediation plan
WEEK 4:    Implement technical remediation
MONTH 2:   Independent security assessment + updated DPIA
```

**Medium / Low Breach:**
```
DAY 1: Detection → Internal investigation → Scope assessment
DAY 3: Decision on notification (is risk high enough for individual notification?)
DAY 5: Internal post-mortem + remediation plan
DAY 30: Remediation implemented + documented
```

### 11.4 UAE Data Office Notification Content (Critical/High)

The notification to the UAE Data Office must include:
- Nature of the breach (what happened)
- Categories and approximate number of data subjects affected
- Categories and approximate number of personal data records affected
- Name and contact of Data Protection Contact (compliance@whitecaves.ae)
- Likely consequences of the breach
- Measures taken or proposed to address the breach

### 11.5 Emergency Contact List

| Contact | Name | Phone | Email |
|---------|------|-------|-------|
| Data Protection Contact | Laila (Compliance) | [Phone] | compliance@whitecaves.ae |
| CTO / Technical Lead | Aurora (Tech Lead) | [Phone] | tech@whitecaves.ae |
| Managing Director | Arslan | [Phone] | arslanmalikgoraha@gmail.com |
| UAE Data Office | — | 800-UAEDATA | incident@uaedata.gov.ae |
| MongoDB Atlas Security | — | — | security@mongodb.com |
| Legal Counsel | [Law Firm] | [Phone] | [Email] |

---

## 12. Third-Party Processor Assessment

| Processor | Data Shared | DPA Status | Location | Security Cert | Transfer Mechanism | Risk |
|----------|------------|-----------|---------|------------|-----------------|------|
| **MongoDB Atlas** | All CRM data (PII, KYC) | ✅ DPA signed | UAE (primary) | SOC 2 Type II, ISO 27001 | UAE residency = no transfer | LOW |
| **Vercel** | Frontend code only; no personal data processed | ✅ DPA available | Global CDN | SOC 2 Type II | SCCs for EU visitors' IP logs | LOW |
| **Railway/Render** | API requests (includes PII in transit) | ⏳ DPA needed | US | SOC 2 (Render only) | SCCs required Phase 2 | MEDIUM |
| **Google Firebase** | Auth tokens, display name, email | ✅ Google Cloud DPA | US (GCP) | ISO 27001, SOC 2 | SCCs (Google Cloud EU SCCs) | LOW |
| **Stripe** | Payment data (tokenised), billing address | ⏳ DPA needed | US | PCI-DSS Level 1, SOC 2 | SCCs required Phase 2 | MEDIUM |
| **Meta/WhatsApp** | Phone numbers, message content, contacts | ⏳ DPA needed | US | ISO 27001, SOC 2 | SCCs required Phase 4 | HIGH |
| **SendGrid (Twilio)** | Email addresses, message content | ⏳ DPA needed | US | ISO 27001, SOC 2 | SCCs required Phase 2 | MEDIUM |
| **Sentry** | Error logs (may contain PII in stack traces) | ⏳ Assess Phase 2 | US | SOC 2 | SCCs; configure PII scrubbing | MEDIUM |
| **Google Analytics** | Pseudonymous web analytics (IP, behaviour) | ✅ Google DPA | US | ISO 27001 | SCCs; IP anonymisation ON | LOW |

**Priority Actions:**
1. ⚠️ **Stripe DPA** — required before Phase 2 (payment processing)
2. ⚠️ **Railway/Render DPA** — required immediately (API processes all data)
3. ⚠️ **Meta DPA** — required before Phase 4 (WhatsApp integration)
4. ⚠️ **SendGrid DPA** — required before any email marketing
5. ⚠️ **Sentry PII scrubbing** — configure before Phase 2 (production error tracking)

---

**Document Owner:** Compliance (Laila) + Technology (Radia)
**Next Full Review:** Before Phase 4 (WhatsApp) launch — estimated Q4 2026
**Version History:** v1.0 April 2026 (initial)
**Related Documents:**
- `business/08_compliance/gdpr-equivalence-assessment.md`
- `business/08_compliance/aml-risk-assessment.md`
- `business/06_flowcharts/data-privacy-flow.md`
- `business_docs/05_requirements/compliance-requirements.md`
