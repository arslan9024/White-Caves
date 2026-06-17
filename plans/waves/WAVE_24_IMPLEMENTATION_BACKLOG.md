# Wave 24 — Implementation Backlog

**Wave:** 24  
**Focus:** WhatsApp Automation, AI Chat Engine & In-App Notification Centre  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Entry Gate:** Wave 23 closeout + readiness 60% + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

---

| ID | Requirement IDs | Priority | Task | Owner | Validation Command | Status |
|---|---|---|---|---|---|---|
| W24-001 | REQ-WA-001, REQ-WA-002 | P0 | Build WhatsApp webhook handler: `POST /api/v1/webhooks/meta` — verify `X-Hub-Signature-256`; parse `messages`/`message_status`/`contacts` events; route to intent classifier | @Mira | Unit: invalid signature returns 403; Integration: test message received + routed within 2s | 📋 Planned |
| W24-002 | REQ-WA-003 | P0 | Build Nina property enquiry conversation flow: OpenAI function calling intent classifier → collect area/budget/beds → query properties API → return top 3 with thumbnail + price | @Mira + @Joelle | Integration: simulate 4-turn conversation → 3 property results returned with correct data | 📋 Planned |
| W24-003 | REQ-WA-004 | P0 | Build Nina maintenance request flow: issue description → photo request → priority auto-classification (keyword rules + OpenAI fallback) → create ticket → confirm ticket number + SLA | @Mira | Integration: "water leak" → emergency priority ticket created; "light bulb" → low priority | 📋 Planned |
| W24-004 | REQ-WA-005 | P0 | Implement human handoff triggers: confidence < 70% OR keyword detection ("human", "agent", "مساعدة", "help") OR 3 unresolved turns → create CRM agent task → send handoff message | @Mira + @Joelle | Unit: each trigger fires independently; Integration: agent task created with lead context attached | 📋 Planned |
| W24-005 | REQ-WA-006 | P1 | Build WhatsApp opt-in/opt-out: `whatsapp_consent` collection; `STOP` keyword sets `optedOutAt`; outbound sender checks consent before sending; opt-back-in via `START` keyword | @Barbara | Integration: STOP → no further messages; START → messages resume; consent audit log written | 📋 Planned |
| W24-006 | REQ-WA-007 | P1 | Build broadcast campaign sender: segment by area/budget/stage → `POST /api/v1/whatsapp/broadcast` → queue per-recipient sends → track delivery/read/reply in `broadcast_stats` | @Mira | Integration: 10-recipient test campaign; all delivery receipts recorded; reply tracked | 📋 Planned |
| W24-007 | REQ-AI-001, REQ-AI-002 | P0 | Build AI provider abstraction + SSE streaming endpoint: `GET /api/v1/ai-chat/stream/:sessionId`; provider router (OpenAI → Anthropic → Groq); first token within 500ms; fallback chain tested | @Mira | Integration: mock OpenAI failure → Anthropic used; first token latency < 500ms in load test | 📋 Planned |
| W24-008 | REQ-AI-003 | P0 | Implement context injection per assistant role: property page (property details), lead page (lead history + stage), tenant page (active lease + payments + maintenance) as system message prefix | @Joelle | Unit: context injection produces correct system message for each entity type | 📋 Planned |
| W24-009 | REQ-AI-004, REQ-AI-005 | P1 | Implement session persistence: store last 20 messages per `sessionId` in MongoDB `ai_conversations` (30-day TTL); daily token cap via Redis INCR per `assistantId`; cap enforced at route level | @Barbara | Integration: refresh page → conversation history preserved; exceed daily cap → 429 with reset time | 📋 Planned |
| W24-010 | REQ-SEQ-001, REQ-SEQ-002 | P0 | Build follow-up sequence execution engine: cron every 15 minutes processes `follow_up_queue`; fires WhatsApp/email/task actions; auto-pauses on manual agent contact within 24h | @Mira | Integration: new lead → Day 1 WhatsApp sent; manual contact logged → Day 3 task suppressed | 📋 Planned |
| W24-011 | REQ-SEQ-001 | P1 | Seed built-in sequence templates: new_lead_7day_nurture (Day 1/3/7 actions), lease_renewal_90day (90d/60d/30d/7d), post_viewing_48h (30min/48h actions); UI to activate sequence on lead | @Una + @Mira | Integration: activate new_lead_7day_nurture → all 3 actions fire on correct schedule | 📋 Planned |
| W24-012 | REQ-SEQ-003 | P1 | Build sequence effectiveness report: per-sequence metrics (sent count, open rate, reply rate, viewing booked rate, deal closed rate); display in Analytics dashboard sequences tab | @Una + @Cassie | E2E: run test sequences → view report → metrics calculated correctly | 📋 Planned |
| W24-013 | REQ-NOTIF-001, REQ-NOTIF-002 | P0 | Build `notifications` collection + notification service: create notification on system events; `Socket.io` emit to `notification:{userId}` room; bell badge count via `GET /api/v1/notifications?unread=true` | @Mira | Integration: lead_assigned event → notification created → Socket.io event received within 1s | 📋 Planned |
| W24-014 | REQ-NOTIF-001 | P0 | Build NotificationBell component + NotificationDrawer: bell icon with badge, drawer opens on click, paginated list (20/page), mark read on item click, mark-all-read button | @Una | E2E: receive notification → bell badge shows 1 → open drawer → click → badge clears | 📋 Planned |
| W24-015 | REQ-NOTIF-003 | P1 | Build notification preferences UI: per-user toggle per notification type (in_app, push, email, whatsapp); stored in `notification_preferences` collection; preferences respected in all dispatchers | @Una + @Mira | Integration: disable `lead_assigned.whatsapp` → assign lead → no WhatsApp sent but in-app fires | 📋 Planned |
| W24-016 | All REQ-WA, REQ-AI, REQ-SEQ, REQ-NOTIF | P0 | Wave 24 closeout: governance validation, tracker sync, `npm run plans:validate` green | @Katherine | `npm run plans:validate` passes; trackers updated | 📋 Planned |

---

## Dependency Order

1. W24-001 (webhook) → W24-002 (property flow) → W24-003 (maintenance flow) → W24-004 (handoff)
2. W24-005 (opt-out) + W24-006 (broadcast) run after W24-001
3. W24-007 (SSE provider) → W24-008 (context injection) → W24-009 (session + cap)
4. W24-010 (sequence engine) → W24-011 (templates) → W24-012 (effectiveness report)
5. W24-013 (notification service) → W24-014 (bell UI) → W24-015 (preferences)
6. All tasks → W24-016 (closeout)

---

## Acceptance Gate (Wave-Level)

Wave 24 can be marked complete only when:

1. WhatsApp webhook rejects invalid signature; processes test inbound message within 2 seconds
2. Nina property enquiry completes 4-turn conversation returning 3 property results
3. Maintenance request creates ticket with correct auto-classified priority
4. Human handoff fires on all 3 triggers (confidence, keyword, 3 turns)
5. AI chat SSE stream delivers first token < 500ms; fallback chain verified
6. New lead 7-day nurture all 3 actions fire on correct schedule
7. Notification bell accurate; real-time delivery < 1 second via Socket.io
8. `npm run plans:validate` green
9. Evidence in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
