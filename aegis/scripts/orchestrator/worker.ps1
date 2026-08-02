param(
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [int]$PollSeconds = 30,
  [string]$WorkspaceRoot = "."
)

$logDir = Join-Path $WorkspaceRoot "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("worker-" + ($AgentName -replace '[^a-zA-Z0-9_-]', '') + ".log")

$dispatchScript = Join-Path $PSScriptRoot "dispatch.ps1"
$completeScript = Join-Path $PSScriptRoot "complete-task.ps1"

function Write-WorkerLog {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $logFile -Value "[$timestamp] $Message"
}

while ($true) {
  try {
    $claimJson = & $dispatchScript -AgentName $AgentName -WorkspaceRoot $WorkspaceRoot
    $claim = $claimJson | ConvertFrom-Json

    if (-not $claim.claimed) {
      Write-WorkerLog "$AgentName idle: $($claim.reason)"
      Start-Sleep -Seconds $PollSeconds
      continue
    }

    Write-WorkerLog "$AgentName claimed $($claim.taskId): $($claim.title)"

    # Evidence capture block: workers record activity and move task to evidence_pending for guarded review.
    Start-Sleep -Seconds ([Math]::Min(5, [Math]::Max(1, [int]($PollSeconds / 2))))

    $evidenceNote = "Worker captured execution evidence; review required before completion."
    $producedRef = "logs/orchestrator/worker-" + ($AgentName -replace '[^a-zA-Z0-9_-]', '') + ".log"

    $completeJson = & $completeScript -TaskId $claim.taskId -WorkspaceRoot $WorkspaceRoot -EvidenceNote $evidenceNote -ProducedRef $producedRef -MarkEvidencePending
    $complete = $completeJson | ConvertFrom-Json

    if ($complete.ok) {
      Write-WorkerLog "$AgentName moved $($complete.taskId) => status: $($complete.newStatus)"
    }
    else {
      Write-WorkerLog "$AgentName completion error for $($claim.taskId): $($complete.reason)"
    }
  }
  catch {
    Write-WorkerLog "$AgentName worker exception: $($_.Exception.Message)"
  }

  Start-Sleep -Seconds $PollSeconds
}
