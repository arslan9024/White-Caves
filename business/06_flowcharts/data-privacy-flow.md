# Data Privacy Flow
# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-PRIV-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Compliance Department (Laila) + Technology (Radia — Security)
> **Legal Basis:** UAE PDPL (Federal Decree-Law No. 45 of 2021)
> **Scope:** Data collection → consent → processing → access → deletion/export

---

## 1. UAE PDPL Overview

| Principle | Requirement |
|-----------|------------|
| Lawfulness | Processing must have a valid legal basis |
| Purpose limitation | Data collected only for stated purposes |
| Data minimisation | Collect only what is necessary |
| Accuracy | Data must be kept accurate and up to date |
| Storage limitation | Retain only as long as necessary |
| Security | Appropriate technical and organisational measures |
| Accountability | Controller responsible for compliance |
| Data subject rights | Access, correction, deletion, portability |

**White Caves role:** Data Controller for all customer/client personal data

---

## 2. Data Collection & Consent Flow

### 2.1 Website Visitor

```
Visitor loads whitecaves.ae
          │
          ▼
  [Phase 2] Cookie consent banner displayed:
  "We use cookies to improve your experience.
   [Accept All] [Manage Preferences] [Reject Non-Essential]"
          │
          ├── Accept All → All cookies enabled (analytics, marketing)
          ├── Manage Preferences → Granular consent screen
          └── Reject Non-Essential → Essential cookies only
          │
          ▼
  Consent stored:
  { userId/visitorId, consentType, acceptedAt, version: '1.0' }
          │
          ▼
  Analytics (Google Analytics / similar):
  ├── Only activated if marketing consent given
  └── Data anonymised (IP masking enabled)
```

### 2.2 Lead Form Submission

```
User submits contact / property enquiry form
          │
          ▼
  Privacy notice displayed before/on form:
  "By submitting this form, you agree to our Privacy Policy.
   Your data will be used to respond to your enquiry and 
   send relevant property updates. You can unsubscribe anytime."
  
  Link to: whitecaves.ae/privacy-policy
          │
          ▼
  Consent checkbox (required):
  ☐ "I agree to White Caves contacting me about properties"
          │
          ├── Not checked → Form not submitted
          │
          ▼
  Data stored:
  Lead record: { name, email, phone, enquiry }
  Consent log: { leadId, consentType: 'marketing', timestamp, ipAddress }
```

### 2.3 CRM Client Onboarding

```
Agent adds client to CRM
          │
          ▼
  Privacy notice required:
  Physical copy signed by client
  OR digital acceptance (DocuSign / portal)
          │
          ▼
  Data collected (minimisation principle):
  ├── NECESSARY: name, email, phone, nationality, passport number
  ├── NECESSARY for AML: source of funds, PEP status
  ├── OPTIONAL: social media profiles, preferences
  └── NEVER collected: biometric data (not required)
          │
          ▼
  Purpose documented:
  { clientId, purpose: 'property transaction / AML compliance', basis: 'contract' }
```

---

## 3. Data Storage & Access Controls

```
Personal data stored in:
  MongoDB Atlas (UAE region — data residency compliant)
          │
          ▼
  Access control layers:
  ┌───────────────────────────────────────────────────────────┐
  │ Role               │ What they can access                 │
  ├────────────────────┼──────────────────────────────────────┤
  │ managing_director  │ All personal data                    │
  │ compliance_officer │ KYC/AML records, client data         │
  │ agent              │ Assigned clients and leads only      │
  │ finance_officer    │ Financial data (no sensitive KYC)    │
  │ landlord           │ Own property + tenant names only     │
  │ tenant             │ Own personal records only            │
  │ viewer             │ Anonymised / aggregated data only    │
  └───────────────────────────────────────────────────────────┘
          │
          ▼
  Encryption:
  ├── At rest: MongoDB Atlas encryption (AES-256)
  ├── In transit: TLS 1.3
  ├── Passwords: bcrypt (one-way hash, rounds=10)
  └── API keys / tokens: stored in environment variables (never DB)
          │
          ▼
  Audit logging:
  Every access to personal data generates Activity record:
  { userId, action: 'viewed_client', entityId, entityType, timestamp, ip }
```

---

## 4. Data Retention Policy

| Data Category | Retention Period | Legal Basis |
|--------------|-----------------|-------------|
| Lead records (no transaction) | 3 years | Legitimate interest |
| Client records (transaction completed) | 7 years | UAE AML Law + Tax |
| KYC documents | 5 years minimum | UAE AML Law No. 20 of 2018 |
| Financial transaction records | 7 years | UAE Commercial Companies Law |
| Employment records | Duration + 2 years | UAE Labour Law |
| Website analytics | 2 years | Consent |
| Audit logs (access logs) | 3 years | Security + compliance |
| Marketing consent records | Duration of relationship | PDPL |
| System logs | 90 days | Security monitoring |

```
Data deletion schedule:
  [Cron job — Phase 2]
  Run monthly:
  ├── Identify records past retention period
  ├── Compliance officer reviews deletion candidates
  ├── Approve deletion or extend retention (with reason)
  └── Deletion executed + logged
```

---

## 5. Data Subject Rights Flow

### 5.1 Access Request (Right to Know)

```
Client / lead submits Subject Access Request (SAR):
"I want to know what data you hold about me"
  Via: privacy@whitecaves.ae or portal form
          │
          ▼
  Identity verification:
  ├── Requestor must prove identity (passport or Emirates ID)
  └── Must match the data subject on file
          │
          ▼
  [Compliance officer processes within 30 days — PDPL requirement]
  Generate data extract:
  ├── All personal data held (lead record, client record, KYC docs)
  ├── Purposes of processing
  ├── Third parties data shared with
  └── Retention period applicable
          │
          ▼
  Deliver via:
  ├── Secure portal download link (expires 48h)
  └── Encrypted email (password sent separately)
          │
          ▼
  Log: { requestId, subjectId, processedAt, deliveredAt }
```

### 5.2 Correction Request

```
Subject requests data correction
(e.g., name spelling, email address)
          │
          ▼
  Agent or compliance officer verifies correction
  Updates record in CRM
  Activity logged
  Subject notified: "Your data has been updated"
```

### 5.3 Deletion Request (Right to Erasure)

```
Subject requests deletion of personal data
          │
          ▼
  Compliance officer reviews:
  ├── Is there a legal obligation to retain? (AML: 5yr, Finance: 7yr)
  │   → If yes: explain legal obligation, partial deletion where possible
  │
  ├── Is there a contractual obligation? (active lease, pending deal)
  │   → If yes: retain until obligation ends
  │
  └── No obligation → Proceed with deletion
          │
          ▼
  Deletion scope:
  ├── CRM personal data fields anonymised (not hard deleted — audit trail)
  │   { name: '[REDACTED]', email: '[REDACTED]', phone: '[REDACTED]' }
  ├── KYC documents deleted from cloud storage
  ├── Marketing consent records deleted
  └── Third parties notified to delete (email service, analytics)
          │
          ▼
  Log: { requestId, subjectId, processedAt, deletedAt, scopeDescription }
  Subject notified: "Your personal data has been removed from our systems."
```

### 5.4 Data Portability

```
Subject requests their data in machine-readable format
          │
          ▼
  Generate JSON export:
  {
    "name": "...",
    "email": "...",
    "phone": "...",
    "enquiries": [...],
    "property_transactions": [...],
    "documents": ["url_to_signed_lease", ...]
  }
          │
          ▼
  Delivered via secure download link (expires 48h)
```

---

## 6. Data Breach Response Flow

```
Potential data breach detected:
  ├── Unauthorized access to MongoDB Atlas
  ├── API credential exposed in logs
  ├── Phishing attack on staff account
  └── Data found on dark web (third-party report)
          │
          ▼
  IMMEDIATE (within 1 hour):
  ├── Contain breach (revoke credentials, block IP, disable account)
  ├── Alert MD + Compliance Officer + IT Admin
  └── Do NOT delete logs (forensic evidence)
          │
          ▼
  ASSESSMENT (within 24 hours):
  ├── Scope: what data was accessed / exfiltrated?
  ├── Impact: which data subjects affected?
  └── Risk: is there risk of harm to data subjects?
          │
          ▼
  NOTIFICATION (within 72 hours if high risk):
  
  ├── UAE PDPL: Report to UAE Data Office if breach likely to harm subjects
  │   [Phase 2 — regulatory reporting procedure to document]
  │
  └── Data subjects: Notify if high risk to rights and freedoms
      "Dear [Name], We are writing to inform you of a security incident..."
          │
          ▼
  POST-BREACH:
  ├── Root cause analysis (within 7 days)
  ├── Remediation implemented
  ├── Updated DPIA if necessary
  └── Staff training review
```

---

## 7. Third-Party Data Sharing Register

| Third Party | Data Shared | Purpose | Legal Basis | Location |
|------------|------------|---------|-------------|---------|
| Firebase (Google) | Email, name | OAuth authentication | Consent | US (SCCs) |
| Stripe | Payment card data | Rent payment processing | Contract | US (SCCs) |
| SendGrid (Twilio) | Email, name | Transactional email | Contract | US (SCCs) |
| Meta (WhatsApp) | Phone, messages | CRM communication | Consent | US (SCCs) |
| MongoDB Atlas | All personal data | Data storage | Contract | UAE (primary) |
| Vercel | IP address (logs) | Hosting | Legitimate interest | Global |
| DLD / RERA | KYC documents | Property registration | Legal obligation | UAE |
| UAE FIU | AML records | Regulatory compliance | Legal obligation | UAE |

---

## 8. PDPL Compliance Checklist

| Requirement | Status |
|------------|--------|
| Privacy policy published | ⏳ Phase 2 |
| Cookie consent banner | ⏳ Phase 2 |
| Data processing register | ✅ This document |
| Data retention schedule | ✅ Section 4 |
| Subject access request procedure | ✅ Section 5 |
| Data breach procedure | ✅ Section 6 |
| Third-party data sharing register | ✅ Section 7 |
| Staff PDPL training | ⏳ Phase 5 |
| DPIA (formal assessment) | ✅ `business/08_compliance/data-privacy-impact-assessment.md` |
| Data Protection Officer | ⏳ Phase 9 (MD acts as DPO currently) |

---

**Document Owner:** Compliance Department (Laila) + Technology (Radia)
**Related:** `business/08_compliance/data-privacy-impact-assessment.md`, `business_docs/10_security/uae-pdpl-compliance.md`
