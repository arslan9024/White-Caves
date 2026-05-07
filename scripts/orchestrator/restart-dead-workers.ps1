# restart-dead-workers.ps1 -- reads PID file, checks each process, respawns dead ones
param(
  [string]$WorkspaceRoot    = ".",
  [int]$PollSeconds         = 30,
  [int]$WatchdogIntervalMin = 5,
  [int]$StaleMinutes        = 10,
  [int]$AckStaleMinutes     = 20
)

$stateDir  = Join-Path $WorkspaceRoot "logs\orchestrator"
$pidFile   = Join-Path $stateDir "worker-processes.json"
$queueFile = Join-Path $stateDir "task-queue.json"

if (-not (Test-Path $pidFile)) {
  Write-Host "[SKIP] No worker-processes.json found. Start workers first with: npm run orchestrator:bg:start" -ForegroundColor Yellow
  exit 0
}

$raw = Get-Content $pidFile -Raw
if ([string]::IsNullOrWhiteSpace($raw)) {
  Write-Host "[SKIP] worker-processes.json is empty." -ForegroundColor Yellow
  exit 0
}
$registeredWorkers = $raw | ConvertFrom-Json
if ($registeredWorkers -isnot [array]) { $registeredWorkers = @($registeredWorkers) }

$laneWorkerScript     = Join-Path $PSScriptRoot "worker-lane.ps1"
$legacyWorkerScript   = Join-Path $PSScriptRoot "worker.ps1"
$watchdogSchScript    = Join-Path $PSScriptRoot "watchdog-scheduler.ps1"

$updated   = @()
$restarted = 0
$alive     = 0

foreach ($w in $registeredWorkers) {
  $procId = [int]$w.Pid
  try {
    $proc = Get-Process -Id $procId -ErrorAction Stop
    if ($null -ne $proc) {
      $updated += $w
      $alive++
      continue
    }
  }
  catch { }

  # Process is dead -- respawn based on type
  $type = if ($w.Type) { $w.Type } else { "legacy-worker" }
  $newProc = $null

  switch ($type) {
    "lane-worker" {
      $lane        = $w.Lane
      $preferAgent = if ($w.PreferAgent) { $w.PreferAgent } else { "" }
      $newProc = Start-Process -FilePath "powershell" -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass",
        "-File", "`"$laneWorkerScript`"",
        "-Lane", $lane,
        "-PreferAgent", "`"$preferAgent`"",
        "-PollSeconds", "$PollSeconds",
        "-WorkspaceRoot", "`"$WorkspaceRoot`""
      ) -WindowStyle Hidden -PassThru
      Write-Host "[RESTART] Lane worker $lane (was PID $procId) -> new PID $($newProc.Id)" -ForegroundColor Yellow
    }
    "watchdog-scheduler" {
      $newProc = Start-Process -FilePath "powershell" -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass",
        "-File", "`"$watchdogSchScript`"",
        "-WorkspaceRoot", "`"$WorkspaceRoot`"",
        "-IntervalMinutes", "$WatchdogIntervalMin",
        "-StaleMinutes", "$StaleMinutes",
        "-AckStaleMinutes", "$AckStaleMinutes"
      ) -WindowStyle Hidden -PassThru
      Write-Host "[RESTART] Watchdog scheduler (was PID $procId) -> new PID $($newProc.Id)" -ForegroundColor Yellow
    }
    default {
      # legacy-worker
      $agentName = if ($w.Agent) { $w.Agent } else { "@Sofia" }
      $newProc = Start-Process -FilePath "powershell" -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass",
        "-File", "`"$legacyWorkerScript`"",
        "-AgentName", "`"$agentName`"",
        "-PollSeconds", "$PollSeconds",
        "-WorkspaceRoot", "`"$WorkspaceRoot`""
      ) -WindowStyle Hidden -PassThru
      Write-Host "[RESTART] Legacy worker $agentName (was PID $procId) -> new PID $($newProc.Id)" -ForegroundColor Yellow
    }
  }

  if ($null -ne $newProc) {
    # Clone entry with new PID and timestamp
    $clone = $w | ConvertTo-Json -Depth 4 | ConvertFrom-Json
    $clone | Add-Member -NotePropertyName "Pid"           -NotePropertyValue $newProc.Id   -Force
    $clone | Add-Member -NotePropertyName "RestartedAt"   -NotePropertyValue (Get-Date).ToString("o") -Force
    $clone | Add-Member -NotePropertyName "PreviousPid"   -NotePropertyValue $procId       -Force
    $updated += $clone
    $restarted++
  }
}

# Save updated PID file
$updated | ConvertTo-Json -Depth 4 | Set-Content -Path $pidFile -Encoding UTF8

Write-Host ""
Write-Host "Worker health check complete: $alive alive, $restarted restarted." -ForegroundColor Cyan
if ($restarted -gt 0) {
  Write-Host "Run 'npm run orchestrator:dashboard' to verify all workers are green." -ForegroundColor Green
}
