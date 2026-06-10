param(
  [string]$WorkspaceRoot = ".",
  [string]$OutputFile = "",
  [switch]$Brief,
  [switch]$JsonOnly
)

$root = Resolve-Path $WorkspaceRoot
$stateDir = Join-Path $root "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$cycleFile = Join-Path $stateDir "cycle-log.json"
$policyFile = Join-Path $root "scripts\orchestrator\policy.json"
$historyFile = Join-Path $stateDir "progress-intelligence-history.json"

if ([string]::IsNullOrWhiteSpace($OutputFile)) {
  $OutputFile = Join-Path $stateDir "progress-intelligence.json"
}

function Read-JsonShared {
  param([string]$Path)

  if (-not (Test-Path $Path)) { return $null }
  try {
    $raw = Get-Content $Path -Raw -ErrorAction Stop
    if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
    return ($raw | ConvertFrom-Json)
  } catch {
    return $null
  }
}

function Convert-ToDateSafe {
  param([object]$Value)

  if ([string]::IsNullOrWhiteSpace([string]$Value)) { return $null }
  try {
    return [datetime]::Parse([string]$Value)
  } catch {
    return $null
  }
}

function Test-TitleMatch {
  param(
    [string]$Title,
    [string[]]$Patterns
  )

  if ([string]::IsNullOrWhiteSpace($Title)) { return $false }
  $t = $Title.ToLower()
  foreach ($p in $Patterns) {
    if ($t -match $p) { return $true }
  }
  return $false
}

$now = Get-Date
$policy = Read-JsonShared -Path $policyFile
$targetBoostPct = 30
if ($null -ne $policy -and $null -ne $policy.aegis -and $null -ne $policy.aegis.targetProjectBoostPct) {
  $parsedBoost = 0
  if ([int]::TryParse([string]$policy.aegis.targetProjectBoostPct, [ref]$parsedBoost) -and $parsedBoost -ge 1 -and $parsedBoost -le 100) {
    $targetBoostPct = $parsedBoost
  }
}

$queue = Read-JsonShared -Path $queueFile
$tasks = @()
if ($null -ne $queue -and $null -ne $queue.tasks) {
  $tasks = @($queue.tasks)
}

$totalTasks = $tasks.Count
$doneTasks = @($tasks | Where-Object { $_.status -eq "done" })
$doneCount = $doneTasks.Count
$currentPct = if ($totalTasks -gt 0) { [math]::Round((100.0 * $doneCount / $totalTasks), 1) } else { 0 }

$doneWithTime = @()
foreach ($t in $doneTasks) {
  $finished = Convert-ToDateSafe -Value $t.finishedAt
  if ($null -ne $finished) {
    $doneWithTime += [PSCustomObject]@{ Task = $t; FinishedAt = $finished }
  }
}

$window24 = $now.AddHours(-24)
$window7d = $now.AddDays(-7)
$window30d = $now.AddDays(-30)

$done24 = @($doneWithTime | Where-Object { $_.FinishedAt -ge $window24 })
$done7d = @($doneWithTime | Where-Object { $_.FinishedAt -ge $window7d })
$done30d = @($doneWithTime | Where-Object { $_.FinishedAt -ge $window30d })

$fixPatterns = @("fix", "bug", "error", "resolve", "patch", "regression")
$upgradePatterns = @("upgrade", "improve", "enhance", "optimiz", "harden", "refactor")
$developPatterns = @("implement", "build", "create", "feature", "add", "develop")

function Get-CategoryCounts {
  param([array]$DoneRows)

  $developed = 0
  $fixed = 0
  $upgraded = 0

  foreach ($row in $DoneRows) {
    $title = [string]$row.Task.title
    $isFixed = Test-TitleMatch -Title $title -Patterns $fixPatterns
    $isUpgraded = Test-TitleMatch -Title $title -Patterns $upgradePatterns
    $isDeveloped = Test-TitleMatch -Title $title -Patterns $developPatterns

    if ($isFixed) { $fixed++ }
    if ($isUpgraded) { $upgraded++ }
    if ($isDeveloped -or (-not $isFixed -and -not $isUpgraded)) { $developed++ }
  }

  return [PSCustomObject]@{
    developed = $developed
    fixed = $fixed
    upgraded = $upgraded
  }
}

$dailyCategories = Get-CategoryCounts -DoneRows $done24
$monthlyCategories = Get-CategoryCounts -DoneRows $done30d

$velocityPerHour24 = if ($done24.Count -gt 0) { [double]$done24.Count / 24.0 } else { 0.0 }
$velocityPerHour7d = if ($done7d.Count -gt 0) { [double]$done7d.Count / (7.0 * 24.0) } else { 0.0 }
$velocityPerHour30d = if ($done30d.Count -gt 0) { [double]$done30d.Count / (30.0 * 24.0) } else { 0.0 }
$velocityPerHour = [math]::Max([math]::Max($velocityPerHour24, $velocityPerHour7d), $velocityPerHour30d)
$velocityPerDay = [math]::Round($velocityPerHour * 24.0, 2)

$targetPct = [math]::Min(100, ($currentPct + $targetBoostPct))
$remainingPctToTarget = [math]::Max(0, ($targetPct - $currentPct))
$tasksNeededForTarget = if ($totalTasks -gt 0) { [int][math]::Ceiling(($remainingPctToTarget / 100.0) * $totalTasks) } else { 0 }
$etaHours = $null
if ($tasksNeededForTarget -eq 0) {
  $etaHours = 0
} elseif ($velocityPerHour -gt 0) {
  $etaHours = [math]::Round(([double]$tasksNeededForTarget / $velocityPerHour), 1)
}

$history = @()
$historyRaw = Read-JsonShared -Path $historyFile
if ($null -ne $historyRaw) {
  if ($historyRaw -is [array]) { $history = @($historyRaw) } else { $history = @($historyRaw) }
}

$confidenceBandsHours = $null
if ($null -ne $etaHours) {
  if ([double]$etaHours -eq 0) {
    $confidenceBandsHours = [ordered]@{
      optimistic = 0
      expected = 0
      conservative = 0
    }
  } else {
    $confidenceBandsHours = [ordered]@{
      optimistic = [math]::Round(([double]$etaHours * 0.8), 1)
      expected = [math]::Round([double]$etaHours, 1)
      conservative = [math]::Round(([double]$etaHours * 1.25), 1)
    }
  }
}

$laneForecast = @()
$laneGroups = @($tasks | Group-Object lane | Sort-Object Name)
foreach ($laneGroup in $laneGroups) {
  $lane = [string]$laneGroup.Name
  $laneTasks = @($laneGroup.Group)
  $laneTotal = $laneTasks.Count
  if ($laneTotal -le 0) { continue }

  $laneDoneTasks = @($laneTasks | Where-Object { $_.status -eq "done" })
  $laneDoneCount = $laneDoneTasks.Count
  $laneCurrentPct = [math]::Round((100.0 * $laneDoneCount / $laneTotal), 1)
  $laneTargetPct = [math]::Min(100, ($laneCurrentPct + $targetBoostPct))
  $laneRemainingPct = [math]::Max(0, ($laneTargetPct - $laneCurrentPct))
  $laneTasksNeeded = [int][math]::Ceiling(($laneRemainingPct / 100.0) * $laneTotal)

  $laneDone7d = 0
  foreach ($row in $done7d) {
    $rowLane = [string]$row.Task.lane
    if ($rowLane -eq $lane) { $laneDone7d++ }
  }
  $laneVelocityPerDay = if ($laneDone7d -gt 0) { [math]::Round(($laneDone7d / 7.0), 2) } else { 0 }

  $laneEtaHours = $null
  if ($laneTasksNeeded -eq 0) {
    $laneEtaHours = 0
  } elseif ($laneVelocityPerDay -gt 0) {
    $laneEtaHours = [math]::Round((24.0 * $laneTasksNeeded / $laneVelocityPerDay), 1)
  }

  $laneConfidence = "low"
  if ($laneDone7d -ge 6) {
    $laneConfidence = "high"
  } elseif ($laneDone7d -ge 3) {
    $laneConfidence = "medium"
  }

  $laneForecast += [PSCustomObject]@{
    lane = $lane
    totalTasks = $laneTotal
    doneTasks = $laneDoneCount
    completionPct = $laneCurrentPct
    targetCompletionPct = [math]::Round($laneTargetPct, 1)
    tasksNeededForTarget = $laneTasksNeeded
    velocityPerDay = $laneVelocityPerDay
    etaHours = $laneEtaHours
    confidence = $laneConfidence
  }
}

$cycleLog = Read-JsonShared -Path $cycleFile
$cycles = @()
if ($null -ne $cycleLog) {
  if ($cycleLog -is [array]) { $cycles = @($cycleLog) } else { $cycles = @($cycleLog) }
}

$cycle30 = @()
foreach ($c in $cycles) {
  $d = Convert-ToDateSafe -Value $c.date
  if ($null -ne $d -and $d -ge $window30d) {
    $cycle30 += [PSCustomObject]@{ Date = $d; ErrorScanPassed = [bool]$c.errorScanPassed }
  }
}

$scanPassRate30d = 0
if ($cycle30.Count -gt 0) {
  $scanPassCount = @($cycle30 | Where-Object { $_.ErrorScanPassed }).Count
  $scanPassRate30d = [math]::Round((100.0 * $scanPassCount / $cycle30.Count), 1)
}

$confidence = "low"
if ($done24.Count -ge 6 -and $cycle30.Count -ge 20) {
  $confidence = "high"
} elseif ($done7d.Count -ge 10 -or $cycle30.Count -ge 8) {
  $confidence = "medium"
}

$historyEntry = [PSCustomObject]@{
  generatedAt = $now.ToString("o")
  completionPct = $currentPct
  etaHours = $etaHours
  velocityPerDay = $velocityPerDay
  completedLast24h = $done24.Count
}
$history += $historyEntry
if ($history.Count -gt 250) {
  $history = @($history | Select-Object -Last 250)
}

$etaHistory = @($history | Where-Object { $null -ne $_.etaHours } | Select-Object -Last 6)
$worseningStreak = 0
$etaDeltaVsPrev = $null
if ($etaHistory.Count -ge 2) {
  $latestEta = [double]$etaHistory[-1].etaHours
  $prevEta = [double]$etaHistory[-2].etaHours
  $etaDeltaVsPrev = [math]::Round(($latestEta - $prevEta), 1)

  for ($i = $etaHistory.Count - 1; $i -ge 1; $i--) {
    $curr = [double]$etaHistory[$i].etaHours
    $prev = [double]$etaHistory[$i - 1].etaHours
    if ($curr -gt $prev) {
      $worseningStreak++
    } else {
      break
    }
  }
}

$driftThreshold = 2
if ($null -ne $policy -and $null -ne $policy.aegis -and $null -ne $policy.aegis.progressDriftConsecutiveThreshold) {
  $parsedDriftThreshold = 0
  if ([int]::TryParse([string]$policy.aegis.progressDriftConsecutiveThreshold, [ref]$parsedDriftThreshold) -and $parsedDriftThreshold -ge 1 -and $parsedDriftThreshold -le 10) {
    $driftThreshold = $parsedDriftThreshold
  }
}

$blockerWarnHours = 4
if ($null -ne $policy -and $null -ne $policy.aegis -and $null -ne $policy.aegis.blockerAgingWarnHours) {
  $parsedBlockerWarn = 0
  if ([int]::TryParse([string]$policy.aegis.blockerAgingWarnHours, [ref]$parsedBlockerWarn) -and $parsedBlockerWarn -ge 1 -and $parsedBlockerWarn -le 72) {
    $blockerWarnHours = $parsedBlockerWarn
  }
}

$driftAlert = ($worseningStreak -ge $driftThreshold)
$driftState = if ($driftAlert) { "worsening" } elseif ($null -ne $etaDeltaVsPrev -and $etaDeltaVsPrev -lt 0) { "improving" } else { "stable" }

$blockerCandidates = @($tasks | Where-Object { $_.status -in @("waiting_ack", "evidence_pending", "failed", "escalated") })
$staleBlockers = @()
foreach ($b in $blockerCandidates) {
  $age = Get-TaskAgeHours -Task $b
  if ($null -eq $age) { continue }
  if ($age -ge $blockerWarnHours) {
    $staleBlockers += [PSCustomObject]@{
      taskId = [string]$b.taskId
      lane = [string]$b.lane
      status = [string]$b.status
      ageHours = $age
    }
  }
}

$laneBlockerSummary = @()
foreach ($laneGroup in ($blockerCandidates | Group-Object lane | Sort-Object Name)) {
  $lane = [string]$laneGroup.Name
  $rows = @()
  foreach ($b in @($laneGroup.Group)) {
    $age = Get-TaskAgeHours -Task $b
    if ($null -ne $age) {
      $rows += [PSCustomObject]@{ ageHours = $age }
    }
  }
  if ($rows.Count -eq 0) { continue }
  $laneBlockerSummary += [PSCustomObject]@{
    lane = $lane
    blockerCount = @($laneGroup.Group).Count
    avgAgeHours = [math]::Round((($rows | Measure-Object -Property ageHours -Average).Average), 1)
    oldestAgeHours = [math]::Round((($rows | Measure-Object -Property ageHours -Maximum).Maximum), 1)
  }
}

$topRecommendation = [ordered]@{
  action = "continue"
  reason = "velocity stable"
  focusLane = $null
  staleBlockerCount = $staleBlockers.Count
}

if ($driftAlert -and $staleBlockers.Count -gt 0) {
  $worstLane = $null
  if ($laneBlockerSummary.Count -gt 0) {
    $worstLane = @($laneBlockerSummary | Sort-Object oldestAgeHours -Descending | Select-Object -First 1)[0]
  }
  $topRecommendation.action = "stabilize"
  $topRecommendation.reason = "ETA worsening with stale blockers"
  $topRecommendation.focusLane = if ($null -ne $worstLane) { $worstLane.lane } else { $null }
} elseif ($driftAlert) {
  $topRecommendation.action = "pause_fanout"
  $topRecommendation.reason = "ETA worsening streak crossed threshold"
} elseif ($staleBlockers.Count -gt 0) {
  $worstLane = $null
  if ($laneBlockerSummary.Count -gt 0) {
    $worstLane = @($laneBlockerSummary | Sort-Object oldestAgeHours -Descending | Select-Object -First 1)[0]
  }
  $topRecommendation.action = "prioritize_blockers"
  $topRecommendation.reason = "blockers exceed aging threshold"
  $topRecommendation.focusLane = if ($null -ne $worstLane) { $worstLane.lane } else { $null }
}

$rerouteHint = $null
if ($topRecommendation.action -eq "stabilize" -or $topRecommendation.action -eq "prioritize_blockers") {
  $rerouteHint = if (-not [string]::IsNullOrWhiteSpace([string]$topRecommendation.focusLane)) {
    ("Shift capacity toward lane {0}; pause lower-priority fanout until stale blockers clear." -f $topRecommendation.focusLane)
  } else {
    "Shift capacity toward blocker-heavy work; pause lower-priority fanout until stale blockers clear."
  }
} elseif ($topRecommendation.action -eq "pause_fanout") {
  $rerouteHint = "Pause fanout and stabilize the slowest lane before resuming broad execution."
} else {
  $rerouteHint = "Continue current routing; the velocity trend is stable enough for normal fanout."
}

$payload = [ordered]@{
  generatedAt = $now.ToString("o")
  targetBoostPct = $targetBoostPct
  current = [ordered]@{
    cycle = if ($null -ne $queue) { [string]$queue.cycle } else { "N/A" }
    totalTasks = $totalTasks
    doneTasks = $doneCount
    completionPct = $currentPct
  }
  velocity = [ordered]@{
    completedLast24h = $done24.Count
    completedLast7d = $done7d.Count
    completedLast30d = $done30d.Count
    tasksPerDay = $velocityPerDay
  }
  categories = [ordered]@{
    daily = $dailyCategories
    monthly = $monthlyCategories
  }
  quality = [ordered]@{
    cycleEntriesLast30d = $cycle30.Count
    scanPassRate30dPct = $scanPassRate30d
  }
  forecast = [ordered]@{
    targetCompletionPct = [math]::Round($targetPct, 1)
    remainingPctToTarget = [math]::Round($remainingPctToTarget, 1)
    tasksNeededForTarget = $tasksNeededForTarget
    etaHours = $etaHours
    confidenceBandsHours = $confidenceBandsHours
    confidence = $confidence
  }
  drift = [ordered]@{
    state = $driftState
    alert = $driftAlert
    worseningStreak = $worseningStreak
    etaDeltaVsPrevHours = $etaDeltaVsPrev
    threshold = $driftThreshold
  }
  blockers = [ordered]@{
    warningHours = $blockerWarnHours
    staleCount = $staleBlockers.Count
    stale = $staleBlockers
    lanes = $laneBlockerSummary
  }
  recommendation = $topRecommendation
  rerouteHint = $rerouteHint
  lanes = $laneForecast
}

$dir = Split-Path $OutputFile -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$json = $payload | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($OutputFile, $json, (New-Object System.Text.UTF8Encoding($false)))
$historyJson = $history | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($historyFile, $historyJson, (New-Object System.Text.UTF8Encoding($false)))

$trendFileJson = Join-Path $stateDir "progress-intelligence-trend.json"
$trendFileCsv = Join-Path $stateDir "progress-intelligence-trend.csv"
$trendRows = @()
foreach ($entry in $history) {
  $trendRows += [PSCustomObject]@{
    generatedAt = [string]$entry.generatedAt
    completionPct = [double]$entry.completionPct
    etaHours = [double]$entry.etaHours
    velocityPerDay = [double]$entry.velocityPerDay
    completedLast24h = [int]$entry.completedLast24h
  }
}
[System.IO.File]::WriteAllText($trendFileJson, ($trendRows | ConvertTo-Json -Depth 6), (New-Object System.Text.UTF8Encoding($false)))
$csvLines = @("generatedAt,completionPct,etaHours,velocityPerDay,completedLast24h")
foreach ($row in $trendRows) {
  $csvLines += ('{0},{1},{2},{3},{4}' -f $row.generatedAt, $row.completionPct, $row.etaHours, $row.velocityPerDay, $row.completedLast24h)
}
[System.IO.File]::WriteAllText($trendFileCsv, ($csvLines -join [Environment]::NewLine), (New-Object System.Text.UTF8Encoding($false)))

if ($JsonOnly) {
  Write-Output $json
  exit 0
}

if ($Brief) {
  $etaText = if ($null -eq $etaHours) { "unknown" } elseif ($etaHours -eq 0) { "already reached" } else { "~$etaHours h" }
  $bandsText = "n/a"
  if ($null -ne $confidenceBandsHours) {
    $bandsText = ("opt:{0}h exp:{1}h cons:{2}h" -f $confidenceBandsHours.optimistic, $confidenceBandsHours.expected, $confidenceBandsHours.conservative)
  }
  $topLane = $null
  if ($laneForecast.Count -gt 0) {
    $topLane = @($laneForecast | Sort-Object -Property @{Expression='completionPct';Descending=$true}, lane | Select-Object -First 1)
  }
  $topLaneText = if ($null -ne $topLane -and $topLane.Count -gt 0) { ("topLane={0}:{1}%" -f $topLane[0].lane, $topLane[0].completionPct) } else { "topLane=n/a" }
  Write-Host "[PROGRESS-INTEL] completion=$currentPct% | +$targetBoostPct% target ETA=$etaText | bands=$bandsText | velocity=$velocityPerDay tasks/day | $topLaneText | drift=$driftState(streak=$worseningStreak) | quality pass=$scanPassRate30d%"
  exit 0
}

Write-Host ""
Write-Host "PROGRESS INTELLIGENCE" -ForegroundColor Cyan
Write-Host "  Completion: $currentPct% ($doneCount/$totalTasks)"
Write-Host "  Velocity: $velocityPerDay tasks/day (24h=$($done24.Count), 7d=$($done7d.Count), 30d=$($done30d.Count))"
Write-Host "  Daily: developed=$($dailyCategories.developed), fixed=$($dailyCategories.fixed), upgraded=$($dailyCategories.upgraded)"
Write-Host "  Monthly: developed=$($monthlyCategories.developed), fixed=$($monthlyCategories.fixed), upgraded=$($monthlyCategories.upgraded)"
Write-Host "  Forecast: target=$targetPct% (+$targetBoostPct%), tasksNeeded=$tasksNeededForTarget, etaHours=$etaHours, confidence=$confidence"
if ($null -ne $confidenceBandsHours) {
  Write-Host "  Confidence bands (h): optimistic=$($confidenceBandsHours.optimistic), expected=$($confidenceBandsHours.expected), conservative=$($confidenceBandsHours.conservative)"
}
if ($laneForecast.Count -gt 0) {
  Write-Host "  Lane forecast (+$targetBoostPct%):"
  foreach ($lf in ($laneForecast | Sort-Object lane)) {
    Write-Host "    Lane $($lf.lane): completion=$($lf.completionPct)% -> target=$($lf.targetCompletionPct)% | tasksNeeded=$($lf.tasksNeededForTarget) | etaHours=$($lf.etaHours) | confidence=$($lf.confidence)"
  }
}
Write-Host "  Drift: state=$driftState, alert=$driftAlert, streak=$worseningStreak, etaDeltaVsPrevHours=$etaDeltaVsPrev"
if ($staleBlockers.Count -gt 0) {
  Write-Host "  Stale blockers: $($staleBlockers.Count) over $blockerWarnHours h"
}
if ($topRecommendation.action -ne "continue") {
  Write-Host "  Recommendation: action=$($topRecommendation.action), reason=$($topRecommendation.reason), focusLane=$($topRecommendation.focusLane)"
}
Write-Host "  Reroute hint: $rerouteHint"
Write-Host "  Quality: cycleEntries30d=$($cycle30.Count), scanPassRate30d=$scanPassRate30d%"
Write-Host "  Saved: $OutputFile" -ForegroundColor DarkGray
