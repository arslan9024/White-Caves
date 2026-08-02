param(
  [string]$WorkspaceRoot = "."
)

$queueFile = Join-Path (Join-Path $WorkspaceRoot "logs\orchestrator") "task-queue.json"
$trackerFile = Join-Path $WorkspaceRoot "DAILY_MILESTONE_TRACKER.md"

if (-not (Test-Path $queueFile)) {
  Write-Output (@{ ok = $false; reason = "queue_missing" } | ConvertTo-Json -Depth 4)
  exit 1
}
if (-not (Test-Path $trackerFile)) {
  Write-Output (@{ ok = $false; reason = "tracker_missing" } | ConvertTo-Json -Depth 4)
  exit 1
}

$queue = (Get-Content -Path $queueFile -Raw) | ConvertFrom-Json
$tasks = @($queue.tasks)

$done = @($tasks | Where-Object { $_.status -eq "done" }).Count
$running = @($tasks | Where-Object { $_.status -eq "running" }).Count
$waiting = @($tasks | Where-Object { $_.status -eq "waiting_ack" }).Count
$queued = @($tasks | Where-Object { $_.status -eq "queued" }).Count
$retrying = @($tasks | Where-Object { $_.status -eq "retrying" }).Count
$failed = @($tasks | Where-Object { $_.status -eq "failed" }).Count

$line = "| $(Get-Date -Format 'MMM d') | Orchestrator Sync | @Katherine + @Margaret | Done | Queue summary: done=$done, running=$running, waiting_ack=$waiting, queued=$queued, retrying=$retrying, failed=$failed |"

$content = Get-Content -Path $trackerFile -Raw
if ($content -notmatch "## 🤖 Orchestrator Sync Log") {
  Add-Content -Path $trackerFile -Value "`n## 🤖 Orchestrator Sync Log`n`n| Date | Milestone | Agent | Status | Notes |`n| ---- | --------- | ----- | ------ | ----- |"
}
Add-Content -Path $trackerFile -Value $line

Write-Output (@{ ok = $true; appended = $line } | ConvertTo-Json -Depth 6)
