param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [string]$WorkspaceRoot = ".",
  [string]$EvidenceNote = "",
  [string]$ProducedRef = "",
  # Worker mode: write evidence and pause for review without completing task.
  [switch]$MarkEvidencePending,
  # Manual mode: auto-start queued tasks so free-agent completions work without
  # a background worker first calling start-task.
  [switch]$AllowQueued
)

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$mutex = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")

function Read-JsonFileSafe {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [long]$MaxBytes = 8MB,
    [switch]$TryTmpRecovery
  )

  if (-not (Test-Path $Path)) { return $null }
  $info = Get-Item -Path $Path -ErrorAction SilentlyContinue
  if ($null -eq $info) { return $null }

  function Try-ParseCandidate {
    param([string]$CandidatePath)
    try {
      $raw = Get-Content -Path $CandidatePath -Raw -ErrorAction Stop
      if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
      return ($raw | ConvertFrom-Json -ErrorAction Stop)
    } catch { return $null }
  }

  if ($info.Length -gt $MaxBytes) {
    if (-not $TryTmpRecovery) { return $null }
    $dir = Split-Path -Parent $Path
    $base = [System.IO.Path]::GetFileName($Path)
    foreach ($tmp in @(Get-ChildItem -Path $dir -Filter ("{0}.tmp.*" -f $base) -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending)) {
      if ($tmp.Length -gt $MaxBytes) { continue }
      $parsed = Try-ParseCandidate -CandidatePath $tmp.FullName
      if ($null -eq $parsed) { continue }
      try { Copy-Item -Path $tmp.FullName -Destination $Path -Force } catch {}
      return $parsed
    }
    return $null
  }

  return (Try-ParseCandidate -CandidatePath $Path)
}

function Get-Queue {
  param([string]$Path)
  return (Read-JsonFileSafe -Path $Path -MaxBytes 8MB -TryTmpRecovery)
}

function Save-Queue {
  param($Queue, [string]$Path)
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $tmp = Join-Path $dir ("{0}.tmp.{1}" -f ([System.IO.Path]::GetFileName($Path)), [guid]::NewGuid().ToString("N"))
  $json = $Queue | ConvertTo-Json -Depth 12
  [System.IO.File]::WriteAllText($tmp, $json, (New-Object System.Text.UTF8Encoding($false)))
  $tmpFull = [System.IO.Path]::GetFullPath($tmp)
  $pathFull = [System.IO.Path]::GetFullPath($Path)

  try {
    [System.IO.File]::Copy($tmpFull, $pathFull, $true)
    Remove-Item -Path $tmpFull -Force -ErrorAction SilentlyContinue
  }
  catch {
    if (Test-Path $tmpFull) {
      Remove-Item -Path $tmpFull -Force -ErrorAction SilentlyContinue
    }
    throw
  }
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

  # Accept "running"/"evidence_pending" (worker/review modes) or "queued" with -AllowQueued flag (manual mode)
  $validStart =
    ($task.status -eq "running") -or
    ($task.status -eq "evidence_pending") -or
    ($AllowQueued -and $task.status -eq "queued")
  if (-not $validStart) {
    Write-Output (@{ ok = $false; reason = "invalid_status_for_complete"; taskId = $TaskId; status = $task.status; hint = "Task must be 'running', or use -AllowQueued if task is still 'queued'." } | ConvertTo-Json -Depth 6)
    exit 1
  }
  # If queued (manual mode), stamp start time now
  if ($task.status -eq "queued") {
    $task.startedAt = (Get-Date).ToString("o")
  }

  $isBlindAutoAdvance = (
    -not $MarkEvidencePending -and
    [string]::IsNullOrWhiteSpace($ProducedRef) -and
    -not [string]::IsNullOrWhiteSpace($EvidenceNote) -and
    (
      $EvidenceNote -match "Auto-advanced via agent-loop non-interactive mode" -or
      $EvidenceNote -match "Completed via fast-forward\.ps1 non-interactive mode"
    )
  )
  if ($isBlindAutoAdvance) {
    Write-Output (@{ ok = $false; reason = "evidence_required_noninteractive"; taskId = $TaskId; hint = "Provide -ProducedRef or use -MarkEvidencePending before completion in non-interactive mode." } | ConvertTo-Json -Depth 6)
    exit 1
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

  if ($MarkEvidencePending) {
    $task.status = "evidence_pending"
    $task | Add-Member -NotePropertyName "updatedAt" -NotePropertyValue ((Get-Date).ToString("o")) -Force
  }
  else {
    $task.finishedAt = (Get-Date).ToString("o")
    if ([bool]$task.requiresFeedsAck) {
      $task.status = "waiting_ack"
    }
    else {
      $task.status = "done"
    }
  }

  Save-Queue -Queue $queue -Path $queueFile

  $ackBy = if ($task.requiresFeedsAck) { "$($task.feedsAckBy)" } else { $null }
  Write-Output (@{ ok = $true; taskId = $task.taskId; newStatus = $task.status; feedsAckBy = $ackBy } | ConvertTo-Json -Depth 4)
}
finally {
  $mutex.ReleaseMutex() | Out-Null
  $mutex.Dispose()
}
