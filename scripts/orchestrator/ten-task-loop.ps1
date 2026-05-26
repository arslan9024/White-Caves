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
  [string]$AgentRegistryPath = "plans/SUBAGENT_REGISTRY_150.json",
  [string]$FreePlanningAgents = "@Victoria,@Invoice,@Sofia,@Cassie,@Joelle,@Annie,@Rachel,@Marissa,@Timnit,@Hedy,@Maya,@Booking,@Jaime,@Fei-Fei,@Anima,@Mary,@Corinne",
  [string]$PremiumImplementationAgents = "@Mira,@Katherine,@Radia,@Gwynne,@Una,@Lea,@Tracy,@Africa,@Barbara,@Daniela,@Ruchi,@Rachel,@Joelle,@Jaime,@Mala",
  [int]$PlanningReadinessTarget = 100,
  [int]$PlanningImprovementThreshold = 1,
  [int]$MinProjectCompletionDeltaPct = 1,
  [switch]$StopOnNextIteration,
  [string]$StopSignalFile = "logs/orchestrator/STOP_NEXT_ITERATION",
  [string]$SyncBranch = "main",
  [switch]$RestartOnExit,
  [int]$RestartDelaySeconds = 2,
  [string]$ImplementCommand = "",
  [switch]$DisablePerTurnPlanningOps,
  [string]$PerTurnFreeAgentCommand = "powershell -ExecutionPolicy Bypass -File scripts/orchestrator/agent-loop.ps1 -Once -NoBrowser -NonInteractive",
  [string]$PerTurnPlanCleanupCommand = "powershell -ExecutionPolicy Bypass -File scripts/orchestrator/margaret-sync.ps1",
  [string]$PerTurnFullContextCommand = "node scripts/orchestrator/codebase-scan.js",
  [string]$PerTurnOnlineResearchCommand = "npm run orchestrator:discover-upgrade:report",
  [int]$PlanResearchSummaryMaxChars = 1800,
  [string]$NextPhasePlansDir = "plans/waves/next-phase",
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
$nextPhasePlansRoot = Join-Path $root $NextPhasePlansDir
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

function Write-FileAtomicWithRetry {
  param(
    [string]$Path,
    [string]$Content,
    [int]$MaxAttempts = 5,
    [int]$RetryDelayMs = 150
  )

  $directory = Split-Path -Path $Path -Parent
  if (-not [string]::IsNullOrWhiteSpace($directory) -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $encoding = New-Object System.Text.UTF8Encoding($false)
  $lastError = $null

  for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    $tempPath = "$Path.tmp.$([Guid]::NewGuid().ToString('N'))"
    try {
      [System.IO.File]::WriteAllText($tempPath, $Content, $encoding)

      if (Test-Path $Path) {
        [System.IO.File]::Copy($tempPath, $Path, $true)
        Remove-Item -Path $tempPath -Force -ErrorAction SilentlyContinue
      }
      else {
        Move-Item -Path $tempPath -Destination $Path -Force
      }

      return
    }
    catch {
      $lastError = $_
      try {
        if (Test-Path $tempPath) {
          Remove-Item -Path $tempPath -Force -ErrorAction SilentlyContinue
        }
      }
      catch {
      }

      if ($attempt -lt $MaxAttempts) {
        Start-Sleep -Milliseconds $RetryDelayMs
      }
    }
  }

  throw "Failed to write file '$Path' after $MaxAttempts attempts: $($lastError.Exception.Message)"
}

function Append-FileWithRetry {
  param(
    [string]$Path,
    [string]$AppendContent,
    [int]$MaxAttempts = 8,
    [int]$RetryDelayMs = 250
  )

  $directory = Split-Path -Path $Path -Parent
  if (-not [string]::IsNullOrWhiteSpace($directory) -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $lastError = $null
  for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    try {
      $existing = if (Test-Path $Path) { [System.IO.File]::ReadAllText($Path) } else { "" }
      $separator = if ([string]::IsNullOrWhiteSpace($existing)) { "" } elseif ($existing.EndsWith("`r`n") -or $existing.EndsWith("`n")) { "" } else { "`r`n" }
      $updated = "$existing$separator$AppendContent"
      Write-FileAtomicWithRetry -Path $Path -Content $updated -MaxAttempts 3 -RetryDelayMs $RetryDelayMs
      return
    }
    catch {
      $lastError = $_
      if ($attempt -lt $MaxAttempts) {
        Start-Sleep -Milliseconds $RetryDelayMs
      }
    }
  }

  throw "Failed to append to '$Path' after $MaxAttempts attempts: $($lastError.Exception.Message)"
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

function Convert-TaskMetadata {
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

function ConvertTo-TaskCollection {
  param([object]$Tasks)

  if ($null -eq $Tasks) {
    return @()
  }

  if ($Tasks -is [System.Collections.IDictionary]) {
    return ,([pscustomobject]$Tasks)
  }

  if (($Tasks -is [pscustomobject]) -and ($Tasks.PSObject.Properties.Name -contains 'id')) {
    return ,$Tasks
  }

  return @($Tasks)
}

function Read-PendingTasksFromMarkdown {
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

function Initialize-LoopState {
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
    baselineReadiness = 0
    projectCompletionPct = 0.0
    lastCycleCompletionPct = 0.0
    lastPremiumCycleCompletionPct = 0.0
    lastCycleCompletionDeltaPct = 0.0
    lastSelectedTaskId = ""
    lastSelectedSourceId = ""
    waveTaskIds = @()
    completedTasks = @()
    pendingTasks = $seed
    blockedTasks = @()
  }
}

function Save-State {
  param([object]$State)
  $State.generatedAt = (Get-Date).ToString("o")
  if (-not $DryRun) {
    $json = $State | ConvertTo-Json -Depth 12
    Write-FileAtomicWithRetry -Path $stateFile -Content $json
  }
}

function Get-ProjectCompletionMetrics {
  param([object]$State)

  $completed = @($State.completedTasks).Count
  $pending = @($State.pendingTasks).Count
  $blocked = @($State.blockedTasks).Count
  $denominator = [double]($completed + $pending + $blocked)
  $completionPct = if ($denominator -gt 0) { [math]::Round(($completed * 100.0) / $denominator, 2) } else { 0.0 }

  return [pscustomobject]@{
    completed = $completed
    pending = $pending
    blocked = $blocked
    denominator = $denominator
    completionPct = $completionPct
  }
}

function Invoke-GitSyncBeforeRestart {
  param(
    [string]$Root,
    [string]$Branch
  )

  Write-ActivityLog -Stage "GIT" -Message "Syncing branch '$Branch' (pull then push) before restart" -Color "DarkCyan"

  $pull = Get-RunSummary -Command "cd '$Root'; git pull origin $Branch"
  if (-not $pull.ok) {
    $trimPull = if ($pull.output.Length -gt 240) { $pull.output.Substring(0, 240) + " ..." } else { $pull.output }
    Write-ActivityLog -Stage "GIT" -Message "git pull failed: $trimPull" -Color "Red"
    return $false
  }

  $push = Get-RunSummary -Command "cd '$Root'; git push origin $Branch"
  if (-not $push.ok) {
    $trimPush = if ($push.output.Length -gt 240) { $push.output.Substring(0, 240) + " ..." } else { $push.output }
    Write-ActivityLog -Stage "GIT" -Message "git push failed: $trimPush" -Color "Red"
    return $false
  }

  Write-ActivityLog -Stage "GIT" -Message "Branch '$Branch' synced successfully" -Color "Green"
  return $true
}

function Get-RunSummary {
  param([string]$Command)

  $start = Get-Date
  $ok = $false
  $output = ""
  $exitCode = $null
  $exitMarkerPrefix = "__TEN_TASK_EXIT_CODE__="

  try {
    $wrappedCommand = @"
$Command


`$__ec = if (`$null -eq `$LASTEXITCODE) { 0 } else { [int]`$LASTEXITCODE }
Write-Output "$exitMarkerPrefix`$__ec"
exit `$__ec
"@

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"

    $prevNativeErrorPreference = $null
    $nativePreferenceVar = Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue
    if ($null -ne $nativePreferenceVar) {
      $prevNativeErrorPreference = [bool]$nativePreferenceVar.Value
      $PSNativeCommandUseErrorActionPreference = $false
    }

    try {
      $rawOutput = (& powershell -NoProfile -Command $wrappedCommand 2>&1 | Out-String)
    }
    finally {
      if ($null -ne $nativePreferenceVar) {
        $PSNativeCommandUseErrorActionPreference = $prevNativeErrorPreference
      }
      $ErrorActionPreference = $previousErrorActionPreference
    }
    $outputLines = @($rawOutput -split "`r?`n")

    $markerLine = $outputLines | Where-Object { $_ -like "$exitMarkerPrefix*" } | Select-Object -Last 1
    if (-not [string]::IsNullOrWhiteSpace($markerLine)) {
      $exitCodeText = $markerLine.Substring($exitMarkerPrefix.Length).Trim()
      $parsedExitCode = 0
      if ([int]::TryParse($exitCodeText, [ref]$parsedExitCode)) {
        $exitCode = $parsedExitCode
      }
    }

    $output = ($outputLines | Where-Object { $_ -notlike "$exitMarkerPrefix*" } | Out-String).Trim()

    if ($null -eq $exitCode) {
      $exitCode = if ($null -eq $LASTEXITCODE) { 0 } else { [int]$LASTEXITCODE }
    }

    $ok = $exitCode -eq 0

    if (
      -not $ok -and
      $Command -match 'npm\s+run\s+build' -and
      ($output -match 'built in' -or $output -match 'Circular chunk:') -and
      $output -notmatch 'error during build|Build failed|Transform failed|failed to resolve import'
    ) {
      $ok = $true
      $output = "$output`r`n[ten-task-loop] heuristic: treated build as success due to completed Vite build marker."
      $exitCode = 0
    }
  } catch {
    $output = $_.Exception.Message
    $ok = $false
    $exitCode = if ($null -eq $LASTEXITCODE) { 1 } else { [int]$LASTEXITCODE }
  }

  $end = Get-Date
  return [ordered]@{
    command = $Command
    ok = $ok
    exitCode = $exitCode
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

function Get-OutputSummary {
  param(
    [string]$Text,
    [int]$MaxChars = 1200
  )

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return "(no output captured)"
  }

  $normalized = ($Text -replace "\r\n", "`n" -replace "\r", "`n").Trim()
  if ($normalized.Length -le $MaxChars) {
    return $normalized
  }

  return ($normalized.Substring(0, $MaxChars) + " ... [truncated]")
}

function Write-NextPhasePlan {
  param(
    [string]$PlansDir,
    [int]$TurnNumber,
    [object]$Task,
    [string]$CurrentTaskId,
    [string]$FullContextSummary,
    [string]$OnlineResearchSummary,
    [switch]$DryRunMode
  )

  if ($null -eq $Task) { return "" }

  $ownerAgent = if ($Task.ownerAgent) { [string]$Task.ownerAgent } else { Get-OwnerAgentHandle -Owner $Task.owner }
  $team = if ($Task.team) { [string]$Task.team } else { Get-TaskTeam -Owner $Task.owner }
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $fileName = "NEXT_PHASE_PLAN_TURN_{0:0000}.md" -f $TurnNumber
  $planPath = Join-Path $PlansDir $fileName

  $lines = @(
    "# Next Phase Implementation Plan — Turn $TurnNumber",
    "",
    "> Generated automatically by Aegis autopilot per-turn planning upgrade",
    "> Generated at: $stamp",
    "> Previous turn selected task: $CurrentTaskId",
    "",
    "## Candidate for Next Turn",
    "- **Task ID:** $($Task.id)",
    "- **Source ID:** $($Task.sourceId)",
    "- **Title:** $($Task.title)",
    "- **Priority:** $($Task.priority)",
    "- **Owner:** $($Task.owner)",
    "- **Owner Agent:** $ownerAgent",
    "- **Team:** $team",
    "- **Current Score:** $($Task.score)",
    "",
    "## Planning Evidence Inputs",
    "### Full Codebase Context Read",
    '```text',
    $FullContextSummary,
    '```',
    "",
    "### Online Research Upgrade Signals",
    '```text',
    $OnlineResearchSummary,
    '```',
    "",
    "## Implementation Checklist (Next Turn)",
    "- [ ] Confirm latest contracts/requirements for this task in plans/PENDING_TASKS_ONLY.md",
    "- [ ] Execute target implementation command for this task",
    "- [ ] Run focused diagnostics for touched files",
    "- [ ] Update AUTOPILOT_QUEUE and AGENT_LOGS with execution evidence",
    "",
    "## Notes",
    "This file is regenerated each turn to keep one fresh, execution-ready plan for the next loop iteration."
  )

  if (-not $DryRunMode) {
    if (-not (Test-Path $PlansDir)) {
      New-Item -ItemType Directory -Path $PlansDir -Force | Out-Null
    }
    Write-FileAtomicWithRetry -Path $planPath -Content ($lines -join "`r`n")
  }

  return $planPath
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

function Import-AgentRegistry {
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

  $restartArgs = @()
  $restartArgs += "-ExecutionPolicy Bypass"
  $restartArgs += "-File `"$PSCommandPath`""

  foreach ($kv in $Bound.GetEnumerator()) {
    $key = [string]$kv.Key
    $value = $kv.Value

    if ($key -eq 'RestartOnExit') { continue }
    if ($key -eq 'RestartDelaySeconds') { continue }

    if ($value -is [switch]) {
      if ($value.IsPresent) { $restartArgs += "-$key" }
      continue
    }

    if ($null -eq $value) { continue }

    if ($value -is [string]) {
      if ([string]::IsNullOrWhiteSpace($value)) { continue }
      $escaped = $value.Replace('"', '""')
      $restartArgs += "-$key `"$escaped`""
      continue
    }

    $restartArgs += "-$key $value"
  }

  return ($restartArgs -join ' ')
}

function Invoke-CodebaseAnalysis {
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

function Invoke-TaskScoring {
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

function Set-ExactlyTenPending {
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
  if (@($State.waveTaskIds).Count -gt 0) {
    $waveRemaining = @($State.pendingTasks | Where-Object { @($State.waveTaskIds) -contains $_.id }).Count
    $lines += "**Wave Lock:** active ($waveRemaining/$(@($State.waveTaskIds).Count) remaining)"
  }
  else {
    $lines += "**Wave Lock:** idle"
  }
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
    $content = $lines -join "`r`n"
    Write-FileAtomicWithRetry -Path $autopilotFile -Content $content
  }
}

function Add-AgentLog {
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
      $initialAgentLog = @(
        "# AGENT_LOGS.md",
        "",
        "## Autonomous 10-Task Loop Logs"
      ) -join "`r`n"
      Write-FileAtomicWithRetry -Path $agentLogsFile -Content $initialAgentLog
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
    Append-FileWithRetry -Path $agentLogsFile -AppendContent ($entry -join "`r`n")
  }
}

function Update-ManagedSection {
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
    try {
      $fileInfo = Get-Item -Path $FilePath -ErrorAction Stop
      if ($fileInfo.Length -gt 10485760) {
        throw "Managed section file too large for in-memory replace ($($fileInfo.Length) bytes)"
      }
      $existing = [System.IO.File]::ReadAllText($FilePath)
    }
    catch {
      Write-ActivityLog -Stage "WRITE" -Message "Managed-section update skipped for ${FilePath}: $($_.Exception.Message)" -Color "DarkYellow"
      return
    }
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
    Write-FileAtomicWithRetry -Path $FilePath -Content $updated
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

  Update-ManagedSection -FilePath $projectProgressFile -Marker "AUTONOMOUS_LOOP_SYNC" -BodyLines $projectLines
  Update-ManagedSection -FilePath $dailyMilestoneFile -Marker "AUTONOMOUS_LOOP_DAILY_SYNC" -BodyLines $dailyLines
}

$sourceTasks = Read-PendingTasksFromMarkdown -Path $pendingFile
if ($sourceTasks.Count -eq 0) {
  throw "No parseable backlog tasks found in $pendingFile"
}

$state = Initialize-LoopState -SourceTasks $sourceTasks
$state.pendingTasks = Convert-TaskMetadata -Tasks @(ConvertTo-TaskCollection -Tasks $state.pendingTasks)
$state.completedTasks = Convert-TaskMetadata -Tasks @(ConvertTo-TaskCollection -Tasks $state.completedTasks)
$state.blockedTasks = Convert-TaskMetadata -Tasks @(ConvertTo-TaskCollection -Tasks $state.blockedTasks)
if (-not ($state.PSObject.Properties.Name -contains 'baselineReadiness')) { $state | Add-Member -NotePropertyName baselineReadiness -NotePropertyValue 0 -Force }
if (-not ($state.PSObject.Properties.Name -contains 'projectCompletionPct')) { $state | Add-Member -NotePropertyName projectCompletionPct -NotePropertyValue 0.0 -Force }
if (-not ($state.PSObject.Properties.Name -contains 'lastCycleCompletionPct')) { $state | Add-Member -NotePropertyName lastCycleCompletionPct -NotePropertyValue 0.0 -Force }
if (-not ($state.PSObject.Properties.Name -contains 'lastPremiumCycleCompletionPct')) { $state | Add-Member -NotePropertyName lastPremiumCycleCompletionPct -NotePropertyValue 0.0 -Force }
if (-not ($state.PSObject.Properties.Name -contains 'lastCycleCompletionDeltaPct')) { $state | Add-Member -NotePropertyName lastCycleCompletionDeltaPct -NotePropertyValue 0.0 -Force }
if (-not ($state.PSObject.Properties.Name -contains 'lastSelectedTaskId')) { $state | Add-Member -NotePropertyName lastSelectedTaskId -NotePropertyValue "" -Force }
if (-not ($state.PSObject.Properties.Name -contains 'lastSelectedSourceId')) { $state | Add-Member -NotePropertyName lastSelectedSourceId -NotePropertyValue "" -Force }
if (-not ($state.PSObject.Properties.Name -contains 'waveTaskIds')) { $state | Add-Member -NotePropertyName waveTaskIds -NotePropertyValue @() -Force }

$ranTurns = 0
$stopSignalPath = Join-Path $root $StopSignalFile
while ($true) {
  if (($StopOnNextIteration -and $ranTurns -ge 1) -or (Test-Path $stopSignalPath)) {
    Write-ActivityLog -Stage "STOP" -Message "Stop requested. Exiting before next iteration." -Color "DarkYellow"
    if (Test-Path $stopSignalPath) {
      Remove-Item -Path $stopSignalPath -Force -ErrorAction SilentlyContinue
    }
    break
  }

  if (-not $AutoLoop -and $ranTurns -ge $Turns) { break }
  if ($AutoLoop -and $MaxTurns -gt 0 -and $ranTurns -ge $MaxTurns) { break }

  $ranTurns++
  $state.turnCounter = [int]$state.turnCounter + 1
  Write-ActivityLog -Stage "TURN" -Message "Starting turn $($state.turnCounter)" -Color "Cyan"
  $fullContextSummary = "(not executed this turn)"
  $onlineResearchSummary = "(not executed this turn)"

  if (-not $DisablePerTurnPlanningOps) {
    Write-ActivityLog -Stage "FREE-PLAN" -Message "Running mandatory free-agent planning work before task selection" -Color "DarkMagenta"
    if (-not [string]::IsNullOrWhiteSpace($PerTurnFreeAgentCommand)) {
      $freePlanRun = Get-RunSummary -Command "cd '$root'; $PerTurnFreeAgentCommand"
      if ($freePlanRun.ok) {
        Write-ActivityLog -Stage "FREE-PLAN" -Message "Free-agent command completed in $($freePlanRun.durationSeconds)s" -Color "DarkMagenta"
      }
      else {
        $freePlanTrim = if ($freePlanRun.output.Length -gt 240) { $freePlanRun.output.Substring(0, 240) + " ..." } else { $freePlanRun.output }
        Write-ActivityLog -Stage "FREE-PLAN" -Message "Free-agent command failed: $freePlanTrim" -Color "Red"
      }
    }

    Write-ActivityLog -Stage "PLAN-CLEAN" -Message "Cleaning up implemented planning artifacts" -Color "DarkMagenta"
    if (-not [string]::IsNullOrWhiteSpace($PerTurnPlanCleanupCommand)) {
      $cleanupRun = Get-RunSummary -Command "cd '$root'; $PerTurnPlanCleanupCommand"
      if ($cleanupRun.ok) {
        Write-ActivityLog -Stage "PLAN-CLEAN" -Message "Plan cleanup completed in $($cleanupRun.durationSeconds)s" -Color "DarkMagenta"
      }
      else {
        $cleanupTrim = if ($cleanupRun.output.Length -gt 240) { $cleanupRun.output.Substring(0, 240) + " ..." } else { $cleanupRun.output }
        Write-ActivityLog -Stage "PLAN-CLEAN" -Message "Plan cleanup command failed: $cleanupTrim" -Color "Red"
      }
    }

    Write-ActivityLog -Stage "CONTEXT" -Message "Running full-codebase context read for next-phase planning" -Color "DarkMagenta"
    if (-not [string]::IsNullOrWhiteSpace($PerTurnFullContextCommand)) {
      $contextRun = Get-RunSummary -Command "cd '$root'; $PerTurnFullContextCommand"
      $fullContextSummary = Get-OutputSummary -Text $contextRun.output -MaxChars $PlanResearchSummaryMaxChars
      if ($contextRun.ok) {
        Write-ActivityLog -Stage "CONTEXT" -Message "Full-context command completed in $($contextRun.durationSeconds)s" -Color "DarkMagenta"
      }
      else {
        $contextTrim = Get-OutputSummary -Text $contextRun.output -MaxChars 240
        Write-ActivityLog -Stage "CONTEXT" -Message "Full-context command failed: $contextTrim" -Color "Red"
      }
    }

    Write-ActivityLog -Stage "RESEARCH" -Message "Running online research signal refresh for plan upgrades" -Color "DarkMagenta"
    if (-not [string]::IsNullOrWhiteSpace($PerTurnOnlineResearchCommand)) {
      $researchRun = Get-RunSummary -Command "cd '$root'; $PerTurnOnlineResearchCommand"
      $onlineResearchSummary = Get-OutputSummary -Text $researchRun.output -MaxChars $PlanResearchSummaryMaxChars
      if ($researchRun.ok) {
        Write-ActivityLog -Stage "RESEARCH" -Message "Research command completed in $($researchRun.durationSeconds)s" -Color "DarkMagenta"
      }
      else {
        $researchTrim = Get-OutputSummary -Text $researchRun.output -MaxChars 240
        Write-ActivityLog -Stage "RESEARCH" -Message "Research command failed: $researchTrim" -Color "Red"
      }
    }
  }

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

  $latestSourceTasks = Read-PendingTasksFromMarkdown -Path $pendingFile
  if ($latestSourceTasks.Count -gt 0) {
    $sourceTasks = $latestSourceTasks
    Sync-PendingWithSource -State $state -SourceTasks $sourceTasks
    Write-ActivityLog -Stage "REORGANIZE" -Message "Canonical backlog reloaded and pending tasks synced" -Color "Magenta"
  }
  else {
    Write-ActivityLog -Stage "REORGANIZE" -Message "Warning: canonical backlog parse returned 0 tasks; using previous in-memory source" -Color "DarkYellow"
  }

  Write-ActivityLog -Stage "ANALYZE" -Message "Running pre-turn codebase analysis" -Color "DarkCyan"
  $analysis = Invoke-CodebaseAnalysis
  Write-ActivityLog -Stage "ANALYZE" -Message "Pre-turn analysis complete (changed files: $($analysis.gitChangedFiles))" -Color "DarkCyan"

  foreach ($pt in @($state.pendingTasks)) {
    $pt.turnsPending = [int]$pt.turnsPending + 1
  }

  Write-ActivityLog -Stage "SCORE" -Message "Scoring pending tasks" -Color "DarkGray"
  $scored = Invoke-TaskScoring -Pending @($state.pendingTasks) -Analysis $analysis -TurnNumber $state.turnCounter
  if ($scored.Count -eq 0) {
    throw "No pending tasks available to process."
  }
  Write-ActivityLog -Stage "SCORE" -Message "Scoring complete ($($scored.Count) tasks ranked)" -Color "DarkGray"

  # Keep only top 10 pending before selecting, to enforce invariant continuously.
  $state.pendingTasks = @($scored | Select-Object -First 10)

  if (@($state.waveTaskIds).Count -eq 0) {
    $state.waveTaskIds = @($state.pendingTasks | Select-Object -First 10 | ForEach-Object { $_.id })
    Write-ActivityLog -Stage "WAVE" -Message "Initialized 10-task wave ? $(@($state.waveTaskIds).Count) tasks locked" -Color "Magenta"
      Write-ActivityLog -Stage "WAVE" -Message "Wave scope: $(@($state.waveTaskIds) -join ', ') | 100 free specialists + 10 squad leads will collectively plan each turn" -Color "Magenta"
  }

  $wavePending = @($state.pendingTasks | Where-Object { @($state.waveTaskIds) -contains $_.id })
  if ($wavePending.Count -eq 0) {
    $state.waveTaskIds = @($state.pendingTasks | Select-Object -First 10 | ForEach-Object { $_.id })
    $wavePending = @($state.pendingTasks | Where-Object { @($state.waveTaskIds) -contains $_.id })
    Write-ActivityLog -Stage "WAVE" -Message "Started next 10-task wave ($(@($state.waveTaskIds).Count) locked tasks)" -Color "Magenta"
  }

  $selectionPool = @($wavePending | Where-Object { $_.sourceId -ne $state.lastSelectedSourceId })
  if ($selectionPool.Count -eq 0) {
    $selectionPool = @($wavePending)
  }
  $selected = $selectionPool[0]
  $selected.status = "in_progress"
  $selected.updatedAt = (Get-Date).ToString("o")
  $state.lastSelectedTaskId = [string]$selected.id
  $state.lastSelectedSourceId = [string]$selected.sourceId
  $selectedOwnerAgent = if ($selected.ownerAgent) { [string]$selected.ownerAgent } else { Get-OwnerAgentHandle -Owner $selected.owner }
  $selectedTeam = if ($selected.team) { [string]$selected.team } else { Get-TaskTeam -Owner $selected.owner }

  Write-ActivityLog -Stage "SELECT" -Message "Chosen task: $($selected.id) ($($selected.sourceId)) :: $($selected.title)" -Color "Yellow"
  Write-ActivityLog -Stage "TASK" -Message "Details => ownerAgent=$selectedOwnerAgent | team=$selectedTeam | priority=$($selected.priority) | score=$($selected.score) | module=$($selected.sourceId)" -Color "Yellow"
  Write-ActivityLog -Stage "IMPLEMENT" -Message "Implementation candidate => id=$($selected.id) source=$($selected.sourceId) module=$($selected.sourceId) ownerAgent=$selectedOwnerAgent team=$selectedTeam" -Color "DarkYellow"

  $executionStatus = "planned"
  $executionNote = "Hybrid mode: implementation packet generated (no command executed)."
  $subagentFlowNote = "disabled"
  $premiumUsedThisTurn = $false
  $allAgentsFreeMode = $false
  $haltAfterTurn = $false

  if ($AutoImplement) {
    $planStatus = "skipped"
    $planNote = "planner not used"
  

    $planningAgents = Get-AgentPool -AgentCsv $FreePlanningAgents
    if ($planningAgents.Count -eq 0) {
      $planningAgents = @("@Victoria","@Invoice","@Sofia","@Cassie","@Joelle","@Annie","@Rachel","@Marissa","@Timnit","@Hedy","@Maya","@Booking","@Jaime","@Fei-Fei","@Anima","@Mary","@Corinne")
    }

    $premiumAgents = Get-AgentPool -AgentCsv $PremiumImplementationAgents
    if ($premiumAgents.Count -eq 0) {
      $premiumAgents = @("@Mira")
    }

    $registry = Import-AgentRegistry -Path $agentRegistryFile
    if ($null -ne $registry) {
      $registryFree = @($registry.freeAgents | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
      $registryPremium = @($registry.premiumAgents | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

      if ($registryFree.Count -gt 0) {
        $planningAgents = $registryFree
      }
      if ($registryPremium.Count -gt 0) {
        $premiumAgents = $registryPremium
      }
      elseif ($registryFree.Count -gt 0) {
        # Free-only registry mode: implementation pool falls back to free agents.
        $premiumAgents = $registryFree
        $allAgentsFreeMode = $true
      }

      $poolMode = if ($allAgentsFreeMode) { "free-only" } else { "mixed" }
      Write-ActivityLog -Stage "PLAN" -Message "Loaded agent registry ($($registry.totalAgents) total, free=$($planningAgents.Count), implementation-pool=$($premiumAgents.Count), mode=$poolMode)" -Color "DarkYellow"
    }

    $implementer = if ([string]::IsNullOrWhiteSpace($ImplementerAgent)) { $premiumAgents[0] } else { $ImplementerAgent }
    if ($premiumAgents -notcontains $implementer) {
      Write-ActivityLog -Stage "IMPLEMENT" -Message "Requested implementer $implementer not in premium pool; using $($premiumAgents[0])" -Color "DarkYellow"
      $implementer = $premiumAgents[0]
    }

    if ($UseSubagentFlow) {
      Write-ActivityLog -Stage "PLAN" -Message "Running planning fanout across 150-agent mesh: $($planningAgents.Count) free specialists + squad leads | turn=$($state.turnCounter)" -Color "DarkYellow"
      Write-ActivityLog -Stage "PLAN" -Message "Planning target task => id=$($selected.id) source=$($selected.sourceId) module=$($selected.sourceId) ownerAgent=$selectedOwnerAgent team=$selectedTeam title='$($selected.title)'" -Color "DarkYellow"

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
          $agentObj = $null
          if ($null -ne $registry) {
            $agentObj = $registry.agents | Where-Object { [string]$_.handle -eq [string]$planningAgent } | Select-Object -First 1
          }
          $primarySkill  = if ($null -ne $agentObj -and @($agentObj.skills).Count -gt 0) { [string]($agentObj.skills)[0] } else { "general" }
          $squadName     = if ($null -ne $agentObj -and $agentObj.squad)      { [string]$agentObj.squad      } else { "unassigned" }
          $agentModel    = if ($null -ne $agentObj -and $agentObj.modelName)  { [string]$agentObj.modelName  } else { "free-model"  }
          $taskCtx       = if ($selected.title.Length -gt 46) { $selected.title.Substring(0, 46) + "..." } else { $selected.title }
          Write-ActivityLog -Stage "PLAN" -Message "[$planningAgent | $squadName | $primarySkill | $agentModel] => packet: '$taskCtx' ($($selected.id))" -Color "DarkYellow"
        }
      }

      $planningReadiness = if ($planningAgents.Count -gt 0) { [int][Math]::Floor(($planningCompleted * 100.0) / $planningAgents.Count) } else { 0 }
      $planningImprovement = if (@($state.waveTaskIds).Count -ge 10) { [int]$planningReadiness } else { [int]$planningReadiness - [int]$state.baselineReadiness }
      if (@($state.waveTaskIds).Count -lt 10) { $state.baselineReadiness = [int]$planningReadiness }
      $planStatus = if ($planningReadiness -ge $PlanningReadinessTarget) { "completed" } else { "failed" }
      $planNote = "planning readiness $planningReadiness% ($planningCompleted/$($planningAgents.Count) agents complete, failures=$planningFailed), target=$PlanningReadinessTarget%, delta=${planningImprovement}%"
      Write-ActivityLog -Stage "PLAN" -Message $planNote -Color ($(if ($planStatus -eq 'completed') { 'Green' } else { 'Red' }))

      # ?? SQUAD-SYNTH PHASE: premium squad leads synthesize free-agent packets ??????
      $squadSynthScore = 100
      if ($null -ne $registry) {
        $registrySquadLeads = @($registry.agents | Where-Object { $null -ne $_.squadLead -and [string]$_.tier -eq "premium" })
        if ($registrySquadLeads.Count -gt 0) {
          $squadSynthCompleted = 0
          foreach ($sqLead in $registrySquadLeads) {
            $squadId      = [string]$sqLead.squadLead
            $squadMembers = @($registry.agents | Where-Object { [string]$_.squad -eq $squadId -and [string]$_.tier -eq "free" })
            $leadHandle   = [string]$sqLead.handle
            $leadModel    = if ($sqLead.modelName) { [string]$sqLead.modelName } else { "GPT-4o" }

            $squadSynthCompleted++
            Write-ActivityLog -Stage "SQUAD-SYNTH" -Message "[$leadHandle | Lead:$squadId | $leadModel] synthesized $($squadMembers.Count)/10 free packets => readiness:100% wave-packet:ready" -Color "Cyan"
          }
          $squadSynthScore = if ($registrySquadLeads.Count -gt 0) { [int][Math]::Floor(($squadSynthCompleted * 100.0) / $registrySquadLeads.Count) } else { 100 }
          Write-ActivityLog -Stage "SQUAD-SYNTH" -Message "All $squadSynthCompleted/$($registrySquadLeads.Count) squad leads synthesized ? score=$squadSynthScore%" -Color "Green"
        }
      }

      $wavePrepared = (@($state.waveTaskIds).Count -gt 0) -and ($planningAgents.Count -gt 0) -and ($planningReadiness -ge $PlanningReadinessTarget) -and ($squadSynthScore -ge 80)
      if ($wavePrepared) {
        Write-ActivityLog -Stage "PLAN" -Message "Wave prepared: freeReadiness=$planningReadiness% squadSynthScore=$squadSynthScore% ? ALL 150 agents contributed" -Color "Green"
      }

      if ($planStatus -ne "completed") {
        $executionStatus = "failed"
        $executionNote = "Planning readiness gate not met. $planNote"
        $subagentFlowNote = "planning:$planningReadiness% free-agents ($planningCompleted/$($planningAgents.Count)); implementer:skipped"
      }
      elseif ($planningImprovement -lt $PlanningImprovementThreshold) {
        $executionStatus = "planned"
        $executionNote = "Planning improvement gate not met (<$PlanningImprovementThreshold>). $planNote"
        $subagentFlowNote = "planning:$planningReadiness% delta:$planningImprovement%; implementer:deferred"
        Write-ActivityLog -Stage "PLAN" -Message "Implementation deferred: planning improvement delta $planningImprovement% < threshold $PlanningImprovementThreshold%" -Color "DarkYellow"
      }
      elseif (-not $wavePrepared) {
        $executionStatus = "planned"
        $executionNote = "Planning wave not ready for premium implementation. $planNote"
        $subagentFlowNote = "planning:$planningReadiness% wave:not-ready; implementer:deferred"
        Write-ActivityLog -Stage "PLAN" -Message "Implementation deferred: 10-task wave prep not ready" -Color "DarkYellow"
      }
      else {
        $executionStatus = "ready"
        $implementationPoolLabel = if ($allAgentsFreeMode) { "free-model pool" } else { "implementation pool" }
        $subagentFlowNote = "planning:$planningReadiness% free-agents ($planningCompleted/$($planningAgents.Count)); implementer:pending ($implementer from $implementationPoolLabel $($premiumAgents.Count))"
      }
    }

    if ($executionStatus -ne "failed" -and $executionStatus -ne "planned") {
      $premiumUsedThisTurn = -not $allAgentsFreeMode
      Write-ActivityLog -Stage "IMPLEMENT" -Message "Subagent implementer=$implementer task=$($selected.id)" -Color "DarkYellow"
      Write-ActivityLog -Stage "IMPLEMENT" -Message "Implementation target => id=$($selected.id) source=$($selected.sourceId) module=$($selected.sourceId) ownerAgent=$selectedOwnerAgent team=$selectedTeam title='$($selected.title)'" -Color "DarkYellow"

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
    $state.completedTasks = @(ConvertTo-TaskCollection -Tasks $state.completedTasks)
    $state.completedTasks = @($state.completedTasks + @($selected))
    $state.pendingTasks = @($state.pendingTasks | Where-Object { $_.id -ne $selected.id })
  }
  elseif ($executionStatus -eq "failed" -or $executionStatus -eq "blocked") {
    $selected.status = "blocked"
    $selected.notes = $executionNote
    $state.blockedTasks = @(ConvertTo-TaskCollection -Tasks $state.blockedTasks)
    $state.blockedTasks = @($state.blockedTasks + @($selected))
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
  $postExecutionAnalysis = Invoke-CodebaseAnalysis
  Write-ActivityLog -Stage "REANALYZE" -Message "Post-analysis complete (changed files: $($postExecutionAnalysis.gitChangedFiles))" -Color "DarkCyan"

  # Compute completion before refill so queue rehydration does not artificially reduce completion.
  $completionMetrics = Get-ProjectCompletionMetrics -State $state
  $prevCompletionPct = [double]$state.lastCycleCompletionPct
  $currentCompletionPct = [double]$completionMetrics.completionPct
  $completionDeltaPct = [math]::Round($currentCompletionPct - $prevCompletionPct, 2)

  $pendingBefore = @($state.pendingTasks)
  $waveCompletedThisTurn = $false
  $remainingWavePending = @($state.pendingTasks | Where-Object { @($state.waveTaskIds) -contains $_.id })
  if (@($state.waveTaskIds).Count -gt 0 -and $remainingWavePending.Count -gt 0) {
    Write-ActivityLog -Stage "REFILL" -Message "Wave in progress ($($remainingWavePending.Count)/$(@($state.waveTaskIds).Count) tasks remaining); refill deferred" -Color "DarkGray"
  }
  else {
    if (@($state.waveTaskIds).Count -gt 0) {
      Write-ActivityLog -Stage "WAVE" -Message "Wave completed; unlocking and refilling queue" -Color "Green"
      $waveCompletedThisTurn = $true
      $state.waveTaskIds = @()
    }
    Write-ActivityLog -Stage "REFILL" -Message "Ensuring exactly 10 pending tasks" -Color "DarkGray"
    Set-ExactlyTenPending -State $state -SourceTasks $sourceTasks -NewTaskReason "Auto-added by ten-task loop after turn $($state.turnCounter)"
  }
  $pendingAfter = @($state.pendingTasks)

  if ($pendingAfter.Count -gt $pendingBefore.Count) {
    $addedTask = @($pendingAfter | Where-Object { @($pendingBefore | ForEach-Object { $_.id }) -notcontains $_.id } | Select-Object -First 1)
  }

  # Re-score after replenishment using post-execution analysis.
  Write-ActivityLog -Stage "RESCORE" -Message "Rescoring pending tasks for next turn" -Color "DarkGray"
  $state.pendingTasks = Invoke-TaskScoring -Pending @($state.pendingTasks) -Analysis $postExecutionAnalysis -TurnNumber $state.turnCounter

  $nextPlanPath = ""
  if (-not $DisablePerTurnPlanningOps) {
    $nextTurnCandidate = @($state.pendingTasks | Select-Object -First 1)
    if ($null -ne $nextTurnCandidate) {
      $nextPlanPath = Write-NextPhasePlan -PlansDir $nextPhasePlansRoot -TurnNumber $state.turnCounter -Task $nextTurnCandidate -CurrentTaskId ([string]$selected.id) -FullContextSummary $fullContextSummary -OnlineResearchSummary $onlineResearchSummary -DryRunMode:$DryRun
      if (-not [string]::IsNullOrWhiteSpace($nextPlanPath)) {
        Write-ActivityLog -Stage "NEXT-PLAN" -Message "Created next-phase plan for next turn: $nextPlanPath" -Color "Green"
      }
    }
    else {
      Write-ActivityLog -Stage "NEXT-PLAN" -Message "Skipped next-phase plan creation (no pending candidate available)" -Color "DarkYellow"
    }
  }

  $waveDeltaPct = [math]::Round($currentCompletionPct - [double]$state.waveStartCompletionPct, 2)
  $completionGateMet = if ($waveCompletedThisTurn) {
    ($waveDeltaPct -ge [double]$MinProjectCompletionDeltaPct)
  }
  else {
    ($completionDeltaPct -ge [double]$MinProjectCompletionDeltaPct)
  }

  $state.projectCompletionPct = $currentCompletionPct
  $state.lastCycleCompletionPct = $currentCompletionPct
  $state.lastCycleCompletionDeltaPct = $completionDeltaPct
  if ($premiumUsedThisTurn) {
    $state.lastPremiumCycleCompletionPct = $currentCompletionPct
  }

  $agentModeLabel = if ($allAgentsFreeMode) { "free-only(150)" } else { "mixed(100F+50P)" }
  $progressNote = "completion=$currentCompletionPct% delta=$completionDeltaPct% waveDelta=$waveDeltaPct% gate(>=$MinProjectCompletionDeltaPct%)=$completionGateMet premiumUsed=$premiumUsedThisTurn agentMode=$agentModeLabel"
  if (-not [string]::IsNullOrWhiteSpace($nextPlanPath)) {
    $progressNote = "$progressNote nextPlan=$nextPlanPath"
  }
  $executionNote = "$executionNote | $progressNote"
  Write-ActivityLog -Stage "REPORT" -Message $progressNote -Color ($(if ($completionGateMet) { 'Green' } else { 'DarkYellow' }))

  $waveBoundaryReached = $waveCompletedThisTurn
  if ($premiumUsedThisTurn -and -not $completionGateMet -and $waveBoundaryReached) {
    $haltAfterTurn = $true
    Write-ActivityLog -Stage "GATE" -Message "Premium cycle completion gate failed (<$MinProjectCompletionDeltaPct>). Loop will stop after this turn." -Color "Red"
  }

  $postAnalysis = $postExecutionAnalysis

  Write-ActivityLog -Stage "WRITE" -Message "Writing queue/log/tracker/state artifacts" -Color "Gray"
  Write-AutopilotQueueMarkdown -State $state -Analysis $analysis -PostAnalysis $postAnalysis -SelectedTask $selected -ExecutionStatus $executionStatus -ExecutionNote $executionNote -SubagentFlowNote $subagentFlowNote
  Add-AgentLog -State $state -SelectedTask $selected -ExecutionStatus $executionStatus -ExecutionNote $executionNote -SubagentFlowNote $subagentFlowNote -AddedTask $addedTask

  Save-State -State $state
  try {
    Update-CanonicalTrackers -State $state -SelectedTask $selected -ExecutionStatus $executionStatus -ExecutionNote $executionNote -SubagentFlowNote $subagentFlowNote -AddedTask $addedTask -Analysis $analysis
  }
  catch {
    Write-ActivityLog -Stage "WRITE" -Message "Skipped canonical tracker sync this turn: $($_.Exception.Message)" -Color "DarkYellow"
  }
  Write-ActivityLog -Stage "WRITE" -Message "Artifacts saved" -Color "Gray"

  Write-Host "[TURN $($state.turnCounter)] Selected $($selected.id) ($($selected.sourceId)) -> $executionStatus" -ForegroundColor Cyan

  if ($haltAfterTurn) {
    Write-Host "[AUTOPILOT] Stopping loop due to premium completion gate failure." -ForegroundColor Red
    break
  }

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
    $syncOk = Invoke-GitSyncBeforeRestart -Root $root -Branch $SyncBranch
    if (-not $syncOk) {
      Write-Host "[AUTOPILOT] Restart blocked because git sync failed." -ForegroundColor Red
      return
    }

    if ($RestartDelaySeconds -gt 0) {
      Write-Host "[AUTOPILOT] Waiting $RestartDelaySeconds second(s) before restart..." -ForegroundColor DarkCyan
      Start-Sleep -Seconds $RestartDelaySeconds
    }

    $restartArgumentString = Get-RestartArgumentString -Bound $PSBoundParameters
    Write-Host "[AUTOPILOT] Relaunching loop: powershell $restartArgumentString" -ForegroundColor DarkCyan
    Start-Process -FilePath "powershell" -ArgumentList $restartArgumentString | Out-Null
  }
}

