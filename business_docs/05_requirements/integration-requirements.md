# Integration Requirements — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Defines all external system integrations, APIs, and data exchange contracts

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
