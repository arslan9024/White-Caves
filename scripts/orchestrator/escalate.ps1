# Escalate — auto-escalates tasks stuck in waiting_ack beyond AckStaleMinutes.
# Writes escalation notice to DAILY_MILESTONE_TRACKER.md and marks task as "escalated".
param(
  [string]$WorkspaceRoot = ".",
  [int]$AckStaleMinutes = 20
)

$stateDir  = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$tracker   = Join-Path $WorkspaceRoot "DAILY_MILESTONE_TRACKER.md"
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

$escalated = @()

try {
  $null = $mutex.WaitOne()

  $queue = Get-Queue -Path $queueFile
  if ($null -eq $queue) {
    Write-Output (@{ ok = $false; reason = "queue_missing" } | ConvertTo-Json -Depth 4)
    exit 0
  }

  $now   = Get-Date
  $tasks = @($queue.tasks)

  foreach ($task in $tasks) {
    if ($task.status -ne "waiting_ack") { continue }
    if ($null -eq $task.finishedAt)    { continue }

    $finishedAt = Get-Date $task.finishedAt
    $elapsed    = ($now - $finishedAt).TotalMinutes

    if ($elapsed -lt $AckStaleMinutes) { continue }

    # Mark escalated
    $task.status      = "escalated"
    $task.escalatedAt = $now.ToString("o")

    $escalated += [PSCustomObject]@{
      taskId     = $task.taskId
      title      = $task.title
      agent      = $task.agent
      feedsAckBy = $task.feedsAckBy
      elapsedMin = [math]::Round($elapsed, 1)
    }
  }

  if ($escalated.Count -gt 0) {
    Save-Queue -Queue $queue -Path $queueFile
  }
}
finally {
  $mutex.ReleaseMutex()
}

# Append escalation notices to tracker
if ($escalated.Count -gt 0 -and (Test-Path $tracker)) {
  $dateStr  = (Get-Date).ToString("MMM d, yyyy HH:mm")
  $lines    = @("")
  $lines   += "### ESCALATION ALERT -- $dateStr"
  $lines   += ""
  $lines   += "| Task ID | Title | Agent | Awaiting ACK From | Stuck (min) |"
  $lines   += "|---------|-------|-------|-------------------|-------------|"

  foreach ($e in $escalated) {
    $lines += "| $($e.taskId) | $($e.title) | $($e.agent) | $($e.feedsAckBy) | $($e.elapsedMin) |"
  }

  $lines += ""
  $lines += "> @Margaret -- these tasks require downstream FEEDS_ACK from the agents listed above."
  $lines += "> Run: npm run orchestrator:queue:ack -- -TaskId TASKID -AgentName AGENT"
  $lines += ""

  Add-Content -Path $tracker -Value ($lines -join "`n") -Encoding UTF8
}

$out = @{
  ok         = $true
  escalated  = $escalated.Count
  tasks      = $escalated
} | ConvertTo-Json -Depth 6
Write-Output $out
