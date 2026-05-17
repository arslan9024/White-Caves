# WAVE_05_IMPLEMENTATION_BACKLOG — Linda + Nadia + Nina Upgrade

## Reference Artifacts

- `WAVE_05_SDD.md`
- `WAVE_05_READINESS_PACKET.md`
- `WAVE_05_TEST_ROLLOUT.md`
- `WAVE_05_LINDA_REPO_SYNC_BLUEPRINT.md`
- `WAVE_05_COMMUNICATIONS_BOUNDARY_CONTRACT.md`

## Priority Backlog

### W5-001 — Linda source sync foundation

- **Owner:** @Mira
- **Priority:** P0
- **Task:** Import/copy core implementation from `arslan9024/whatsapp-bot-linda` into a bounded integration folder and align service interfaces.
- **Exit:** Linda lane runs via copied core with compatibility adapter, no regressions on existing Linda routes.

### W5-002 — Linda compatibility adapter + contract tests

- **Owner:** @Mira + @Katherine
- **Priority:** P0
- **Task:** Build adapter to map legacy/current route calls to imported Linda core methods.
- **Exit:** Contract tests pass for status/qr/send/broadcast/webhook/history endpoints.

### W5-003 — Nadia WABA queue and throttling hardening

- **Owner:** @Ruchi
- **Priority:** P0
- **Task:** Add provider-aware dispatch queue with pair-rate guard and retry/backoff profiles.
- **Exit:** No direct unsafe send path bypasses queue; throttling behavior is test-covered.

### W5-004 — Nadia template governance module

- **Owner:** @Mira
- **Priority:** P0
- **Task:** Introduce template category/approval/quality checkpoints and reject unsafe sends.
- **Exit:** Campaign and template sends enforce policy and produce auditable outcomes.

### W5-005 — Nadia opt-in registry + compliance gate

- **Owner:** @Daniela + @Sofia
- **Priority:** P0
- **Task:** Persist opt-in proof and block template sends without valid consent.
- **Exit:** Enforcement visible in APIs + logs + error semantics.

### W5-006 — Nina supervisor policy engine v1

- **Owner:** @Joelle + @Mira
- **Priority:** P0
- **Task:** Expand Nina from intent service to policy engine (escalation, route override, anomaly flags).
- **Exit:** Supervisor decisions logged and consumable by Nadia/Linda orchestrator paths.

### W5-007 — Cross-lane routing arbitration

- **Owner:** @Mira
- **Priority:** P1
- **Task:** Add deterministic rules for lane ownership on inbound/outbound events.
- **Exit:** Every message has lane+provider provenance and no duplicate handling paths.

### W5-008 — Communications command center telemetry

- **Owner:** @Cassie + @Mira
- **Priority:** P1
- **Task:** Add dashboards for SLA, conversion, failure rate, escalation quality by lane.
- **Exit:** Metrics and alerts visible in one supervisor view.

### W5-009 — Resilience and failover drills

- **Owner:** @Katherine + @Ruchi
- **Priority:** P1
- **Task:** Simulate webhook outage, queue backlog, Linda disconnect storms, provider errors.
- **Exit:** Runbook + automated checks pass on drill scenarios.

### W5-010 — Documentation + SOP pack

- **Owner:** @Margaret + @Katherine
- **Priority:** P2
- **Task:** Produce operator SOPs for Linda sessions, Nadia policies, Nina overrides.
- **Exit:** Team can run daily operations without engineering intervention.

## Suggested Execution Order (Micro-Waves)

1. W5-001, W5-002
2. W5-003, W5-004, W5-005
3. W5-006, W5-007
4. W5-008, W5-009
5. W5-010

## Acceptance Exit Criteria

- Linda copied core integrated successfully
- Nadia follows WABA policy-safe architecture
- Nina actively supervises both lanes with AI decision logging
- End-to-end communications flows pass functional + resilience tests
