# Vendor Management Register
# White Caves Real Estate Platform

> **Document ID:** WC-VENDOR-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active — Updated Quarterly
> **Owner:** Operations / Technology (Jaime — Productivity Lead, Lisa — Cloud)
> **Scope:** All third-party vendors, SLAs, contacts, contracts, renewal schedule

---

## 1. Vendor Register Overview

| Category | Total Vendors | Active | Pending |
|---------|--------------|--------|---------|
| Infrastructure / Cloud | 3 | 3 | 0 |
| Property Portals | 2 | 0 (Phase 8) | 2 |
| Communication | 3 | 2 | 1 |
| Financial | 1 | 0 (Phase 2) | 1 |
| Authentication | 1 | 1 | 0 |
| Developer Partners | 3 | 0 (Phase 8) | 3 |
| Analytics | 1 | 0 (Phase 2) | 1 |

---

## 2. Infrastructure & Cloud Vendors

### 2.1 MongoDB Atlas (Database)

| Field | Details |
|-------|---------|
| Vendor | MongoDB Inc. |
| Service | Cloud database (MongoDB Atlas) |
| Plan | M10+ cluster (UAE region) |
| Status | ✅ Active |
| Data location | UAE (primary) |
| SLA | 99.995% uptime (Atlas M10+) |
| Support tier | Support (tickets) |
| Primary contact | MongoDB Atlas support portal |
| Billing | Monthly; auto-renews |
| PDPL consideration | UAE region — data residency compliant |
| DPA | ✅ MongoDB Data Processing Addendum (DPA) |
| Cost driver | Cluster size + storage + operations |
| Key contact | Atlas account: [admin email] |
| Actions | Monitor cluster size as listings scale |

---

### 2.2 Vercel (Frontend Hosting)

| Field | Details |
|-------|---------|
| Vendor | Vercel Inc. (US) |
| Service | Frontend hosting + CDN + edge functions |
| Plan | Pro (recommended for team) |
| Status | ✅ Active |
| Deployment | Auto-deploy on git push to main |
| SLA | 99.99% uptime |
| Support | Support portal |
| DPA | ✅ Available at vercel.com/legal/dpa |
| Cost | USD ~$20/month (Pro plan) |
| Key contact | Vercel dashboard |
| Actions | Upgrade to Enterprise when > 100k visits/month |

---

### 2.3 Railway / Render (Backend Hosting)

| Field | Details |
|-------|---------|
| Vendor | Railway Inc. or Render Inc. (US) |
| Service | Node.js API hosting |
| Plan | Hobby → Pro |
| Status | ✅ Active |
| SLA | 99.5% (Hobby) / 99.9% (Pro) |
| Auto-scaling | Available on Pro plan |
| DPA | Available on request |
| Cost | ~USD $5–50/month depending on compute |
| Key contact | Dashboard |
| Actions | Evaluate move to AWS/GCP UAE region for PDPL when scale requires it |

---

## 3. Property Portal Vendors (Phase 8)

### 3.1 PropertyFinder

| Field | Details |
|-------|---------|
| Vendor | PropertyFinder FZ LLC (Dubai) |
| Service | Listing syndication + lead capture |
| Status | ⏳ Partnership needed before Phase 8 |
| Pricing | Agent subscription: AED 3,000–10,000/month |
| Lead model | Cost-per-lead or subscription |
| API | XML feed (REAXML format) |
| SLA | 99%+ platform uptime |
| Contact | partnerships@propertyfinder.ae |
| DPA | Required (EU-aligned platform) |
| Integration spec | `business_docs/08_market_research/portal-api-research.md` |
| Timeline | Negotiate partnership before Phase 8 (Q4 2027) |

---

### 3.2 Bayut

| Field | Details |
|-------|---------|
| Vendor | Bayut.com / Emerging Markets Property Group (EMPG) |
| Service | Listing syndication + lead capture |
| Status | ⏳ Partnership needed before Phase 8 |
| Pricing | Agent subscription: AED 2,000–8,000/month |
| API | JSON feed API (Bayut partner format) |
| Contact | agent.support@bayut.com |
| DPA | Required |
| Timeline | Negotiate partnership before Phase 8 |

---

## 4. Communication Vendors

### 4.1 Meta / WhatsApp Business API

| Field | Details |
|-------|---------|
| Vendor | Meta Platforms Inc. (US) |
| Service | WhatsApp Business Cloud API |
| Status | ⏳ Approval pending (Phase 4) |
| Model | Free: 1,000 user-initiated conversations/month |
| Pricing above free tier | Per-conversation pricing (varies by country) |
| Approval process | Business verification + WhatsApp Business Account (WABA) |
| Approval timeline | 4–8 weeks |
| DPA | Required before Phase 4 |
| Contact | business.facebook.com/whatsapp |
| Env vars required | WHATSAPP_ACCESS_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_PHONE_NUMBER_ID |
| Action | Start application process now — Phase 4 is blocked until approved |

---

### 4.2 SendGrid (Twilio) — Email

| Field | Details |
|-------|---------|
| Vendor | Twilio SendGrid Inc. (US) |
| Service | Transactional email (confirmations, notifications, reports) |
| Status | ✅ Active (or pending configuration) |
| Plan | Essentials (100 emails/day free; Essentials $19.95/month) |
| SLA | 99.9% delivery |
| DPA | Available at sendgrid.com/policies/dpa |
| Contact | support.sendgrid.com |
| Env vars | SENDGRID_API_KEY |
| PDPL | Cross-border transfer (US); SCCs apply |

---

### 4.3 Twilio — SMS (Phase 9)

| Field | Details |
|-------|---------|
| Vendor | Twilio Inc. (US) |
| Service | SMS 2FA + rental reminders |
| Status | ⏳ Phase 9 (2FA) |
| Pricing | ~USD $0.05 per SMS (UAE) |
| DPA | Available at twilio.com/legal/data-protection-addendum |
| Action | Evaluate when Phase 9 2FA implemented |

---

## 5. Financial Vendors

### 5.1 Stripe (Payments)

| Field | Details |
|-------|---------|
| Vendor | Stripe Inc. (US) |
| Service | Online payment processing (rent, deposits) |
| Status | ⏳ Phase 2 integration required |
| Processing fees | 2.9% + $0.30 per transaction (UAE card) |
| UAE support | ✅ Stripe operates in UAE |
| PCI-DSS | ✅ Stripe is PCI-DSS Level 1 |
| DPA | Available at stripe.com/legal/dpa — must sign before live payments |
| Env vars | STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET |
| Alt consideration | Telr.com (UAE-native, AED billing) — evaluate for local preference |
| Action | Complete DPA + STRIPE_SECRET_KEY integration Phase 2 |

---

## 6. Authentication Vendor

### 6.1 Firebase (Google Authentication)

| Field | Details |
|-------|---------|
| Vendor | Google LLC (US) |
| Service | Firebase Auth — Google OAuth SSO |
| Status | ✅ Configured (sync endpoint currently returns 503) |
| Pricing | Free up to 10,000 monthly active users |
| DPA | ✅ Google Cloud DPA (admin.google.com → Account → Data processing) |
| Env vars | FIREBASE_SERVICE_ACCOUNT_KEY (admin SDK — Phase 2 fix) |
| PDPL | Cross-border transfer (US); Google Cloud SCCs apply |
| Action | Configure firebase-admin SDK (Phase 2 technical debt TD-004) |

---

## 7. Developer Partners (Phase 8)

### 7.1 DAMAC Properties

| Field | Details |
|-------|---------|
| Type | Off-plan developer partner |
| Relationship | White Caves markets DAMAC Hills 2 projects |
| Current status | ⏳ Partnership agreement needed before portal syndication |
| Commission model | 5–7% of unit price (developer paid) |
| Requirements | RERA NOC, signed developer agreement, Form A equivalent |
| Contact | partnerships@damacproperties.com |
| Key info | 9,378+ units, DAMAC Hills 2 = core White Caves inventory |
| Action | Formalise partnership agreement before Phase 8 |

---

### 7.2 Emaar Properties

| Field | Details |
|-------|---------|
| Type | Off-plan developer partner |
| Status | ⏳ Phase 8 partnership |
| Key projects | Dubai Hills, Downtown, Creek Harbour |
| Contact | brokerportal.emaar.com |

---

### 7.3 Meraas / Dubai Holding

| Field | Details |
|-------|---------|
| Type | Off-plan developer partner |
| Status | ⏳ Phase 8 partnership |
| Key projects | City Walk, Bluewaters, Port de La Mer |
| Contact | brokers.meraas.ae |

---

## 8. Vendor Review Schedule

| Review Type | Frequency | Owner |
|------------|---------|-------|
| Cost review | Quarterly | Finance (Theodora) |
| SLA compliance check | Monthly | Operations (Lisa) |
| DPA status review | Annually | Compliance (Laila) |
| Security assessment | Annually | Technology (Ecem) |
| Contract renewal | Before expiry (60-day notice) | Operations (Jaime) |
| Vendor risk assessment | Annually | Compliance (Laila) |

---

## 9. Vendor Risk Register

| Vendor | Risk | Mitigation |
|--------|------|-----------|
| MongoDB Atlas | Outage → all data unavailable | Atlas replica set (3 nodes); RTO 4h; RPO 1h |
| Meta/WhatsApp | API change / policy enforcement → lose channel | Multi-channel comms (email + SMS backup) |
| Vercel | Outage → frontend down | DNS failover to backup (Phase 7) |
| Stripe | Regulatory block → payments failed | Alternative: Telr (UAE) as backup processor |
| PropertyFinder | Contract change → lose listing visibility | Multi-portal (Bayut backup) |

---

**Document Owner:** Operations + Technology (Jaime + Lisa)
**Update Frequency:** Quarterly or when new vendor added / contract changes
**Related:** `business/09_operations/partnership-framework.md`, `business/05_srs_and_engineering/technical-debt-register.md`
