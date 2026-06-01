# dashboard.ps1 -- Rich visual orchestration dashboard
# Upgraded Aegis views:
# - Pending/Completed tasks
# - Pending/Completed features
# - Module health & strength with world-class scoring
# - Smart Aegis decision recommendations
param(
  [string]$WorkspaceRoot = ".",
  [switch]$Watch,          # if set, refresh every $RefreshSeconds seconds
  [int]$RefreshSeconds = 15
)

$stateDir    = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile   = Join-Path $stateDir "task-queue.json"
$pidFile     = Join-Path $stateDir "worker-processes.json"
$wdLog       = Join-Path $stateDir "watchdog-scheduler.log"

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

function Get-ModuleNameByLane {
  param([string]$Lane)
  switch ($Lane) {
    "A" { return "Compliance/Legal/UX/AI" }
    "B" { return "Valuation/Market/Finance" }
    "C" { return "Scheduling/Off-plan/Analytics" }
    "D" { return "Offers/WhatsApp/AI Chat" }
    default { return "Unassigned" }
  }
}

function Get-FeatureName {
  param([string]$Title, [string]$Lane)

  $t = ([string]$Title).ToLower()

  if ($t -match "compliance|pdpl|regulator|rera") { return "Compliance & Regulatory" }
  if ($t -match "dld|legal|contract") { return "DLD & Legal" }
  if ($t -match "tenancy|ejari|landlord") { return "Tenancy & Landlord" }
  if ($t -match "tenant portal|document|email automation") { return "Tenant Experience & Document Ops" }
  if ($t -match "ux|community|luxury|design") { return "UX & Community Experience" }
  if ($t -match "seo|campaign|marketing|careers") { return "SEO & Growth" }
  if ($t -match "ai assistant|lead scoring|ai chat") { return "AI Assistants & Intelligence" }
  if ($t -match "valuation|market intelligence|market analytics") { return "Valuation & Market Intelligence" }
  if ($t -match "data pipeline|currency|secondary-sales|analytics dashboard") { return "Data Pipeline & Analytics" }
  if ($t -match "inventory|investment|prospecting") { return "Inventory & Investment" }
  if ($t -match "finance|financial|revenue|vat") { return "Finance & Reporting" }
  if ($t -match "viewing|calendar|scheduling") { return "Scheduling & Viewings" }
  if ($t -match "off-plan|handover|snagging") { return "Off-plan & Handover" }
  if ($t -match "audit|activity feed|follow-up") { return "Audit & Automation" }
  if ($t -match "agent performance|kpi") { return "Performance Analytics" }
  if ($t -match "offer|whatsapp") { return "Offers & Communications" }
  if ($t -match "maintenance|map|geospatial") { return "Maintenance & Map Intelligence" }

  return ("Core " + (Get-ModuleNameByLane -Lane $Lane))
}

function Get-StatusColor {
  param([string]$Status)
  switch ($Status) {
    "done" { return "Green" }
    "running" { return "Cyan" }
    "waiting_ack" { return "Yellow" }
    "queued" { return "Gray" }
    "retrying" { return "Magenta" }
    "failed" { return "Red" }
    "escalated" { return "Red" }
    default { return "White" }
  }
}

function Get-ModuleStrengthScore {
  param([array]$Tasks)

  $total = @($Tasks).Count
  if ($total -le 0) {
    return [PSCustomObject]@{ Score = 0; Grade = "Unknown"; WorldClass = $false }
  }

  $done = @($Tasks | Where-Object { $_.status -eq "done" }).Count
  $waitingAck = @($Tasks | Where-Object { $_.status -eq "waiting_ack" }).Count
  $retrying = @($Tasks | Where-Object { $_.status -eq "retrying" }).Count
  $failedOrEsc = @($Tasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" }).Count

  $completionScore = 100 * ($done / $total)
  $penalty = ($waitingAck * 6) + ($retrying * 8) + ($failedOrEsc * 18)
  $score = [int][math]::Round([math]::Max(0, [math]::Min(100, ($completionScore - $penalty))))

  $grade = if ($score -ge 90) {
    "World-Class"
  } elseif ($score -ge 75) {
    "Strong"
  } elseif ($score -ge 50) {
    "Stable"
  } else {
    "Needs Attention"
  }

  return [PSCustomObject]@{
    Score = $score
    Grade = $grade
    WorldClass = ($score -ge 90)
  }
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
  $pendingStatuses = @("queued","running","waiting_ack","retrying","failed","escalated")
  $pendingTasks = @($tasks | Where-Object { $pendingStatuses -contains $_.status })
  $completedTasks = @($tasks | Where-Object { $_.status -eq "done" })

  $statuses = $tasks | Group-Object status | Sort-Object Name
  foreach ($g in $statuses) {
    $color = Get-StatusColor -Status $g.Name
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

  $featureRows = @($tasks | ForEach-Object {
    [PSCustomObject]@{
      Feature = Get-FeatureName -Title $_.title -Lane $_.lane
      Status = $_.status
      TaskId = $_.taskId
      Agent = $_.agent
      Lane = $_.lane
      Title = $_.title
    }
  })

  $featureGroups = @($featureRows | Group-Object Feature | Sort-Object Name)
  $pendingFeatures = @()
  $completedFeatures = @()
  foreach ($fg in $featureGroups) {
    $fTasks = @($fg.Group)
    $fDone = @($fTasks | Where-Object { $_.Status -eq "done" }).Count
    $fTotal = $fTasks.Count
    $fPending = $fTotal - $fDone
    $row = [PSCustomObject]@{
      Feature = $fg.Name
      Done = $fDone
      Pending = $fPending
      Total = $fTotal
    }
    if ($fPending -gt 0) {
      $pendingFeatures += $row
    } else {
      $completedFeatures += $row
    }
  }

  $moduleGroups = @($tasks | Group-Object lane | Sort-Object Name)
  $moduleHealthRows = @()
  foreach ($mg in $moduleGroups) {
    $mTasks = @($mg.Group)
    $totalM = $mTasks.Count
    $doneM = @($mTasks | Where-Object { $_.status -eq "done" }).Count
    $pendingM = $totalM - $doneM
    $waitingAckM = @($mTasks | Where-Object { $_.status -eq "waiting_ack" }).Count
    $blockedM = @($mTasks | Where-Object { $_.status -eq "failed" -or $_.status -eq "escalated" }).Count
    $retryingM = @($mTasks | Where-Object { $_.status -eq "retrying" }).Count
    $strength = Get-ModuleStrengthScore -Tasks $mTasks
    $attentionScore = [int]($pendingM * 10 + $blockedM * 25 + $waitingAckM * 8 + $retryingM * 10 + (100 - $strength.Score))

    $moduleHealthRows += [PSCustomObject]@{
      Lane = $mg.Name
      Module = Get-ModuleNameByLane -Lane $mg.Name
      Total = $totalM
      Done = $doneM
      Pending = $pendingM
      WaitingAck = $waitingAckM
      Blocked = $blockedM
      Retrying = $retryingM
      Strength = $strength.Score
      Grade = $strength.Grade
      WorldClass = if ($strength.WorldClass) { "YES" } else { "NO" }
      AttentionScore = $attentionScore
    }
  }
  $topAttention = @($moduleHealthRows | Sort-Object AttentionScore -Descending | Select-Object -First 3)

  # ── 3. Per-agent status table ──────────────────────────────────────────────
  Write-Header "PER-AGENT STATUS"
  $agents = $tasks | Group-Object agent | Sort-Object Name
  Write-Host ("  " + "Agent".PadRight(14) + "Lane  " + "Status".PadRight(14) + "Task") -ForegroundColor White
  Write-Host ("  " + ("-" * 70)) -ForegroundColor DarkGray
  foreach ($ag in $agents) {
    foreach ($t in $ag.Group) {
      $statusColor = Get-StatusColor -Status $t.status
      $agStr  = ($t.agent).PadRight(14)
      $lnStr  = ($t.lane).PadRight(6)
      $stStr  = ($t.status).PadRight(14)
      $ttStr  = if ($t.title.Length -gt 38) { $t.title.Substring(0,35) + "..." } else { $t.title }
      Write-Host ("  " + $agStr + $lnStr + $stStr + $ttStr) -ForegroundColor $statusColor
    }
  }

  # ── 4. Pending tasks ──────────────────────────────────────────────────────
  Write-Header "PENDING TASKS"
  if ($pendingTasks.Count -eq 0) {
    Write-Host "  [NONE] No pending tasks." -ForegroundColor Green
  } else {
    Write-Host ("  Pending total: {0}" -f $pendingTasks.Count) -ForegroundColor Yellow
    foreach ($t in ($pendingTasks | Sort-Object lane, taskId | Select-Object -First 20)) {
      $color = Get-StatusColor -Status $t.status
      Write-Host ("  [{0}] {1} {2} -- {3}" -f $t.status.ToUpper(), $t.taskId, $t.agent, $t.title) -ForegroundColor $color
    }
    if ($pendingTasks.Count -gt 20) {
      Write-Host ("  ... and {0} more pending task(s)." -f ($pendingTasks.Count - 20)) -ForegroundColor DarkGray
    }
  }

  # ── 5. Completed tasks ────────────────────────────────────────────────────
  Write-Header "COMPLETED TASKS"
  Write-Host ("  Completed total: {0}" -f $completedTasks.Count) -ForegroundColor Green
  if ($completedTasks.Count -gt 0) {
    foreach ($t in ($completedTasks | Sort-Object taskId -Descending | Select-Object -First 15)) {
      Write-Host ("  [DONE] {0} {1} -- {2}" -f $t.taskId, $t.agent, $t.title) -ForegroundColor Green
    }
    if ($completedTasks.Count -gt 15) {
      Write-Host ("  ... and {0} more completed task(s)." -f ($completedTasks.Count - 15)) -ForegroundColor DarkGray
    }
  }

  # ── 6. Pending features ───────────────────────────────────────────────────
  Write-Header "PENDING FEATURES"
  if ($pendingFeatures.Count -eq 0) {
    Write-Host "  [NONE] All tracked features are complete." -ForegroundColor Green
  } else {
    foreach ($f in ($pendingFeatures | Sort-Object -Property @{Expression='Pending';Descending=$true}, @{Expression='Feature';Descending=$false})) {
      Write-Host ("  [PENDING] {0}  (done={1}, pending={2}, total={3})" -f $f.Feature, $f.Done, $f.Pending, $f.Total) -ForegroundColor Yellow
    }
  }

  # ── 7. Completed features ─────────────────────────────────────────────────
  Write-Header "COMPLETED FEATURES"
  if ($completedFeatures.Count -eq 0) {
    Write-Host "  [NONE YET] No completed feature groups yet." -ForegroundColor DarkGray
  } else {
    foreach ($f in ($completedFeatures | Sort-Object Feature)) {
      Write-Host ("  [DONE] {0}  (total tasks={1})" -f $f.Feature, $f.Total) -ForegroundColor Green
    }
  }

  # ── 8. Module health & strength ──────────────────────────────────────────
  Write-Header "MODULE HEALTH & STRENGTH"
  foreach ($m in $moduleHealthRows) {
    $moduleColor = if ($m.Grade -eq "World-Class") { "Green" } elseif ($m.Grade -eq "Strong") { "Cyan" } elseif ($m.Grade -eq "Stable") { "Yellow" } else { "Red" }
    Write-Host ("  Lane {0} ({1})" -f $m.Lane, $m.Module) -ForegroundColor White
    Write-Host ("    Progress : {0}/{1} done | pending={2} waiting_ack={3} blocked={4} retrying={5}" -f $m.Done, $m.Total, $m.Pending, $m.WaitingAck, $m.Blocked, $m.Retrying) -ForegroundColor DarkGray
    Write-Host ("    Strength : {0}/100 | Grade: {1} | World-Class: {2}" -f $m.Strength, $m.Grade, $m.WorldClass) -ForegroundColor $moduleColor
  }

  # ── 9. Aegis smart decision engine ───────────────────────────────────────
  Write-Header "AEGIS SMART DECISION ENGINE" "Magenta"
  if ($topAttention.Count -eq 0) {
    Write-Host "  No modules found for decisioning." -ForegroundColor DarkGray
  } else {
    $topTarget = $topAttention | Select-Object -First 1
    foreach ($r in $topAttention) {
      $decisionColor = if ($r.Pending -gt 0 -or $r.Blocked -gt 0 -or $r.WaitingAck -gt 0) { "Yellow" } else { "Green" }
      Write-Host ("  [ATTN {0}] Lane {1} ({2}) -> score={3}, pending={4}, blocked={5}, waiting_ack={6}, strength={7}" -f $(if ($r.Lane -eq $topTarget.Lane) { "TOP" } else { "NEXT" }), $r.Lane, $r.Module, $r.AttentionScore, $r.Pending, $r.Blocked, $r.WaitingAck, $r.Strength) -ForegroundColor $decisionColor
    }

    $targetPendingTask = @($tasks | Where-Object { $_.lane -eq $topTarget.Lane -and $pendingStatuses -contains $_.status } | Sort-Object taskId | Select-Object -First 1)
    if ($targetPendingTask.Count -gt 0) {
      $tp = $targetPendingTask[0]
      Write-Host ""
      Write-Host ("  Aegis recommended focus: Lane {0} ({1})" -f $topTarget.Lane, $topTarget.Module) -ForegroundColor Magenta
      Write-Host ("  Next best task to research/upgrade: {0} {1} -- {2}" -f $tp.taskId, $tp.agent, $tp.title) -ForegroundColor Magenta
      Write-Host ("  Suggested run: npm run orchestrator:agent-loop -- -Agent {0} -NoBrowser -Once" -f $tp.agent) -ForegroundColor DarkGray
      Write-Host "  Continuous mode: npm run autopilot" -ForegroundColor DarkGray
    } else {
      Write-Host ""
      Write-Host "  All modules currently complete or no pending lane-specific tasks." -ForegroundColor Green
      Write-Host "  Aegis can trigger a fresh cycle automatically when queue completion is detected in autopilot." -ForegroundColor DarkGray
    }
  }

  # ── 10. Waiting ACK ────────────────────────────────────────────────────────
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

  # ── 11. Watchdog last run ─────────────────────────────────────────────────
  if (Test-Path $wdLog) {
    $lastLines = Get-Content $wdLog -Tail 4
    Write-Header "WATCHDOG SCHEDULER (last 4 log lines)" "DarkGray"
    foreach ($l in $lastLines) {
      Write-Host "  $l" -ForegroundColor DarkGray
    }
  }

  # ── 12. Progress bar ──────────────────────────────────────────────────────
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
