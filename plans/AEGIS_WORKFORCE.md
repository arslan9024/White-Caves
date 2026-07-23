# AEGIS Workforce Map

**Purpose:** Maps the six AEGIS vectors to concrete agent assignments from the Aegis 170 V3 roster.  
**Authority:** Aegis 170 V3 — 120 free planning specialists + 50 premium implementation agents.  
**Source:** `AGENTS.md` + `.github/copilot-instructions.md` roster sections.  
**Owner:** @Ada (Chief Architect) + @Zoe (COO — WIP enforcement)

---

## Quick Reference

| Vector | Name                      | Lead      | Deputy     | Free-Agent Research                              |
| ------ | ------------------------- | --------- | ---------- | ------------------------------------------------ |
| V1     | Runtime Blocker Hardening | @Mira     | @Petra     | @Iris (tech trends), @Dalia (perf benchmarks)    |
| V2     | Superuser Auth            | @Daniela  | @Radia     | @Chloe (threat intel), @Priya (legal/compliance) |
| V3     | MD Dashboard Design       | @Una      | @Cyra      | @Yara (UX research), @Rana (mobile UX)           |
| V4     | Dedup & Dead-Code         | @Grace    | @Katherine | @Iris (tooling), @Hana (SEO/build perf)          |
| V5     | Plans & Business Docs     | @Margaret | @Elena     | @Aisha (market data), @Nour (product discovery)  |
| V6     | AEGIS Infrastructure      | @Ada      | @Zoe       | @Wafa (DevOps/cloud), @Rima (BI/strategic)       |

---

## Vector 1 — Runtime Blocker Hardening

**Lead:** @Mira (CTO/API Lead — Backend & API Dept)  
**Deputy:** @Petra (Real-time API & GraphQL Architecture Specialist)  
**Premium executor:** Coder agent  
**Verification:** QA agent (@Katherine)

| Sub-task                              | Assignee                                      | Free research support            | Status  |
| ------------------------------------- | --------------------------------------------- | -------------------------------- | ------- |
| V1.1 — Stub gap matrix                | @Mira                                         | @Iris: tech-trends brief         | Pending |
| V1.2 — Stripe STRIPE_ENABLED fallback | @Mira                                         | —                                | Pending |
| V1.3 — DLD/Ejari mock services        | @Petra                                        | @Priya: DLD/Ejari API research   | Pending |
| V1.4 — Wave 19 dependency sweep       | @Mira                                         | @Dalia: peer-conflict benchmarks | Pending |
| V1.5 — CRM mock data completeness     | @Una (frontend hook) + @Barbara (data shapes) | @Aisha: 50-record seed data spec | Pending |

**Context budget:** premium executor — 128 KB; free research agents — 32 KB each  
**WIP limit:** max 3 sub-tasks In Progress simultaneously

---

## Vector 2 — Superuser Login & Post-Login Behavior

**Lead:** @Daniela (Auth Specialist)  
**Deputy:** @Radia (Network/Security)  
**Premium executor:** Coder agent (Security agent for RBAC review)  
**Verification:** QA agent + Security agent

**⛔ GATE:** BLOCKED until `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved` for Wave 19.

| Sub-task                            | Assignee          | Free research support               | Status  |
| ----------------------------------- | ----------------- | ----------------------------------- | ------- |
| V2.1 — Token refresh loop           | @Daniela          | @Chloe: JWT rotation best-practices | Blocked |
| V2.2 — authReady hydration flag     | @Daniela          | —                                   | Blocked |
| V2.3 — Lion-role fast path          | @Daniela + @Radia | @Priya: auth regulatory notes       | Blocked |
| V2.4 — Forgot-password 5-state flow | @Daniela          | @Basma: privacy + consent notes     | Blocked |
| V2.5 — Regression tests             | @Katherine        | —                                   | Blocked |

**Context budget:** premium executor — 128 KB; free research — 32 KB each

---

## Vector 3 — Superuser (MD) Dashboard Design & UI

**Lead:** @Una (CSS Specialist — Frontend & UX Dept)  
**Deputy:** @Cyra (Frontend Performance & Web Animation Specialist)  
**Premium executor:** Designer agent + Coder agent  
**Verification:** QA agent (WCAG AA check)

**⛔ GATE:** BLOCKED until Wave 19 gate approval (same gate as Vector 2).

| Sub-task                           | Assignee                               | Free research support               | Status  |
| ---------------------------------- | -------------------------------------- | ----------------------------------- | ------- |
| V3.1 — Workspace A/B split IA      | @Una                                   | @Yara: enterprise CRM UX benchmarks | Blocked |
| V3.2 — 8-tile KPI bar              | @Una + @Cyra                           | @Rana: mobile KPI display patterns  | Blocked |
| V3.3 — Multi-currency revenue tile | @Una (frontend) + @Mira (backend wire) | @Sana: UAE FX rates spec            | Blocked |
| V3.4 — Recharts interactive charts | @Cyra                                  | @Dalia: Recharts perf benchmarks    | Blocked |
| V3.5 — Loading/error/empty states  | @Una                                   | —                                   | Blocked |
| V3.6 — Right contextual panel      | @Una + @Lea                            | @Marissa: luxury UX patterns        | Blocked |

**Context budget:** premium executor — 128 KB; free research — 32 KB each

---

## Vector 4 — Deduplication, Merging & Dead-Code Elimination

**Lead:** @Grace (Lead Engineer / CTO — Executive Council)  
**Deputy:** @Katherine (QA Lead — Security & QA Dept)  
**Premium executor:** Coder agent  
**Verification:** guardian agent (post-merge green-build check)

| Sub-task                            | Assignee                               | Free research support                | Status  |
| ----------------------------------- | -------------------------------------- | ------------------------------------ | ------- |
| V4.1 — Duplicate component audit    | @Grace                                 | @Iris: React component dedup tooling | Pending |
| V4.2 — Linda + Henry service merger | @Mira (backend) + @Grace (orchestrate) | —                                    | Pending |
| V4.3 — CSS/Tailwind config audit    | @Una                                   | @Cyra: bundle-size analysis          | Pending |
| V4.4 — Prisma schema normalization  | @Barbara                               | @Anima: data pipeline impact check   | Pending |
| V4.5 — Dead import sweep            | @Katherine                             | —                                    | Pending |

**Context budget:** premium executor — 128 KB; free research — 32 KB each  
**Rule:** Delete old file only after replacement has green build + tests.

---

## Vector 5 — Plans & Business Document Upgrades

**Lead:** @Margaret (Strategic Planner — Executive Council)  
**Deputy:** @Elena (Chief Research Officer — Executive Council)  
**Premium executor:** Planner agent (docs changes; no code)  
**Verification:** guardian agent (plans:validate check)

| Sub-task                         | Assignee                                  | Free research support          | Status  |
| -------------------------------- | ----------------------------------------- | ------------------------------ | ------- |
| V5.1 — ADR creation (5 files)    | @Margaret + @Ada                          | —                              | Done    |
| V5.2 — MASTER_PLAN.md expansion  | @Margaret                                 | @Rima: wave dep graph research | Pending |
| V5.3 — Business doc cross-checks | @Victoria (Leasing) + @Sofia (Compliance) | @Priya: RERA 2025/26 updates   | Pending |
| V5.4 — AEGIS_RUN_LOG.md creation | @Margaret                                 | —                              | Done    |

**Context budget:** Planner agent — 128 KB; free research — 32 KB each

---

## Vector 6 — AEGIS Infrastructure Upgrades

**Lead:** @Ada (Chief Architect — Executive Council)  
**Deputy:** @Zoe (COO — Executive Council)  
**Premium executor:** Coder agent (script changes), Planner agent (queue files)  
**Verification:** guardian agent

| Sub-task                            | Assignee         | Free research support          | Status           |
| ----------------------------------- | ---------------- | ------------------------------ | ---------------- |
| V6.1 — AUTOPILOT_QUEUE.md           | @Zoe             | —                              | Done             |
| V6.2 — AEGIS_WORKFORCE.md           | @Ada             | —                              | Done (this file) |
| V6.3 — Loop guard (session-end.ps1) | @Gwynne (DevOps) | @Wafa: git loop-guard patterns | Done             |
| V6.4 — Context budget enforcement   | @Ada             | @Wafa: token budget research   | Done             |
| V6.5 — KNOWN_ERRORS interception    | @Katherine       | @Chloe: TS error catalogue     | Done             |
| V6.6 — Governance validator update  | @Ada             | —                              | Pending          |

**Context budget:** Coder/Planner agent — 128 KB; free research — 32 KB each

---

## Research Division Preflight Chain

> Before any premium coding turn, @Elena must publish a research preflight brief.
> No preflight = no premium coding (per ADR-004).

| Research Agent | Domain                          | FEEDs to                     | Delivery Format             |
| -------------- | ------------------------------- | ---------------------------- | --------------------------- |
| @Iris          | Tech trends + tooling           | @Grace (V4), @Mira (V1)      | Weekly tech-pulse brief     |
| @Aisha         | Dubai market data               | @Margaret (V5)               | Weekly market-pulse brief   |
| @Priya         | Legal + regulatory intel        | @Sofia (V5.3), @Daniela (V2) | Regulatory update brief     |
| @Chloe         | Security threats + JWT patterns | @Radia (V2), @Katherine (V4) | Threat intel brief          |
| @Dalia         | Performance benchmarks          | @Cyra (V3), @Mira (V1)       | Performance research packet |
| @Yara          | UX benchmarks                   | @Una (V3), @Marissa          | UX research packet          |
| @Rana          | Mobile UX + MENA stats          | @Una (V3), @Tracy            | Mobile UX brief             |
| @Wafa          | DevOps + cloud patterns         | @Gwynne (V6), @Lisa          | DevOps research brief       |
| @Rima          | BI + planning                   | @Margaret (V5)               | Strategic planning brief    |
| @Nour          | Product discovery               | @Ada                         | Product research packet     |
| @Elena         | Synthesis                       | @Margaret → @Ada             | Daily preflight synthesis   |

---

## Governance

- **WIP limits** enforced by @Zoe: 3 tasks In Progress per delivery team at any time
- **Research WIP limit:** 6 tasks simultaneously across Team F
- **Gate approval** required from @Ada before any Blocked Vector 2/3 task moves to In Progress
- **This file** is updated at the start of each new AEGIS turn by the orchestrator
