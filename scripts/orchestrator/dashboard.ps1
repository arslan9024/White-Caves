# dashboard.ps1 — Rich visual orchestration dashboard
# Shows: worker health, queue summary, per-agent status, escalations, gate status
param(
  [string]$WorkspaceRoot = ".",
  [switch]$Watch,          # if set, refresh every $RefreshSeconds seconds
  [int]$RefreshSeconds = 15
)

$stateDir    = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile   = Join-Path $stateDir "task-queue.json"
$pidFile     = Join-Path $stateDir "worker-processes.json"
$wdLog       = Join-Path $stateDir "watchdog-scheduler.log"
# $trackerFile reserved for future escalation log display

function Read-Queue {
  if (-not (Test-Path $queueFile)) { return $null }
  $raw = Get-Content $queueFile -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  return $raw | ConvertFrom-Json
}

function Read-Workers {
  if (-not (Test-Path $pidFile)) { return @() }
  $raw = Get-Content $pidFile -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return @() }
  $parsed = $raw | ConvertFrom-Json
  if ($parsed -isnot [array]) { return @($parsed) }
  return $parsed
}

function Test-ProcessAlive {
  param([int]$ProcessId)
  try {
    $p = Get-Process -Id $ProcessId -ErrorAction Stop
    return ($null -ne $p)
  }
  catch { return $false }
}

function Write-Header {
  param([string]$Title, [ConsoleColor]$Color = "Cyan")
  $bar = "-" * 60
  Write-Host ""
  Write-Host $bar -ForegroundColor $Color
  Write-Host "  $Title" -ForegroundColor $Color
  Write-Host $bar -ForegroundColor $Color
}

function Show-Dashboard {
  Clear-Host
  $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

  Write-Host ""
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "  WHITE CAVES ORCHESTRATION DASHBOARD    $now" -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor Cyan

  # ── 1. Worker pool health ──────────────────────────────────────────────────
  Write-Header "WORKER POOL HEALTH"
  $workers = Read-Workers
  if ($workers.Count -eq 0) {
    Write-Host "  [OFFLINE] No workers registered. Run: npm run orchestrator:bg:start" -ForegroundColor Red
  }
  else {
    $aliveCount = 0
    foreach ($w in $workers) {
      $procId = [int]$w.Pid
      $alive  = Test-ProcessAlive -ProcessId $procId
      if ($alive) { $aliveCount++ }
      $statusStr = if ($alive) { "[ALIVE]" } else { "[DEAD] " }
      $color     = if ($alive) { "Green"  } else { "Red"    }
      $typeStr   = if ($w.Type) { $w.Type } else { "worker" }
      $labelStr  = if ($w.Lane) { "Lane=$($w.Lane)" }
                   elseif ($w.Agent) { $w.Agent }
                   elseif ($w.IntervalMinutes) { "watchdog every $($w.IntervalMinutes)m" }
                   else { "" }
      Write-Host ("  $statusStr  PID=$procId  type=$typeStr  $labelStr") -ForegroundColor $color
    }
    Write-Host ""
    $total = $workers.Count
    $deadCount = $total - $aliveCount
    $healthColor = if ($deadCount -eq 0) { "Green" } else { "Yellow" }
    Write-Host ("  Alive: $aliveCount / $total" + $(if ($deadCount -gt 0) { "  ($deadCount dead -- run: npm run orchestrator:bg:restart)" } else { "" })) -ForegroundColor $healthColor
  }

  # ── 2. Queue summary ──────────────────────────────────────────────────────
  Write-Header "QUEUE SUMMARY"
  $queue = Read-Queue
  if ($null -eq $queue) {
    Write-Host "  [NO QUEUE] Run: npm run orchestrator:queue:init" -ForegroundColor Red
    return
  }

  $tasks = @($queue.tasks)
  $statuses = $tasks | Group-Object status | Sort-Object Name
  foreach ($g in $statuses) {
    $color = switch ($g.Name) {
      "done"         { "Green"   }
      "running"      { "Cyan"    }
      "waiting_ack"  { "Yellow"  }
      "queued"       { "White"   }
      "retrying"     { "Magenta" }
      "failed"       { "Red"     }
      "escalated"    { "DarkYellow" }
      default        { "Gray"    }
    }
    Write-Host ("  " + $g.Name.PadRight(14) + " : " + $g.Count) -ForegroundColor $color
  }
  Write-Host ""
  $lanes = $tasks | Group-Object lane | Sort-Object Name
  Write-Host "  By Lane:" -ForegroundColor DarkCyan
  foreach ($l in $lanes) {
    $lTasks = @($l.Group)
    $done     = ($lTasks | Where-Object { $_.status -eq "done" }).Count
    $running  = ($lTasks | Where-Object { $_.status -eq "running" }).Count
    $queued   = ($lTasks | Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" }).Count
    $blocked  = ($lTasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" }).Count
    Write-Host ("    Lane " + $l.Name + " : done=$done running=$running queued=$queued blocked=$blocked") -ForegroundColor DarkCyan
  }

  # ── 3. Per-agent status table ──────────────────────────────────────────────
  Write-Header "PER-AGENT STATUS"
  $agents = $tasks | Group-Object agent | Sort-Object Name
  Write-Host ("  " + "Agent".PadRight(14) + "Lane  " + "Status".PadRight(14) + "Task") -ForegroundColor White
  Write-Host ("  " + ("-" * 70)) -ForegroundColor DarkGray
  foreach ($ag in $agents) {
    foreach ($t in $ag.Group) {
      $statusColor = switch ($t.status) {
        "done"         { "Green"   }
        "running"      { "Cyan"    }
        "waiting_ack"  { "Yellow"  }
        "queued"       { "Gray"    }
        "retrying"     { "Magenta" }
        "failed"       { "Red"     }
        "escalated"    { "Red"     }
        default        { "White"   }
      }
      $agStr  = ($t.agent).PadRight(14)
      $lnStr  = ($t.lane).PadRight(6)
      $stStr  = ($t.status).PadRight(14)
      $ttStr  = if ($t.title.Length -gt 38) { $t.title.Substring(0,35) + "..." } else { $t.title }
      Write-Host ("  " + $agStr + $lnStr + $stStr + $ttStr) -ForegroundColor $statusColor
    }
  }

  # ── 4. Waiting ACK ────────────────────────────────────────────────────────
  $waitingAck = $tasks | Where-Object { $_.status -eq "waiting_ack" -or $_.status -eq "escalated" }
  if (@($waitingAck).Count -gt 0) {
    Write-Header "PENDING FEEDS_ACK (action required)" "Yellow"
    foreach ($t in $waitingAck) {
      $ackColor = if ($t.status -eq "escalated") { "Red" } else { "Yellow" }
      Write-Host ("  [" + $t.status.ToUpper() + "] " + $t.taskId + " -- " + $t.title) -ForegroundColor $ackColor
      Write-Host ("    Downstream ACK from: " + $t.feedsAckBy) -ForegroundColor DarkYellow
      Write-Host ("    Run: npm run orchestrator:queue:ack -- -TaskId $($t.taskId) -AgentName $($t.feedsAckBy)") -ForegroundColor Gray
    }
  }

  # ── 5. Watchdog last run ──────────────────────────────────────────────────
  if (Test-Path $wdLog) {
    $lastLines = Get-Content $wdLog -Tail 4
    Write-Header "WATCHDOG SCHEDULER (last 4 log lines)" "DarkGray"
    foreach ($l in $lastLines) {
      Write-Host "  $l" -ForegroundColor DarkGray
    }
  }

  # ── 6. Progress bar ───────────────────────────────────────────────────────
  Write-Header "OVERALL PROGRESS"
  $total     = $tasks.Count
  $doneCount = ($tasks | Where-Object { $_.status -eq "done" }).Count
  $pct       = if ($total -gt 0) { [math]::Round($doneCount / $total * 100) } else { 0 }
  $barWidth  = 40
  $filled    = [math]::Round($barWidth * $pct / 100)
  $empty     = $barWidth - $filled
  $bar       = "[" + ("#" * $filled) + ("." * $empty) + "]"
  $pctColor  = if ($pct -ge 80) { "Green" } elseif ($pct -ge 40) { "Yellow" } else { "Cyan" }
  Write-Host ("  $bar  $pct% ($doneCount / $total tasks done)") -ForegroundColor $pctColor

  Write-Host ""
  Write-Host "============================================================" -ForegroundColor DarkGray
  if ($Watch) {
    Write-Host "  [WATCH mode] Refreshing every ${RefreshSeconds}s  --  Ctrl+C to stop" -ForegroundColor DarkGray
  }
  else {
    Write-Host "  Tip: use -Watch flag for live refresh." -ForegroundColor DarkGray
  }
  Write-Host "============================================================" -ForegroundColor DarkGray
  Write-Host ""
}

if ($Watch) {
  while ($true) {
    Show-Dashboard
    Start-Sleep -Seconds $RefreshSeconds
  }
}
else {
  Show-Dashboard
}
