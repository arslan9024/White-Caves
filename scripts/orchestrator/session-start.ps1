# session-start.ps1 -- One-command session initializer for White Caves Orchestrator
# Chains: gate-check -> fast-complete -> morning-kickoff -> progress-report -> today-sprint
# Each step is printed with a phase header. Steps that fail print a warning but do NOT abort.
#
# Usage:
#   npm run orchestrator:session             -- full chain
#   npm run orchestrator:session:compact     -- chain with -NoPrompt on today-sprint
#   powershell -File session-start.ps1 -WorkspaceRoot . [-NoPrompt] [-SkipAutoComplete] [-Lane A]

param(
  [string]$WorkspaceRoot    = ".",
  [switch]$NoPrompt,          # pass -NoPrompt to today-sprint (compact output)
  [switch]$SkipAutoComplete,  # skip fast-complete step
  [string]$Lane = ""          # filter today-sprint by lane: A/B/C/D
)

$ErrorActionPreference = "Continue"
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$w        = 72
$stepNum  = 0
$t0       = Get-Date

function Write-Step($title) {
  $script:stepNum++
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ("  STEP $($script:stepNum) -- $title") -ForegroundColor Yellow
  Write-Host ("=" * $w) -ForegroundColor Cyan
}

function Invoke-Script($path, $argList) {
  if (-not (Test-Path $path)) {
    Write-Host "  [SKIP] Script not found: $path" -ForegroundColor DarkYellow
    return
  }
  & powershell -ExecutionPolicy Bypass -File $path @argList
}

# ------------------------------------------------------------------
# STATE HELPERS -- section-count-based PASS detection
# ------------------------------------------------------------------
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"     = 12
  "business_docs/05_requirements/risk-register.md"               = 5
  "business_docs/05_requirements/non-functional-requirements.md" = 8
  "business_docs/07_business_model/revenue-model.md"             = 13
  "business_docs/03_ai_assistants/README.md"                     = 40
  "business_docs/06_design_architecture/system-architecture.md"  = 12
  "business_docs/06_design_architecture/ui-ux-specification.md"  = 20
  "business_docs/09_crm_features/tenancy-ejari.md"               = 14
  "business_docs/09_crm_features/landlord-portal.md"             = 13
  "business_docs/09_crm_features/financial-reporting.md"         = 11
  "business_docs/09_crm_features/analytics-dashboard.md"         = 22
  "business_docs/09_crm_features/agent-performance.md"           = 14
  "business_docs/09_crm_features/lead-tracking.md"               = 12
  "business_docs/09_crm_features/tenant-portal.md"               = 14
  "business_docs/09_crm_features/dld-integration.md"             = 12
  "business_docs/09_crm_features/legal-management.md"            = 12
  "business_docs/09_crm_features/audit-trail.md"                 = 10
  "business_docs/09_crm_features/activity-feed.md"               = 8
  "business_docs/09_crm_features/follow-up-automation.md"        = 10
  "business_docs/09_crm_features/off-plan-projects.md"           = 14
  "business_docs/09_crm_features/handover-management.md"         = 10
  "business_docs/09_crm_features/scheduling-calendar.md"         = 12
  "business_docs/09_crm_features/viewings.md"                    = 10
  "business_docs/09_crm_features/offers.md"                      = 12
  "business_docs/09_crm_features/whatsapp-integration.md"        = 14
  "business_docs/09_crm_features/property-valuation.md"          = 10
  "business_docs/09_crm_features/market-intelligence.md"         = 10
  "business_docs/09_crm_features/market-analytics.md"            = 10
  "business_docs/09_crm_features/currency-management.md"         = 8
  "business_docs/09_crm_features/secondary-sales.md"             = 10
  "business_docs/09_crm_features/sentinel-property.md"           = 12
  "business_docs/09_crm_features/investment-management.md"       = 10
  "business_docs/09_crm_features/prospecting-outbound.md"        = 10
  "business_docs/09_crm_features/ai-chat.md"                     = 12
  "business_docs/09_crm_features/maintenance.md"                 = 10
  "business_docs/09_crm_features/document-generation.md"         = 10
  "business_docs/09_crm_features/email-automation.md"            = 8
  "business_docs/09_crm_features/seo-strategy.md"                = 16
  "business_docs/09_crm_features/marketing-campaigns.md"         = 12
  "business_docs/09_crm_features/luxury-segment.md"              = 10
  "business_docs/09_crm_features/community-management.md"        = 8
  "business_docs/09_crm_features/careers.md"                     = 8
}

function Get-PassState {
  $passFiles = @()
  foreach ($rel in $gateTargets.Keys) {
    $abs = Join-Path $root $rel.Replace("/","\")
    if (-not (Test-Path $abs)) { continue }
    $secs = @(Get-Content $abs | Where-Object { $_ -match "^##\s|^###\s" }).Count
    if ($secs -ge $gateTargets[$rel]) { $passFiles += $rel }
  }
  return @{ Count = $passFiles.Count; Files = [array]$passFiles }
}

function Get-DoneCount {
  $qf = Join-Path $root "logs\orchestrator\task-queue.json"
  if (-not (Test-Path $qf)) { return 0 }
  $q = Get-Content $qf -Raw | ConvertFrom-Json
  return @($q.tasks | Where-Object { $_.status -eq "done" }).Count
}

$snapshotFile = Join-Path $root "logs\orchestrator\session-snapshot.json"
$prevSnap = $null
if (Test-Path $snapshotFile) {
  try { $prevSnap = Get-Content $snapshotFile -Raw | ConvertFrom-Json } catch {}
}

# ------------------------------------------------------------------
# BANNER
# ------------------------------------------------------------------
$today = Get-Date -Format "dddd, MMMM d, yyyy"
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  WHITE CAVES ORCHESTRATOR -- SESSION START" -ForegroundColor Magenta
Write-Host "  $today" -ForegroundColor Magenta
Write-Host ("=" * $w) -ForegroundColor Magenta

# -- Cross-session delta (compared to previous session-start snapshot) --
if ($null -ne $prevSnap) {
  $snapDate = $prevSnap.date
  $snapPass = [int]$prevSnap.passCount
  $snapDone = [int]$prevSnap.doneCount
  $nowPass  = (Get-PassState).Count
  $nowDone  = Get-DoneCount
  $dPass = $nowPass - $snapPass
  $dDone = $nowDone - $snapDone
  $dPassStr  = if ($dPass -gt 0) { "+$dPass" } elseif ($dPass -eq 0) { "=0" } else { "$dPass" }
  $dDoneStr  = if ($dDone -gt 0) { "+$dDone" } elseif ($dDone -eq 0) { "=0" } else { "$dDone" }
  $dPassCol  = if ($dPass -gt 0) { "Green" } elseif ($dPass -eq 0) { "DarkGray" } else { "Red" }
  $dDoneCol  = if ($dDone -gt 0) { "Green" } elseif ($dDone -eq 0) { "DarkGray" } else { "Red" }
  Write-Host ""
  Write-Host ("  Since last session ({0}):" -f $snapDate) -ForegroundColor DarkGray
  Write-Host ("    PASS files  : {0,-5}  ({1} -> {2} / {3} total)" -f $dPassStr, $snapPass, $nowPass, $gateTargets.Count) -ForegroundColor $dPassCol
  Write-Host ("    Tasks done  : {0,-5}  ({1} -> {2} / 51 total)" -f $dDoneStr, $snapDone, $nowDone) -ForegroundColor $dDoneCol
  # list any new PASS files since last snapshot
  if ($dPass -gt 0) {
    $prevFiles  = if ($null -ne $prevSnap.passFiles) { @($prevSnap.passFiles) } else { @() }
    $curFiles   = (Get-PassState).Files
    $newlyPass  = @($curFiles | Where-Object { $prevFiles -notcontains $_ })
    foreach ($nf in $newlyPass) {
      Write-Host ("    NEWLY PASS  : {0}" -f $nf) -ForegroundColor Green
    }
  }
  Write-Host ""
} else {
  Write-Host ""
  Write-Host "  (First session -- snapshot will be created at end of this run)" -ForegroundColor DarkGray
  Write-Host ""
}

# ------------------------------------------------------------------
# STEP 1: Gate-check -- recount all business_docs sections
# ------------------------------------------------------------------
Write-Step "GATE-CHECK -- recount all doc sections"
Invoke-Script (Join-Path $scripts "gate-check.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 2: Fast-complete -- auto-mark PASS-target tasks done
# ------------------------------------------------------------------
if (-not $SkipAutoComplete) {
  Write-Step "FAST-COMPLETE -- auto-complete tasks targeting PASS docs"
  $preACDone = Get-DoneCount
  $preACPass = Get-PassState
  Invoke-Script (Join-Path $scripts "fast-complete.ps1") @("-WorkspaceRoot", $root)
  # -- within-session auto-complete delta
  $postACDone = Get-DoneCount
  $postACPass = Get-PassState
  $acNewDone  = $postACDone - $preACDone
  $acNewPass  = $postACPass.Count - $preACPass.Count
  if ($acNewDone -gt 0) {
    Write-Host ""
    Write-Host ("  AUTO-COMPLETE RESULT: {0} task(s) marked done this session" -f $acNewDone) -ForegroundColor Cyan
    if ($acNewPass -gt 0) {
      $prevPassFiles = if ($null -ne $preACPass.Files) { @($preACPass.Files) } else { @() }
      $newPassFiles  = @($postACPass.Files | Where-Object { $prevPassFiles -notcontains $_ })
      Write-Host ("  NEW PASS FILES  : {0}" -f $acNewPass) -ForegroundColor Cyan
      foreach ($npf in $newPassFiles) { Write-Host ("    PASS  {0}" -f $npf) -ForegroundColor Green }
    }
  } else {
    Write-Host "  (No tasks auto-completed -- docs not yet at gate targets)" -ForegroundColor DarkGray
  }
} else {
  Write-Host ""
  Write-Host "  [SKIP] fast-complete (SkipAutoComplete flag set)" -ForegroundColor DarkGray
}

# ------------------------------------------------------------------
# STEP 3: Morning kickoff -- lane status overview
# ------------------------------------------------------------------
Write-Step "MORNING KICKOFF -- agent status overview"
Invoke-Script (Join-Path $scripts "morning-kickoff.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 4: Progress report -- @Margaret briefing + tracker append
# ------------------------------------------------------------------
Write-Step "PROGRESS REPORT -- @Margaret briefing + tracker row"
Invoke-Script (Join-Path $scripts "progress-report.ps1") @("-WorkspaceRoot", $root)

# ------------------------------------------------------------------
# STEP 5: Today sprint -- READY tasks with prompts
# ------------------------------------------------------------------
Write-Step "TODAY SPRINT -- READY free-agent tasks"
$sprintArgs = @("-WorkspaceRoot", $root)
if ($NoPrompt)        { $sprintArgs += "-NoPrompt" }
if ($Lane -ne "")     { $sprintArgs += @("-Lane", $Lane) }
Invoke-Script (Join-Path $scripts "today-sprint.ps1") $sprintArgs

# ------------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------------
$elapsed = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1)

# -- Write session snapshot for next session's delta --
$finalPass = Get-PassState
$finalDone = Get-DoneCount
$snapObj   = [ordered]@{
  timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
  date      = (Get-Date -Format "yyyy-MM-dd")
  doneCount = $finalDone
  passCount = $finalPass.Count
  passFiles = $finalPass.Files
}
$snapJson = $snapObj | ConvertTo-Json -Depth 3
try {
  [System.IO.File]::WriteAllText($snapshotFile, $snapJson, (New-Object System.Text.UTF8Encoding($false)))
} catch {
  Write-Host "  [WARN] Could not write session snapshot: $_" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  SESSION START COMPLETE  ($elapsed s)" -ForegroundColor Magenta
# -- session delta summary line
if ($null -ne $prevSnap) {
  $sd_pass = $finalPass.Count - [int]$prevSnap.passCount
  $sd_done = $finalDone      - [int]$prevSnap.doneCount
  $sdpStr  = if ($sd_pass -gt 0) { "+$sd_pass PASS" } else { "=0 PASS" }
  $sddStr  = if ($sd_done -gt 0) { "+$sd_done tasks" } else { "=0 tasks" }
  $sdCol   = if ($sd_pass -gt 0 -or $sd_done -gt 0) { "Green" } else { "DarkGray" }
  Write-Host ("  Session delta   : {0} | {1} | queue {2}/51" -f $sdpStr, $sddStr, $finalDone) -ForegroundColor $sdCol
}
Write-Host ""
Write-Host "  Quick actions:" -ForegroundColor White
Write-Host "    npm run orchestrator:session:compact   -- re-run this (compact)" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:fast-complete     -- re-run auto-complete" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:report:print      -- re-print @Margaret brief" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Free-agent workflow:" -ForegroundColor White
Write-Host "    1. Copy the prompt from TODAY SPRINT above" -ForegroundColor DarkGray
Write-Host "    2. Paste into the free tool (Gemini/Groq/DeepSeek)" -ForegroundColor DarkGray
Write-Host "    3. Paste AI output into the target .md file" -ForegroundColor DarkGray
Write-Host "    4. Run: npm run orchestrator:complete-advance -- -TaskId T001b -AgentName @Sofia -EvidenceNote ""expanded risk-register""" -ForegroundColor DarkGray
Write-Host "    5. Run: npm run orchestrator:session:compact  -- to see what unlocked" -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""
