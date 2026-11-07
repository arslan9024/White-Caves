# 05 — Kairos · Luxury Concierge & VIP Experience

> **ID:** `kairos`  
> **Department:** Sales  
> **Title:** Luxury Concierge & VIP Experience Manager  
> **Color:** `#D97706` (Amber)  
> **Avatar:** 👑  
> **Phase:** Phase 10 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Sales Manager, Dedicated Luxury Agent

---

## 1. Overview

Kairos provides **white-glove service** for High-Net-Worth Individual (HNWI) clients. He curates personalised property viewing experiences, coordinates lifestyle services (interior designers, legal advisors, golden visa consultants), manages VIP scheduling, and ensures every touchpoint exceeds expectations. Kairos never lets a luxury client feel they are being processed by a system.

---

## 2. Core Responsibilities

1. Manage the VIP client portfolio — clients with budget > AED 5M
2. Curate personalised property shortlists (< 5 properties, perfectly matched)
3. Coordinate viewing experiences: private tours, helicopter viewings, after-hours access
4. Manage the service partner network: interior designers, lawyers, golden visa agents, movers
5. Track every VIP preference: dogs, artwork style, preferred floors, car collection size
6. Generate concierge itineraries for clients visiting Dubai for property tours

---

## 3. Capabilities

| Capability | Description |
|---|---|
| VIP profile cards | Full client dossier: preferences, budget, family size, lifestyle requirements |
| Property shortlisting | AI-filtered from Mary's inventory — 3 to 5 perfect matches only |
| Viewing scheduler | Private/exclusive viewings with agent + developer liaison |
| Partner directory | Vetted Interior Designers, Lawyers, Visa Agents, Banks — contact + ratings |
| Itinerary builder | Day-by-day schedule for visiting clients: property tours + dining + transfers |
| Communication log | Dedicated concierge message thread (WhatsApp + email) |
| Anniversary/birthday reminders | Re-engagement triggers for warm relationships |
| Gifting tracker | Record gifts sent, value, occasion |

---

## 4. How It Works — End to End

### Step 1 — VIP Flagging
Clara receives a lead with `budget >= 5000000` → automatically tagged `vip: true` → Kairos receives notification: "New VIP lead assigned".

### Step 2 — Dedicated Agent Assignment
Kairos assigns the lead to a dedicated luxury agent (only agents with `tier: 'luxury'` flag). No round-robin — hand-picked by sales manager or MD.

### Step 3 — Preference Profiling
First meeting notes entered into Kairos's VIP profile form: lifestyle preferences, timeline, family size, must-haves, deal-breakers, communication preference (WhatsApp / phone / in-person only).

### Step 4 — Property Shortlisting
Kairos queries Mary for `priceMin: 4500000, priceMax: ∞, bedrooms: X, area: [preferred]` → filters to max 5 properties → builds a beautifully formatted PDF shortlist (via Quill).

### Step 5 — Viewing Experience
Kairos schedules private viewing → `POST /api/viewings` with `type: 'private'` → sends calendar invite to client and agent → coordinates building access passes via developer API.

### Step 6 — Post-Viewing Follow-up
After each viewing, Kairos records client feedback → updates property preference profile → narrows shortlist further.

### Step 7 — Offer & Coordination
Client decides to offer → Kairos coordinates with Sophia (deal creation), Laila (KYC/AML), Evangeline (contract review), and the client's lawyer from the partner directory.

### Step 8 — Post-Sale Relationship
After completion, Kairos schedules 3-month, 6-month, 1-year check-in reminders. Records birthdays, property anniversaries, and lifestyle events for personalised re-engagement.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/vip/clients` | List VIP client profiles |
| POST | `/api/vip/clients` | Create VIP profile |
| PATCH | `/api/vip/clients/:id` | Update preferences |
| POST | `/api/vip/shortlists` | Create property shortlist for VIP |
| POST | `/api/viewings` | Schedule a viewing (private or group) |
| GET | `/api/partners` | List vetted service partners |
| POST | `/api/partners` | Add new partner |
| POST | `/api/concierge/itinerary` | Build visit itinerary |

---

## 6. Data Flows

- **Receives from:** Clara (VIP lead flags), Mary (luxury property inventory), Sophia (deal status updates)
- **Sends to:** Nadia (concierge WhatsApp messages), Quill (shortlist PDF generation), Evangeline (contract coordination), Laila (KYC trigger)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Kairos CRM dashboard | `src/components/owner/ai/KairosCRM/` | 🔲 Planned |
| VIP client profile page | `src/pages/crm/VIPClientPage.tsx` | 🔲 Planned |
| Itinerary builder | Inside dashboard | 🔲 Planned |
| Partner directory | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| VIP clients | `server/routes/vip.ts` | 🔲 Planned |
| Viewings | `server/routes/viewings.ts` | 🔲 Planned |
| Partners directory | `server/routes/partners.ts` | 🔲 Planned |
| Itinerary service | `server/services/ItineraryService.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Can View | Can Edit |
|---|---|---|
| `managing_director` | All VIP clients | ✅ |
| `sales_manager` | All VIP clients | ✅ |
| `luxury_agent` | Assigned only | Own clients |
| All others | ❌ | ❌ |

---

## 10. Implementation Checklist

- [ ] Register `kairos` in `AI_ASSISTANTS_REGISTRY`
- [ ] Create `KairosCRM` component (stub dashboard)
- [ ] VIP client Prisma model (extend User or create separate)
- [ ] Viewings model + CRUD endpoints
- [ ] Partners directory model + CRUD
- [ ] VIP flagging trigger in leads creation flow
- [ ] Itinerary builder UI + PDF export via Quill
- [ ] Tests: `server/routes/vip.test.ts`

---

## 11. Dependencies

- Quill (PDF shortlist generation)
- Mary (luxury property query)
- Nadia (WhatsApp concierge messages)
- Sophia (deal handoff)
- `node-cron` (anniversary/birthday reminders)

---

## 12. Future Enhancements

- Helicopter/yacht viewing booking integration
- Dedicated mobile app for VIP clients (white-labelled)
- Golden visa progress tracker
- Multi-currency display for international buyers (via Crest)
