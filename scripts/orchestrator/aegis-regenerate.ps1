param(
  [string]$WorkspaceRoot = ".",
  [string]$Reason = "Manual Aegis regeneration",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path $WorkspaceRoot
$logsDir = Join-Path $root "logs\orchestrator"
$queueFile = Join-Path $logsDir "task-queue.json"
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"
$policyFile = Join-Path $root "scripts\orchestrator\policy.json"
$stateFile = Join-Path $logsDir "aegis-state.json"
$archiveDir = Join-Path $logsDir "archive"

New-Item -ItemType Directory -Force -Path $logsDir | Out-Null
New-Item -ItemType Directory -Force -Path $archiveDir | Out-Null

function Get-QueueStats {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return @{ Total = 0; Done = 0 }
  }

  try {
    # Fast-path for normal-sized queues.
    $item = Get-Item -Path $Path -ErrorAction Stop
    if ($item.Length -le 2MB) {
      $q = Get-Content $Path -Raw | ConvertFrom-Json
      $all = @($q.tasks)
      $done = @($all | Where-Object { $_.status -eq "done" }).Count
      return @{ Total = $all.Count; Done = $done }
    }

    # Fallback for large/corrupted queue snapshots to avoid full in-memory JSON materialization.
    $total = 0
    $done = 0
    foreach ($line in [System.IO.File]::ReadLines($Path)) {
      if ($line -match '"taskId"\s*:') { $total++ }
      if ($line -match '"status"\s*:\s*"done"') { $done++ }
    }
    return @{ Total = $total; Done = $done }
  } catch {
    return @{ Total = 0; Done = 0 }
  }
}

$stats = Get-QueueStats -Path $queueFile
$queueIsComplete = ($stats.Total -eq 0) -or ($stats.Total -gt 0 -and $stats.Done -ge $stats.Total)

if (-not $Force -and -not $queueIsComplete) {
  Write-Host "[SKIP] Aegis regeneration skipped: queue is not complete." -ForegroundColor DarkYellow
  Write-Host "       Use -Force to regenerate anyway." -ForegroundColor DarkGray
  exit 0
}

$lastCycle = 0
if (Test-Path $stateFile) {
  try {
    $state = Get-Content $stateFile -Raw | ConvertFrom-Json
    if ($null -ne $state.lastCycle) {
      $parsed = 0
      if ([int]::TryParse([string]$state.lastCycle, [ref]$parsed)) {
        $lastCycle = $parsed
      }
    }
  } catch {
    $lastCycle = 0
  }
}

$cycle = $lastCycle + 1
$cycleTag = "C{0:D2}" -f $cycle
$now = (Get-Date).ToString("o")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"

if (Test-Path $queueFile) {
  Copy-Item $queueFile (Join-Path $archiveDir ("task-queue.pre-aegis-{0}.json" -f $stamp)) -Force
}
if (Test-Path $promptsFile) {
  Copy-Item $promptsFile (Join-Path $archiveDir ("prompts.pre-aegis-{0}.json" -f $stamp)) -Force
}

function New-Task {
  param(
    [string]$Id,
    [string]$Agent,
    [string]$Lane,
    [string]$Title,
    [string[]]$Deps,
    [bool]$NeedsAck,
    [string]$AckBy,
    [string]$Phase = "planning",
    [string]$Team = "free-planning",
    [string]$Priority = "normal",
    [int]$PriorityScore = 50
  )

  return @{
    taskId = $Id
    agent = $Agent
    lane = $Lane
    phase = $Phase
    team = $Team
    priority = $Priority
    priorityScore = $PriorityScore
    title = $Title
    status = "queued"
    dependsOn = if ($null -eq $Deps) { @() } else { @($Deps | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) }) }
    requiresFeedsAck = $NeedsAck
    feedsAckBy = $AckBy
    attempts = 0
    createdAt = $now
    startedAt = $null
    finishedAt = $null
    evidence = @{
      cycle = $cycleTag
      generatedBy = "aegis-regenerate.ps1"
      reason = $Reason
      phase = $Phase
      team = $Team
      priority = $Priority
      priorityScore = $PriorityScore
    }
  }
}

# Agent order mirrors existing lanes so current autopilot rotation can execute seamlessly.
$laneA = @("@Sofia","@Timnit","@Victoria","@Annie","@Marissa","@Rachel","@Joelle")
$laneB = @("@Fei-Fei","@Anima","@Mary","@Invoice")
$laneC = @("@Booking","@Maya","@Hedy","@Cassie")
$laneD = @("@Jaime","@Corinne")

$titleByAgent = @{
  "@Sofia" = "Compliance gap research and remediation planning"
  "@Timnit" = "DLD/legal workflow upgrade research and planning"
  "@Victoria" = "Tenancy/Ejari quality audit and enhancement plan"
  "@Annie" = "Tenant portal and document automation improvement plan"
  "@Marissa" = "UX quality review and luxury-flow optimization plan"
  "@Rachel" = "SEO and campaign uplift planning"
  "@Joelle" = "AI assistant reliability and fallback planning"
  "@Fei-Fei" = "Valuation and market-intelligence model enhancement planning"
  "@Anima" = "Data pipeline resilience and analytics quality planning"
  "@Mary" = "Inventory/prospecting workflow optimization planning"
  "@Invoice" = "Finance reporting quality and forecasting improvement planning"
  "@Booking" = "Scheduling/viewings reliability and conversion planning"
  "@Maya" = "Off-plan and handover risk-reduction planning"
  "@Hedy" = "Audit/activity/follow-up automation hardening plan"
  "@Cassie" = "KPI integrity and executive analytics improvement plan"
  "@Jaime" = "Offers/WhatsApp workflow optimization planning"
  "@Corinne" = "AI chat, maintenance, and map-performance enhancement plan"
}

$priorityOverrideEnabled = $false
$priorityOverrideTasks = @()
if (Test-Path $policyFile) {
  try {
    $policy = Get-Content $policyFile -Raw | ConvertFrom-Json
    if ($null -ne $policy.aegis -and $null -ne $policy.aegis.priorityOverride) {
      $priorityOverrideEnabled = [bool]$policy.aegis.priorityOverride.enabled
      if ($priorityOverrideEnabled -and $null -ne $policy.aegis.priorityOverride.tasks) {
        $priorityOverrideTasks = @($policy.aegis.priorityOverride.tasks)
      }
    }
  } catch {
    $priorityOverrideEnabled = $false
    $priorityOverrideTasks = @()
  }
}

function Add-LaneTasks {
  param(
    [string]$Lane,
    [string[]]$Agents,
    [System.Collections.ArrayList]$TaskSink,
    [hashtable]$PromptSink,
    [string]$Phase = "planning",
    [string]$Team = "free-planning"
  )

  $prevId = $null
  for ($i = 0; $i -lt $Agents.Count; $i++) {
    $agent = $Agents[$i]
    $seq = "{0:D2}" -f ($i + 1)
    $taskId = "AG{0}{1}{2}" -f $cycleTag, $Lane, $seq
    $nextAgent = if ($i -lt ($Agents.Count - 1)) { $Agents[$i + 1] } else { $null }
    $deps = if ([string]::IsNullOrWhiteSpace($prevId)) { @() } else { @($prevId) }
    $needsAck = -not [string]::IsNullOrWhiteSpace($nextAgent)
    $title = "Aegis {0} - {1}" -f $cycleTag, $titleByAgent[$agent]

    [void]$TaskSink.Add((New-Task -Id $taskId -Agent $agent -Lane $Lane -Title $title -Deps $deps -NeedsAck $needsAck -AckBy $nextAgent -Phase $Phase -Team $Team))

    if ($Phase -eq "implementation") {
      $PromptSink[$taskId] = "{0} -- IMPLEMENT+VERIFY ({1}): execute the implementation backlog for this module in production-safe slices. Include code-level changes, validation gates (typecheck/lint/build/tests), risk controls, rollback notes, and handoff artifacts for QA/security. Output must be merge-ready and traceable to acceptance criteria." -f $agent, $cycleTag
    } else {
      $PromptSink[$taskId] = "{0} -- RESEARCH+PLAN ({1}): analyze current project status for your domain and produce a prioritized backlog for fixes, implementation improvements, upgrades, and completion steps. Include: top 5 issues/opportunities, root-cause notes, API/data/UI impact, acceptance criteria, test strategy, risk level (P0/P1/P2), and FEEDS/FEEDS_ACK handoff targets. Output should be implementation-ready for the next coding wave." -f $agent, $cycleTag
    }

    $prevId = $taskId
  }
}

function Add-PriorityOverrides {
  param(
    [array]$OverrideTasks,
    [System.Collections.ArrayList]$TaskSink,
    [hashtable]$PromptSink
  )

  if ($null -eq $OverrideTasks -or $OverrideTasks.Count -eq 0) { return 0 }

  $added = 0
  $overrideIndex = 0
  foreach ($ov in $OverrideTasks) {
    if ($null -eq $ov) { continue }

    $agent = [string]$ov.agent
    $lane = [string]$ov.lane
    $title = [string]$ov.title
    $phase = [string]$ov.phase
    $team = [string]$ov.team
    $prompt = [string]$ov.prompt

    if ([string]::IsNullOrWhiteSpace($agent) -or [string]::IsNullOrWhiteSpace($lane) -or [string]::IsNullOrWhiteSpace($title)) {
      continue
    }

    if ([string]::IsNullOrWhiteSpace($phase)) { $phase = "implementation" }
    if ([string]::IsNullOrWhiteSpace($team)) { $team = if ($phase -eq "implementation") { "premium-implementation" } else { "free-planning" } }

    $priority = [string]$ov.priority
    if ([string]::IsNullOrWhiteSpace($priority)) { $priority = "critical" }

    $priorityScore = 100
    if ($null -ne $ov.priorityScore) {
      $parsedScore = 100
      if ([int]::TryParse([string]$ov.priorityScore, [ref]$parsedScore)) {
        $priorityScore = [math]::Max(0, [math]::Min(1000, $parsedScore))
      }
    }

    $overrideIndex++
    $taskId = "AG{0}O{1}" -f $cycleTag, ("{0:D2}" -f $overrideIndex)
    $taskTitle = "Aegis {0} - PRIORITY OVERRIDE - {1}" -f $cycleTag, $title

    [void]$TaskSink.Add((New-Task -Id $taskId -Agent $agent -Lane $lane -Title $taskTitle -Deps @() -NeedsAck $false -AckBy $null -Phase $phase -Team $team -Priority $priority -PriorityScore $priorityScore))

    if ([string]::IsNullOrWhiteSpace($prompt)) {
      $prompt = if ($phase -eq "implementation") {
        "{0} -- IMPLEMENT+VERIFY ({1}): execute this top-priority override task before standard queue items. Deliver production-safe code changes, strict validation (typecheck/lint/build/tests), rollback notes, and evidence artifacts." -f $agent, $cycleTag
      } else {
        "{0} -- RESEARCH+PLAN ({1}): execute this top-priority override task before standard queue items. Deliver actionable backlog, acceptance criteria, risk notes, and implementation-ready handoff." -f $agent, $cycleTag
      }
    }

    $PromptSink[$taskId] = $prompt
    $added++
  }

  return $added
}

$tasks = New-Object System.Collections.ArrayList
$newPrompts = @{}

$priorityAdded = 0
if ($priorityOverrideEnabled) {
  $priorityAdded = Add-PriorityOverrides -OverrideTasks $priorityOverrideTasks -TaskSink $tasks -PromptSink $newPrompts
}

Add-LaneTasks -Lane "A" -Agents $laneA -TaskSink $tasks -PromptSink $newPrompts
Add-LaneTasks -Lane "B" -Agents $laneB -TaskSink $tasks -PromptSink $newPrompts
Add-LaneTasks -Lane "C" -Agents $laneC -TaskSink $tasks -PromptSink $newPrompts
Add-LaneTasks -Lane "D" -Agents $laneD -TaskSink $tasks -PromptSink $newPrompts

# Premium implementation team (parallel track)
$implByLane = [ordered]@{
  "A" = "@Mira"
  "B" = "@Mala"
  "C" = "@Katherine"
  "D" = "@Gwynne"
}

$implModuleTitle = @{
  "A" = "Implementation wave for compliance/legal + UX stability"
  "B" = "Implementation wave for valuation/market/finance hardening"
  "C" = "Implementation wave for scheduling/off-plan/analytics delivery"
  "D" = "Implementation wave for offers/WhatsApp/AI chat delivery"
}

$implIdx = 0
foreach ($laneKey in $implByLane.Keys) {
  $implIdx++
  $implTaskId = "AG{0}P{1}" -f $cycleTag, ("{0:D2}" -f $implIdx)
  $implAgent = [string]$implByLane[$laneKey]
  $implTitle = "Aegis {0} - {1}" -f $cycleTag, $implModuleTitle[$laneKey]

  [void]$tasks.Add((New-Task -Id $implTaskId -Agent $implAgent -Lane $laneKey -Title $implTitle -Deps @() -NeedsAck $false -AckBy $null -Phase "implementation" -Team "premium-implementation"))

  $newPrompts[$implTaskId] = "{0} -- IMPLEMENT+VERIFY ({1}): execute module implementation tasks in parallel with planning tracks. Deliver code changes, strict validation (typecheck/lint/build/tests), rollback notes, and deployment-ready handoff. Include evidence links and explicit completion criteria." -f $implAgent, $cycleTag
}

$payload = @{
  version = "2.0"
  generatedAt = $now
  generatedBy = "Aegis"
  cycle = $cycleTag
  reason = $Reason
  tasks = @($tasks)
}

$queueDir = Split-Path -Parent $queueFile
if (-not (Test-Path $queueDir)) { New-Item -ItemType Directory -Force -Path $queueDir | Out-Null }
$queueTmp = Join-Path $queueDir ("{0}.tmp.{1}" -f ([System.IO.Path]::GetFileName($queueFile)), [guid]::NewGuid().ToString("N"))
$queueJson = $payload | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($queueTmp, $queueJson, (New-Object System.Text.UTF8Encoding($false)))
Move-Item -Path $queueTmp -Destination $queueFile -Force

$existingPrompts = @{}
if (Test-Path $promptsFile) {
  try {
    $parsed = Get-Content $promptsFile -Raw | ConvertFrom-Json
    foreach ($prop in $parsed.PSObject.Properties) {
      $existingPrompts[$prop.Name] = [string]$prop.Value
    }
  } catch {
    $existingPrompts = @{}
  }
}

foreach ($k in $newPrompts.Keys) {
  $existingPrompts[$k] = $newPrompts[$k]
}

$ordered = [ordered]@{}
foreach ($k in ($existingPrompts.Keys | Sort-Object)) {
  $ordered[$k] = $existingPrompts[$k]
}

$ordered | ConvertTo-Json -Depth 8 | Set-Content -Path $promptsFile -Encoding UTF8

$statePayload = @{
  lastCycle = $cycle
  lastCycleTag = $cycleTag
  generatedAt = $now
  reason = $Reason
}
$statePayload | ConvertTo-Json -Depth 6 | Set-Content -Path $stateFile -Encoding UTF8

Write-Host "[AEGIS] Generated new dual-track cycle (planning + implementation): $cycleTag" -ForegroundColor Green
Write-Host "        Queue file : $queueFile" -ForegroundColor DarkGray
Write-Host "        Tasks      : $($tasks.Count)" -ForegroundColor DarkGray
Write-Host "        Prompts add: $($newPrompts.Count)" -ForegroundColor DarkGray
if ($priorityOverrideEnabled) {
  Write-Host "        Priority overrides added: $priorityAdded" -ForegroundColor DarkGray
}
Write-Host "        Reason     : $Reason" -ForegroundColor DarkGray