# WAVE_04_IMPLEMENTATION_BACKLOG — Compliance Baseline

## Priority Backlog

### W4-001 — Enforce property permit requirements

- Owner: @Mira + @Barbara
- Priority: P0
- Exit: listed property transitions blocked when permit requirements are missing

### W4-002 — Add permit expiry monitoring and alert path

- Owner: @Mira
- Priority: P0
- Exit: scheduled job or equivalent detection flags expiring/expired permits for Laila dashboard

### W4-003 — Implement KYC upload and review workflow

- Owner: @Mira + @Barbara
- Priority: P0
- Exit: document upload/list/review path operational and permission-guarded

### W4-004 — Block risky transaction flows without verified KYC

- Owner: @Mira
- Priority: P0
- Exit: non-verified KYC state prevents transaction creation where required

### W4-005 — Build AML service abstraction and flagging flow

- Owner: @Timnit + @Mira
- Priority: P1
- Exit: AML provider adapter exists; flagged results create review signal and audit trail

### W4-006 — Implement PDPL consent controls

- Owner: @Sofia + @Mira
- Priority: P1
- Exit: consent create/revoke/export/delete baseline available

### W4-007 — Surface compliance queues in Laila UI

- Owner: @Lea + @Mira
- Priority: P2
- Exit: dashboard shows permit alerts, KYC review items, AML flags

## Exit Criteria

- Non-compliant publish/transaction flows are blocked or flagged correctly
- KYC and consent baseline exists
- AML adapter and alert flow are in place
- Targeted tests pass
