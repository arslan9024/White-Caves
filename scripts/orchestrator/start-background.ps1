# Starts background worker pool for free-agent orchestration (Phase 4)
# Spawns: 4 lane workers (A/B/C/D), N legacy agent-locked workers, 1 watchdog scheduler
param(
  [int]$WorkerCount        = 4,   # legacy agent-locked workers
  [int]$PollSeconds        = 30,
  [int]$WatchdogIntervalMin = 5,  # watchdog + escalation cycle frequency
  [int]$StaleMinutes       = 10,
  [int]$AckStaleMinutes    = 20
)

$root     = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$stateDir = Join-Path $root "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$pidFile   = Join-Path $stateDir "worker-processes.json"
$queueFile = Join-Path $stateDir "task-queue.json"

if (-not (Test-Path $queueFile)) {
  $initScript = Join-Path $PSScriptRoot "init-queue.ps1"
  & $initScript -WorkspaceRoot $root | Out-Null
}

# Lane-root agents: first agent in each dependency chain per lane
$laneRootAgents = @{
  A = "@Sofia"
  B = "@Fei-Fei"
  C = "@Booking"
  D = "@Annie"
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

$processes | ConvertTo-Json -Depth 4 | Set-Content -Path $pidFile -Encoding UTF8

$laneCount   = 4
$legacyCount = $WorkerCount
$totalCount  = $processes.Count

Write-Host "Orchestration pool started: $laneCount lane-workers + $legacyCount legacy-workers + 1 watchdog-scheduler = $totalCount processes." -ForegroundColor Green
Write-Host "State file : $pidFile"
Write-Host "Watchdog   : every ${WatchdogIntervalMin}m (stale=${StaleMinutes}m, ack-stale=${AckStaleMinutes}m)"
Write-Host "Stop all   : npm run orchestrator:bg:stop"
