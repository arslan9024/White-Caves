# Wave 24 — Test Rollout Plan

**Wave:** 24  
**Focus:** WhatsApp Automation, AI Chat Engine & In-App Notification Centre  
**Date:** 2026-06-17  
**QA Owner:** @Katherine + @Vera

---

## Unit Tests

| Test File | Scope | Key Assertions |
|---|---|---|
| `server/routes/webhooks.meta.test.ts` | WhatsApp webhook | Valid signature → 200; invalid signature → 403; message event parsed |
| `server/services/nina.test.ts` | Nina chatbot engine | Property enquiry: 4-turn → 3 results; maintenance: "water leak" → emergency; handoff: keyword triggers |
| `server/services/aiProviderRouter.test.ts` | Provider fallback chain | OpenAI mock fail → Anthropic used; Anthropic fail → Groq; all fail → canned response |
| `server/services/aiContextInjector.test.ts` | Context injection | Property context includes price/area/beds; lead context includes stage/last contact |
| `server/services/followUpEngine.test.ts` | Sequence execution | Day 1 action fires; manual contact pauses sequence; sequence resumes after 24h |
| `server/routes/notifications.test.ts` | Notification routes | GET paginated; PATCH read; PATCH read-all; unauthorized 401 |
| `src/hooks/useNotifications.test.ts` | Notification hook | Bell count updates on Socket.io event; mark-read clears badge |

---

## Integration Tests

| Scenario | Steps | Expected Result |
|---|---|---|
| Nina property enquiry E2E | Send WhatsApp message "I want a 2BR in Dubai Marina budget 1.5M" → wait for Nina reply | Three matching properties returned with prices and thumbnails |
| Nina maintenance ticket | Send "My AC is not working" | Priority `high` ticket created; confirmation message with ticket number sent back |
| Human handoff | Send "I want to speak to a human" | Handoff message sent; CRM task created for assigned agent |
| Opt-out flow | Send "STOP" → send outbound message | `optedOutAt` set; outbound send rejected with 400 opt-out error |
| AI stream latency | `GET /api/v1/ai-chat/stream/:sessionId` | First SSE event within 500ms measured via API benchmark |
| Sequence trigger | Create lead → set stage to `new` → wait 15 min | Day 1 WhatsApp template sent; `follow_up_queue` entry status = `completed` |
| Notification real-time | Assign lead → observe browser | Socket.io `notification:{userId}` event received within 1 second |
| Notification preferences | Disable `lead_assigned.whatsapp` → assign lead | In-app notification created; no WhatsApp sent |

---

## End-to-End (Playwright)

| Test ID | Browser | Scenario |
|---|---|---|
| E2E-WA-001 | Chrome | Simulate inbound WhatsApp webhook → Nina responds with property suggestions |
| E2E-AI-001 | Chrome | Open property page AI assistant → type question → stream renders incrementally |
| E2E-NOTIF-001 | Chrome | Admin assigns lead → notification bell increments from 0 to 1 in real-time |
| E2E-NOTIF-002 | Chrome | Open notification drawer → click notification → badge clears → entity page opens |

---

## Load Tests (Artillery)

```yaml
# artillery-wa-load.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 concurrent webhook events/sec
scenarios:
  - name: WhatsApp webhook
    requests:
      - post:
          url: /api/v1/webhooks/meta
          headers:
            X-Hub-Signature-256: "{{ validSignature }}"
          json:
            object: whatsapp_business_account
            entry: [...]
```

**Pass criteria:** P99 response time < 500ms at 10 req/sec; 0 errors over 60-second window.

---

## Regression Checks

- `npm run test:run:unit` — all existing unit tests pass
- `npm run build` — zero TypeScript errors
- `npm run lint` — zero new errors
- Lead CRUD, property CRUD, viewing CRUD unaffected by new services
- Existing AI assistant components (if any) still render without errors

---

## Rollback Plan

1. Feature flag `whatsapp.chatbot.enabled = false` in `policy.json` → webhook still receives but Nina not invoked
2. Feature flag `aiChat.streaming.enabled = false` → fall back to non-streaming POST response
3. Feature flag `followUp.engine.enabled = false` → cron paused; queued items retained
4. Notification Socket.io can be disabled by setting `notifications.realtime.enabled = false` → polling fallback every 30 seconds
