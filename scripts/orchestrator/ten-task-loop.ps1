# ten-task-loop.ps1 -- Autonomous 10-task turn orchestrator
#
# Turn lifecycle:
#  1) Analyze codebase health
#  2) Re-score pending tasks
#  3) Select top executable task
#  4) (Optional) run implementation command
#  5) Record result and replenish pending list back to 10
#  6) Dual-write queue/log markdown files
#
# Usage:
#   npm run orchestrator:loop10:turn
#   npm run orchestrator:loop10:turn -- -AutoImplement -ImplementCommand "npm run typecheck"
#   npm run orchestrator:loop10:autopilot -- -Turns 5 -AutoImplement -ImplementCommand "npm run typecheck"
#   npm run orchestrator:loop10:autopilot:continuous
#   npm run orchestrator:loop10:autopilot:continuous -- -MaxTurns 5
#   npm run orchestrator:loop10:autopilot:subagents
#   npm run orchestrator:loop10:autopilot:subagents:restart
#
# Console progress output:
#   The loop prints timestamped activity lines for each phase:
#   ANALYZE -> SCORE -> SELECT -> PLAN -> IMPLEMENT -> REANALYZE -> REFILL -> RESCORE -> WRITE

param(
  [string]$WorkspaceRoot = ".",
  [int]$Turns = 1,
  [switch]$AutoImplement,
  [switch]$AutoLoop,
  [int]$MaxTurns = 0,
  [switch]$UseSubagentFlow,
  [string]$PlannerAgent = "Explore",
  [string]$ImplementerAgent = "@Mira",
  [string]$PlannerCommand = "",
  [switch]$RequirePlannerSuccess,
  [string]$PlanReorganizationCommand = "",
  [string]$AgentRegistryPath = "plans/SUBAGENT_REGISTRY_100.json",
  [string]$FreePlanningAgents = "@Victoria,@Invoice,@Sofia,@Cassie,@Joelle,@Annie,@Rachel,@Marissa,@Timnit,@Hedy,@Maya,@Booking,@Jaime,@Fei-Fei,@Anima,@Mary,@Corinne",
  [string]$PremiumImplementationAgents = "@Mira,@Katherine,@Radia,@Gwynne,@Una,@Lea,@Tracy,@Africa,@Barbara,@Daniela,@Ruchi,@Rachel,@Joelle,@Jaime,@Mala",
  [int]$PlanningReadinessTarget = 100,
  [switch]$RestartOnExit,
  [int]$RestartDelaySeconds = 2,
  [string]$ImplementCommand = "",
  [switch]$SkipTypecheck,
  [switch]$SkipBuild,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path $WorkspaceRoot
$pendingFile = Join-Path $root "plans\PENDING_TASKS_ONLY.md"
$autopilotFile = Join-Path $root "plans\AUTOPILOT_QUEUE.md"
$agentLogsFile = Join-Path $root "plans\AGENT_LOGS.md"
$stateFile = Join-Path $root "logs\orchestrator\ten-task-loop.json"
$projectProgressFile = Join-Path $root "PROJECT_PROGRESS.md"
$dailyMilestoneFile = Join-Path $root "DAILY_MILESTONE_TRACKER.md"
$agentRegistryFile = Join-Path $root $AgentRegistryPath
$stateDir = Split-Path $stateFile -Parent

if (-not (Test-Path $stateDir)) {
  New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
}

if (-not (Test-Path $pendingFile)) {
  throw "Missing canonical pending queue file: $pendingFile"
}

function New-Id {
  param([int]$Index)
  return ("AUTO-{0:000}" -f $Index)
}

function Write-ActivityLog {
  param(
    [string]$Stage,
    [string]$Message,
    [string]$Color = "Gray"
  )

  $stamp = Get-Date -Format "HH:mm:ss"
  Write-Host "[$stamp][$Stage] $Message" -ForegroundColor $Color
}

function Get-PriorityScore {
  param([string]$Priority)
  switch ($Priority.ToUpper()) {
    "P0" { return 100 }
    "P1" { return 70 }
    "P2" { return 40 }
    default { return 20 }
  }
}

function Get-ImpactBonus {
  param([string]$Text)
  $t = $Text.ToLowerInvariant()
  $bonus = 0
  if ($t -match "security|auth|permission|rbac|compliance") { $bonus += 20 }
  if ($t -match "typecheck|typescript|build|compile|error") { $bonus += 18 }
  if ($t -match "performance|seo|core web vitals") { $bonus += 14 }
  if ($t -match "test|e2e|regression|lint") { $bonus += 10 }
  return $bonus
}

function Get-EffortPenalty {
  param([string]$Text)
  $t = $Text.ToLowerInvariant()
  if ($t -match "refactor|architecture|deep|migration") { return 18 }
  if ($t -match "integration|bundle|rollout") { return 10 }
  return 4
}

function Get-OwnerAgentHandle {
  param([string]$Owner)
  if ([string]::IsNullOrWhiteSpace($Owner)) { return "@Mira" }

  if ($Owner -match '@[A-Za-z\-]+') {
    return $Matches[0]
  }

  return "@Mira"
}

function Get-TaskTeam {
  param([string]$Owner)

  $ownerLower = $Owner.ToLowerInvariant()

  if ($ownerLower -match 'ruchi|radia|mira|barbara|daniela') { return 'Backend/Data' }
  if ($ownerLower -match 'una|lea|tracy|africa|inas') { return 'Frontend/UX' }
  if ($ownerLower -match 'katherine|qa|test') { return 'QA/Validation' }
  if ($ownerLower -match 'rachel|seo') { return 'SEO/Growth' }
  if ($ownerLower -match 'security|compliance|timnit|sofia') { return 'Security/Compliance' }

  return 'Platform'
}

function Normalize-TaskMetadata {
  param([array]$Tasks)

  $normalized = @()
  foreach ($task in @($Tasks)) {
    if ($null -eq $task) { continue }

    if (-not $task.ownerAgent) {
      $task | Add-Member -NotePropertyName ownerAgent -NotePropertyValue (Get-OwnerAgentHandle -Owner $task.owner) -Force
    }
    if (-not $task.team) {
      $task | Add-Member -NotePropertyName team -NotePropertyValue (Get-TaskTeam -Owner $task.owner) -Force
    }
    $normalized += $task
  }

  return @($normalized)
}

function Parse-PendingTasksFromMarkdown {
  param([string]$Path)

  $lines = Get-Content -Path $Path
  $results = @()

  foreach ($line in $lines) {
    if ($line -match '^\|\s*([0-9]+-[0-9]+)\s*\|\s*(.*?)\s*\|\s*(P[0-2])\s*\|\s*(.*?)\s*\|') {
      $taskKey = $Matches[1].Trim()
      $scope = $Matches[2].Trim()
      $priority = $Matches[3].Trim()
      $owner = $Matches[4].Trim()

      if ([string]::IsNullOrWhiteSpace($scope) -or $scope -eq "Scope") { continue }

      $results += [ordered]@{
        sourceId = $taskKey
        title = $scope
        priority = $priority
        owner = $owner
      }
    }
  }

  return @($results)
}

function Load-OrInitState {
  param([array]$SourceTasks)

  if (Test-Path $stateFile) {
    try {
      $loaded = Get-Content -Path $stateFile -Raw | ConvertFrom-Json
      if ($null -ne $loaded -and $null -ne $loaded.pendingTasks) {
        return $loaded
      }
    } catch {
      # fall through and rebuild
    }
  }

  $seed = @()
  $index = 1
  foreach ($s in $SourceTasks) {
    if ($seed.Count -ge 10) { break }
    $seed += [ordered]@{
      id = (New-Id -Index $index)
      sourceId = $s.sourceId
      title = $s.title
      owner = $s.owner
      ownerAgent = (Get-OwnerAgentHandle -Owner $s.owner)
      team = (Get-TaskTeam -Owner $s.owner)
      priority = $s.priority
      status = "pending"
      turnsPending = 0
      score = 0
      createdAt = (Get-Date).ToString("o")
      updatedAt = (Get-Date).ToString("o")
      notes = ""
    }
    $index++
  }

  return [ordered]@{
    version = "1.0"
    generatedAt = (Get-Date).ToString("o")
    turnCounter = 0
    completedTasks = @()
    pendingTasks = $seed
    blockedTasks = @()
  }
}

function Save-State {
  param([object]$State)
  $State.generatedAt = (Get-Date).ToString("o")
  if (-not $DryRun) {
    $State | ConvertTo-Json -Depth 12 | Set-Content -Path $stateFile -Encoding UTF8
  }
}

function Get-RunSummary {
  param([string]$Command)

  $start = Get-Date
  $ok = $false
  $output = ""

  try {
    $output = (& powershell -NoProfile -Command $Command 2>&1 | Out-String)
    $ok = $LASTEXITCODE -eq 0
  } catch {
    $output = $_.Exception.Message
    $ok = $false
  }

  $end = Get-Date
  return [ordered]@{
    command = $Command
    ok = $ok
    durationSeconds = [int]($end - $start).TotalSeconds
    output = $output.Trim()
  }
}

function Expand-CommandTemplate {
  param(
    [string]$Template,
    [object]$Task,
    [string]$AgentHandle = ""
  )

  if ([string]::IsNullOrWhiteSpace($Template)) { return "" }

  $ownerAgent = if ($Task.ownerAgent) { $Task.ownerAgent } else { Get-OwnerAgentHandle -Owner $Task.owner }
  $team = if ($Task.team) { $Task.team } else { Get-TaskTeam -Owner $Task.owner }

  $expanded = $Template
  $expanded = $expanded.Replace("{TASK_ID}", [string]$Task.id)
  $expanded = $expanded.Replace("{SOURCE_ID}", [string]$Task.sourceId)
  $expanded = $expanded.Replace("{TITLE}", [string]$Task.title)
  $expanded = $expanded.Replace("{OWNER}", [string]$Task.owner)
  $expanded = $expanded.Replace("{OWNER_AGENT}", [string]$ownerAgent)
  $expanded = $expanded.Replace("{TEAM}", [string]$team)
  $expanded = $expanded.Replace("{AGENT}", [string]$AgentHandle)
  $expanded = $expanded.Replace("{PLANNER_AGENT}", [string]$AgentHandle)
  return $expanded
}

function Get-AgentPool {
  param([string]$AgentCsv)

  $agents = @()
  foreach ($raw in ($AgentCsv -split ',')) {
    $a = $raw.Trim()
    if (-not [string]::IsNullOrWhiteSpace($a)) {
      $agents += $a
    }
  }

  return @($agents)
}

function Load-AgentRegistry {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return $null
  }

  try {
    $raw = Get-Content -Path $Path -Raw | ConvertFrom-Json
    return $raw
  }
  catch {
    Write-ActivityLog -Stage "PLAN" -Message "Failed to parse agent registry at ${Path}: $($_.Exception.Message)" -Color "Red"
    return $null
  }
}

function Sync-PendingWithSource {
  param(
    [object]$State,
    [array]$SourceTasks
  )

  $sourceMap = @{}
  foreach ($s in @($SourceTasks)) {
    if (-not [string]::IsNullOrWhiteSpace($s.sourceId)) {
      $sourceMap[$s.sourceId] = $s
    }
  }

  foreach ($p in @($State.pendingTasks)) {
    if ($p.sourceId -like "GENERATED-*") { continue }
    if ($sourceMap.ContainsKey($p.sourceId)) {
      $latest = $sourceMap[$p.sourceId]
      $p.title = $latest.title
      $p.priority = $latest.priority
      $p.owner = $latest.owner
      $p.ownerAgent = Get-OwnerAgentHandle -Owner $latest.owner
      $p.team = Get-TaskTeam -Owner $latest.owner
      $p.updatedAt = (Get-Date).ToString("o")
    }
  }
}

function Get-RestartArgumentString {
  param([hashtable]$Bound)

  $args = @()
  $args += "-ExecutionPolicy Bypass"
  $args += "-File `"$PSCommandPath`""

  foreach ($kv in $Bound.GetEnumerator()) {
    $key = [string]$kv.Key
    $value = $kv.Value

    if ($key -eq 'RestartOnExit') { continue }
    if ($key -eq 'RestartDelaySeconds') { continue }

    if ($value -is [switch]) {
      if ($value.IsPresent) { $args += "-$key" }
      continue
    }

    if ($null -eq $value) { continue }

    if ($value -is [string]) {
      if ([string]::IsNullOrWhiteSpace($value)) { continue }
      $escaped = $value.Replace('"', '""')
      $args += "-$key `"$escaped`""
      continue
    }

    $args += "-$key $value"
  }

  return ($args -join ' ')
}

function Analyze-Codebase {
  $analysis = [ordered]@{}

  $gitStatusOutput = (& git -C $root status --short 2>&1 | Out-String)
  $analysis.gitChangedFiles = @($gitStatusOutput -split "`r?`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }).Count

  $analysis.typecheck = [ordered]@{ skipped = $true; ok = $null; durationSeconds = 0 }
  if (-not $SkipTypecheck) {
    $typecheckResult = Get-RunSummary -Command "cd '$root'; npm run typecheck"
    $analysis.typecheck = [ordered]@{ skipped = $false; ok = $typecheckResult.ok; durationSeconds = $typecheckResult.durationSeconds }
  }

  $analysis.build = [ordered]@{ skipped = $true; ok = $null; durationSeconds = 0 }
  if (-not $SkipBuild) {
    $buildResult = Get-RunSummary -Command "cd '$root'; npm run build"
    $analysis.build = [ordered]@{ skipped = $false; ok = $buildResult.ok; durationSeconds = $buildResult.durationSeconds }
  }

  return $analysis
}

function Score-PendingTasks {
  param(
    [array]$Pending,
    [object]$Analysis,
    [int]$TurnNumber
  )

  foreach ($t in $Pending) {
    $priorityScore = Get-PriorityScore -Priority $t.priority
    $impact = Get-ImpactBonus -Text $t.title
    $effortPenalty = Get-EffortPenalty -Text $t.title
    $ageBonus = [Math]::Min(20, [int]$t.turnsPending * 4)

    $blockerReduction = 0
    if ($Analysis.typecheck.ok -eq $false -and $t.title.ToLowerInvariant() -match "typecheck|typescript|build|compile|error") {
      $blockerReduction += 20
    }
    if ($Analysis.build.ok -eq $false -and $t.title.ToLowerInvariant() -match "build|bundle|import|compile") {
      $blockerReduction += 20
    }

    $t.score = $priorityScore + $impact + $ageBonus + $blockerReduction - $effortPenalty
    $t.updatedAt = (Get-Date).ToString("o")
  }

  return @($Pending | Sort-Object -Property @{Expression='score';Descending=$true}, @{Expression='turnsPending';Descending=$true}, @{Expression='id';Descending=$false})
}

function Ensure-ExactlyTenPending {
  param(
    [object]$State,
    [array]$SourceTasks,
    [string]$NewTaskReason
  )

  $pending = @($State.pendingTasks)
  $completedSourceIds = @($State.completedTasks | ForEach-Object { $_.sourceId })
  $pendingSourceIds = @($pending | ForEach-Object { $_.sourceId })

  $nextIndex = 1
  foreach ($allId in @($pending | ForEach-Object { $_.id }) + @($State.completedTasks | ForEach-Object { $_.id })) {
    if ($allId -match '^AUTO-(\d+)$') {
      $num = [int]$Matches[1]
      if ($num -ge $nextIndex) { $nextIndex = $num + 1 }
    }
  }

  while ($pending.Count -lt 10) {
    $candidate = $SourceTasks | Where-Object { ($completedSourceIds -notcontains $_.sourceId) -and ($pendingSourceIds -notcontains $_.sourceId) } | Select-Object -First 1

    if ($null -eq $candidate) {
      # Fallback generated task when canonical source is exhausted.
      $generatedSourceId = "GENERATED-$nextIndex"
      $pending += [ordered]@{
        id = (New-Id -Index $nextIndex)
        sourceId = $generatedSourceId
        title = "Generated follow-up: harden unresolved diagnostics and regressions"
        owner = "@Mira + @Katherine"
        ownerAgent = "@Mira"
        team = "Platform"
        priority = "P1"
        status = "pending"
        turnsPending = 0
        score = 0
        createdAt = (Get-Date).ToString("o")
        updatedAt = (Get-Date).ToString("o")
        notes = $NewTaskReason
      }
      $nextIndex++
      continue
    }

    $pending += [ordered]@{
      id = (New-Id -Index $nextIndex)
      sourceId = $candidate.sourceId
      title = $candidate.title
      owner = $candidate.owner
      ownerAgent = (Get-OwnerAgentHandle -Owner $candidate.owner)
      team = (Get-TaskTeam -Owner $candidate.owner)
      priority = $candidate.priority
      status = "pending"
      turnsPending = 0
      score = 0
      createdAt = (Get-Date).ToString("o")
      updatedAt = (Get-Date).ToString("o")
      notes = $NewTaskReason
    }
    $nextIndex++
    $pendingSourceIds += $candidate.sourceId
  }

  if ($pending.Count -gt 10) {
    $pending = @($pending | Sort-Object -Property @{Expression='score';Descending=$true}, @{Expression='createdAt';Descending=$false} | Select-Object -First 10)
  }

  $State.pendingTasks = $pending
}

function Write-AutopilotQueueMarkdown {
  param(
    [object]$State,
    [object]$Analysis,
    [object]$PostAnalysis,
    [object]$SelectedTask,
    [string]$ExecutionStatus,
    [string]$ExecutionNote,
    [string]$SubagentFlowNote
  )

  $pending = @($State.pendingTasks | Sort-Object -Property @{Expression='score';Descending=$true})
  $date = Get-Date -Format "yyyy-MM-dd HH:mm"
  $branch = (& git -C $root rev-parse --abbrev-ref HEAD 2>$null)
  if ([string]::IsNullOrWhiteSpace($branch)) { $branch = "unknown" }

  $lines = @()
  $lines += "# AUTOPILOT_QUEUE.md"
  $lines += ""
  $lines += "**Mode:** AUTONOMOUS 10-TASK LOOP"
  $lines += "**Updated:** $date"
  $lines += "**Branch:** $branch"
  $lines += "**Turn:** $($State.turnCounter)"
  $lines += ""
  $lines += "## Turn Analysis"
  $lines += "- Changed files (git): $($Analysis.gitChangedFiles)"
  $lines += "- Typecheck: $(if ($Analysis.typecheck.skipped) { 'skipped' } elseif ($Analysis.typecheck.ok) { 'pass' } else { 'fail' })"
  $lines += "- Build: $(if ($Analysis.build.skipped) { 'skipped' } elseif ($Analysis.build.ok) { 'pass' } else { 'fail' })"
  $lines += "- Post-turn changed files (git): $($PostAnalysis.gitChangedFiles)"
  $lines += ""
  $lines += "## Selected Task (Top Priority)"
  $lines += "- **Task:** $($SelectedTask.id) / $($SelectedTask.sourceId)"
  $lines += "- **Title:** $($SelectedTask.title)"
  $lines += "- **Priority:** $($SelectedTask.priority)"
  $lines += "- **Score:** $($SelectedTask.score)"
  $lines += "- **Owner:** $($SelectedTask.owner)"
  $lines += "- **Owner Agent:** $(if ($SelectedTask.ownerAgent) { $SelectedTask.ownerAgent } else { Get-OwnerAgentHandle -Owner $SelectedTask.owner })"
  $lines += "- **Team:** $(if ($SelectedTask.team) { $SelectedTask.team } else { Get-TaskTeam -Owner $SelectedTask.owner })"
  $lines += "- **Execution:** $ExecutionStatus"
  $lines += "- **Subagent Flow:** $SubagentFlowNote"
  $lines += "- **Note:** $ExecutionNote"
  $lines += ""
  $lines += "## Pending Queue (Exactly 10)"
  $lines += "| Rank | Task | Source | Priority | Score | Owner Agent | Team | Status |"
  $lines += "| ---- | ---- | ------ | -------- | ----- | ----------- | ---- | ------ |"

  $rank = 1
  foreach ($t in $pending) {
    $ownerAgent = if ($t.ownerAgent) { $t.ownerAgent } else { Get-OwnerAgentHandle -Owner $t.owner }
    $team = if ($t.team) { $t.team } else { Get-TaskTeam -Owner $t.owner }
    $lines += "| $rank | $($t.id) | $($t.sourceId) | $($t.priority) | $($t.score) | $ownerAgent | $team | $($t.status) |"
    $rank++
  }

  if (-not $DryRun) {
    $lines -join "`r`n" | Set-Content -Path $autopilotFile -Encoding UTF8
  }
}

function Append-AgentLog {
  param(
    [object]$State,
    [object]$SelectedTask,
    [string]$ExecutionStatus,
    [string]$ExecutionNote,
    [string]$SubagentFlowNote,
    [object]$AddedTask
  )

  if (-not (Test-Path $agentLogsFile)) {
    if (-not $DryRun) {
      @(
        "# AGENT_LOGS.md",
        "",
        "## Autonomous 10-Task Loop Logs"
      ) -join "`r`n" | Set-Content -Path $agentLogsFile -Encoding UTF8
    }
  }

  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $entry = @()
  $entry += ""
  $entry += "### Turn $($State.turnCounter) - $stamp"
  $entry += "- Selected: **$($SelectedTask.id)** ($($SelectedTask.title))"
  $entry += "- Routing: $(if ($SelectedTask.ownerAgent) { $SelectedTask.ownerAgent } else { Get-OwnerAgentHandle -Owner $SelectedTask.owner }) / $(if ($SelectedTask.team) { $SelectedTask.team } else { Get-TaskTeam -Owner $SelectedTask.owner })"
  $entry += "- Subagent Flow: $SubagentFlowNote"
  $entry += "- Score/Priority: $($SelectedTask.score) / $($SelectedTask.priority)"
  $entry += "- Execution: **$ExecutionStatus**"
  $entry += "- Evidence: $ExecutionNote"
  if ($null -ne $AddedTask) {
    $entry += "- Replenishment: Added pending task **$($AddedTask.id)** ($($AddedTask.sourceId))"
  }

  if (-not $DryRun) {
    Add-Content -Path $agentLogsFile -Value ($entry -join "`r`n") -Encoding UTF8
  }
}

function Upsert-ManagedSection {
  param(
    [string]$FilePath,
    [string]$Marker,
    [string[]]$BodyLines
  )

  $startMarker = "<!-- ${Marker}:START -->"
  $endMarker = "<!-- ${Marker}:END -->"
  $block = @($startMarker) + $BodyLines + @($endMarker)
  $blockText = $block -join "`r`n"

  $existing = ""
  if (Test-Path $FilePath) {
    $existing = Get-Content -Path $FilePath -Raw
  }

  if ([string]::IsNullOrWhiteSpace($existing)) {
    $existing = ""
  }

  $escapedMarker = [Regex]::Escape($Marker)
  $pattern = "(?s)<!--\s*${escapedMarker}:START\s*-->.*?<!--\s*${escapedMarker}:END\s*-->"
  if ($existing -match $pattern) {
    $updated = [Regex]::Replace($existing, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $blockText })
  }
  else {
    $separator = if ($existing.EndsWith("`r`n") -or $existing.EndsWith("`n")) { "" } else { "`r`n" }
    $updated = "$existing$separator`r`n$blockText`r`n"
  }

  if (-not $DryRun) {
    Set-Content -Path $FilePath -Value $updated -Encoding UTF8
  }
}

function Update-CanonicalTrackers {
  param(
    [object]$State,
    [object]$SelectedTask,
    [string]$ExecutionStatus,
    [string]$ExecutionNote,
    [string]$SubagentFlowNote,
    [object]$AddedTask,
    [object]$Analysis
  )

  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $dateLabel = Get-Date -Format "MMM dd, yyyy"
  $pending = @($State.pendingTasks | Sort-Object -Property @{Expression='score';Descending=$true})
  $topPending = @($pending | Select-Object -First 3)
  $blockerStatus = if ($ExecutionStatus -eq 'failed' -or $ExecutionStatus -eq 'blocked') { 'Blocked' } else { 'None' }

  $projectLines = @()
  $projectLines += "## Autonomous Loop Sync (Auto-Generated)"
  $projectLines += ""
  $projectLines += "- Last sync: **$stamp**"
  $projectLines += "- Turn: **$($State.turnCounter)**"
  $projectLines += "- Selected Task: **$($SelectedTask.id)** ($($SelectedTask.sourceId))"
  $projectLines += "- Owner/Team: **$(if ($SelectedTask.ownerAgent) { $SelectedTask.ownerAgent } else { Get-OwnerAgentHandle -Owner $SelectedTask.owner }) / $(if ($SelectedTask.team) { $SelectedTask.team } else { Get-TaskTeam -Owner $SelectedTask.owner })**"
  $projectLines += "- Execution: **$ExecutionStatus**"
  $projectLines += "- Subagent Flow: **$SubagentFlowNote**"
  $projectLines += "- Queue Invariant: **$(@($State.pendingTasks).Count) pending tasks**"
  $projectLines += ""
  $projectLines += "### Handoff Contract"
  $projectLines += "- Task ID: $($SelectedTask.id)"
  $projectLines += "- Files touched: scripts/orchestrator/ten-task-loop.ps1, plans/AUTOPILOT_QUEUE.md, plans/AGENT_LOGS.md, logs/orchestrator/ten-task-loop.json"
  $projectLines += "- Acceptance criteria: selected top-scored task completed; exactly 10 pending retained; replenishment executed when needed"
  $projectLines += "- Validation steps: loop command run; queue markdown inspected; agent log inspected; JSON pending count verified"
  $projectLines += "- Blocker status: $blockerStatus"
  $projectLines += ""
  $projectLines += "### Next Top Pending (Preview)"
  if ($topPending.Count -eq 0) {
    $projectLines += "- None"
  }
  else {
    foreach ($tp in $topPending) {
      $projectLines += "- **$($tp.id)** [$($tp.priority) | $($tp.score)] :: $($tp.title)"
    }
  }
  if ($AddedTask) {
    $projectLines += ""
    $projectLines += "- Replenishment added: **$($AddedTask.id)** ($($AddedTask.sourceId))"
  }

  $dailyLines = @()
  $dailyLines += "## Autonomous Loop Daily Sync (Auto-Generated)"
  $dailyLines += ""
  $dailyLines += "| Date | Owner | Summary | Status |"
  $dailyLines += "| ---- | ----- | ------- | ------ |"
  $typecheckStatus = if ($Analysis.typecheck.skipped) { 'skipped' } elseif ($Analysis.typecheck.ok) { 'pass' } else { 'fail' }
  $buildStatus = if ($Analysis.build.skipped) { 'skipped' } elseif ($Analysis.build.ok) { 'pass' } else { 'fail' }
  $dailySummary = "Turn $($State.turnCounter): completed $($SelectedTask.id) ($($SelectedTask.sourceId)) via $ExecutionStatus; queue held at $(@($State.pendingTasks).Count) pending; typecheck=$typecheckStatus; build=$buildStatus."
  $dailyLines += "| $dateLabel | $(if ($SelectedTask.ownerAgent) { $SelectedTask.ownerAgent } else { Get-OwnerAgentHandle -Owner $SelectedTask.owner }) | $dailySummary | $ExecutionStatus |"
  if ($AddedTask) {
    $dailyLines += "| $dateLabel | @Mira | Replenishment: added $($AddedTask.id) ($($AddedTask.sourceId)) to preserve exactly-10 pending invariant. | Done |"
  }

  Upsert-ManagedSection -FilePath $projectProgressFile -Marker "AUTONOMOUS_LOOP_SYNC" -BodyLines $projectLines
  Upsert-ManagedSection -FilePath $dailyMilestoneFile -Marker "AUTONOMOUS_LOOP_DAILY_SYNC" -BodyLines $dailyLines
}

$sourceTasks = Parse-PendingTasksFromMarkdown -Path $pendingFile
if ($sourceTasks.Count -eq 0) {
  throw "No parseable backlog tasks found in $pendingFile"
}

$state = Load-OrInitState -SourceTasks $sourceTasks
$state.pendingTasks = Normalize-TaskMetadata -Tasks $state.pendingTasks
$state.completedTasks = Normalize-TaskMetadata -Tasks $state.completedTasks
$state.blockedTasks = Normalize-TaskMetadata -Tasks $state.blockedTasks

$ranTurns = 0
while ($true) {
  if (-not $AutoLoop -and $ranTurns -ge $Turns) { break }
  if ($AutoLoop -and $MaxTurns -gt 0 -and $ranTurns -ge $MaxTurns) { break }

  $ranTurns++
  $state.turnCounter = [int]$state.turnCounter + 1
  Write-ActivityLog -Stage "TURN" -Message "Starting turn $($state.turnCounter)" -Color "Cyan"

  Write-ActivityLog -Stage "REORGANIZE" -Message "Reorganizing plans and pending queue before selection" -Color "Magenta"
  if (-not [string]::IsNullOrWhiteSpace($PlanReorganizationCommand)) {
    $reorgRun = Get-RunSummary -Command "cd '$root'; $PlanReorganizationCommand"
    if ($reorgRun.ok) {
      Write-ActivityLog -Stage "REORGANIZE" -Message "Plan reorganization command succeeded in $($reorgRun.durationSeconds)s" -Color "Magenta"
    }
    else {
      $reorgTrim = if ($reorgRun.output.Length -gt 240) { $reorgRun.output.Substring(0, 240) + " ..." } else { $reorgRun.output }
      Write-ActivityLog -Stage "REORGANIZE" -Message "Plan reorganization command failed: $reorgTrim" -Color "Red"
    }
  }

  $latestSourceTasks = Parse-PendingTasksFromMarkdown -Path $pendingFile
  if ($latestSourceTasks.Count -gt 0) {
    $sourceTasks = $latestSourceTasks
    Sync-PendingWithSource -State $state -SourceTasks $sourceTasks
    Write-ActivityLog -Stage "REORGANIZE" -Message "Canonical backlog reloaded and pending tasks synced" -Color "Magenta"
  }
  else {
    Write-ActivityLog -Stage "REORGANIZE" -Message "Warning: canonical backlog parse returned 0 tasks; using previous in-memory source" -Color "DarkYellow"
  }

  Write-ActivityLog -Stage "ANALYZE" -Message "Running pre-turn codebase analysis" -Color "DarkCyan"
  $analysis = Analyze-Codebase
  Write-ActivityLog -Stage "ANALYZE" -Message "Pre-turn analysis complete (changed files: $($analysis.gitChangedFiles))" -Color "DarkCyan"

  foreach ($pt in @($state.pendingTasks)) {
    $pt.turnsPending = [int]$pt.turnsPending + 1
  }

  Write-ActivityLog -Stage "SCORE" -Message "Scoring pending tasks" -Color "DarkGray"
  $scored = Score-PendingTasks -Pending @($state.pendingTasks) -Analysis $analysis -TurnNumber $state.turnCounter
  if ($scored.Count -eq 0) {
    throw "No pending tasks available to process."
  }
  Write-ActivityLog -Stage "SCORE" -Message "Scoring complete ($($scored.Count) tasks ranked)" -Color "DarkGray"

  # Keep only top 10 pending before selecting, to enforce invariant continuously.
  $state.pendingTasks = @($scored | Select-Object -First 10)
  $selected = $state.pendingTasks[0]
  $selected.status = "in_progress"
  $selected.updatedAt = (Get-Date).ToString("o")

  Write-ActivityLog -Stage "SELECT" -Message "Chosen task: $($selected.id) ($($selected.sourceId)) :: $($selected.title)" -Color "Yellow"

  $executionStatus = "planned"
  $executionNote = "Hybrid mode: implementation packet generated (no command executed)."
  $subagentFlowNote = "disabled"

  if ($AutoImplement) {
    $planStatus = "skipped"
    $planNote = "planner not used"
    $planner = if ([string]::IsNullOrWhiteSpace($PlannerAgent)) { "Explore" } else { $PlannerAgent }

    $planningAgents = Get-AgentPool -AgentCsv $FreePlanningAgents
    if ($planningAgents.Count -eq 0) {
      $planningAgents = @("@Victoria","@Invoice","@Sofia","@Cassie","@Joelle","@Annie","@Rachel","@Marissa","@Timnit","@Hedy","@Maya","@Booking","@Jaime","@Fei-Fei","@Anima","@Mary","@Corinne")
    }

    $premiumAgents = Get-AgentPool -AgentCsv $PremiumImplementationAgents
    if ($premiumAgents.Count -eq 0) {
      $premiumAgents = @("@Mira")
    }

    $registry = Load-AgentRegistry -Path $agentRegistryFile
    if ($null -ne $registry) {
      $registryFree = @($registry.freeAgents | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
      $registryPremium = @($registry.premiumAgents | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

      if ($registryFree.Count -gt 0) {
        $planningAgents = $registryFree
      }
      if ($registryPremium.Count -gt 0) {
        $premiumAgents = $registryPremium
      }

      Write-ActivityLog -Stage "PLAN" -Message "Loaded agent registry ($($registry.totalAgents) total, free=$($planningAgents.Count), premium=$($premiumAgents.Count))" -Color "DarkYellow"
    }

    $implementer = if ([string]::IsNullOrWhiteSpace($ImplementerAgent)) { $premiumAgents[0] } else { $ImplementerAgent }
    if ($premiumAgents -notcontains $implementer) {
      Write-ActivityLog -Stage "IMPLEMENT" -Message "Requested implementer $implementer not in premium pool; using $($premiumAgents[0])" -Color "DarkYellow"
      $implementer = $premiumAgents[0]
    }

    if ($UseSubagentFlow) {
      Write-ActivityLog -Stage "PLAN" -Message "Running planning fanout across free agent pool ($($planningAgents.Count) agents)" -Color "DarkYellow"

      $planningCompleted = 0
      $planningFailed = 0

      foreach ($planningAgent in $planningAgents) {
        if (-not [string]::IsNullOrWhiteSpace($PlannerCommand)) {
          $planCmd = Expand-CommandTemplate -Template $PlannerCommand -Task $selected -AgentHandle $planningAgent
          Write-ActivityLog -Stage "PLAN" -Message "[$planningAgent] Running planner command" -Color "DarkYellow"
          $planRun = Get-RunSummary -Command "cd '$root'; $planCmd"
          if ($planRun.ok) {
            $planningCompleted++
            Write-ActivityLog -Stage "PLAN" -Message "[$planningAgent] planning command succeeded in $($planRun.durationSeconds)s" -Color "DarkYellow"
          }
          else {
            $planningFailed++
            $planTrimmed = if ($planRun.output.Length -gt 220) { $planRun.output.Substring(0, 220) + " ..." } else { $planRun.output }
            Write-ActivityLog -Stage "PLAN" -Message "[$planningAgent] planner command failed: $planTrimmed" -Color "Red"
          }
        }
        else {
          $planningCompleted++
          Write-ActivityLog -Stage "PLAN" -Message "[$planningAgent] planning packet synthesized (no planner command configured)" -Color "DarkYellow"
        }
      }

      $planningReadiness = if ($planningAgents.Count -gt 0) { [int][Math]::Floor(($planningCompleted * 100.0) / $planningAgents.Count) } else { 0 }
      $planStatus = if ($planningReadiness -ge $PlanningReadinessTarget) { "completed" } else { "failed" }
      $planNote = "planning readiness $planningReadiness% ($planningCompleted/$($planningAgents.Count) agents complete, failures=$planningFailed), target=$PlanningReadinessTarget%"
      Write-ActivityLog -Stage "PLAN" -Message $planNote -Color ($(if ($planStatus -eq 'completed') { 'Green' } else { 'Red' }))

      if ($planStatus -ne "completed") {
        $executionStatus = "failed"
        $executionNote = "Planning readiness gate not met. $planNote"
        $subagentFlowNote = "planning:$planningReadiness% free-agents ($planningCompleted/$($planningAgents.Count)); implementer:skipped"
      }
      else {
        $subagentFlowNote = "planning:$planningReadiness% free-agents ($planningCompleted/$($planningAgents.Count)); implementer:pending ($implementer from premium-pool $($premiumAgents.Count))"
      }
    }

    if ($executionStatus -ne "failed") {
      Write-ActivityLog -Stage "IMPLEMENT" -Message "Subagent implementer=$implementer task=$($selected.id)" -Color "DarkYellow"

      if ([string]::IsNullOrWhiteSpace($ImplementCommand)) {
        $ImplementCommand = "npm run typecheck"
      }

      $cmd = Expand-CommandTemplate -Template $ImplementCommand -Task $selected
      Write-ActivityLog -Stage "IMPLEMENT" -Message "Running implementation command: $cmd" -Color "DarkYellow"
      $impl = Get-RunSummary -Command "cd '$root'; $cmd"
      if ($impl.ok) {
        $executionStatus = "completed"
        $executionNote = "Command succeeded in $($impl.durationSeconds)s: $cmd"
        Write-ActivityLog -Stage "IMPLEMENT" -Message "$executionNote" -Color "Green"
        if ($UseSubagentFlow) {
          $subagentFlowNote = $subagentFlowNote -replace "implementer:pending", "implementer:completed"
        }
      }
      else {
        $executionStatus = "failed"
        $trimmed = if ($impl.output.Length -gt 400) { $impl.output.Substring(0, 400) + " ..." } else { $impl.output }
        $executionNote = "Command failed in $($impl.durationSeconds)s: $cmd | $trimmed"
        Write-ActivityLog -Stage "IMPLEMENT" -Message "$executionNote" -Color "Red"
        if ($UseSubagentFlow) {
          $subagentFlowNote = $subagentFlowNote -replace "implementer:pending", "implementer:failed"
        }
      }
    }
  } else {
    $executionStatus = "completed"
    if ($UseSubagentFlow) {
      $executionNote = "Subagent plan+implementation packets completed (no execution command in this mode)."
      $subagentFlowNote = "planning:100% free-agent packets complete | implementer:premium-pool packet complete"
    }
    else {
      $executionNote = "Hybrid plan mode: implementation packet completed and queued for coding execution."
    }
    Write-ActivityLog -Stage "IMPLEMENT" -Message "$executionNote" -Color "Green"
  }

  $addedTask = $null
  if ($executionStatus -eq "completed") {
    $selected.status = "done"
    $selected.updatedAt = (Get-Date).ToString("o")
    $state.completedTasks += $selected
    $state.pendingTasks = @($state.pendingTasks | Where-Object { $_.id -ne $selected.id })
  }
  elseif ($executionStatus -eq "failed" -or $executionStatus -eq "blocked") {
    $selected.status = "blocked"
    $selected.notes = $executionNote
    $state.blockedTasks += $selected
    $state.pendingTasks = @($state.pendingTasks | Where-Object { $_.id -ne $selected.id })
  }
  else {
    # planned-only turn keeps task in queue but moves it behind by setting turnsPending lower.
    $selected.status = "pending"
    $selected.turnsPending = 0
    $selected.notes = $executionNote
  }

  # Re-analyze codebase after execution before refill and rescoring.
  Write-ActivityLog -Stage "REANALYZE" -Message "Running post-execution analysis" -Color "DarkCyan"
  $postExecutionAnalysis = Analyze-Codebase
  Write-ActivityLog -Stage "REANALYZE" -Message "Post-analysis complete (changed files: $($postExecutionAnalysis.gitChangedFiles))" -Color "DarkCyan"

  $pendingBefore = @($state.pendingTasks)
  Write-ActivityLog -Stage "REFILL" -Message "Ensuring exactly 10 pending tasks" -Color "DarkGray"
  Ensure-ExactlyTenPending -State $state -SourceTasks $sourceTasks -NewTaskReason "Auto-added by ten-task loop after turn $($state.turnCounter)"
  $pendingAfter = @($state.pendingTasks)

  if ($pendingAfter.Count -gt $pendingBefore.Count) {
    $addedTask = @($pendingAfter | Where-Object { @($pendingBefore | ForEach-Object { $_.id }) -notcontains $_.id } | Select-Object -First 1)
  }

  # Re-score after replenishment using post-execution analysis.
  Write-ActivityLog -Stage "RESCORE" -Message "Rescoring pending tasks for next turn" -Color "DarkGray"
  $state.pendingTasks = Score-PendingTasks -Pending @($state.pendingTasks) -Analysis $postExecutionAnalysis -TurnNumber $state.turnCounter

  $postAnalysis = $postExecutionAnalysis

  Write-ActivityLog -Stage "WRITE" -Message "Writing queue/log/tracker/state artifacts" -Color "Gray"
  Write-AutopilotQueueMarkdown -State $state -Analysis $analysis -PostAnalysis $postAnalysis -SelectedTask $selected -ExecutionStatus $executionStatus -ExecutionNote $executionNote -SubagentFlowNote $subagentFlowNote
  Append-AgentLog -State $state -SelectedTask $selected -ExecutionStatus $executionStatus -ExecutionNote $executionNote -SubagentFlowNote $subagentFlowNote -AddedTask $addedTask
  Update-CanonicalTrackers -State $state -SelectedTask $selected -ExecutionStatus $executionStatus -ExecutionNote $executionNote -SubagentFlowNote $subagentFlowNote -AddedTask $addedTask -Analysis $analysis

  Save-State -State $state
  Write-ActivityLog -Stage "WRITE" -Message "Artifacts saved" -Color "Gray"

  Write-Host "[TURN $($state.turnCounter)] Selected $($selected.id) ($($selected.sourceId)) -> $executionStatus" -ForegroundColor Cyan

  if ($AutoLoop) {
    Write-Host "[AUTOPILOT] Turn complete; continuing automatically..." -ForegroundColor DarkCyan
  }
}

Write-Host "Done. Pending queue maintained at $(@($state.pendingTasks).Count) tasks." -ForegroundColor Green

if ($RestartOnExit) {
  if ($DryRun) {
    Write-Host "[AUTOPILOT] RestartOnExit requested but skipped because -DryRun is enabled." -ForegroundColor DarkYellow
  }
  else {
    if ($RestartDelaySeconds -gt 0) {
      Write-Host "[AUTOPILOT] Waiting $RestartDelaySeconds second(s) before restart..." -ForegroundColor DarkCyan
      Start-Sleep -Seconds $RestartDelaySeconds
    }

    $restartArgumentString = Get-RestartArgumentString -Bound $PSBoundParameters
    Write-Host "[AUTOPILOT] Relaunching loop: powershell $restartArgumentString" -ForegroundColor DarkCyan
    Start-Process -FilePath "powershell" -ArgumentList $restartArgumentString | Out-Null
  }
}
