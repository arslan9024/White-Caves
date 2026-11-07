# White Caves Real Estate LLC — AEGIS V5.0 Sovereign Agent Constitution

> **Policy:** `2026.11.06-aegis-v5-unified-mesh-v1` | **Control Plane:** `.agents/` | **Mesh:** Dual `1-12-108` (`235` Agents) + `42` Rules (`AEG-001`–`AEG-042`)

---

## 0. SUPREME LAW #0 — Turing Zero-Waste AI Credit & Sub-Second Velocity (`TURING-LAW-000`)

**Every single AI credit and every execution second counts.** This law overrides all non-statutory preferences across every Antigravity chat and subagent:

1. **Parallel Tool Batching (50%–70% Fewer Turns):** Always invoke all independent `read_file`, `edit_file`, `write_file`, and `run_command` calls in **one parallel batch per turn**. Never waste sequential turns on single tool calls.
2. **Surgical Line-Range Reads (`StartLine`/`EndLine`):** Never dump full large files (`prisma/schema.prisma`, lockfiles, archives) into context. Locate symbols via `git grep -n` first, then read only the exact 30–80 line slice needed.
3. **Targeted Single-File Verification (< 2s):** During iteration, run only the affected test (`npx vitest run <path/to/file.test.ts>`). Never run the full 500-file test suite or full production build until final sign-off.
4. **Zero-Token Deterministic Scripts First:** For repetitive, multi-file, or mechanical edits, execute a fast one-liner Node/PowerShell command (`0` LLM tokens) rather than emitting dozens of manual LLM edit blocks.
5. **Cost-Aware Subagent Routing & Concise Output:** When delegating research or simple tasks via `invoke_subagent`, use `Model: "flash_lite"` or `"flash"`. Keep all user responses ultra-concise (zero filler prose, zero repetition) to minimize output token generation cost and latency. Hard ceiling: `<= 15,000` tokens per task.
6. **Multi-Chat Workspace Safety (No Destructive `node_modules` Wipes or Blind Checkouts):** Multiple Antigravity chats operate concurrently in this workspace. NEVER run `rmdir /s /q node_modules`, `Remove-Item node_modules`, `npm ci`, `git checkout -- .`, or `git reset --hard` without explicit user permission. Never re-add `"vite/client"` to `tsconfig.json` `compilerOptions.types` (Vite ambient types live in `src/vite-env.d.ts`).

---

## 1. Canonical Control Plane (`.agents/`)

- `.agents/aegis.agent.json` — Sovereign Orchestrator runtime definition (`V5.0.0`)
- `.agents/orchestrator/policy.json` & `.agents/orchestrator/aegis-engine.js` — Policy & CLI (`npm run aegis:health`, `aegis:squads`, `aegis:dedup`)
- `.agents/aegis/core-loop/turingOrchestrator.ts` — Enforces `TURING-LAW-000` (Credit/Speed), `AEG-003`/`041` (Context Triad), and `AEG-012` (DLD/Ejari idempotency)
- `.agents/aegis/protocols/` — The 5 V5.0 CSV Protocol Matrices (`AEG-001`–`AEG-042`), `ZERO_CONTEXT_OVERCROWDING_MATRIX.md`, and `leaderboardXpHooks.ts` (`AEG-037`–`039`)

---

## 2. Level 0 — Executive Council (`.agents/executive/`)

| Agent | Role | Domain | Tier |
| :--- | :--- | :--- | :--- |
| **`@Ada`** | Chief Architect | System architecture & 90% readiness gate | Premium |
| **`@Margaret`** | Strategic Planner | Wave decomposition & context boundaries | Free (Flash) |
| **`@Grace`** | Lead Engineer / CTO | TypeScript strictness & token shield | Premium |
| **`@Elena`** | Chief Research Officer | DLD/RERA intelligence & preflight briefs | Free (Flash) |
| **`@Zoe`** | Chief Operations Officer | 15m P0 SLA & 120-agent business mesh lead | Free (Llama) |
| **`@Nova`** | Crucible Commander | Protocol: Infinite Crucible & deduplication | Free (Flash) |
| **`@Aurora`** | Principal Systems CTO | Canonical SRS, SAD, API & Prisma schema | Premium |

---

## 3. Track 1 (`108` Engineering Nodes) & Track 2 (`120` Business Assistants)

- **Track 1 (`.agents/aegis-engineering/` & `.agents/skills/aegis-dept-01..12`):** `12` Engineering Depts × `9` Nodes = `108` specialists:
  - `01` Orchestration (`@Ada`, `AEG-001`–`005`,`040`–`042`) | `02` UI/UX (`@Una`, `AEG-008`–`010`) | `03` Mobile (`@Iris`, `AEG-006`–`007`) | `04` Backend (`@Mira`, `AEG-019`–`020`,`027`) | `05` Prisma Data (`@Barbara`, `AEG-013`–`015`,`037`–`039`) | `06` API Gateway (`@Ruchi`, `AEG-011`–`012`) | `07` SecOps (`@Sofia`, `AEG-004`,`016`–`018`) | `08` DevOps/SRE (`@Gwynne`, `AEG-021`–`022`) | `09` Design/PDF (`@Victoria`, `AEG-025`–`026`) | `10` i18n/RTL & FinTech (`@Invoice`, `AEG-005`,`028`–`031`) | `11` Vision/OCR (`@Rania`, `AEG-034`–`036`) | `12` SQA/E2E (`@Rachel_QA`, `AEG-022`–`024`).
- **Track 2 (`.agents/zoe-business-assistants/`):** `12` Brokerage Depts × (`1` Manager + `9` Supervisors) = `120` business assistants wired to `src/config/ai-command-center/master-workforce-grid.json`.

---

## 4. Mandatory AEGIS V5.0 Engineering Laws (`AEG-001` – `AEG-042`)

1. **PROMETHEUS (`AEG-001`–`009`):** Right-Sidebar-only Explorer, Context Triad (`Theme`, `Language`, `Currency`), Level 5 RBAC, native RTL (`dir="rtl"`), filter cache, 12-Way co-location, White Caves Red (`#EF4444`).
2. **TURING (`AEG-010`–`017`):** Zero-runtime CSS variables, 1500ms gov API timeouts, idempotent DLD/Ejari keys, Redux Toolkit slices, relational Prisma models, Husky secret scan, unit door masking.
3. **PHOENIX (`AEG-018`–`025`):** Secret abstraction, streaming shells, strict `tsc --noEmit`, Vitest assertions, Playwright LTR/RTL E2E, stateless DLD parsing.
4. **VALKYRIE (`AEG-026`–`033`):** Static DLD PDF overlays, 90/60/30-day Ejari alerts, 5% UAE FTA VAT + 9% corporate tax reserves, sequential receipts, Zoho Books sync, immutable `COMPLETED` deals.
5. **APOCALYPSE (`AEG-034`–`042`):** Web Worker OCR, gated market reports, campaign attribution, `+500 XP` statutory gate rewards (`StaffProfile`/`MeritLeaderboardLedger`), `60%`–`70%` dynamic splits, `RoleAssignment` 13-floor join table, non-blocking telemetry, `< 350` lines per file.
