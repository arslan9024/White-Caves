# Technology Upgrade Specifications

> **Last updated:** April 19, 2026
> **Purpose:** Technical specs for key platform upgrades: WhatsApp Cloud API, Stripe, AI Scoring
> **Status:** Research complete, ready for implementation

---

## 1. WhatsApp Cloud API Migration

### 1.1 Current State

- **Library:** whatsapp-web.js v1.34.6 (unofficial, Puppeteer-based)
- **Files:** server/services/whatsapp/lindaClient.ts, metaAPI.ts
- **Issues:** Session persistence fragile, requires browser instance, ToS risk, no template support

### 1.2 Target State

- **API:** Meta WhatsApp Cloud API (official REST)
- **Base URL:** https://graph.facebook.com/v23.0/
- **Auth:** Permanent system user access token (OAuth)
- **Throughput:** 80 messages/second per business phone number
- **Rate limit:** 1 msg/6sec per user pair; 5000 req/hr per active WABA

### 1.3 Migration Plan

#### Step 1: WABA Setup

1. Create Meta Business Portfolio at business.facebook.com
2. Register WhatsApp Business Account (WABA)
3. Add business phone number
4. Complete business verification
5. Create system user and generate permanent access token
6. Permissions needed: whatsapp_business_messaging, whatsapp_business_management, business_management

#### Step 2: Message Templates (Pre-Approved)

| Template Name        | Category  | Body Text                                                                                                                            |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| viewing_confirmation | utility   | Hi {{name}}, your viewing for {{property}} is confirmed for {{date}} at {{time}}. Our agent {{agent}} will meet you at the property. |
| lead_follow_up       | marketing | Hi {{name}}, thank you for your interest in {{property}}. Would you like to schedule a viewing? Reply YES to book.                   |
| payment_reminder     | utility   | Dear {{name}}, a payment of AED {{amount}} is due on {{date}} for {{property}}. Pay online: {{link}}                                 |
| document_ready       | utility   | Hi {{name}}, your {{doc_type}} is ready for review. Download here: {{link}}                                                          |
| rera_expiry_alert    | utility   | Attention {{name}}, your RERA BRN {{brn}} expires on {{date}}. Please renew at rera.ae to avoid penalties.                           |
| lease_renewal        | utility   | Dear {{name}}, your lease for {{property}} expires on {{date}}. Contact us to discuss renewal options.                               |

#### Step 3: Implementation

- New file: server/services/whatsapp/cloudAPI.ts
- Endpoints: sendTextMessage(), sendTemplateMessage(), sendMediaMessage()
- Webhook: Update meta-webhook.ts for incoming message handling
- Verification: GET endpoint returns hub.challenge for webhook setup

#### Step 4: Transition

- Run Cloud API in parallel with lindaClient.ts for 2 weeks
- Route new conversations through Cloud API
- Existing conversations stay on lindaClient until resolved
- Deprecate lindaClient after 30 days

### 1.4 UAE-Specific Compliance

- User opt-in required before sending templates
- Data stored on Meta servers (US/EU) - check UAE data residency requirements
- TRA (Telecom Regulatory Authority) approval may be needed for commercial messaging
- Arabic language support must be included in templates (ar locale)

---

## 2. Payment Gateway Integration (Stripe)

### 2.1 Platform Selection

- **Primary:** Stripe (stripe.com/ae) - best API, 135+ currencies, $1.9T processed 2025
- **Secondary:** Telr (telr.com) - Dubai-based, BNPL via Tabby, local payment methods

### 2.2 Stripe UAE Setup

1. Register UAE entity on Stripe Dashboard
2. KYC: Trade license, Emirates ID of signatory, bank account (AED)
3. Enable currencies: AED (primary), USD, GBP, EUR, INR
4. PCI DSS Level 1 compliant (Stripe handles card data)

### 2.3 Integration Architecture

- **Server-side:** Stripe Node.js SDK (stripe npm package)
- **Client-side:** Stripe Elements (embedded payment form)
- **Use cases:**
  - Commission payouts to agents (Stripe Connect)
  - Deposit collection for property transactions
  - Rent payment processing for tenants
  - Invoice payment links (Stripe Payment Links)

### 2.4 Multi-Currency Service

- Exchange rate API: exchangerate-api.com (free tier: 1500 req/month)
- Cache rates with 1-hour TTL in Redis/in-memory
- Display: Always show AED equivalent alongside original currency
- Supported: AED, USD, GBP, EUR, INR

---

## 3. AI Lead Scoring Engine

### 3.1 Scoring Algorithm

#### Factor Weights

| Factor         | Weight | Sub-Factors                                                                                                                                                    | Scoring Range |
| -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Engagement     | 40%    | WhatsApp response time (<5min: +10, <1h: +7, <24h: +3), property views (>5: +8, >2: +5), viewing requests (+10), document requests (+8)                        | 0-40          |
| Demographic    | 30%    | Budget match (within 10%: +10, within 25%: +7, beyond: +3), area preference match (+5-10), buyer type (investor: +8, end-user: +6, corporate: +10)             | 0-30          |
| Behavioral     | 20%    | Repeated property views (+5-10), time on listing (>2min: +5), inquiry detail level (specific: +8, general: +3), urgency signals (timeline <30d: +10, <90d: +5) | 0-20          |
| Source Quality | 10%    | WhatsApp direct (+10), referral (+8), portal (+6), social media (+4), cold (+2)                                                                                | 0-10          |

#### Score Tiers

| Tier     | Score Range | Color           | Action                                                 | SLA                |
| -------- | ----------- | --------------- | ------------------------------------------------------ | ------------------ |
| Hot      | 80-100      | #22c55e (green) | Immediate agent assignment, auto WhatsApp within 5 min | <5 min response    |
| Warm     | 60-79       | #f59e0b (amber) | Assign within 1 hour, follow-up cadence starts         | <1 hour response   |
| Cold     | 40-59       | #ef4444 (red)   | Queue for batch follow-up, nurture sequence            | <24 hour response  |
| Inactive | 0-39        | #6b7280 (gray)  | Archive after 30 days of no activity                   | Weekly batch email |

### 3.2 Implementation

- File: server/services/ai/leadScoringEngine.ts
- Trigger: On lead creation, lead update, new interaction
- Batch: Cron job re-scores all active leads every 6 hours
- API: GET /api/leads/:id/score (score + breakdown)
- Storage: score field on Lead model, scoreBreakdown JSON field

### 3.3 Future Enhancement (ML Phase)

- When: After 1000+ conversion data points collected
- Model: Gradient boosted trees (XGBoost) or logistic regression
- Features: All factors above + historical conversion patterns
- Training: Monthly retraining on most recent 90 days
- A/B test: Run ML model alongside rule-based for 30 days

---

## 4. Document Generation System

### 4.1 Template Engine

- **Library:** Handlebars.js (lightweight, server-side)
- **Output:** PDF via Puppeteer (HTML-to-PDF) or pdfkit
- **Storage:** Generated docs stored in /api/documents with version tracking

### 4.2 Document Templates

| Document                          | Type       | Fields                                                                 | Usage                 |
| --------------------------------- | ---------- | ---------------------------------------------------------------------- | --------------------- |
| MoU (Memorandum of Understanding) | Sale       | Buyer, seller, property, price, deposit %, conditions, timeline        | Every sale deal       |
| Form F (Tenancy Contract)         | Rental     | Landlord, tenant, property, rent, security deposit, term, Ejari fields | Every rental          |
| NOC (No Objection Certificate)    | Sale       | Developer, owner, property, outstanding dues                           | Resale from developer |
| Commission Invoice                | Finance    | Agent, company TRN, deal reference, amount, VAT (5%), payment terms    | Every closed deal     |
| Viewing Report                    | Operations | Agent, client, properties viewed, feedback, next steps                 | After each viewing    |
| Offer Letter                      | Sale       | Buyer, property, offer price, conditions, validity                     | Making an offer       |

---

## 5. Email Service Integration

### 5.1 Provider Selection

- **Recommended:** Resend (resend.com) - best TypeScript SDK, competitive pricing
- **Alternative:** SendGrid, AWS SES

### 5.2 Email Templates

| Template             | Trigger                          | Channel                 |
| -------------------- | -------------------------------- | ----------------------- |
| Welcome              | New user registration            | Email                   |
| Property Alert       | New listing matches saved search | Email + WhatsApp        |
| Viewing Confirmation | Viewing booked                   | Email + WhatsApp + .ics |
| Document Ready       | Document generated               | Email + WhatsApp        |
| Payment Receipt      | Payment processed                | Email                   |
| RERA Expiry Alert    | 30/15/7 days before expiry       | Email + WhatsApp        |
| Lease Renewal        | 60 days before lease expiry      | Email + WhatsApp        |

---

## 6. Dubai PropTech Market Context

### 6.1 Market Size (2025-2026)

- Dubai property sales: AED 682.5 billion in 2025 (+31% YoY)
- Total transactions: 180,000+ (record year)
- Off-plan: ~45% of all transactions
- Foreign buyers: ~40% of transactions (India, UK, Russia, China top nationalities)

### 6.2 Technology Trends

- Digital KYC becoming standard (Emirates ID + facial recognition)
- AI valuations: Bayut TruEstimate, ValuStrat pricing engine
- Virtual viewings: 360-degree tours standard for off-plan
- Blockchain title deeds: DLD pilot program ongoing
- PropTech funding: $50M+ invested in MENA PropTech startups in 2025

### 6.3 Impact on White Caves

- Build for scale: 1000+ transactions/month capability
- Multi-national support: English + Arabic + Hindi/Urdu
- Mobile-first: 70%+ of property searches on mobile
- Speed: <5 sec page load for property listings
