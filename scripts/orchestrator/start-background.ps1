# Starts background worker pool for free-agent orchestration (Phase 4)
# Spawns: 4 lane workers (A/B/C/D), N legacy agent-locked workers, 1 watchdog scheduler
param(
  [int]$WorkerCount        = 0,   # legacy agent-locked workers (set > 0 only when explicitly needed)
  [int]$PollSeconds        = 30,
  [int]$WatchdogIntervalMin = 5,  # watchdog + escalation cycle frequency
  [int]$StaleMinutes       = 10,
  [int]$AckStaleMinutes    = 20,
  [switch]$StartAutopilotDaemon = $true,
  [int]$AutopilotRestartDelaySeconds = 5
)

$root     = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$pidFile   = Join-Path $stateDir "worker-processes.json"
$queueFile = Join-Path $stateDir "task-queue.json"
$policyUtilsPath = Join-Path $PSScriptRoot "policy-utils.ps1"

if (-not (Test-Path $policyUtilsPath)) {
  throw "Missing required policy utility script: $policyUtilsPath"
}

. $policyUtilsPath

$policy = Get-OrchestratorPolicy -WorkspaceRoot $root

if (-not (Test-Path $queueFile)) {
  $initScript = Join-Path $PSScriptRoot "init-queue.ps1"
  & $initScript -WorkspaceRoot $root | Out-Null
}

if (-not [bool]$policy.modelRouting.freeModelOnlyMode) {
  throw "Background orchestration requires freeModelOnlyMode=true in scripts/orchestrator/policy.json"
}

# Lane-root agents: first agent in each dependency chain per lane
$laneRootAgents = @{
  A = "@Sofia"
  B = "@Fei-Fei"
  C = "@Booking"
  D = "@Jaime"
}

# Legacy agent-locked workers (covers overflow agents beyond the 4 lanes)
$legacyAgents = @(
  "@Victoria", "@Timnit", "@Jaime",
  "@Marissa", "@Rachel", "@Joelle",
  "@Anima", "@Mary", "@Invoice", "@Maya", "@Hedy", "@Cassie", "@Corinne"
)

$processes = @()

# 1. Spawn one lane-aware worker per lane (A/B/C/D)
$laneWorkerScript = Join-Path $PSScriptRoot "worker-lane.ps1"
foreach ($lane in @("A","B","C","D")) {
  $preferAgent = $laneRootAgents[$lane]
  $proc = Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoProfile", "-ExecutionPolicy", "Bypass",
    "-File", "`"$laneWorkerScript`"",
    "-Lane", $lane,
    "-PreferAgent", "`"$preferAgent`"",
    "-PollSeconds", "$PollSeconds",
    "-WorkspaceRoot", "`"$root`""
  ) -WindowStyle Hidden -PassThru

  $processes += [PSCustomObject]@{
    Type        = "lane-worker"
    Lane        = $lane
    PreferAgent = $preferAgent
    Pid         = $proc.Id
    StartedAt   = (Get-Date).ToString("o")
  }
}

# 2. Spawn legacy agent-locked workers (covers remaining agents)
$legacyWorkerScript = Join-Path $PSScriptRoot "worker.ps1"
for ($i = 0; $i -lt $WorkerCount; $i++) {
  $agent = $legacyAgents[$i % $legacyAgents.Count]
  $proc  = Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoProfile", "-ExecutionPolicy", "Bypass",
    "-File", "`"$legacyWorkerScript`"",
    "-AgentName", "`"$agent`"",
    "-PollSeconds", "$PollSeconds",
    "-WorkspaceRoot", "`"$root`""
  ) -WindowStyle Hidden -PassThru

  $processes += [PSCustomObject]@{
    Type        = "legacy-worker"
    WorkerIndex = $i
    Agent       = $agent
    Pid         = $proc.Id
    StartedAt   = (Get-Date).ToString("o")
  }
}

# 3. Spawn watchdog scheduler (runs watchdog + escalation every WatchdogIntervalMin minutes)
$watchdogSchedulerScript = Join-Path $PSScriptRoot "watchdog-scheduler.ps1"
$wdProc = Start-Process -FilePath "powershell" -ArgumentList @(
  "-NoProfile", "-ExecutionPolicy", "Bypass",
  "-File", "`"$watchdogSchedulerScript`"",
  "-WorkspaceRoot", "`"$root`"",
  "-IntervalMinutes", "$WatchdogIntervalMin",
  "-StaleMinutes", "$StaleMinutes",
  "-AckStaleMinutes", "$AckStaleMinutes"
) -WindowStyle Hidden -PassThru

$processes += [PSCustomObject]@{
  Type             = "watchdog-scheduler"
  IntervalMinutes  = $WatchdogIntervalMin
  Pid              = $wdProc.Id
  StartedAt        = (Get-Date).ToString("o")
}

# 4. Spawn autopilot supervisor daemon (self-restarting continuous loop)
if ($StartAutopilotDaemon) {
  $autopilotDaemonScript = Join-Path $PSScriptRoot "autopilot-daemon.ps1"
  $apProc = Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoProfile", "-ExecutionPolicy", "Bypass",
    "-File", "`"$autopilotDaemonScript`"",
    "-WorkspaceRoot", "`"$root`"",
    "-RestartDelaySeconds", "$AutopilotRestartDelaySeconds",
    "-NoBrowser"
  ) -WindowStyle Hidden -PassThru

  $processes += [PSCustomObject]@{
    Type                = "autopilot-daemon"
    RestartDelaySeconds = $AutopilotRestartDelaySeconds
    Pid                 = $apProc.Id
    StartedAt           = (Get-Date).ToString("o")
  }
}

$processes | ConvertTo-Json -Depth 4 | Set-Content -Path $pidFile -Encoding UTF8

$laneCount   = 4
$legacyCount = $WorkerCount
$daemonCount = if ($StartAutopilotDaemon) { 1 } else { 0 }
$totalCount  = $processes.Count

Write-Host "Orchestration pool started: $laneCount lane-workers + $legacyCount legacy-workers + 1 watchdog-scheduler + $daemonCount autopilot-daemon = $totalCount processes." -ForegroundColor Green
Write-Host "Policy     : freeModelOnlyMode=$($policy.modelRouting.freeModelOnlyMode) | free agents=$(@($policy.modelRouting.freePlanningAgents).Count)" -ForegroundColor Cyan
Write-Host "State file : $pidFile"
Write-Host "Watchdog   : every ${WatchdogIntervalMin}m (stale=${StaleMinutes}m, ack-stale=${AckStaleMinutes}m)"
if ($StartAutopilotDaemon) {
  Write-Host "Autopilot  : supervised (restart delay ${AutopilotRestartDelaySeconds}s)" -ForegroundColor Cyan
}
Write-Host "Stop all   : npm run orchestrator:bg:stop"
