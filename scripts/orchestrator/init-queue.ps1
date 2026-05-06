param(
  [string]$WorkspaceRoot = "."
)

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$queueFile = Join-Path $stateDir "task-queue.json"

$now = (Get-Date).ToString("o")

# Helper: create a task entry
function T {
  param([string]$Id,[string]$Agent,[string]$Lane,[string]$Title,
        [string[]]$Deps,[bool]$NeedsAck,[string]$AckBy)
  return @{
    taskId = $Id; agent = $Agent; lane = $Lane; title = $Title
    status = "queued"; dependsOn = $Deps
    requiresFeedsAck = $NeedsAck; feedsAckBy = $AckBy
    attempts = 0; createdAt = $now
    startedAt = $null; finishedAt = $null; evidence = @{}
  }
}

# ── LANE A  (Sofia → Timnit → Victoria → Annie → Marissa → Rachel → Joelle) ──
# Each agent has 3 tasks; task 2 depends on task 1 being done, task 3 on task 2.

$tasks = @(
  # @Sofia
  (T "T001" "@Sofia"   "A" "Compliance baseline expansion"                         @()       $true  "@Timnit"),
  (T "T001b" "@Sofia"  "A" "Risk register regulatory penalty table"                @("T001") $true  "@Timnit"),
  (T "T001c" "@Sofia"  "A" "RERA 2024 updates and UAE PDPL compliance audit"       @("T001b") $false $null),

  # @Timnit
  (T "T002"  "@Timnit" "A" "DLD/legal integration expansion"                       @("T001") $true  "@Victoria"),
  (T "T002b" "@Timnit" "A" "Legal management contract template library"            @("T002") $true  "@Victoria"),
  (T "T002c" "@Timnit" "A" "UAE PDPL data subject rights and consent spec"         @("T002b") $false $null),

  # @Victoria
  (T "T003"  "@Victoria" "A" "Tenancy legal workflow completion"                   @("T002") $true  "@Annie"),
  (T "T003b" "@Victoria" "A" "PDC post-dated cheque and bounced cheque workflow"   @("T003") $true  "@Annie"),
  (T "T003c" "@Victoria" "A" "Landlord portal KYC and NOC letter generation"       @("T003b") $false $null),

  # @Annie
  (T "T004"  "@Annie"  "A" "Tenant portal and doc-gen expansion"                   @("T003") $true  "@Marissa"),
  (T "T004b" "@Annie"  "A" "Document generation PDF spec"                          @("T004") $true  "@Marissa"),
  (T "T004c" "@Annie"  "A" "Email automation triggers via Resend API"              @("T004b") $false $null),

  # @Marissa
  (T "T005"  "@Marissa" "A" "UX and luxury journey synthesis"                      @("T004") $true  "@Rachel"),
  (T "T005b" "@Marissa" "A" "Community management spec"                            @("T005") $true  "@Rachel"),
  (T "T005c" "@Marissa" "A" "UI/UX mobile breakpoints and dark mode token map"     @("T005b") $false $null),

  # @Rachel
  (T "T006"  "@Rachel" "A" "SEO/marketing strategy enrichment"                     @("T005") $true  "@Joelle"),
  (T "T006b" "@Rachel" "A" "Marketing campaigns WhatsApp broadcast builder"        @("T006") $true  "@Joelle"),
  (T "T006c" "@Rachel" "A" "Careers portal spec"                                   @("T006b") $false $null),

  # @Joelle
  (T "T007"  "@Joelle" "A" "AI persona and fallback matrix handoff"                @("T006") $true  "@Margaret"),
  (T "T007b" "@Joelle" "A" "AI personas 25-35 draft (Intelligence cluster)"       @("T007") $true  "@Margaret"),
  (T "T007c" "@Joelle" "A" "Lead scoring AI logic and integration map update"      @("T007b") $false $null),

  # ── LANE B  (Fei-Fei → Anima → Mary → Invoice) ───────────────────────────
  # @Fei-Fei
  (T "T008"  "@Fei-Fei" "B" "Valuation and market inputs"                          @()       $true  "@Anima"),
  (T "T008b" "@Fei-Fei" "B" "Market intelligence area price index and DLD feeds"   @("T008") $true  "@Anima"),
  (T "T008c" "@Fei-Fei" "B" "Market analytics KPI tiles and export spec"           @("T008b") $false $null),

  # @Anima
  (T "T009"  "@Anima"  "B" "Data pipeline and secondary-sales bridge"              @("T008") $true  "@Mary"),
  (T "T009b" "@Anima"  "B" "Currency management and exchange-rate cache spec"      @("T009") $true  "@Mary"),
  (T "T009c" "@Anima"  "B" "Analytics dashboard data pipeline architecture"        @("T009b") $false $null),

  # @Mary
  (T "T010"  "@Mary"   "B" "Inventory-investment synthesis"                        @("T009") $true  "@Invoice"),
  (T "T010b" "@Mary"   "B" "Investment management portfolio dashboard spec"        @("T010") $true  "@Invoice"),
  (T "T010c" "@Mary"   "B" "Prospecting outbound HunterProspecting module spec"    @("T010b") $false $null),

  # @Invoice
  (T "T011"  "@Invoice" "B" "Financial modeling and KPI bridge"                    @("T010") $false $null),
  (T "T011b" "@Invoice" "B" "UAE VAT reporting FTA 5% and cash flow forecast"      @("T011") $false $null),
  (T "T011c" "@Invoice" "B" "Revenue model 3-year pro-forma and P&L spec"          @("T011b") $false $null),

  # ── LANE C  (Booking → Maya → Hedy → Cassie) ─────────────────────────────
  # @Booking
  (T "T012"  "@Booking" "C" "Viewing and scheduling contracts"                     @()       $true  "@Maya"),
  (T "T012b" "@Booking" "C" "Agent calendar availability and Google sync spec"     @("T012") $true  "@Maya"),
  (T "T012c" "@Booking" "C" "Virtual viewing Zoom integration and post-viewing flow" @("T012b") $false $null),

  # @Maya
  (T "T013"  "@Maya"   "C" "Off-plan handover flow"                                @("T012") $true  "@Hedy"),
  (T "T013b" "@Maya"   "C" "Snagging checklist and handover certificate spec"      @("T013") $true  "@Hedy"),
  (T "T013c" "@Maya"   "C" "Off-plan payment plan engine and escrow compliance"    @("T013b") $false $null),

  # @Hedy
  (T "T014"  "@Hedy"   "C" "Audit and follow-up controls"                          @("T013") $true  "@Cassie"),
  (T "T014b" "@Hedy"   "C" "Activity feed event types and personal vs company feed" @("T014") $true  "@Cassie"),
  (T "T014c" "@Hedy"   "C" "Follow-up automation sequence builder and cron engine" @("T014b") $false $null),

  # @Cassie
  (T "T015"  "@Cassie" "C" "Analytics synthesis and KPI evidence"                  @("T014") $false $null),
  (T "T015b" "@Cassie" "C" "Agent performance RERA license tracking and PIP spec"  @("T015") $false $null),
  (T "T015c" "@Cassie" "C" "Mobile analytics view and CSV/Excel export API spec"   @("T015b") $false $null),

  # ── LANE D  (Jaime → Corinne) ─────────────────────────────────────────────
  # @Jaime
  (T "T016"  "@Jaime"  "D" "Offers and WhatsApp routing"                           @()       $true  "@Corinne"),
  (T "T016b" "@Jaime"  "D" "WhatsApp Business API setup and template spec"         @("T016") $true  "@Corinne"),
  (T "T016c" "@Jaime"  "D" "NinaChatbot conversation flows and human handoff spec" @("T016b") $false $null),

  # @Corinne
  (T "T017"  "@Corinne" "D" "AI chat and maintenance mapping"                      @("T016") $false $null),
  (T "T017b" "@Corinne" "D" "AI chat streaming and token budget spec"              @("T017") $false $null),
  (T "T017c" "@Corinne" "D" "Interactive Dubai map search geospatial spec"         @("T017b") $false $null)
)

$payload = @{
  version     = "2.0"
  generatedAt = $now
  tasks       = $tasks
}

$payload | ConvertTo-Json -Depth 8 | Set-Content -Path $queueFile -Encoding UTF8
Write-Host "Initialized orchestrator queue (v2) at $queueFile" -ForegroundColor Green
Write-Host "Total tasks: $($tasks.Count) (3 per agent x 17 agents)" -ForegroundColor Cyan
