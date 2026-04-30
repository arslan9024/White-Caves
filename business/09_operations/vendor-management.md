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


---

## 4. Additional Technology Vendors

### 4.1 Sentry (Error Tracking — Phase 2)

| Field | Details |
|-------|---------|
| Vendor | Functional Software Inc. (Sentry) |
| Service | Application error tracking and performance monitoring |
| Plan | Team ($26/month) or Business ($80/month) |
| Status | ⏳ Pending — implement Phase 2 |
| SDK | `@sentry/node` (backend) + `@sentry/react` (frontend) |
| SLA | 99.9% uptime |
| DPA | Available at sentry.io/legal/dpa |
| Data residency | US (default); EU option available |
| PII consideration | Stack traces may contain PII — configure `scrubFields` + `denyUrls` |
| Cost | ~$26/month Team plan |
| Key contact | Sentry dashboard |
| Action | Sign DPA; configure PII scrubbing before enabling in production |

---

### 4.2 Google Maps API (Property Search)

| Field | Details |
|-------|---------|
| Vendor | Google LLC |
| Service | Maps JavaScript API, Geocoding API, Places API |
| Plan | Pay-as-you-go (Maps: $7/1,000 loads; Geocoding: $5/1,000 requests) |
| Status | ⏳ Phase 3 (interactive map search) |
| Budget estimate | < AED 500/month at expected traffic volume (Phase 3) |
| DPA | Google Cloud Master Agreement + DPA |
| Rate limits | 50 requests/second per project default |
| Key security | Restrict API key by HTTP referrer (whitecaves.ae only) |
| Action | Create project in Google Cloud Console; restrict key before going live |

---

### 4.3 DocuSign (E-Signatures — Phase 2)

| Field | Details |
|-------|---------|
| Vendor | DocuSign Inc. (US) |
| Service | Electronic signature for MOU, SPA, tenancy contracts |
| Plan | Business Pro (AED 400/month); unlimited envelopes |
| Status | ⏳ Phase 2 |
| Legal validity | UAE Electronic Transactions Law No. 1 of 2006 — e-signatures legally binding |
| DPA | DocuSign GDPR-compliant DPA available at docusign.com/legal |
| API | DocuSign eSignature REST API v2.1 |
| Integration | Phase 2: CRM generates pre-filled PDF → DocuSign envelope → signatories notified by email |
| Completion webhook | DocuSign → White Caves webhook → CRM document status updated |
| Action | Sign DocuSign DPA; register account; create envelope templates for Form A, Form B, MOU |

---

### 4.4 Matterport (3D Virtual Tours — Phase 7)

| Field | Details |
|-------|---------|
| Vendor | Matterport Inc. (US) |
| Service | 3D virtual tour hosting and embedding |
| Plan | Professional ($309/year); up to 25 active spaces |
| Status | ⏳ Phase 7 |
| Camera | Matterport Pro2 (purchase AED 4,500) or rent from local photographer |
| Embed | Matterport embed code → White Caves property page `<iframe>` |
| DPA | Available at matterport.com/legal |
| Action | Register account; coordinate with property photographer training |

---

### 4.5 SendGrid (Email Delivery)

| Field | Details |
|-------|---------|
| Vendor | Twilio SendGrid (US) |
| Service | Transactional email delivery + marketing campaigns |
| Plan | Essentials $19.95/month (50,000 emails/month) |
| Status | ✅ Integrated (transactional emails); ⏳ marketing campaigns Phase 3 |
| SDK | `@sendgrid/mail` npm package |
| DPA | Twilio Data Protection Addendum (DPA) — sign at sendgrid.com/policies/dpa |
| Email categories | Transactional (lead notifications, portal alerts) + Marketing (property newsletters) |
| PDPL compliance | Consent required before marketing emails; unsubscribe mechanism mandatory |
| SPF/DKIM | Configure for whitecaves.ae domain to prevent spam flagging |
| Action | Sign SendGrid DPA immediately; configure DKIM records for whitecaves.ae |

---

### 4.6 Prometheus + Grafana (Monitoring — Phase 2)

| Field | Details |
|-------|---------|
| Vendor | Open-source (self-hosted) |
| Service | API metrics collection (Prometheus) + visualisation (Grafana) |
| Hosting | Deployed alongside API server on Railway/Render |
| Status | ⏳ Phase 2 |
| Cost | Infrastructure only (~$10–20/month additional compute) |
| DPA | N/A (self-hosted; no data leaves White Caves infrastructure) |
| Key metrics | API response time p95, request rate, error rate, database query time |
| Dashboards | Grafana: API health, CRM usage, lead velocity, database performance |
| Alerts | PagerDuty-free alternative: Grafana alerting → email + WhatsApp to on-call |
| Action | Configure Prometheus metrics middleware in Express; set up Grafana dashboards |

---

### 4.7 Exchange Rate API (Currency Conversion)

| Field | Details |
|-------|---------|
| Vendor | ExchangeRate-API (exchangerate-api.com) or Open Exchange Rates |
| Service | Real-time currency conversion (AED → GBP/EUR/USD/INR/RUB) |
| Plan | Free tier (1,500 requests/month) → Standard $12/month |
| Status | ⏳ Phase 3 |
| Use case | Property prices displayed in buyer's home currency; mortgage calculators |
| Cache strategy | Cache exchange rates for 4 hours (rates don't change minute-by-minute) |
| DPA | Review terms; no PII processed — low risk |

---

## 5. Vendor Risk Assessment

| Vendor | Criticality | SPOF Risk | Data Exposure | Regulatory Risk | Alternative | BCP Action |
|--------|------------|-----------|-------------|----------------|------------|-----------|
| MongoDB Atlas | Mission-Critical | High — entire data layer | ALL PII + KYC | PDPL data residency compliant | PlanetScale/Supabase (migration cost high) | Multi-region Atlas cluster; daily backups |
| Vercel | High | Medium — frontend only | Minimal (edge logs) | Low | Railway, Netlify, AWS Amplify | Maintain build export; deploy to Netlify within 4h |
| Railway/Render | High | Medium — API layer | All API data in transit | Medium (US host, SCCs needed) | Fly.io, AWS EC2, Azure | Dockerised API → deploy to Fly.io within 2h |
| Google Firebase | High | Low — auth only; JWT cached | Email, name, UID | Low (Google Cloud DPA) | Auth0, Supabase Auth | JWT tokens valid 1h; fallback email/password auth |
| Stripe | High | Low (Phase 2+) — payments | Payment tokens, billing address | PCI-DSS — compliant | Checkout.com, PayTabs (UAE) | Disable payment feature; switch to manual bank transfer |
| Meta/WhatsApp | Medium | Medium (Phase 4) | Phone numbers, message content | High (Meta US; SCCs required) | Twilio for SMS; email fallback | Fall back to email + phone for 48h |
| SendGrid | Medium | Low — email delivery | Email addresses, content | Medium (US; SCCs needed) | Postmark, Amazon SES | Switch to alternative SMTP within 24h |
| Google Maps | Medium | Low — map display | IP address (user-side) | Low | Mapbox, Leaflet + OpenStreetMap | Fallback to static map image + address text |
| Sentry | Low | Low — monitoring only | Error data (PII scrubbed) | Low | Datadog, Rollbar | Logging to file; manual error review |
| Matterport | Low | Low — tours only | None (public tours) | Low | EyeSpy360, Kuula | Remove tour embed; photos only |

---

## 6. Contract & SLA Management

| Vendor | Contract Type | Term | Renewal Date | Auto-Renew | Notice Period | SLA Uptime | Penalty for Breach | Owner |
|--------|-------------|------|-------------|-----------|-------------|-----------|------------------|-------|
| MongoDB Atlas | Pay-per-use + DPA | Monthly | N/A (rolling) | Yes | 30 days to cancel | 99.995% | SLA credits (up to 30% monthly fee) | Lisa |
| Vercel | Subscription | Annual | [Date TBD] | Yes | 30 days | 99.99% | SLA credits | Lisa |
| Railway/Render | Subscription | Monthly | N/A | Yes | 14 days | 99.5–99.9% | No financial penalty | Lisa |
| Firebase | Pay-per-use | Monthly | N/A | Yes | N/A | 99.95% | SLA credits | Daniela |
| Stripe | Revenue share | Ongoing | N/A | Yes | N/A | 99.999% | SLA credits | Theodora |
| SendGrid | Subscription | Monthly | N/A | Yes | 30 days | 99.9% | SLA credits | Aurora |
| Meta/WhatsApp | API access | Annual | [Phase 4] | Yes | 30 days | 99.9% | No formal SLA | Nina |
| DocuSign | Subscription | Annual | [Phase 2] | Yes | 30 days | 99.9% | SLA credits | Laila |
| Google Maps API | Pay-per-use | Monthly | N/A | Yes | N/A | 99.9% | SLA credits | Aurora |
| Matterport | Subscription | Annual | [Phase 7] | Yes | 60 days | 99.9% | No formal SLA | Fei-Fei |

---

## 7. Vendor Escalation Procedures

### 7.1 Escalation Matrix

| Level | Trigger | Channel | Response SLA |
|-------|---------|---------|-------------|
| L1 Self-service | Minor issue; documentation or configuration | Vendor docs, status page, community forum | Self-resolve in < 4 hours |
| L2 Support ticket | Persistent issue affecting non-critical feature | Vendor support portal | 24–48 hours |
| L3 Account manager | Billing dispute, SLA breach, service degradation affecting critical feature | Account manager email/phone | 4 hours (business day) |
| L4 Executive escalation | Extended outage affecting production; data breach | Executive contact + White Caves MD | Immediate |

### 7.2 Vendor-Specific Escalation

| Vendor | L2 Channel | L3 Contact | L4 Emergency |
|--------|-----------|-----------|-------------|
| MongoDB Atlas | support.mongodb.com | Account manager | 24/7 Priority Support (M30+ plan) |
| Vercel | vercel.com/support | Success team | vercel.com/help/emergency |
| Stripe | dashboard.stripe.com/support | Account executive | support@stripe.com + phone |
| Google Firebase | Firebase Console → Support | Google Cloud account manager | Google Cloud Critical Support |
| Meta/WhatsApp | developers.facebook.com/support | Partner manager (Phase 4) | Meta Business Support Centre |

---

## 8. Procurement Process — New Vendor Approval

Before any new vendor is used for production data, complete this process:

### 8.1 Evaluation Steps

```
Step 1: Requirements gathering (1 day)
   └── Define: what data will be processed? what service is needed? what alternatives exist?

Step 2: Market research (1–3 days)
   └── Identify 3 candidate vendors; compare features, pricing, compliance

Step 3: Security assessment (2–5 days)
   └── Review: SOC 2 report, ISO 27001 certificate, pen-test results, DPA availability

Step 4: PDPL compliance check (1 day)
   └── Is data residency acceptable? Are SCCs available? DPA signed before data flows?

Step 5: Legal review (3–7 days)
   └── Legal counsel reviews contract for: data ownership, IP, liability caps, termination rights

Step 6: MD approval (1 day)
   └── One-page briefing: vendor name, service, cost, risk, recommendation

Step 7: DPA signing (1–3 days)
   └── Execute DPA before any personal data flows to vendor

Step 8: Onboarding (1–5 days)
   └── Configure, test in staging environment, security review of integration code
```

### 8.2 Minimum Requirements for Any Vendor Processing PII

| Requirement | Minimum Standard |
|------------|----------------|
| Security certification | SOC 2 Type II OR ISO 27001 |
| DPA availability | DPA must be available and signed before go-live |
| Data residency | UAE preferred; US acceptable with SCCs |
| SLA | ≥ 99.9% uptime for critical vendors |
| Encryption | TLS 1.3 in transit; AES-256 at rest |
| Incident notification | Breach notification to White Caves within 72 hours |
| Sub-processors | Must disclose all sub-processors; notify of changes |

---

**Document Owner:** Operations / Technology (Jaime + Lisa)
**Version History:** v1.0 April 2026 (initial)
**Review Cycle:** Quarterly — updated whenever new vendor added or contract renewed
**Related Documents:**
- `business/09_operations/partnership-framework.md`
- `business/08_compliance/data-privacy-impact-assessment.md` (Third-Party Processor Assessment)
- `business/08_compliance/gdpr-equivalence-assessment.md`
