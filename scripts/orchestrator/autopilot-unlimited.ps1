# autopilot-unlimited.ps1 --- White Caves Unlimited Autopilot Loop
#
# Every iteration of the loop runs the full intelligence cycle:
#
#   PHASE 1 --- Research    : Run codebase-scan.js (all 20 research analysts' findings)
#   PHASE 2 --- Reprioritise: Run reprioritize.js  (smart task ordering)
#   PHASE 3 --- Dispatch    : Print the dispatch packet for the next task
#   PHASE 4 --- Implement   : Execute agent-loop.ps1 -Autopilot -Once (one task)
#   PHASE 5 --- Validate    : npm run build + typecheck
#   PHASE 6 --- Record      : Write session snapshot + commit progress
#   LOOP     : Back to Phase 1 (unlimited unless -MaxSessions or hard stop)
#
# Usage:
#   npm run autopilot:unlimited
#   powershell -File autopilot-unlimited.ps1
#   powershell -File autopilot-unlimited.ps1 -MaxSessions 3
#   powershell -File autopilot-unlimited.ps1 -MaxSessions 0   # truly unlimited
#   powershell -File autopilot-unlimited.ps1 -SkipBuild       # skip build validation per session
#   powershell -File autopilot-unlimited.ps1 -DryRun          # research + reprioritise only, no coding
#
# Hard stop conditions (autopilot pauses and waits for human):
#   - Build non-zero after phase 5
#   - TypeScript errors > 0 after phase 5
#   - Security flag detected in codebase scan
#   - Explicit PAUSE file: logs/orchestrator/PAUSE
#
# Resume after resolving a hard stop:
#   Remove-Item logs/orchestrator/PAUSE -ErrorAction SilentlyContinue
#   npm run autopilot:unlimited

param(
  [string]$WorkspaceRoot = ".",
  [int]   $MaxSessions   = 0,        # 0 = unlimited
  [switch]$SkipBuild,                # skip npm run build validation per session
  [switch]$SkipScan,                 # reuse cached scan report
  [switch]$DryRun,                   # research + reprioritise only; no coding
  [int]   $SessionDelaySec = 5,      # pause between sessions (seconds)
  [switch]$NoCommit,                 # skip git commit between sessions
  [bool]$AutoGeneratePlansWhenIdle = $true,
  [int]$CheckpointEverySessions = 5,
  [switch]$CheckpointStopOnFailure,
  [int]$GitHubIssueTarget = 50,
  [int]$GitHubIssueBootstrapPerRun = 3,
  [int]$GitHubWaveBatchSize = 3,
  [int]$GitHubSyncEverySessions = 1,
  [bool]$GitHubSyncOnlyWhenIdle = $false
)

$ErrorActionPreference = "Continue"
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$logsDir  = Join-Path $root "logs\orchestrator"
$recoveryStateFile = Join-Path $logsDir "autopilot-recovery-state.json"
$recoveryEventsFile = Join-Path $logsDir "autopilot-recovery-events.json"
$turnStateFile = Join-Path $logsDir "autopilot-turn-state.json"
$discoveryReportFile = Join-Path $logsDir "discover-upgrade-report.json"
$discoveryGateFailFile = Join-Path $logsDir "DISCOVERY_GATE_FAIL.json"
$w        = 72

# ------ Ensure logs directory exists ---------------------------------------------------------------------------------------------------------------------------
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir -Force | Out-Null }

# ------ Counters ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
$sessionNum   = 0
$passCount    = 0
$failCount    = 0
$hardStopHit  = $false
$startTime    = Get-Date
$consecutiveNoTaskCount = 0
$totalRecoveryAttempts = 0
$currentRecoveryDelaySec = $SessionDelaySec
$lastRecoveryStage = "none"
$lastRecoveryOutcome = "init"
$lastRecoveryDetail = "Autopilot boot"
$discoveryGateHardStop = $false
$discoveryGateReason = ""

# ------ Utilities ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Banner($msg, $color = "Cyan") {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor $color
  Write-Host "  $msg" -ForegroundColor $color
  Write-Host ("=" * $w) -ForegroundColor $color
}

function Phase($num, $title) {
  Write-Host ""
  Write-Host ("---" * $w) -ForegroundColor DarkCyan
  Write-Host ("  PHASE $num --- $title") -ForegroundColor Yellow
  Write-Host ("---" * $w) -ForegroundColor DarkCyan
}

function CheckPauseFile() {
  $pauseFile = Join-Path $logsDir "PAUSE"
  return (Test-Path $pauseFile)
}

function RunNode($scriptFile, $extraArgs = @()) {
  $full = Join-Path $scripts $scriptFile
  if (-not (Test-Path $full)) {
    Write-Host "  [SKIP] Script not found: $full" -ForegroundColor DarkYellow
    return $false
  }
  & node $full @extraArgs
  return ($LASTEXITCODE -eq 0)
}

function RunNpm($command) {
  & npm run $command 2>&1
  return ($LASTEXITCODE -eq 0)
}

function GetProjectGitHubToken() {
  $envFiles = @(
    (Join-Path $root ".env.local"),
    (Join-Path $root ".env")
  )

  foreach ($envFile in $envFiles) {
    if (-not (Test-Path $envFile)) {
      continue
    }

    try {
      $match = Get-Content $envFile | Where-Object { $_ -match '^\s*GITHUB_TOKEN\s*=' } | Select-Object -First 1
      if ($null -eq $match) {
        continue
      }

      $value = ($match -replace '^\s*GITHUB_TOKEN\s*=\s*', '').Trim()
      if ($value) {
        return $value.Trim('"').Trim("'")
      }
    }
    catch {
      continue
    }
  }

  return ""
}

function EnsureGitHubLoginBeforeAegis() {
  $token = ([string]$env:GITHUB_TOKEN).Trim()
  if (-not $token) {
    $token = ([string](GetProjectGitHubToken)).Trim()
  }

  if ($token -and $token -notmatch 'newtokenhere|your-token|changeme|example|placeholder') {
    try {
      $headers = @{
        Authorization = "Bearer $token"
        Accept        = 'application/vnd.github+json'
        'User-Agent'  = 'white-caves-aegis-autopilot'
      }
      Invoke-RestMethod -Method Get -Uri 'https://api.github.com/user' -Headers $headers -TimeoutSec 10 | Out-Null
      Write-Host "  [GITHUB] Valid GitHub PAT detected in project env; issue/milestone sync is enabled." -ForegroundColor Green
      return $true
    }
    catch {
      Write-Host "  [GITHUB] Project PAT found but invalid/expired for GitHub API writes." -ForegroundColor Yellow
    }
  }

  $ghCommand = Get-Command gh -ErrorAction SilentlyContinue

  if ($null -eq $ghCommand) {
    Write-Host "  [GITHUB] GitHub CLI (gh) is not installed or not on PATH." -ForegroundColor Yellow
    Write-Host "  [GITHUB] Running in degraded mode (no GitHub issue/milestone writes)." -ForegroundColor Yellow
    Write-Host "  [GITHUB] To enable writes: install gh and run 'gh auth login' or set a valid GITHUB_TOKEN in .env.local." -ForegroundColor Yellow
    return $true
  }

  & gh auth status 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  [GITHUB] GitHub CLI auth is ready." -ForegroundColor Green
    return $true
  }

  Write-Host "  [GITHUB] gh is installed but not authenticated." -ForegroundColor Yellow
  Write-Host "  [GITHUB] Running in degraded mode (no GitHub issue/milestone writes)." -ForegroundColor Yellow
  Write-Host "  [GITHUB] To enable writes: run 'gh auth login' or configure a valid PAT in .env.local." -ForegroundColor Yellow
  return $true
}

if (-not (EnsureGitHubLoginBeforeAegis)) {
  exit 1
}

function RunCheckpointValidation() {
  param(
    [int]$CurrentSession,
    [switch]$SkipBuildChecks
  )

  if ($CheckpointEverySessions -le 0) {
    return $true
  }

  if (($CurrentSession % $CheckpointEverySessions) -ne 0) {
    return $true
  }

  Write-Host ""
  Write-Host ("  [CHECKPOINT] Session #{0}: running periodic validation" -f $CurrentSession) -ForegroundColor Cyan

  $checkpointOk = $true

  if (-not (RunNpm "plans:validate")) {
    Write-Host "  [CHECKPOINT] plans:validate FAILED" -ForegroundColor Red
    $checkpointOk = $false
  }
  else {
    Write-Host "  [CHECKPOINT] plans:validate passed" -ForegroundColor Green
  }

  if ($SkipBuildChecks) {
    if (-not (RunNpm "typecheck")) {
      Write-Host "  [CHECKPOINT] typecheck FAILED" -ForegroundColor Red
      $checkpointOk = $false
    }
    else {
      Write-Host "  [CHECKPOINT] typecheck passed" -ForegroundColor Green
    }
  }
  else {
    if (-not (RunNpm "quality:quick")) {
      Write-Host "  [CHECKPOINT] quality:quick FAILED" -ForegroundColor Red
      $checkpointOk = $false
    }
    else {
      Write-Host "  [CHECKPOINT] quality:quick passed" -ForegroundColor Green
    }
  }

  return $checkpointOk
}

function ReadScanReport() {
  $reportFile = Join-Path $logsDir "codebase-scan-report.json"
  if (-not (Test-Path $reportFile)) { return $null }
  try { return Get-Content $reportFile | ConvertFrom-Json }
  catch { return $null }
}

function ReadDiscoveryReport() {
  if (-not (Test-Path $discoveryReportFile)) { return $null }
  try { return Get-Content $discoveryReportFile | ConvertFrom-Json }
  catch { return $null }
}

function TrySyncGitHubIssueRoadmap() {
  Write-Host ""
  Write-Host "  [GITHUB-ROADMAP] Refreshing GitHub issue roadmap and milestone waves..." -ForegroundColor Cyan

  $safeRoadmapScript = Join-Path $scripts "aegis-roadmap-sync-safe.js"
  $roadmapScript = Join-Path $scripts "github-issue-roadmap.js"

  if (-not (Test-Path $safeRoadmapScript) -and -not (Test-Path $roadmapScript)) {
    Write-Host "  [GITHUB-ROADMAP] No roadmap sync script found (skipping)." -ForegroundColor DarkYellow
    return $false
  }

  if (Test-Path $safeRoadmapScript) {
    $safeArgs = @(
      "--owner", "arslan9024",
      "--repo", "White-Caves",
      "--state", "open",
      "--batch-size", "$GitHubWaveBatchSize",
      "--bootstrap-target-count", "$GitHubIssueTarget",
      "--bootstrap-per-run", "$GitHubIssueBootstrapPerRun"
    )

    & node $safeRoadmapScript @safeArgs 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
      Write-Host "  [GITHUB-ROADMAP] Sync failed; continuing with existing recovery steps." -ForegroundColor DarkYellow
      return $false
    }

    Write-Host "  [GITHUB-ROADMAP] Roadmap refresh complete." -ForegroundColor Green
    return $true
  }

  $githubArgs = @("--owner", "arslan9024", "--repo", "White-Caves", "--state", "open", "--batch-size", "$GitHubWaveBatchSize")
  $githubToken = ([string]$env:GITHUB_TOKEN).Trim()
  if (-not $githubToken) {
    $githubToken = ([string](GetProjectGitHubToken)).Trim()
  }

  if ($githubToken) {
    $githubArgs += @("--bootstrap-from-discovery", "--apply")
    $githubArgs += @("--bootstrap-target-count", "$GitHubIssueTarget")
    $githubArgs += @("--bootstrap-per-run", "$GitHubIssueBootstrapPerRun")
  }
  else {
    $githubArgs += @("--dry")
  }

  & node $roadmapScript @githubArgs 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Host "  [GITHUB-ROADMAP] Sync failed; continuing with existing recovery steps." -ForegroundColor DarkYellow
    return $false
  }

  Write-Host "  [GITHUB-ROADMAP] Roadmap refresh complete." -ForegroundColor Green
  return $true
}

function ShouldRunScheduledGitHubSync($currentSession) {
  if ($GitHubSyncOnlyWhenIdle) {
    return $false
  }

  if ($GitHubSyncEverySessions -le 0) {
    return $false
  }

  return (($currentSession % $GitHubSyncEverySessions) -eq 0)
}

function InvokeDiscoveryGatePause($reason) {
  $script:discoveryGateHardStop = $true
  $script:discoveryGateReason = [string]$reason
  $pauseFile = Join-Path $logsDir "PAUSE"
  Set-Content -Path $pauseFile -Value "DISCOVERY_GATE_FAIL"
  WriteRecoveryEvent -stage "discover" -outcome "gate_fail" -detail $script:discoveryGateReason
  Write-Host "  [DISCOVERY-GATE] Strict discovery minimum failed." -ForegroundColor Red
  Write-Host ("  [DISCOVERY-GATE] " + $script:discoveryGateReason) -ForegroundColor Red
  Write-Host "  [DISCOVERY-GATE] PAUSE file created to stop autopilot safely." -ForegroundColor Yellow
}

function ReadPriorityOrder() {
  $priorityFile = Join-Path $logsDir "priority-order.json"
  if (-not (Test-Path $priorityFile)) { return $null }
  try { return Get-Content $priorityFile | ConvertFrom-Json }
  catch { return $null }
}

function ReadSteeringState() {
  $steeringFile = Join-Path $logsDir "task-steering.json"
  if (-not (Test-Path $steeringFile)) { return $null }
  try { return Get-Content $steeringFile | ConvertFrom-Json }
  catch { return $null }
}

function ClearSteeringState() {
  $steeringFile = Join-Path $logsDir "task-steering.json"
  if (Test-Path $steeringFile) {
    Remove-Item $steeringFile -Force -ErrorAction SilentlyContinue
  }
}

function ReadTurnState() {
  if (Test-Path $turnStateFile) {
    try { return Get-Content $turnStateFile | ConvertFrom-Json }
    catch { return $null }
  }

  $sessionLogFile = Join-Path $logsDir "autopilot-session-log.json"
  if (-not (Test-Path $sessionLogFile)) { return $null }

  try {
    $parsed = Get-Content $sessionLogFile | ConvertFrom-Json
    if ($parsed -is [array]) {
      $last = $parsed | Select-Object -Last 1
      if ($null -ne $last -and -not [string]::IsNullOrWhiteSpace([string]$last.task)) {
        return [PSCustomObject]@{ taskId = [string]$last.task }
      }
    }
    elseif ($null -ne $parsed -and -not [string]::IsNullOrWhiteSpace([string]$parsed.task)) {
      return [PSCustomObject]@{ taskId = [string]$parsed.task }
    }
  }
  catch {}

  return $null
}

function WriteTurnState($taskId, $agent, $objective) {
  $payload = [PSCustomObject]@{
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    taskId    = $taskId
    agent     = $agent
    objective = $objective
  }

  Set-Content -Path $turnStateFile -Value ($payload | ConvertTo-Json -Depth 4) -Encoding UTF8
}

function ReprioritizeWithExclusion($excludeTaskId = $null) {
  $priorityArgs = @("--top", "10")
  if (-not [string]::IsNullOrWhiteSpace([string]$excludeTaskId)) {
    $priorityArgs += @("--exclude-task-id", [string]$excludeTaskId)
  }

  $steeringState = ReadSteeringState
  if ($null -ne $steeringState -and -not [string]::IsNullOrWhiteSpace([string]$steeringState.taskId)) {
    $priorityArgs += @("--preferred-task-id", [string]$steeringState.taskId)
  }

  $ok = RunNode "reprioritize.js" $priorityArgs
  if (-not $ok) {
    return $false
  }

  return $true
}

function GetNextTaskFromPriorityOrder($priorityOrder) {
  if ($null -ne $priorityOrder -and $null -ne $priorityOrder.nextTask) {
    return $priorityOrder.nextTask
  }
  return $null
}

function TryGeneratePlansAndReprioritize() {
  Write-Host "" 
  Write-Host "  [AUTO-PLAN] Queue is idle/empty. Attempting to generate fresh planning tasks..." -ForegroundColor Cyan

  $discoverOk = RunNode "discover-upgrade.js" @("--min-inject", "10", "--max-inject", "12", "--require-min-inject")
  if (-not $discoverOk) {
    $discoveryReport = ReadDiscoveryReport
    if (($null -ne $discoveryReport -and $discoveryReport.requirementFailed -eq $true) -or (Test-Path $discoveryGateFailFile)) {
      $reason = if ($null -ne $discoveryReport -and -not [string]::IsNullOrWhiteSpace([string]$discoveryReport.skipReason)) {
        [string]$discoveryReport.skipReason
      }
      else {
        "Strict discovery minimum failed."
      }
      InvokeDiscoveryGatePause $reason
    }
    else {
      Write-Host "  [AUTO-PLAN] discover-upgrade failed (non-fatal)." -ForegroundColor DarkYellow
    }
  }

  $reprioritizeOk = ReprioritizeWithExclusion
  if (-not $reprioritizeOk) {
    Write-Host "  [AUTO-PLAN] reprioritize failed after discover-upgrade." -ForegroundColor DarkYellow
    return $null
  }

  $newPriority = ReadPriorityOrder
  if ($null -ne $newPriority -and $null -ne $newPriority.nextTask) {
    Write-Host "  [AUTO-PLAN] Generated next actionable task successfully." -ForegroundColor Green
  } else {
    Write-Host "  [AUTO-PLAN] No task generated by discovery step." -ForegroundColor DarkYellow
  }

  return $newPriority
}

function TryErrorFixAndReprioritize() {
  Write-Host ""
  Write-Host "  [AUTO-FIX] No actionable plan task yet. Running error-scan autofix to create/fix implementation opportunities..." -ForegroundColor Cyan

  $errorScanScript = Join-Path $scripts "error-scan.ps1"
  if (Test-Path $errorScanScript) {
    & powershell -ExecutionPolicy Bypass -File $errorScanScript -WorkspaceRoot $root -AutoFix 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
      Write-Host "  [AUTO-FIX] error-scan reported issues (continuing to reprioritize)." -ForegroundColor DarkYellow
    }
  }
  else {
    Write-Host "  [AUTO-FIX] error-scan.ps1 not found (skipping)." -ForegroundColor DarkYellow
  }

  $reprioritizeOk = ReprioritizeWithExclusion
  if (-not $reprioritizeOk) {
    Write-Host "  [AUTO-FIX] reprioritize failed after error-scan." -ForegroundColor DarkYellow
    return $null
  }

  $priorityAfterFix = ReadPriorityOrder
  if ($null -ne (GetNextTaskFromPriorityOrder $priorityAfterFix)) {
    Write-Host "  [AUTO-FIX] Found actionable task after error-fix sweep." -ForegroundColor Green
  }

  return $priorityAfterFix
}

function TryQueueReseedAndReprioritize() {
  Write-Host ""
  Write-Host "  [AUTO-RESEED] Queue still empty. Re-seeding orchestrator baseline queue..." -ForegroundColor Cyan

  $seedScript = Join-Path $scripts "init-queue.ps1"
  if (Test-Path $seedScript) {
    & powershell -ExecutionPolicy Bypass -File $seedScript -WorkspaceRoot $root 2>&1 | Out-Host
  }
  else {
    Write-Host "  [AUTO-RESEED] init-queue.ps1 not found (cannot reseed)." -ForegroundColor DarkYellow
    return $null
  }

  $reprioritizeOk = ReprioritizeWithExclusion
  if (-not $reprioritizeOk) {
    Write-Host "  [AUTO-RESEED] reprioritize failed after queue reseed." -ForegroundColor DarkYellow
    return $null
  }

  $priorityAfterReseed = ReadPriorityOrder
  if ($null -ne (GetNextTaskFromPriorityOrder $priorityAfterReseed)) {
    Write-Host "  [AUTO-RESEED] Found actionable task after queue reseed." -ForegroundColor Green
  }

  return $priorityAfterReseed
}

function RecoverFromIdle() {
  # Recovery pipeline order:
  #  0) GitHub issue roadmap sync (issue registry + milestones)
  #  1) discover-upgrade + reprioritize (planning)
  #  2) error-scan autofix + reprioritize (implementation/fixes)
  #  3) baseline queue reseed + reprioritize

  TrySyncGitHubIssueRoadmap | Out-Null

  WriteRecoveryEvent -stage "discover" -outcome "start" -detail "Running discover-upgrade + reprioritize"
  $candidate = TryGeneratePlansAndReprioritize
  if ($null -ne (GetNextTaskFromPriorityOrder $candidate)) {
    WriteRecoveryEvent -stage "discover" -outcome "success" -detail "Actionable task found after discovery"
    return $candidate
  }
  WriteRecoveryEvent -stage "discover" -outcome "no_task" -detail "Discovery produced no actionable task"

  WriteRecoveryEvent -stage "error_fix" -outcome "start" -detail "Running error-scan autofix + reprioritize"
  $candidate = TryErrorFixAndReprioritize
  if ($null -ne (GetNextTaskFromPriorityOrder $candidate)) {
    WriteRecoveryEvent -stage "error_fix" -outcome "success" -detail "Actionable task found after error-fix sweep"
    return $candidate
  }
  WriteRecoveryEvent -stage "error_fix" -outcome "no_task" -detail "Error-fix sweep produced no actionable task"

  WriteRecoveryEvent -stage "reseed" -outcome "start" -detail "Running queue reseed + reprioritize"
  $candidate = TryQueueReseedAndReprioritize
  if ($null -ne (GetNextTaskFromPriorityOrder $candidate)) {
    WriteRecoveryEvent -stage "reseed" -outcome "success" -detail "Actionable task found after queue reseed"
  }
  else {
    WriteRecoveryEvent -stage "reseed" -outcome "no_task" -detail "Reseed produced no actionable task"
  }
  return $candidate
}

function CheckHardStops($scanReport) {
  $stops = @()
  if ($null -eq $scanReport) { return $stops }

  if ($scanReport.summary.buildOk -eq $false) {
    $stops += [PSCustomObject]@{ Code = "BUILD_FAIL"; Msg = "Build is FAILING --- fix immediately" }
  }
  if ($scanReport.summary.tsErrors -gt 0) {
    $stops += [PSCustomObject]@{ Code = "TS_ERRORS"; Msg = "TypeScript has $($scanReport.summary.tsErrors) error(s)" }
  }
  if ($scanReport.securityFlags -and $scanReport.securityFlags.Count -gt 0) {
    $stops += [PSCustomObject]@{ Code = "SECURITY";  Msg = "$($scanReport.securityFlags.Count) potential security issue(s) detected" }
  }
  return $stops
}

function WriteSessionLog($session, $status, $dispatchPacket) {
  $logFile = Join-Path $logsDir "autopilot-session-log.json"
  $existing = @()
  if (Test-Path $logFile) {
    try {
      $parsed = (Get-Content $logFile | ConvertFrom-Json)
      if ($parsed -is [array]) {
        $existing = @($parsed)
      }
      elseif ($null -ne $parsed) {
        $existing = @($parsed)
      }
    }
    catch {}
  }
  $taskId = $null
  $agentId = $null
  if ($dispatchPacket) {
    $taskId = $dispatchPacket.taskId
    $agentId = $dispatchPacket.agent
  }

  $entry = [PSCustomObject]@{
    session    = $session
    timestamp  = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    status     = $status
    task       = $taskId
    agent      = $agentId
  }
  $existing += $entry
  Set-Content -Path $logFile -Value ($existing | ConvertTo-Json -Depth 3) -Encoding UTF8
}

function WriteRecoveryState($status, $delaySec) {
  $payload = [PSCustomObject]@{
    timestamp              = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    status                 = $status
    consecutiveNoTaskCount = $consecutiveNoTaskCount
    totalRecoveryAttempts  = $totalRecoveryAttempts
    currentDelaySec        = $delaySec
    autoPlanEnabled        = $AutoGeneratePlansWhenIdle
    lastRecoveryStage      = $lastRecoveryStage
    lastRecoveryOutcome    = $lastRecoveryOutcome
    lastRecoveryDetail     = $lastRecoveryDetail
  }

  Set-Content -Path $recoveryStateFile -Value ($payload | ConvertTo-Json -Depth 4) -Encoding UTF8
}

function WriteRecoveryEvent($stage, $outcome, $detail) {
  $script:lastRecoveryStage = [string]$stage
  $script:lastRecoveryOutcome = [string]$outcome
  $script:lastRecoveryDetail = [string]$detail

  $recoveryRecord = [PSCustomObject]@{
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    stage     = $script:lastRecoveryStage
    outcome   = $script:lastRecoveryOutcome
    detail    = $script:lastRecoveryDetail
  }

  $existing = @()
  if (Test-Path $recoveryEventsFile) {
    try {
      $parsed = (Get-Content $recoveryEventsFile | ConvertFrom-Json)
      if ($parsed -is [array]) {
        $existing = @($parsed)
      }
      elseif ($null -ne $parsed) {
        $existing = @($parsed)
      }
    }
    catch {}
  }

  $existing += $recoveryRecord
  if ($existing.Count -gt 50) {
    $existing = @($existing | Select-Object -Last 50)
  }

  Set-Content -Path $recoveryEventsFile -Value ($existing | ConvertTo-Json -Depth 4) -Encoding UTF8
}

# ------ Main Loop ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Banner "WHITE CAVES --- UNLIMITED AUTOPILOT LOOP" "Magenta"
Write-Host "  Mode        : $(if ($DryRun) { 'DRY RUN (research + reprioritise only)' } else { 'FULL EXECUTE' })"
Write-Host "  Max sessions: $(if ($MaxSessions -eq 0) { 'Unlimited' } else { $MaxSessions })"
Write-Host "  Skip build  : $SkipBuild"
Write-Host "  Skip scan   : $SkipScan"
Write-Host "  Auto-plan   : $AutoGeneratePlansWhenIdle"
Write-Host "  Checkpoint  : every $CheckpointEverySessions session(s)"
Write-Host "  Started     : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""
Write-Host "  Hard stop conditions:"
Write-Host "    --- Build failure after validation"
Write-Host "    --- TypeScript errors > 0"
Write-Host "    --- Security flag in codebase scan"
Write-Host "    --- PAUSE file at: logs/orchestrator/PAUSE"
Write-Host ""
Write-Host "  To stop cleanly at any time:"
Write-Host "    New-Item -Path '$logsDir\PAUSE' -ItemType File -Force"

WriteRecoveryState -status "boot" -delaySec $currentRecoveryDelaySec
WriteRecoveryEvent -stage "boot" -outcome "ok" -detail "Autopilot started"

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
while ($true) {
  # Stop cleanly before opening a new session when MaxSessions is reached.
  if ($MaxSessions -gt 0 -and $sessionNum -ge $MaxSessions) {
    Write-Host "  --- Reached MaxSessions limit ($MaxSessions). Exiting cleanly." -ForegroundColor Green
    break
  }

  $sessionNum++
  $sessionId = "autopilot-session-$(Get-Date -Format 'yyyyMMdd-HHmmss')-s$sessionNum"

  Banner "SESSION #$sessionNum --- $sessionId" "Cyan"

  # ------ Check PAUSE file ------------------------------------------------------------------------------------------------------------------------------------------------------
  if (CheckPauseFile) {
    Write-Host "  ---  PAUSE file detected at logs/orchestrator/PAUSE" -ForegroundColor Red
    Write-Host "     Remove the file to resume: Remove-Item '$logsDir\PAUSE'" -ForegroundColor Yellow
    $hardStopHit = $true
    break
  }

  $scanReport     = $null
  $priorityOrder  = $null
  $dispatchPacket = $null
  $sessionStatus  = "ok"
  $steeringUsedForDispatch = $false
  $turnState      = ReadTurnState
  $lastTaskId     = $null
  if ($null -ne $turnState -and -not [string]::IsNullOrWhiteSpace([string]$turnState.taskId)) {
    $lastTaskId = [string]$turnState.taskId
  }

  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  # PHASE 1 --- RESEARCH: Codebase Scan
  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase 1 "RESEARCH --- Codebase Scan (20 Research Analysts)"

  $scanArgs = @("--brief")
  if ($SkipScan) { $scanArgs += "--skip" }

  $scanOk = RunNode "codebase-scan.js" $scanArgs
  $scanReport = ReadScanReport
  if (-not $scanOk -and $null -eq $scanReport) {
    Write-Host "  [WARN] codebase-scan execution failed and no scan report was produced." -ForegroundColor DarkYellow
  }

  if ($null -ne $scanReport) {
    Write-Host ""
    Write-Host "  Scan Results:" -ForegroundColor White
    Write-Host "    Source files : $($scanReport.summary.totalSourceFiles)"
    Write-Host "    Findings     : $($scanReport.summary.totalFindings)"
    Write-Host "    TS errors    : $($scanReport.summary.tsErrors)"
    Write-Host "    Build        : $(if ($scanReport.summary.buildOk) { '--- GREEN' } else { '--- FAILING' })"
    Write-Host "    Ready waves  : $($scanReport.summary.readyWaves)"
    Write-Host "    Incomplete   : $($scanReport.summary.incompleteDocs) docs"
  }

  # ------ Hard stop check immediately after scan ---------------------------------------------------------------------------------
  $hardStops = CheckHardStops $scanReport
  if ($hardStops.Count -gt 0) {
    Write-Host ""
    Write-Host "  ---- HARD STOP CONDITIONS --- redirecting this session to fix them:" -ForegroundColor Red
    foreach ($hs in $hardStops) {
      Write-Host "     [$($hs.Code)] $($hs.Msg)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "  Autopilot will target P0 fix tasks in Phase 4." -ForegroundColor Yellow
  }

  if ($discoveryGateHardStop) {
    $sessionStatus = "discovery_gate_fail"
    $hardStopHit = $true
  }

  if (ShouldRunScheduledGitHubSync $sessionNum) {
    Write-Host ""
    Write-Host "  [GITHUB-ROADMAP] Scheduled sync check for this session..." -ForegroundColor DarkCyan
    TrySyncGitHubIssueRoadmap | Out-Null
  }

  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  # PHASE 2 --- REPRIORITISE: Smart Task Ordering
  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase 2 "REPRIORITISE --- Computing Priority Order"

  $repriOk = ReprioritizeWithExclusion $lastTaskId
  if (-not $repriOk) {
    Write-Host "  [WARN] reprioritize returned non-zero (continuing with best available queue state)." -ForegroundColor DarkYellow
  }
  $priorityOrder = ReadPriorityOrder

  $nextTask = GetNextTaskFromPriorityOrder $priorityOrder

  if ($null -ne $nextTask -and -not [string]::IsNullOrWhiteSpace([string]$lastTaskId) -and [string]$nextTask.id -eq $lastTaskId) {
    Write-Host "  [PLAN] Top task repeats previous turn ($lastTaskId); refreshing with exclusion to force a different feature." -ForegroundColor DarkYellow
    $repriOk = ReprioritizeWithExclusion $lastTaskId
    if ($repriOk) {
      $priorityOrder = ReadPriorityOrder
      $nextTask = GetNextTaskFromPriorityOrder $priorityOrder
    }
  }

  $steeringState = ReadSteeringState
  if ($null -ne $steeringState -and -not [string]::IsNullOrWhiteSpace([string]$steeringState.taskId)) {
    Write-Host "  [STEER] Manual steering requested for task $([string]$steeringState.taskId)." -ForegroundColor DarkCyan
    $repriOk = ReprioritizeWithExclusion $lastTaskId
    if ($repriOk) {
      $priorityOrder = ReadPriorityOrder
      $nextTask = GetNextTaskFromPriorityOrder $priorityOrder
    }
  }

  if ($null -ne $nextTask) {
    $nt = $nextTask
    $consecutiveNoTaskCount = 0
    $currentRecoveryDelaySec = $SessionDelaySec
    Write-Host ""
    Write-Host "  Next task: [$($nt.computedScore)] $($nt.id)" -ForegroundColor Green
    Write-Host "  Agent    : $($nt.agent)" -ForegroundColor Green
  }
  else {
    Write-Host "  ---  No eligible tasks found in queue." -ForegroundColor Yellow
    Write-Host "     Queue may be empty or all tasks are blocked/done." -ForegroundColor DarkYellow

    if ($AutoGeneratePlansWhenIdle) {
      $priorityOrder = RecoverFromIdle
      $nextTask = GetNextTaskFromPriorityOrder $priorityOrder
      if ($null -ne $nextTask) {
        $nt = $nextTask
        $consecutiveNoTaskCount = 0
        $currentRecoveryDelaySec = $SessionDelaySec
        Write-Host ""
        Write-Host "  [AUTO-RECOVERY] Next task: [$($nt.computedScore)] $($nt.id)" -ForegroundColor Green
        Write-Host "  [AUTO-RECOVERY] Agent    : $($nt.agent)" -ForegroundColor Green
        $sessionStatus = "ok"
      }
      else {
        $sessionStatus = "no_tasks"
      }
    }
    else {
      $sessionStatus = "no_tasks"
    }
  }

  $dispatchPacket = if ($null -ne $priorityOrder) { $priorityOrder.dispatchPacket } else { $null }

  if (
    $null -ne $dispatchPacket -and
    $null -ne $steeringState -and
    -not [string]::IsNullOrWhiteSpace([string]$steeringState.taskId) -and
    [string]$dispatchPacket.taskId -eq [string]$steeringState.taskId
  ) {
    $steeringUsedForDispatch = $true
  }

  if ($null -ne $dispatchPacket -and -not [string]::IsNullOrWhiteSpace([string]$dispatchPacket.taskId)) {
    WriteTurnState -taskId $dispatchPacket.taskId -agent $dispatchPacket.agent -objective $dispatchPacket.objective
  }

  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  # PHASE 3 --- DISPATCH PACKET DISPLAY
  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase 3 "DISPATCH --- Task for This Session"

  if ($null -ne $dispatchPacket) {
    Write-Host ""
    Write-Host "  ------ DISPATCH PACKET ---------------------------------------------------------------------------------------------------------------------------------------------------" -ForegroundColor Cyan
    Write-Host "  --- Task ID   : $($dispatchPacket.taskId)" -ForegroundColor White
    Write-Host "  --- Agent     : $($dispatchPacket.agent) --- $($dispatchPacket.agentTitle)" -ForegroundColor White
    Write-Host "  --- Unit      : $($dispatchPacket.agentUnit)" -ForegroundColor White
    Write-Host "  --- Model     : $($dispatchPacket.agentModel)" -ForegroundColor White
    if ($dispatchPacket.agentToolUrl) {
      Write-Host "  --- Tool URL  : $($dispatchPacket.agentToolUrl)" -ForegroundColor DarkGray
    }
    Write-Host "  --- Objective : $($dispatchPacket.objective.Substring(0, [Math]::Min(100, $dispatchPacket.objective.Length)))" -ForegroundColor White
    Write-Host "  --- Validate  : $($dispatchPacket.validationCommand)" -ForegroundColor DarkGray
    Write-Host "  --- Invoke    : $($dispatchPacket.invocationPattern)" -ForegroundColor Green
    Write-Host "  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------" -ForegroundColor Cyan
  } else {
    Write-Host "  No dispatch packet --- skipping implementation phase." -ForegroundColor Yellow
  }

  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  # PHASE 4 --- IMPLEMENT: Execute the Task
  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase 4 "IMPLEMENT --- Agent Task Execution"

  $implementOk = $true

  if ($DryRun) {
    Write-Host "  [DRY RUN] Skipping implementation phase." -ForegroundColor DarkYellow
    Write-Host "  Dispatch packet printed above for manual execution." -ForegroundColor DarkYellow

  } elseif ($null -eq $dispatchPacket) {
    Write-Host "  Nothing to implement --- no task dispatched." -ForegroundColor DarkYellow

  } else {
    # Run agent-loop in non-interactive one-shot mode.
    # NOTE: we intentionally avoid -Autopilot here because agent-loop's
    # -Autopilot flag forces a loop-start sync each cycle, which adds heavy
    # overhead and lowers task-throughput efficiency.
    $agentLoopScript = Join-Path $scripts "agent-loop.ps1"
    if (Test-Path $agentLoopScript) {
      Write-Host ("  --- Running agent-loop.ps1 -NonInteractive -Once -Agent {0} -TaskId {1} ---" -f $dispatchPacket.agent, $dispatchPacket.taskId) -ForegroundColor Cyan
      & powershell -ExecutionPolicy Bypass -File $agentLoopScript -NonInteractive -Once -WorkspaceRoot $root -Agent $dispatchPacket.agent -TaskId $dispatchPacket.taskId 2>&1
      $implementOk = ($LASTEXITCODE -eq 0)
    } else {
      # Agent-loop not available --- print the invocation for the human / Copilot agent
      Write-Host ""
      Write-Host "  agent-loop.ps1 not found." -ForegroundColor DarkYellow
      Write-Host "  Copy the invocation pattern above and execute it in the free tool." -ForegroundColor DarkYellow
      Write-Host ""
      Write-Host "  FULL PROMPT FOR FREE AGENT TOOL:" -ForegroundColor Cyan
      Write-Host "  $($dispatchPacket.fullPrompt)" -ForegroundColor White
      $implementOk = $true  # non-blocking --- human/Copilot agent will execute
    }

    if (-not $implementOk) {
      Write-Host "  --- Agent loop returned non-zero. Incrementing fail count." -ForegroundColor Yellow
      $failCount++
      $sessionStatus = "impl_failed"
    } else {
      if ($steeringUsedForDispatch) {
        ClearSteeringState
        Write-Host "  [STEER] Cleared one-shot steering request after successful dispatch." -ForegroundColor DarkCyan
      }
      $passCount++
    }
  }

  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  # PHASE 5 --- VALIDATE: Build + TypeScript Check
  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase 5 "VALIDATE --- Build & TypeScript Verification"

  $validateOk = $true

  if ($DryRun -or $SkipBuild) {
    Write-Host "  [SKIP] Build validation bypassed." -ForegroundColor DarkYellow
  } else {
    Write-Host "  Running: npm run build ---" -ForegroundColor Cyan
    $buildOk = RunNpm "build"
    if (-not $buildOk) {
      Write-Host "  --- BUILD FAILED --- HARD STOP" -ForegroundColor Red
      $hardStopHit = $true
      $validateOk  = $false
      $sessionStatus = "build_fail"
    } else {
      Write-Host "  --- Build passed" -ForegroundColor Green
    }

    if ($validateOk) {
      Write-Host "  Running: TypeScript check ---" -ForegroundColor Cyan
      $tsOk = RunNpm "typecheck"
      if (-not $tsOk) {
        Write-Host "  --- TypeScript errors detected --- HARD STOP" -ForegroundColor Red
        $hardStopHit = $true
        $validateOk  = $false
        $sessionStatus = "ts_fail"
      } else {
        Write-Host "  --- TypeScript passed" -ForegroundColor Green
      }
    }
  }

  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  # PHASE 6 --- RECORD: Session Close + Git Commit
  # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase 6 "RECORD --- Session Close"

  WriteSessionLog $sessionNum $sessionStatus $dispatchPacket

  $sessionEnd = Get-Date
  $elapsed    = ($sessionEnd - $startTime).TotalMinutes

  Write-Host ""
  Write-Host "  Session #$sessionNum summary:" -ForegroundColor White
  Write-Host "    Status     : $sessionStatus"
  Write-Host "    Pass count : $passCount"
  Write-Host "    Fail count : $failCount"
  Write-Host "    Elapsed    : $([Math]::Round($elapsed, 1)) min since loop start"

  if (-not $DryRun -and -not $NoCommit) {
    Write-Host ""
    Write-Host "  Committing session progress ---" -ForegroundColor DarkCyan
    $sessionEndScript = Join-Path $scripts "session-end.ps1"
    $dispatchTaskId = "no-task"
    if ($null -ne $dispatchPacket -and -not [string]::IsNullOrWhiteSpace([string]$dispatchPacket.taskId)) {
      $dispatchTaskId = [string]$dispatchPacket.taskId
    }

    if (Test-Path $sessionEndScript) {
      & powershell -ExecutionPolicy Bypass -File $sessionEndScript `
        -WorkspaceRoot $root `
        -Message "autopilot: session #$sessionNum --- $dispatchTaskId" `
        -SkipPush 2>&1 | Out-Null
    } else {
      # Fallback manual commit
      Set-Location $root
      git add logs/orchestrator/ 2>&1 | Out-Null
      git add business_docs/ plans/ 2>&1 | Out-Null
      $msg = "autopilot: session #$sessionNum complete [$(Get-Date -Format 'yyyy-MM-dd HH:mm')]"
      git commit -m $msg 2>&1 | Out-Null
    }
    Write-Host "  --- Progress committed" -ForegroundColor Green
  }

  if (-not $DryRun) {
    $checkpointOk = RunCheckpointValidation -CurrentSession $sessionNum -SkipBuildChecks:$SkipBuild
    if (-not $checkpointOk) {
      if ($CheckpointStopOnFailure) {
        Write-Host "  [CHECKPOINT] failure configured as hard stop." -ForegroundColor Red
        $hardStopHit = $true
        $sessionStatus = "checkpoint_failed"
      }
      else {
        Write-Host "  [CHECKPOINT] failed, continuing loop (CheckpointStopOnFailure not set)." -ForegroundColor Yellow
      }
    }
  }

  # ------ Hard stop --- break loop ------------------------------------------------------------------------------------------------------------------------------------
  if ($hardStopHit) {
    Write-Host ""
    Write-Host ("=" * $w) -ForegroundColor Red
    Write-Host "  ---  AUTOPILOT HARD STOP" -ForegroundColor Red
    Write-Host ("=" * $w) -ForegroundColor Red
    if ($discoveryGateHardStop -and -not [string]::IsNullOrWhiteSpace($discoveryGateReason)) {
      Write-Host ("  Discovery gate failure: " + $discoveryGateReason) -ForegroundColor Yellow
    }
    Write-Host "  Fix the condition above, then re-run:" -ForegroundColor Yellow
    Write-Host "    npm run autopilot:unlimited" -ForegroundColor Cyan
    Write-Host ""
    break
  }

  # ------ No tasks left ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  if ($sessionStatus -eq "no_tasks") {
    $consecutiveNoTaskCount++
    $totalRecoveryAttempts++
    if ($consecutiveNoTaskCount -ge 5) {
      $currentRecoveryDelaySec = [Math]::Max($SessionDelaySec, 30)
    }
    elseif ($consecutiveNoTaskCount -ge 3) {
      $currentRecoveryDelaySec = [Math]::Max($SessionDelaySec, 15)
    }
    else {
      $currentRecoveryDelaySec = [Math]::Max($SessionDelaySec, 5)
    }

    Write-Host ""
    Write-Host "  --- No actionable tasks after full recovery pipeline." -ForegroundColor Yellow
    Write-Host "  Autopilot will stay active and retry after delay (never-idle mode)." -ForegroundColor DarkYellow
    Write-Host "  Recovery attempts: $totalRecoveryAttempts | No-task streak: $consecutiveNoTaskCount | Next delay: ${currentRecoveryDelaySec}s" -ForegroundColor DarkCyan
    if ($MaxSessions -gt 0) {
      Write-Host "  MaxSessions is set; exiting current run cleanly." -ForegroundColor DarkYellow
      break
    }
  } else {
    $consecutiveNoTaskCount = 0
    $currentRecoveryDelaySec = $SessionDelaySec
  }

  WriteRecoveryState -status $sessionStatus -delaySec $currentRecoveryDelaySec

  # ------ Session delay ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  $effectiveDelaySec = if ($sessionStatus -eq "no_tasks") { $currentRecoveryDelaySec } else { $SessionDelaySec }
  if ($effectiveDelaySec -gt 0 -and ($MaxSessions -eq 0 -or $sessionNum -lt $MaxSessions)) {
    Write-Host ""
    Write-Host "  --- Waiting $effectiveDelaySec sec before next session ---" -ForegroundColor DarkGray
    Start-Sleep -Seconds $effectiveDelaySec
  }
}

# ------ Final Summary ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
$totalElapsed = ((Get-Date) - $startTime).TotalMinutes

Banner "AUTOPILOT LOOP COMPLETE" "Magenta"
Write-Host "  Sessions run : $sessionNum"
Write-Host "  Passed       : $passCount"
Write-Host "  Failed       : $failCount"
Write-Host "  Hard stop    : $hardStopHit"
Write-Host "  Total time   : $([Math]::Round($totalElapsed, 1)) min"
Write-Host ""
Write-Host "  Session log  : logs/orchestrator/autopilot-session-log.json"
Write-Host "  Last scan    : logs/orchestrator/codebase-scan-report.json"
Write-Host "  Priority list: logs/orchestrator/priority-order.json"
Write-Host ""

