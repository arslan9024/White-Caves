param(
  [string]$WorkspaceRoot = ".",
  [switch]$NoClear
)

if (-not $NoClear) {
  Clear-Host
}

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

$total = $tasks.Count
$done = @($tasks | Where-Object { $_.status -eq "done" }).Count
$running = @($tasks | Where-Object { $_.status -eq "running" }).Count
$pendingStatuses = @("queued","running","evidence_pending","waiting_ack","retrying","failed","escalated")
$pending = @($tasks | Where-Object { $pendingStatuses -contains $_.status }).Count
$pct = if ($total -gt 0) { [math]::Round((100.0 * $done / $total), 1) } else { 0 }

$lanePending = @($tasks | Where-Object { $pendingStatuses -contains $_.status } | Group-Object lane | Sort-Object Count -Descending)
$focusLane = if ($lanePending.Count -gt 0) { $lanePending[0].Name } else { "N/A" }
$focusCount = if ($lanePending.Count -gt 0) { $lanePending[0].Count } else { 0 }

Write-Host "`nProject Development Insights" -ForegroundColor Blue
Write-Host ("  Cycle         : {0}" -f $(if ([string]::IsNullOrWhiteSpace([string]$queue.cycle)) { "N/A" } else { [string]$queue.cycle })) -ForegroundColor Blue
Write-Host ("  Progress      : {0}/{1} done ({2}%)" -f $done, $total, $pct) -ForegroundColor Blue
Write-Host ("  Active load   : pending={0}, running={1}" -f $pending, $running) -ForegroundColor Blue
Write-Host ("  Focus area    : lane={0} with {1} active task(s)" -f $focusLane, $focusCount) -ForegroundColor Blue

$blocked = $tasks | Where-Object { $_.status -eq "waiting_ack" }
if ($blocked.Count -gt 0) {
  Write-Host "\nWaiting ACK tasks:" -ForegroundColor Yellow
  $blocked | Select-Object taskId, agent, feedsAckBy, title | Format-Table -AutoSize
}
