# Department: Communications

> **Department ID:** `communications`
> **Color:** #25D366 (WhatsApp Green)
> **Reporting To:** Managing Director
> **Status:** ✅ Active

---

## Mission

Own every external and internal communication channel at White Caves, with a primary focus on WhatsApp as the leading client engagement platform in the UAE. The Communications department captures inbound enquiries, pre-qualifies leads, automates conversation routing, and ensures no client message goes unanswered.

---

## Team Structure

| Role | Headcount | Responsibilities |
|------|-----------|-----------------|
| Communications Manager | 1 | Channel strategy, bot oversight, template governance |
| WhatsApp Specialist | 2–4 | Agent number management, inbox monitoring |
| Bot Developer | 1 | NLP flows, automation rules, conversation scripts |
| Translation Specialist | 1 | Arabic/English content management |

---

## Key Responsibilities

1. **WhatsApp Lead Capture** — Capture inbound enquiries across 23+ agent numbers and route to Clara (Sales) via Nadia.
2. **Multi-Agent WhatsApp Management** — Manage all company WhatsApp numbers (Meta Cloud API) via Nadia.
3. **LocalAuth WhatsApp Bot** — Manage secondary WhatsApp automation via Linda (LocalAuth / Baileys).
4. **NLP & Bot Intelligence** — Build and maintain conversation flows, intent detection, and auto-responses via Nina.
5. **Message Template Management** — Create and manage approved WhatsApp Business message templates.
6. **Broadcast Campaigns** — Send property listings, promotions, and event invitations to opted-in contact lists.
7. **Communication History** — Maintain full client communication timelines via Echo.
8. **Multilingual Support** — Provide Arabic/English communication support via Mira.
9. **Agent Status Monitoring** — Track online/offline status of all agent WhatsApp numbers in real time.
10. **Conversation Analytics** — Measure response times, resolution rates, and bot performance.
11. **Escalation Routing** — Detect when bot cannot handle a query and escalate to a human agent instantly.
12. **Opt-out Compliance** — Honour STOP requests and maintain do-not-contact lists per UAE telecom regulations.

---

## AI Assistants

| Assistant | Role | Status |
|-----------|------|--------|
| **Nadia** | WhatsApp Meta Cloud API Manager | ✅ In Code |
| **Linda** | WhatsApp LocalAuth Bot Manager | ✅ In Code |
| **Nina** | WhatsApp NLP Engine & Bot Intelligence | ✅ In Code |
| **Echo** | Client Communication History & Timeline | 🔲 Planned (Phase 4) |
| **Mira** | Multilingual Translation Engine | 🔲 Planned (Phase 8) |

### End-to-End Communication Flow

```
Client sends WhatsApp message to any of 23+ numbers
  ↓
Nadia receives via Meta Cloud API webhook
  ↓
Nina analyses message intent (NLP):
  - "Looking for villa in DAMAC Hills 2" → Lead intent
  - "When is my payment due?" → Finance intent
  - "Maintenance issue in my flat" → Ops intent
  ↓
If Lead intent:
  → Clara creates lead in CRM
  → Sales agent assigned
  → Auto-reply: "Our agent will contact you shortly"

If Finance intent:
  → Theodora fetches payment info
  → Auto-reply with payment details

If Ops intent:
  → Maintenance request created
  → Auto-reply with ticket number

If unrecognised:
  → Escalate to available human agent
  → Agent replies in WhatsApp thread

All messages:
  → Echo logs full conversation timeline
  → Mira translates Arabic ↔ English (Phase 8)
  → Analytics updated in Communications dashboard
```

---

## Core Tools & Systems

| Tool | Purpose |
|------|---------|
| Nadia WhatsApp Manager | 23+ agent numbers, Meta Cloud API |
| Linda LocalAuth Bot | Secondary WhatsApp automation |
| Nina NLP Engine | Intent detection, auto-routing |
| Echo Timeline | Full client message history |
| Mira Translation | Arabic ↔ English real-time |
| Broadcast Module | Mass WhatsApp campaigns |
| Template Manager | WhatsApp Business templates |

---

## API Ownership & Integration Points

| Endpoint | Purpose |
|----------|---------|
| `POST /api/whatsapp/webhook` | Meta Cloud API webhook receiver |
| `POST /api/whatsapp/send` | Send WhatsApp message |
| `GET /api/whatsapp/conversations` | List all conversations |
| `GET /api/whatsapp/agents` | Agent number status |
| `POST /api/whatsapp/broadcast` | Send broadcast campaign |
| `GET /api/whatsapp/templates` | List approved templates |
| `POST /api/bots/intent` | Nina NLP intent detection |
| `GET /api/communications/timeline/:clientId` | Echo communication history |
| `POST /api/translate` | Mira translation endpoint |

---

## KPIs & Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| First Response Time | <2 minutes | WhatsApp timestamps |
| Bot Containment Rate | >60% | Nina analytics |
| Lead Capture Rate | >40% of inbound | CRM cross-reference |
| Message-to-Lead Conversion | >25% | Monthly report |
| Template Approval Rate | >95% | Meta Business Manager |
| Agent Availability Rate | >95% during business hours | Status monitoring |
| Opt-out Rate | <1% | Campaign analytics |

---

## Inter-Department Data Flows

| Department | Direction | Data |
|-----------|-----------|------|
| Sales | Outbound | Lead records from WhatsApp enquiries |
| Operations | Outbound | Maintenance requests, tenant queries |
| Finance | Outbound | Payment queries |
| Compliance | Outbound | Opt-out records, do-not-contact list |
| Customer Experience | Outbound | Communication history to Echo |
| Intelligence | Outbound | Conversation analytics |

---

## Implementation Status

- [x] Nadia WhatsApp Meta Cloud API — in code registry (WhatsAppBotService stubbed)
- [x] Linda LocalAuth Bot — in code registry (stubbed)
- [x] Nina NLP engine — in code registry (stubbed)
- [ ] WhatsAppBotService real API integration (Phase 4)
- [ ] Echo communication history (Phase 4)
- [ ] Broadcast module (Phase 4)
- [ ] Mira multilingual translation (Phase 8)
- [ ] Nina NLP training with property-specific corpus (Phase 4)

---

## Future Roadmap

| Enhancement | Phase | Priority |
|-------------|-------|----------|
| WhatsApp live API integration (real messages) | Phase 4 | Critical |
| Echo client communication history | Phase 4 | High |
| Nina NLP with Dubai property training data | Phase 4 | High |
| Broadcast campaign module | Phase 4 | High |
| Mira Arabic ↔ English translation | Phase 8 | High |
| Voice message transcription | Phase 9 | Medium |
| Email channel integration | Phase 9 | Medium |
| Sentiment analysis on messages | Phase 10 | Low |
