# 32 — Halo · Client Satisfaction & NPS Tracker

> **ID:** `halo`  
> **Department:** Marketing / Operations  
> **Title:** Client Satisfaction & NPS Tracker  
> **Color:** `#10B981` (Emerald)  
> **Avatar:** ⭐  
> **Phase:** Phase 9 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Operations Manager, Agent (own clients)

---

## 1. Overview

Halo is the **voice of the client** inside White Caves. She automatically surveys clients at key touchpoints (after viewing, after deal closure, after move-in), collects NPS (Net Promoter Score) and CSAT (Customer Satisfaction Score) data, identifies unhappy clients before they post negative reviews, and surfaces service improvement insights. She helps White Caves continuously raise the standard of its luxury client experience.

---

## 2. Core Responsibilities

1. Trigger automated satisfaction surveys at defined touchpoints
2. Calculate and track NPS: "How likely are you to recommend us?" (0–10)
3. Calculate CSAT per transaction and per agent
4. Detect detractors (NPS < 7) and escalate to manager immediately
5. Aggregate feedback themes: identify recurring complaints or praise
6. Produce quarterly CX (Customer Experience) report

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Automated survey triggers | 6 touchpoints: after viewing, after offer, after SPA, after handover, after move-in, 90-day post-move-in |
| Survey types | NPS (0–10 scale), CSAT (1–5 stars), open text |
| WhatsApp surveys | Survey link sent via Nadia; mobile-friendly form |
| Email surveys | Fallback if WhatsApp not available |
| Detractor alert | NPS < 7 → immediate notification to manager and MD |
| Promoter identification | NPS ≥ 9 → request Google/Trustpilot review |
| Agent CSAT breakdown | Average CSAT per agent → integrated with Apex's coaching data |
| Feedback themes | NLP-categorised recurring themes (positive: "Great communication", negative: "Slow response") |
| NPS trend | 30/90/180-day rolling NPS chart |
| Closed-loop resolution | Detractor flagged → manager calls → resolution logged → follow-up survey |

---

## 4. How It Works — End to End

### Step 1 — Survey Trigger Events
Backend events fire `HaloService.triggerSurvey(event)`:
- Deal `spa_signed` → trigger "SPA Experience" survey (48 hours post-signing)
- Lease `active` (move-in) → trigger "Move-in Experience" survey (day 7 post move-in)
- All triggers delayed via queue: survey should arrive after the experience, not during

### Step 2 — Survey Delivery
At trigger time: `HaloService.sendSurvey(clientId, type)` → generates unique survey link (JWT token encoded survey type + client ID) → Nadia sends WhatsApp: "Hi [Name], how was your experience with [Agent]? 2 quick questions: [link]"

### Step 3 — Survey Completion
Client clicks link → mobile-optimised form → 1 question NPS + 1 CSAT + optional comment → `POST /api/halo/responses { token, npsScore, csatScore, comment }`.

### Step 4 — Score Recording
Token decoded → `{ clientId, agentId, surveyType }`. Response saved: `{ clientId, agentId, npsScore, csatScore, comment, touchpoint, timestamp }`.

### Step 5 — Detractor Alert
If `npsScore < 7`:
- Immediate notification to assigned agent's manager: "⚠️ Detractor: [Client] gave NPS 5 after [touchpoint]. Comments: '...'"
- Creates escalation task in Zoe's dashboard
- Manager calls client → logs resolution notes

### Step 6 — Promoter Conversion
If `npsScore >= 9`: auto-send follow-up WhatsApp: "We're so glad you're happy! Would you mind leaving us a Google Review? It takes 1 minute: [link]". Tracks review submission rate.

### Step 7 — Theme Analysis
`HaloService.analyseThemes()` runs weekly → calls `NinaService.classifyFeedback(comments)` → returns theme tags → aggregated into theme frequency chart ("Communication: 45 mentions, Fast Response: 32 mentions, Pricing: 12 complaints").

### Step 8 — Quarterly CX Report
Quill generates PDF: overall NPS trend, top themes, agent rankings by CSAT, improvement recommendations → sent to MD.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/halo/triggers` | Create survey trigger for an event |
| POST | `/api/halo/responses` | Submit survey response |
| GET | `/api/halo/nps` | NPS score (rolling periods) |
| GET | `/api/halo/csat` | CSAT by agent, period, touchpoint |
| GET | `/api/halo/themes` | Feedback theme frequency |
| GET | `/api/halo/detractors` | Active detractor cases |
| PATCH | `/api/halo/detractors/:id` | Log resolution |
| GET | `/api/halo/quarterly-report` | Generate quarterly CX report |

---

## 6. Data Flows

- **Receives from:** Sophia (SPA signed events), Daisy (move-in events), Kairos (VIP post-sale events)
- **Sends to:** Nadia (survey delivery), Apex (agent CSAT data), Zoe (detractor alerts), Quill (quarterly CX report)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Halo CRM dashboard | `src/components/owner/ai/HaloCRM/` | 🔲 Planned |
| NPS trend chart | Inside dashboard | 🔲 Planned |
| Detractor list | Inside dashboard | 🔲 Planned |
| Survey form (public) | `/survey/:token` public route | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| HaloService | `server/services/HaloService.ts` | 🔲 Planned |
| Survey model | Prisma `SurveyResponse` | 🔲 Planned |
| Survey trigger queue | `server/jobs/surveyTriggerJob.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | All scores + detractor management |
| `operations_manager` | All scores |
| `agent` | Own clients' CSAT scores |
| Client | Own survey response via link |

---

## 10. Implementation Checklist

- [ ] Register `halo` in `AI_ASSISTANTS_REGISTRY`
- [ ] SurveyResponse Prisma model
- [ ] Survey trigger queue
- [ ] Survey delivery via Nadia
- [ ] Public survey form route
- [ ] Detractor alert (immediate notification)
- [ ] Promoter Google review link automation
- [ ] Theme analysis via Nina
- [ ] NPS/CSAT analytics endpoints
- [ ] Quarterly CX report (Quill)

---

## 11. Dependencies

- Nadia (survey WhatsApp delivery)
- Nina (feedback theme analysis)
- Sophia, Daisy (event triggers)
- Apex (CSAT data for agent coaching)
- Quill (quarterly report PDF)

---

## 12. Future Enhancements

- Predictive churn model: identify at-risk clients before they become detractors
- Video testimonial collection from promoters
- Multi-language surveys (Arabic via Mira)
- Integration with Trustpilot / Google Business APIs for review management
