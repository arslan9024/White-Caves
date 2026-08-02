# session-report.ps1 -- End-of-session summary written to DAILY_MILESTONE_TRACKER.md
# Shows tasks completed this session, output logs recorded, queue progress, next up
param(
  [string]$WorkspaceRoot = ".",
  [switch]$Print,         # also print to terminal (always writes to tracker)
  [string]$SessionLabel = ""  # optional custom label e.g. "Morning Run"
)

$stateDir       = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile      = Join-Path $stateDir "task-queue.json"
$outputsDir     = Join-Path $stateDir "outputs"
$trackerFile    = Join-Path $WorkspaceRoot "DAILY_MILESTONE_TRACKER.md"

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue file not found." -ForegroundColor Red
  exit 1
}

$queue = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($queue.tasks)
$today = (Get-Date).ToString("yyyy-MM-dd")
$now   = (Get-Date).ToString("HH:mm")
$label = if ($SessionLabel -ne "") { " -- $SessionLabel" } else { "" }

# -- Gather stats --------------------------------------------------------------
$done      = @($tasks | Where-Object { $_.status -eq "done" })
$running   = @($tasks | Where-Object { $_.status -eq "running" })
$waiting   = @($tasks | Where-Object { $_.status -eq "waiting_ack" })
$queued    = @($tasks | Where-Object { $_.status -eq "queued" })
$retrying  = @($tasks | Where-Object { $_.status -eq "retrying" })
$failed    = @($tasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" })
$total     = $tasks.Count
$pct       = if ($total -gt 0) { [math]::Round(($done.Count / $total) * 100) } else { 0 }

# output logs created today
$outputLogs = @()
if (Test-Path $outputsDir) {
  $outputLogs = @(Get-ChildItem $outputsDir -Filter "*.md" |
    Where-Object { $_.LastWriteTime.ToString("yyyy-MM-dd") -eq $today })
}

# recently completed (completedAt today)
$completedToday = @($done | Where-Object {
  try {
    if ($_.PSObject.Properties.Name -contains "completedAt" -and $null -ne $_.completedAt) {
      $dt = [datetime]::Parse($_.completedAt)
      $dt.ToString("yyyy-MM-dd") -eq $today
    } else { $false }
  } catch { $false }
})

# -- Per-lane summary ----------------------------------------------------------
$laneSummary = @{}
foreach ($t in $tasks) {
  $l = $t.lane
  if (-not $laneSummary.ContainsKey($l)) {
    $laneSummary[$l] = @{ done = 0; total = 0; agents = @{} }
  }
  $laneSummary[$l].total++
  if ($t.status -eq "done") { $laneSummary[$l].done++ }
  $a = $t.agent
  if (-not $laneSummary[$l].agents.ContainsKey($a)) { $laneSummary[$l].agents[$a] = 0 }
  if ($t.status -eq "done") { $laneSummary[$l].agents[$a]++ }
}

# -- Build report text ---------------------------------------------------------
$lines = @()
$lines += ""
$lines += "## Session Report -- $today $now$label"
$lines += ""
$lines += "| Metric | Value |"
$lines += "|--------|-------|"
$lines += "| Tasks Done (total) | $($done.Count) / $total ($pct%) |"
$lines += "| Completed Today | $($completedToday.Count) |"
$lines += "| Currently Running | $($running.Count) |"
$lines += "| Waiting ACK | $($waiting.Count) |"
$lines += "| Output Logs Today | $($outputLogs.Count) |"
$lines += "| Failed/Escalated | $($failed.Count) |"
$lines += ""
$lines += "### Lane Progress"
$lines += ""
$lines += "| Lane | Done | Total | Pct |"
$lines += "|------|------|-------|-----|"
foreach ($l in @("A","B","C","D")) {
  if ($laneSummary.ContainsKey($l)) {
    $ls   = $laneSummary[$l]
    $lpct = if ($ls.total -gt 0) { [math]::Round(($ls.done / $ls.total) * 100) } else { 0 }
    $lines += "| $l | $($ls.done) | $($ls.total) | $lpct% |"
  }
}

if ($completedToday.Count -gt 0) {
  $lines += ""
  $lines += "### Completed This Session"
  $lines += ""
  foreach ($t in $completedToday | Sort-Object completedAt) {
    $lines += "- **$($t.taskId)** ($($t.agent)) -- $($t.title)"
  }
}

if ($running.Count -gt 0 -or $waiting.Count -gt 0) {
  $lines += ""
  $lines += "### In Flight"
  $lines += ""
  foreach ($t in $running) {
    $lines += "- [RUNNING] **$($t.taskId)** ($($t.agent)) -- $($t.title)"
  }
  foreach ($t in $waiting) {
    $lines += "- [WAITING ACK] **$($t.taskId)** ($($t.agent)) -- needs ACK from $($t.feedsAckBy)"
  }
}

if ($failed.Count -gt 0) {
  $lines += ""
  $lines += "### Needs Attention"
  $lines += ""
  foreach ($t in $failed) {
    $lines += "- [$($t.status.ToUpper())] **$($t.taskId)** ($($t.agent)) -- $($t.title)"
  }
  $lines += ""
  $lines += "> Run: ``npm run orchestrator:queue:reset-failed`` to re-queue"
}

# next up per lane (first ready task per lane)
$nextUp = @()
foreach ($l in @("A","B","C","D")) {
  $first = $tasks | Where-Object { $_.lane -eq $l -and ($_.status -eq "queued" -or $_.status -eq "retrying") } |
    Sort-Object createdAt | Select-Object -First 1
  if ($null -ne $first) { $nextUp += $first }
}
if ($nextUp.Count -gt 0) {
  $lines += ""
  $lines += "### Next Up Per Lane"
  $lines += ""
  foreach ($t in $nextUp) {
    $lines += "- Lane $($t.lane): **$($t.taskId)** ($($t.agent)) -- $($t.title)"
  }
}

$lines += ""
$lines += "---"
$lines += ""

$report = $lines -join "`n"

# -- Append to tracker ---------------------------------------------------------
if (Test-Path $trackerFile) {
  $existing = Get-Content $trackerFile -Raw
  $updated  = $existing + "`n" + $report
} else {
  $updated = "# DAILY_MILESTONE_TRACKER`n" + $report
}
[System.IO.File]::WriteAllText($trackerFile, $updated, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[SAVED] Session report appended to DAILY_MILESTONE_TRACKER.md" -ForegroundColor Green

# -- Print to terminal if requested --------------------------------------------
if ($Print) {
  Write-Host ""
  Write-Host $report
}

Write-Host ""
Write-Host "  Done: $($done.Count)/$total ($pct%)  |  Today: $($completedToday.Count) tasks  |  Output logs: $($outputLogs.Count)" -ForegroundColor Cyan
Write-Host ""