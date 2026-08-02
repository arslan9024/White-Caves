param(
  [string]$WorkspaceRoot = ".",
  [double]$ImprovementPoints = 10,
  [int]$PollSeconds = 15,
  [switch]$NoClear,
  [switch]$RebaselineOnCycleChange,
  [string]$DevCommand = "npm run dev"
)

if (-not $NoClear) {
  Clear-Host
}

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"

function Read-QueueShared {
  param([string]$Path)

  if (-not (Test-Path $Path)) { return $null }

  for ($attempt = 1; $attempt -le 5; $attempt++) {
    try {
      $fs = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
      try {
        $sr = New-Object System.IO.StreamReader($fs)
        try {
          $raw = $sr.ReadToEnd()
        }
        finally {
          $sr.Dispose()
        }
      }
      finally {
        $fs.Dispose()
      }

      if ([string]::IsNullOrWhiteSpace($raw)) { continue }
      return ($raw | ConvertFrom-Json)
    }
    catch {
      continue
    }
  }

  return $null
}

function Get-ProgressSnapshot {
  param([string]$Path)

  $queue = Read-QueueShared -Path $Path
  if ($null -eq $queue) { return $null }

  $tasks = @($queue.tasks)
  $total = $tasks.Count
  $done = @($tasks | Where-Object { $_.status -eq "done" }).Count
  $running = @($tasks | Where-Object { $_.status -eq "running" }).Count
  $pendingStatuses = @("queued","running","evidence_pending","waiting_ack","retrying","failed","escalated")
  $pending = @($tasks | Where-Object { $pendingStatuses -contains $_.status }).Count
  $pct = if ($total -gt 0) { [math]::Round((100.0 * $done / $total), 1) } else { 0 }

  return [PSCustomObject]@{
    Cycle = if ([string]::IsNullOrWhiteSpace([string]$queue.cycle)) { "N/A" } else { [string]$queue.cycle }
    Total = $total
    Done = $done
    Pending = $pending
    Running = $running
    Percent = $pct
    Timestamp = Get-Date
  }
}

if (-not (Test-Path $queueFile)) {
  Write-Host "Queue file not found: $queueFile" -ForegroundColor Yellow
  Write-Host "Start Aegis first, then rerun this watcher." -ForegroundColor Yellow
  exit 1
}

$baseline = Get-ProgressSnapshot -Path $queueFile
if ($null -eq $baseline) {
  Write-Host "Unable to read current Aegis progress from $queueFile" -ForegroundColor Yellow
  exit 1
}

$target = [math]::Min(100, [math]::Round(($baseline.Percent + $ImprovementPoints), 1))

Write-Host "Watching Aegis progress and will launch dev when threshold is reached..." -ForegroundColor Cyan
Write-Host ("  Baseline cycle : {0}" -f $baseline.Cycle) -ForegroundColor Cyan
Write-Host ("  Baseline       : {0}/{1} done ({2}%)" -f $baseline.Done, $baseline.Total, $baseline.Percent) -ForegroundColor Cyan
Write-Host ("  Target         : +{0} points -> {1}%" -f $ImprovementPoints, $target) -ForegroundColor Cyan
Write-Host ("  Poll interval  : {0}s" -f $PollSeconds) -ForegroundColor DarkGray
Write-Host ("  Dev command    : {0}" -f $DevCommand) -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to cancel." -ForegroundColor DarkGray
Write-Host "" 

while ($true) {
  Start-Sleep -Seconds $PollSeconds

  $snapshot = Get-ProgressSnapshot -Path $queueFile
  if ($null -eq $snapshot) {
    Write-Host ("[{0}] Waiting for readable queue snapshot..." -f (Get-Date -Format "HH:mm:ss")) -ForegroundColor DarkYellow
    continue
  }

  if ($RebaselineOnCycleChange -and $snapshot.Cycle -ne $baseline.Cycle) {
    $baseline = $snapshot
    $target = [math]::Min(100, [math]::Round(($baseline.Percent + $ImprovementPoints), 1))
    Write-Host ("[{0}] Cycle changed to {1}; rebasing watcher at {2}% (new target {3}%)." -f (Get-Date -Format "HH:mm:ss"), $snapshot.Cycle, $baseline.Percent, $target) -ForegroundColor Magenta
    continue
  }

  $delta = [math]::Round(($snapshot.Percent - $baseline.Percent), 1)
  Write-Host ("[{0}] Cycle={1} Progress={2}/{3} ({4}%) Delta=+{5} Pending={6} Running={7}" -f (Get-Date -Format "HH:mm:ss"), $snapshot.Cycle, $snapshot.Done, $snapshot.Total, $snapshot.Percent, $delta, $snapshot.Pending, $snapshot.Running) -ForegroundColor Blue

  if ($snapshot.Percent -ge $target) {
    Write-Host "" 
    Write-Host ("Threshold reached: {0}% -> {1}% (delta +{2}). Launching dev server..." -f $baseline.Percent, $snapshot.Percent, $delta) -ForegroundColor Green

    $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
    if ($null -eq $npmCmd) {
      Write-Host "npm is not available in this terminal session, so dev could not be started automatically." -ForegroundColor Red
      exit 1
    }

    Invoke-Expression $DevCommand
    break
  }
}
