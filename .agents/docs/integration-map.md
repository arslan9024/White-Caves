# Integration Map — White Caves CRM

> **Version:** 1.0 | **Date:** June 2026 | **Owner:** @Mira + @Zainab  
> **CONSUMES←:** `business_docs/03_ai_assistants/README.md`, `business_docs/05_requirements/integration-requirements.md`  
> **FEEDS→:** `plans/waves/WAVE_23_SDD.md`, `plans/waves/WAVE_24_SDD.md`, `plans/waves/WAVE_25_SDD.md`

---

## Overview

This document maps every external integration consumed by the White Caves CRM platform, organised by domain. Each entry records the provider, API type, authentication method, data direction, rate limits, failure mode, and the internal module that owns it.

---

## 1. Identity & Authentication

### 1.1 Firebase Authentication

| Field | Value |
|---|---|
| Provider | Google Firebase Auth |
| API Type | Firebase SDK + REST (`/identitytoolkit/v3`) |
| Auth Method | Service Account JSON → Admin SDK |
| Data Direction | IN — user UID, email, display name, photoURL |
| Rate Limit | Unlimited for Admin SDK; 100 sign-ups/IP/hour for client SDK |
| Internal Owner | `server/routes/auth.ts`, `src/hooks/useSignIn.ts` |
| Failure Mode | Queue sync; retry with exponential backoff; local auth cache |
| Environment Variables | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` |

### 1.2 Google OAuth 2.0

| Field | Value |
|---|---|
| Provider | Google Identity Platform |
| API Type | OAuth 2.0 Authorization Code |
| Auth Method | Client ID + Secret → access/refresh token |
| Data Direction | IN — profile, email, calendar events |
| Scopes | `profile email https://www.googleapis.com/auth/calendar` |
| Internal Owner | `server/routes/auth.ts` |
| Failure Mode | Redirect to email/password fallback; display OAuth error banner |
| Environment Variables | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |

---

## 2. Property Portals & Listings

### 2.1 PropertyFinder Feed (PF XML)

| Field | Value |
|---|---|
| Provider | PropertyFinder (UAE) |
| API Type | XML Feed (property listing syndication) |
| Auth Method | API key in `X-PF-API-Key` header |
| Data Direction | OUT — property listings (title, price, area, beds, photos, PermitNo) |
| Cadence | Every 4 hours via cron job |
| Required Fields | `PermitNumber` (Trakheesi), `BranchId`, `AgentId`, `RentFrequency` |
| Internal Owner | `server/routes/portals.ts`, `business_docs/09_crm_features/portal-syndication.md` |
| Failure Mode | Log failure to `portal_sync_errors` collection; alert admin; retry next scheduled run |
| Environment Variables | `PF_API_KEY`, `PF_BRANCH_ID` |

### 2.2 Bayut Feed (Dubizzle Group)

| Field | Value |
|---|---|
| Provider | Bayut / Dubizzle Group |
| API Type | JSON REST API |
| Auth Method | ****** (refreshed monthly) |
| Data Direction | OUT — property listings synced from White Caves CRM |
| Cadence | Every 6 hours |
| Internal Owner | `server/routes/portals.ts` |
| Failure Mode | Same as PropertyFinder; portal-specific error codes mapped to CRM alerts |
| Environment Variables | `BAYUT_API_TOKEN`, `BAYUT_ACCOUNT_ID` |

### 2.3 Trakheesi (RERA Permit Validation)

| Field | Value |
|---|---|
| Provider | Dubai Land Department / RERA |
| API Type | REST API |
| Auth Method | DLD API Key + Broker License Number |
| Data Direction | IN — permit status, permit expiry, permit type |
| Use Case | Validate property listing permit before publishing to portals |
| Internal Owner | `business_docs/09_crm_features/trakheesi-integration.md` |
| Failure Mode | Block listing publication; surface manual override for admin; log to audit trail |
| Environment Variables | `TRAKHEESI_API_KEY`, `RERA_BROKER_LICENSE` |

---

## 3. Dubai Land Department (DLD)

### 3.1 DLD Oqood (Off-Plan Registration)

| Field | Value |
|---|---|
| Provider | Dubai Land Department |
| API Type | REST API (DLD Smart Services) |
| Auth Method | DLD developer/broker certificate + API key |
| Data Direction | OUT — Oqood registration payload (buyer, unit, SPA date, payment plan) |
| Data Direction | IN — registration acknowledgement, reference number |
| SLA | Registration must be submitted within 60 days of SPA signing |
| Internal Owner | `business_docs/09_crm_features/dld-integration.md` |
| Failure Mode | Queue failed requests; alert operations manager; retry with exponential backoff; manual submission fallback |
| Environment Variables | `DLD_API_KEY`, `DLD_BROKER_ID` |

### 3.2 DLD Title Deed Verification

| Field | Value |
|---|---|
| Provider | Dubai Land Department |
| API Type | REST (GET `/titleDeed/{titleDeedNumber}`) |
| Auth Method | DLD API Key |
| Data Direction | IN — title deed owner, unit number, encumbrances, mortgage status |
| Use Case | Pre-transfer due diligence; secondary sales workflow |
| Internal Owner | `business_docs/09_crm_features/secondary-sales.md` |
| Failure Mode | Cache last-known result; flag as unverified; block transfer workflow until resolved |
| Environment Variables | `DLD_API_KEY` (shared) |

---

## 4. Communications

### 4.1 Meta WhatsApp Business API (WABA)

| Field | Value |
|---|---|
| Provider | Meta Platforms |
| API Type | REST (Cloud API) + Webhooks |
| Auth Method | Permanent Access Token (WABA) |
| Data Direction | BOTH — outbound messages, inbound webhooks, read receipts |
| Rate Limit | 1,000 free template messages/month; tiered pricing above |
| Conversation Types | Utility, Marketing, Authentication, Service |
| Internal Owner | `business_docs/09_crm_features/whatsapp-integration.md`, `server/routes/whatsapp.ts` |
| Webhook Event | `messages`, `message_status`, `contacts` |
| Failure Mode | Queue failed messages to `whatsapp_outbox`; retry 3× with 10-minute intervals; Slack alert on persistent failure |
| Environment Variables | `META_WHATSAPP_TOKEN`, `META_PHONE_NUMBER_ID`, `META_WABA_ID`, `META_VERIFY_TOKEN` |

### 4.2 Resend (Transactional Email)

| Field | Value |
|---|---|
| Provider | Resend |
| API Type | REST (`/emails`) |
| Auth Method | API Key in `Authorization: Bearer` header |
| Data Direction | OUT — transactional emails (lease expiry, rent reminders, maintenance updates, welcome) |
| Rate Limit | 100 emails/day free tier; 50,000/month on paid plan |
| Internal Owner | `business_docs/09_crm_features/email-automation.md`, `server/services/emailService.ts` |
| Retry Logic | 3 attempts, 10-minute intervals; dead-letter queue for permanent failures |
| Environment Variables | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |

---

## 5. Document & e-Signature

### 5.1 DocuSign

| Field | Value |
|---|---|
| Provider | DocuSign |
| API Type | REST (eSignature API v2.1) |
| Auth Method | OAuth 2.0 JWT Grant (service account) |
| Data Direction | OUT — envelope with document + recipients; IN — signed document + completion webhook |
| Use Case | Tenancy agreement signing, MOU signing, SPA execution |
| Internal Owner | `business_docs/09_crm_features/legal-management.md` |
| Webhook Event | `envelope-completed`, `envelope-declined` |
| Failure Mode | Surface manual signature fallback; alert agent; mark document as `pending_manual_signature` |
| Environment Variables | `DOCUSIGN_ACCOUNT_ID`, `DOCUSIGN_CLIENT_ID`, `DOCUSIGN_PRIVATE_KEY` |

### 5.2 PDF Generation (Puppeteer / PDFKit)

| Field | Value |
|---|---|
| Provider | Internal (Puppeteer headless Chrome or PDFKit) |
| API Type | Internal Node.js service |
| Use Case | Ejari certificate, tenancy agreement, NOC letter, payment receipt, work order |
| Internal Owner | `business_docs/09_crm_features/document-generation.md` |
| Storage | `uploads/documents/{tenantId}/{docType}/{YYYY-MM-DD}/` |
| Failure Mode | Return error to caller; log; do not silently drop document request |

---

## 6. Payments & Finance

### 6.1 Exchange Rate API

| Field | Value |
|---|---|
| Provider | ExchangeRate-API |
| API Type | REST (GET `/{base}/{target}`) |
| Auth Method | API key in URL parameter |
| Data Direction | IN — live FX rates (AED base → USD, EUR, GBP, INR, SAR, QAR, PKR) |
| Cache TTL | 4 hours in-memory Map; optional Redis for multi-instance |
| Rate Limit | 1,500 requests/month (free tier) |
| Internal Owner | `business_docs/09_crm_features/currency-management.md` |
| Failure Mode | Serve cached rate; surface stale-data banner; fallback to manual rate input |
| Environment Variables | `EXCHANGERATE_API_KEY` |

### 6.2 UAE FTA e-Filing (VAT)

| Field | Value |
|---|---|
| Provider | UAE Federal Tax Authority |
| API Type | FTA Online Portal (manual + future API hook) |
| Auth Method | TRN credentials |
| Data Direction | OUT — quarterly VAT return (VAT 201 form), input/output tax summary |
| Cadence | Quarterly |
| Internal Owner | `business_docs/09_crm_features/financial-reporting.md` |
| Note | No public FTA REST API yet; CRM generates pre-filled PDF export for manual submission |

---

## 7. Calendar & Scheduling

### 7.1 Google Calendar (OAuth 2.0)

| Field | Value |
|---|---|
| Provider | Google |
| API Type | Google Calendar API v3 |
| Auth Method | OAuth 2.0 Authorization Code (per-agent) |
| Data Direction | BOTH — 2-way sync: CRM appointment ↔ Google Calendar event |
| Scopes | `https://www.googleapis.com/auth/calendar` |
| Internal Owner | `business_docs/09_crm_features/scheduling-calendar.md` |
| Failure Mode | Mark sync as degraded; continue operating in CRM-only mode; alert agent |
| Environment Variables | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (shared with Google OAuth) |

### 7.2 Microsoft Outlook (Graph API)

| Field | Value |
|---|---|
| Provider | Microsoft |
| API Type | Microsoft Graph API v1.0 |
| Auth Method | OAuth 2.0 (MSAL, per-agent) |
| Data Direction | BOTH — 2-way sync: CRM appointment ↔ Outlook Calendar event |
| Scopes | `Calendars.ReadWrite` |
| Internal Owner | `business_docs/09_crm_features/scheduling-calendar.md` |
| Failure Mode | Same as Google Calendar; graceful degradation |
| Environment Variables | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_TENANT_ID` |

---

## 8. AI & Machine Learning

### 8.1 OpenAI (GPT-4o)

| Field | Value |
|---|---|
| Provider | OpenAI |
| API Type | REST Chat Completions API |
| Auth Method | ****** key |
| Data Direction | OUT — prompt; IN — completion (streamed via SSE) |
| Use Case | AI assistants: Nina (WhatsApp chatbot), Linda (lead scoring), Oracle, Cipher, Atlas, and all 40 personas |
| Token Budget | Standard assistants: 1,000 tokens/request; executive assistants: 2,000/request |
| Daily Cap | Per-assistantId usage cap stored in Redis |
| Internal Owner | `business_docs/09_crm_features/ai-chat.md`, `server/services/ai/` |
| Failure Mode | Fallback to Anthropic Claude; then Groq; then canned response + Slack alert |
| Environment Variables | `OPENAI_API_KEY`, `OPENAI_ORG_ID` |

### 8.2 Anthropic Claude (Fallback)

| Field | Value |
|---|---|
| Provider | Anthropic |
| API Type | REST Messages API |
| Auth Method | `x-api-key` header |
| Use Case | Failover when OpenAI unavailable; used by Quill (document drafting) and Lumen (legal research) |
| Internal Owner | `server/services/ai/providerRouter.ts` |
| Environment Variables | `ANTHROPIC_API_KEY` |

### 8.3 Groq (Fast Inference Fallback)

| Field | Value |
|---|---|
| Provider | Groq |
| API Type | OpenAI-compatible REST |
| Auth Method | ****** key |
| Use Case | Ultra-low latency fallback for chatbot responses (< 200ms target) |
| Internal Owner | `server/services/ai/providerRouter.ts` |
| Environment Variables | `GROQ_API_KEY` |

---

## 9. Media & Virtual Tours

### 9.1 Cloudinary (Image & Video CDN)

| Field | Value |
|---|---|
| Provider | Cloudinary |
| API Type | REST Upload API + Delivery CDN |
| Auth Method | API key + API secret (signed upload) |
| Data Direction | OUT — upload; IN — CDN URL, transformation pipeline |
| Transformations | Auto-format, auto-quality, width/height resize, watermark |
| Max File Size | 50 MB (free tier); 200 MB (paid) |
| Internal Owner | `business_docs/09_crm_features/wave-13-media-upload.md` |
| Failure Mode | Allow local file storage fallback; surface upload error with retry |
| Environment Variables | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

### 9.2 Matterport (3D Virtual Tours)

| Field | Value |
|---|---|
| Provider | Matterport |
| API Type | Embed URL + Matterport API v2 (asset management) |
| Auth Method | API token |
| Data Direction | IN — embed URL, scan status |
| Use Case | Luxury listings: Matterport 3D tour is mandatory (luxury threshold: AED 5M+) |
| Internal Owner | `business_docs/09_crm_features/wave-13-virtual-tour.md` |
| Failure Mode | Display placeholder with "Tour coming soon" and booking form for on-site scan |
| Environment Variables | `MATTERPORT_API_TOKEN` |

### 9.3 Zoom (Virtual Viewings)

| Field | Value |
|---|---|
| Provider | Zoom Video Communications |
| API Type | REST (Meetings API v2) |
| Auth Method | Server-to-Server OAuth |
| Data Direction | OUT — create meeting; IN — join URL, passcode, recording |
| Use Case | Virtual property viewings; AI-assisted virtual tour sessions |
| Internal Owner | `business_docs/09_crm_features/viewings.md` |
| Failure Mode | Fall back to manual meeting link; send link via WhatsApp |
| Environment Variables | `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` |

---

## 10. Infrastructure & DevOps

### 10.1 MongoDB Atlas

| Field | Value |
|---|---|
| Provider | MongoDB |
| API Type | MongoDB Wire Protocol (Prisma ORM) |
| Connection | `mongodb+srv://` connection string |
| Auth Method | Username/password + IP allowlist |
| Tiers | M0 (free, 512 MB) → M5 ($25/mo, 2 GB) → M10 ($57/mo, 2 GB + dedicated) |
| Upgrade Trigger | >80% storage, >200 concurrent connections, or response P99 > 100ms |
| Internal Owner | `server/database.ts`, Prisma schema |
| Environment Variables | `DATABASE_URL` |

### 10.2 Vercel (Frontend + Serverless Functions)

| Field | Value |
|---|---|
| Provider | Vercel |
| API Type | CI/CD + Edge Network |
| Auth Method | Vercel Access Token (CI), GitHub Actions OIDC |
| Regions | Nearest to UAE (London + Singapore edge nodes) |
| Function Limit | 1,024 MB RAM, 30s timeout on Pro plan |
| Internal Owner | `business_docs/14_devops/deployment-runbook.md` |
| Environment Variables | All env vars set via Vercel project settings |

### 10.3 Redis (Caching & Rate Limiting)

| Field | Value |
|---|---|
| Provider | Upstash Redis (serverless) or Redis Cloud |
| API Type | Redis protocol via `ioredis` |
| Use Case | Session cache, real-time counters, rate limiting, AI chat session state |
| TTL Strategy | Session: 24h; Rate limit windows: 15min; AVM cache: 4h; FX rates: 4h |
| Internal Owner | `business_docs/09_crm_features/wave-15-cache-performance.md` |
| Environment Variables | `REDIS_URL`, `REDIS_TOKEN` |

### 10.4 Firebase Cloud Messaging (FCM) — Push Notifications

| Field | Value |
|---|---|
| Provider | Google Firebase |
| API Type | FCM HTTP v1 API |
| Auth Method | Firebase Admin SDK (service account) |
| Data Direction | OUT — push notification payload to device token |
| Use Case | Mobile push: appointment reminders (30 min before), maintenance updates, new message alerts |
| Internal Owner | `server/services/notificationService.ts` |
| Failure Mode | Log delivery failure; fall back to WhatsApp/email notification |
| Environment Variables | Shared Firebase service account (`FIREBASE_PRIVATE_KEY` etc.) |

---

## 11. Compliance & AML

### 11.1 UAE FIU goAML

| Field | Value |
|---|---|
| Provider | UAE Financial Intelligence Unit |
| API Type | Manual portal submission + XML file format |
| Auth Method | FIU registered entity credentials |
| Data Direction | OUT — Suspicious Transaction Report (STR), Suspicious Activity Report (SAR) |
| Threshold | Cash transactions > AED 55,000 or suspicious indicator regardless of amount |
| Internal Owner | `business_docs/10_security/kyc-aml-framework.md`, `plans/COMPLIANCE/` |
| Cadence | On-demand (triggered by compliance officer review) |

### 11.2 CBUAE PEP Screening

| Field | Value |
|---|---|
| Provider | Internal sanctions list + commercial PEP database (LexisNexis or equivalent) |
| API Type | REST (commercial vendor) or manual CSV lookup |
| Auth Method | Vendor API key |
| Use Case | Screen all buyers > AED 2M and all landlords at onboarding |
| Internal Owner | `business_docs/09_crm_features/luxury-segment.md` (HNWI enhanced due diligence) |
| Failure Mode | Block transaction; escalate to compliance officer; do not proceed without clearance |
| Environment Variables | `PEP_SCREENING_API_KEY` |

---

## 12. Analytics & SEO

### 12.1 Google Analytics 4 (GA4)

| Field | Value |
|---|---|
| Provider | Google |
| API Type | gtag.js + Measurement Protocol |
| Auth Method | Measurement ID embedded in frontend; Measurement Protocol API Secret for server-side events |
| Data Direction | OUT — page views, CRM events, e-commerce events (property enquiry, lease signed) |
| Internal Owner | `business_docs/09_crm_features/seo-strategy.md` |
| Environment Variables | `VITE_GA4_MEASUREMENT_ID` |

### 12.2 Meta Pixel

| Field | Value |
|---|---|
| Provider | Meta Platforms |
| API Type | Pixel JS (browser) + Conversions API (server-side) |
| Auth Method | Pixel ID (browser); access token (server-side) |
| Use Case | Retargeting, lead form conversion tracking, campaign ROI |
| Internal Owner | `business_docs/09_crm_features/marketing-campaigns.md` |
| Environment Variables | `VITE_META_PIXEL_ID`, `META_CONVERSION_API_TOKEN` |

---

## Integration Health Dashboard

> Available at `/admin/integrations` (Admin and Lion roles only).

| Integration | Status Indicator | Health Check | Alert Channel |
|---|---|---|---|
| Firebase Auth | 🟢 / 🔴 | `GET /api/v1/health/firebase` | Slack `#ops-alerts` |
| WhatsApp API | 🟢 / 🟡 / 🔴 | `GET /api/v1/health/whatsapp` | Slack + email |
| Resend Email | 🟢 / 🔴 | Webhook delivery stats | Slack `#ops-alerts` |
| PropertyFinder Feed | 🟢 / 🔴 | Last sync timestamp | Slack `#portal-sync` |
| Bayut Feed | 🟢 / 🔴 | Last sync timestamp | Slack `#portal-sync` |
| Trakheesi | 🟢 / 🔴 | `GET /api/v1/health/trakheesi` | Slack `#compliance` |
| DLD API | 🟢 / 🔴 | `GET /api/v1/health/dld` | Slack `#compliance` |
| OpenAI | 🟢 / 🔴 | Token budget remaining | Slack `#ai-ops` |
| Cloudinary | 🟢 / 🔴 | Storage usage % | Slack `#ops-alerts` |
| MongoDB Atlas | 🟢 / 🟡 / 🔴 | Connection pool usage | PagerDuty |
| Redis | 🟢 / 🔴 | Memory usage MB | PagerDuty |
| Exchange Rate API | 🟢 / 🟡 | Cache age (target < 4h) | Slack `#ops-alerts` |

---

## Environment Variable Registry

> All variables below must be present in `.env` (local) and Vercel project settings (production). Never commit secrets to git.

| Variable | Integration | Required | Secret |
|---|---|---|---|
| `DATABASE_URL` | MongoDB Atlas | ✅ | ✅ |
| `FIREBASE_PROJECT_ID` | Firebase | ✅ | ❌ |
| `FIREBASE_CLIENT_EMAIL` | Firebase | ✅ | ✅ |
| `FIREBASE_PRIVATE_KEY` | Firebase | ✅ | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth | ✅ | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | ✅ | ✅ |
| `META_WHATSAPP_TOKEN` | WhatsApp | ✅ | ✅ |
| `META_PHONE_NUMBER_ID` | WhatsApp | ✅ | ❌ |
| `META_WABA_ID` | WhatsApp | ✅ | ❌ |
| `META_VERIFY_TOKEN` | WhatsApp Webhook | ✅ | ✅ |
| `RESEND_API_KEY` | Resend Email | ✅ | ✅ |
| `RESEND_FROM_EMAIL` | Resend Email | ✅ | ❌ |
| `OPENAI_API_KEY` | OpenAI | ✅ | ✅ |
| `OPENAI_ORG_ID` | OpenAI | ❌ | ❌ |
| `ANTHROPIC_API_KEY` | Anthropic | ❌ (fallback) | ✅ |
| `GROQ_API_KEY` | Groq | ❌ (fallback) | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | ✅ | ❌ |
| `CLOUDINARY_API_KEY` | Cloudinary | ✅ | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary | ✅ | ✅ |
| `REDIS_URL` | Redis | ✅ | ✅ |
| `DLD_API_KEY` | DLD | ✅ (prod) | ✅ |
| `DLD_BROKER_ID` | DLD | ✅ (prod) | ❌ |
| `PF_API_KEY` | PropertyFinder | ✅ (prod) | ✅ |
| `BAYUT_API_TOKEN` | Bayut | ✅ (prod) | ✅ |
| `TRAKHEESI_API_KEY` | Trakheesi | ✅ (prod) | ✅ |
| `RERA_BROKER_LICENSE` | Trakheesi/DLD | ✅ | ❌ |
| `DOCUSIGN_ACCOUNT_ID` | DocuSign | ✅ | ❌ |
| `DOCUSIGN_CLIENT_ID` | DocuSign | ✅ | ❌ |
| `DOCUSIGN_PRIVATE_KEY` | DocuSign | ✅ | ✅ |
| `EXCHANGERATE_API_KEY` | Exchange Rate | ✅ | ✅ |
| `MATTERPORT_API_TOKEN` | Matterport | ❌ (luxury) | ✅ |
| `ZOOM_ACCOUNT_ID` | Zoom | ✅ | ❌ |
| `ZOOM_CLIENT_ID` | Zoom | ✅ | ❌ |
| `ZOOM_CLIENT_SECRET` | Zoom | ✅ | ✅ |
| `MICROSOFT_CLIENT_ID` | Microsoft Graph | ❌ (optional) | ❌ |
| `MICROSOFT_CLIENT_SECRET` | Microsoft Graph | ❌ (optional) | ✅ |
| `PEP_SCREENING_API_KEY` | PEP Screening | ✅ (prod) | ✅ |
| `VITE_GA4_MEASUREMENT_ID` | GA4 | ✅ | ❌ |
| `VITE_META_PIXEL_ID` | Meta Pixel | ✅ | ❌ |
| `META_CONVERSION_API_TOKEN` | Meta Pixel | ✅ | ✅ |

---

## Acceptance Criteria

1. Every production environment variable listed above is documented in `.env.example` with a placeholder value.
2. Health check endpoints respond in < 2 seconds for all integrations.
3. WhatsApp webhook verification succeeds within 5 seconds of initial handshake.
4. PDF document generation completes in < 10 seconds for standard documents.
5. AI provider router falls through to secondary/tertiary provider without surfacing an error to the user.
6. Portal syndication (PropertyFinder + Bayut) syncs all active listings within 4 hours of a property status change.
7. DLD Oqood registration alert fires within 1 hour of the 60-day window being reached.
8. FX rates are never served stale beyond 8 hours without a stale-data warning.

---

*Last reviewed: June 2026 | Next review: December 2026*
