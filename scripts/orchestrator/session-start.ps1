# session-start.ps1 -- One-command session initializer for White Caves Orchestrator
# Chains: gate-check -> fast-complete -> morning-kickoff -> progress-report -> today-sprint
# Each step is printed with a phase header. Steps that fail print a warning but do NOT abort.
#
# Usage:
#   npm run orchestrator:session             -- full chain
#   npm run orchestrator:session:compact     -- chain with -NoPrompt on today-sprint
#   powershell -File session-start.ps1 -WorkspaceRoot . -NonInteractive
#   powershell -File session-start.ps1 -WorkspaceRoot . [-NoPrompt] [-SkipAutoComplete] [-Lane A]

param(
  [string]$WorkspaceRoot    = ".",
  [switch]$NoPrompt,          # pass -NoPrompt to today-sprint (compact output)
  [switch]$NonInteractive,    # autonomous mode: no interactive prompts downstream
  [switch]$SkipAutoComplete,  # skip fast-complete step
  [switch]$AutoAdvance,       # Step 6: auto-fast-forward top READY task if gate PASS
  [switch]$SkipAutoAdvance,   # skip Step 6 entirely
  [string]$Lane = ""          # filter today-sprint by lane: A/B/C/D
)

$ErrorActionPreference = "Continue"
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$policyUtils = Join-Path $scripts "policy-utils.ps1"
$w        = 72
$stepNum  = 0
$t0       = Get-Date

if (Test-Path $policyUtils) {
  . $policyUtils
}

$syncBase = "origin/main"
if (Get-Command Get-OrchestratorPolicy -ErrorAction SilentlyContinue) {
  try {
    $policy = Get-OrchestratorPolicy -WorkspaceRoot $root
    $gitPolicy = Get-OrchestratorGitPolicy -Policy $policy
    $syncBase = ("{0}/{1}" -f $gitPolicy.defaultRemote, $gitPolicy.integrationBranch)
  } catch {}
}

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

if ($NonInteractive -and -not $NoPrompt) {
  $NoPrompt = $true
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

function Get-QueueTotal {
  $qf = Join-Path $root "logs\orchestrator\task-queue.json"
  if (-not (Test-Path $qf)) { return 0 }
  $q = Get-Content $qf -Raw | ConvertFrom-Json
  return @($q.tasks).Count
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
  $nowTotal = Get-QueueTotal
  $dPass = $nowPass - $snapPass
  $dDone = $nowDone - $snapDone
  $dPassStr  = if ($dPass -gt 0) { "+$dPass" } elseif ($dPass -eq 0) { "=0" } else { "$dPass" }
  $dDoneStr  = if ($dDone -gt 0) { "+$dDone" } elseif ($dDone -eq 0) { "=0" } else { "$dDone" }
  $dPassCol  = if ($dPass -gt 0) { "Green" } elseif ($dPass -eq 0) { "DarkGray" } else { "Red" }
  $dDoneCol  = if ($dDone -gt 0) { "Green" } elseif ($dDone -eq 0) { "DarkGray" } else { "Red" }
  Write-Host ""
  Write-Host ("  Since last session ({0}):" -f $snapDate) -ForegroundColor DarkGray
  Write-Host ("    PASS files  : {0,-5}  ({1} -> {2} / {3} total)" -f $dPassStr, $snapPass, $nowPass, $gateTargets.Count) -ForegroundColor $dPassCol
  Write-Host ("    Tasks done  : {0,-5}  ({1} -> {2} / {3} total)" -f $dDoneStr, $snapDone, $nowDone, $nowTotal) -ForegroundColor $dDoneCol
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
# STEP 0: Loop-start sync -- stash/fetch/merge/pop from main
# ------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ("  STEP 0 -- LOOP START SYNC ({0})" -f $syncBase) -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
$syncScript = Join-Path $scripts "loop-start-sync.ps1"
if (Test-Path $syncScript) {
  & powershell -ExecutionPolicy Bypass -File "$syncScript" -WorkspaceRoot $root
  $syncExit = $LASTEXITCODE
  if ($syncExit -ne 0) {
    Write-Host ""
    Write-Host ("  [!!] LOOP START SYNC BLOCKED (exit {0}) -- session ABORTED" -f $syncExit) -ForegroundColor Red
    Write-Host "  Resolve merge/stash conflicts and retry." -ForegroundColor Red
    Write-Host ("=" * $w) -ForegroundColor Red
    exit 1
  }
  Write-Host "  Loop-start sync PASS -- proceeding to pre-checks." -ForegroundColor Green
} else {
  Write-Host "  [SKIP] loop-start-sync.ps1 not found -- skipping sync step." -ForegroundColor DarkYellow
}

# ------------------------------------------------------------------
# STEP 0.2: Queue health pre-check -- catch corruption BEFORE work begins
# ------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  STEP 0.2 -- QUEUE HEALTH PRE-CHECK" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
$healthScript = Join-Path $scripts "queue-health.ps1"
if (Test-Path $healthScript) {
  & powershell -ExecutionPolicy Bypass -File "$healthScript"
  $healthExit = $LASTEXITCODE
  if ($healthExit -ne 0) {
    Write-Host ""
    Write-Host ("  [!!] QUEUE CORRUPTION DETECTED (exit {0}) -- session ABORTED" -f $healthExit) -ForegroundColor Red
    Write-Host "  Fix task-queue.json before starting a new session." -ForegroundColor Red
    Write-Host "  Full report: npm run orchestrator:health" -ForegroundColor Yellow
    Write-Host ("=" * $w) -ForegroundColor Red
    exit 1
  }
  Write-Host "  Queue healthy -- proceeding to session steps." -ForegroundColor Green
} else {
  Write-Host "  [SKIP] queue-health.ps1 not found -- skipping pre-check." -ForegroundColor DarkYellow
}

# ------------------------------------------------------------------
# STEP 0.5: Daily digest -- situational awareness before any work
# ------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  STEP 0.5 -- DAILY DIGEST (one-line briefing)" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
$digestScript = Join-Path $scripts "daily-digest.ps1"
if (Test-Path $digestScript) {
  & powershell -ExecutionPolicy Bypass -File "$digestScript" -Brief
} else {
  Write-Host "  [SKIP] daily-digest.ps1 not found." -ForegroundColor DarkYellow
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
# STEP 6: Auto-Cascade -- surface highest-cascade READY task
# ------------------------------------------------------------------
if (-not $SkipAutoAdvance) {
  Write-Step "AUTO-CASCADE -- top READY task recommendation"

  # Cascade score: count tasks transitively unlocked if $taskId completes.
  # Uses BFS via HashSet (PS5.1-safe). Mirrors Get-CascadeScore in daily-digest.ps1.
  function Get-CascadeScoreLocal([string]$tid, $tList) {
    $seen = [System.Collections.Generic.HashSet[string]]::new()
    $seen.Add($tid) | Out-Null
    foreach ($t in ($tList | Where-Object { $_.status -eq "done" })) {
      $seen.Add($t.taskId) | Out-Null
    }
    $sc = 0; $chg = $true
    while ($chg) {
      $chg = $false
      foreach ($t in $tList) {
        if ($t.status -ne "queued")         { continue }
        if ($seen.Contains($t.taskId))      { continue }
        $deps = @(); if ($null -ne $t.dependsOn) { $deps = @($t.dependsOn) }
        $blk  = $false
        foreach ($dep in $deps) { if (-not $seen.Contains($dep)) { $blk = $true; break } }
        if (-not $blk) { $sc++; $seen.Add($t.taskId) | Out-Null; $chg = $true }
      }
    }
    return $sc
  }

  $acQF = Join-Path $root "logs\orchestrator\task-queue.json"
  if (-not (Test-Path $acQF)) {
    Write-Host "  [SKIP] Queue file not found." -ForegroundColor DarkYellow
  } else {
    $acQ     = Get-Content $acQF -Raw | ConvertFrom-Json
    $acTasks = @($acQ.tasks)

    $acDone = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($t in ($acTasks | Where-Object { $_.status -eq "done" })) {
      $acDone.Add($t.taskId) | Out-Null
    }

    # Collect READY tasks: queued + all deps done
    $acReady = @()
    foreach ($t in $acTasks) {
      if ($t.status -ne "queued") { continue }
      $deps = @(); if ($null -ne $t.dependsOn) { $deps = @($t.dependsOn) }
      $blk  = $false
      foreach ($dep in $deps) { if (-not $acDone.Contains($dep)) { $blk = $true; break } }
      if (-not $blk) { $acReady += $t }
    }

    if ($acReady.Count -eq 0) {
      $acTotalDone = @($acTasks | Where-Object { $_.status -eq "done" }).Count
      if ($acTotalDone -ge $acTasks.Count) {
        Write-Host "  ALL TASKS COMPLETE -- queue fully done!" -ForegroundColor Green
      } else {
        Write-Host "  No READY tasks -- all queued tasks are blocked." -ForegroundColor DarkYellow
        Write-Host "  Run: npm run orchestrator:blockers:brief" -ForegroundColor DarkGray
      }
    } else {

      # Score and pick top READY task
      $acTop = $null; $acTopScore = -1
      foreach ($t in $acReady) {
        $s = Get-CascadeScoreLocal $t.taskId $acTasks
        if ($s -gt $acTopScore) { $acTopScore = $s; $acTop = $t }
      }

      # Agent -> primary gate file
      $acAgGate = @{
        "@Sofia"    = "business_docs/05_requirements/compliance-requirements.md"
        "@Timnit"   = "business_docs/09_crm_features/dld-integration.md"
        "@Victoria" = "business_docs/09_crm_features/tenancy-ejari.md"
        "@Annie"    = "business_docs/09_crm_features/tenant-portal.md"
        "@Marissa"  = "business_docs/09_crm_features/luxury-segment.md"
        "@Rachel"   = "business_docs/09_crm_features/seo-strategy.md"
        "@Joelle"   = "business_docs/03_ai_assistants/README.md"
        "@Fei-Fei"  = "business_docs/09_crm_features/property-valuation.md"
        "@Anima"    = "business_docs/09_crm_features/secondary-sales.md"
        "@Mary"     = "business_docs/09_crm_features/sentinel-property.md"
        "@Invoice"  = "business_docs/09_crm_features/financial-reporting.md"
        "@Hedy"     = "business_docs/09_crm_features/audit-trail.md"
        "@Maya"     = "business_docs/09_crm_features/off-plan-projects.md"
        "@Booking"  = "business_docs/09_crm_features/viewings.md"
        "@Jaime"    = "business_docs/09_crm_features/offers.md"
        "@Cassie"   = "business_docs/09_crm_features/analytics-dashboard.md"
        "@Corinne"  = "business_docs/09_crm_features/ai-chat.md"
      }
      $acAgTool = @{
        "@Sofia"    = "https://aistudio.google.com/"
        "@Timnit"   = "https://aistudio.google.com/"
        "@Victoria" = "https://aistudio.google.com/"
        "@Annie"    = "https://aistudio.google.com/"
        "@Marissa"  = "https://aistudio.google.com/"
        "@Rachel"   = "https://aistudio.google.com/"
        "@Joelle"   = "https://console.groq.com/"
        "@Invoice"  = "https://console.groq.com/"
        "@Hedy"     = "https://console.groq.com/"
        "@Maya"     = "https://console.groq.com/"
        "@Booking"  = "https://console.groq.com/"
        "@Jaime"    = "https://console.groq.com/"
        "@Fei-Fei"  = "https://chat.deepseek.com/"
        "@Anima"    = "https://chat.deepseek.com/"
        "@Mary"     = "https://chat.deepseek.com/"
        "@Cassie"   = "https://chat.deepseek.com/"
        "@Corinne"  = "https://chat.deepseek.com/"
      }

      $acAgent   = $acTop.agent
      $acGateRel = if ($acAgGate.ContainsKey($acAgent)) { $acAgGate[$acAgent] } else { "" }
      $acFreeURL = if ($acAgTool.ContainsKey($acAgent)) { $acAgTool[$acAgent] } else { "https://aistudio.google.com/" }
      $acGateMax = if ($gateTargets.ContainsKey($acGateRel)) { $gateTargets[$acGateRel] } else { 0 }
      $acGateNow = 0
      if ($acGateRel -ne "") {
        $acGAbs = Join-Path $root ($acGateRel -replace "/", "\")
        if (Test-Path $acGAbs) {
          $acGateNow = @(Get-Content $acGAbs | Where-Object { $_ -match "^#{1,3} " }).Count
        }
      }
      $acGatePass = ($acGateMax -gt 0 -and $acGateNow -ge $acGateMax)
      $acGateFile = if ($acGateRel -ne "") { ($acGateRel -split "/")[-1] } else { "unknown" }
      $acModName  = $acGateFile -replace "\.md$", ""
      $acGateCol  = if ($acGatePass) { "Green" } else { "Yellow" }

      # -- Recommendation block --
      Write-Host ""
      Write-Host ("  TOP READY: {0,-8}  {1,-12}  Score {2}  Lane {3}" -f $acTop.taskId, $acAgent, $acTopScore, $acTop.lane) -ForegroundColor Cyan
      Write-Host ("  Task      : {0}" -f $acTop.title) -ForegroundColor White
      Write-Host ("  Gate file : {0}  ({1}/{2}  -- {3})" -f $acGateFile, $acGateNow, $acGateMax, $(if ($acGatePass) { "GATE PASS" } else { "needs more sections" })) -ForegroundColor $acGateCol
      Write-Host ("  Free tool : {0}" -f $acFreeURL) -ForegroundColor DarkGray
      Write-Host ""

      # List all READY tasks if more than one
      if ($acReady.Count -gt 1) {
        Write-Host ("  All {0} READY tasks:" -f $acReady.Count) -ForegroundColor DarkGray
        foreach ($rt in $acReady) {
          $rts   = Get-CascadeScoreLocal $rt.taskId $acTasks
          $star  = if ($rt.taskId -eq $acTop.taskId) { " <-- TOP" } else { "" }
          $rCol  = if ($rt.taskId -eq $acTop.taskId) { "Cyan" } else { "DarkGray" }
          Write-Host ("    {0,-8}  {1,-12}  Score {2,-4}  {3}{4}" -f $rt.taskId, $rt.agent, $rts, $rt.title, $star) -ForegroundColor $rCol
        }
        Write-Host ""
      }

      # Action steps
      Write-Host "  NEXT ACTIONS:" -ForegroundColor White
      Write-Host ("    1. Open   : {0}" -f $acFreeURL) -ForegroundColor Yellow
      Write-Host ("    2. Paste  : {0}'s prompt from TODAY SPRINT above" -f $acAgent) -ForegroundColor Yellow
      Write-Host ("    3. Save   : paste AI output into {0}" -f $acGateFile) -ForegroundColor Yellow
      Write-Host ("    4. Advance: npm run orchestrator:fast-forward -- -TaskId {0} -Force" -f $acTop.taskId) -ForegroundColor Yellow
      Write-Host ("    5. Check  : npm run orchestrator:milestone -- -Module {0}" -f $acModName) -ForegroundColor Yellow
      Write-Host ""

      # Auto-advance if flag is set
      if ($AutoAdvance) {
        if ($acGatePass) {
          Write-Host ("  [AUTO-ADVANCE] Gate PASS ({0}/{1}) -- running fast-forward for {2}..." -f $acGateNow, $acGateMax, $acTop.taskId) -ForegroundColor Green
          $acFF = Join-Path $scripts "fast-forward.ps1"
          if (Test-Path $acFF) {
            & powershell -ExecutionPolicy Bypass -File "$acFF" `
              -TaskId $acTop.taskId -Force -NonInteractive -WorkspaceRoot $root `
              -EvidenceNote ("Auto-advanced by session-start Step 6: {0}/{1} sections" -f $acGateNow, $acGateMax)
          } else {
            Write-Host "  [SKIP] fast-forward.ps1 not found." -ForegroundColor DarkYellow
          }
        } else {
          Write-Host ("  [AUTO-ADVANCE] Gate NOT met ({0}/{1} sections) -- skipping {2}." -f $acGateNow, $acGateMax, $acTop.taskId) -ForegroundColor Yellow
          Write-Host ("  Paste {0}'s output into {1} first, then re-run with -AutoAdvance." -f $acAgent, $acGateFile) -ForegroundColor DarkGray
        }
      }
    }
  }
} else {
  Write-Host ""
  Write-Host "  [SKIP] Auto-cascade step (-SkipAutoAdvance set)." -ForegroundColor DarkGray
}

# ------------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------------
$elapsed = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1)

# -- Write session snapshot for next session's delta --
$finalPass = Get-PassState
$finalDone = Get-DoneCount
$finalTotal = Get-QueueTotal
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
  Write-Host ("  Session delta   : {0} | {1} | queue {2}/{3}" -f $sdpStr, $sddStr, $finalDone, $finalTotal) -ForegroundColor $sdCol
}
Write-Host ""
Write-Host "  Quick actions:" -ForegroundColor White
  Write-Host "    npm run orchestrator:session:compact       -- re-run this (compact)" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:digest                -- full morning briefing" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:digest:agents         -- per-agent status table" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:fast-forward:dry      -- cascade preview (top task)" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:fast-complete         -- re-run auto-complete" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:report:print          -- re-print @Margaret brief" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:health                -- full 9-group queue health" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:blockers:brief        -- see what is blocking each task" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:cascade:all           -- rank READY tasks by impact" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:milestone:summary     -- 100% planning readiness check (all modules)" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:session:autoadvance   -- session + auto-advance top task" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Free-agent workflow:" -ForegroundColor White
Write-Host "    1. Copy the prompt from TODAY SPRINT above" -ForegroundColor DarkGray
Write-Host "    2. Paste into the free tool (Gemini/Groq/DeepSeek)" -ForegroundColor DarkGray
Write-Host "    3. Paste AI output into the target .md file" -ForegroundColor DarkGray
Write-Host "    4. Run: npm run orchestrator:complete-advance -- -TaskId T001b -AgentName @Sofia -EvidenceNote ""expanded risk-register""" -ForegroundColor DarkGray
Write-Host "    5. Run: npm run orchestrator:session:compact  -- to see what unlocked" -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""
