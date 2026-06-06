param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [Parameter(Mandatory = $true)]
  [string]$AckBy,
  [string]$WorkspaceRoot = ".",
  [string]$AckNote = "accepted"
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

  if ($task.status -ne "waiting_ack" -and $task.status -ne "evidence_pending") {
    Write-Output (@{ ok = $false; reason = "task_not_ackable"; taskId = $TaskId; status = $task.status } | ConvertTo-Json -Depth 6)
    exit 1
  }

  $expected = "$($task.feedsAckBy)"
  if ($expected -and $expected -ne $AckBy) {
    Write-Output (@{ ok = $false; reason = "ack_agent_mismatch"; expected = $expected; got = $AckBy } | ConvertTo-Json -Depth 6)
    exit 1
  }

  $noteVal = $null
  $producedRefVal = $null
  if ($null -ne $task.evidence) {
    if ($null -ne $task.evidence.note) { $noteVal = "$($task.evidence.note)" }
    if ($null -ne $task.evidence.producedRef) { $producedRefVal = "$($task.evidence.producedRef)" }
  }

  $task.evidence = @{}
  if ($null -ne $noteVal) { $task.evidence.note = $noteVal }
  if ($null -ne $producedRefVal) { $task.evidence.producedRef = $producedRefVal }

  $task.evidence.feedsAck = @{
    by = $AckBy
    note = $AckNote
    at = (Get-Date).ToString("o")
  }

  $task.status = "done"
  $task.finishedAt = (Get-Date).ToString("o")

  Save-Queue -Queue $queue -Path $queueFile

  Write-Output (@{ ok = $true; taskId = $task.taskId; status = $task.status } | ConvertTo-Json -Depth 4)
}
finally {
  $mutex.ReleaseMutex() | Out-Null
  $mutex.Dispose()
}
