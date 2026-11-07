# Wave 24 — Readiness Packet

**Wave:** 24  
**Focus:** WhatsApp Automation, AI Chat Engine & In-App Notification Centre  
**Date:** 2026-06-17  
**Readiness Assessed By:** @Margaret + @Elena

---

## Readiness Score: 78% ✅ (Exceeds 60% Unlock Threshold)

---

## Gate Criteria Checklist

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Business rules documented | ✅ | `whatsapp-integration.md` — full spec including WABA setup, templates, opt-in/out, chatbot flows |
| 2 | API contract defined | ✅ | 13 endpoints defined in `WAVE_24_SDD.md#api-endpoints` |
| 3 | Data schema defined | ✅ | `whatsapp_messages`, `whatsapp_consent`, `ai_conversations`, `notifications`, `notification_preferences` schemas in SDD |
| 4 | ≥1 test scenario per requirement | ✅ | All 16 backlog items have validation commands |
| 5 | Dependency wave complete or unblocked | 🟡 | Requires Wave 23 push infrastructure (FCM tokens); can re-use same token collection |
| 6 | Free-agent planning preflight done | ✅ | `@Joelle` AI chat spec complete; `@Jaime` WhatsApp integration spec complete |
| 7 | Security review | ✅ | Webhook signature verification enforced; opt-out consent stored immutably; AI token caps prevent runaway spend |
| 8 | Multi-language coverage | ✅ | Arabic/English language detection specified in Nina flow |

---

## Source Documents

| Document | Sections Referenced | Readiness |
|---|---|---|
| `business_docs/09_crm_features/whatsapp-integration.md` | WABA setup, templates, Nina chatbot flows, human handoff | ✅ Complete |
| `business_docs/09_crm_features/ai-chat.md` | SSE streaming, context injection, provider abstraction | ✅ Complete |
| `business_docs/09_crm_features/follow-up-automation.md` | Sequence builder, templates, execution engine | ✅ Complete |
| `business_docs/08_integrations/integration-map.md` | WhatsApp, OpenAI, Anthropic, Groq env vars | ✅ Complete |
| `business_docs/09_crm_features/analytics-dashboard.md` | Sequence effectiveness report section | ✅ Complete |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Meta template approval delays (24–48h review) | High | Medium | Seed templates in sandbox mode; do not block implementation on approval |
| OpenAI rate limits during high-volume testing | Medium | Medium | Groq fallback for test runs; mock provider available in test env |
| Arabic intent classification accuracy < 70% | Medium | High | Hybrid: keyword rules first, OpenAI as fallback; escalate to human if still < 70% |
| Socket.io connection drops on mobile | Medium | Low | Auto-reconnect in 1s; missed notifications delivered on next `GET /notifications` poll |
| WhatsApp 24-hour window enforcement | Low | Medium | Conversation timestamps tracked; template selector shown automatically when window expired |

---

## Recommended Daily Coding Targets

| Day | Tasks | Expected Output |
|---|---|---|
| Day 1 | W24-001, W24-007 | Webhook handler + AI SSE stream both working |
| Day 2 | W24-002, W24-008 | Nina property enquiry + AI context injection |
| Day 3 | W24-003, W24-004 | Maintenance flow + human handoff |
| Day 4 | W24-005, W24-006 | Opt-out + broadcast campaign |
| Day 5 | W24-009, W24-010 | AI session/cap + sequence engine |
| Day 6 | W24-011, W24-013 | Sequence templates + notification service |
| Day 7 | W24-012, W24-014, W24-015 | Effectiveness report + bell UI + preferences |
| Day 8 | W24-016 | Closeout + governance |
