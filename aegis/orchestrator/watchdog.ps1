param(
  [string]$WorkspaceRoot = ".",
  [int]$StaleMinutes = 10,
  [int]$MaxAttempts = 3
)

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$mutex = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")

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

$summary = [PSCustomObject]@{
  staleDetected = 0
  movedToRetrying = 0
  movedToFailed = 0
  staleMinutes = $StaleMinutes
  maxAttempts = $MaxAttempts
}

try {
  $null = $mutex.WaitOne()

  $queue = Get-Queue -Path $queueFile
  if ($null -eq $queue) {
    Write-Output (@{ ok = $false; reason = "queue_missing" } | ConvertTo-Json -Depth 4)
    exit 0
  }

  $now = Get-Date
  $tasks = @($queue.tasks)
  foreach ($task in $tasks) {
    if ($task.status -ne "running") { continue }
    if ($null -eq $task.startedAt) { continue }

    $started = Get-Date $task.startedAt
    $elapsed = ($now - $started).TotalMinutes

    if ($elapsed -lt $StaleMinutes) { continue }

    $summary.staleDetected++

    if ([int]$task.attempts -ge $MaxAttempts) {
      $task.status = "failed"
      $task.finishedAt = (Get-Date).ToString("o")
      $summary.movedToFailed++
    }
    else {
      $task.status = "retrying"
      $task.startedAt = $null
      $summary.movedToRetrying++
    }
  }

  Save-Queue -Queue $queue -Path $queueFile

  Write-Output (@{ ok = $true; summary = $summary } | ConvertTo-Json -Depth 6)
}
finally {
  $mutex.ReleaseMutex() | Out-Null
  $mutex.Dispose()
}
