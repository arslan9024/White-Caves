# WAVE_03_IMPLEMENTATION_BACKLOG — WhatsApp CRM Revenue Capture

## Priority Backlog

### W3-001 — Replace WhatsApp stub sends with adapter-backed implementation

- Owner: @Mira
- Priority: P0
- Exit: `WhatsAppBotService` uses `MetaAPIClient` for text/template send paths behind env guard

### W3-002 — Harden webhook verification and idempotency

- Owner: @Radia + @Mira
- Priority: P0
- Exit: webhook handler validates signature/HMAC and deduplicates inbound events

### W3-003 — Persist inbound conversations/messages

- Owner: @Barbara + @Mira
- Priority: P0
- Exit: inbound message updates Nadia conversation/message/queue entities reliably

### W3-004 — Wire Nadia inbox endpoints

- Owner: @Mira
- Priority: P0
- Exit: list/detail/reply/assign/close endpoints available and permission-guarded

### W3-005 — Build Nina first-response state machine

- Owner: @Jaime + @Mira
- Priority: P1
- Exit: Nina classifies simple intents and escalates low-confidence/human requests

### W3-006 — Lead auto-creation from inbound WhatsApp

- Owner: @Mira + @Barbara
- Priority: P1
- Exit: first inbound contact creates or links a CRM lead with source `whatsapp`

### W3-007 — Olivia campaign foundation

- Owner: @Jaime
- Priority: P2
- Exit: campaign model and basic scheduled send path available with rate limiting

## Exit Criteria

- Agent can receive, view, reply, assign, and close a conversation
- Nina handles first-response flow and escalation
- Duplicate webhook processing is blocked
- Targeted tests are green
