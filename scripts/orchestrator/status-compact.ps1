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
  if ($running.Count -gt 0) { return "IMPLEMENTING" }

  $waitingAck = @($Tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" })
  if ($waitingAck.Count -gt 0) { return "WAITING_ACK" }

  $queued = @($Tasks | Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" })
  $done = @($Tasks | Where-Object { $_.status -eq "done" -or $_.status -eq "complete" })
  if ($RuntimeAliveCount -gt 0 -and $queued.Count -gt 0) {
    return "RECOVERY"
  }
  if ($RuntimeAliveCount -gt 0 -and $queued.Count -eq 0 -and $done.Count -gt 0) {
    return "RECOVERY"
  }

  $signal = Get-LastLogSignal
  if ($null -ne $signal) {
    $text = $signal.line.ToLowerInvariant()
    if ($text -match "\[(plan|free-plan|context|plan-clean|reorganize)\]" -or $text -match "planning") { return "PLANNING" }
    if ($text -match "\[(implement|build|test|typecheck|subagent)\]" -or $text -match "claimed|execution|implement") { return "IMPLEMENTING" }
    if ($text -match "idle|no ready task") { return "IDLE" }
  }

  $loopState = Read-JsonFile -Path $tenTaskStateFile
  if ($null -ne $loopState -and -not [string]::IsNullOrWhiteSpace([string]$loopState.lastSelectedTaskId)) {
    $lastId = [string]$loopState.lastSelectedTaskId
    if ($lastId.StartsWith("PLAN-")) { return "PLANNING" }
  }

  return "IDLE"
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
$liveStatus = if ($isLive) { "LIVE" } else { "STOPPED" }

$activity = Resolve-ActivityState -Tasks $tasks -RuntimeAliveCount $runtimeAliveCount

$queued = @($tasks | Where-Object { $_.status -eq "queued" }).Count
$running = @($tasks | Where-Object { $_.status -eq "running" -or $_.status -eq "evidence_pending" }).Count
$done = @($tasks | Where-Object { $_.status -eq "done" }).Count
$waitingAck = @($tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" }).Count
$recoveryState = Read-JsonFile -Path $recoveryStateFile
$discoveryReport = Read-JsonFile -Path $discoveryReportFile
$recoveryAttempts = if ($null -ne $recoveryState) { [int]$recoveryState.totalRecoveryAttempts } else { 0 }
$noTaskStreak = if ($null -ne $recoveryState) { [int]$recoveryState.consecutiveNoTaskCount } else { 0 }
$latestRecoveryEvent = Get-LatestRecoveryEvent
$steeringState = Get-SteeringState
$recoveryStage = if ($null -ne $latestRecoveryEvent -and -not [string]::IsNullOrWhiteSpace([string]$latestRecoveryEvent.stage)) {
  [string]$latestRecoveryEvent.stage
}
elseif ($null -ne $recoveryState -and -not [string]::IsNullOrWhiteSpace([string]$recoveryState.lastRecoveryStage)) {
  [string]$recoveryState.lastRecoveryStage
}
else {
  "none"
}
$steeringTask = if ($null -ne $steeringState -and -not [string]::IsNullOrWhiteSpace([string]$steeringState.taskId)) { [string]$steeringState.taskId } else { "none" }
$steeringAgent = if ($null -ne $steeringState -and -not [string]::IsNullOrWhiteSpace([string]$steeringState.agent)) { [string]$steeringState.agent } else { "" }
$discoverAlert = Test-Path $discoveryGateFailFile
$discoverGate = if ($discoverAlert -or ($null -ne $discoveryReport -and $discoveryReport.requireMinInject -eq $true -and $discoveryReport.requirementFailed -eq $true)) { "FAIL" } else { "PASS" }
$discoverGenerated = if ($null -ne $discoveryReport -and $null -ne $discoveryReport.tasksGenerated) { @($discoveryReport.tasksGenerated).Count } else { 0 }
$recoveryOutcome = if ($null -ne $latestRecoveryEvent -and -not [string]::IsNullOrWhiteSpace([string]$latestRecoveryEvent.outcome)) {
  [string]$latestRecoveryEvent.outcome
}
elseif ($null -ne $recoveryState -and -not [string]::IsNullOrWhiteSpace([string]$recoveryState.lastRecoveryOutcome)) {
  [string]$recoveryState.lastRecoveryOutcome
}
else {
  "none"
}

Write-Output ("AEGIS={0} ACTIVITY={1} WORKERS={2} RUNTIME={3} QUEUED={4} RUNNING={5} WAITING_ACK={6} DONE={7} RECOV_ATTEMPTS={8} NO_TASK_STREAK={9} RECOV_STAGE={10} RECOV_OUTCOME={11} STEER={12}{13} DISCOVERY_GATE={14} DISCOVERY_TASKS={15} DISCOVERY_ALERT={16}" -f `
  $liveStatus, $activity, $workerAliveCount, $runtimeAliveCount, $queued, $running, $waitingAck, $done, $recoveryAttempts, $noTaskStreak, $recoveryStage, $recoveryOutcome, $steeringTask, $(if ([string]::IsNullOrWhiteSpace($steeringAgent)) { "" } else { "/$steeringAgent" }), $discoverGate, $discoverGenerated, $(if ($discoverAlert) { "ON" } else { "OFF" }))
