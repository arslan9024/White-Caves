# progress-report.ps1 -- @Margaret daily progress report generator
# Reads queue state + gate-check to produce a markdown summary.
# Appends one row to DAILY_MILESTONE_TRACKER.md (Orchestrator Sync Log table)
# and prints a full @Margaret briefing to the terminal.
#
# Usage:
#   npm run orchestrator:report              -- print + append to tracker
#   npm run orchestrator:report:print        -- print only, no file write
#   powershell -File progress-report.ps1 -WorkspaceRoot . -AppendToTracker

param(
  [string]$WorkspaceRoot   = ".",
  [switch]$AppendToTracker,   # write row to DAILY_MILESTONE_TRACKER.md
  [switch]$PrintOnly          # print only (default when no -AppendToTracker)
)

$ErrorActionPreference = "Stop"
$root       = Resolve-Path $WorkspaceRoot
$queueFile  = Join-Path $root "logs\orchestrator\task-queue.json"
$trackerFile= Join-Path $root "DAILY_MILESTONE_TRACKER.md"
$gateScript = Join-Path $root "scripts\orchestrator\gate-check.ps1"

# ------------------------------------------------------------------
# 1. Read queue
# ------------------------------------------------------------------
if (-not (Test-Path $queueFile)) {
  Write-Host "[progress-report] ERROR: queue file not found: $queueFile" -ForegroundColor Red
  exit 1
}

$raw   = Get-Content $queueFile -Raw
$q     = $raw | ConvertFrom-Json
$tasks = @($q.tasks)
$total = $tasks.Count

$statusGroups = @{}
foreach ($t in $tasks) {
  $s = if ($null -ne $t.status) { $t.status } else { "unknown" }
  if (-not $statusGroups.ContainsKey($s)) { $statusGroups[$s] = [System.Collections.Generic.List[object]]::new() }
  $statusGroups[$s].Add($t)
}
function CountStatus($s){ if($statusGroups.ContainsKey($s)){ $statusGroups[$s].Count } else { 0 } }

$nDone       = CountStatus "done"
$nRunning    = CountStatus "running"
$nWaitAck    = CountStatus "waiting_ack"
$nQueued     = CountStatus "queued"
$nRetrying   = CountStatus "retrying"
$nFailed     = CountStatus "failed"
$nEscalated  = CountStatus "escalated"

# ------------------------------------------------------------------
# 2. Run gate-check (capture output lines)
# ------------------------------------------------------------------
$gateLines = @()
if (Test-Path $gateScript) {
  try {
    $gateLines = @(& powershell -ExecutionPolicy Bypass -File $gateScript -WorkspaceRoot $root 2>&1 |
      ForEach-Object { "$_" })
  } catch { $gateLines = @("(gate-check error: $_)") }
}

$passCount    = 0; $blockedCount = 0; $missingCount = 0
foreach ($line in $gateLines) {
  if ($line -match "PASS:\s*(\d+)")    { $passCount    = [int]$Matches[1] }
  if ($line -match "BLOCKED:\s*(\d+)") { $blockedCount = [int]$Matches[1] }
  if ($line -match "MISSING:\s*(\d+)") { $missingCount = [int]$Matches[1] }
}

# ------------------------------------------------------------------
# 3. Compute READY agents (queued + all deps done)
# ------------------------------------------------------------------
function Test-DepsDoneReport([array]$deps, $all) {
  if ($null -eq $deps -or $deps.Count -eq 0) { return $true }
  foreach ($d in $deps) {
    $dep = $all | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
}

$readyTasks = @($tasks | Where-Object {
  $_.status -eq "queued" -and (Test-DepsDoneReport -deps @($_.dependsOn) -all $tasks)
})

$doneTasks = @($tasks | Where-Object { $_.status -eq "done" })

# ------------------------------------------------------------------
# 4. Load prompts for ready task snippets
# ------------------------------------------------------------------
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"
$prompts = @{}
if (Test-Path $promptsFile) {
  try {
    $pj = Get-Content $promptsFile -Raw | ConvertFrom-Json
    $pj.PSObject.Properties | ForEach-Object { $prompts[$_.Name] = $_.Value }
  } catch {}
}

# ------------------------------------------------------------------
# 5. Build report data
# ------------------------------------------------------------------
$today    = Get-Date -Format "MMM d"
$todayFull= Get-Date -Format "dddd, MMMM d, yyyy"
$pct      = if ($total -gt 0) { [math]::Round(($nDone / $total) * 100) } else { 0 }
$barFull  = [math]::Round($pct / 5)
$barEmpty = 20 - $barFull
$bar      = "[" + ("=" * $barFull) + (" " * $barEmpty) + "]"

# Agent lanes
$laneMap = @{
  "Lane A" = @("@Sofia","@Timnit","@Victoria","@Annie","@Marissa","@Rachel","@Joelle")
  "Lane B" = @("@Fei-Fei","@Anima","@Mary","@Invoice")
  "Lane C" = @("@Booking","@Maya","@Hedy","@Cassie")
  "Lane D" = @("@Jaime","@Corinne")
}
function Get-Lane($agent) {
  foreach ($lane in $laneMap.Keys) {
    if ($laneMap[$lane] -contains $agent) { return $lane }
  }
  return "?"
}

# ------------------------------------------------------------------
# 6. Terminal output -- full briefing
# ------------------------------------------------------------------
$w = 72
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  @MARGARET DAILY BRIEFING -- $todayFull" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""
Write-Host ("  QUEUE SNAPSHOT  $bar  $pct%") -ForegroundColor White
Write-Host ""
Write-Host ("  Total:{0,3}  Done:{1,3}  Queued:{2,3}  Running:{3,2}" -f $total,$nDone,$nQueued,$nRunning) -ForegroundColor White
Write-Host ("  WaitAck:{0,2}  Retrying:{1,2}  Failed:{2,2}  Escalated:{3,2}" -f $nWaitAck,$nRetrying,$nFailed,$nEscalated) -ForegroundColor White
Write-Host ""
Write-Host ("  GATE-CHECK DOCS  PASS:{0}  BLOCKED:{1}  MISSING:{2}" -f $passCount,$blockedCount,$missingCount) -ForegroundColor White
Write-Host ""

# Done tasks
if ($doneTasks.Count -gt 0) {
  Write-Host "  -- COMPLETED TASKS --" -ForegroundColor Green
  foreach ($t in $doneTasks) {
    $auto = if ($t.autoComplete) { " [auto]" } else { "" }
    Write-Host ("  [DONE]  {0,-8} {1,-12} {2}{3}" -f $t.taskId, $t.agent, $t.title, $auto) -ForegroundColor Green
  }
  Write-Host ""
}

# Ready agents
if ($readyTasks.Count -gt 0) {
  Write-Host "  -- READY FOR FREE-AGENT WORK ($($readyTasks.Count) tasks) --" -ForegroundColor Cyan
  foreach ($t in $readyTasks) {
    $lane   = Get-Lane $t.agent
    if ($prompts.ContainsKey($t.taskId)) {
      $pv = $prompts[$t.taskId]
      $prompt = if ($pv -is [string]) { [string]$pv } elseif ($null -ne $pv -and $pv.PSObject.Properties.Name -contains "prompt") { [string]$pv.prompt } else { [string]$pv }
    } else {
      $prompt = "(no prompt)"
    }
    $short  = if ($prompt.Length -gt 90) { $prompt.Substring(0,87) + "..." } else { $prompt }
    Write-Host ("  [READY]  {0,-8} {1,-12} {2}" -f $t.taskId, $t.agent, $t.title) -ForegroundColor Cyan
    Write-Host ("           Lane: $lane  |  Prompt: $short") -ForegroundColor DarkGray
  }
  Write-Host ""
}

# Blocked count
$nBlocked = @($tasks | Where-Object { $_.status -eq "queued" -and -not (Test-DepsDoneReport -deps @($_.dependsOn) -all $tasks) }).Count
if ($nBlocked -gt 0) {
  Write-Host ("  -- BLOCKED: $nBlocked tasks waiting on upstream deps --") -ForegroundColor DarkYellow
  Write-Host ""
}

# Margaret sign-off
Write-Host "  -- @MARGARET SIGN-OFF --" -ForegroundColor Magenta
$nextAgent = if ($readyTasks.Count -gt 0) { $readyTasks[0].agent } else { "none" }
$nextTask  = if ($readyTasks.Count -gt 0) { $readyTasks[0].taskId } else { "n/a" }
Write-Host ("  Priority: $nextAgent $nextTask  |  Gate: PASS=$passCount  |  Progress: $nDone/$total ($pct%)") -ForegroundColor Magenta
Write-Host ""
Write-Host ("  Commands:") -ForegroundColor DarkGray
Write-Host ("    npm run orchestrator:today-sprint       -- show all READY tasks with prompts") -ForegroundColor DarkGray
Write-Host ("    npm run orchestrator:fast-complete      -- auto-complete any PASS-target tasks") -ForegroundColor DarkGray
Write-Host ("    npm run orchestrator:gate-check         -- recheck all doc section counts") -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------------
# 7. Append row to DAILY_MILESTONE_TRACKER.md
# ------------------------------------------------------------------
$doAppend = $AppendToTracker -or (-not $PrintOnly -and -not $AppendToTracker)
# Default behaviour: append unless -PrintOnly is set
if ($PrintOnly) { $doAppend = $false }
if (-not $AppendToTracker -and -not $PrintOnly) { $doAppend = $true }

if ($doAppend) {
  if (-not (Test-Path $trackerFile)) {
    Write-Host "[progress-report] WARNING: tracker file not found, skipping append." -ForegroundColor Yellow
  } else {
    $readyNames  = ($readyTasks | ForEach-Object { $_.agent }) -join ", "
    if (-not $readyNames) { $readyNames = "none" }
    $doneNames   = ($doneTasks  | ForEach-Object { "$($_.taskId)($($_.agent))" }) -join ", "
    if (-not $doneNames)  { $doneNames  = "none" }

    $noteText = "Queue: done=$nDone running=$nRunning waitAck=$nWaitAck queued=$nQueued failed=$nFailed -- " +
                "Docs: PASS=$passCount BLOCKED=$blockedCount MISSING=$missingCount -- " +
                "Done: $doneNames -- " +
                "READY: $readyNames"
    # Truncate if too long
    if ($noteText.Length -gt 350) { $noteText = $noteText.Substring(0,347) + "..." }

    $newRow = "| $today | Orchestrator Sync | @Katherine + @Margaret | Done   | $noteText |"

    $content = Get-Content $trackerFile -Raw
    # Find the Orchestrator Sync Log section and insert the row before the next heading.
    if ($content -match '(?m)^##\s+Orchestrator Sync Log\s*$') {
      $sectionStart = $content.IndexOf('## Orchestrator Sync Log')
      $nextHeading  = [regex]::Matches($content, '(?m)^##\s+') |
        Where-Object { $_.Index -gt $sectionStart } |
        Select-Object -First 1

      $insertIndex = if ($null -ne $nextHeading) { $nextHeading.Index } else { $content.Length }
      $updated = $content.Insert($insertIndex, "`n$newRow`n")
      [System.IO.File]::WriteAllText($trackerFile, $updated, (New-Object System.Text.UTF8Encoding($false)))
      Write-Host "  [progress-report] Row appended to DAILY_MILESTONE_TRACKER.md" -ForegroundColor Green
    } else {
      Write-Host "  [progress-report] WARNING: Orchestrator Sync Log section not found in tracker." -ForegroundColor Yellow
      Write-Host "  New row: $newRow" -ForegroundColor DarkGray
    }
  }
}
