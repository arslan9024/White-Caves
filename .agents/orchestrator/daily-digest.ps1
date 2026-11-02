# daily-digest.ps1 -- 10-second morning briefing for the White Caves orchestrator.
#
# Prints a single-screen summary of:
#   - Queue progress (done / total, % complete, overall ETA)
#   - Section totals across all 42 gate files (sections added, sections remaining)
#   - Per-lane progress bar
#   - READY agents (paste now!) with cascade score
#   - Top blocker(s) with section gap
#   - Today's additions (tasks completed since midnight local time)
#   - Recommended first action: which READY task has the highest cascade score
#
# Usage:
#   npm run orchestrator:digest            -- full digest (default)
#   npm run orchestrator:digest:brief      -- one-line key stats only
#   npm run orchestrator:digest:agents     -- per-agent breakdown table
#   npm run orchestrator:digest:sections   -- gate-file section progress table
#
# PowerShell 5.1-safe. UTF-8 BOM. ASCII-only symbols.

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Brief,        # one-line summary mode
  [switch]$Agents,       # per-agent breakdown table
  [switch]$Sections      # gate-file section progress table
)

$ErrorActionPreference = "Continue"
$w    = 72
$root = Resolve-Path $WorkspaceRoot
$qFile = Join-Path $root "logs\orchestrator\task-queue.json"

# ---------------------------------------------------------------------------
# GATE TARGETS (must be kept in sync with cascade-preview.ps1, blocker-report.ps1)
# ---------------------------------------------------------------------------
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

# Agent -> gate files (primary owned file per agent)
$agentGateFile = @{
  "@Sofia"    = "business_docs/05_requirements/compliance-requirements.md"
  "@Timnit"   = "business_docs/09_crm_features/dld-integration.md"
  "@Victoria" = "business_docs/09_crm_features/tenancy-ejari.md"
  "@Annie"    = "business_docs/09_crm_features/tenant-portal.md"
  "@Marissa"  = "business_docs/06_design_architecture/ui-ux-specification.md"
  "@Rachel"   = "business_docs/09_crm_features/seo-strategy.md"
  "@Joelle"   = "business_docs/03_ai_assistants/README.md"
  "@Fei-Fei"  = "business_docs/09_crm_features/property-valuation.md"
  "@Anima"    = "business_docs/09_crm_features/secondary-sales.md"
  "@Mary"     = "business_docs/09_crm_features/sentinel-property.md"
  "@Invoice"  = "business_docs/09_crm_features/financial-reporting.md"
  "@Booking"  = "business_docs/09_crm_features/viewings.md"
  "@Maya"     = "business_docs/09_crm_features/off-plan-projects.md"
  "@Hedy"     = "business_docs/09_crm_features/audit-trail.md"
  "@Cassie"   = "business_docs/09_crm_features/analytics-dashboard.md"
  "@Jaime"    = "business_docs/09_crm_features/offers.md"
  "@Corinne"  = "business_docs/09_crm_features/ai-chat.md"
}

$SECS_PER_SESSION = 3  # avg sections added per paste session

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------
function Get-SectionCount([string]$relPath) {
  $full = Join-Path $root ($relPath -replace "/", "\")
  if (-not (Test-Path $full)) { return 0 }
  return @(Get-Content $full | Where-Object { $_ -match "^#{1,3} " }).Count
}

function Get-ReadyTasks($tasks) {
  $doneTids = @($tasks | Where-Object { $_.status -eq "done" } | ForEach-Object { $_.taskId })
  return @($tasks | Where-Object {
    $t = $_
    if ($t.status -ne "queued") { return $false }
    foreach ($dep in $t.dependsOn) {
      if ($doneTids -notcontains $dep) { return $false }
    }
    return $true
  })
}

function Get-CascadeScore([string]$taskId, $tasks) {
  # BFS: count tasks that become unblocked after completing $taskId
  $doneTids = [System.Collections.Generic.HashSet[string]]::new()
  $doneTids.Add($taskId) | Out-Null
  foreach ($t in ($tasks | Where-Object { $_.status -eq "done" })) {
    $doneTids.Add($t.taskId) | Out-Null
  }
  $score   = 0
  $changed = $true
  while ($changed) {
    $changed = $false
    foreach ($t in $tasks) {
      if ($t.status -ne "queued") { continue }
      if ($doneTids.Contains($t.taskId)) { continue }
      $blocked = $false
      foreach ($dep in $t.dependsOn) {
        if (-not $doneTids.Contains($dep)) { $blocked = $true; break }
      }
      if (-not $blocked) {
        $score++
        $doneTids.Add($t.taskId) | Out-Null
        $changed = $true
      }
    }
  }
  return $score
}

function Get-ProgressBar([int]$cur, [int]$max, [int]$barLen = 28) {
  if ($max -eq 0) { return ("[" + ("-" * $barLen) + "] n/a") }
  $pct   = [math]::Min(1.0, [double]$cur / [double]$max)
  $fill  = [math]::Round($pct * $barLen)
  $empty = $barLen - $fill
  $inner = ("#" * $fill) + ("-" * $empty)
  $pctStr = ("{0,3:0}%" -f ($pct * 100))
  return ("[" + $inner + "] " + $pctStr)
}

# ---------------------------------------------------------------------------
# LOAD QUEUE
# ---------------------------------------------------------------------------
if (-not (Test-Path $qFile)) {
  Write-Host "[XX] Queue file not found: $qFile" -ForegroundColor Red
  exit 1
}
$q     = Get-Content $qFile -Raw | ConvertFrom-Json
$tasks = @($q.tasks)
$total = $tasks.Count

$doneTasks    = @($tasks | Where-Object { $_.status -eq "done" })
$runningTasks = @($tasks | Where-Object { $_.status -eq "running" })
$failedTasks  = @($tasks | Where-Object { $_.status -eq "failed" })
$blockedTasks = @($tasks | Where-Object {
  $t = $_
  if ($t.status -ne "queued") { return $false }
  $doneTids = @($tasks | Where-Object { $_.status -eq "done" } | ForEach-Object { $_.taskId })
  foreach ($dep in $t.dependsOn) {
    if ($doneTids -notcontains $dep) { return $true }
  }
  return $false
})
$readyTasks   = Get-ReadyTasks $tasks
$doneCount    = $doneTasks.Count
$pctDone      = if ($total -gt 0) { [math]::Round(100.0 * $doneCount / $total) } else { 0 }

# Tasks completed today (since midnight local)
$todayStart    = (Get-Date).Date
$todayDone     = @($doneTasks | Where-Object {
  if ($null -eq $_.completedAt) { return $false }
  try { [datetime]$_.completedAt -ge $todayStart } catch { $false }
})
$todayDoneCount = $todayDone.Count

# ---------------------------------------------------------------------------
# SECTION TOTALS
# ---------------------------------------------------------------------------
$totalTarget   = 0
$totalActual   = 0
$sectionRows   = @()
foreach ($rel in $gateTargets.Keys) {
  $target  = $gateTargets[$rel]
  $actual  = Get-SectionCount $rel
  $gap     = [math]::Max(0, $target - $actual)
  $pass    = $actual -ge $target
  $totalTarget += $target
  $totalActual += $actual
  $sectionRows += @{ Rel = $rel; Actual = $actual; Target = $target; Gap = $gap; Pass = $pass }
}
$sectionGapTotal  = [math]::Max(0, $totalTarget - $totalActual)
$sectionPassCount = @($sectionRows | Where-Object { $_.Pass }).Count
$sectionPct       = if ($totalTarget -gt 0) { [math]::Round(100.0 * $totalActual / $totalTarget) } else { 0 }

# ETA: sessions remaining (each session = SECS_PER_SESSION sections added)
$sessionsNeeded = if ($SECS_PER_SESSION -gt 0) { [math]::Ceiling($sectionGapTotal / $SECS_PER_SESSION) } else { 0 }

# ---------------------------------------------------------------------------
# LANE PROGRESS
# ---------------------------------------------------------------------------
$laneMap = @{
  "A" = @("@Sofia","@Timnit","@Victoria","@Annie","@Marissa","@Rachel","@Joelle")
  "B" = @("@Fei-Fei","@Anima","@Mary","@Invoice")
  "C" = @("@Booking","@Maya","@Hedy","@Cassie")
  "D" = @("@Jaime","@Corinne")
}
$laneStats = @()
foreach ($lane in @("A","B","C","D")) {
  $laneTasks = @($tasks | Where-Object { $_.lane -eq $lane })
  $laneDone  = @($laneTasks | Where-Object { $_.status -eq "done" }).Count
  $laneTotal = $laneTasks.Count
  $laneStats += @{ Lane = $lane; Done = $laneDone; Total = $laneTotal; Agents = ($laneMap[$lane] -join ", ") }
}

# ---------------------------------------------------------------------------
# READY AGENTS WITH CASCADE SCORES
# ---------------------------------------------------------------------------
$readyInfo = @()
foreach ($t in $readyTasks) {
  $score = Get-CascadeScore $t.taskId $tasks
  $gf    = if ($agentGateFile.ContainsKey($t.agent)) { $agentGateFile[$t.agent] } else { "" }
  $actual = if ($gf -ne "") { Get-SectionCount $gf } else { 0 }
  $target = if ($gf -ne "" -and $gateTargets.ContainsKey($gf)) { $gateTargets[$gf] } else { 0 }
  $gap    = [math]::Max(0, $target - $actual)
  $readyInfo += @{ TaskId = $t.taskId; Agent = $t.agent; Title = $t.title; Score = $score; Actual = $actual; Target = $target; Gap = $gap }
}
# Sort by cascade score descending
$readyInfo = @($readyInfo | Sort-Object { $_.Score } -Descending)
$topReady  = if ($readyInfo.Count -gt 0) { $readyInfo[0] } else { $null }

# ---------------------------------------------------------------------------
# BRIEF MODE
# ---------------------------------------------------------------------------
if ($Brief) {
  $bar = Get-ProgressBar $doneCount $total 20
  Write-Host ""
  Write-Host ("  WHITE CAVES DIGEST  {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm")) -ForegroundColor Cyan
  Write-Host ("  Queue : {0}/{1} done {2}  |  {3} READY  |  {4} sections gap" -f $doneCount, $total, $bar, $readyTasks.Count, $sectionGapTotal) -ForegroundColor White
  if ($topReady) {
    Write-Host ("  TOP   : {0} {1} (Score {2}, gap -{3} secs)" -f $topReady.TaskId, $topReady.Agent, $topReady.Score, $topReady.Gap) -ForegroundColor Yellow
    Write-Host ("  CMD   : npm run orchestrator:fast-forward -- -TaskId {0} -Force" -f $topReady.TaskId) -ForegroundColor DarkGray
  }
  Write-Host ""
  exit 0
}

# ---------------------------------------------------------------------------
# SECTIONS TABLE MODE
# ---------------------------------------------------------------------------
if ($Sections) {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host "  WHITE CAVES -- GATE FILE SECTION PROGRESS" -ForegroundColor Cyan
  Write-Host ("  $(Get-Date -Format 'yyyy-MM-dd HH:mm')  |  {0}/{1} files PASS  |  {2}/{3} sections ({4}%)" -f $sectionPassCount, $sectionRows.Count, $totalActual, $totalTarget, $sectionPct) -ForegroundColor DarkGray
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ""
  Write-Host ("  {0,-55} {1,4} {2,4} {3,5}  {4}" -f "File", "Now", "Tgt", "Gap", "Status") -ForegroundColor DarkGray
  Write-Host ("  " + ("-" * 68)) -ForegroundColor DarkGray
  foreach ($row in ($sectionRows | Sort-Object { $_.Gap } -Descending)) {
    $shortPath = $row.Rel -replace "business_docs/", "" -replace "09_crm_features/", "crm/"
    $status    = if ($row.Pass) { "[PASS]" } else { "[----]" }
    $color     = if ($row.Pass) { "Green" } else { "Yellow" }
    Write-Host ("  {0,-55} {1,4} {2,4} {3,5}  {4}" -f $shortPath, $row.Actual, $row.Target, $row.Gap, $status) -ForegroundColor $color
  }
  Write-Host ""
  Write-Host ("  Total: {0}/{1} sections  |  {2} sections remaining  |  ~{3} sessions" -f $totalActual, $totalTarget, $sectionGapTotal, $sessionsNeeded) -ForegroundColor White
  Write-Host ""
  exit 0
}

# ---------------------------------------------------------------------------
# AGENTS TABLE MODE
# ---------------------------------------------------------------------------
if ($Agents) {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host "  WHITE CAVES -- PER-AGENT BREAKDOWN" -ForegroundColor Cyan
  Write-Host ("  $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -f "") -ForegroundColor DarkGray
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ""
  Write-Host ("  {0,-12} {1,-8} {2,4} {3,4} {4,5}  {5}" -f "Agent", "Status", "Now", "Tgt", "Gap", "Primary Gate File") -ForegroundColor DarkGray
  Write-Host ("  " + ("-" * 68)) -ForegroundColor DarkGray

  $allAgents = @("@Sofia","@Timnit","@Victoria","@Annie","@Marissa","@Rachel","@Joelle",
                 "@Fei-Fei","@Anima","@Mary","@Invoice","@Booking","@Maya","@Hedy","@Cassie",
                 "@Jaime","@Corinne")

  foreach ($ag in $allAgents) {
    # get agent's task status
    $agTasks   = @($tasks | Where-Object { $_.agent -eq $ag })
    $agDone    = @($agTasks | Where-Object { $_.status -eq "done" }).Count
    $agTotal   = $agTasks.Count
    $agReady   = @($readyTasks | Where-Object { $_.agent -eq $ag })
    $statusStr = if ($agReady.Count -gt 0) { "READY" } elseif ($agDone -eq $agTotal) { "ALL DONE" } else { "blocked" }

    $gf     = if ($agentGateFile.ContainsKey($ag)) { $agentGateFile[$ag] } else { "" }
    $actual = if ($gf -ne "") { Get-SectionCount $gf } else { 0 }
    $target = if ($gf -ne "" -and $gateTargets.ContainsKey($gf)) { $gateTargets[$gf] } else { 0 }
    $gap    = [math]::Max(0, $target - $actual)
    $shortGf = ($gf -replace "business_docs/","" -replace "09_crm_features/","crm/")
    $color  = if ($statusStr -eq "READY") { "Yellow" } elseif ($statusStr -eq "ALL DONE") { "Green" } else { "DarkGray" }
    Write-Host ("  {0,-12} {1,-8} {2,4} {3,4} {4,5}  {5}" -f $ag, $statusStr, $actual, $target, $gap, $shortGf) -ForegroundColor $color
  }
  Write-Host ""
  exit 0
}

# ---------------------------------------------------------------------------
# FULL DIGEST (default)
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- DAILY DIGEST" -ForegroundColor Cyan
Write-Host ("  $(Get-Date -Format 'dddd, MMMM d yyyy  HH:mm')" -f "") -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Cyan

# -- QUEUE OVERVIEW ----------------------------------------------------------
Write-Host ""
Write-Host "  QUEUE PROGRESS" -ForegroundColor White
$bar = Get-ProgressBar $doneCount $total 32
Write-Host ("  {0}  {1}/{2} tasks" -f $bar, $doneCount, $total) -ForegroundColor $(if ($pctDone -ge 75) { "Green" } elseif ($pctDone -ge 40) { "Yellow" } else { "DarkYellow" })
Write-Host ("    Done    : {0,3}   Running  : {1,2}   Failed  : {2,2}" -f $doneCount, $runningTasks.Count, $failedTasks.Count) -ForegroundColor DarkGray
Write-Host ("    Ready   : {0,3}   Blocked  : {1,2}   Today   : {2,2} tasks completed" -f $readyTasks.Count, $blockedTasks.Count, $todayDoneCount) -ForegroundColor DarkGray

# ETA advisory
if ($doneCount -lt $total) {
  $remaining     = $total - $doneCount
  Write-Host ("    ETA     : ~{0} task sessions to completion" -f $remaining) -ForegroundColor DarkGray
}

# -- SECTIONS OVERVIEW -------------------------------------------------------
Write-Host ""
Write-Host "  DOCUMENTATION SECTIONS" -ForegroundColor White
$sBar = Get-ProgressBar $totalActual $totalTarget 32
Write-Host ("  {0}  {1}/{2} sections" -f $sBar, $totalActual, $totalTarget) -ForegroundColor $(if ($sectionPct -ge 75) { "Green" } elseif ($sectionPct -ge 40) { "Yellow" } else { "DarkYellow" })
Write-Host ("    Files PASS : {0}/{1}   Gap : {2} sections   ETA : ~{3} paste sessions" -f $sectionPassCount, $gateTargets.Count, $sectionGapTotal, $sessionsNeeded) -ForegroundColor DarkGray

# -- LANE PROGRESS -----------------------------------------------------------
Write-Host ""
Write-Host "  LANE PROGRESS" -ForegroundColor White
foreach ($ls in $laneStats) {
  $lBar  = Get-ProgressBar $ls.Done $ls.Total 20
  $color = if ($ls.Done -eq $ls.Total) { "Green" } elseif ($ls.Done -gt 0) { "Yellow" } else { "DarkGray" }
  Write-Host ("  Lane {0}  {1}  {2}/{3}   {4}" -f $ls.Lane, $lBar, $ls.Done, $ls.Total, $ls.Agents) -ForegroundColor $color
}

# -- READY AGENTS ------------------------------------------------------------
Write-Host ""
Write-Host "  AGENTS READY TO RUN NOW" -ForegroundColor White
if ($readyInfo.Count -eq 0) {
  Write-Host "    (none -- run queue-health.ps1 to diagnose)" -ForegroundColor DarkGray
} else {
  foreach ($r in $readyInfo) {
    $flag = if ($r -eq $readyInfo[0]) { " <-- TOP PICK" } else { "" }
    Write-Host ("    {0,-6} {1,-12}  Score {2,2}  Gap -{3,2} secs  {4}{5}" -f $r.TaskId, $r.Agent, $r.Score, $r.Gap, $r.Title, $flag) -ForegroundColor Yellow
  }
}

# -- TOP BLOCKER -------------------------------------------------------------
$topBlocker = $null
$topBlockerGap = 0
foreach ($t in $blockedTasks) {
  $gf = if ($agentGateFile.ContainsKey($t.agent)) { $agentGateFile[$t.agent] } else { "" }
  if ($gf -eq "") { continue }
  $actual = Get-SectionCount $gf
  $target = if ($gateTargets.ContainsKey($gf)) { $gateTargets[$gf] } else { 0 }
  $gap    = [math]::Max(0, $target - $actual)
  if ($gap -gt $topBlockerGap) {
    $topBlockerGap  = $gap
    $topBlocker     = $t
  }
}

Write-Host ""
Write-Host "  TOP BLOCKER" -ForegroundColor White
if ($null -eq $topBlocker) {
  Write-Host "    (none -- all blocked tasks have gate files at or near target)" -ForegroundColor DarkGray
} else {
  $gfShort = ($agentGateFile[$topBlocker.agent] -replace "business_docs/","" -replace "09_crm_features/","crm/")
  Write-Host ("    {0,-6} {1,-12}  Gate gap : -{2} sections  [{3}]" -f $topBlocker.taskId, $topBlocker.agent, $topBlockerGap, $gfShort) -ForegroundColor Red
  Write-Host ("    Deps unmet : {0}" -f ($topBlocker.dependsOn -join ", ")) -ForegroundColor DarkGray
}

# -- TODAY ACTIVITY ----------------------------------------------------------
Write-Host ""
Write-Host "  TODAY'S COMPLETIONS" -ForegroundColor White
if ($todayDoneCount -eq 0) {
  Write-Host "    (none yet today)" -ForegroundColor DarkGray
} else {
  foreach ($t in $todayDone) {
    $ts = try { [datetime]$t.completedAt | Get-Date -Format "HH:mm" } catch { "?" }
    Write-Host ("    {0}  {1,-6}  {2,-12}  {3}" -f $ts, $t.taskId, $t.agent, $t.title) -ForegroundColor Green
  }
}

# -- RECOMMENDED ACTION ------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  RECOMMENDED FIRST ACTION" -ForegroundColor White
if ($null -ne $topReady) {
  Write-Host ("  -> Paste @{0} prompt into free AI tool (Score {1} cascade)" -f $topReady.Agent.TrimStart('@'), $topReady.Score) -ForegroundColor Yellow
  Write-Host ("     Gate file : {0}  (need {1} sections, have {2})" -f ($agentGateFile[$topReady.Agent] -replace "business_docs/",""), $topReady.Target, $topReady.Actual) -ForegroundColor DarkGray
  Write-Host ("     When done : npm run orchestrator:fast-forward -- -TaskId {0} -Force" -f $topReady.TaskId) -ForegroundColor DarkGray
  Write-Host ""
  Write-Host "  QUICK ACTIONS" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:digest:brief     -- one-line status" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:digest:agents    -- per-agent table" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:digest:sections  -- gate file table" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:fast-forward:dry -- cascade preview" -ForegroundColor DarkGray
  Write-Host "    npm run orchestrator:agent-loop       -- start 60-min loop" -ForegroundColor DarkGray
} else {
  Write-Host "  -> No READY tasks. Run: npm run orchestrator:health" -ForegroundColor Red
}
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""
