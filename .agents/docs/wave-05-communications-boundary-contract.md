# WAVE_05 — Communications Boundary Contract (Linda / Nadia / Nina)

## Purpose

Prevent overlap and conflicts between the 3 communications assistants by defining hard ownership boundaries, control points, and escalation authority.

---

## 1) Ownership Matrix

| Capability                                         |    Linda |       Nadia |             Nina |
| -------------------------------------------------- | -------: | ----------: | ---------------: |
| Local device session management (QR/LocalAuth)     | ✅ Owner |          ❌ |               ❌ |
| Personal-number operational sending                | ✅ Owner |          ❌ |               ❌ |
| Official WABA/Meta webhook handling                |       ❌ |    ✅ Owner |               ❌ |
| Template policy/governance                         |       ❌ |    ✅ Owner |        ⚠ Advisor |
| Campaign quality/rate controls (WABA)              |       ❌ |    ✅ Owner |        ⚠ Advisor |
| Cross-lane supervision/policy decisions            |       ❌ |          ❌ |         ✅ Owner |
| Escalation intelligence & override recommendations |       ❌ |  ⚠ Consumer |         ✅ Owner |
| Final compliance gate for outbound messaging       |       ❌ | ✅ Enforcer | ✅ Policy signal |

Legend:

- ✅ Owner = primary implementation authority
- ⚠ Advisor/Consumer = reads/advises but does not own transport

---

## 2) Lane Contracts

## Linda Lane (Execution)

- Owns: LocalAuth sessions, command execution, local campaigns
- Forbidden: WABA template governance, enterprise quality-rating logic
- Inputs: routing directives from Nadia, policy hints from Nina
- Outputs: execution status, message events, session health telemetry

## Nadia Lane (Orchestration)

- Owns: WABA API, webhooks, template sends, compliance enforcement, assignment queues
- Forbidden: low-level LocalAuth session/device controls
- Inputs: inbound webhook events, Nina policy decisions
- Outputs: routed actions, delivery outcomes, audit logs

## Nina Lane (Supervisor)

- Owns: policy scoring, escalation rules, anomaly detection, optimization recommendations
- Forbidden: direct transport execution for Linda/Nadia channels
- Inputs: normalized events from both lanes
- Outputs: decision packets (recommend/require/block/escalate)

---

## 3) Decision Packet Contract (Nina -> Nadia/Linda)

```ts
interface NinaDecisionPacket {
  correlationId: string;
  decisionType: 'allow' | 'require_human' | 'block' | 'priority_boost' | 'route_override';
  confidence: number;
  reasonCodes: string[];
  policyVersion: string;
  targetLane?: 'linda' | 'nadia';
  expiresAt?: string; // ISO timestamp
}
```

Rules:

- `block` decisions are hard-stop for outbound sends
- `require_human` bypasses bot auto-response paths
- `route_override` can redirect only if target lane is healthy

---

## 4) Conflict Resolution Rules

1. **Transport conflict:** Nadia wins for official WABA channels.
2. **Local channel conflict:** Linda wins for agent-device channels.
3. **Policy conflict:** Nina decides; Nadia enforces.
4. **Safety conflict:** Compliance controls override all automation.

---

## 5) SLOs and KPIs by Assistant

### Linda SLOs

- Session availability (local): >= 99.5%
- Reconnect recovery median: < 30s
- Send execution success (non-policy-failed): >= 98%

### Nadia SLOs

- Webhook processing success: >= 99.9%
- Signed webhook reject accuracy: 100%
- Template policy violations reaching transport: 0

### Nina SLOs

- Escalation precision (reviewed): >= 90%
- False block rate: < 1%
- Decision latency (P95): < 300ms

---

## 6) Audit Requirements

Every outbound message must include:

- `lane` (linda|nadia)
- `provider` (localauth|meta|other)
- `decisionPacketId` (if Nina-supervised)
- `optInProofRef` (required for template category)
- `finalStatus` timeline

---

## 7) Rollback & Safety

- If Nina policy service fails:
  - fallback mode = `allow_with_audit` for low-risk categories
  - fallback mode = `block` for restricted/template categories
- If Nadia queue unhealthy:
  - pause campaigns
  - keep conversational replies with strict throttling
- If Linda sessions unstable:
  - disable local campaign features
  - keep status-only telemetry mode
