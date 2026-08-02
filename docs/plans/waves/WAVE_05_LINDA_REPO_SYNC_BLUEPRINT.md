# WAVE_05 — Linda Repo Sync Blueprint (W5-001/W5-002)

## Objective

Integrate core capabilities from `arslan9024/whatsapp-bot-linda` into White-Caves **without destabilizing** existing production routes:

- `server/routes/linda.ts`
- `server/services/whatsapp/lindaClient.ts`
- `server/services/whatsapp/lindaCampaignService.ts`

## Strategy: Strangler Adapter (Safe Migration)

Do **not** replace the current Linda service in one shot.
Use a compatibility adapter so existing APIs remain stable while imported Linda modules are adopted incrementally.

---

## 1) Source Repo Capability Inventory (Confirmed)

From the Linda repo architecture/docs:

- LocalAuth + whatsapp-web.js multi-session core
- Session/device orchestration (QR, restore, reconnect)
- Message routing + command bridge
- Campaign executor + rate control
- Command system and contact integrations
- Health/doctor tooling and operational scripts

This means White-Caves should import **core session + routing + campaign modules first**, not all 400+ files at once.

---

## 2) Target Folder Layout in White-Caves

```text
server/services/whatsapp/linda-core/
  adapters/
    LindaCoreAdapter.ts
  bridge/
    LindaSessionBridge.ts
    LindaMessageBridge.ts
    LindaCampaignBridge.ts
  imported/
    (copied modules from whatsapp-bot-linda)
  contracts/
    lindaCore.types.ts
    lindaCore.contract.test.ts
```

Rationale:

- `imported/` remains as close to source repo as practical
- `bridge/` handles translation to White-Caves models and logging
- `adapters/` exposes stable methods used by current routes

---

## 3) Compatibility Contract (Must Preserve)

Current route expectations from `server/routes/linda.ts`:

- `initialize(): Promise<void>`
- `getStatus()`
- `getStats()`
- `getQRCode()`
- `isConnected()`
- `disconnect(): Promise<void>`
- `sendMessage(phone, message): Promise<string>`
- `broadcastMessage(phones, message): Promise<Array<{phone,messageId?,error?}>>`
- `getMessageQueue()`
- `getConversations()`
- `getConversationHistory(phone, limit)`

The imported Linda core must be wrapped to satisfy exactly this interface.

---

## 4) Field Mapping Rules

### Message model normalization

Imported Linda structures -> White-Caves `WhatsAppMessage`:

- `id` -> `id`
- `from` -> `from`
- `to` -> `to`
- `body/text/content` -> `body`
- source timestamp -> `timestamp: Date`
- media flags/mime -> `hasMedia` + `type`

### Session status normalization

Imported states -> `LindaStatus` enum:

- connected/ready -> `READY`
- linking/qr/authenticating -> `AUTHENTICATING`
- reconnecting/retrying -> `RECONNECTING`
- disconnected -> `DISCONNECTED`
- fatal/error -> `ERROR`

---

## 5) Migration Phases (Low Risk)

## Phase 1 — Read-only import + contract tests

- Copy minimal source modules into `linda-core/imported/`
- Build `LindaCoreAdapter` with no route changes
- Add contract tests to assert method parity

## Phase 2 — Dual-run shadow mode

- Keep existing `lindaClient` as active path
- Execute imported core in shadow mode for:
  - status snapshots
    n - queue ingestion comparison
  - send dry-run checks
- Compare outputs and log drift

## Phase 3 — Controlled cutover

- Switch route dependency to adapter (feature flag)
- Keep rollback toggle to legacy `lindaClient`
- Monitor errors/latency/reconnect metrics for 72h

## Phase 4 — Legacy cleanup

- Remove dead code only after stability window
- Keep compatibility tests permanently

---

## 6) Feature Flags

Add env toggles:

- `LINDA_CORE_MODE=legacy|shadow|active`
- `LINDA_CORE_STRICT_CONTRACT=true|false`
- `LINDA_CORE_FAIL_OPEN=true|false`

Behavior:

- `legacy`: existing implementation only
- `shadow`: legacy active + imported passive comparison
- `active`: imported adapter active, legacy fallback optional

---

## 7) Security & Ops Controls

- Keep session storage isolated from repo (`.gitignore` enforced)
- No secrets copied from source repo history
- Redact phone numbers in logs where possible
- Rate-limit remains mandatory for campaign sends
- Keep crash-safe reconnect logic with backoff cap

---

## 8) Definition of Done (W5-001/W5-002)

- [ ] Imported core modules committed under `linda-core/imported/`
- [ ] `LindaCoreAdapter` implemented with full compatibility contract
- [ ] `lindaCore.contract.test.ts` covers all route-exposed methods
- [ ] `server/routes/linda.routes.test.ts` passes unchanged or with minimal fixture updates
- [ ] Build passes
- [ ] Rollback path tested (`LINDA_CORE_MODE=legacy`)

---

## 9) Immediate Command Checklist

1. Create `linda-core/` skeleton
2. Add adapter contract types and tests
3. Copy selected source modules from external repo
4. Implement normalization bridges
5. Run Linda test suite + build
6. Enable shadow mode and compare telemetry
