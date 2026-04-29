# 20 — Echo · Client Communication History & Timeline

> **ID:** `echo`  
> **Department:** Communications  
> **Title:** Client Communication History & Timeline  
> **Color:** `#F472B6` (Pink)  
> **Avatar:** 📡  
> **Phase:** Phase 4 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Sales Manager, Agent (own clients), Client (own history)

---

## 1. Overview

Echo is the **complete communication memory** of White Caves. Every interaction with every client — WhatsApp messages, emails, calls, viewings, meetings, documents sent — is captured in Echo's unified timeline. Agents never lose context when switching clients or when a colleague covers for them. Echo makes every client feel remembered and every agent look professional.

---

## 2. Core Responsibilities

1. Aggregate all communication channels into a single chronological timeline per client
2. Log: WhatsApp messages (from Nadia/Linda), emails (from email service), calls (manual log), viewings (from Daisy), meetings (from calendar), documents sent (from Quill)
3. Tag interactions by type, outcome, and next action
4. Surface "last contact" and "next planned contact" prominently on lead/client cards
5. Detect communication gaps: clients not contacted in X days → alert agents
6. Provide summary view: "5 WhatsApp, 2 viewings, 1 offer — 23 days of activity"

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Unified timeline | All channels in one chronological feed per client |
| Channel icons | WhatsApp 💬, Email ✉️, Call 📞, Viewing 🏠, Meeting 👥, Document 📄 |
| Interaction log | Log calls manually: duration, outcome, next action |
| Search | Search across all communications: "find all mentions of 'Marina'" |
| Filter | Filter by channel, date range, agent, outcome |
| Gap detection | Alert if client not contacted in configured days (default: 3 for hot, 7 for warm, 14 for cold) |
| Outcome tagging | Tag each interaction: Interested, Not Interested, Follow-up Needed, Deal Advanced |
| Communication summary | Single-line summary of client relationship shown on lead card |
| Export | Full communication log export to PDF for compliance or client dispute |

---

## 4. How It Works — End to End

### Step 1 — Event Ingestion
Every communication event fires `EchoService.log(event)`:
```typescript
interface CommunicationEvent {
  clientId: string;
  agentId: string;
  channel: 'whatsapp' | 'email' | 'call' | 'viewing' | 'meeting' | 'document';
  direction: 'inbound' | 'outbound';
  summary: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  outcome?: 'interested' | 'not_interested' | 'follow_up' | 'deal_advanced';
}
```
Stored in `CommunicationEvent` Prisma model.

### Step 2 — Timeline Assembly
`GET /api/echo/timeline/:clientId` → fetches all events sorted by `timestamp desc`. Returns paginated (20 per page).

### Step 3 — Summary Generation
`EchoService.summarise(clientId)` → aggregates: total per channel, last contact date, days since last contact, open follow-ups count. Returns summary object stored on lead record.

### Step 4 — Gap Detection
Cron (daily 08:00): iterate all active leads → compute `daysSinceContact`. If exceeds threshold by lead status:
- `hot` lead, 3+ days → alert assigned agent
- `warm` lead, 7+ days → alert
- `cold` lead, 14+ days → alert or auto-move to `stale`

### Step 5 — Manual Call Log
Agent completes call → opens quick-log panel → fills: duration, outcome, notes → `POST /api/echo/events { channel: 'call', ... }`. Saves and refreshes timeline.

### Step 6 — WhatsApp Auto-Log
Nadia's webhook handler calls `EchoService.log()` after every processed WhatsApp message → no manual action needed from agent.

### Step 7 — Compliance Export
Compliance request → `GET /api/echo/export/:clientId?format=pdf` → Quill generates timestamped PDF with full communication history.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/echo/timeline/:clientId` | Get chronological communication timeline |
| POST | `/api/echo/events` | Log a communication event |
| GET | `/api/echo/summary/:clientId` | Get communication summary |
| GET | `/api/echo/gaps` | List leads with communication gaps |
| GET | `/api/echo/export/:clientId` | Export full history as PDF |
| GET | `/api/echo/search` | Search across all communications |

---

## 6. Data Flows

- **Receives from:** Nadia (WhatsApp messages), Email service, Manual call logs, Daisy (viewing events), Calendar (meeting events), Quill (document sent events)
- **Sends to:** Clara (last contact update on lead cards), Zoe (communication gap alerts), Laila (compliance export)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Communication timeline | `src/components/crm/CommunicationTimeline/` | 🔲 Planned |
| Quick call log panel | Floating panel on lead detail | 🔲 Planned |
| Gap alert badge | On lead cards in Clara | 🔲 Planned |
| Echo search modal | Global CRM search | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| EchoService | `server/services/EchoService.ts` | 🔲 Planned |
| CommunicationEvent model | Prisma | 🔲 Planned |
| Gap detection cron | `server/jobs/gapDetectionJob.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | All clients + team analytics |
| `sales_manager` | Team clients |
| `agent` | Own assigned clients |
| `client` | Own communications (portal) |

---

## 10. Implementation Checklist

- [ ] Register `echo` in `AI_ASSISTANTS_REGISTRY`
- [ ] `CommunicationEvent` Prisma model
- [ ] `EchoService.log()` and event ingestion
- [ ] Timeline endpoint (paginated)
- [ ] Summary computation
- [ ] Gap detection cron
- [ ] Communication timeline component
- [ ] Nadia auto-log hook
- [ ] Compliance PDF export
- [ ] Tests

---

## 11. Dependencies

- Nadia (WhatsApp event hooks)
- Quill (compliance export PDF)
- `node-cron` (gap detection job)

---

## 12. Future Enhancements

- AI-generated communication quality score per agent
- Automatic meeting notes transcription (via Whisper API)
- Client sentiment timeline (positive/neutral/negative trend)
- CRM activity feed for team collaboration
