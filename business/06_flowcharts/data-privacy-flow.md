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


---

## 8. Data Privacy by Default — Technical Controls

### 8.1 API Response Filtering

All API responses must filter out fields the requesting user is not authorised to see:

```typescript
// Example: Lead response filtered by role
const getLeadForRole = (lead: FullLead, requestingRole: UserRole): PartialLead => {
  const baseFields = {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    status: lead.status,
    source: lead.source,
    budget: lead.budget,
    propertyPreference: lead.propertyPreference,
  };

  // Compliance officer can see KYC data
  const kycFields = isComplianceRole(requestingRole) ? {
    passportNumber: lead.passportNumber,
    emiratesIdNumber: lead.emiratesIdNumber,
    sourceOfFunds: lead.sourceOfFunds,
    amlStatus: lead.amlStatus,
  } : {};

  // Managers can see agent assignment and score
  const managerFields = isManagerRole(requestingRole) ? {
    agentId: lead.agentId,
    agentName: lead.agentName,
    leadScore: lead.leadScore,
    internalNotes: lead.internalNotes,
  } : {};

  return { ...baseFields, ...kycFields, ...managerFields };
};
```

### 8.2 Column-Level Encryption for Sensitive Fields (Phase 5)

```typescript
// Sensitive fields encrypted before storage in MongoDB
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_ID = process.env.ENCRYPTION_KEY_ID!; // HashiCorp Vault reference

const encryptField = async (plaintext: string): Promise<EncryptedField> => {
  const key = await vaultClient.getKey(KEY_ID); // 256-bit key from Vault
  const iv = randomBytes(12); // 96-bit IV for GCM mode
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    keyId: KEY_ID,
  };
};

// Fields encrypted:
// Lead: passportNumber, emiratesIdNumber, sourceOfFunds
// Client: passportScan (reference), bankDetails
// Transaction: chequeNumbers, mortgageDetails
```

### 8.3 Audit Log Architecture

```typescript
// Every data access that touches PII or sensitive fields is logged
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  actorId: string;         // who performed the action
  actorRole: UserRole;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT';
  resource: string;        // e.g., 'Lead', 'Client', 'KYCDocument'
  resourceId: string;
  fieldsAccessed?: string[];  // for READ: which sensitive fields were accessed
  fieldsModified?: {          // for UPDATE: what changed
    field: string;
    oldHash?: string;        // hash of old value (not stored plain)
    newHash?: string;
  }[];
  ipAddress: string;
  userAgent: string;
  requestId: string;       // correlates with API request log
  retentionExpiresAt: Date; // 7 years for compliance audit logs
}
```

---

## 9. Data Subject Rights — Technical Implementation

### 9.1 Subject Access Request (SAR) API

```typescript
// POST /api/v1/privacy/access-request (auth required)
interface SARRequest {
  requestType: 'access' | 'erasure' | 'portability' | 'restriction' | 'correction';
  scope: 'all_data' | 'specific_data';
  specificDataTypes?: string[]; // e.g., ['contact_details', 'property_preferences']
  reason?: string;              // optional explanation
}

// System action for 'access' request:
// 1. Create PrivacyRequest record with status 'RECEIVED'
// 2. Email confirmation to data subject (within 24h)
// 3. Notify Compliance Officer via CRM alert
// 4. Generate GDPR/PDPL-compliant export (within 30 days)
// 5. Deliver via secure link (expires 7 days)
```

### 9.2 Right to Erasure — Technical Implementation

```typescript
// Erasure does NOT delete records — it anonymises PII in place
// This preserves referential integrity and audit logs
const anonymiseLead = async (leadId: string): Promise<void> => {
  const anonymisedId = `ERASED-${randomUUID().substring(0, 8)}`;
  
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      firstName: 'ERASED',
      lastName: 'ERASED',
      email: `${anonymisedId}@erased.invalid`,
      phone: 'ERASED',
      passportNumber: null,
      emiratesIdNumber: null,
      // Preserve for audit:
      status: lead.status,  // Keep for business reporting
      source: lead.source,  // Keep for analytics (anonymised)
      budget: null,         // Remove financial data
      isErased: true,
      erasedAt: new Date(),
      erasureRequestId: requestId,
    },
  });
  
  // Audit log: erasure event
  await auditLog.create({ action: 'DELETE', resource: 'Lead', resourceId: leadId });
};
```

---

## 10. Cookie Compliance Implementation

### 10.1 Cookie Categories and Scripts

```typescript
// Cookie consent state
interface CookieConsentState {
  necessary: true;          // always true — cannot opt out
  analytics: boolean;       // Google Analytics, Hotjar
  marketing: boolean;       // Meta Pixel, Google Ads
  functional: boolean;      // language, currency preferences
  consentVersion: string;   // '2026-04-15' — triggers re-consent when updated
  consentTimestamp: Date;
  consentIp: string;
}

// Scripts gated by consent (do not load until consent given)
const consentGatedScripts = {
  analytics: [
    { id: 'ga4', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXX' },
    { id: 'hotjar', src: 'https://static.hotjar.com/c/hotjar-XXXX.js' },
  ],
  marketing: [
    { id: 'meta-pixel', inline: '/* fbq snippet */' },
    { id: 'google-ads', src: 'https://www.googletagmanager.com/gtag/js?id=AW-XXXX' },
  ],
};

// Load scripts only when user has consented
useEffect(() => {
  if (cookieConsent.analytics) {
    loadScript(consentGatedScripts.analytics);
  }
  if (cookieConsent.marketing) {
    loadScript(consentGatedScripts.marketing);
  }
}, [cookieConsent]);
```

### 10.2 Content Security Policy (CSP) Headers

```
# CSP header — blocks unauthorised scripts until consent
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}' https://www.googletagmanager.com https://static.hotjar.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://cdn.whitecaves.ae https://www.google.com;
  connect-src 'self' https://api.whitecaves.ae https://www.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://www.youtube.com https://player.matterport.com;
  object-src 'none';
  base-uri 'self';
```

---

**Document Owner:** Technology (@Radia — Security, @Aurora — Platform Lead) + Compliance (Laila)
**Version History:** v1.0 April 2026; v2.0 April 2026 (technical controls, SAR API, erasure, CSP)
**Related:** `business/08_compliance/data-privacy-impact-assessment.md`, `business/08_compliance/gdpr-equivalence-assessment.md`
