param(
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [int]$PollSeconds = 30,
  [string]$WorkspaceRoot = "."
)

$logDir = Join-Path $WorkspaceRoot "logs\orchestrator"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("worker-" + ($AgentName -replace '[^a-zA-Z0-9_-]', '') + ".log")

while ($true) {
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $msg = "[$timestamp] $AgentName heartbeat: background worker active (planning-prep lane)."
  Add-Content -Path $logFile -Value $msg

  # MVP behavior: keep alive and write heartbeat; next phase will claim tasks from queue.
  Start-Sleep -Seconds $PollSeconds
}
