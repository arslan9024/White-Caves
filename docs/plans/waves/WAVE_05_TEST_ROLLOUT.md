# WAVE_05_TEST_ROLLOUT — Communications Core Upgrade

## 1. Test Objectives

Validate that Linda, Nadia, and Nina work as a coordinated communications core with strict lane boundaries, policy-safe delivery, and supervisor intelligence.

## 2. Unit Test Suite

### Linda lane

- Session lifecycle (init, QR, ready, disconnect, reconnect)
- send/broadcast command behavior
- adapter contract mapping against imported repo API

### Nadia lane

- webhook signature and idempotency
- queue throttling and retry backoff
- opt-in enforcement and template governance checks

### Nina lane

- policy decision scoring
- escalation/override logic
- anomaly trigger thresholds

## 3. Integration Tests

1. Inbound Meta webhook -> Nadia route -> Nina policy -> assignment outcome
2. Inbound Linda message -> normalization -> Nina policy -> Clara lead update
3. Campaign dispatch with and without opt-in proof
4. Template send blocked on policy violations
5. Cross-lane dedupe and status timeline correctness

## 4. E2E Scenarios

- Customer asks property inquiry -> auto triage -> assigned to agent -> response logged
- Supervisor detects low-confidence intent -> escalates to human
- Campaign to opted-in users sends successfully with delivery statuses
- Simulated provider throttling triggers queue backoff without message loss

## 5. Performance & Reliability

- Queue throughput benchmark under high message load
- Linda reconnect storm simulation
- Webhook burst handling with dedupe integrity
- Dead-letter queue processing and replay test

## 6. Security & Compliance Tests

- Invalid webhook signatures rejected
- Unauthorized role cannot perform assign/close actions
- Template send blocked when consent absent
- Audit trail completeness for supervisor overrides

## 7. Release Gates

- All targeted wave tests pass
- Build passes clean
- No critical security or compliance test failures
- Supervisor metrics visible in dashboard

## 8. Rollback Validation

- Feature-flag off for Nina supervisor returns to safe baseline
- Queue rollback path tested
- Linda adapter fallback path verified
