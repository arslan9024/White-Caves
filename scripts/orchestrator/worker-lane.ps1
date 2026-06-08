# worker-lane.ps1 -- Lane-aware background worker.
# Claims the next ready task in its assigned lane (A/B/C/D) every PollSeconds.
# Uses dispatch-lane.ps1 for smarter routing instead of agent-locked dispatch.
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("A","B","C","D","any")]
  [string]$Lane,

  [string]$PreferAgent   = "",
  [int]$PollSeconds      = 30,
  [string]$WorkspaceRoot = ".",
  [int]$RegenCooldownSeconds = 45
)

$stateDir       = Join-Path $WorkspaceRoot "logs\orchestrator"
$logFile        = Join-Path $stateDir "worker-lane-$Lane.log"
$queueFile      = Join-Path $stateDir "task-queue.json"
$policyFile     = Join-Path $WorkspaceRoot "scripts\orchestrator\policy.json"
$aegisScript    = Join-Path $PSScriptRoot "aegis-regenerate.ps1"
$regenStateFile = Join-Path $stateDir "aegis-regen-state.json"
$dispatchScript = Join-Path $PSScriptRoot "dispatch-lane.ps1"
$completeScript = Join-Path $PSScriptRoot "complete-task.ps1"
$ackTaskScript  = Join-Path $PSScriptRoot "ack-task.ps1"
$workerLabel    = "lane-$Lane-worker"

$queueMutexName = "Global\WhiteCaves_Orchestrator_Queue"

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null

function Write-Log {
  param([string]$Msg)
  $ts   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  $line = "[$ts][$workerLabel] $Msg"
  Add-Content -Path $logFile -Value $line -Encoding UTF8
}

function Get-NormalizedDeps {
  param($dependsOn)

  if ($null -eq $dependsOn) { return @() }

  if ($dependsOn -is [System.Collections.IDictionary]) {
    if ($dependsOn.Count -eq 0) { return @() }
    return @($dependsOn.Keys | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) })
  }

  if ($dependsOn -is [string]) {
    if ([string]::IsNullOrWhiteSpace($dependsOn)) { return @() }
    return @($dependsOn)
  }

  $normalized = @()
  foreach ($dep in @($dependsOn)) {
    if ($null -eq $dep) { continue }
    if ($dep -is [System.Collections.IDictionary]) {
      foreach ($k in $dep.Keys) {
        if (-not [string]::IsNullOrWhiteSpace([string]$k)) { $normalized += [string]$k }
      }
      continue
    }

    $text = [string]$dep
    if (-not [string]::IsNullOrWhiteSpace($text)) { $normalized += $text }
  }

  return @($normalized)
}

function Get-AegisPolicy {
  if (-not (Test-Path $policyFile)) {
    return @{
      autoRegenerateWhenQueueComplete = $true
      deadlockRecoveryEnabled = $true
      autopilotAutoResolveEvidencePending = $false
    }
  }

  try {
    $p = Get-Content -Path $policyFile -Raw | ConvertFrom-Json
    return @{
      autoRegenerateWhenQueueComplete = if ($null -ne $p.aegis.autoRegenerateWhenQueueComplete) { [bool]$p.aegis.autoRegenerateWhenQueueComplete } else { $true }
      deadlockRecoveryEnabled = if ($null -ne $p.aegis.deadlockRecoveryEnabled) { [bool]$p.aegis.deadlockRecoveryEnabled } else { $true }
      autopilotAutoResolveEvidencePending = if ($null -ne $p.aegis.autopilotAutoResolveEvidencePending) { [bool]$p.aegis.autopilotAutoResolveEvidencePending } else { $false }
    }
  }
  catch {
    Write-Log "Policy parse failed, using safe defaults: $($_.Exception.Message)"
    return @{
      autoRegenerateWhenQueueComplete = $true
      deadlockRecoveryEnabled = $true
      autopilotAutoResolveEvidencePending = $false
    }
  }
}

function Get-NextEvidencePendingTask {
  if (-not (Test-Path $queueFile)) { return $null }

  try {
    $q = Get-Content -Path $queueFile -Raw | ConvertFrom-Json
    $all = @($q.tasks)
  }
  catch {
    return $null
  }

  foreach ($t in ($all | Where-Object { $_.status -eq "evidence_pending" -or $_.status -eq "waiting_ack" } | Sort-Object taskId)) {
    $deps = Get-NormalizedDeps $t.dependsOn
    $blocked = $false
    foreach ($dep in $deps) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") {
        $blocked = $true
        break
      }
    }
    if (-not $blocked) { return $t }
  }

  return $null
}

function Invoke-AutoResolveEvidenceIfNeeded {
  $policy = Get-AegisPolicy
  if (-not [bool]$policy.autopilotAutoResolveEvidencePending) { return $false }
  if (-not (Test-Path $completeScript) -and -not (Test-Path $ackTaskScript)) { return $false }

  $candidate = Get-NextEvidencePendingTask
  if ($null -eq $candidate) { return $false }

  Write-Log ("Auto-resolving review-state task {0} ({1}) status={2}" -f $candidate.taskId, $candidate.agent, $candidate.status)

  $ackByDirect = [string]$candidate.feedsAckBy
  if (-not [string]::IsNullOrWhiteSpace($ackByDirect) -and (Test-Path $ackTaskScript)) {
    $ackDirectOut = & powershell -ExecutionPolicy Bypass -File $ackTaskScript `
      -TaskId $candidate.taskId `
      -AckBy $ackByDirect `
      -WorkspaceRoot $WorkspaceRoot 2>&1

    $ackDirectText = ($ackDirectOut | Out-String).Trim()
    if (-not [string]::IsNullOrWhiteSpace($ackDirectText)) {
      Write-Log ("Direct auto-ack output :: " + ($ackDirectText -replace "`r|`n", " "))
    }

    if ($LASTEXITCODE -eq 0) {
      Write-Log ("Direct auto-ack completed for task {0}" -f $candidate.taskId)
      return $true
    }
  }

  $evidenceNote = "Auto-resolved by $workerLabel during no-ready sweep."
  $producedRef  = "logs/orchestrator/worker-lane-$Lane.log"

  $completeOut = & powershell -ExecutionPolicy Bypass -File $completeScript `
    -TaskId $candidate.taskId `
    -WorkspaceRoot $WorkspaceRoot `
    -EvidenceNote $evidenceNote `
    -ProducedRef $producedRef 2>&1

  $completeText = ($completeOut | Out-String).Trim()
  if (-not [string]::IsNullOrWhiteSpace($completeText)) {
    Write-Log ("Auto-resolve output :: " + ($completeText -replace "`r|`n", " "))
  }

  if ($LASTEXITCODE -ne 0) {
    # Race-safe fallback: if task shifted to waiting_ack, attempt ACK now.
    if (Test-Path $queueFile) {
      try {
        $qNow = Get-Content -Path $queueFile -Raw | ConvertFrom-Json
        $taskNow = @($qNow.tasks) | Where-Object { $_.taskId -eq $candidate.taskId } | Select-Object -First 1
        if ($null -ne $taskNow -and [string]$taskNow.status -eq "waiting_ack" -and -not [string]::IsNullOrWhiteSpace([string]$taskNow.feedsAckBy) -and (Test-Path $ackTaskScript)) {
          $ackByNow = [string]$taskNow.feedsAckBy
          $ackNowOut = & powershell -ExecutionPolicy Bypass -File $ackTaskScript `
            -TaskId $candidate.taskId `
            -AckBy $ackByNow `
            -WorkspaceRoot $WorkspaceRoot 2>&1
          $ackNowText = ($ackNowOut | Out-String).Trim()
          if (-not [string]::IsNullOrWhiteSpace($ackNowText)) {
            Write-Log ("Race fallback auto-ack output :: " + ($ackNowText -replace "`r|`n", " "))
          }
          if ($LASTEXITCODE -eq 0) {
            Write-Log ("Race fallback auto-ack completed for task {0}" -f $candidate.taskId)
            return $true
          }
        }
      }
      catch {
        Write-Log ("Auto-resolve race fallback check failed for {0}: {1}" -f $candidate.taskId, $_.Exception.Message)
      }
    }

    Write-Log ("Auto-resolve failed for {0} (exit=$LASTEXITCODE)" -f $candidate.taskId)
    return $false
  }

  try {
    $completeJson = $completeText | ConvertFrom-Json
    if ($null -ne $completeJson -and [bool]$completeJson.ok) {
      if (
        [string]$completeJson.newStatus -eq "waiting_ack" -and
        -not [string]::IsNullOrWhiteSpace([string]$completeJson.feedsAckBy) -and
        (Test-Path $ackTaskScript)
      ) {
        $ackBy = [string]$completeJson.feedsAckBy
        $ackOut = & powershell -ExecutionPolicy Bypass -File $ackTaskScript `
          -TaskId $candidate.taskId `
          -AckBy $ackBy `
          -WorkspaceRoot $WorkspaceRoot 2>&1

        $ackText = ($ackOut | Out-String).Trim()
        if (-not [string]::IsNullOrWhiteSpace($ackText)) {
          Write-Log ("Auto-ack output :: " + ($ackText -replace "`r|`n", " "))
        }
      }

      Write-Log ("Auto-resolve completed for task {0}" -f $candidate.taskId)
      return $true
    }
  }
  catch {
    Write-Log ("Auto-resolve parse warning for {0}: {1}" -f $candidate.taskId, $_.Exception.Message)
  }

  return $false
}

function Get-QueueStats {
  if (-not (Test-Path $queueFile)) {
    return @{
      hasQueue = $false
      total = 0
      done = 0
      ready = 0
      running = 0
      evidencePending = 0
      waitingAck = 0
      queuedOrRetrying = 0
      blockedQueuedOrRetrying = 0
      isComplete = $false
      isDeadlocked = $false
    }
  }

  try {
    $q = Get-Content -Path $queueFile -Raw | ConvertFrom-Json
    $all = @($q.tasks)
  }
  catch {
    Write-Log "Queue parse failed: $($_.Exception.Message)"
    return @{
      hasQueue = $false
      total = 0
      done = 0
      ready = 0
      running = 0
      evidencePending = 0
      waitingAck = 0
      queuedOrRetrying = 0
      blockedQueuedOrRetrying = 0
      isComplete = $false
      isDeadlocked = $false
    }
  }

  $ready = 0
  $blocked = 0
  $queuedOrRetryingTasks = @($all | Where-Object { $_.status -in @("queued", "retrying") })
  foreach ($t in $queuedOrRetryingTasks) {
    $deps = Get-NormalizedDeps $t.dependsOn
    $isBlocked = $false
    foreach ($dep in $deps) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") {
        $isBlocked = $true
        break
      }
    }
    if ($isBlocked) { $blocked++ } else { $ready++ }
  }

  $total = @($all).Count
  $done = @($all | Where-Object { $_.status -eq "done" }).Count
  $running = @($all | Where-Object { $_.status -eq "running" }).Count
  $evidencePending = @($all | Where-Object { $_.status -eq "evidence_pending" }).Count
  $waitingAck = @($all | Where-Object { $_.status -eq "waiting_ack" }).Count

  $isComplete = ($total -eq 0) -or ($total -gt 0 -and $done -ge $total)
  $isDeadlocked = (
    $total -gt 0 -and
    $done -lt $total -and
    $ready -eq 0 -and
    $running -eq 0 -and
    $evidencePending -eq 0 -and
    $waitingAck -eq 0 -and
    $blocked -gt 0
  )

  return @{
    hasQueue = $true
    total = $total
    done = $done
    ready = $ready
    running = $running
    evidencePending = $evidencePending
    waitingAck = $waitingAck
    queuedOrRetrying = @($queuedOrRetryingTasks).Count
    blockedQueuedOrRetrying = $blocked
    isComplete = $isComplete
    isDeadlocked = $isDeadlocked
  }
}

function Test-RegenCooldownElapsed {
  if (-not (Test-Path $regenStateFile)) { return $true }

  try {
    $state = Get-Content -Path $regenStateFile -Raw | ConvertFrom-Json
    if ($null -eq $state.lastAt -or [string]::IsNullOrWhiteSpace([string]$state.lastAt)) { return $true }

    $lastAt = [datetime]::Parse([string]$state.lastAt)
    $elapsed = ((Get-Date) - $lastAt).TotalSeconds
    return ($elapsed -ge $RegenCooldownSeconds)
  }
  catch {
    return $true
  }
}

function Save-RegenState {
  param([string]$reason)

  $payload = @{
    lastAt = (Get-Date).ToString("o")
    reason = $reason
    by = $workerLabel
  }

  try {
    $json = $payload | ConvertTo-Json -Depth 4
    [System.IO.File]::WriteAllText($regenStateFile, $json, (New-Object System.Text.UTF8Encoding($false)))
  }
  catch {
    Write-Log "Failed to save regen state: $($_.Exception.Message)"
  }
}

function Invoke-AegisRegenIfNeeded {
  param([string]$triggerReason)

  if (-not (Test-Path $aegisScript)) {
    Write-Log "Regen skipped ($triggerReason): aegis-regenerate.ps1 not found."
    return
  }

  $policy = Get-AegisPolicy
  $queueStats = Get-QueueStats

  if (-not $queueStats.hasQueue) {
    Write-Log "Regen skipped ($triggerReason): queue not readable."
    return
  }

  $shouldRegen = $false
  $reason = ""

  if ($queueStats.isComplete -and $policy.autoRegenerateWhenQueueComplete) {
    $shouldRegen = $true
    $reason = "Autopilot queue completion"
  }
  elseif ($queueStats.isDeadlocked -and $policy.deadlockRecoveryEnabled -and $policy.autoRegenerateWhenQueueComplete) {
    $shouldRegen = $true
    $reason = "Autopilot deadlock recovery"
  }

  if (-not $shouldRegen) {
    return
  }

  $regenMutex = New-Object System.Threading.Mutex($false, $queueMutexName)
  try {
    $null = $regenMutex.WaitOne()

    if (-not (Test-RegenCooldownElapsed)) {
      Write-Log ("Regen throttled ({0}s cooldown) for reason={1}." -f $RegenCooldownSeconds, $reason)
      return
    }

    Write-Log ("Triggering aegis-regenerate.ps1 :: reason={0} :: stats=done:{1}/{2} ready:{3} blocked:{4} running:{5} evidence_pending:{6} waiting_ack:{7}" -f $reason, $queueStats.done, $queueStats.total, $queueStats.ready, $queueStats.blockedQueuedOrRetrying, $queueStats.running, $queueStats.evidencePending, $queueStats.waitingAck)

    $regenOut = & powershell -ExecutionPolicy Bypass -File $aegisScript -WorkspaceRoot $WorkspaceRoot -Reason $reason 2>&1
    $regenText = ($regenOut | Out-String).Trim()

    if (-not [string]::IsNullOrWhiteSpace($regenText)) {
      Write-Log ("aegis-regenerate output :: " + ($regenText -replace "`r|`n", " "))
    }

    if ($LASTEXITCODE -eq 0) {
      Save-RegenState -reason $reason
      Write-Log "Aegis regeneration complete."
    }
    else {
      Write-Log ("Aegis regeneration failed with exit code $LASTEXITCODE")
    }
  }
  catch {
    Write-Log ("Regen error: " + $_.Exception.Message)
  }
  finally {
    try { $regenMutex.ReleaseMutex() | Out-Null } catch {}
    $regenMutex.Dispose()
  }
}

Write-Log "Lane worker started. Lane=$Lane PollSeconds=$PollSeconds PreferAgent='$PreferAgent'"

while ($true) {
  $preResolved = Invoke-AutoResolveEvidenceIfNeeded
  if ($preResolved) {
    Write-Log "Pre-claim evidence sweep resolved one task."
  }

  # --- Claim next ready task for this lane ---
  $rawResult = & $dispatchScript `
    -Lane $Lane `
    -PreferAgent $PreferAgent `
    -WorkerLabel $workerLabel `
    -WorkspaceRoot $WorkspaceRoot 2>&1

  $resultStr = ($rawResult | Out-String).Trim()

  try {
    $parsed = $resultStr | ConvertFrom-Json
  }
  catch {
    Write-Log "Parse error on dispatch result: $resultStr"
    Start-Sleep -Seconds $PollSeconds
    continue
  }

  if (-not $parsed.claimed) {
    $resolved = Invoke-AutoResolveEvidenceIfNeeded
    if ($resolved) {
      Write-Log "Evidence sweep resolved one task. Re-checking queue immediately."
      continue
    }

    Invoke-AegisRegenIfNeeded -triggerReason $parsed.reason
    Write-Log "No ready task in lane $Lane ($($parsed.reason)). Sleeping ${PollSeconds}s."
    Start-Sleep -Seconds $PollSeconds
    continue
  }

  $taskId = $parsed.taskId
  $title  = $parsed.title
  $agent  = $parsed.agent
  Write-Log "Claimed task $taskId ('$title') for agent $agent"

  # --- Evidence capture ---
  # Worker records evidence and moves task to evidence_pending for guarded completion.
  $evidenceNote = "Task '$title' claimed by $workerLabel for agent $agent at $(Get-Date). Awaiting review."
  $producedRef  = "logs/orchestrator/worker-lane-$Lane.log"

  $completeResult = & $completeScript `
    -TaskId $taskId `
    -EvidenceNote $evidenceNote `
    -ProducedRef $producedRef `
    -MarkEvidencePending `
    -WorkspaceRoot $WorkspaceRoot 2>&1

  $completeStr = ($completeResult | Out-String).Trim()
  Write-Log "Complete result for ${taskId}: $completeStr"

  $postResolved = Invoke-AutoResolveEvidenceIfNeeded
  if ($postResolved) {
    Write-Log "Post-claim evidence sweep resolved one task."
  }

  Start-Sleep -Seconds $PollSeconds
}
