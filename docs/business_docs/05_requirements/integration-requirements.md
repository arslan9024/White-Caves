# Integration Requirements — White Caves CRM Platform

<!-- markdownlint-disable MD022 MD024 MD031 MD032 MD036 MD040 MD058 MD060 -->

**Status:** Active  
**Owner:** Platform + API + Product Integration Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-layer integration requirements and third-party contract intent

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Defines all external system integrations, APIs, and data exchange contracts

## Canonical governance links

- [`README.md`](./README.md)
- [`requirements-framework.md`](./requirements-framework.md)
- [`functional-requirements.md`](./functional-requirements.md)
- [`non-functional-requirements.md`](./non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)
- [`../../software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`](../../software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md)

## Feed targets

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`
- `docs/business_docs/09_crm_features/portal-syndication.md`

## Requirement catalog

### REQ-INT-001: WhatsApp inbound and outbound resilience

The system shall support WhatsApp webhook intake, outbound messaging, retry, and fallback handling.

**Acceptance criteria:**

- [ ] Inbound webhook events are acknowledged and persisted
- [ ] Outbound failures queue for retry with backoff
- [ ] Critical messaging can fall back to an alternate channel

**Evidence:** webhook log, outbound queue entry, retry record.

### REQ-INT-002: Portal syndication and lead capture

The system shall syndicate listings to portal providers and capture inbound leads back into CRM.

**Acceptance criteria:**

- [ ] Listing updates propagate to the configured portal feeds
- [ ] Inbound portal leads are auto-created in CRM
- [ ] Sync failures are visible and actionable to operators

**Evidence:** portal sync record, inbound lead audit, and error log.

### REQ-INT-003: Authentication and identity exchange

The system shall exchange identity data with the selected authentication provider and issue platform tokens.

**Acceptance criteria:**

- [ ] Federated login succeeds through the identity provider
- [ ] Platform token issuance follows provider verification
- [ ] Identity sync is auditable and traceable

**Evidence:** auth exchange log and session audit record.

### REQ-INT-004: Payments and currency conversion

The system shall integrate with payment and exchange-rate providers without blocking core CRM workflows.

**Acceptance criteria:**

- [ ] Payment events are handled through a documented webhook path
- [ ] Currency conversion uses cached rates when live rates are unavailable
- [ ] Provider failures are isolated from core record operations

**Evidence:** payment event log, FX cache record, provider error log.

### REQ-INT-005: External API security and idempotency

The system shall validate signed webhooks, protect credentials, and avoid duplicate side effects.

**Acceptance criteria:**

- [ ] Signed inbound webhooks are required where providers support them
- [ ] Duplicate events are treated idempotently
- [ ] Secrets are environment-based and not hard-coded

**Evidence:** webhook verification log, idempotency record, secret inventory note.

---

## 1. WhatsApp Business API (Meta Cloud API)

## 0. Canonical Internal API Namespace Policy (May 2026)

To remove documentation drift, internal module endpoints must follow a canonical namespace policy.

### Canonical namespaces (primary)

- Commissions: `/api/commissions`
- Leads: `/api/leads`
- Properties/Inventory: `/api/properties`
- Homepage aggregate: `/api/homepage/data`

### Compatibility policy

- Legacy aliases (e.g., finance-prefixed commission endpoints) may remain temporarily for backward compatibility.
- All new development, tests, and docs must use canonical namespaces.

---

## 1. WhatsApp Business API (Meta Cloud API)

### INT-WA-001: Connection Model

- **Provider:** Meta WhatsApp Cloud API (v18.0+)
- **Auth:** Bearer token (long-lived system user token stored in env vars)
- **Webhook:** Meta sends events to `POST /api/whatsapp/webhook`
- **Webhook Verification:** SHA-256 HMAC signature in `X-Hub-Signature-256` header
- **Phone Numbers:** Up to 23+ business phone numbers managed under one WABA account

### INT-WA-002: Message Sending

```
POST https://graph.facebook.com/v18.0/{phoneNumberId}/messages
Authorization: Bearer {token}
Content-Type: application/json
```

Supported message types: text, template, image, document, location, interactive (buttons/lists).

### INT-WA-003: Inbound Message Handling

Webhook payload is parsed to extract:

- `from`: customer phone number
- `message.type`: text, image, audio, document, button
- `message.text.body`: message content
- `contacts[0].profile.name`: customer display name

Every inbound message must:

1. Be acknowledged with HTTP 200 within 5 seconds
2. Be persisted in the `WhatsAppMessage` collection
3. Trigger real-time update to the agent inbox UI (WebSocket or polling)

### INT-WA-004: Rate Limits

| Action                               | Limit                    |
| ------------------------------------ | ------------------------ |
| Messages per second per number       | 80                       |
| Template messages per day per number | 1,000 (scales with tier) |
| API calls per hour                   | 200,000                  |

### INT-WA-005: Fallback Strategy

If WhatsApp API is unavailable:

1. Queue outbound messages (retry after 5 minutes)
2. CRM agents alerted via in-app notification
3. Fallback to SMS (optional) or email for critical communications

---

## 2. PropertyFinder API

### INT-PF-001: Purpose

Syndicate White Caves property listings to PropertyFinder.com portal and receive inbound leads.

### INT-PF-002: Listing Sync

- **Endpoint:** PropertyFinder Partner API (XML feed or REST, depending on tier)
- **Frequency:** Real-time on listing create/update; full sync nightly at 02:00 UTC
- **Required Fields per Listing:** title, description, price, type, bedrooms, bathrooms, area sqft, location, images, permit number, agent BRN
- **Status Sync:** Available / Reserved / Sold / Rented synced in real time

### INT-PF-003: Lead Capture

- Leads submitted by buyers on PropertyFinder are delivered via webhook
- `POST /api/webhooks/propertyfinder/leads`
- Auto-created as new leads in Clara CRM with source = "PropertyFinder"
- Agent assigned based on the listing's responsible agent

### INT-PF-004: Credentials

- API Key stored in `PROPERTY_FINDER_API_KEY` environment variable
- Partner ID stored in `PROPERTY_FINDER_PARTNER_ID`

---

## 3. Bayut / Dubizzle API

### INT-BAYUT-001: Purpose

Syndicate listings to Bayut.com and Dubizzle.com (same parent company — Dubizzle Group).

### INT-BAYUT-002: Listing Sync

- **Endpoint:** Bayut Partner API
- **Format:** XML or JSON feed
- **Frequency:** Real-time updates via REST; nightly full reconciliation
- **Required Fields:** Same as PropertyFinder plus Bayut-specific `category` field
- **Status Sync:** Sold/Rented must be synced within 1 hour to prevent double inquiries

### INT-BAYUT-003: Lead Capture

- `POST /api/webhooks/bayut/leads`
- Same treatment as PropertyFinder leads (source = "Bayut")

---

## 4. Firebase / Google Auth

### INT-FIREBASE-001: Authentication

- Firebase Authentication SDK used for Google OAuth social login
- Firebase UID stored in `User.firebaseUid` field
- On first Firebase login, system creates user with role `agent`
- On subsequent logins, Firebase UID matched to existing user
- `POST /api/auth/firebase-sync` — syncs Firebase JWT to platform JWT

### INT-FIREBASE-002: Token Exchange

1. Client authenticates with Firebase SDK (Google OAuth)
2. Client sends Firebase ID token to `/api/auth/firebase-sync`
3. Server verifies token with Firebase Admin SDK
4. Server issues platform JWT (24-hour expiry)

---

## 5. Stripe Payment Gateway

### INT-STRIPE-001: Purpose

Process online payments for:

- Security deposits
- Booking fees
- Platform subscription (future SaaS)

### INT-STRIPE-002: Integration Points

- **Endpoint:** Stripe API v2024
- **Keys:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Webhook:** `POST /api/webhooks/stripe`
- **Events Handled:** `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`

### INT-STRIPE-003: Payment Flow

1. Server creates Payment Intent via Stripe API
2. Client uses Stripe Elements to collect card details (no card data touches our servers)
3. On success, webhook confirms payment; system marks transaction payment as completed

---

## 6. Exchange Rate API

### INT-FX-001: Purpose

Convert property prices from AED to buyer's preferred currency (USD, GBP, EUR, INR, SAR, etc.) for display.

### INT-FX-002: Provider Options (in order of preference)

1. **ExchangeRate-API.com** — free tier (1,500 req/month), paid tier recommended
2. **Open Exchange Rates** — paid, reliable
3. **Fixer.io** — alternative

### INT-FX-003: Caching Strategy

- Rates fetched once per hour and cached in Redis (or in-memory as fallback)
- Stale rate limit: maximum 24 hours before UI shows warning
- If API unavailable, last cached rates used with "Approximate" disclaimer

### INT-FX-004: Display Rule

AED is always the primary price. Converted prices shown as: "≈ $X USD"

---

## 7. Email Service

### INT-EMAIL-001: Purpose

Transactional emails: password reset, welcome, commission notifications, lease reminders.

### INT-EMAIL-002: Provider

- **Primary:** SendGrid (SMTP or API)
- **Fallback:** AWS SES
- **Configuration:** `SENDGRID_API_KEY`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`

### INT-EMAIL-003: Email Types

| Template              | Trigger                      | Recipient          |
| --------------------- | ---------------------------- | ------------------ |
| Welcome               | User account created         | New user           |
| Password Reset        | Reset requested              | User               |
| Commission Approved   | Commission status → Approved | Agent              |
| Lease Expiry Reminder | 60 days before lease end     | Agent + Landlord   |
| Rent Overdue          | 5 days past due              | Tenant             |
| Compliance Alert      | High-risk flag triggered     | Compliance Officer |

---

## 8. SMS Gateway (Future)

### INT-SMS-001: Purpose

SMS as fallback for WhatsApp and for OTP/2FA.

### INT-SMS-002: Provider

- **Recommended:** Twilio or Infobip (UAE coverage)
- **Configuration:** `SMS_PROVIDER`, `SMS_API_KEY`, `SMS_SENDER_ID`

---

## 9. RERA / DLD API (Future Integration)

### INT-RERA-001: Trakheesi Permit Validation

- API to validate permit numbers against RERA's Trakheesi system
- Real-time validation on listing creation
- Note: Formal API access requires partnership agreement with RERA

### INT-DLD-001: Title Deed Verification

- API to verify DLD reference numbers for properties
- Integration roadmap: H2 2026

---

## 10. Integration Architecture Diagram

```
White Caves CRM Platform
├── Outbound Integrations
│   ├── WhatsApp Cloud API (Meta) ──→ Customer messages
│   ├── PropertyFinder API ──→ Listing syndication
│   ├── Bayut API ──→ Listing syndication
│   ├── Stripe API ──→ Payment processing
│   ├── ExchangeRate API ──→ Currency conversion

## Traceability

- Business owner: Platform / Integrations
- SRS counterpart: `WC-SRS-015` and `WC-SRS-009`
- Related business rules: `BR-007`, `BR-010`
- Validation surfaces: webhook logs, sync reports, payment events, auth audit
│   ├── SendGrid / SES ──→ Transactional email
│   └── Firebase Admin SDK ──→ Token verification
│
└── Inbound Webhooks
    ├── POST /api/whatsapp/webhook ← Meta (HMAC verified)
    ├── POST /api/webhooks/propertyfinder/leads ← PropertyFinder
    ├── POST /api/webhooks/bayut/leads ← Bayut
    └── POST /api/webhooks/stripe ← Stripe (signature verified)
```

---

## 11. Integration Development Priorities

| Integration        | Priority | Status            | Dependency        |
| ------------------ | -------- | ----------------- | ----------------- |
| WhatsApp Cloud API | Critical | Partial (UI done) | Meta WABA account |
| Firebase Auth      | Critical | Implemented       | Firebase project  |
| SendGrid Email     | High     | Implemented       | API key           |
| Exchange Rate API  | Medium   | Planned           | API key           |
| PropertyFinder     | High     | Planned           | Partner agreement |
| Bayut              | High     | Planned           | Partner agreement |
| Stripe             | Medium   | Partial           | Stripe account    |
| RERA Trakheesi API | High     | Planned           | RERA agreement    |
| SMS Gateway        | Low      | Backlog           | Provider contract |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team

---

## 12. Integration Acceptance Criteria & Resilience Requirements

### INT-WA-ACC-001: WhatsApp Integration — Acceptance Criteria (Given/When/Then)
- **Given** a valid outbound text message is sent via `POST .../messages`, **When** the Meta API responds with HTTP 200, **Then** the CRM stores `{ waMessageId, status: "sent", sentAt }` against the conversation within 1 second
- **Given** the Meta WhatsApp API is unreachable (network timeout), **When** an outbound message is attempted, **Then** the message is added to a retry queue with status "pending_retry", the agent sees "Message queued — will retry shortly" in the UI, and the system retries with exponential backoff (1 min, 2 min, 4 min, 8 min)
- **Given** an inbound message arrives at the webhook, **When** the server processes it, **Then** HTTP 200 is returned to Meta within 5 seconds (regardless of internal processing state), the message is persisted to DB, and the agent inbox is updated via WebSocket within 2 seconds
- **Given** a webhook request arrives with an invalid or missing `X-Hub-Signature-256` HMAC header, **When** the webhook handler processes it, **Then** it returns HTTP 401 and discards the payload with an error log entry
- **Test Reference:** TC-INT-WA-001

### INT-PF-ACC-001: PropertyFinder Sync — Acceptance Criteria
- **Given** a property status changes from "Available" to "Sold", **When** the status change is saved, **Then** a sync job is enqueued and PropertyFinder receives the status update within 60 seconds via the partner API
- **Given** PropertyFinder API returns an error code (non-200) for a listing sync, **When** the error is received, **Then** the sync status for that property is set to "Sync Error" with the portal's error message stored, and the listing agent receives an in-app notification
- **Given** the nightly full sync runs at 02:00 UAE time, **When** completed, **Then** a sync report is written to the admin dashboard: total listings synced, errors count, listings blocked (e.g., no permit)
- **Given** a property has no valid Trakheesi permit, **When** the sync job runs, **Then** the property is excluded from syndication and the sync log records "Blocked: Missing RERA permit"
- **Test Reference:** TC-INT-PF-001

### INT-STRIPE-ACC-001: Payment Integration — Acceptance Criteria
- **Given** a payment intent is created for AED 50,000 (booking fee), **When** the client completes payment via Stripe Elements, **Then** the `payment_intent.succeeded` webhook fires, the CRM marks the payment as "Paid", and an automated receipt is emailed to the client within 5 minutes
- **Given** a Stripe webhook event arrives, **When** processed, **Then** the server validates the `Stripe-Signature` header against `STRIPE_WEBHOOK_SECRET` before any processing; invalid signatures return HTTP 400 and are logged as security events
- **Given** a payment fails (`payment_intent.payment_failed`), **When** the webhook is received, **Then** the CRM marks the payment attempt as "Failed", the agent is notified, and the transaction status reverts to "Awaiting Payment"
- **Test Reference:** TC-INT-STRIPE-001

### INT-FX-ACC-001: Exchange Rate — Acceptance Criteria
- **Given** a property listing page is displayed in the CRM with AED price, **When** USD conversion is requested, **Then** the converted price displays using rates no older than 4 hours; if rates are stale (> 24 hours), the UI shows "⚠️ Rates may be outdated — last updated: [timestamp]"
- **Given** the exchange rate API is down, **When** a conversion is requested, **Then** the last cached rates are used with a disclaimer "Approximate — rates last updated [date]"; no 500 error is thrown to the user
- **Test Reference:** TC-INT-FX-001

### INT-SEC-001: Integration Security Requirements
All external integrations must satisfy the following security requirements:

| Requirement | Standard |
|-------------|---------|
| All API credentials stored in environment variables | Never committed to version control; rotated every 90 days |
| Webhook signature validation | All webhooks (Meta, Stripe, PF, Bayut) must verify HMAC/signature before processing payload |
| TLS version | All outbound API calls use TLS 1.2+; TLS 1.0/1.1 disabled |
| Credential rotation | Integration credentials reviewed and rotated on API key compromise or every 180 days |
| Error message sanitisation | No API credentials, internal paths, or stack traces returned to client in error responses |
| Timeout handling | All outbound API calls have a maximum timeout: 10 s (standard), 30 s (PDF/document), 60 s (bulk import) |

**Acceptance Criteria:**
- **Given** an integration credential is committed to version control accidentally, **When** detected (via pre-commit hook or CI scan), **Then** the CI pipeline fails and the secret is reported as compromised
- **Given** an external API call times out, **When** the timeout fires, **Then** the calling function returns a structured error `{ "error": "upstream_timeout", "integration": "meta_wa" }` — never hangs the user request
- **Test Reference:** TC-INT-SEC-001

### INT-PDPL-001: Data Processing Agreements
- All integrations that process UAE personal data must have a signed Data Processing Agreement (DPA) on file before going live in production
- DPA status tracked in the Integration Registry (see Section 10 Integration Architecture)
- Integrations without a DPA are flagged with a 🔴 badge in the admin integration settings page

| Integration | Processes UAE PII? | DPA Required? | DPA Status |
|-------------|:------------------:|:-------------:|-----------|
| WhatsApp Cloud API (Meta) | Yes | Yes | Pending |
| PropertyFinder API | Yes (lead data) | Yes | Pending |
| Bayut API | Yes (lead data) | Yes | Pending |
| Stripe | Yes (payment payer) | Yes | Pending |
| SendGrid | Yes (email recipients) | Yes | Pending |
| ExchangeRate-API | No | No | N/A |
| Firebase Auth | Yes (user identity) | Yes | Pending |

---

**Version:** 1.1 | **Last Updated:** June 2026 | **Maintained By:** Technical Team  
**Change Log:** v1.0 — Initial integration specs (March 2026); v1.1 — Added Section 12: acceptance criteria, resilience requirements, security standards, and PDPL DPA tracking (June 2026)
