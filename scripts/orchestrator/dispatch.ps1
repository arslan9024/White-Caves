param(
  [Parameter(Mandatory = $true)]
  [string]$AgentName,
  [string]$WorkspaceRoot = "."
)

$stateDir = Join-Path $WorkspaceRoot "logs\orchestrator"
$queueFile = Join-Path $stateDir "task-queue.json"
$mutex = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")
$policyUtilsPath = Join-Path $PSScriptRoot "policy-utils.ps1"

if (-not (Test-Path $policyUtilsPath)) {
  $out = @{ claimed = $false; reason = "policy_utils_missing" } | ConvertTo-Json -Depth 4
  Write-Output $out
  exit 1
}

. $policyUtilsPath

try {
  $policy = Get-OrchestratorPolicy -WorkspaceRoot $WorkspaceRoot
}
catch {
  $out = @{ claimed = $false; reason = "policy_invalid"; detail = $_.Exception.Message } | ConvertTo-Json -Depth 6
  Write-Output $out
  exit 1
}

if ([bool]$policy.modelRouting.freeModelOnlyMode -and (-not (Test-IsFreePlanningAgent -Policy $policy -AgentName $AgentName))) {
  $out = @{ claimed = $false; reason = "agent_not_allowed_by_free_model_policy"; agent = $AgentName } | ConvertTo-Json -Depth 6
  Write-Output $out
  exit 0
}

function Read-JsonFileSafe {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [long]$MaxBytes = 8MB,
    [switch]$TryTmpRecovery
  )

  if (-not (Test-Path $Path)) { return $null }
  $info = Get-Item -Path $Path -ErrorAction SilentlyContinue
  if ($null -eq $info) { return $null }

  function Try-ParseCandidate {
    param([string]$CandidatePath)
    try {
      $raw = Get-Content -Path $CandidatePath -Raw -ErrorAction Stop
      if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
      return ($raw | ConvertFrom-Json -ErrorAction Stop)
    } catch { return $null }
  }

  if ($info.Length -gt $MaxBytes) {
    if (-not $TryTmpRecovery) { return $null }
    $dir = Split-Path -Parent $Path
    $base = [System.IO.Path]::GetFileName($Path)
    foreach ($tmp in @(Get-ChildItem -Path $dir -Filter ("{0}.tmp.*" -f $base) -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending)) {
      if ($tmp.Length -gt $MaxBytes) { continue }
      $parsed = Try-ParseCandidate -CandidatePath $tmp.FullName
      if ($null -eq $parsed) { continue }
      try { Copy-Item -Path $tmp.FullName -Destination $Path -Force } catch {}
      return $parsed
    }
    return $null
  }

  return (Try-ParseCandidate -CandidatePath $Path)
}

function Get-Queue {
  param([string]$Path)
  return (Read-JsonFileSafe -Path $Path -MaxBytes 8MB -TryTmpRecovery)
}

function Save-Queue {
  param($Queue, [string]$Path)
  $Queue | ConvertTo-Json -Depth 12 | Set-Content -Path $Path -Encoding UTF8
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

function Test-DependencyDone {
  param([string]$depId, $allTasks)
  $dep = $allTasks | Where-Object { $_.taskId -eq $depId } | Select-Object -First 1
  return $null -ne $dep -and $dep.status -eq "done"
}

$claimedTask = $null

try {
  $null = $mutex.WaitOne()

  $queue = Get-Queue -Path $queueFile
  if ($null -eq $queue) {
    $out = @{ claimed = $false; reason = "queue_missing" } | ConvertTo-Json -Depth 4
    Write-Output $out
    exit 0
  }

  $tasks = @($queue.tasks)

  $candidate = $tasks |
    Where-Object { $_.agent -eq $AgentName -and ($_.status -eq "queued" -or $_.status -eq "retrying") } |
    Sort-Object createdAt |
    Where-Object {
      $deps = Get-NormalizedDeps $_.dependsOn
      if ($deps.Count -eq 0) { return $true }
      foreach ($depId in $deps) {
        if (-not (Test-DependencyDone -depId $depId -allTasks $tasks)) {
          return $false
        }
      }
      return $true
    } |
    Select-Object -First 1

  if ($null -eq $candidate) {
    $out = @{ claimed = $false; reason = "no_ready_task" } | ConvertTo-Json -Depth 4
    Write-Output $out
    exit 0
  }

  $candidate.status = "running"
  $candidate.startedAt = (Get-Date).ToString("o")
  $candidate.attempts = [int]$candidate.attempts + 1

  Save-Queue -Queue $queue -Path $queueFile

  $claimedTask = @{
    claimed = $true
    taskId = $candidate.taskId
    title = $candidate.title
    requiresFeedsAck = [bool]$candidate.requiresFeedsAck
    feedsAckBy = $candidate.feedsAckBy
  }

  Write-Output ($claimedTask | ConvertTo-Json -Depth 4)
}
finally {
  $mutex.ReleaseMutex() | Out-Null
  $mutex.Dispose()
}
