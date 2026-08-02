# 19 — Nina · WhatsApp NLP Engine & Bot Intelligence

> **ID:** `nina`  
> **Department:** Communications  
> **Title:** WhatsApp NLP Engine & Conversation Intelligence  
> **Color:** `#06B6D4` (Cyan)  
> **Avatar:** 🧠  
> **Phase:** Phase 4 (Planned)  
> **Status:** ✅ In Code — registered; full NLP implementation planned  
> **Access:** System-level only (not directly accessible by users in UI)

---

## 1. Overview

Nina is the **brain of the WhatsApp bot experience**. She operates purely as a logic layer — no webhooks, no message sending. Nadia gives Nina raw inbound text; Nina classifies the intent, extracts structured entities, manages multi-turn conversation state machines, and returns a decision: bot reply, structured data, or "escalate to human". Nina is powered by rule-based NLP with Claude 3.5 Sonnet for complex queries.

---

## 2. Core Responsibilities

1. Classify the intent of every inbound WhatsApp message
2. Extract entities: property type, area, budget range, number of bedrooms, timeline, contact details
3. Manage stateful multi-turn conversations (e.g., property enquiry wizard)
4. Generate natural-language bot responses for simple intents
5. Detect when to escalate to a human agent (low confidence or explicit "speak to agent")
6. Detect language (English / Arabic) and tag for appropriate routing

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Intent classification | 12 intents: property_inquiry, price_check, viewing_request, document_request, payment_query, complaint, greeting, faq, escalation, schedule_viewing, language_change, out_of_scope |
| Entity extraction | area, bedrooms, budget, property_type, timeline, phone, email, name |
| Confidence scoring | 0.0–1.0 per intent; escalate if < 0.60 |
| Conversation state | Track: initial → collecting_requirements → confirming → complete |
| Multi-turn context | Remember previous messages in session (up to 10 turns) |
| Language detection | English (default) / Arabic → flag `language: 'ar'` for Arabic routing |
| Response generation | For confident intents: generate template response with injected entities |
| Fallback handling | Unknown intent or very low confidence → "Let me connect you with an agent" |

---

## 4. How It Works — End to End

### Step 1 — Input Received
Nadia calls `NinaService.process({ message: text, sessionId: contactPhone, history: lastNMessages })`.

### Step 2 — Language Detection
`NinaService.detectLanguage(text)` — uses character range check (Arabic: `\u0600-\u06FF`) + fastText language ID. Result: `'en'` or `'ar'`.

### Step 3 — Intent Classification
**Rule-based pass first** (fast, free):
- Contains "property", "apartment", "villa" → `property_inquiry`
- Contains "price", "cost", "AED" → `price_check`
- Contains "view", "visit", "see" → `viewing_request`
- Contains "problem", "issue", "complaint" → `complaint`

**LLM pass for ambiguous messages** (Claude 3.5):
`prompt: "Classify this WhatsApp message into one of 12 intents: [...]. Message: '{text}'"` → returns JSON `{ intent, confidence, entities }`.

### Step 4 — Entity Extraction
For `property_inquiry`: extract budget (AED regex + LLM), bedrooms (digit + "bed" regex), area (known area list: Dubai Marina, Business Bay, etc.).

### Step 5 — State Machine
Conversation state tracked in Redis (or in-memory Map for Phase 4):
```
'new' → send greeting + ask property type
'property_type_collected' → ask area preference
'area_collected' → ask budget
'budget_collected' → query Prism → send 3 property cards
'cards_sent' → ask "Would you like to view any of these?"
'viewing_requested' → ask preferred date → schedule → confirm → state = 'complete'
```

### Step 6 — Response Generation
Nina returns: `{ action: 'bot_reply', message: '...', nextState: 'area_collected' }` to Nadia.
Or: `{ action: 'escalate', reason: 'low_confidence' }` → Nadia routes to human agent inbox.

### Step 7 — Lead Data Handoff
On `state = 'complete'` for `property_inquiry`: Nina packages collected entities → `POST /api/leads` via Nadia: `{ name, phone, area, budget, bedrooms, source: 'whatsapp_bot' }`.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/nina/process` | Process a single message (used by Nadia) |
| GET | `/api/nina/sessions/:id` | Get conversation session state |
| DELETE | `/api/nina/sessions/:id` | Clear session state |
| GET | `/api/nina/intents` | List all supported intents |
| POST | `/api/nina/train` | Retrain rule set (owner only) |

---

## 6. Data Flows

- **Receives from:** Nadia (raw inbound WhatsApp messages + session context)
- **Sends to:** Nadia (intent + response instruction), Clara (new leads created), Prism (property queries for bot replies)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Nina configuration panel | `src/components/owner/ai/NinaCRM/` | ✅ Exists (mock) |
| Intent test console | Inside dashboard | 🔲 Planned |
| Conversation analytics | Session metrics | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| NinaService | `server/services/NinaService.ts` | 🔲 Planned |
| Intent classifier | `server/services/ai/IntentClassifier.ts` | 🔲 Planned |
| Conversation state | Redis or in-memory Map | 🔲 Planned |

---

## 9. Access Control

Nina is a system-internal service. No direct end-user access. Managing director can view conversation analytics and configure intents.

---

## 10. Implementation Checklist

- [x] Nina registered in `AI_ASSISTANTS_REGISTRY`
- [x] Nina CRM component renders (mock)
- [ ] `NinaService.process()` — main entry point
- [ ] Rule-based intent classifier (12 intents)
- [ ] Entity extraction (area, budget, bedrooms, timeline)
- [ ] Language detection
- [ ] Conversation state machine (5-step property inquiry flow)
- [ ] Claude API integration for complex intents (Phase 4, needs API key)
- [ ] Lead creation on flow completion
- [ ] State storage (Redis preferred, in-memory fallback)
- [ ] Intent test console in Nina dashboard

---

## 11. Dependencies

- Nadia (message routing)
- Claude 3.5 Sonnet API key (Anthropic — external, Phase 4)
- Redis (Phase 4) — conversation state storage
- Prism (property search for bot responses)
- Clara (lead creation)

---

## 12. Future Enhancements

- Arabic NLP model (fine-tuned for UAE real estate Arabic)
- Proactive re-engagement: if session inactive 24h → follow-up message
- Voice message transcription (WhatsApp voice note → Nina processes audio)
- Sentiment analysis for complaint triage
