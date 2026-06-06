# dashboard.ps1 -- Rich visual orchestration dashboard
# Shows: worker health, queue summary, per-agent status, escalations, gate status
param(
  [string]$WorkspaceRoot = ".",
  [switch]$Watch,          # if set, refresh every $RefreshSeconds seconds
  [int]$RefreshSeconds = 15
)

$stateDir    = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile   = Join-Path $stateDir "task-queue.json"
$priorityFile = Join-Path $stateDir "priority-order.json"
$pidFile     = Join-Path $stateDir "worker-processes.json"
$wdLog       = Join-Path $stateDir "watchdog-scheduler.log"
$liveLoopLog = Join-Path $stateDir "live-loop-output.txt"
$tenTaskStateFile = Join-Path $stateDir "ten-task-loop.json"
$recoveryStateFile = Join-Path $stateDir "autopilot-recovery-state.json"
$recoveryEventsFile = Join-Path $stateDir "autopilot-recovery-events.json"
$steeringFile = Join-Path $stateDir "task-steering.json"
$discoveryReportFile = Join-Path $stateDir "discover-upgrade-report.json"
$discoveryGateFailFile = Join-Path $stateDir "DISCOVERY_GATE_FAIL.json"
$sessionLogFile = Join-Path $stateDir "autopilot-session-log.json"
$roadmapRegistryFile = Join-Path $stateDir "github-issue-roadmap.json"
$scanReportFile = Join-Path $stateDir "codebase-scan-report.json"
# $trackerFile reserved for future escalation log display

function Read-Queue {
  if (-not (Test-Path $queueFile)) { return $null }
  $raw = Get-Content $queueFile -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  return $raw | ConvertFrom-Json
}

function Read-Workers {
  if (-not (Test-Path $pidFile)) { return @() }
  $raw = Get-Content $pidFile -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return @() }
  $parsed = $raw | ConvertFrom-Json
  if ($parsed -isnot [array]) { return @($parsed) }
  return $parsed
}

function Read-JsonFile {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $raw = Get-Content -Path $Path -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  try {
    return $raw | ConvertFrom-Json
  }
  catch {
    return $null
  }
}

function Read-PriorityOrder {
  if (-not (Test-Path $priorityFile)) { return $null }
  try {
    $raw = Get-Content -Path $priorityFile -Raw
    if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
    return $raw | ConvertFrom-Json
  }
  catch {
    return $null
  }
}

function Get-RecoveryEvents {
  if (-not (Test-Path $recoveryEventsFile)) { return @() }
  try {
    $parsed = Get-Content -Path $recoveryEventsFile -Raw | ConvertFrom-Json
    if ($parsed -is [array]) { return @($parsed) }
    if ($null -ne $parsed) { return @($parsed) }
    return @()
  }
  catch {
    return @()
  }
}

function Read-SteeringState {
  if (-not (Test-Path $steeringFile)) { return $null }
  try {
    $raw = Get-Content -Path $steeringFile -Raw
    if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
    return $raw | ConvertFrom-Json
  }
  catch {
    return $null
  }
}

function Read-SessionLog {
  if (-not (Test-Path $sessionLogFile)) { return @() }
  try {
    $raw = Get-Content -Path $sessionLogFile -Raw
    if ([string]::IsNullOrWhiteSpace($raw)) { return @() }
    $parsed = $raw | ConvertFrom-Json
    if ($parsed -is [array]) { return @($parsed) }
    if ($null -ne $parsed) { return @($parsed) }
    return @()
  }
  catch {
    return @()
  }
}

function Get-DevelopmentInsights {
  param(
    [object]$Queue,
    [object]$SessionEntries,
    [object]$RoadmapRegistry,
    [object]$ScanReport
  )

  $tasks = @()
  if ($null -ne $Queue -and $null -ne $Queue.tasks) {
    $tasks = @($Queue.tasks)
  }

  $totalTasks = $tasks.Count
  $completedTasks = ($tasks | Where-Object { $_.status -in @('done', 'complete') }).Count
  $pendingTasks = ($tasks | Where-Object { $_.status -notin @('done', 'complete', 'archived') }).Count
  $runningTasks = ($tasks | Where-Object { $_.status -in @('running', 'evidence_pending') }).Count
  $blockedTasks = ($tasks | Where-Object { $_.status -in @('blocked', 'failed', 'escalated') }).Count

  $sessionArray = @($SessionEntries)
  $sessionCount = $sessionArray.Count
  $okSessions = ($sessionArray | Where-Object { $_.status -eq 'ok' }).Count
  $failedSessions = ($sessionArray | Where-Object { $_.status -ne 'ok' }).Count
  $successRate = if ($sessionCount -gt 0) { [math]::Round(($okSessions / $sessionCount) * 100, 1) } else { 0 }

  $windowStart = (Get-Date).AddHours(-24)
  $last24hSessions = @($sessionArray | Where-Object {
    try { (Get-Date ([string]$_.timestamp)) -ge $windowStart } catch { $false }
  })
  $last24hCount = $last24hSessions.Count

  $completedTaskIds = @($sessionArray | ForEach-Object { [string]$_.task } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
  $uniqueCompletedCount = @($completedTaskIds | Sort-Object -Unique).Count
  $last24hUniqueCompleted = @($last24hSessions | ForEach-Object { [string]$_.task } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique).Count

  $roadmapIssues = if ($null -ne $RoadmapRegistry -and $null -ne $RoadmapRegistry.issueCount) { [int]$RoadmapRegistry.issueCount } else { 0 }
  $roadmapWaves = if ($null -ne $RoadmapRegistry -and $null -ne $RoadmapRegistry.milestoneCount) { [int]$RoadmapRegistry.milestoneCount } else { 0 }
  $roadmapTarget = if ($null -ne $RoadmapRegistry -and $null -ne $RoadmapRegistry.bootstrapTargetCount) { [int]$RoadmapRegistry.bootstrapTargetCount } else { 0 }
  $roadmapGap = if ($roadmapTarget -gt 0) { [math]::Max(0, $roadmapTarget - $roadmapIssues) } else { 0 }

  $scanFindings = if ($null -ne $ScanReport -and $null -ne $ScanReport.summary -and $null -ne $ScanReport.summary.totalFindings) { [int]$ScanReport.summary.totalFindings } else { 0 }
  $scanTsErrors = if ($null -ne $ScanReport -and $null -ne $ScanReport.summary -and $null -ne $ScanReport.summary.tsErrors) { [int]$ScanReport.summary.tsErrors } else { 0 }
  $scanBuildOk = if ($null -ne $ScanReport -and $null -ne $ScanReport.summary -and $null -ne $ScanReport.summary.buildOk) { [bool]$ScanReport.summary.buildOk } else { $false }

  return [PSCustomObject]@{
    TotalTasks = $totalTasks
    CompletedTasks = $completedTasks
    PendingTasks = $pendingTasks
    RunningTasks = $runningTasks
    BlockedTasks = $blockedTasks
    SessionCount = $sessionCount
    OkSessions = $okSessions
    FailedSessions = $failedSessions
    SuccessRate = $successRate
    Last24hSessions = $last24hCount
    UniqueCompletedTasks = $uniqueCompletedCount
    Last24hUniqueCompletedTasks = $last24hUniqueCompleted
    RoadmapIssues = $roadmapIssues
    RoadmapWaves = $roadmapWaves
    RoadmapTarget = $roadmapTarget
    RoadmapGap = $roadmapGap
    ScanFindings = $scanFindings
    ScanTsErrors = $scanTsErrors
    ScanBuildOk = $scanBuildOk
  }
}

function Test-ProcessAlive {
  param([int]$ProcessId)
  try {
    $p = Get-Process -Id $ProcessId -ErrorAction Stop
    return ($null -ne $p)
  }
  catch { return $false }
}

function Get-AegisRuntimeProcesses {
  $patterns = @(
    "ten-task-loop\.ps1",
    "aegis-live\.ps1",
    "agent-loop\.ps1",
    "autopilot-unlimited\.ps1"
  )

  try {
    $procs = Get-CimInstance Win32_Process -ErrorAction Stop |
      Where-Object {
        $cmd = [string]$_.CommandLine
        if ([string]::IsNullOrWhiteSpace($cmd)) { return $false }
        foreach ($p in $patterns) {
          if ($cmd -match $p) { return $true }
        }
        return $false
      }
    return @($procs)
  }
  catch {
    return @()
  }
}

function Get-LastLogSignal {
  $candidates = @()
  if (Test-Path $liveLoopLog) {
    $candidates += (Get-Item $liveLoopLog)
  }

  $workerLogs = Get-ChildItem -Path $stateDir -Filter "worker*.log" -ErrorAction SilentlyContinue
  if ($null -ne $workerLogs) {
    $candidates += @($workerLogs)
  }

  if ($candidates.Count -eq 0) {
    return $null
  }

  $latest = $candidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  $tail = Get-Content -Path $latest.FullName -Tail 30 -ErrorAction SilentlyContinue
  if ($null -eq $tail) { return $null }

  $line = $null
  $tailArray = @($tail)
  for ($i = $tailArray.Count - 1; $i -ge 0; $i--) {
    $l = $tailArray[$i]
    if (-not [string]::IsNullOrWhiteSpace([string]$l)) {
      $line = [string]$l
      break
    }
  }

  if ([string]::IsNullOrWhiteSpace($line)) {
    return $null
  }

  return [PSCustomObject]@{
    file        = $latest.Name
    line        = $line.Trim()
    lastWriteAt = $latest.LastWriteTime
  }
}

function Resolve-ActivityState {
  param(
    [object]$Queue,
    [int]$RuntimeAliveCount = 0
  )

  $tasks = @()
  if ($null -ne $Queue -and $null -ne $Queue.tasks) {
    $tasks = @($Queue.tasks)
  }

  $running = @($tasks | Where-Object { $_.status -eq "running" -or $_.status -eq "evidence_pending" })
  if ($running.Count -gt 0) {
    $sample = $running | Select-Object -First 1
    return [PSCustomObject]@{
      activity = "IMPLEMENTING"
      detail   = "$($running.Count) active task(s), sample: $($sample.taskId) $($sample.title)"
      source   = "task-queue"
    }
  }

  $waitingAck = @($tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" })
  if ($waitingAck.Count -gt 0) {
    $sampleAck = $waitingAck | Select-Object -First 1
    return [PSCustomObject]@{
      activity = "WAITING_ACK"
      detail   = "$($waitingAck.Count) task(s) waiting for FEEDS_ACK, sample: $($sampleAck.taskId)"
      source   = "task-queue"
    }
  }

  $queued = @($tasks | Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" })
  $done = @($tasks | Where-Object { $_.status -eq "done" -or $_.status -eq "complete" })
  if ($RuntimeAliveCount -gt 0 -and $queued.Count -gt 0) {
    return [PSCustomObject]@{
      activity = "RECOVERY"
      detail   = "Runtime loop alive; $($queued.Count) queued task(s) awaiting scheduling/dispatch."
      source   = "runtime"
    }
  }
  if ($RuntimeAliveCount -gt 0 -and $queued.Count -eq 0 -and $done.Count -gt 0) {
    return [PSCustomObject]@{
      activity = "RECOVERY"
      detail   = "Runtime loop alive; queue between cycles (no queued tasks, $($done.Count) done task(s))."
      source   = "runtime"
    }
  }

  $signal = Get-LastLogSignal
  if ($null -ne $signal) {
    $text = $signal.line.ToLowerInvariant()
    if ($text -match "\[(plan|free-plan|context|plan-clean|reorganize)\]" -or $text -match "planning") {
      return [PSCustomObject]@{
        activity = "PLANNING"
        detail   = "Recent log signal from $($signal.file): $($signal.line)"
        source   = "logs"
      }
    }
    if ($text -match "\[(implement|build|test|typecheck|subagent)\]" -or $text -match "claimed|execution|implement") {
      return [PSCustomObject]@{
        activity = "IMPLEMENTING"
        detail   = "Recent log signal from $($signal.file): $($signal.line)"
        source   = "logs"
      }
    }
    if ($text -match "idle|no ready task") {
      return [PSCustomObject]@{
        activity = "IDLE"
        detail   = "Recent log signal from $($signal.file): $($signal.line)"
        source   = "logs"
      }
    }
  }

  $loopState = Read-JsonFile -Path $tenTaskStateFile
  if ($null -ne $loopState -and -not [string]::IsNullOrWhiteSpace([string]$loopState.lastSelectedTaskId)) {
    $lastId = [string]$loopState.lastSelectedTaskId
    if ($lastId.StartsWith("PLAN-")) {
      return [PSCustomObject]@{
        activity = "PLANNING"
        detail   = "Last selected task appears planning-oriented: $lastId"
        source   = "ten-task-loop"
      }
    }
  }

  return [PSCustomObject]@{
    activity = "IDLE"
    detail   = "No active queue runners or recent planning/implementation signal detected"
    source   = "fallback"
  }
}

function Get-PendingTasks {
  param(
    [object]$Queue,
    [object]$PriorityOrder
  )

  $sourceTasks = @()
  if ($null -ne $Queue -and $null -ne $Queue.tasks) {
    $sourceTasks = @($Queue.tasks | Where-Object { $_.status -notin @("done", "complete", "archived") })
  }

  if ($sourceTasks.Count -eq 0 -and $null -ne $PriorityOrder -and $null -ne $PriorityOrder.orderedTasks) {
    $sourceTasks = @($PriorityOrder.orderedTasks | Where-Object { $_.status -notin @("done", "complete", "archived") })
  }

  return @($sourceTasks | Sort-Object @{ Expression = { if ($_.computedScore) { [int]$_.computedScore } elseif ($_.priority_score) { [int]$_.priority_score } else { 0 } }; Descending = $true }, @{ Expression = { $_.createdAt }; Descending = $false })
}

function Write-Header {
  param([string]$Title, [ConsoleColor]$Color = "Cyan")
  $bar = "-" * 60
  Write-Host ""
  Write-Host $bar -ForegroundColor $Color
  Write-Host "  $Title" -ForegroundColor $Color
  Write-Host $bar -ForegroundColor $Color
}

function Show-Dashboard {
  Clear-Host
  $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $queue = Read-Queue
  $priorityOrder = Read-PriorityOrder
  $workers = Read-Workers
  $sessionEntries = Read-SessionLog
  $roadmapRegistry = Read-JsonFile -Path $roadmapRegistryFile
  $scanReport = Read-JsonFile -Path $scanReportFile
  $insights = Get-DevelopmentInsights -Queue $queue -SessionEntries $sessionEntries -RoadmapRegistry $roadmapRegistry -ScanReport $scanReport

  Write-Host ""
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "  WHITE CAVES ORCHESTRATION DASHBOARD    $now" -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor Cyan

  # ── 0. Aegis runtime status ───────────────────────────────────────────────
  Write-Header "AEGIS RUNTIME STATUS"
  $workerAliveCount = 0
  foreach ($w in $workers) {
    if (Test-ProcessAlive -ProcessId ([int]$w.Pid)) {
      $workerAliveCount++
    }
  }

  $runtimeProcs = Get-AegisRuntimeProcesses
  $runtimeAliveCount = @($runtimeProcs).Count
  $isLive = ($workerAliveCount -gt 0) -or ($runtimeAliveCount -gt 0)

  if ($isLive) {
    $liveColor = "Green"
    Write-Host "  [LIVE] Aegis is running" -ForegroundColor $liveColor
    Write-Host "  Worker processes alive : $workerAliveCount" -ForegroundColor $liveColor
    Write-Host "  Runtime loop processes : $runtimeAliveCount" -ForegroundColor $liveColor
  }
  else {
    $liveColor = "Red"
    Write-Host "  [STOPPED] Aegis is not running" -ForegroundColor $liveColor
    Write-Host "  Start command: npm run orchestrator:bg:start" -ForegroundColor Yellow
  }

  $activityState = Resolve-ActivityState -Queue $queue -RuntimeAliveCount $runtimeAliveCount
  $activityColor = switch ($activityState.activity) {
    "PLANNING"     { "Magenta" }
    "IMPLEMENTING" { "Cyan" }
    "WAITING_ACK"  { "Yellow" }
    "RECOVERY"     { "DarkCyan" }
    "IDLE"         { "DarkGray" }
    default         { "White" }
  }
  Write-Host "" 
  Write-Host ("  Current activity: " + $activityState.activity) -ForegroundColor $activityColor
  Write-Host ("  Signal         : " + $activityState.detail) -ForegroundColor DarkGray
  Write-Host ("  Source         : " + $activityState.source) -ForegroundColor DarkGray

  $recoveryState = Read-JsonFile -Path $recoveryStateFile
  $discoveryReport = Read-JsonFile -Path $discoveryReportFile
  $recoveryEvents = Get-RecoveryEvents
  $latestRecoveryEvent = if ($recoveryEvents.Count -gt 0) { $recoveryEvents | Select-Object -Last 1 } else { $null }
  $steeringState = Read-SteeringState
  if ($null -ne $recoveryState) {
    Write-Host ("  Recovery tries : " + [int]$recoveryState.totalRecoveryAttempts) -ForegroundColor DarkGray
    Write-Host ("  No-task streak : " + [int]$recoveryState.consecutiveNoTaskCount) -ForegroundColor DarkGray
    Write-Host ("  Next delay sec : " + [int]$recoveryState.currentDelaySec) -ForegroundColor DarkGray
  }
  if ($null -ne $latestRecoveryEvent) {
    Write-Host ("  Recovery stage : " + [string]$latestRecoveryEvent.stage) -ForegroundColor DarkGray
    Write-Host ("  Recovery outcome: " + [string]$latestRecoveryEvent.outcome) -ForegroundColor DarkGray
  }

  if ($null -ne $discoveryReport) {
    $discoveryTasks = if ($null -ne $discoveryReport.tasksGenerated) { @($discoveryReport.tasksGenerated).Count } else { 0 }
    $discoveryGateAlert = Test-Path $discoveryGateFailFile
    $discoveryGateFail = ($discoveryGateAlert -or ($discoveryReport.requireMinInject -eq $true -and $discoveryReport.requirementFailed -eq $true))
    $discoveryGate = if ($discoveryGateFail) { "FAIL" } else { "PASS" }
    $discoveryColor = if ($discoveryGateFail) { "Red" } else { "Green" }
    Write-Host ("  Discovery gate : " + $discoveryGate + " (generated=" + $discoveryTasks + ")") -ForegroundColor $discoveryColor
    Write-Host ("  Discovery alert: " + $(if ($discoveryGateAlert) { "ON" } else { "OFF" })) -ForegroundColor $discoveryColor
    if ($discoveryGateFail -and -not [string]::IsNullOrWhiteSpace([string]$discoveryReport.skipReason)) {
      Write-Host ("  Discovery note : " + [string]$discoveryReport.skipReason) -ForegroundColor DarkGray
    }
  }

  if ($null -ne $steeringState -and -not [string]::IsNullOrWhiteSpace([string]$steeringState.taskId)) {
    Write-Host ("  Steering focus : " + [string]$steeringState.taskId + " / " + [string]$steeringState.agent) -ForegroundColor DarkGray
    if (-not [string]::IsNullOrWhiteSpace([string]$steeringState.reason)) {
      Write-Host ("  Steering note  : " + [string]$steeringState.reason) -ForegroundColor DarkGray
    }
  }

  # ── 1. Project development insights ─────────────────────────────────────────
  Write-Header "PROJECT DEVELOPMENT INSIGHTS"
  Write-Host ("  Queue counters     : total=" + $insights.TotalTasks + "  completed=" + $insights.CompletedTasks + "  pending=" + $insights.PendingTasks + "  running=" + $insights.RunningTasks + "  blocked=" + $insights.BlockedTasks) -ForegroundColor White
  Write-Host ("  Session reliability: ok=" + [int]$insights.OkSessions + "  failed=" + [int]$insights.FailedSessions + "  successRate=" + [double]$insights.SuccessRate + "%") -ForegroundColor DarkCyan
  Write-Host ("  Throughput         : unique completed tasks=" + $insights.UniqueCompletedTasks + " (last24h=" + $insights.Last24hUniqueCompletedTasks + "), sessions last24h=" + $insights.Last24hSessions) -ForegroundColor DarkCyan
  $roadmapColor = if ($insights.RoadmapGap -eq 0) { "Green" } else { "Yellow" }
  Write-Host ("  GitHub roadmap     : issues=" + $insights.RoadmapIssues + "  waves=" + $insights.RoadmapWaves + "  target=" + $insights.RoadmapTarget + "  remainingToTarget=" + $insights.RoadmapGap) -ForegroundColor $roadmapColor
  $scanColor = if ($insights.ScanBuildOk -and $insights.ScanTsErrors -eq 0) { "Green" } else { "Yellow" }
  Write-Host ("  Code health        : findings=" + $insights.ScanFindings + "  tsErrors=" + $insights.ScanTsErrors + "  buildOk=" + $insights.ScanBuildOk) -ForegroundColor $scanColor

  # ── 1. Worker pool health ──────────────────────────────────────────────────
  Write-Header "WORKER POOL HEALTH"
  if ($workers.Count -eq 0) {
    Write-Host "  [OFFLINE] No workers registered. Run: npm run orchestrator:bg:start" -ForegroundColor Red
  }
  else {
    $aliveCount = 0
    foreach ($w in $workers) {
      $procId = [int]$w.Pid
      $alive  = Test-ProcessAlive -ProcessId $procId
      if ($alive) { $aliveCount++ }
      $statusStr = if ($alive) { "[ALIVE]" } else { "[DEAD] " }
      $color     = if ($alive) { "Green"  } else { "Red"    }
      $typeStr   = if ($w.Type) { $w.Type } else { "worker" }
      $labelStr  = if ($w.Lane) { "Lane=$($w.Lane)" }
                   elseif ($w.Agent) { $w.Agent }
                   elseif ($w.IntervalMinutes) { "watchdog every $($w.IntervalMinutes)m" }
                   else { "" }
      Write-Host ("  $statusStr  PID=$procId  type=$typeStr  $labelStr") -ForegroundColor $color
    }
    Write-Host ""
    $total = $workers.Count
    $deadCount = $total - $aliveCount
    $healthColor = if ($deadCount -eq 0) { "Green" } else { "Yellow" }
    Write-Host ("  Alive: $aliveCount / $total" + $(if ($deadCount -gt 0) { "  ($deadCount dead -- run: npm run orchestrator:bg:restart)" } else { "" })) -ForegroundColor $healthColor
  }

  # ── 2. Queue summary ──────────────────────────────────────────────────────
  Write-Header "QUEUE SUMMARY"
  if ($null -eq $queue) {
    Write-Host "  [NO QUEUE] Run: npm run orchestrator:queue:init" -ForegroundColor Red
    return
  }

  $tasks = @($queue.tasks)
  $statuses = $tasks | Group-Object status | Sort-Object Name
  foreach ($g in $statuses) {
    $color = switch ($g.Name) {
      "done"         { "Green"   }
      "running"      { "Cyan"    }
      "waiting_ack"  { "Yellow"  }
      "queued"       { "White"   }
      "retrying"     { "Magenta" }
      "failed"       { "Red"     }
      "escalated"    { "DarkYellow" }
      default        { "Gray"    }
    }
    Write-Host ("  " + $g.Name.PadRight(14) + " : " + $g.Count) -ForegroundColor $color
  }
  Write-Host ""
  $lanes = $tasks | Group-Object lane | Sort-Object Name
  Write-Host "  By Lane:" -ForegroundColor DarkCyan
  foreach ($l in $lanes) {
    $lTasks = @($l.Group)
    $done     = ($lTasks | Where-Object { $_.status -eq "done" }).Count
    $running  = ($lTasks | Where-Object { $_.status -eq "running" }).Count
    $queued   = ($lTasks | Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" }).Count
    $blocked  = ($lTasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" }).Count
    Write-Host ("    Lane " + $l.Name + " : done=$done running=$running queued=$queued blocked=$blocked") -ForegroundColor DarkCyan
  }

  # ── 3. Per-agent status table ──────────────────────────────────────────────
  Write-Header "PER-AGENT STATUS"
  $agents = $tasks | Group-Object agent | Sort-Object Name
  Write-Host ("  " + "Agent".PadRight(14) + "Lane  " + "Status".PadRight(14) + "Task") -ForegroundColor White
  Write-Host ("  " + ("-" * 70)) -ForegroundColor DarkGray
  foreach ($ag in $agents) {
    foreach ($t in $ag.Group) {
      $statusColor = switch ($t.status) {
        "done"         { "Green"   }
        "running"      { "Cyan"    }
        "waiting_ack"  { "Yellow"  }
        "queued"       { "Gray"    }
        "retrying"     { "Magenta" }
        "failed"       { "Red"     }
        "escalated"    { "Red"     }
        default        { "White"   }
      }
      $agStr  = ($t.agent).PadRight(14)
      $lnStr  = ($t.lane).PadRight(6)
      $stStr  = ($t.status).PadRight(14)
      $ttStr  = if ($t.title.Length -gt 38) { $t.title.Substring(0,35) + "..." } else { $t.title }
      Write-Host ("  " + $agStr + $lnStr + $stStr + $ttStr) -ForegroundColor $statusColor
    }
  }

  # ── 4. Waiting ACK ────────────────────────────────────────────────────────
  $waitingAck = $tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" }
  if (@($waitingAck).Count -gt 0) {
    Write-Header "PENDING FEEDS_ACK (action required)" "Yellow"
    foreach ($t in $waitingAck) {
      $ackColor = if ($t.status -eq "escalated") { "Red" } else { "Yellow" }
      Write-Host ("  [" + $t.status.ToUpper() + "] " + $t.taskId + " -- " + $t.title) -ForegroundColor $ackColor
      Write-Host ("    Downstream ACK from: " + $t.feedsAckBy) -ForegroundColor DarkYellow
      Write-Host ("    Run: npm run orchestrator:queue:ack -- -TaskId $($t.taskId) -AgentName $($t.feedsAckBy)") -ForegroundColor Gray
    }
  }

  # ── 5. Pending task steering ───────────────────────────────────────────────
  $pendingTasks = Get-PendingTasks -Queue $queue -PriorityOrder $priorityOrder
  if ($pendingTasks.Count -gt 0) {
    Write-Header "PENDING TASKS (top 10)" "Cyan"
    $topPending = @($pendingTasks | Select-Object -First 10)
    foreach ($t in $topPending) {
      $score = if ($null -ne $t.computedScore) { [int]$t.computedScore } elseif ($null -ne $t.priority_score) { [int]$t.priority_score } else { 0 }
      $taskId = if (-not [string]::IsNullOrWhiteSpace([string]$t.taskId)) { [string]$t.taskId } else { [string]$t.id }
      $title = if (-not [string]::IsNullOrWhiteSpace([string]$t.title)) { [string]$t.title } elseif (-not [string]::IsNullOrWhiteSpace([string]$t.objective)) { [string]$t.objective } else { "(untitled)" }
      $line = "  [" + $score.ToString().PadLeft(3) + "] " + $taskId.PadRight(6) + " " + ([string]$t.agent).PadRight(10) + " " + ([string]$t.status).PadRight(11) + " " + $title
      Write-Host $line -ForegroundColor White
    }
    Write-Host "" 
    Write-Host "  Steer next turn with: npm run orchestrator:steer -- <TaskId>" -ForegroundColor DarkGray
  }

  # ── 6. Always-on critical priority pins ─────────────────────────────────────
  if ($null -ne $priorityOrder -and $null -ne $priorityOrder.criticalPins -and @($priorityOrder.criticalPins).Count -gt 0) {
    Write-Header "ALWAYS-ON CRITICAL PRIORITIES" "Magenta"
    foreach ($pin in @($priorityOrder.criticalPins)) {
      $pinTitle = if (-not [string]::IsNullOrWhiteSpace([string]$pin.title)) { [string]$pin.title } else { [string]$pin.id }
      $pinBoost = if ($null -ne $pin.boost) { [int]$pin.boost } else { 0 }
      Write-Host ("  [PIN] " + [string]$pin.id + "  boost=" + $pinBoost + "  -- " + $pinTitle) -ForegroundColor Magenta
    }

    if ($null -ne $priorityOrder.nextTask -and $null -ne $priorityOrder.nextTask.criticalPinHits -and @($priorityOrder.nextTask.criticalPinHits).Count -gt 0) {
      Write-Host "" 
      Write-Host "  Top task matched critical pins:" -ForegroundColor DarkMagenta
      foreach ($hit in @($priorityOrder.nextTask.criticalPinHits)) {
        Write-Host ("    - " + [string]$hit.id + " (+" + [int]$hit.boost + ")") -ForegroundColor DarkMagenta
      }
    }
  }

  # ── 7. Recovery pipeline events ───────────────────────────────────────────
  if ($recoveryEvents.Count -gt 0) {
    Write-Header "RECOVERY PIPELINE EVENTS (last 5)" "DarkCyan"
    $recentRecoveryEvents = @($recoveryEvents | Select-Object -Last 5)
    foreach ($evt in $recentRecoveryEvents) {
      $evtStage = if ([string]::IsNullOrWhiteSpace([string]$evt.stage)) { "unknown" } else { [string]$evt.stage }
      $evtOutcome = if ([string]::IsNullOrWhiteSpace([string]$evt.outcome)) { "unknown" } else { [string]$evt.outcome }
      $evtColor = switch ($evtOutcome) {
        "success" { "Green" }
        "ok" { "Green" }
        "start" { "Cyan" }
        "no_task" { "DarkYellow" }
        default { "Gray" }
      }
      Write-Host ("  [" + [string]$evt.timestamp + "] " + $evtStage + " -> " + $evtOutcome) -ForegroundColor $evtColor
      if (-not [string]::IsNullOrWhiteSpace([string]$evt.detail)) {
        Write-Host ("    " + [string]$evt.detail) -ForegroundColor DarkGray
      }
    }
  }

  # ── 8. Watchdog last run ──────────────────────────────────────────────────
  if (Test-Path $wdLog) {
    $lastLines = Get-Content $wdLog -Tail 4
    Write-Header "WATCHDOG SCHEDULER (last 4 log lines)" "DarkGray"
    foreach ($l in $lastLines) {
      Write-Host "  $l" -ForegroundColor DarkGray
    }
  }

  # ── 9. Progress bar ───────────────────────────────────────────────────────
  Write-Header "OVERALL PROGRESS"
  $total     = $tasks.Count
  $doneCount = ($tasks | Where-Object { $_.status -eq "done" }).Count
  $pct       = if ($total -gt 0) { [math]::Round($doneCount / $total * 100) } else { 0 }
  $barWidth  = 40
  $filled    = [math]::Round($barWidth * $pct / 100)
  $empty     = $barWidth - $filled
  $bar       = "[" + ("#" * $filled) + ("." * $empty) + "]"
  $pctColor  = if ($pct -ge 80) { "Green" } elseif ($pct -ge 40) { "Yellow" } else { "Cyan" }
  Write-Host ("  $bar  $pct% ($doneCount / $total tasks done)") -ForegroundColor $pctColor

  Write-Host ""
  Write-Host "============================================================" -ForegroundColor DarkGray
  if ($Watch) {
    Write-Host "  [WATCH mode] Refreshing every ${RefreshSeconds}s  --  Ctrl+C to stop" -ForegroundColor DarkGray
  }
  else {
    Write-Host "  Tip: use -Watch flag for live refresh." -ForegroundColor DarkGray
  }
  Write-Host "============================================================" -ForegroundColor DarkGray
  Write-Host ""
}

if ($Watch) {
  while ($true) {
    Show-Dashboard
    Start-Sleep -Seconds $RefreshSeconds
  }
}
else {
  Show-Dashboard
}
