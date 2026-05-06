# morning-kickoff.ps1 -- Compact all-agents brief for start of day
# Shows every agent: next task ID, status, lane, and one-line title
# Use: npm run orchestrator:morning  (or just run directly)
param(
  [string]$WorkspaceRoot = ".",
  [switch]$Verbose,       # show full prompt for each agent
  [switch]$BlockedOnly,   # only show agents that are blocked or idle
  [switch]$ReadyOnly      # only show agents with a queued task ready
)

$stateDir   = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile  = Join-Path $stateDir "task-queue.json"
$promptFile = Join-Path $WorkspaceRoot "scripts\orchestrator\prompts.json"

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue not found. Run: npm run orchestrator:queue:init" -ForegroundColor Red
  exit 1
}

$queue = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($queue.tasks)

function Test-DepsDone {
  param([array]$deps, $allTasks)
  foreach ($d in $deps) {
    $dep = $allTasks | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
}

$agents = @(
  "@Sofia", "@Timnit", "@Victoria", "@Annie", "@Marissa", "@Rachel", "@Joelle",
  "@Fei-Fei", "@Anima", "@Mary", "@Invoice",
  "@Booking", "@Maya", "@Hedy", "@Cassie",
  "@Jaime", "@Corinne"
)

$laneLabel = @{
  "A" = "A: Compliance/Legal/UX/AI"
  "B" = "B: Valuation/Market/Finance"
  "C" = "C: Schedule/Off-plan/Analytics"
  "D" = "D: Offers/WhatsApp/AI-Chat"
}

$statusIcon = @{
  "queued"      = "[READY]  "
  "running"     = "[RUNNING]"
  "waiting_ack" = "[ACK    ]"
  "done"        = "[DONE   ]"
  "retrying"    = "[RETRY  ]"
  "failed"      = "[FAILED ]"
  "escalated"   = "[ESCALAT]"
  "blocked"     = "[BLOCKED]"
  "all_done"    = "[ALL-DON]"
}

$colorMap = @{
  "queued"      = "Green"
  "running"     = "Cyan"
  "waiting_ack" = "Yellow"
  "done"        = "DarkGray"
  "retrying"    = "DarkYellow"
  "failed"      = "Red"
  "escalated"   = "Magenta"
  "blocked"     = "Magenta"
  "all_done"    = "DarkGreen"
}

$today = (Get-Date).ToString("ddd MMM dd yyyy")
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  WHITE CAVES ORCHESTRATOR -- MORNING KICKOFF  $today" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$overallDone    = ($tasks | Where-Object { $_.status -eq "done"    }).Count
$overallRunning = ($tasks | Where-Object { $_.status -eq "running" }).Count
$overallTotal   = $tasks.Count
$pct = [math]::Round(($overallDone / $overallTotal) * 100)
$bar = "[" + ("=" * [math]::Round($pct/5)) + (" " * (20 - [math]::Round($pct/5))) + "]"
Write-Host ""
Write-Host ("  Overall: {0,2} done / {1} total  {2}  {3,3}%" -f $overallDone, $overallTotal, $bar, $pct) -ForegroundColor White
Write-Host ""

$prevLane = ""
$readyCount = 0
$blockedCount = 0
$doneAgents = 0

foreach ($agent in $agents) {
  $agentTasks = $tasks | Where-Object { $_.agent -eq $agent }
  $done      = @($agentTasks | Where-Object { $_.status -eq "done" })
  $running   = @($agentTasks | Where-Object { $_.status -eq "running" })
  $waiting   = @($agentTasks | Where-Object { $_.status -eq "waiting_ack" })
  $allDone   = ($done.Count -eq $agentTasks.Count)

  $nextReady = $agentTasks |
    Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" } |
    Sort-Object createdAt |
    Where-Object { Test-DepsDone -deps @($_.dependsOn) -allTasks $tasks } |
    Select-Object -First 1

  $blockedQ = @($agentTasks |
    Where-Object { $_.status -eq "queued" -or $_.status -eq "retrying" } |
    Where-Object { -not (Test-DepsDone -deps @($_.dependsOn) -allTasks $tasks) })

  # determine display state
  if ($running.Count -gt 0) {
    $state   = "running"
    $task    = $running[0]
    $display = $task.taskId + "  " + $task.title
  } elseif ($waiting.Count -gt 0) {
    $state   = "waiting_ack"
    $task    = $waiting[0]
    $display = $task.taskId + "  (waiting FEEDS_ACK from " + $task.feedsAckBy + ")"
  } elseif ($null -ne $nextReady) {
    $state   = "queued"
    $display = $nextReady.taskId + "  " + $nextReady.title
    $readyCount++
  } elseif ($allDone) {
    $state   = "all_done"
    $display = "All $($done.Count)/3 tasks complete -- notify @Margaret for REVIEW"
    $doneAgents++
  } elseif ($blockedQ.Count -gt 0) {
    $state   = "blocked"
    $depStr  = ($blockedQ[0].dependsOn | Where-Object {
      $depId = $_
      $d = $tasks | Where-Object { $_.taskId -eq $depId } | Select-Object -First 1
      $null -ne $d -and $d.status -ne "done"
    }) -join ", "
    $display = $blockedQ[0].taskId + "  blocked on: " + $depStr
    $blockedCount++
  } else {
    $state   = "done"
    $display = "$($done.Count)/3 done"
  }

  # skip if filter flags set
  if ($BlockedOnly -and $state -ne "blocked") { continue }
  if ($ReadyOnly   -and $state -ne "queued")  { continue }

  # lane header
  $lane = if ($agentTasks.Count -gt 0) { $agentTasks[0].lane } else { "?" }
  if ($lane -ne $prevLane) {
    Write-Host ""
    Write-Host ("  -- Lane {0} {1} --" -f $lane, $laneLabel[$lane]) -ForegroundColor DarkCyan
    $prevLane = $lane
  }

  $icon  = if ($statusIcon.ContainsKey($state))  { $statusIcon[$state]  } else { "[?      ]" }
  $color = if ($colorMap.ContainsKey($state))     { $colorMap[$state]    } else { "White" }
  $prog  = "{0}/{1}" -f $done.Count, $agentTasks.Count

  $line  = ("  {0} {1,-12} ({2})  {3}" -f $icon, $agent, $prog, $display)
  Write-Host $line -ForegroundColor $color
}

Write-Host ""
Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("  Ready: {0}  |  Blocked: {1}  |  All-Done: {2}  |  Running: {3}" -f $readyCount, $blockedCount, $doneAgents, $overallRunning) -ForegroundColor White
Write-Host ""
Write-Host "  Quick commands:" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:next-task     -- -AgentName `"@AgentName`"" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:bg:start       (start background workers)" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:dashboard:watch (live terminal dashboard)" -ForegroundColor DarkGray
Write-Host ""