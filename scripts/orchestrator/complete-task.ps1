param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [string]$WorkspaceRoot = ".",
  [string]$EvidenceNote = "",
  [string]$ProducedRef = "",
  # Manual mode: auto-start queued tasks so free-agent completions work without
  # a background worker first calling start-task.
  [switch]$AllowQueued
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

try {
  $null = $mutex.WaitOne()

  $queue = Get-Queue -Path $queueFile
  if ($null -eq $queue) {
    Write-Output (@{ ok = $false; reason = "queue_missing" } | ConvertTo-Json -Depth 4)
    exit 1
  }

  $task = @($queue.tasks) | Where-Object { $_.taskId -eq $TaskId } | Select-Object -First 1
  if ($null -eq $task) {
    Write-Output (@{ ok = $false; reason = "task_not_found"; taskId = $TaskId } | ConvertTo-Json -Depth 4)
    exit 1
  }

  # Accept "running" (worker mode) or "queued" with -AllowQueued flag (manual free-agent mode)
  $validStart = ($task.status -eq "running") -or ($AllowQueued -and $task.status -eq "queued")
  if (-not $validStart) {
    Write-Output (@{ ok = $false; reason = "invalid_status_for_complete"; taskId = $TaskId; status = $task.status; hint = "Task must be 'running', or use -AllowQueued if task is still 'queued'." } | ConvertTo-Json -Depth 6)
    exit 1
  }
  # If queued (manual mode), stamp start time now
  if ($task.status -eq "queued") {
    $task.startedAt = (Get-Date).ToString("o")
  }

  $existingFeedsAck = $null
  if ($null -ne $task.evidence -and $null -ne $task.evidence.feedsAck) {
    $existingFeedsAck = $task.evidence.feedsAck
  }

  $task.evidence = @{}
  if (-not [string]::IsNullOrWhiteSpace($EvidenceNote)) {
    $task.evidence.note = $EvidenceNote
  }
  if (-not [string]::IsNullOrWhiteSpace($ProducedRef)) {
    $task.evidence.producedRef = $ProducedRef
  }
  if ($null -ne $existingFeedsAck) {
    $task.evidence.feedsAck = $existingFeedsAck
  }

  $task.finishedAt = (Get-Date).ToString("o")
  if ([bool]$task.requiresFeedsAck) {
    $task.status = "waiting_ack"
  }
  else {
    $task.status = "done"
  }

  Save-Queue -Queue $queue -Path $queueFile

  $ackBy = if ($task.requiresFeedsAck) { "$($task.feedsAckBy)" } else { $null }
  Write-Output (@{ ok = $true; taskId = $task.taskId; newStatus = $task.status; feedsAckBy = $ackBy } | ConvertTo-Json -Depth 4)
}
finally {
  $mutex.ReleaseMutex() | Out-Null
  $mutex.Dispose()
}
