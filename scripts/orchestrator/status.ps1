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

$queue = $null
$tasks = @()
$queueCycle = "N/A"
$usedFallback = $false
$statusCounts = @{}

function Add-StatusCount {
  param([string]$Status)
  if ([string]::IsNullOrWhiteSpace($Status)) { return }
  if (-not $script:statusCounts.ContainsKey($Status)) {
    $script:statusCounts[$Status] = 0
  }
  $script:statusCounts[$Status] = [int]$script:statusCounts[$Status] + 1
}

try {
  $item = Get-Item -Path $queueFile -ErrorAction Stop
  if ($item.Length -le 2MB) {
    $queue = (Get-Content -Path $queueFile -Raw) | ConvertFrom-Json
    $tasks = @($queue.tasks)
    if (-not [string]::IsNullOrWhiteSpace([string]$queue.cycle)) {
      $queueCycle = [string]$queue.cycle
    }
  }
  else {
    $usedFallback = $true
    foreach ($line in [System.IO.File]::ReadLines($queueFile)) {
      if ($queueCycle -eq "N/A" -and $line -match '"cycle"\s*:\s*"([^"]+)"') {
        $queueCycle = $Matches[1]
      }
      if ($line -match '"status"\s*:\s*"([^"]+)"') {
        Add-StatusCount -Status $Matches[1]
      }
    }
  }
}
catch {
  $usedFallback = $true
  foreach ($line in [System.IO.File]::ReadLines($queueFile)) {
    if ($queueCycle -eq "N/A" -and $line -match '"cycle"\s*:\s*"([^"]+)"') {
      $queueCycle = $Matches[1]
    }
    if ($line -match '"status"\s*:\s*"([^"]+)"') {
      Add-StatusCount -Status $Matches[1]
    }
  }
}

$summary = @()
if (-not $usedFallback) {
  $summary = $tasks | Group-Object status | Sort-Object Name | ForEach-Object {
    [PSCustomObject]@{ Status = $_.Name; Count = $_.Count }
  }
}
else {
  $summary = @($statusCounts.Keys | Sort-Object | ForEach-Object {
    [PSCustomObject]@{ Status = $_; Count = [int]$statusCounts[$_] }
  })
}

Write-Host "Orchestrator Queue Status" -ForegroundColor Cyan
$summary | Format-Table -AutoSize

$total = 0
$done = 0
$running = 0
$pending = 0
$pendingStatuses = @("queued","running","evidence_pending","waiting_ack","retrying","failed","escalated")

if (-not $usedFallback) {
  $total = $tasks.Count
  $done = @($tasks | Where-Object { $_.status -eq "done" }).Count
  $running = @($tasks | Where-Object { $_.status -eq "running" }).Count
  $pending = @($tasks | Where-Object { $pendingStatuses -contains $_.status }).Count
}
else {
  foreach ($k in $statusCounts.Keys) {
    $count = [int]$statusCounts[$k]
    $total += $count
    if ($k -eq "done") { $done += $count }
    if ($k -eq "running") { $running += $count }
    if ($pendingStatuses -contains $k) { $pending += $count }
  }
}

$pct = if ($total -gt 0) { [math]::Round((100.0 * $done / $total), 1) } else { 0 }

$focusLane = "N/A"
$focusCount = 0
if (-not $usedFallback) {
  $lanePending = @($tasks | Where-Object { $pendingStatuses -contains $_.status } | Group-Object lane | Sort-Object Count -Descending)
  $focusLane = if ($lanePending.Count -gt 0) { $lanePending[0].Name } else { "N/A" }
  $focusCount = if ($lanePending.Count -gt 0) { $lanePending[0].Count } else { 0 }
}

Write-Host "`nProject Development Insights" -ForegroundColor Blue
Write-Host ("  Cycle         : {0}" -f $queueCycle) -ForegroundColor Blue
Write-Host ("  Progress      : {0}/{1} done ({2}%)" -f $done, $total, $pct) -ForegroundColor Blue
Write-Host ("  Active load   : pending={0}, running={1}" -f $pending, $running) -ForegroundColor Blue
Write-Host ("  Focus area    : lane={0} with {1} active task(s)" -f $focusLane, $focusCount) -ForegroundColor Blue
if ($usedFallback) {
  Write-Host "  Mode          : large-file fallback (lane-level detail reduced)" -ForegroundColor DarkYellow
}

if (-not $usedFallback) {
  $blocked = $tasks | Where-Object { $_.status -eq "waiting_ack" }
  if ($blocked.Count -gt 0) {
    Write-Host "\nWaiting ACK tasks:" -ForegroundColor Yellow
    $blocked | Select-Object taskId, agent, feedsAckBy, title | Format-Table -AutoSize
  }
}
