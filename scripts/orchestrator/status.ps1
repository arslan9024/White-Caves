param(
  [string]$WorkspaceRoot = "."
)

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$pidFile = Join-Path $stateDir "worker-processes.json"
$liveLoopLog = Join-Path $stateDir "live-loop-output.txt"
$tenTaskStateFile = Join-Path $stateDir "ten-task-loop.json"
$recoveryStateFile = Join-Path $stateDir "autopilot-recovery-state.json"
$recoveryEventsFile = Join-Path $stateDir "autopilot-recovery-events.json"
$steeringFile = Join-Path $stateDir "task-steering.json"
$discoveryReportFile = Join-Path $stateDir "discover-upgrade-report.json"
$discoveryGateFailFile = Join-Path $stateDir "DISCOVERY_GATE_FAIL.json"

function Read-JsonFile {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $raw = Get-Content -Path $Path -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  try { return $raw | ConvertFrom-Json } catch { return $null }
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

  if ($candidates.Count -eq 0) { return $null }

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

  if ([string]::IsNullOrWhiteSpace($line)) { return $null }

  return [PSCustomObject]@{
    file = $latest.Name
    line = $line.Trim()
  }
}

function Get-LatestRecoveryEvent {
  if (-not (Test-Path $recoveryEventsFile)) { return $null }
  try {
    $events = Get-Content -Path $recoveryEventsFile -Raw | ConvertFrom-Json
    if ($events -is [array]) {
      return ($events | Select-Object -Last 1)
    }
    return $events
  }
  catch {
    return $null
  }
}

function Get-SteeringState {
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

function Resolve-ActivityState {
  param(
    [array]$Tasks,
    [int]$RuntimeAliveCount = 0
  )

  $running = @($Tasks | Where-Object { $_.status -eq "running" -or $_.status -eq "evidence_pending" })
  if ($running.Count -gt 0) {
    $sample = $running | Select-Object -First 1
    return [PSCustomObject]@{
      activity = "IMPLEMENTING"
      detail   = "$($running.Count) active task(s), sample: $($sample.taskId)"
    }
  }

  $waitingAck = @($Tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" })
  if ($waitingAck.Count -gt 0) {
    $sampleAck = $waitingAck | Select-Object -First 1
    return [PSCustomObject]@{
      activity = "WAITING_ACK"
      detail   = "$($waitingAck.Count) task(s), sample: $($sampleAck.taskId)"
    }
  }

  $queued = @($Tasks | Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" })
  $done = @($Tasks | Where-Object { $_.status -eq "done" -or $_.status -eq "complete" })
  if ($RuntimeAliveCount -gt 0 -and $queued.Count -gt 0) {
    return [PSCustomObject]@{
      activity = "RECOVERY"
      detail   = "Runtime loop alive; $($queued.Count) queued task(s) awaiting scheduling/dispatch."
    }
  }
  if ($RuntimeAliveCount -gt 0 -and $queued.Count -eq 0 -and $done.Count -gt 0) {
    return [PSCustomObject]@{
      activity = "RECOVERY"
      detail   = "Runtime loop alive; queue between cycles (no queued tasks, $($done.Count) done task(s))."
    }
  }

  $signal = Get-LastLogSignal
  if ($null -ne $signal) {
    $text = $signal.line.ToLowerInvariant()
    if ($text -match "\[(plan|free-plan|context|plan-clean|reorganize)\]" -or $text -match "planning") {
      return [PSCustomObject]@{ activity = "PLANNING"; detail = "$($signal.file): $($signal.line)" }
    }
    if ($text -match "\[(implement|build|test|typecheck|subagent)\]" -or $text -match "claimed|execution|implement") {
      return [PSCustomObject]@{ activity = "IMPLEMENTING"; detail = "$($signal.file): $($signal.line)" }
    }
    if ($text -match "idle|no ready task") {
      return [PSCustomObject]@{ activity = "IDLE"; detail = "$($signal.file): $($signal.line)" }
    }
  }

  $loopState = Read-JsonFile -Path $tenTaskStateFile
  if ($null -ne $loopState -and -not [string]::IsNullOrWhiteSpace([string]$loopState.lastSelectedTaskId)) {
    $lastId = [string]$loopState.lastSelectedTaskId
    if ($lastId.StartsWith("PLAN-")) {
      return [PSCustomObject]@{ activity = "PLANNING"; detail = "Last selected task: $lastId" }
    }
  }

  return [PSCustomObject]@{ activity = "IDLE"; detail = "No planning/implementation signal detected" }
}

if (-not (Test-Path $queueFile)) {
  Write-Host "Queue file not found. Run init first: npm run orchestrator:queue:init" -ForegroundColor Yellow
  exit 0
}

$queue = Read-JsonFile -Path $queueFile
$tasks = @()
if ($null -ne $queue -and $null -ne $queue.tasks) {
  $tasks = @($queue.tasks)
}

$workers = Read-JsonFile -Path $pidFile
if ($null -eq $workers) { $workers = @() }
if ($workers -isnot [array]) { $workers = @($workers) }

$workerAliveCount = 0
foreach ($w in $workers) {
  if (Test-ProcessAlive -ProcessId ([int]$w.Pid)) { $workerAliveCount++ }
}
$runtimeAliveCount = @(Get-AegisRuntimeProcesses).Count
$isLive = ($workerAliveCount -gt 0) -or ($runtimeAliveCount -gt 0)

Write-Host "Aegis Runtime Status" -ForegroundColor Cyan
if ($isLive) {
  Write-Host "  [LIVE] Aegis is running" -ForegroundColor Green
} else {
  Write-Host "  [STOPPED] Aegis is not running" -ForegroundColor Red
}
Write-Host ("  Worker processes : {0}" -f $workerAliveCount) -ForegroundColor DarkGray
Write-Host ("  Runtime processes: {0}" -f $runtimeAliveCount) -ForegroundColor DarkGray
$recoveryState = Read-JsonFile -Path $recoveryStateFile
$steeringState = Get-SteeringState
$discoveryReport = Read-JsonFile -Path $discoveryReportFile
if ($null -ne $recoveryState) {
  Write-Host ("  Recovery attempts: {0}" -f ([int]$recoveryState.totalRecoveryAttempts)) -ForegroundColor DarkGray
  Write-Host ("  No-task streak   : {0}" -f ([int]$recoveryState.consecutiveNoTaskCount)) -ForegroundColor DarkGray
  Write-Host ("  Next delay (sec) : {0}" -f ([int]$recoveryState.currentDelaySec)) -ForegroundColor DarkGray
}
if ($null -ne $discoveryReport) {
  $generatedCount = if ($null -ne $discoveryReport.tasksGenerated) { @($discoveryReport.tasksGenerated).Count } else { 0 }
  $gateAlert = Test-Path $discoveryGateFailFile
  $gateStatus = if ($gateAlert -or ($discoveryReport.requireMinInject -eq $true -and $discoveryReport.requirementFailed -eq $true)) { "FAIL" } else { "PASS" }
  Write-Host ("  Discovery gate   : {0}" -f $gateStatus) -ForegroundColor DarkGray
  Write-Host ("  Discovery tasks  : {0}" -f $generatedCount) -ForegroundColor DarkGray
  Write-Host ("  Discovery alert  : {0}" -f $(if ($gateAlert) { "ON" } else { "OFF" })) -ForegroundColor DarkGray
  if ($gateStatus -eq "FAIL" -and -not [string]::IsNullOrWhiteSpace([string]$discoveryReport.skipReason)) {
    Write-Host ("  Discovery note   : {0}" -f [string]$discoveryReport.skipReason) -ForegroundColor DarkGray
  }
}
$latestRecoveryEvent = Get-LatestRecoveryEvent
if ($null -ne $latestRecoveryEvent) {
  Write-Host ("  Recovery stage   : {0}" -f [string]$latestRecoveryEvent.stage) -ForegroundColor DarkGray
  Write-Host ("  Recovery outcome : {0}" -f [string]$latestRecoveryEvent.outcome) -ForegroundColor DarkGray
  Write-Host ("  Recovery detail  : {0}" -f [string]$latestRecoveryEvent.detail) -ForegroundColor DarkGray
}
elseif ($null -ne $recoveryState -and (-not [string]::IsNullOrWhiteSpace([string]$recoveryState.lastRecoveryStage) -or -not [string]::IsNullOrWhiteSpace([string]$recoveryState.lastRecoveryOutcome))) {
  Write-Host ("  Recovery stage   : {0}" -f [string]$recoveryState.lastRecoveryStage) -ForegroundColor DarkGray
  Write-Host ("  Recovery outcome : {0}" -f [string]$recoveryState.lastRecoveryOutcome) -ForegroundColor DarkGray
  Write-Host ("  Recovery detail  : {0}" -f [string]$recoveryState.lastRecoveryDetail) -ForegroundColor DarkGray
}
if ($null -ne $steeringState -and -not [string]::IsNullOrWhiteSpace([string]$steeringState.taskId)) {
  $steeringLine = "  Steering focus   : " + [string]$steeringState.taskId
  if (-not [string]::IsNullOrWhiteSpace([string]$steeringState.agent)) {
    $steeringLine += " / " + [string]$steeringState.agent
  }
  Write-Host $steeringLine -ForegroundColor DarkGray
  if (-not [string]::IsNullOrWhiteSpace([string]$steeringState.reason)) {
    Write-Host ("  Steering note    : {0}" -f [string]$steeringState.reason) -ForegroundColor DarkGray
  }
}

$activity = Resolve-ActivityState -Tasks $tasks -RuntimeAliveCount $runtimeAliveCount
$activityColor = switch ($activity.activity) {
  "PLANNING"     { "Magenta" }
  "IMPLEMENTING" { "Cyan" }
  "WAITING_ACK"  { "Yellow" }
  "RECOVERY"     { "DarkCyan" }
  "IDLE"         { "DarkGray" }
  default         { "White" }
}
Write-Host ("  Current activity : {0}" -f $activity.activity) -ForegroundColor $activityColor
Write-Host ("  Signal           : {0}" -f $activity.detail) -ForegroundColor DarkGray

$summary = $tasks | Group-Object status | Sort-Object Name | ForEach-Object {
  [PSCustomObject]@{ Status = $_.Name; Count = $_.Count }
}

Write-Host "`nOrchestrator Queue Status" -ForegroundColor Cyan
$summary | Format-Table -AutoSize

$blocked = $tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "evidence_pending" }
if ($blocked.Count -gt 0) {
  Write-Host "`nWaiting ACK / Evidence Pending tasks:" -ForegroundColor Yellow
  $blocked | Select-Object taskId, status, agent, feedsAckBy, title | Format-Table -AutoSize
}
