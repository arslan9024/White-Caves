# flowcharts-generator.ps1 -- Generates WAVE_0N_FLOWCHARTS.md
# Contains: 4 lane flowcharts, 1 sequence diagram, 1 queue state machine
param(
  [string]$WorkspaceRoot = ".",
  [int]$WaveNumber = 1
)

$wavesDir  = Join-Path $WorkspaceRoot "plans\waves"
$today     = (Get-Date).ToString("yyyy-MM-dd")
$waveLabel = "WAVE_$('{0:D2}' -f $WaveNumber)"
$outFile   = Join-Path $wavesDir "$waveLabel`_FLOWCHARTS.md"

if (-not (Test-Path $wavesDir)) { New-Item $wavesDir -ItemType Directory -Force | Out-Null }

$queueFile = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue file not found: $queueFile" -ForegroundColor Red; exit 1
}

$q      = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks  = @($q.tasks | Sort-Object taskId)

# Helper: get lane root tasks in order
function Get-LaneTasks([string]$lane) {
  return @($tasks | Where-Object { $_.lane -eq $lane -and -not ($_.taskId -match "b$|c$") })
}

$fence = '```'
$out = New-Object System.Text.StringBuilder
function Add([string]$line) { [void]$out.AppendLine($line) }

Add "# $waveLabel -- Flowcharts and Sequence Diagrams"
Add ""
Add "> **Generated:** $today | Tool: Mermaid | Render: GitHub, GitLab, or mermaid.live"
Add "> Each diagram represents one aspect of the White Caves free-agent planning system."
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 1: Governance Flow (Planning to Coding Approval)
# =========================================================
Add "## Diagram 1 -- Governance Flow: Planning to Coding Approval"
Add ""
Add "> Shows how free agents feed planning docs to @Margaret and @Ada before any premium coding."
Add ""
Add "${fence}mermaid"
Add "flowchart TD"
Add "    START([Session Start]) --> GATE{SESSION START GATE}"
Add "    GATE -->|All 8 checks pass| ADA_APPROVE[Ada declares: Context Ready]"
Add "    GATE -->|Any check fails| FREE_AGENTS[Route to Free Planning Agents]"
Add ""
Add "    FREE_AGENTS --> MORNING[Morning Loop: 17 Agents x Gemini/Groq/DeepSeek]"
Add "    MORNING --> VICTORIA[Victoria: tenancy-ejari.md + landlord-portal.md]"
Add "    MORNING --> INVOICE[Invoice: financial-reporting.md + revenue-model.md]"
Add "    MORNING --> SOFIA[Sofia: compliance-requirements.md + risk-register.md]"
Add "    MORNING --> CASSIE[Cassie: analytics-dashboard.md + agent-performance.md]"
Add "    MORNING --> JOELLE[Joelle: ai-assistants README personas 1-40]"
Add "    MORNING --> OTHER[Annie / Rachel / Marissa / Timnit / Hedy / Maya]"
Add "    MORNING --> MORE[Booking / Jaime / Fei-Fei / Anima / Mary / Corinne]"
Add ""
Add "    VICTORIA --> MARGARET{Margaret: Noon Gate Review}"
Add "    INVOICE --> MARGARET"
Add "    SOFIA --> MARGARET"
Add "    CASSIE --> MARGARET"
Add "    JOELLE --> MARGARET"
Add "    OTHER --> MARGARET"
Add "    MORE --> MARGARET"
Add ""
Add "    MARGARET -->|All docs at 1000pct depth| GATE_CHECK[orchestrator:gate-check]"
Add "    MARGARET -->|Docs incomplete| FREE_AGENTS"
Add ""
Add "    GATE_CHECK -->|9 PASS + remaining PASS| READINESS[orchestrator:readiness-packet]"
Add "    GATE_CHECK -->|Any BLOCKED or MISSING| FREE_AGENTS"
Add ""
Add "    READINESS -->|Score >= 92 pct| ADA_APPROVE"
Add "    READINESS -->|Score < 92 pct| FREE_AGENTS"
Add ""
Add "    ADA_APPROVE --> WAVE_BUNDLE[orchestrator:wave-bundle]"
Add "    WAVE_BUNDLE --> SDD[WAVE_01_SDD.md]"
Add "    WAVE_BUNDLE --> FLOWCHARTS[WAVE_01_FLOWCHARTS.md]"
Add "    WAVE_BUNDLE --> BACKLOG[WAVE_01_IMPLEMENTATION_BACKLOG.md]"
Add "    WAVE_BUNDLE --> TEST_ROLLOUT[WAVE_01_TEST_ROLLOUT.md]"
Add ""
Add "    SDD --> SENIOR_CODERS[Senior Coders: Mira / Una / Barbara]"
Add "    FLOWCHARTS --> SENIOR_CODERS"
Add "    BACKLOG --> SENIOR_CODERS"
Add "    TEST_ROLLOUT --> SENIOR_CODERS"
Add "    SENIOR_CODERS --> PREMIUM_COMMIT[git commit - premium-wave -]"
Add "    PREMIUM_COMMIT --> POST_GUARD[Katherine: post-commit-premium-guard.js]"
Add "    POST_GUARD --> DONE([Done -- Deploy to Vercel])"
Add $fence
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 2: Lane A dependency chain
# =========================================================
Add "## Diagram 2 -- Lane A: Compliance / Legal / UX / AI Chain"
Add ""
Add "> CONSUMES/FEEDS handoff chain for Lane A agents."
Add ""
Add "${fence}mermaid"
Add "flowchart LR"
Add "    SOFIA[Sofia\nCompliance\nT001] -->|FEEDS compliance-rules| TIMNIT[Timnit\nDLD-Legal\nT002]"
Add "    TIMNIT -->|FEEDS contract-clauses| VICTORIA[Victoria\nTenancy-Ejari\nT003]"
Add "    VICTORIA -->|FEEDS tenant-obligations| ANNIE[Annie\nTenant-Portal\nT004]"
Add "    ANNIE -->|FEEDS ux-requirements| MARISSA[Marissa\nLuxury-UX\nT005]"
Add "    MARISSA -->|FEEDS seo-ux-copy| RACHEL[Rachel\nSEO-Marketing\nT006]"
Add "    RACHEL -->|FEEDS persona-intents| JOELLE[Joelle\nAI-Personas\nT007]"
Add "    JOELLE -->|FEEDS phase-context| MARGARET([Margaret\nSprint Sync])"
Add ""
Add "    style SOFIA fill:#2d4a22,color:#fff"
Add "    style TIMNIT fill:#2d4a22,color:#fff"
Add "    style VICTORIA fill:#2d4a22,color:#fff"
Add "    style ANNIE fill:#2d4a22,color:#fff"
Add "    style MARISSA fill:#2d4a22,color:#fff"
Add "    style RACHEL fill:#2d4a22,color:#fff"
Add "    style JOELLE fill:#2d4a22,color:#fff"
Add "    style MARGARET fill:#7a5c00,color:#fff"
Add $fence
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 3: Lane B dependency chain
# =========================================================
Add "## Diagram 3 -- Lane B: Valuation / Market / Finance Chain"
Add ""
Add "> CONSUMES/FEEDS handoff chain for Lane B agents."
Add ""
Add "${fence}mermaid"
Add "flowchart LR"
Add "    FEIFEI[Fei-Fei\nValuation\nT008] -->|FEEDS valuation-metrics| ANIMA[Anima\nSecondary-Sales\nT009]"
Add "    ANIMA -->|FEEDS pipeline-rules| MARY[Mary\nInventory\nT010]"
Add "    MARY -->|FEEDS inventory-finance-bridge| INVOICE[Invoice\nFinance-VAT\nT011]"
Add "    INVOICE -->|FEEDS kpi-definitions| CASSIE([Cassie\nAnalytics\nLane C])"
Add ""
Add "    style FEIFEI fill:#1a3a5c,color:#fff"
Add "    style ANIMA fill:#1a3a5c,color:#fff"
Add "    style MARY fill:#1a3a5c,color:#fff"
Add "    style INVOICE fill:#1a3a5c,color:#fff"
Add "    style CASSIE fill:#5c2d6e,color:#fff"
Add $fence
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 4: Lane C dependency chain
# =========================================================
Add "## Diagram 4 -- Lane C: Schedule / Off-plan / Analytics Chain"
Add ""
Add "> CONSUMES/FEEDS handoff chain for Lane C agents."
Add ""
Add "${fence}mermaid"
Add "flowchart LR"
Add "    BOOKING[Booking\nScheduling\nT012] -->|FEEDS handover-triggers| MAYA[Maya\nOff-Plan\nT013]"
Add "    MAYA -->|FEEDS audit-events| HEDY[Hedy\nAudit-Trail\nT014]"
Add "    HEDY -->|FEEDS kpi-events| CASSIE[Cassie\nAnalytics\nT015]"
Add "    CASSIE -->|FEEDS ai-signals| JOELLE([Joelle\nAI-Personas\nLane A])"
Add ""
Add "    style BOOKING fill:#5c1a1a,color:#fff"
Add "    style MAYA fill:#5c1a1a,color:#fff"
Add "    style HEDY fill:#5c1a1a,color:#fff"
Add "    style CASSIE fill:#5c1a1a,color:#fff"
Add "    style JOELLE fill:#2d4a22,color:#fff"
Add $fence
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 5: Lane D dependency chain
# =========================================================
Add "## Diagram 5 -- Lane D: Offers / WhatsApp / AI-Chat Chain"
Add ""
Add "> CONSUMES/FEEDS handoff chain for Lane D agents (bi-directional loop)."
Add ""
Add "${fence}mermaid"
Add "flowchart LR"
Add "    RACHEL_IN([Rachel\nLane A]) -->|FEEDS campaign-intents| JAIME"
Add "    JAIME[Jaime\nOffers-WhatsApp\nT016] -->|FEEDS ai-routing| CORINNE[Corinne\nAI-Chat-Maps\nT017]"
Add "    CORINNE -->|FEEDS search-intent| RACHEL_OUT([Rachel\nLane A])"
Add "    CORINNE -->|bi-directional loop| JAIME"
Add ""
Add "    style JAIME fill:#3d1a5c,color:#fff"
Add "    style CORINNE fill:#3d1a5c,color:#fff"
Add "    style RACHEL_IN fill:#2d4a22,color:#fff"
Add "    style RACHEL_OUT fill:#2d4a22,color:#fff"
Add $fence
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 6: Queue State Machine
# =========================================================
Add "## Diagram 6 -- Task Queue State Machine"
Add ""
Add "> All 51 tasks in logs/orchestrator/task-queue.json follow this state machine."
Add ""
Add "${fence}mermaid"
Add "stateDiagram-v2"
Add "    [*] --> queued : init-queue.ps1"
Add "    queued --> running : complete-and-advance.ps1 claims"
Add "    running --> waiting_ack : task output submitted"
Add "    waiting_ack --> done : FEEDS_ACK received from downstream"
Add "    waiting_ack --> retrying : ACK timeout (24h)"
Add "    retrying --> waiting_ack : escalate-and-retry"
Add "    retrying --> escalated : max retries exceeded"
Add "    running --> failed : error during processing"
Add "    failed --> queued : queue:reset-failed"
Add "    done --> [*]"
Add "    escalated --> [*] : manual intervention"
Add $fence
Add ""
Add "---"
Add ""

# =========================================================
# DIAGRAM 7: Full Sequence (Free Agent -> Premium Coding)
# =========================================================
Add "## Diagram 7 -- Full Session Sequence: Free Agent to Premium Coding"
Add ""
Add "> End-to-end flow from morning free-agent run to premium coding authorization."
Add ""
Add "${fence}mermaid"
Add "sequenceDiagram"
Add "    participant UA as User"
Add "    participant FA as Free Agents (17)"
Add "    participant Q as Task Queue"
Add "    participant MG as Margaret"
Add "    participant GC as gate-check.ps1"
Add "    participant RP as readiness-packet.ps1"
Add "    participant ADA as Ada"
Add "    participant SC as Senior Coders"
Add ""
Add "    UA->>FA: npm run orchestrator:morning"
Add "    FA->>Q: Claim next ready task"
Add "    FA->>FA: Paste prompt into Gemini/Groq/DeepSeek"
Add "    FA->>FA: Paste output into business_docs/ file"
Add "    FA->>Q: complete-and-advance (mark done + FEEDS_ACK)"
Add "    FA->>MG: FEEDS -> phase-context-summary"
Add ""
Add "    MG->>MG: npm run orchestrator:margaret-sync"
Add "    MG->>GC: npm run orchestrator:gate-check"
Add "    GC-->>MG: 9 PASS / 8 BLOCKED / 19 MISSING"
Add "    MG->>MG: Update DAILY_MILESTONE_TRACKER.md"
Add ""
Add "    alt All gate-check files PASS"
Add "        MG->>RP: npm run orchestrator:readiness-packet"
Add "        RP-->>MG: Readiness score"
Add "        alt Score >= 92 pct"
Add "            MG->>ADA: Request coding authorization"
Add "            ADA->>ADA: npm run orchestrator:wave-bundle"
Add "            ADA-->>SC: Context Ready -- Coding Phase Approved"
Add "            SC->>SC: Implement 3-5 modules"
Add "            SC->>UA: git commit - premium-wave -"
Add "        else Score < 92 pct"
Add "            MG->>FA: Route back to free agents"
Add "        end"
Add "    else Any gate BLOCKED"
Add "        MG->>FA: Assign targeted EXPAND tasks"
Add "    end"
Add $fence
Add ""
Add "---"
Add ""
Add "*Auto-generated by flowcharts-generator.ps1 on $today*"

$content = $out.ToString()
[System.IO.File]::WriteAllText($outFile, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[WRITTEN] $outFile  ($($content.Split("`n").Count) lines)" -ForegroundColor Green
