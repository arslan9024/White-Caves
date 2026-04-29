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
