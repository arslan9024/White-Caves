param(
  [string]$WorkspaceRoot = "."
)

$queueFile = Join-Path (Join-Path $WorkspaceRoot "logs\orchestrator") "task-queue.json"
if (-not (Test-Path $queueFile)) {
  Write-Host "Queue file not found. Run init first: npm run orchestrator:queue:init" -ForegroundColor Yellow
  exit 0
}

$queue = (Get-Content -Path $queueFile -Raw) | ConvertFrom-Json
$tasks = @($queue.tasks)

$summary = $tasks | Group-Object status | Sort-Object Name | ForEach-Object {
  [PSCustomObject]@{ Status = $_.Name; Count = $_.Count }
}

Write-Host "Orchestrator Queue Status" -ForegroundColor Cyan
$summary | Format-Table -AutoSize

$blocked = $tasks | Where-Object { $_.status -eq "waiting_ack" }
if ($blocked.Count -gt 0) {
  Write-Host "\nWaiting ACK tasks:" -ForegroundColor Yellow
  $blocked | Select-Object taskId, agent, feedsAckBy, title | Format-Table -AutoSize
}
