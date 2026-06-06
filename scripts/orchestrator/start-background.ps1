# Starts background worker pool for free-agent orchestration (Phase 4)
# Spawns: 4 lane workers (A/B/C/D), N legacy agent-locked workers, 1 watchdog scheduler
param(
  [int]$WorkerCount        = 0,   # legacy agent-locked workers (set > 0 only when explicitly needed)
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
$policyUtilsPath = Join-Path $PSScriptRoot "policy-utils.ps1"

function GetProjectGitHubToken() {
  $envFiles = @(
    (Join-Path $root ".env.local"),
    (Join-Path $root ".env")
  )

  foreach ($envFile in $envFiles) {
    if (-not (Test-Path $envFile)) {
      continue
    }

    try {
      $match = Get-Content $envFile | Where-Object { $_ -match '^\s*GITHUB_TOKEN\s*=' } | Select-Object -First 1
      if ($null -eq $match) {
        continue
      }

      $value = ($match -replace '^\s*GITHUB_TOKEN\s*=\s*', '').Trim()
      if ($value) {
        return $value.Trim('"').Trim("'")
      }
    }
    catch {
      continue
    }
  }

  return ""
}

function EnsureGitHubLoginBeforeAegis() {
  $token = ([string]$env:GITHUB_TOKEN).Trim()
  if (-not $token) {
    $token = ([string](GetProjectGitHubToken)).Trim()
  }
  if ($token -and $token -notmatch 'newtokenhere|your-token|changeme|example|placeholder') {
    Write-Host "GitHub PAT detected in project env; background Aegis may start without gh auth." -ForegroundColor Green
    return $true
  }

  $ghCommand = Get-Command gh -ErrorAction SilentlyContinue

  if ($null -eq $ghCommand) {
    Write-Host "GitHub CLI (gh) is not installed or not on PATH." -ForegroundColor Yellow
    Write-Host "Install GitHub CLI, run `gh auth login`, then start Aegis again." -ForegroundColor Yellow
    return $false
  }

  & gh auth status 2>&1 | Out-Host
  if ($LASTEXITCODE -eq 0) {
    Write-Host "GitHub CLI auth is ready." -ForegroundColor Green
    return $true
  }

  Write-Host "GitHub login is required before background Aegis workers start." -ForegroundColor Yellow
  $choice = Read-Host "Log in now with GitHub CLI? (y/N)"

  if ($choice -match '^(y|yes)$') {
    & gh auth login
    if ($LASTEXITCODE -ne 0) {
      Write-Host "GitHub login did not complete successfully." -ForegroundColor Red
      return $false
    }

    & gh auth status 2>&1 | Out-Host
    if ($LASTEXITCODE -eq 0) {
      Write-Host "GitHub CLI auth is ready." -ForegroundColor Green
      return $true
    }

    Write-Host "GitHub CLI login check still failed after login attempt." -ForegroundColor Red
    return $false
  }

  Write-Host "Aegis background start cancelled until GitHub login is completed." -ForegroundColor Yellow
  return $false
}

if (-not (Test-Path $policyUtilsPath)) {
  throw "Missing required policy utility script: $policyUtilsPath"
}

if (-not (EnsureGitHubLoginBeforeAegis)) {
  exit 1
}

. $policyUtilsPath

$policy = Get-OrchestratorPolicy -WorkspaceRoot $root

if (-not (Test-Path $queueFile)) {
  $initScript = Join-Path $PSScriptRoot "init-queue.ps1"
  & $initScript -WorkspaceRoot $root | Out-Null
}

if (-not [bool]$policy.modelRouting.freeModelOnlyMode) {
  Write-Warning "Background orchestration is running with freeModelOnlyMode=false. Workers will be restricted to freePlanningAgents list only. Set freeModelOnlyMode=true in policy.json to suppress this warning."
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

$processes | ConvertTo-Json -Depth 4 | Set-Content -Path $pidFile -Encoding UTF8

$laneCount   = 4
$legacyCount = $WorkerCount
$totalCount  = $processes.Count

Write-Host "Orchestration pool started: $laneCount lane-workers + $legacyCount legacy-workers + 1 watchdog-scheduler = $totalCount processes." -ForegroundColor Green
Write-Host "Policy     : freeModelOnlyMode=$($policy.modelRouting.freeModelOnlyMode) | free agents=$(@($policy.modelRouting.freePlanningAgents).Count)" -ForegroundColor Cyan
Write-Host "State file : $pidFile"
Write-Host "Watchdog   : every ${WatchdogIntervalMin}m (stale=${StaleMinutes}m, ack-stale=${AckStaleMinutes}m)"
Write-Host "Stop all   : npm run orchestrator:bg:stop"
