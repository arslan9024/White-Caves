# UAE PDPL Compliance — Security Documentation

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Regulation:** UAE Federal Law No. 45 of 2021 (Personal Data Protection Law)  
> **Applicable To:** All personal data of UAE residents processed by White Caves CRM

---

## 1. Overview

The UAE Personal Data Protection Law (PDPL), enacted November 2021 and fully effective September 2023, governs how organisations collect, process, store, and share personal data of individuals in the UAE. Non-compliance may result in fines up to AED 20 million and operational restrictions.

White Caves processes personal data of:
- Clients and prospects (buyers, sellers, tenants, landlords)
- Employees and agents
- Visitors (website analytics)

---

## 2. Data Categories Processed

| Category | Data Fields | Legal Basis |
|----------|-------------|-------------|
| Identity | Full name, nationality, Emirates ID, passport number | Contractual necessity |
| Contact | Email, phone, address, WhatsApp | Contractual necessity |
| Financial | Income, bank details, transaction value, commission | Contractual necessity |
| Employment | Employer name, employment status, salary | Contractual necessity |
| Biometric/Sensitive | Visa details (indirect — immigration-linked) | Contractual necessity |
| Behavioural | Website visits, lead activity history | Legitimate interests |
| Communications | WhatsApp messages, email content | Contractual necessity |

---

## 3. PDPL Compliance Requirements & Platform Implementation

### REQ-PDPL-001: Lawful Basis for Processing
**Requirement:** All personal data processing must have a lawful basis (consent, contract, legal obligation, vital interests, public interest, or legitimate interests).

**Platform Implementation:**
- Lead/client data: **Contractual necessity** — required to provide real estate services
- Marketing communications: **Consent** — explicit opt-in required
- Compliance/AML data: **Legal obligation** — UAE AML law
- Analytics: **Legitimate interests** — business improvement (with safeguards)

**Status:** Planned — Privacy policy update and consent fields required on all forms.

---

### REQ-PDPL-002: Privacy Notice
**Requirement:** Individuals must be informed of: identity of data controller, purposes of processing, categories of data, rights, and retention period.

**Platform Implementation:**
- Privacy Policy page linked at registration, lead forms, and WhatsApp bot first message
- Privacy policy version and acceptance timestamp stored per user
- Privacy policy URL in footer of all email communications

**Status:** Planned

---

### REQ-PDPL-003: Consent Management
**Requirement:** Where consent is the lawful basis, it must be freely given, specific, informed, and unambiguous. Must be as easy to withdraw as to give.

**Platform Implementation:**
- Registration form: consent checkbox (required, not pre-ticked) for data processing
- Separate opt-in for marketing communications
- WhatsApp: consent captured before first bot interaction for data collection
- Consent withdrawal: available in account settings
- Consent records stored: userId, date, version, purpose, channel

**Status:** Planned

---

### REQ-PDPL-004: Data Minimisation
**Requirement:** Only collect data strictly necessary for the stated purpose.

**Platform Implementation:**
- Regular data field audit (every 6 months) to remove unused fields
- API responses exclude PII not needed for the requesting role
- List endpoints exclude sensitive fields (passport, visa, income) by default

**Status:** Ongoing — initial audit required Q2 2026

---

### REQ-PDPL-005: Data Accuracy
**Requirement:** Personal data must be accurate and kept up to date.

**Platform Implementation:**
- Users and agents can update their own profile data
- Admins can flag records as "Needs Review" if inaccurate
- Data entered by agents is validated at the point of entry
- Annual data accuracy reminder sent to active users

**Status:** Basic implementation complete; reminder system planned

---

### REQ-PDPL-006: Data Retention & Deletion
**Requirement:** Data must not be kept longer than necessary. Right to erasure applies (subject to legal exceptions).

**Platform Implementation:**
- Retention schedule defined per data category (see table below)
- System prevents deletion of records within AML 5-year retention window
- Inactive leads with no activity for 3 years are flagged for archival review
- "Delete my account" function in user profile → soft delete (anonymise after review)

**Retention Schedule:**
| Data Category | Retention Period | Authority |
|--------------|-----------------|-----------|
| Transaction records + KYC | 5 years from transaction | AML Law |
| Active client records | Duration of relationship + 5 years | AML Law |
| Lead records (no transaction) | 3 years from last activity | Business policy |
| Employee records | Duration of employment + 5 years | Labour law |
| Website analytics | 12 months | Business policy |
| Marketing consent logs | 5 years | PDPL |

**Status:** Policy defined; technical enforcement planned

---

### REQ-PDPL-007: Data Subject Rights

| Right | Description | SLA | Implementation |
|-------|-------------|-----|----------------|
| Right of Access | Receive copy of own personal data | 30 days | Data export function (planned) |
| Right of Rectification | Correct inaccurate data | 30 days | Self-service profile editing (implemented) |
| Right of Erasure | Delete data (subject to exceptions) | 30 days | Soft delete + review workflow (planned) |
| Right to Object | Object to processing for marketing | Immediate | Opt-out function (planned) |
| Right to Portability | Receive data in machine-readable format | 30 days | JSON export (planned) |

**Request Process:**
1. User submits data subject request via settings page or email
2. Identity verified (matches account)
3. Request processed within 30 days
4. Response documented in audit log
5. If deletion blocked by AML: user notified of reason and data retention period

---

### REQ-PDPL-008: Data Transfers
**Requirement:** Cross-border transfers only to countries with adequate protection or with safeguards (SCCs, binding corporate rules).

**Assessment of Third-Party Transfers:**
| Service | Data Shared | Country | Assessment |
|---------|------------|---------|------------|
| MongoDB Atlas | All personal data | UAE North | ✅ In UAE — compliant |
| Firebase Auth | Email, UID | US (Google) | ⚠️ SCCs required |
| SendGrid | Email address, name | US | ⚠️ SCCs required |
| Stripe | Payment data, email | US | ⚠️ SCCs required |
| WhatsApp Cloud API | Phone numbers, messages | US (Meta) | ⚠️ SCCs required |

**Action Required:** Data Processing Agreements (DPAs) with SCCs to be signed with all US-based providers by Q3 2026.

---

## 4. Data Breach Response Plan

### Detection
- Automated: Sentry/monitoring alerts on unusual data access patterns
- Manual: Staff report suspected breach immediately to CTO

### Response Steps
1. **Contain:** Isolate affected system/account within 1 hour
2. **Assess:** Determine scope, categories, and number of individuals affected
3. **Notify UAEDP (UAE Data Office):** Within 72 hours if breach poses risk to individuals
4. **Notify Affected Individuals:** If high risk to their rights/freedoms
5. **Document:** Full incident report with root cause, impact, and remediation
6. **Review:** Post-incident security review and process update

---

## 5. Data Protection Officer (DPO)

A designated DPO or Data Privacy Manager should be appointed to:
- Monitor PDPL compliance
- Handle data subject requests
- Liaise with UAE Data Office (UAEDP)
- Conduct annual data protection impact assessments

**Status:** To be appointed by Q2 2026.

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Legal & Compliance

---

## 6. Data Subject Rights — Implementation Detail

### 6.1 Response SLA: 30 Days (Mandatory)

Under UAE PDPL Article 10, all data subject rights requests must be fulfilled within **30 calendar days** of receipt. If complex, may be extended by 30 days with written notice to the data subject.

| Right | API Endpoint | Response Format | SLA |
|-------|-------------|-----------------|-----|
| Right of Access | `GET /api/privacy/my-data` | JSON export of all personal data | 30 days |
| Right of Rectification | `PUT /api/privacy/correct-data` | Confirmation of correction | 30 days |
| Right of Erasure | `POST /api/privacy/delete-request` | Anonymisation confirmation (subject to AML hold) | 30 days |
| Right to Object (marketing) | `PUT /api/privacy/opt-out` | Immediate suppression | Immediate |
| Right to Portability | `GET /api/privacy/export` | JSON/CSV download | 30 days |

### 6.2 Data Subject Request Handling Procedure

1. Request received via settings page, email (privacy@whitecaves.com), or written letter
2. Identity verified against CRM record (email + phone OTP)
3. Request logged in `privacy_requests` collection: `{ userId, requestType, receivedDate, dueDate, status, assignedTo, completedDate }`
4. If AML retention applies: user notified of legal hold with specific retention period and legal basis
5. Response delivered within 30 days
6. Completion logged with evidence for PDPL audit trail
7. If request denied: written reason provided citing specific legal exception

> **Testability:** Integration test must verify: (a) `POST /api/privacy/delete-request` sets `status = "pending_review"` immediately; (b) system sends acknowledgement email within 24h; (c) response SLA of 30 days is tracked in `dueDate` field.

---

## 7. Consent Form Specification

### 7.1 Consent Elements Required (PDPL Article 8)

Each consent capture must include:
- **Identity of controller:** "White Caves Real Estate LLC, licensed by RERA"
- **Specific purpose:** Written in plain language (not bundled purposes)
- **Data categories** to be processed
- **Third parties** data will be shared with (named or by category)
- **Retention period** or criteria for deletion
- **Rights available** and how to exercise them
- **Withdrawal mechanism** equally easy as giving consent
- **Timestamp and version** recorded server-side

### 7.2 Consent Form Fields (Technical Spec)

```json
{
  "userId": "string",
  "consentVersion": "v2.1",
  "consentDate": "ISO8601 timestamp",
  "ipAddress": "string (hashed)",
  "channel": "web | whatsapp | in-person | email",
  "purposes": {
    "serviceDelivery": true,
    "marketingEmail": false,
    "marketingWhatsApp": false,
    "analyticsTracking": false,
    "thirdPartySharing": false
  },
  "withdrawnAt": null
}
```

### 7.3 Consent UI Requirements

- Checkboxes must NOT be pre-ticked
- Marketing consent must be separate from service delivery consent
- "Accept All" button is NOT permitted — each purpose must be individually selectable
- Privacy Policy link must open in new tab before submission
- Arabic translation required alongside English

---

## 8. Data Breach Notification Procedure (72-Hour Obligation)

### 8.1 Legal Basis
UAE PDPL Article 14 requires notification to the UAE Data Office (Telecommunications and Digital Government Regulatory Authority — TDRA) within **72 hours** of becoming aware of a personal data breach that poses risk to data subjects.

### 8.2 Breach Classification

| Severity | Definition | Notification Required |
|---------|-----------|----------------------|
| P0 — Critical | Breach of sensitive data (financial, biometric, health) affecting > 1000 subjects OR likely to cause harm | TDRA within 72h + affected individuals |
| P1 — High | Breach of standard personal data affecting 100–1000 subjects or high-risk individuals | TDRA within 72h |
| P2 — Medium | Breach affecting < 100 subjects, low risk of harm | Internal documentation; TDRA assessment required |
| P3 — Low | Near-miss or contained breach, no data exfiltration confirmed | Internal log only |

### 8.3 72-Hour Response Timeline

| Hour | Action | Owner |
|------|--------|-------|
| 0 | Breach detected / reported | Any staff |
| 0–1 | Incident declared; containment begins | CTO / Security Officer |
| 1–4 | Scope assessment: how many records? what categories? | CTO + legal |
| 4–24 | TDRA notification drafted (mandatory fields: nature of breach, categories affected, approximate number of subjects, likely consequences, measures taken) | Legal + Compliance Officer |
| 24–48 | TDRA notification submitted | Compliance Officer |
| 24–72 | Affected individuals notified if high-risk to their rights | Legal + Marketing (comms) |
| 72+ | Full incident report completed; remediation plan | CTO |
| 30 days | Post-incident review + TDRA follow-up if requested | All |

### 8.4 TDRA Notification Contact

- **Portal:** https://u.ae/en/about-the-uae/digital-uae/data/personal-data-protection-law
- **Email:** data.protection@tdra.gov.ae
- **Required fields in notification:** Data controller identity, DPO contact, breach nature, data categories affected, approximate number of subjects, likely consequences, measures taken/proposed

> **Testability:** Security drill must simulate breach scenario and verify TDRA draft notification is ready within 24h. Drill frequency: semi-annually.

---

## 9. Data Processing Register Template

> Required under PDPL Article 12 (organisations processing personal data must maintain records of processing activities).

```markdown
## Processing Activity: [Name]

| Field | Value |
|-------|-------|
| Processing Activity ID | PA-XXX |
| Activity Name | e.g., "Lead Management" |
| Controller | White Caves Real Estate LLC |
| DPO Contact | privacy@whitecaves.com |
| Purpose of Processing | e.g., "Manage property leads and client relationships" |
| Legal Basis | e.g., "Contractual necessity (PDPL Art. 8(1)(b))" |
| Data Categories | e.g., "Name, phone, email, nationality, budget" |
| Data Subjects | e.g., "Prospective property buyers and tenants" |
| Retention Period | e.g., "3 years from last activity (no transaction)" |
| Recipients / Third Parties | e.g., "MongoDB Atlas (UAE), WhatsApp Cloud API (Meta, US — SCCs in place)" |
| Cross-border Transfer | e.g., "Yes — US (Meta); SCCs executed 2026-03-01" |
| Technical Safeguards | e.g., "TLS 1.3 in transit; AES-256 at rest; RBAC; 2FA" |
| Last Review Date | e.g., "2026-04-01" |
| Next Review Date | e.g., "2027-04-01" |
```

**Minimum processing activities to document:**
1. Lead & client management (CRM)
2. Employee / HR data
3. Marketing communications
4. Property transaction records (KYC/AML)
5. Website analytics
6. CCTV / physical security (if applicable)
7. Third-party integrations (portals, payment gateways)

---

## 10. DPA (Data Protection Agreement / DPO) Appointment Requirements

### 10.1 DPO Requirement Assessment

Under UAE PDPL Article 13, a Data Protection Officer is **recommended** (not yet mandated for all organisations). However, given White Caves processes sensitive personal data (financial, identity documents), appointment of a DPO or Data Privacy Manager is **strongly recommended** and may become mandatory under implementing regulations.

### 10.2 DPO Responsibilities

| Responsibility | Action |
|---------------|--------|
| Monitor PDPL compliance | Quarterly compliance audit |
| Handle data subject requests | Process within 30-day SLA |
| Liaise with TDRA | Primary contact for regulatory enquiries |
| Conduct DPIAs | For new high-risk processing activities |
| Staff training | Coordinate annual privacy awareness training |
| Manage data breaches | Lead 72-hour breach response |
| Maintain data processing register | Annual review |

### 10.3 DPA with Third-Party Processors

All third-party vendors processing personal data on White Caves' behalf must sign a **Data Processing Agreement (DPA)** containing:
- Scope and purpose of processing
- Data categories and subject types
- Processing instructions and limitations
- Security measures (technical + organisational)
- Sub-processor notification obligations
- Breach notification to White Caves within 24 hours
- Deletion or return of data on contract termination
- Right to audit

**Vendors requiring DPA:** MongoDB Atlas, SendGrid/Resend, Meta WhatsApp API, Stripe, Firebase, ComplyAdvantage, Onfido/Jumio, any AI API provider.

---

## 11. Cross-Border Transfer Approval Process

### 11.1 Transfer Mechanisms (PDPL Article 16)

| Mechanism | When Applicable | Requirements |
|---------|----------------|-------------|
| Adequacy Decision | Transfer to country with equivalent protection | TDRA-approved country list (not yet published as of 2026) |
| Standard Contractual Clauses (SCCs) | Transfer to non-adequate country (US, etc.) | SCCs executed in form approved by TDRA; referenced in DPA |
| Binding Corporate Rules (BCRs) | Intra-group transfers | TDRA approval required |
| Consent | Specific transfer where subject consents | Explicit, informed consent; not feasible at scale |
| Vital Interests / Legal Claims | Case-by-case | Narrow exceptions only |

### 11.2 Current Transfer Status

| Service | Data Transferred | Country | Mechanism | DPA Signed | Status |
|---------|-----------------|---------|-----------|-----------|--------|
| MongoDB Atlas | All personal data | UAE (primary) | N/A (in-country) | N/A | ✅ Compliant |
| Firebase Auth | UID, email | US | SCCs | 🔴 Pending | ⚠️ Required by Q3 2026 |
| Meta WhatsApp API | Phone, messages | US | SCCs | 🔴 Pending | ⚠️ Required by Q3 2026 |
| Resend/SendGrid | Name, email | US | SCCs | 🔴 Pending | ⚠️ Required by Q3 2026 |
| ComplyAdvantage | Name, DOB, nationality | UK | SCCs | 🔴 Pending | ⚠️ Required by Q3 2026 |
| OpenAI/Anthropic (AI) | Query content | US | SCCs | 🔴 Pending | ⚠️ Required before AI launch |

---

## 12. PDPL Penalty Schedule

| Violation | Maximum Penalty (AED) | Legal Reference |
|-----------|----------------------|----------------|
| Processing without lawful basis | 5,000,000 | PDPL Art. 26 |
| Failure to notify data breach within 72h | 5,000,000 | PDPL Art. 26 |
| Transfer data outside UAE without safeguards | 5,000,000 | PDPL Art. 26 |
| Failure to respond to data subject rights within SLA | 1,000,000 | PDPL Art. 25 |
| Failure to maintain data processing register | 1,000,000 | PDPL Art. 25 |
| Processing sensitive data without explicit consent | 5,000,000 | PDPL Art. 26 |
| Using personal data for purpose beyond original consent | 2,000,000 | PDPL Art. 25–26 |
| Repeated violations (aggravated) | Up to double the base penalty | PDPL Art. 27 |

> **Note:** These are administrative penalties only. Criminal liability under Federal Decree-Law No. 34 of 2021 (Cybercrime Law) may also apply for intentional data breaches.

