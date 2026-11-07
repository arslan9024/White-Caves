# 30 — Olivia · Marketing & Automation Manager

> **ID:** `olivia`  
> **Department:** Marketing  
> **Title:** Marketing & Automation Manager  
> **Color:** `#EC4899` (Pink)  
> **Avatar:** 👩‍🎨  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/OliviaMarketingCRM_NEW/`  
> **Access:** Managing Director, Marketing Manager

---

## 1. Overview

Olivia is the **marketing command centre** for White Caves. She manages campaigns across all digital channels, automates property listing distribution to portals, tracks campaign ROI, and produces content for social media. She feeds qualified prospect lists to Hunter and receives re-targetable lost leads from Clara to convert into warm contacts through nurturing campaigns.

---

## 2. Core Responsibilities

1. Multi-channel campaign management: WhatsApp broadcasts, email, social media, portal listings
2. Property listing syndication: push to Bayut, PropertyFinder, Dubizzle automatically
3. Campaign analytics: impressions, clicks, leads generated, cost per lead
4. Social media content calendar and scheduling
5. Re-targeting: lost/stale leads from Clara → personalised re-engagement campaigns
6. Lead source attribution: which channel generates the best quality leads

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Campaign builder | Create campaign: name, audience, channels, message, schedule, budget |
| Portal syndication | Auto-push listings to Bayut/PF/Dubizzle when Mary sets status to 'listed' |
| WhatsApp broadcast | Integrate with Nadia for compliant template broadcasts |
| Email campaign | SMTP/SendGrid integration for property newsletters |
| Social scheduler | Plan and schedule posts (with Iris-generated visuals) |
| UTM tracking | Auto-append UTM parameters to all links for source attribution |
| Lead attribution | Track each lead back to the campaign/channel that created it |
| Campaign ROI | Cost vs leads generated vs deals closed from campaign |
| Audience segments | Build audiences: investors, families, first-time buyers, specific area interest |
| A/B testing | Test 2 message variants; auto-declare winner after 48 hours |

---

## 4. How It Works — End to End

### Step 1 — Campaign Creation
Marketing manager fills campaign form: `{ name, type: 'property_blast', audience: 'investors', channels: ['whatsapp', 'email'], propertyIds: [...], schedule: '2026-05-01T09:00', budget: 5000 }` → `POST /api/campaigns`.

### Step 2 — Audience Building
`OliviaService.buildAudience('investors')` → queries leads with `budget > 2000000 and type = 'investor'` → returns contact list (phone + email).

### Step 3 — Content Generation
For each property in campaign: Olivia fetches property details + Iris-staged images → generates WhatsApp template message: "🏠 Exclusive Listing: 3-Bed Villa in DAMAC Hills 2 — AED 2.1M | Sea view | ROI 7% guaranteed. Book a viewing: [link]".

### Step 4 — Campaign Launch
At scheduled time: cron triggers `OliviaService.launchCampaign(campaignId)`:
- WhatsApp: calls Nadia `POST /api/whatsapp/broadcast`
- Email: calls `POST /api/email/send-bulk`
- Portal: pushes updated listing to Bayut/PF APIs

### Step 5 — Performance Tracking
Bayut/PF return impression and click webhooks → stored as `CampaignEvent` records. WhatsApp: Nadia reports delivery + read stats. Email: open/click tracked via pixel and redirect.

### Step 6 — Lead Attribution
When a lead is created with `source: 'campaign:X'` or via UTM tracking → linked to campaign. `OliviaService.attributeLead(campaignId, leadId)`. Campaign dashboard shows: sent, delivered, clicked, leads generated, deals closed.

### Step 7 — Re-targeting
Nightly: Clara pushes leads with `status = 'lost' or scoreTrend = 'cooling'` to Olivia's re-target pool → Olivia creates personalised nurture sequence: Day 1 email, Day 7 WhatsApp, Day 30 new property suggestion.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign |
| PATCH | `/api/campaigns/:id` | Update campaign |
| POST | `/api/campaigns/:id/launch` | Launch campaign immediately |
| GET | `/api/campaigns/:id/analytics` | Campaign performance metrics |
| POST | `/api/campaigns/:id/ab-test` | Create A/B variant |
| GET | `/api/syndication` | Portal listing status |
| POST | `/api/syndication/push/:propertyId` | Push single listing to all portals |

---

## 6. Data Flows

- **Receives from:** Mary (new listings for syndication), Clara (lost/stale leads for re-targeting), Iris (staged images for content)
- **Sends to:** Nadia (WhatsApp broadcast campaigns), Email service, Bayut/PF APIs (portal syndication), Hunter (prospect lists)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `OliviaMarketingCRM_NEW` | `src/components/owner/ai/OliviaMarketingCRM_NEW/` | ✅ Exists |
| Campaign list | Inside dashboard | ✅ Exists (mock) |
| Campaign analytics | Inside dashboard | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Campaigns CRUD | `server/routes/campaigns.ts` | 🔲 Planned |
| OliviaService | `server/services/OliviaService.ts` | 🔲 Planned |
| Portal syndication | `server/integrations/PortalSyndicationService.ts` | 🔲 Planned |
| Email service | `server/routes/email.ts` | ✅ Exists (partial) |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full access + budget control |
| `marketing_manager` | Full campaign management |
| `agent` | View campaigns affecting their leads |

---

## 10. Implementation Checklist

- [x] `OliviaMarketingCRM_NEW` renders (mock)
- [x] Olivia registered in `AI_ASSISTANTS_REGISTRY`
- [ ] Campaign model + CRUD backend
- [ ] Audience segment builder
- [ ] Portal syndication service (Bayut/PF API keys needed)
- [ ] WhatsApp broadcast via Nadia
- [ ] Email bulk send via SendGrid
- [ ] UTM tracking on all links
- [ ] Lead attribution to campaigns
- [ ] Campaign analytics endpoint

---

## 11. Dependencies

- Nadia (WhatsApp broadcast)
- `server/routes/email.ts` (email campaigns — extend existing)
- Bayut/PF partner API access (external)
- SendGrid or SES account (external)

---

## 12. Future Enhancements

- AI-generated personalised property recommendation emails per recipient
- Programmatic SEO: auto-generate area guide pages for Google
- Retargeting pixels: Facebook/Google Ads pixel integration
- Influencer marketing tracker for social media campaigns
