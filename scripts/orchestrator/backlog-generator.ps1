# backlog-generator.ps1 -- Generates WAVE_0N_IMPLEMENTATION_BACKLOG.md
# Reads task-queue.json, groups by lane, outputs prioritised backlog table with story points.
param(
  [string]$WorkspaceRoot = ".",
  [int]$WaveNumber = 1
)

$queueFile = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$wavesDir  = Join-Path $WorkspaceRoot "plans\waves"
$today     = (Get-Date).ToString("yyyy-MM-dd")
$waveLabel = "WAVE_$('{0:D2}' -f $WaveNumber)"
$outFile   = Join-Path $wavesDir "$waveLabel`_IMPLEMENTATION_BACKLOG.md"

if (-not (Test-Path $wavesDir)) { New-Item $wavesDir -ItemType Directory -Force | Out-Null }
if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue file not found: $queueFile" -ForegroundColor Red; exit 1
}

$q     = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($q.tasks | Sort-Object taskId)

# Story point rules: root task (T001, T008 etc) = 5 pts; b/c subtasks = 3 pts
function Get-StoryPoints([string]$taskId) {
  if ($taskId -match "b$|c$") { return 3 }
  return 5
}

# Check if all upstream deps are done
function Is-Ready([object]$task, [object[]]$allTasks) {
  if ($null -eq $task.deps -or $task.deps.Count -eq 0) { return $true }
  foreach ($dep in $task.deps) {
    $depTask = $allTasks | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
    if ($null -eq $depTask) { return $true }
    if ($depTask.status -ne "done") { return $false }
  }
  return $true
}

$laneNames = @{
  A = "Compliance / Legal / UX / AI"
  B = "Valuation / Market / Finance"
  C = "Schedule / Off-plan / Analytics"
  D = "Offers / WhatsApp / AI-Chat"
}

$out = New-Object System.Text.StringBuilder
function Add([string]$line) { [void]$out.AppendLine($line) }

# --- Header ---
Add "# $waveLabel -- Implementation Backlog"
Add ""
Add "> **Generated:** $today  |  Total tasks: $($tasks.Count)  |  Version: $($q.version)"
Add "> Story points: root task = 5 pts, subtask (b/c) = 3 pts"
Add "> Ready = all upstream deps are 'done'. Blocked = at least one dep not done."
Add ""

# --- Summary Table ---
$totalSP   = 0
$readySP   = 0
$doneSP    = 0
$blockedSP = 0

foreach ($t in $tasks) {
  $sp = Get-StoryPoints $t.taskId
  $totalSP += $sp
  if ($t.status -eq "done") { $doneSP += $sp }
  elseif (Is-Ready $t $tasks) { $readySP += $sp }
  else { $blockedSP += $sp }
}

$pctDone = if ($totalSP -gt 0) { [int](($doneSP / $totalSP) * 100) } else { 0 }
$readyCount  = @($tasks | Where-Object { $_.status -ne "done" -and (Is-Ready $_ $tasks) }).Count
$doneCount   = @($tasks | Where-Object { $_.status -eq "done" }).Count
$blockedCount = $tasks.Count - $readyCount - $doneCount

Add "## Summary"
Add ""
Add "| Metric | Value |"
Add "|--------|-------|"
Add "| Total Tasks | $($tasks.Count) |"
Add "| Total Story Points | $totalSP |"
Add "| Done | $doneCount tasks ($doneSP SP) |"
Add "| Ready to Start | $readyCount tasks ($readySP SP) |"
Add "| Blocked | $blockedCount tasks ($blockedSP SP) |"
Add "| Overall Progress | $pctDone% |"
Add ""

# Progress bar
$barLen = 30
$filled = [int](($pctDone / 100) * $barLen)
$bar = ("[" + ("=" * $filled) + ("-" * ($barLen - $filled)) + "]")
Add "**Progress:** $bar $pctDone%"
Add ""
Add "---"
Add ""

# --- Ready to Code Section ---
Add "## Ready to Start (No Blockers)"
Add ""
$readyTasks = @($tasks | Where-Object { $_.status -ne "done" -and (Is-Ready $_ $tasks) } | Sort-Object lane, taskId)
if ($readyTasks.Count -gt 0) {
  Add "| Priority | Task ID | Agent | Lane | Title | SP | Status |"
  Add "|----------|---------|-------|------|-------|----|--------|"
  $p = 1
  foreach ($t in $readyTasks) {
    $sp = Get-StoryPoints $t.taskId
    Add "| $p | $($t.taskId) | $($t.agent) | $($t.lane) | $($t.title) | $sp | $($t.status) |"
    $p++
  }
} else {
  Add "> No tasks currently ready. Complete blocked tasks upstream to unlock."
}
Add ""
Add "---"
Add ""

# --- Per-Lane Tables ---
foreach ($lane in @("A","B","C","D")) {
  $laneTasks = @($tasks | Where-Object { $_.lane -eq $lane } | Sort-Object taskId)
  if ($laneTasks.Count -eq 0) { continue }

  $laneSP   = ($laneTasks | ForEach-Object { Get-StoryPoints $_.taskId } | Measure-Object -Sum).Sum
  $laneDone = @($laneTasks | Where-Object { $_.status -eq "done" }).Count
  $lanePct  = if ($laneTasks.Count -gt 0) { [int](($laneDone / $laneTasks.Count) * 100) } else { 0 }

  Add "## Lane $lane -- $($laneNames[$lane])"
  Add ""
  Add "> Tasks: $($laneTasks.Count)  |  Story Points: $laneSP  |  Done: $laneDone/$($laneTasks.Count) ($lanePct%)"
  Add ""
  Add "| Task ID | Agent | Title | SP | Status | Blocker | Deps |"
  Add "|---------|-------|-------|----|--------|---------|------|"

  foreach ($t in $laneTasks) {
    $sp      = Get-StoryPoints $t.taskId
    $isReady = Is-Ready $t $tasks
    $blocker = if ($t.status -eq "done") { "none" }
               elseif ($isReady) { "--" }
               else { "upstream deps: " + ($t.deps -join ", ") }
    $deps    = if ($null -eq $t.deps -or $t.deps.Count -eq 0) { "none" } else { $t.deps -join ", " }
    Add "| $($t.taskId) | $($t.agent) | $($t.title) | $sp | $($t.status) | $blocker | $deps |"
  }
  Add ""
}

Add "---"
Add ""

# --- Sprint Scheduling Recommendations ---
Add "## Sprint Scheduling -- Recommended 5-Day Wave"
Add ""
Add "> Rule 22: Default premium batch = 3-5 modules per day. Planned across 5 days below."
Add ""

$dayMap = @{
  "Day 1" = @("@Sofia","@Timnit","@Victoria")
  "Day 2" = @("@Annie","@Marissa","@Rachel","@Joelle")
  "Day 3" = @("@Fei-Fei","@Anima","@Mary","@Invoice")
  "Day 4" = @("@Booking","@Maya","@Hedy","@Cassie")
  "Day 5" = @("@Jaime","@Corinne")
}

Add "| Day | Agents | Modules | Story Points | Gate |"
Add "|-----|--------|---------|--------------|------|"
foreach ($day in @("Day 1","Day 2","Day 3","Day 4","Day 5")) {
  $agents = $dayMap[$day]
  $agStr  = $agents -join ", "
  $dayTasks = @($tasks | Where-Object { $agents -contains $_.agent -and -not ($_.taskId -match "b$|c$") })
  $sp2    = ($dayTasks | ForEach-Object { Get-StoryPoints $_.taskId } | Measure-Object -Sum).Sum
  Add "| $day | $agStr | $($dayTasks.Count) modules | $sp2 SP | @Ada sign-off required |"
}

Add ""
Add "---"
Add ""

# --- Definition of Done ---
Add "## Definition of Done (Per Task)"
Add ""
Add "A task is DONE when ALL of the following are true:"
Add ""
Add "- [ ] Business doc section for this module has reached target depth (gate-check PASS)"
Add "- [ ] All 10 SDD evidence layers populated in WAVE_01_SDD.md"
Add "- [ ] Unit tests written and passing (>= 90% coverage)"
Add "- [ ] Integration tests written and passing (>= 80% coverage)"
Add "- [ ] E2E tests written and passing (critical paths)"
Add "- [ ] FEEDS_ACK received from downstream agent"
Add "- [ ] PR reviewed and approved by @Katherine (QA)"
Add "- [ ] No TypeScript errors (tsc --noEmit passes)"
Add "- [ ] No ESLint errors (npm run lint passes)"
Add "- [ ] Committed with [premium-wave] tag if premium coding involved"
Add ""
Add "---"
Add ""
Add "*Auto-generated by backlog-generator.ps1 on $today*"

$content = $out.ToString()
[System.IO.File]::WriteAllText($outFile, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[WRITTEN] $outFile  ($($content.Split("`n").Count) lines)" -ForegroundColor Green
