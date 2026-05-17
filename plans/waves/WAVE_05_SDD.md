# WAVE_05_SDD — Communications Core Upgrade (Linda + Nadia + Nina)

## 1. Feature Overview

- **Feature/Module:** Communications Department Core Modernization
- **Wave ID:** WAVE_05
- **Date:** May 16, 2026
- **Owners:** @Mira (implementation), @Daniela (security/auth), @Ruchi (scaling), @Katherine (QA)
- **Business Owner:** @Ada / @Margaret

## 2. Strategic Objective

Upgrade the 3 communications assistants into a layered, non-overlapping architecture:

1. **Linda** = LocalAuth execution lane (agent-device WhatsApp sessions)
2. **Nadia** = Official WABA/Meta orchestration lane (enterprise API, webhooks, compliance, templates)
3. **Nina** = AI supervisor lane (cross-channel policy, quality, escalation intelligence, optimization)

Target outcome: a resilient communications stack that supports UAE real-estate volume, policy compliance, and high conversion operations.

## 3. Role Boundaries (Hard Contract)

### 3.1 Linda (Execution Lane)

- **Source of truth implementation:** `arslan9024/whatsapp-bot-linda` (copy and align into this repo)
- **Primary scope:**
  - whatsapp-web.js + LocalAuth session lifecycle
  - agent personal-number operations
  - quick command execution and local sending
  - campaign execution on approved local channels
- **Must not own:**
  - enterprise template governance
  - WABA quality-rating policy logic
  - global routing policy decisions

### 3.2 Nadia (WABA Orchestration Lane)

- **Primary scope:**
  - Meta Cloud API + webhooks
  - template lifecycle and campaign controls
  - conversation routing + assignment + compliance logs
  - delivery status, quality monitoring, throughput protection
- **Best-practice basis:**
  - Meta WhatsApp Business Platform docs (Cloud API, Webhooks, Templates, rate limits, opt-in)
  - BSP-compatible patterns (Twilio/360dialog class integrations as optional adapter lanes)
- **Must not own:**
  - local device session QR/control (Linda lane)
  - AI supervision governance (Nina lane)

### 3.3 Nina (AI Supervisor Lane)

- **Primary scope:**
  - cross-lane policy engine (quality, escalation, compliance checks)
  - intent/lead intelligence + supervisor overrides
  - routing recommendations + anomaly detection
  - performance optimization loop across Linda and Nadia
- **Must not own:**
  - direct transport adapter responsibilities
  - low-level provider credentials lifecycle

## 4. Architecture Design

## 4.1 Target Topology

- **Transport adapters:** LindaAdapter, MetaWabaAdapter (+ optional BSP adapters)
- **Orchestrator:** NadiaRouter service
- **Supervisor:** NinaPolicyEngine
- **Persistence:** unified conversation/message/campaign audit models
- **Security layer:** RBAC + signed webhook verification + outbound guardrails

## 4.2 Event Flow

1. Inbound event from Meta webhook OR Linda inbound queue
2. Event normalized to shared message contract
3. Nadia router resolves owner lane + queue target
4. Nina policy engine scores intent/risk/priority
5. Action: auto-response / assign / escalate / close
6. Delivery + status updates persisted and emitted to analytics

## 4.3 Adapter Strategy

- Keep adapter interfaces strict:
  - `sendText`, `sendTemplate`, `sendMedia`, `markRead`, `health`, `capabilities`
- Metadata per message:
  - `sourceLane` (linda|nadia)
  - `provider` (localauth|meta|twilio|360dialog)
  - `policyVersion` (Nina supervisor ruleset)

## 5. External Platform Alignment (Nadia)

## 5.1 Must-Have WABA Controls

- Opt-in registry and enforceable checks before template sends
- Template quality and rejection handling
- Pair-rate and throughput aware dispatch queue
- Dead-letter queue for failed sends and webhook retries
- Webhook signature verification and idempotent processing

## 5.2 Optional BSP Expansion (Phase 2)

- Add provider abstraction for Twilio/360dialog/Infobip without replacing Meta-first path
- Use BSP only when needed for:
  - multichannel contact-center integrations
  - fallback/regional routing needs
  - managed operations constraints

## 6. Data Model Enhancements

- Add/confirm normalized message contract fields:
  - `lane`, `provider`, `providerMessageId`, `dedupeKey`, `statusTimeline`
- Add supervisor decision log:
  - `decisionType`, `confidence`, `reasonCodes`, `policyVersion`
- Add campaign governance fields:
  - `optInSnapshot`, `templateCategory`, `qualityCheckpoint`, `throttleProfile`

## 7. Security & Compliance

- Mandatory signed webhooks for Meta lane
- Credential segregation:
  - Linda local session storage isolated from WABA secrets
- Fine-grained permissions:
  - view/reply/assign/close already introduced for WhatsApp surfaces
- Compliance controls:
  - opt-in proof trails
  - data retention + export paths
  - PDPL-safe auditability

## 8. Observability & Reliability

- Metrics:
  - first-response SLA, handoff latency, conversion by lane, failed-send rate, escalation rate
- Alerts:
  - webhook signature failures
  - quality rating deterioration
  - queue depth spikes
  - Linda session churn/reconnect storm
- Tracing:
  - correlation id from inbound to final delivery/assignment

## 9. Rollout Plan

### Phase A — Contract Stabilization

- Freeze assistant boundaries and interfaces
- Introduce lane ownership docs and API contracts

### Phase B — Linda Repo Sync

- Copy core Linda repo implementation and map to existing route/service surface
- Build compatibility shim where naming or model differs

### Phase C — Nadia WABA Hardening

- Implement production-grade queueing, opt-in controls, template governance, DLQ

### Phase D — Nina Supervisor Upgrade

- Expand Nina from classifier to policy supervisor and optimization engine

### Phase E — Cross-Lane Burn-In

- load tests, failover drills, campaign simulations, policy audits

## 10. Success Criteria

- Linda local lane works with stable session persistence and controlled campaigns
- Nadia lane meets WABA best-practice baseline (security, quality, throughput, compliance)
- Nina can supervise both lanes and enforce escalation/policy decisions
- No role overlap ambiguity remains in code/docs
- Build + targeted tests pass clean
