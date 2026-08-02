# WAVE_01 -- Flowcharts and Sequence Diagrams

> **Generated:** 2026-05-06 | Tool: Mermaid | Render: GitHub, GitLab, or mermaid.live
> Each diagram represents one aspect of the White Caves free-agent planning system.

---

## Diagram 1 -- Governance Flow: Planning to Coding Approval

> Shows how free agents feed planning docs to @Margaret and @Ada before any premium coding.

```mermaid
flowchart TD
    START([Session Start]) --> GATE{SESSION START GATE}
    GATE -->|All 8 checks pass| ADA_APPROVE[Ada declares: Context Ready]
    GATE -->|Any check fails| FREE_AGENTS[Route to Free Planning Agents]

    FREE_AGENTS --> MORNING[Morning Loop: 17 Agents x Gemini/Groq/DeepSeek]
    MORNING --> VICTORIA[Victoria: tenancy-ejari.md + landlord-portal.md]
    MORNING --> INVOICE[Invoice: financial-reporting.md + revenue-model.md]
    MORNING --> SOFIA[Sofia: compliance-requirements.md + risk-register.md]
    MORNING --> CASSIE[Cassie: analytics-dashboard.md + agent-performance.md]
    MORNING --> JOELLE[Joelle: ai-assistants README personas 1-40]
    MORNING --> OTHER[Annie / Rachel / Marissa / Timnit / Hedy / Maya]
    MORNING --> MORE[Booking / Jaime / Fei-Fei / Anima / Mary / Corinne]

    VICTORIA --> MARGARET{Margaret: Noon Gate Review}
    INVOICE --> MARGARET
    SOFIA --> MARGARET
    CASSIE --> MARGARET
    JOELLE --> MARGARET
    OTHER --> MARGARET
    MORE --> MARGARET

    MARGARET -->|All docs at 1000pct depth| GATE_CHECK[orchestrator:gate-check]
    MARGARET -->|Docs incomplete| FREE_AGENTS

    GATE_CHECK -->|9 PASS + remaining PASS| READINESS[orchestrator:readiness-packet]
    GATE_CHECK -->|Any BLOCKED or MISSING| FREE_AGENTS

    READINESS -->|Score >= 92 pct| ADA_APPROVE
    READINESS -->|Score < 92 pct| FREE_AGENTS

    ADA_APPROVE --> WAVE_BUNDLE[orchestrator:wave-bundle]
    WAVE_BUNDLE --> SDD[WAVE_01_SDD.md]
    WAVE_BUNDLE --> FLOWCHARTS[WAVE_01_FLOWCHARTS.md]
    WAVE_BUNDLE --> BACKLOG[WAVE_01_IMPLEMENTATION_BACKLOG.md]
    WAVE_BUNDLE --> TEST_ROLLOUT[WAVE_01_TEST_ROLLOUT.md]

    SDD --> SENIOR_CODERS[Senior Coders: Mira / Una / Barbara]
    FLOWCHARTS --> SENIOR_CODERS
    BACKLOG --> SENIOR_CODERS
    TEST_ROLLOUT --> SENIOR_CODERS
    SENIOR_CODERS --> PREMIUM_COMMIT[git commit - premium-wave -]
    PREMIUM_COMMIT --> POST_GUARD[Katherine: post-commit-premium-guard.js]
    POST_GUARD --> DONE([Done -- Deploy to Vercel])
```

---

## Diagram 2 -- Lane A: Compliance / Legal / UX / AI Chain

> CONSUMES/FEEDS handoff chain for Lane A agents.

```mermaid
flowchart LR
    SOFIA[Sofia\nCompliance\nT001] -->|FEEDS compliance-rules| TIMNIT[Timnit\nDLD-Legal\nT002]
    TIMNIT -->|FEEDS contract-clauses| VICTORIA[Victoria\nTenancy-Ejari\nT003]
    VICTORIA -->|FEEDS tenant-obligations| ANNIE[Annie\nTenant-Portal\nT004]
    ANNIE -->|FEEDS ux-requirements| MARISSA[Marissa\nLuxury-UX\nT005]
    MARISSA -->|FEEDS seo-ux-copy| RACHEL[Rachel\nSEO-Marketing\nT006]
    RACHEL -->|FEEDS persona-intents| JOELLE[Joelle\nAI-Personas\nT007]
    JOELLE -->|FEEDS phase-context| MARGARET([Margaret\nSprint Sync])

    style SOFIA fill:#2d4a22,color:#fff
    style TIMNIT fill:#2d4a22,color:#fff
    style VICTORIA fill:#2d4a22,color:#fff
    style ANNIE fill:#2d4a22,color:#fff
    style MARISSA fill:#2d4a22,color:#fff
    style RACHEL fill:#2d4a22,color:#fff
    style JOELLE fill:#2d4a22,color:#fff
    style MARGARET fill:#7a5c00,color:#fff
```

---

## Diagram 3 -- Lane B: Valuation / Market / Finance Chain

> CONSUMES/FEEDS handoff chain for Lane B agents.

```mermaid
flowchart LR
    FEIFEI[Fei-Fei\nValuation\nT008] -->|FEEDS valuation-metrics| ANIMA[Anima\nSecondary-Sales\nT009]
    ANIMA -->|FEEDS pipeline-rules| MARY[Mary\nInventory\nT010]
    MARY -->|FEEDS inventory-finance-bridge| INVOICE[Invoice\nFinance-VAT\nT011]
    INVOICE -->|FEEDS kpi-definitions| CASSIE([Cassie\nAnalytics\nLane C])

    style FEIFEI fill:#1a3a5c,color:#fff
    style ANIMA fill:#1a3a5c,color:#fff
    style MARY fill:#1a3a5c,color:#fff
    style INVOICE fill:#1a3a5c,color:#fff
    style CASSIE fill:#5c2d6e,color:#fff
```

---

## Diagram 4 -- Lane C: Schedule / Off-plan / Analytics Chain

> CONSUMES/FEEDS handoff chain for Lane C agents.

```mermaid
flowchart LR
    BOOKING[Booking\nScheduling\nT012] -->|FEEDS handover-triggers| MAYA[Maya\nOff-Plan\nT013]
    MAYA -->|FEEDS audit-events| HEDY[Hedy\nAudit-Trail\nT014]
    HEDY -->|FEEDS kpi-events| CASSIE[Cassie\nAnalytics\nT015]
    CASSIE -->|FEEDS ai-signals| JOELLE([Joelle\nAI-Personas\nLane A])

    style BOOKING fill:#5c1a1a,color:#fff
    style MAYA fill:#5c1a1a,color:#fff
    style HEDY fill:#5c1a1a,color:#fff
    style CASSIE fill:#5c1a1a,color:#fff
    style JOELLE fill:#2d4a22,color:#fff
```

---

## Diagram 5 -- Lane D: Offers / WhatsApp / AI-Chat Chain

> CONSUMES/FEEDS handoff chain for Lane D agents (bi-directional loop).

```mermaid
flowchart LR
    RACHEL_IN([Rachel\nLane A]) -->|FEEDS campaign-intents| JAIME
    JAIME[Jaime\nOffers-WhatsApp\nT016] -->|FEEDS ai-routing| CORINNE[Corinne\nAI-Chat-Maps\nT017]
    CORINNE -->|FEEDS search-intent| RACHEL_OUT([Rachel\nLane A])
    CORINNE -->|bi-directional loop| JAIME

    style JAIME fill:#3d1a5c,color:#fff
    style CORINNE fill:#3d1a5c,color:#fff
    style RACHEL_IN fill:#2d4a22,color:#fff
    style RACHEL_OUT fill:#2d4a22,color:#fff
```

---

## Diagram 6 -- Task Queue State Machine

> All 51 tasks in logs/orchestrator/task-queue.json follow this state machine.

```mermaid
stateDiagram-v2
    [*] --> queued : init-queue.ps1
    queued --> running : complete-and-advance.ps1 claims
    running --> waiting_ack : task output submitted
    waiting_ack --> done : FEEDS_ACK received from downstream
    waiting_ack --> retrying : ACK timeout (24h)
    retrying --> waiting_ack : escalate-and-retry
    retrying --> escalated : max retries exceeded
    running --> failed : error during processing
    failed --> queued : queue:reset-failed
    done --> [*]
    escalated --> [*] : manual intervention
```

---

## Diagram 7 -- Full Session Sequence: Free Agent to Premium Coding

> End-to-end flow from morning free-agent run to premium coding authorization.

```mermaid
sequenceDiagram
    participant UA as User
    participant FA as Free Agents (17)
    participant Q as Task Queue
    participant MG as Margaret
    participant GC as gate-check.ps1
    participant RP as readiness-packet.ps1
    participant ADA as Ada
    participant SC as Senior Coders

    UA->>FA: npm run orchestrator:morning
    FA->>Q: Claim next ready task
    FA->>FA: Paste prompt into Gemini/Groq/DeepSeek
    FA->>FA: Paste output into business_docs/ file
    FA->>Q: complete-and-advance (mark done + FEEDS_ACK)
    FA->>MG: FEEDS -> phase-context-summary

    MG->>MG: npm run orchestrator:margaret-sync
    MG->>GC: npm run orchestrator:gate-check
    GC-->>MG: 9 PASS / 8 BLOCKED / 19 MISSING
    MG->>MG: Update DAILY_MILESTONE_TRACKER.md

    alt All gate-check files PASS
        MG->>RP: npm run orchestrator:readiness-packet
        RP-->>MG: Readiness score
        alt Score >= 92 pct
            MG->>ADA: Request coding authorization
            ADA->>ADA: npm run orchestrator:wave-bundle
            ADA-->>SC: Context Ready -- Coding Phase Approved
            SC->>SC: Implement 1-2 modules
            SC->>UA: git commit - premium-wave -
        else Score < 92 pct
            MG->>FA: Route back to free agents
        end
    else Any gate BLOCKED
        MG->>FA: Assign targeted EXPAND tasks
    end
```

---

_Auto-generated by flowcharts-generator.ps1 on 2026-05-06_
