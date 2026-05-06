# reset-failed.ps1 — bulk reset failed/retrying tasks back to queued
# Optionally filter by agent or lane.
param(
  [string]$WorkspaceRoot = ".",
  [string]$AgentFilter   = "",   # e.g. "@Sofia" -- leave blank for all
  [string]$LaneFilter    = "",   # e.g. "A"       -- leave blank for all
  [switch]$DryRun
)

$stateDir  = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$mutex     = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")

function Get-Queue {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $raw = Get-Content -Path $Path -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  return $raw | ConvertFrom-Json
}

function Save-Queue {
  param($Queue, [string]$Path)
  $Queue | ConvertTo-Json -Depth 12 | Set-Content -Path $Path -Encoding UTF8
}

$resetList = @()

try {
  $null = $mutex.WaitOne()

  $queue = Get-Queue -Path $queueFile
  if ($null -eq $queue) {
    Write-Host "[ERROR] Queue file not found: $queueFile" -ForegroundColor Red
    exit 1
  }

  $tasks = @($queue.tasks)

  foreach ($task in $tasks) {
    if ($task.status -ne "failed" -and $task.status -ne "retrying" -and $task.status -ne "escalated") {
      continue
    }
    if ($AgentFilter -ne "" -and $task.agent -ne $AgentFilter) { continue }
    if ($LaneFilter  -ne "" -and $task.lane  -ne $LaneFilter)  { continue }

    $resetList += [PSCustomObject]@{
      taskId = $task.taskId
      title  = $task.title
      agent  = $task.agent
      lane   = $task.lane
      was    = $task.status
    }

    if (-not $DryRun) {
      $task.status     = "queued"
      $task.attempts   = 0
      $task.startedAt  = $null
      $task.finishedAt = $null
      if ($task.PSObject.Properties["escalatedAt"]) { $task.escalatedAt = $null }
    }
  }

  if (-not $DryRun -and $resetList.Count -gt 0) {
    Save-Queue -Queue $queue -Path $queueFile
  }
}
finally {
  $mutex.ReleaseMutex()
}

if ($resetList.Count -eq 0) {
  Write-Host "No failed/retrying/escalated tasks found matching your filters." -ForegroundColor Cyan
  exit 0
}

$dryLabel = if ($DryRun) { " [DRY RUN]" } else { "" }
Write-Host "$($resetList.Count) task(s) reset to queued$dryLabel :" -ForegroundColor Green
foreach ($r in $resetList) {
  Write-Host ("  " + $r.taskId + " (" + $r.was + ") -- " + $r.title + " [" + $r.agent + " / Lane " + $r.lane + "]") -ForegroundColor White
}

if ($DryRun) {
  Write-Host ""
  Write-Host "Re-run without -DryRun to apply changes." -ForegroundColor Yellow
}
