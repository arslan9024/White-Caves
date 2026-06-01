# queue-health.ps1 -- Queue integrity and health checker for White Caves Orchestrator
# Detects: orphaned tasks, broken dependency chains, stale running tasks,
#          version drift, missing agents, lane mismatches, unreachable tasks,
#          and ghost tasks (done with incomplete deps chain).
#
# Usage:
#   npm run orchestrator:health           -- full report (exit 0 = healthy)
#   npm run orchestrator:health:ci        -- CI mode: exit 1 if any ERROR found
#   npm run orchestrator:health:strict    -- exit 1 on any WARNING or ERROR
#
# Designed to run in CI (GitHub Actions, local pre-push hook) and in daily session-start.
#
# Exit codes:
#   0 = all checks passed (or only warnings in normal mode)
#   1 = errors found (or warnings found in strict/ci mode)

param(
  [string]$WorkspaceRoot = ".",
  [switch]$CI,       # exit 1 on any ERROR
  [switch]$Strict,   # exit 1 on any WARNING or ERROR
  [switch]$Brief     # one-line-per-check, no details
)

$ErrorActionPreference = "Continue"
$root      = Resolve-Path $WorkspaceRoot
$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"
$w         = 72

# -- known constants ----------------------------------------------------------
$EXPECTED_VERSION   = "2.0"
$DEFAULT_EXPECTED_TASKS = 51
$STALE_RUNNING_MINS = 120   # running > 2h without update = stale
$KNOWN_LANES        = @("A","B","C","D")
$KNOWN_AGENTS       = @(
  "@Sofia","@Victoria","@Annie","@Marissa","@Rachel","@Timnit",
  "@Invoice","@Joelle","@Hedy","@Maya","@Booking","@Jaime",
  "@Fei-Fei","@Anima","@Mary","@Cassie","@Corinne"
)
$VALID_STATUSES     = @("queued","running","evidence_pending","waiting_ack","done","retrying","failed","escalated")

# Lane -> expected agent assignments (for lane mismatch detection)
$LANE_AGENTS = @{
  "A" = @("@Sofia","@Timnit","@Victoria","@Annie","@Marissa","@Rachel","@Joelle")
  "B" = @("@Fei-Fei","@Anima","@Mary","@Invoice")
  "C" = @("@Booking","@Maya","@Hedy","@Cassie")
  "D" = @("@Jaime","@Corinne")
}

# -- result tracking ----------------------------------------------------------
$errors   = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$infos    = [System.Collections.Generic.List[string]]::new()
$checks   = 0

function Add-Error([string]$msg)   { $script:errors.Add($msg);   $script:checks++ }
function Add-Warn([string]$msg)    { $script:warnings.Add($msg); $script:checks++ }
function Add-Info([string]$msg)    { $script:infos.Add($msg);    $script:checks++ }

function Write-Check([string]$icon, [string]$label, [string]$detail, [string]$color) {
  if ($Brief) {
    Write-Host ("  {0} {1}" -f $icon, $label) -ForegroundColor $color
  } else {
    Write-Host ("  {0} {1}" -f $icon, $label) -ForegroundColor $color
    if ($detail -ne "") {
      foreach ($line in ($detail -split "`n")) {
        Write-Host ("      {0}" -f $line) -ForegroundColor DarkGray
      }
    }
  }
}

# -- BANNER -------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- QUEUE HEALTH CHECK" -ForegroundColor Cyan
$modeStr = if ($Strict) { "STRICT" } elseif ($CI) { "CI" } else { "NORMAL" }
Write-Host ("  Mode: $modeStr  |  $(Get-Date -Format 'yyyy-MM-dd HH:mm')") -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# CHECK 0: Queue file exists and is parseable
# ============================================================================
Write-Host "  [GROUP 0] Queue file integrity" -ForegroundColor White
if (-not (Test-Path $queueFile)) {
  Add-Error "Queue file missing: $queueFile"
  Write-Check "[XX]" "Queue file" "Path: $queueFile" "Red"
  Write-Host ""
  Write-Host "  Cannot continue without queue file." -ForegroundColor Red
  Write-Host ("=" * $w) -ForegroundColor Red
  exit 1
}

$q = $null
try {
  $q = Get-Content $queueFile -Raw | ConvertFrom-Json
} catch {
  Add-Error "Queue file is not valid JSON: $_"
  Write-Check "[XX]" "Queue JSON parse" "$_" "Red"
  exit 1
}
Write-Check "[OK]" "Queue file found and parseable" "" "Green"

$tasks = @($q.tasks)

# ============================================================================
# CHECK 1: Version and task count
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 1] Schema validation" -ForegroundColor White

# 1a. Version
if ($q.version -ne $EXPECTED_VERSION) {
  Add-Warn "Queue version drift: expected '$EXPECTED_VERSION', got '$($q.version)'"
  Write-Check "[!!]" "Version" "Expected $EXPECTED_VERSION, got $($q.version)" "DarkYellow"
} else {
  Write-Check "[OK]" "Version: $($q.version)" "" "Green"
}

# 1b. Task count
$expectedTasks = $null

# Prefer explicit metadata from queue if available
if ($null -ne $q.expectedTaskCount) {
  $expectedTasks = [int]$q.expectedTaskCount
} elseif ($null -ne $q.meta -and $null -ne $q.meta.expectedTaskCount) {
  $expectedTasks = [int]$q.meta.expectedTaskCount
}

# If queue looks like a generated Aegis cycle without explicit expected count,
# treat current count as baseline for this run to avoid false warnings.
if ($null -eq $expectedTasks -and -not [string]::IsNullOrWhiteSpace([string]$q.reason) -and [string]$q.reason -match 'Aegis|Autopilot queue completion|regeneration') {
  $expectedTasks = $tasks.Count
}

# Fallback to legacy default only when no metadata/reason hint is present.
if ($null -eq $expectedTasks) {
  $expectedTasks = $DEFAULT_EXPECTED_TASKS
}

if ($tasks.Count -ne $expectedTasks) {
  Add-Warn "Task count mismatch: expected $expectedTasks, got $($tasks.Count)"
  Write-Check "[!!]" "Task count" "Expected $expectedTasks, got $($tasks.Count)" "DarkYellow"
} else {
  Write-Check "[OK]" "Task count: $($tasks.Count)" "" "Green"
}

# 1c. Required fields on every task
$missingFields = @()
foreach ($t in $tasks) {
  $missing = @()
  if (-not $t.taskId)  { $missing += "taskId" }
  if (-not $t.agent)   { $missing += "agent" }
  if (-not $t.lane)    { $missing += "lane" }
  if (-not $t.status)  { $missing += "status" }
  if (-not $t.title)   { $missing += "title" }
  if ($missing.Count -gt 0) { $missingFields += "$($t.taskId): missing $($missing -join ',')" }
}
if ($missingFields.Count -gt 0) {
  foreach ($mf in $missingFields) { Add-Error "Required field missing -- $mf" }
  Write-Check "[XX]" "Required fields" ($missingFields -join "`n") "Red"
} else {
  Write-Check "[OK]" "All tasks have required fields" "" "Green"
}

# ============================================================================
# CHECK 2: Status values
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 2] Status validation" -ForegroundColor White

$badStatus = @($tasks | Where-Object { $VALID_STATUSES -notcontains $_.status })
if ($badStatus.Count -gt 0) {
  foreach ($b in $badStatus) { Add-Error "Invalid status '$($b.status)' on $($b.taskId)" }
  $detail = ($badStatus | ForEach-Object { "$($_.taskId)=$($_.status)" }) -join ", "
  Write-Check "[XX]" "Invalid statuses ($($badStatus.Count))" $detail "Red"
} else {
  Write-Check "[OK]" "All statuses valid" "" "Green"
}

# Status counts
$statusCounts = @{}
foreach ($t in $tasks) {
  $s = $t.status
  if (-not $statusCounts.ContainsKey($s)) { $statusCounts[$s] = 0 }
  $statusCounts[$s]++
}
$scStr = ($statusCounts.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key):$($_.Value)" }) -join "  "
Write-Check "->" "Status breakdown: $scStr" "" "DarkGray"

# ============================================================================
# CHECK 3: Agent validation
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 3] Agent validation" -ForegroundColor White

$unknownAgents = @($tasks | Where-Object { $KNOWN_AGENTS -notcontains $_.agent })
if ($unknownAgents.Count -gt 0) {
  foreach ($u in $unknownAgents) { Add-Warn "Unknown agent '$($u.agent)' on $($u.taskId)" }
  $detail = ($unknownAgents | ForEach-Object { "$($_.taskId)=$($_.agent)" }) -join ", "
  Write-Check "[!!]" "Unknown agents ($($unknownAgents.Count))" $detail "DarkYellow"
} else {
  Write-Check "[OK]" "All agents known" "" "Green"
}

# Lane ↔ agent mismatch
$laneMismatch = @()
foreach ($t in $tasks) {
  $lane = $t.lane
  $agent = $t.agent
  if ($LANE_AGENTS.ContainsKey($lane)) {
    if ($LANE_AGENTS[$lane] -notcontains $agent) {
      $laneMismatch += "$($t.taskId): agent $agent in lane $lane (expected: $($LANE_AGENTS[$lane] -join '/'))"
    }
  }
}
if ($laneMismatch.Count -gt 0) {
  foreach ($lm in $laneMismatch) { Add-Error "Lane/agent mismatch -- $lm" }
  Write-Check "[XX]" "Lane/agent mismatches ($($laneMismatch.Count))" ($laneMismatch -join "`n") "Red"
} else {
  Write-Check "[OK]" "All agent->lane assignments correct" "" "Green"
}

# Lane values valid
$badLanes = @($tasks | Where-Object { $KNOWN_LANES -notcontains $_.lane })
if ($badLanes.Count -gt 0) {
  foreach ($bl in $badLanes) { Add-Error "Unknown lane '$($bl.lane)' on $($bl.taskId)" }
  $detail = ($badLanes | ForEach-Object { "$($_.taskId)=$($_.lane)" }) -join ", "
  Write-Check "[XX]" "Unknown lanes ($($badLanes.Count))" $detail "Red"
} else {
  Write-Check "[OK]" "All lane values valid" "" "Green"
}

# ============================================================================
# CHECK 4: Dependency integrity
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 4] Dependency integrity" -ForegroundColor White

$allIds  = @($tasks | ForEach-Object { $_.taskId })
$orphans = @()   # dep references non-existent taskId
$cycles  = @()   # self-reference
$crossLane = @() # dep points to different lane

foreach ($t in $tasks) {
  $deps = @($t.dependsOn)
  if ($null -eq $deps -or $deps.Count -eq 0) { continue }
  foreach ($d in $deps) {
    if ([string]::IsNullOrWhiteSpace($d)) { continue }
    # orphan check
    if ($allIds -notcontains $d) {
      $orphans += "$($t.taskId) -> $d (not in queue)"
    }
    # self-reference
    if ($d -eq $t.taskId) {
      $cycles += "$($t.taskId) depends on itself"
    }
    # cross-lane dep check (advisory)
    $depTask = @($tasks | Where-Object { $_.taskId -eq $d })[0]
    if ($null -ne $depTask -and $depTask.lane -ne $t.lane) {
      $crossLane += "$($t.taskId)(Lane $($t.lane)) -> $d(Lane $($depTask.lane))"
    }
  }
}

if ($orphans.Count -gt 0) {
  foreach ($o in $orphans) { Add-Error "Orphan dep: $o" }
  Write-Check "[XX]" "Orphan dependencies ($($orphans.Count))" ($orphans -join "`n") "Red"
} else {
  Write-Check "[OK]" "No orphan dependencies" "" "Green"
}

if ($cycles.Count -gt 0) {
  foreach ($c in $cycles) { Add-Error "Self-referencing dep: $c" }
  Write-Check "[XX]" "Self-referencing deps ($($cycles.Count))" ($cycles -join "`n") "Red"
} else {
  Write-Check "[OK]" "No self-referencing deps" "" "Green"
}

if ($crossLane.Count -gt 0) {
  # cross-lane deps are warnings (valid in some designs, unusual here)
  foreach ($cl in $crossLane) { Add-Warn "Cross-lane dep: $cl" }
  Write-Check "[!!]" "Cross-lane deps ($($crossLane.Count))" ($crossLane -join "`n") "DarkYellow"
} else {
  Write-Check "[OK]" "No cross-lane dependencies" "" "Green"
}

# ============================================================================
# CHECK 5: Ghost tasks (done but deps not fully done)
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 5] Done-state consistency" -ForegroundColor White

$doneIds = @($tasks | Where-Object { $_.status -eq "done" } | ForEach-Object { $_.taskId })
$ghosts  = @()

foreach ($t in ($tasks | Where-Object { $_.status -eq "done" })) {
  $deps = @($t.dependsOn)
  if ($null -eq $deps -or $deps.Count -eq 0) { continue }
  foreach ($d in $deps) {
    if ([string]::IsNullOrWhiteSpace($d)) { continue }
    if ($doneIds -notcontains $d) {
      $depTask = @($tasks | Where-Object { $_.taskId -eq $d })[0]
      $depStatus = if ($null -ne $depTask) { $depTask.status } else { "MISSING" }
      $ghosts += "$($t.taskId) is done but dep $d is $depStatus"
    }
  }
}

if ($ghosts.Count -gt 0) {
  foreach ($g in $ghosts) { Add-Error "Ghost task: $g" }
  Write-Check "[XX]" "Ghost tasks (done with incomplete deps) ($($ghosts.Count))" ($ghosts -join "`n") "Red"
} else {
  Write-Check "[OK]" "No ghost tasks" "" "Green"
}

# ============================================================================
# CHECK 6: Unreachable tasks (queued, all deps done, but somehow still blocked)
#          These should have been auto-completed — flag as advisory
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 6] Ready-state check" -ForegroundColor White

$readyCount = 0
$readyList  = @()
foreach ($t in ($tasks | Where-Object { $_.status -eq "queued" })) {
  $deps = @($t.dependsOn)
  $allDepsDone = $true
  if ($null -ne $deps -and $deps.Count -gt 0) {
    foreach ($d in $deps) {
      if ([string]::IsNullOrWhiteSpace($d)) { continue }
      if ($doneIds -notcontains $d) { $allDepsDone = $false; break }
    }
  } else {
    # no deps = always ready
    $allDepsDone = $true
  }
  if ($allDepsDone) { $readyCount++; $readyList += $t.taskId }
}

if ($readyCount -eq 0) {
  Add-Info "No READY tasks -- all queued tasks are waiting on deps"
  Write-Check "->" "No READY tasks (all blocked on deps)" "" "DarkGray"
} else {
  Add-Info "$readyCount task(s) READY to execute"
  $detail = "READY: " + ($readyList -join ", ")
  Write-Check "->" "READY tasks: $readyCount" $detail "Cyan"
}

# ============================================================================
# CHECK 7: Stale running tasks
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 7] Stale running tasks" -ForegroundColor White

$runningTasks = @($tasks | Where-Object { $_.status -eq "running" })
$staleTasks   = @()

foreach ($rt in $runningTasks) {
  $startedAt = $rt.startedAt
  if (-not [string]::IsNullOrWhiteSpace($startedAt)) {
    try {
      $started = [datetime]::Parse($startedAt)
      $ageMin  = [math]::Round(((Get-Date) - $started).TotalMinutes, 0)
      if ($ageMin -gt $STALE_RUNNING_MINS) {
        $staleTasks += "$($rt.taskId) ($($rt.agent)) running for $ageMin min (threshold: $STALE_RUNNING_MINS min)"
      }
    } catch {}
  } else {
    # running with no startedAt timestamp = stale
    $staleTasks += "$($rt.taskId) ($($rt.agent)) has no startedAt timestamp"
  }
}

if ($runningTasks.Count -eq 0) {
  Write-Check "[OK]" "No running tasks" "" "Green"
} elseif ($staleTasks.Count -gt 0) {
  foreach ($s in $staleTasks) { Add-Warn "Stale running: $s" }
  Write-Check "[!!]" "Stale running tasks ($($staleTasks.Count))" ($staleTasks -join "`n") "DarkYellow"
  Write-Check "->" "Non-stale running tasks: $($runningTasks.Count - $staleTasks.Count)" "" "DarkGray"
} else {
  Write-Check "[OK]" "Running tasks OK (all within $STALE_RUNNING_MINS min threshold)" "" "Green"
  $detail = ($runningTasks | ForEach-Object { "$($_.taskId)($($_.agent))" }) -join ", "
  Write-Check "->" "Active: $($runningTasks.Count)" $detail "DarkGray"
}

# ============================================================================
# CHECK 8: Duplicate task IDs
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 8] Uniqueness checks" -ForegroundColor White

$idGroups   = $tasks | Group-Object { $_.taskId } | Where-Object { $_.Count -gt 1 }
$dupIds     = @($idGroups)
if ($dupIds.Count -gt 0) {
  foreach ($dup in $dupIds) { Add-Error "Duplicate taskId '$($dup.Name)' ($($dup.Count) times)" }
  $detail = ($dupIds | ForEach-Object { "$($_.Name) x$($_.Count)" }) -join ", "
  Write-Check "[XX]" "Duplicate task IDs ($($dupIds.Count) groups)" $detail "Red"
} else {
  Write-Check "[OK]" "No duplicate task IDs" "" "Green"
}

# ============================================================================
# CHECK 9: Waiting-ack staleness
# ============================================================================
Write-Host ""
Write-Host "  [GROUP 9] Waiting-ack checks" -ForegroundColor White

$ackTasks = @($tasks | Where-Object { $_.status -eq "waiting_ack" })
if ($ackTasks.Count -eq 0) {
  Write-Check "[OK]" "No tasks waiting for ACK" "" "Green"
} else {
  $staleAck = @()
  foreach ($at in $ackTasks) {
    $updatedAt = $at.updatedAt
    if (-not [string]::IsNullOrWhiteSpace($updatedAt)) {
      try {
        $upd    = [datetime]::Parse($updatedAt)
        $ageMin = [math]::Round(((Get-Date) - $upd).TotalMinutes, 0)
        if ($ageMin -gt 240) {  # > 4 hours without ACK = warn
          $staleAck += "$($at.taskId) ($($at.agent)) waiting $ageMin min"
        }
      } catch {}
    } else {
      $staleAck += "$($at.taskId) ($($at.agent)) no updatedAt"
    }
  }
  if ($staleAck.Count -gt 0) {
    foreach ($sa in $staleAck) { Add-Warn "Stale waiting_ack: $sa" }
    Write-Check "[!!]" "Stale waiting_ack ($($staleAck.Count))" ($staleAck -join "`n") "DarkYellow"
  } else {
    Write-Check "[OK]" "Waiting-ack tasks (recent)" "" "Green"
    $detail = ($ackTasks | ForEach-Object { $_.taskId }) -join ", "
    Write-Check "->" "Pending ACK: $($ackTasks.Count)" $detail "DarkGray"
  }
}

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  HEALTH SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

$errCount  = $errors.Count
$warnCount = $warnings.Count
$infoCount = $infos.Count

if ($errCount -gt 0) {
  Write-Host ("  ERRORS   ({0}):" -f $errCount) -ForegroundColor Red
  foreach ($e in $errors)   { Write-Host ("    [XX] {0}" -f $e) -ForegroundColor Red }
  Write-Host ""
}
if ($warnCount -gt 0) {
  Write-Host ("  WARNINGS ({0}):" -f $warnCount) -ForegroundColor DarkYellow
  foreach ($wn in $warnings) { Write-Host ("    [!!] {0}" -f $wn) -ForegroundColor DarkYellow }
  Write-Host ""
}

# Stats
$done      = @($tasks | Where-Object { $_.status -eq "done" }).Count
$remaining = $tasks.Count - $done
$pct       = [math]::Round($done / $tasks.Count * 100, 1)
Write-Host ("  Queue stats: {0} done / {1} remaining / {2} total  ({3}%)" -f $done, $remaining, $tasks.Count, $pct) -ForegroundColor White
Write-Host ("  Ready now  : {0} task(s)" -f $readyCount) -ForegroundColor White
Write-Host ""

if ($errCount -eq 0 -and $warnCount -eq 0) {
  Write-Host "  [OK] HEALTHY -- no issues detected" -ForegroundColor Green
} elseif ($errCount -eq 0) {
  Write-Host ("  [!!] MOSTLY HEALTHY -- {0} warning(s), 0 errors" -f $warnCount) -ForegroundColor DarkYellow
} else {
  Write-Host ("  [XX] UNHEALTHY -- {0} error(s), {1} warning(s)" -f $errCount, $warnCount) -ForegroundColor Red
}

Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

# Exit code logic
if ($Strict  -and ($errCount -gt 0 -or $warnCount -gt 0)) { exit 1 }
if ($CI      -and $errCount -gt 0)                         { exit 1 }
if ($errCount -gt 0)                                        { exit 1 }
exit 0
