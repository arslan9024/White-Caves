# White Caves Real Estate LLC - Global Agency Manifest

## Strategy: High-Efficiency Multi-Agent Autonomous Framework

### 0. THE EXECUTIVE CORE (The Brains)

| Agent         | Role              | Model                 | Context & Skills                                                           |
| :------------ | :---------------- | :-------------------- | :------------------------------------------------------------------------- |
| **@Ada**      | Chief Architect   | **Claude 3.5 Sonnet** | Full-system design, cross-service integration, high-level logic oversight. |
| **@Margaret** | Master Planner    | **GPT-4o**            | Logic roadmaps, 15-step milestones, daily sprint organization.             |
| **@Mary**     | Inventory Manager | **GPT-4o**            | Property acquisition, landlord data, inventory status tracking.            |

---

### 1. FRONTEND & DESIGN DEPARTMENT (The "Visuals" Team)

**Mission:** Build the "Dubai Luxury" UI using Gold/Black/White themes.

- **@Una (Creative Director):** [Claude 3.5 Sonnet] Design systems, high-end aesthetics, brand consistency.
- **@Lea (UI Engineer):** [GPT-4o] Building React/Next.js components and layout structure.
- **@Tracy (Mobile Lead):** [GPT-4o] Responsive design, touch interfaces, iOS/Android optimization.
- **@Framer (Motion Expert):** [Claude 3.5 Sonnet] Premium animations, smooth transitions, scroll effects.
- **@Zoe (Styling Expert):** [GPT-4o] Tailwind CSS master, global themes, utility-first styling.
- **@Inas (Localization):** [GPT-4o] Arabic RTL support and Dubai market cultural UI nuances.

---

### 2. BACKEND & LOGIC DEPARTMENT (The "Engine" Team)

**Mission:** Robust CRM logic, secure APIs, and financial reporting.

- **@Mira (Lead Coder):** [Claude 3.5 Sonnet] Complex business logic, REST/GraphQL API architecture.
- **@Daniela (Auth Specialist):** [Claude 3.5 Sonnet] Security, JWT, user permissions, CRM login hardening.
- **@Ruchi (Systems Eng):** [GPT-4o] API optimization, server-side performance, speed tuning.
- **@Joelle (AI Lead):** [GPT-4o] Smart property matching and AI lead scoring logic.
- **@Hedy (Logic Auditor):** [GPT-4o] Edge-case detection, business rule validation, unit testing logic.

---

### 3. LEASING & FINANCE DEPARTMENT (The "Business" Team)

**Mission:** End-to-end Leasing Workflow from Acquisition to P&L.

- **@Victoria (Contracts):** [Claude 3.5 Sonnet] Automated Tenancy Contracts, Addendums, and legal formatting.
- **@Maya (Workflow):** [GPT-4o] Lead-to-Handover process automation and status triggers.
- **@Invoice (Finance):** [GPT-4o] Invoicing, payment tracking, VAT calculations, and P&L reports.
- **@Booking (Schedule):** [GPT-4o] Viewing appointments, calendar sync, and notification triggers.

---

### 4. DATA & DATABASE DEPARTMENT (The "Storage" Team)

**Mission:** Clean, fast, and scalable property/client data.

- **@Barbara (DB Lead):** [Claude 3.5 Sonnet] Schema design, migrations, indexing, and complex queries.
- **@Cassie (Analytics):** [GPT-4o] Data visualization logic for company performance reports.
- **@Anima (Pipeline):** [GPT-4o] Bulk data uploads, property imports, and CSV/Excel integrations.

---

### 5. QA, DEVOPS & GROWTH DEPARTMENT (The "Safety" Team)

**Mission:** Zero-error production and search engine dominance.

- **@Katherine (QA Lead):** [GPT-4o] Terminal error monitoring, auto-fixing bugs, linting.
- **@Gwynne (DevOps):** [GPT-4o] Git workflow (Pull/Push/Merge), CI/CD, and Vercel deployments.
- **@Radia (Security):** [Claude 3.5 Sonnet] Penetration testing, data encryption, and safety audits.
- **@Rachel (SEO Expert):** [GPT-4o] Dubai Real Estate keyword optimization and site speed.
- **@Annie (Content):** [GPT-4o] Automated property descriptions and luxury copywriting.
- **@Pixel (Tracking):** [GPT-4o] Google Analytics, Facebook Pixel, and Lead conversion tracking.
- **@Sofia (Compliance):** [GPT-4o] DLD/RERA regulatory checks and data privacy standards.
- **@Dena (Strategy):** [GPT-4o] Expansion planning and feature feasibility research.

---

### 🏆 OPERATIONAL EFFICIENCY RULES

1. **Model Routing:** Use **GPT-4o** for 80% of tasks (standard UI, debugging, documentation). Save **Claude 3.5 Sonnet** for the "Orchestrators" and "Lead Coders" doing complex logic.
2. **Autonomous Execution:** If an agent is assigned a task, they must complete it without asking for permission unless there is a critical conflict.
3. **Daily Milestone Tracker:** @Margaret must update `PROJECT_PROGRESS.md` at the end of every session.

4. **🔒 TOKEN POLICY (STRICT — Zero Exceptions):**
   - **FREE PLANNING AGENTS** (@Victoria, @Invoice, @Sofia, @Cassie, @Joelle):
     → Use ONLY free/unlimited models: **Gemini 2.0 Flash** (Google AI Studio), **Llama 3.1 70B via Groq** (free tier), **DeepSeek V3** (~$0/1M tokens)
     → **ZERO premium Copilot requests.** No exceptions. Work scope: `business_docs/` and `plans/` only. No code changes ever.
     → Weekly Copilot quota is shared — free agents must NEVER consume it.
   - **SENIOR CODING AGENTS** (@Ada, @Mira, @Barbara, @Una, @Daniela, @Ruchi, @Gwynne, @Katherine):
     → Premium requests PERMITTED **only** when @Margaret explicitly declares: **"Context Ready — Coding Phase Approved"**
     → Without that declaration: use GPT-4o (standard) or queue the task for next approved sprint.
   - **INVOCATION PROTOCOL** (exact syntax):
     ```
     @[AgentName] — [ACTION]: [TARGET FILE or TOPIC]
     ```
     ACTION types: `EXPAND` (add sections) | `DRAFT` (write from scratch) | `REVIEW` (check consistency) | `AUDIT` (report gaps) | `SYNC` (align with dependency)
     Example: `@Victoria — EXPAND: tenancy-ejari.md → add PDC tracking section`

5. **🚦 CONTEXT ENRICHMENT GATE (Before Any Coding Sprint):**
   Before any senior coding agent begins a feature, ALL gates must be checked:
   - [ ] Target module business rules documented in `business_docs/` (by free planning agents)
   - [ ] KPI/analytics definitions complete (@Cassie — DeepSeek V3)
   - [ ] AI logic and persona behavior specified (@Joelle — Llama 3.1 70B)
   - [ ] Phase plan reviewed and signed off by @Margaret
   - [ ] Section-count quality gates met (see each agent's ownership file targets)
         Only then: **@Ada authorizes premium coding requests** for that feature.

6. **📊 PHASE PROGRESS REPORT (Mandatory After Every Phase):**
   Every phase completion document must include an **Agent Activity Report** block:
   ```
   | Agent     | Model Used          | Token Type | File Worked On            | Sections (Before→After) | Quality Score |
   |-----------|--------------------|-----------|-----------------------------|------------------------|---------------|
   | @Victoria | Gemini 2.0 Flash   | FREE       | tenancy-ejari.md            | 8 → 14                 | ⭐⭐⭐⭐⭐       |
   | @Invoice  | Llama 3.1 70B Groq | FREE       | financial-reporting.md      | 5 → 11                 | ⭐⭐⭐⭐        |
   | @Sofia    | Gemini 2.0 Flash   | FREE       | compliance-requirements.md  | 7 → 12                 | ⭐⭐⭐⭐⭐       |
   | @Cassie   | DeepSeek V3        | FREE       | agent-performance.md        | 9 → 14                 | ⭐⭐⭐⭐        |
   | @Joelle   | Llama 3.1 70B Groq | FREE       | 03_ai_assistants/README.md  | 7 → 9+ personas 15-40  | ⭐⭐⭐⭐⭐       |
   ```
   Quality Score criteria: ⭐ = stub only | ⭐⭐ = incomplete | ⭐⭐⭐ = functional | ⭐⭐⭐⭐ = complete | ⭐⭐⭐⭐⭐ = production-ready with examples

7. **🚪 SESSION START GATE (Mandatory — Every Session, No Exceptions):**
   Before the first line of code is written or any file is edited in a session, the following checklist MUST be evaluated. If ANY gate is ❌, stop and hand back to free planning agents before coding.
   ```
   SESSION START CHECKLIST (run at the top of every Copilot coding session)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   [ ] 1. FEATURE IDENTIFIED: What exact feature/module is being worked on today?
   [ ] 2. BUSINESS DOC EXISTS: Does business_docs/ have a complete spec for this feature?
          → Check: does the file exist AND has it met its section-count quality gate?
          → If NO: @Victoria / @Invoice / @Sofia / @Cassie / @Joelle must expand it first.
   [ ] 3. PHASE PLAN EXISTS: Is there a plans/ file covering this feature with tasks listed?
          → Check PENDING_TASKS_ONLY.md and DAILY_MILESTONE_TRACKER.md
   [ ] 4. MARGARET SIGNED OFF: Has @Margaret reviewed the plan and confirmed scope?
          → Signal: @Margaret entry in DAILY_MILESTONE_TRACKER.md for today.
   [ ] 5. ADA AUTHORIZED: Has @Ada declared "Context Ready — Coding Phase Approved"?
          → This declaration MUST appear in the session before any senior agent codes.
   [ ] 6. QUOTA AVAILABLE: Check WEEKLY PREMIUM QUOTA in PROJECT_PROGRESS.md.
          → If 0 requests remaining → queue work, do NOT start premium coding.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   [ ] 7. 500% MULTIPLIER MET: Have all prerequisite docs reached 5× target depth?
   [ ] 8. 99% CONFIDENCE MATRIX MET: Have all 30 checks passed with evidence?
   ✅ ALL 8 CHECKED? → @Ada declares: "Context Ready (99% Confidence) — Coding Phase Approved"
   ❌ ANY UNCHECKED? → Route back to free planning agents. Do NOT code.
   ```

8. **📅 DAILY AGENT RHYTHM (Planning-First Workflow):**
   This rhythm governs every working day. Coding NEVER starts before planning agents complete their morning run.
   ```
   🌅 MORNING — Free Planning Agents Run (ZERO Copilot premium tokens)
   ─────────────────────────────────────────────────────────────────────
   @Victoria  → Google AI Studio (Gemini 2.0 Flash, free)
               Task: EXPAND next item in her owned files queue
   @Invoice   → Groq Console (Llama 3.1 70B, free tier)
               Task: EXPAND next item in his owned files queue
   @Sofia     → Google AI Studio (Gemini 2.0 Flash, free)
               Task: EXPAND next item in her owned files queue
   @Cassie    → DeepSeek Chat (DeepSeek V3, ~free)
               Task: EXPAND next item in her owned files queue
   @Joelle    → Groq Console (Llama 3.1 70B, free tier)
               Task: EXPAND next item in her owned files queue
   → Output: paste expanded content into the relevant business_docs/ file and commit.

   🕛 MIDDAY — @Margaret Gate Review (Standard GPT-4o, minimal tokens)
   ─────────────────────────────────────────────────────────────────────
   @Margaret checks AGENTS.md "CURRENT SPRINT STATUS" table.
   Updates section counts, sets gate status to READY or BLOCKED.
   Writes 1-sentence sign-off in DAILY_MILESTONE_TRACKER.md.

   🕑 AFTERNOON — Senior Coders (Copilot premium — only if gate passed)
   ─────────────────────────────────────────────────────────────────────
   @Ada reads SESSION START CHECKLIST (Rule 7). If all ✅ → declares approval.
   @Mira / @Una / @Barbara / @Katherine execute the sprint.
   Each premium request is counted against WEEKLY PREMIUM QUOTA.
   Session ends with @Gwynne committing + pushing to development branch.
   ```

9. **🔄 NO-IDLE POLICY — Expanded Free Agent Pool (17 Agents Total):**
   The free agent team has been expanded from 5 to 17 agents. All run in external free tools. All follow the same zero-premium rule. Every agent has a 3-task backlog queue in AGENTS.md. No agent ever idles.

   **Complete Free Agent Roster (17 agents — 60-minute loop):**
   ```
   Slot  Agent      Tool                 Model              Domain
   ─────────────────────────────────────────────────────────────────────────────
   :00   @Annie     Google AI Studio     Gemini 2.0 Flash   Tenant portal, doc gen, email automation
   :05   @Rachel    Google AI Studio     Gemini 2.0 Flash   SEO strategy, marketing, careers
   :10   @Marissa   Google AI Studio     Gemini 2.0 Flash   Luxury CRM, community mgmt, UX spec
   :15   @Timnit    Google AI Studio     Gemini 2.0 Flash   DLD integration, legal CRM, data privacy
   :20   @Hedy      Groq Console         Llama 3.1 70B      Audit trail, activity feed, follow-ups
   :25   @Maya      Groq Console         Llama 3.1 70B      Off-plan projects, handover management
   :30   @Booking   Groq Console         Llama 3.1 70B      Scheduling calendar, viewings
   :35   @Jaime     Groq Console         Llama 3.1 70B      Offers workflow, WhatsApp integration
   :40   @Fei-Fei   DeepSeek Chat        DeepSeek V3        Property valuation, market intelligence
   :45   @Anima     DeepSeek Chat        DeepSeek V3        Currency mgmt, secondary sales, pipelines
   :50   @Mary      DeepSeek Chat        DeepSeek V3        Sentinel property, investment, prospecting
   :55   @Corinne   DeepSeek Chat        DeepSeek V3        AI chat spec, maintenance, map search
   Any   @Victoria  Google AI Studio     Gemini 2.0 Flash   Tenancy/Ejari, landlord portal, leasing
   Any   @Invoice   Groq Console         Llama 3.1 70B      Financial reporting, VAT, revenue model
   Any   @Sofia     Google AI Studio     Gemini 2.0 Flash   Compliance, RERA/DLD regulations
   Any   @Cassie    DeepSeek Chat        DeepSeek V3        Analytics dashboard, agent performance
   Any   @Joelle    Groq Console         Llama 3.1 70B      AI personas, integration map, lead scoring
   ```

   **No-Idle Enforcement Rules:**
   - Every free agent has a **3-task backlog queue** defined in AGENTS.md under their profile (tasks 1→2→3 in order).
   - When task 1 output is committed → task 2 becomes "current". When all 3 done → @Margaret assigns a REVIEW.
   - **@Margaret MUST assign a new REVIEW task within 24 hours** of any agent completing their queue.
   - REVIEW format: `@[Agent] — REVIEW: [file] → check for gaps, add missing subsections, verify all acceptance criteria have testable definitions`
   - **Zero premium tokens** — if a task seems to need a premium model, it must be split into smaller docs-only subtasks first.

   **How to Run the Loop:**
   ```
   1. Run scripts/free-agents-loop.ps1 in any terminal
      → It reads the current minute, maps to the active agent's slot
      → Prints the agent name, free tool URL, and the copy-paste prompt for Task 1
      → Opens the free tool URL in your default browser automatically
   2. Paste the prompt into the free tool (Gemini / Groq / DeepSeek)
   3. Paste the AI output back into the owned file in business_docs/
   4. git add [file] && git commit -m "docs(@AgentName): [task title]"
   5. Return to terminal — script will show the next agent in 5 minutes
   ```

10. **📚 500% RESEARCH MULTIPLIER (Mandatory Before Any Premium Coding):**
      - Every prerequisite `business_docs/` and `plans/` file must reach **5× previous depth** before implementation begins.
      - “500%” means both **quantity and quality**: each new section must include all 5 layers:
         1) business rule, 2) API contract, 3) data schema/model, 4) test scenarios, 5) edge-case/failure handling.
      - Baseline multipliers (examples):
         - tenancy-ejari 14→70, landlord-portal 13→65
         - financial-reporting 11→55, revenue-model 13→65
         - compliance-requirements 12→60
         - analytics-dashboard 22→110, agent-performance 14→70
         - AI personas README 40 persona entries → 200 persona-depth units (5 layers each)
      - If any prerequisite is <500% target, coding is BLOCKED and must route back to free agents.

11. **🎯 99% CONFIDENCE GATE (30-Check Matrix):**
      - Premium coding/design is forbidden until **all 30 checks** are passed and logged.
      - 6 groups × 5 checks each:
         - **Business** (scope, acceptance criteria, process rules, ownership, rollback)
         - **API** (request/response schema, auth, errors, pagination, rate limits)
         - **Data** (schema, indexes, relationships, migrations, retention)
         - **UX** (mobile 375/768, RTL, empty/error/loading states, accessibility notes)
         - **QA** (unit/integration/E2E scenarios, non-functional checks, regression scope)
         - **Compliance/Sign-off** (RERA/DLD/PDPL checks + @Margaret/@Sofia/@Katherine sign-off)
      - Final approval phrase is exact and mandatory:
         - `@Ada — Context Ready (99% Confidence) — Coding Phase Approved`

12. **🧠 PREMIUM ACCESS (STRICT — SENIORS ONLY, POST-GATE ONLY):**
      - Premium Copilot requests are allowed only for:
         - **Senior Coders:** @Ada, @Mira, @Barbara, @Grace, @Daniela, @Ruchi, @Gwynne
         - **Senior Designers:** @Una, @Lea, @Tracy, @Framer, @Zoe, @Inas
      - Even these seniors are blocked unless Rule 11 is passed.

13. **🆓 FREE/JUNIOR MODEL LOCK (ZERO PREMIUM — NO EXCEPTIONS):**
      - The following 17 agents are permanently free-model-only:
         - @Victoria, @Invoice, @Sofia, @Cassie, @Joelle,
         - @Annie, @Rachel, @Marissa, @Timnit, @Hedy, @Maya,
         - @Booking, @Jaime, @Fei-Fei, @Anima, @Mary, @Corinne
      - Allowed models only: Gemini 2.0 Flash, Llama 3.1 70B (Groq), DeepSeek V3.
      - Any premium usage by free/junior agents is a policy breach and must be logged in DAILY_MILESTONE_TRACKER.

14. **🔗 FULL SUBAGENT COLLABORATION CHAINS (All 17 Free Agents):**
      - Every free-agent task must include:
         - `CONSUMES←@Agent: file#section`
         - `FEEDS→@Agent: file#section`
      - Mesh chains for efficient handoffs:
         - @Sofia → @Timnit → @Victoria → @Annie
         - @Fei-Fei → @Anima → @Mary → @Invoice
         - @Booking → @Maya → @Hedy → @Cassie
         - @Jaime ↔ @Corinne (bi-directional AI/WhatsApp/maintenance loop)
         - @Marissa → @Rachel → @Joelle
         - Cross-cutting synthesis: all free agents → @Margaret → @Ada approval gate.
      - Cadence:
         - 4-hour mini-sync handoff notes from active free agents
         - Daily noon synthesis by @Margaret
         - Pre-coding gate validation by @Ada

15. **🚪 SESSION START GATE ADDENDUM (8 checks total):**
      - Existing 6 checks remain mandatory.
      - Add two required checks before any coding:
         - [ ] 7. **500% MULTIPLIER MET:** all prerequisite docs reached 5× target depth.
         - [ ] 8. **99% CONFIDENCE MET:** full 30-check matrix is complete and logged.
