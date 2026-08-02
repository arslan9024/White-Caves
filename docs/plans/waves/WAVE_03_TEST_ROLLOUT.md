# WAVE_03_TEST_ROLLOUT — WhatsApp CRM Revenue Capture

## Test Objectives

Validate secure, idempotent, role-aware WhatsApp messaging and inbox behavior.

## Test Matrix

### Unit

- Nina keyword intent classification
- Nina escalation threshold logic
- webhook payload parsing
- outbound retry/backoff logic

### Integration

- inbound webhook creates/updates conversation and message
- duplicate webhook does not create duplicate records
- reply endpoint calls WhatsApp adapter
- assign/close endpoints enforce role permissions

### E2E / Smoke

- agent opens Nadia inbox
- agent replies to conversation
- conversation can be assigned and closed
- Nina escalation surfaces in human inbox

### Security Negative Tests

- unsigned webhook rejected
- unauthorized inbox access rejected with 401/403
- agent without permission cannot assign/close restricted conversations

### Pass Criteria

- core integration paths green
- no duplicate message persistence
- permission failures behave correctly
- build/type/lint gates pass for touched files
