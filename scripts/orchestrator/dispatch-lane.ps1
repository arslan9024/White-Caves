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

  # Prefer tasks for the specific agent if requested
  if ($preferAgent -ne "") {
    $preferred = $eligible | Where-Object { $_.agent -eq $preferAgent } | Select-Object -First 1
    if ($preferred) { return $preferred }
  }

  return $eligible | Select-Object -First 1
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
  $candidate.startedAt   = (Get-Date).ToString("o")
  $candidate.attempts    = [int]$candidate.attempts + 1
  # Add claimedBy as new property (JSON objects don't have it by default)
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
