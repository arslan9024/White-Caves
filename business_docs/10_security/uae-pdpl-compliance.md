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
