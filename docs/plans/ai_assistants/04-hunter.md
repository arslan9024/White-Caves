# 04 — Hunter · Lead Prospecting AI

> **ID:** `hunter`  
> **Department:** Sales  
> **Title:** Lead Prospecting AI  
> **Color:** `#0D9488` (Teal)  
> **Avatar:** 🎯  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/HunterProspectingCRM/`  
> **Access:** Managing Director, Sales Manager

---

## 1. Overview

Hunter is a **proactive lead generation engine**. While Clara manages inbound leads, Hunter goes out and finds them. He scrapes public listing portals, analyses buyer/seller behavioural patterns, identifies potential clients who haven't yet made contact, and prepares enriched prospect profiles ready for outreach.

---

## 2. Core Responsibilities

1. Scrape Bayut, PropertyFinder, and Dubizzle for property seekers and sellers
2. Enrich prospect data: phone, email, LinkedIn, social media profiles
3. Detect buying/selling intent signals from market activity
4. Push qualified prospects to Clara as new leads
5. Manage automated cold-outreach sequences (WhatsApp + email)
6. Track outreach response rates and conversion from prospect to lead

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Portal scraping | Monitor Bayut/PF for repeated searches, wish-listed properties, expired listings |
| Intent scoring | Signal-based score: repeated area search (3×), saved property (5×), price drop alert (7×) |
| Data enrichment | Cross-reference phone numbers with WhatsApp, email with LinkedIn |
| Prospect profiles | Deduplicated profile cards with all known contact info |
| Outreach sequences | Day 1 WhatsApp, Day 3 SMS, Day 7 email — automated via Nadia |
| Response tracking | Open, replied, converted metrics per sequence |
| Campaign targeting | Feed prospect lists to Olivia for broadcast campaigns |
| Duplicate guard | Prevent same prospect appearing twice (normalise phone number format) |

---

## 4. How It Works — End to End

### Step 1 — Data Collection
Scheduled cron job (daily at 03:00 UAE time) runs `HunterService.collectProspects()`:
- Reads saved search alerts from partner portal APIs
- Scrapes expired/re-listed properties (sellers likely to re-engage)
- Monitors WhatsApp group activity for buyer/investor signals

### Step 2 — Enrichment
For each raw prospect, `HunterService.enrich(prospect)`:
- Normalise phone to E.164 format (+971...)
- Check if phone already exists as a lead (`GET /api/leads?phone=...`) — skip if yes
- Fetch LinkedIn public profile via scraper (optional)
- Assign initial intent score

### Step 3 — Prospect Profile Creation
Enriched prospects stored via `POST /api/prospects`:
```json
{ "name": "...", "phone": "+971...", "email": "...", "source": "bayut_scrape", "intentScore": 62, "area": "Dubai Marina", "budget": 2500000 }
```

### Step 4 — Outreach Sequence Start
If `intentScore >= 50`: automatically start outreach sequence → `POST /api/sequences/start { prospectId, sequenceType: 'warm_outreach' }`.
Sequence Day 1: Nina generates personalised WhatsApp message → Nadia sends it.

### Step 5 — Response Handling
If prospect replies → Nadia captures reply → Nina classifies intent → if interested, `POST /api/leads` (prospect converts to Clara lead with `source: 'hunter'`).

### Step 6 — Analytics
`GET /api/hunter/analytics` returns: prospects collected, enriched, outreach sent, replied, converted. Dashboard shows funnel.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/prospects` | List prospects (filter by score, area, status) |
| POST | `/api/prospects` | Create prospect |
| PATCH | `/api/prospects/:id` | Update intent score, status |
| DELETE | `/api/prospects/:id` | Remove prospect |
| POST | `/api/sequences/start` | Start outreach sequence for a prospect |
| GET | `/api/hunter/analytics` | Collection + conversion funnel |

---

## 6. Data Flows

- **Receives from:** Bayut/PF portal APIs (external), Cipher (area demand signals)
- **Sends to:** Clara (converted prospects as new leads), Nadia (outreach message triggers), Olivia (prospect lists for campaigns)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Hunter CRM dashboard | `src/components/owner/ai/HunterProspectingCRM/` | ✅ Exists (mock) |
| Prospect list | Inside dashboard | 🔲 Planned (wire to API) |
| Outreach sequence builder | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| HunterService | `server/services/HunterService.ts` | 🔲 Planned |
| Prospects CRUD | `server/routes/prospects.ts` | 🔲 Planned |
| SequenceService | `server/services/SequenceService.ts` | 🔲 Planned |
| Cron scraper | `server/jobs/hunterScraper.ts` | 🔲 Planned (Phase 6) |

---

## 9. Access Control

| Role | Can View | Can Trigger Outreach |
|---|---|---|
| `managing_director` | ✅ All | ✅ Yes |
| `sales_manager` | ✅ All | ✅ Yes |
| `agent` | ❌ | ❌ |

---

## 10. Implementation Checklist

- [x] Hunter registered in `AI_ASSISTANTS_REGISTRY`
- [x] Hunter CRM component renders (mock data)
- [ ] `HunterService.ts` — collection and enrichment logic
- [ ] Prospects CRUD backend
- [ ] Outreach sequence engine
- [ ] Cron job for daily scraping (Phase 6 — `node-cron`)
- [ ] Duplicate guard (phone normalisation)
- [ ] Analytics endpoint

---

## 11. Dependencies

- `node-cron` (Phase 6) — scheduled scraping
- Nadia (outreach message delivery)
- Nina (reply intent classification)
- Bayut/PF partner API keys (external)

---

## 12. Future Enhancements

- AI-generated personalised outreach copy per prospect (GPT-4)
- LinkedIn Sales Navigator integration
- Social media listening for property intent signals
- Predictive prospect score using ML (historical conversion patterns)
