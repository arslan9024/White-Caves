# worker-lane.ps1 — Lane-aware background worker.
# Claims the next ready task in its assigned lane (A/B/C/D) every PollSeconds.
# Uses dispatch-lane.ps1 for smarter routing instead of agent-locked dispatch.
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("A","B","C","D","any")]
  [string]$Lane,

  [string]$PreferAgent   = "",
  [int]$PollSeconds      = 30,
  [string]$WorkspaceRoot = "."
)

$stateDir       = Join-Path $WorkspaceRoot "logs\orchestrator"
$logFile        = Join-Path $stateDir "worker-lane-$Lane.log"
$dispatchScript = Join-Path $PSScriptRoot "dispatch-lane.ps1"
$completeScript = Join-Path $PSScriptRoot "complete-task.ps1"
$workerLabel    = "lane-$Lane-worker"

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null

function Write-Log {
  param([string]$Msg)
  $ts   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  $line = "[$ts][$workerLabel] $Msg"
  Add-Content -Path $logFile -Value $line -Encoding UTF8
}

Write-Log "Lane worker started. Lane=$Lane PollSeconds=$PollSeconds PreferAgent='$PreferAgent'"

while ($true) {
  # --- Claim next ready task for this lane ---
  $rawResult = & $dispatchScript `
    -Lane $Lane `
    -PreferAgent $PreferAgent `
    -WorkerLabel $workerLabel `
    -WorkspaceRoot $WorkspaceRoot 2>&1

  $resultStr = ($rawResult | Out-String).Trim()

  try {
    $parsed = $resultStr | ConvertFrom-Json
  }
  catch {
    Write-Log "Parse error on dispatch result: $resultStr"
    Start-Sleep -Seconds $PollSeconds
    continue
  }

  if (-not $parsed.claimed) {
    Write-Log "No ready task in lane $Lane ($($parsed.reason)). Sleeping ${PollSeconds}s."
    Start-Sleep -Seconds $PollSeconds
    continue
  }

  $taskId = $parsed.taskId
  $title  = $parsed.title
  $agent  = $parsed.agent
  Write-Log "Claimed task $taskId ('$title') for agent $agent"

  # --- Simulate execution (human/AI agent does real work externally) ---
  # In production the worker signals the real agent and awaits its completion.
  # Here we record a placeholder output and mark the task done / waiting_ack.
  $placeholderOutput = "Task '$title' claimed by $workerLabel for agent $agent at $(Get-Date)"

  $completeResult = & $completeScript `
    -TaskId $taskId `
    -OutputSummary $placeholderOutput `
    -WorkspaceRoot $WorkspaceRoot 2>&1

  $completeStr = ($completeResult | Out-String).Trim()
  Write-Log "Complete result for ${taskId}: $completeStr"

  Start-Sleep -Seconds $PollSeconds
}
