# dispatch-lane.ps1 -- Lane-aware dispatcher for background workers.
# Instead of claiming only tasks for a specific agent, a worker calls this
# with its assigned lane (A/B/C/D) and receives the next ready task in that lane,
# regardless of which agent "owns" it.  This maximises throughput when agents
# in a lane are all represented by the same worker process.
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("A","B","C","D","any")]
  [string]$Lane,

  # Optional: still prefer tasks assigned to a specific agent first
  [string]$PreferAgent = "",

  [string]$WorkerLabel  = "worker",
  [string]$WorkspaceRoot = "."
)

$stateDir  = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$mutex     = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")
$realityGateLog = Join-Path $stateDir "reality-gate.log"
$policyUtilsPath = Join-Path $PSScriptRoot "policy-utils.ps1"

if (-not (Test-Path $policyUtilsPath)) {
  Write-Output (@{ claimed = $false; reason = "policy_utils_missing" } | ConvertTo-Json -Depth 4)
  exit 1
}

. $policyUtilsPath

try {
  $policy = Get-OrchestratorPolicy -WorkspaceRoot $WorkspaceRoot
}
catch {
  Write-Output (@{ claimed = $false; reason = "policy_invalid"; detail = $_.Exception.Message } | ConvertTo-Json -Depth 6)
  exit 1
}

function Get-Queue {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $raw = Get-Content -Path $Path -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  return $raw | ConvertFrom-Json
}

function Save-Queue {
  param($Queue, [string]$Path)
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $tmp = Join-Path $dir ("{0}.tmp.{1}" -f ([System.IO.Path]::GetFileName($Path)), [guid]::NewGuid().ToString("N"))
  $json = $Queue | ConvertTo-Json -Depth 12
  [System.IO.File]::WriteAllText($tmp, $json, (New-Object System.Text.UTF8Encoding($false)))
  Move-Item -Path $tmp -Destination $Path -Force
}

function Write-RealityLog {
  param([string]$Message)
  $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  Add-Content -Path $realityGateLog -Value "[$ts][dispatch-lane] $Message" -Encoding UTF8
}

function Get-RealityGateConfig {
  param($policy)

  $defaults = @{
    enabled = $true
    minSelectionScore = 60
    projectKeywords = @("homepage", "login", "auth", "api", "ux", "ui", "performance", "security", "dashboard", "crm", "property", "lead", "tenant", "automation", "validation", "test", "build", "lint", "typecheck")
    qualityMarkers = @("implement", "verify", "validation", "rollback", "best-practice", "security", "test", "build", "lint", "typecheck")
  }

  if ($null -eq $policy -or $null -eq $policy.aegis -or $null -eq $policy.aegis.realityExecutionGate) {
    return $defaults
  }

  $g = $policy.aegis.realityExecutionGate
  return @{
    enabled = if ($null -ne $g.enabled) { [bool]$g.enabled } else { $defaults.enabled }
    minSelectionScore = if ($null -ne $g.minSelectionScore) { [int]$g.minSelectionScore } else { $defaults.minSelectionScore }
    projectKeywords = if ($null -ne $g.projectKeywords -and @($g.projectKeywords).Count -gt 0) { @($g.projectKeywords) } else { $defaults.projectKeywords }
    qualityMarkers = if ($null -ne $g.qualityMarkers -and @($g.qualityMarkers).Count -gt 0) { @($g.qualityMarkers) } else { $defaults.qualityMarkers }
  }
}

function Get-TaskSelectionScore {
  param($task, $realityGate)

  $score = 0
  $priorityScore = 0
  if ($null -ne $task.priorityScore) {
    $priorityScore = [int]$task.priorityScore
  }
  $score += [Math]::Min($priorityScore, 1000)

  $priorityText = [string]$task.priority
  switch ($priorityText.ToLowerInvariant()) {
    "critical" { $score += 300 }
    "high" { $score += 180 }
    "normal" { $score += 80 }
    default { $score += 30 }
  }

  $phase = [string]$task.phase
  $team = [string]$task.team
  if ($phase -eq "implementation" -or $team -eq "premium-implementation") {
    $score += 120
  }
  else {
    $score += 40
  }

  $attempts = if ($null -ne $task.attempts) { [int]$task.attempts } else { 0 }
  $score -= ($attempts * 10)

  $combined = (
    [string]$task.title + " " +
    [string]$task.prompt + " " +
    [string]$task.description
  ).ToLowerInvariant()

  $projectHits = 0
  foreach ($kw in @($realityGate.projectKeywords)) {
    $token = [string]$kw
    if ([string]::IsNullOrWhiteSpace($token)) { continue }
    if ($combined.Contains($token.ToLowerInvariant())) {
      $projectHits++
    }
  }

  $qualityHits = 0
  foreach ($kw in @($realityGate.qualityMarkers)) {
    $token = [string]$kw
    if ([string]::IsNullOrWhiteSpace($token)) { continue }
    if ($combined.Contains($token.ToLowerInvariant())) {
      $qualityHits++
    }
  }

  $score += ($projectHits * 15)
  $score += ($qualityHits * 20)

  return @{
    score = $score
    projectHits = $projectHits
    qualityHits = $qualityHits
  }
}

function Test-DependencyDone {
  param([string]$depId, $allTasks)
  $dep = $allTasks | Where-Object { $_.taskId -eq $depId } | Select-Object -First 1
  return ($null -ne $dep -and $dep.status -eq "done")
}

function Get-NormalizedDeps {
  param($deps)

  $normalized = New-Object 'System.Collections.Generic.List[string]'

  if ($null -eq $deps) { return ,$normalized.ToArray() }

  foreach ($item in @($deps)) {
    if ($null -eq $item) { continue }
    if ($item -is [string]) {
      if ([string]::IsNullOrWhiteSpace($item)) { continue }
      [void]$normalized.Add($item)
      continue
    }

    if ($null -ne $item.PSObject -and $item.PSObject.Properties.Count -eq 0) {
      continue
    }

    $text = [string]$item
    if (-not [string]::IsNullOrWhiteSpace($text)) {
      [void]$normalized.Add($text)
    }
  }

  return ,$normalized.ToArray()
}

function Select-Candidate {
  param($tasks, [string]$lane, [string]$preferAgent, $policy)

  $realityGate = Get-RealityGateConfig -policy $policy

  $eligible = $tasks | Where-Object {
    $isImplementationTask = ([string]$_.phase -eq "implementation") -or ([string]$_.team -eq "premium-implementation")

    ($_.status -eq "queued" -or $_.status -eq "retrying") -and
    ($lane -eq "any" -or $_.lane -eq $lane) -and
    (
      (-not [bool]$policy.modelRouting.freeModelOnlyMode) -or
      $isImplementationTask -or
      (Test-IsFreePlanningAgent -Policy $policy -AgentName $_.agent)
    )
  } | Sort-Object createdAt | Where-Object {
    $deps = Get-NormalizedDeps $_.dependsOn
    if ($deps.Count -eq 0) { return $true }
    foreach ($depId in $deps) {
      if (-not (Test-DependencyDone -depId $depId -allTasks $tasks)) {
        return $false
      }
    }
    return $true
  }

  if (-not $eligible) { return $null }

  $scored = @()
  foreach ($t in @($eligible)) {
    $quality = Get-TaskSelectionScore -task $t -realityGate $realityGate
    $scored += [pscustomobject]@{
      task = $t
      score = [int]$quality.score
      projectHits = [int]$quality.projectHits
      qualityHits = [int]$quality.qualityHits
    }
  }

  if ($realityGate.enabled) {
    $highQuality = @($scored | Where-Object { $_.score -ge $realityGate.minSelectionScore })
    if ($highQuality.Count -gt 0) {
      $scored = $highQuality
    }
  }

  $ordered = @($scored | Sort-Object @{ Expression = "score"; Descending = $true }, @{ Expression = { $_.task.createdAt }; Descending = $false })

  if ($ordered.Count -eq 0) { return $null }

  Write-RealityLog ("lane={0} eligible={1} selectedScore={2} selectedTask={3} projectHits={4} qualityHits={5} minScore={6} gateEnabled={7}" -f $lane, @($eligible).Count, $ordered[0].score, $ordered[0].task.taskId, $ordered[0].projectHits, $ordered[0].qualityHits, $realityGate.minSelectionScore, $realityGate.enabled)

  # Prefer tasks for the specific agent if requested
  if ($preferAgent -ne "") {
    $preferred = $ordered | Where-Object { $_.task.agent -eq $preferAgent } | Select-Object -First 1
    if ($preferred) { return $preferred.task }
  }

  return $ordered[0].task
}

$claimedTask = $null

try {
  $null = $mutex.WaitOne()

  $queue = Get-Queue -Path $queueFile
  if ($null -eq $queue) {
    Write-Output (@{ claimed = $false; reason = "queue_missing" } | ConvertTo-Json -Depth 4)
    exit 0
  }

  $tasks     = @($queue.tasks)
  $candidate = Select-Candidate -tasks $tasks -lane $Lane -preferAgent $PreferAgent -policy $policy

  if ($null -eq $candidate) {
    Write-Output (@{ claimed = $false; reason = "no_ready_task_in_lane_$Lane" } | ConvertTo-Json -Depth 4)
    exit 0
  }

  $candidate.status      = "running"
  $candidate | Add-Member -NotePropertyName "startedAt" -NotePropertyValue ((Get-Date).ToString("o")) -Force
  $candidate | Add-Member -NotePropertyName "attempts" -NotePropertyValue ([int]$candidate.attempts + 1) -Force
  # Add claimedBy as new property (JSON objects don't always have it by default)
  $candidate | Add-Member -NotePropertyName "claimedBy" -NotePropertyValue $WorkerLabel -Force

  Save-Queue -Queue $queue -Path $queueFile

  $claimedTask = @{
    claimed          = $true
    taskId           = $candidate.taskId
    title            = $candidate.title
    agent            = $candidate.agent
    lane             = $candidate.lane
    requiresFeedsAck = [bool]$candidate.requiresFeedsAck
    feedsAckBy       = $candidate.feedsAckBy
  }

  Write-Output ($claimedTask | ConvertTo-Json -Depth 4)
}
finally {
  $mutex.ReleaseMutex()
}
