# agent-loop.ps1 -- Interactive 60-minute free-agent rotation runner
#
# Auto-detects the active agent slot from the current minute, shows their
# READY task + prompt, opens the free tool, waits for paste confirmation,
# marks the task done, shows what just unlocked in the queue.
#
# Usage:
#   npm run orchestrator:agent-loop                  -- auto-detect current slot
#   npm run orchestrator:agent-loop -- -Agent @Timnit  -- force specific agent
#   npm run orchestrator:agent-loop -- -Once            -- one slot, then exit
#   npm run orchestrator:agent-loop -- -NoBrowser       -- skip browser launch
#   npm run orchestrator:agent-loop -- -ShowSchedule    -- print schedule, exit
#   npm run orchestrator:agent-loop -- -NonInteractive   -- auto-confirm and continue
#   npm run orchestrator:agent-loop -- -Autopilot        -- continuous mode (no asks, no browser auto-open)
#   (Autopilot also supports Aegis auto-regeneration when queue is fully complete)
#   npm run orchestrator:agent-loop -- -Approval         -- ask before each advance
#   npm run orchestrator:agent-loop -- -Agent @Sofia -Once -NoBrowser

param(
  [string]$Agent         = "",
  [string]$WorkspaceRoot = ".",
  [switch]$Once,
  [switch]$NoBrowser,
  [switch]$ShowSchedule,
  [switch]$NonInteractive,
  [switch]$Autopilot,
  [switch]$Approval
)

$w       = 72
$root    = Resolve-Path $WorkspaceRoot
$scripts = Join-Path $root "scripts\orchestrator"
$qFile   = Join-Path $root "logs\orchestrator\task-queue.json"
$pFile   = Join-Path $root "scripts\orchestrator\prompts.json"
$policyFile = Join-Path $root "scripts\orchestrator\policy.json"
$aegisScript = Join-Path $scripts "aegis-regenerate.ps1"
$fastForwardScript = Join-Path $scripts "fast-forward.ps1"
$ackTaskScript = Join-Path $scripts "ack-task.ps1"
$completeTaskScript = Join-Path $scripts "complete-task.ps1"
$queueHealthScript = Join-Path $scripts "queue-health.ps1"
$verifyPromptsScript = Join-Path $scripts "verify-prompts.ps1"
$blockerReportScript = Join-Path $scripts "blocker-report.ps1"
$projectProblemScanScript = Join-Path $scripts "project-problem-scan.ps1"
$phaseStateFile = Join-Path $root "logs\orchestrator\aegis-phase-state.json"

# ------------------------------------------------------------------
# EXECUTION MODE (policy + switches)
# Default: approval mode (ask between tasks)
# ------------------------------------------------------------------
$policyDefaultMode = "approval"
$aegisAutoRegenerate = $true
$aegisMaxRegenerationsPerRun = 1
$aegisSmartSelection = $true
$aegisPhaseBalanceEnabled = $true
$aegisTargetImplementationSharePct = 35
$aegisDevSmokeEnabled = $true
$aegisDevSmokeEveryNTasks = 5
$aegisAutopilotRequireProducedRef = $true
$aegisAutopilotAutoResolveEvidencePending = $false
$aegisAutopilotContinuous = $false
$aegisDeadlockRecoveryEnabled = $true
$aegisIdleSleepSeconds = 10
$aegisPreflightEnabled = $true
$aegisAutoUnblockSweepEnabled = $true
$aegisQueueHealthEveryNTasks = 3
$aegisProblemScannerEnabled = $true
$aegisProblemScannerAutoFixEnabled = $true
$aegisProblemScannerEveryNTasks = 3
$aegisProblemScannerIdleEveryNLoops = 6
$devSmokeScript = Join-Path $scripts "dev-smoke.ps1"
if (Test-Path $policyFile) {
  try {
    $policy = Get-Content $policyFile -Raw | ConvertFrom-Json
    if (
      $null -ne $policy.executionMode -and
      $null -ne $policy.executionMode.default -and
      -not [string]::IsNullOrWhiteSpace([string]$policy.executionMode.default)
    ) {
      $policyDefaultMode = ([string]$policy.executionMode.default).ToLower()
    } elseif ($null -ne $policy.autonomousDefault -and [bool]$policy.autonomousDefault) {
      $policyDefaultMode = "autopilot"
    }

    if ($null -ne $policy.executionMode -and $null -ne $policy.executionMode.autopilot) {
      if ($null -ne $policy.executionMode.autopilot.continuous) {
        $aegisAutopilotContinuous = [bool]$policy.executionMode.autopilot.continuous
      }
    }

    if ($null -ne $policy.aegis) {
      if ($null -ne $policy.aegis.autoRegenerateWhenQueueComplete) {
        $aegisAutoRegenerate = [bool]$policy.aegis.autoRegenerateWhenQueueComplete
      }
      if ($null -ne $policy.aegis.maxRegenerationsPerRun) {
        $parsedMax = 1
        if ([int]::TryParse([string]$policy.aegis.maxRegenerationsPerRun, [ref]$parsedMax) -and $parsedMax -ge 1) {
          $aegisMaxRegenerationsPerRun = $parsedMax
        }
      }
      if ($null -ne $policy.aegis.smartSelectionEnabled) {
        $aegisSmartSelection = [bool]$policy.aegis.smartSelectionEnabled
      }
      if ($null -ne $policy.aegis.phaseBalanceEnabled) {
        $aegisPhaseBalanceEnabled = [bool]$policy.aegis.phaseBalanceEnabled
      }
      if ($null -ne $policy.aegis.targetImplementationSharePct) {
        $parsedImplShare = 35
        if ([int]::TryParse([string]$policy.aegis.targetImplementationSharePct, [ref]$parsedImplShare)) {
          $aegisTargetImplementationSharePct = [math]::Max(0, [math]::Min(100, $parsedImplShare))
        }
      }
      if ($null -ne $policy.aegis.devSmokeEnabled) {
        $aegisDevSmokeEnabled = [bool]$policy.aegis.devSmokeEnabled
      }
      if ($null -ne $policy.aegis.devSmokeEveryNTasks) {
        $parsedEvery = 0
        if ([int]::TryParse([string]$policy.aegis.devSmokeEveryNTasks, [ref]$parsedEvery) -and $parsedEvery -ge 1) {
          $aegisDevSmokeEveryNTasks = $parsedEvery
        }
      }
      if ($null -ne $policy.aegis.autopilotRequireProducedRef) {
        $aegisAutopilotRequireProducedRef = [bool]$policy.aegis.autopilotRequireProducedRef
      }
      if ($null -ne $policy.aegis.autopilotAutoResolveEvidencePending) {
        $aegisAutopilotAutoResolveEvidencePending = [bool]$policy.aegis.autopilotAutoResolveEvidencePending
      }
      if ($null -ne $policy.aegis.deadlockRecoveryEnabled) {
        $aegisDeadlockRecoveryEnabled = [bool]$policy.aegis.deadlockRecoveryEnabled
      }
      if ($null -ne $policy.aegis.idleSleepSeconds) {
        $parsedIdle = 10
        if ([int]::TryParse([string]$policy.aegis.idleSleepSeconds, [ref]$parsedIdle) -and $parsedIdle -ge 1 -and $parsedIdle -le 300) {
          $aegisIdleSleepSeconds = $parsedIdle
        }
      }
      if ($null -ne $policy.aegis.preflightEnabled) {
        $aegisPreflightEnabled = [bool]$policy.aegis.preflightEnabled
      }
      if ($null -ne $policy.aegis.autoUnblockSweepEnabled) {
        $aegisAutoUnblockSweepEnabled = [bool]$policy.aegis.autoUnblockSweepEnabled
      }
      if ($null -ne $policy.aegis.queueHealthEveryNTasks) {
        $parsedQH = 0
        if ([int]::TryParse([string]$policy.aegis.queueHealthEveryNTasks, [ref]$parsedQH) -and $parsedQH -ge 1 -and $parsedQH -le 50) {
          $aegisQueueHealthEveryNTasks = $parsedQH
        }
      }
      if ($null -ne $policy.aegis.problemScannerEnabled) {
        $aegisProblemScannerEnabled = [bool]$policy.aegis.problemScannerEnabled
      }
      if ($null -ne $policy.aegis.problemScannerAutoFixEnabled) {
        $aegisProblemScannerAutoFixEnabled = [bool]$policy.aegis.problemScannerAutoFixEnabled
      }
      if ($null -ne $policy.aegis.problemScannerEveryNTasks) {
        $parsedProblemEvery = 0
        if ([int]::TryParse([string]$policy.aegis.problemScannerEveryNTasks, [ref]$parsedProblemEvery) -and $parsedProblemEvery -ge 1 -and $parsedProblemEvery -le 50) {
          $aegisProblemScannerEveryNTasks = $parsedProblemEvery
        }
      }
      if ($null -ne $policy.aegis.problemScannerIdleEveryNLoops) {
        $parsedProblemIdle = 0
        if ([int]::TryParse([string]$policy.aegis.problemScannerIdleEveryNLoops, [ref]$parsedProblemIdle) -and $parsedProblemIdle -ge 1 -and $parsedProblemIdle -le 300) {
          $aegisProblemScannerIdleEveryNLoops = $parsedProblemIdle
        }
      }
    }
  } catch {
    $policyDefaultMode = "approval"
  }
}

if ($Autopilot) {
  $aegisAutopilotContinuous = $true
}

$effectiveNonInteractive = $false
if ($Autopilot) {
  $effectiveNonInteractive = $true
} elseif ($Approval) {
  $effectiveNonInteractive = $false
} elseif ($NonInteractive) {
  $effectiveNonInteractive = $true
} else {
  $effectiveNonInteractive = ($policyDefaultMode -eq "autopilot")
}

# Safety default: in autopilot/non-interactive runs, do not auto-open browser tabs
# unless the user explicitly chooses browser mode via another command path.
if ($effectiveNonInteractive -and -not $PSBoundParameters.ContainsKey('NoBrowser')) {
  $NoBrowser = $true
}

# ------------------------------------------------------------------
# SLOT SCHEDULE  (minute-of-hour -> agent)
# PS5.1-safe: plain array of hashtables (no integer-keyed ordered dict)
# ------------------------------------------------------------------
$slotList = @(
  @{ Minute = 0;  Agent = "@Annie"   }
  @{ Minute = 5;  Agent = "@Rachel"  }
  @{ Minute = 10; Agent = "@Marissa" }
  @{ Minute = 15; Agent = "@Timnit"  }
  @{ Minute = 20; Agent = "@Hedy"    }
  @{ Minute = 25; Agent = "@Maya"    }
  @{ Minute = 30; Agent = "@Booking" }
  @{ Minute = 35; Agent = "@Jaime"   }
  @{ Minute = 40; Agent = "@Fei-Fei" }
  @{ Minute = 45; Agent = "@Anima"   }
  @{ Minute = 50; Agent = "@Mary"    }
  @{ Minute = 55; Agent = "@Corinne" }
)
$anyAgents = @("@Victoria","@Invoice","@Sofia","@Cassie","@Joelle")

# ------------------------------------------------------------------
# TOOL MAP
# ------------------------------------------------------------------
$toolUrl = @{
  "@Sofia"    = "https://aistudio.google.com/"
  "@Timnit"   = "https://aistudio.google.com/"
  "@Victoria" = "https://aistudio.google.com/"
  "@Annie"    = "https://aistudio.google.com/"
  "@Marissa"  = "https://aistudio.google.com/"
  "@Rachel"   = "https://aistudio.google.com/"
  "@Joelle"   = "https://console.groq.com/"
  "@Fei-Fei"  = "https://chat.deepseek.com/"
  "@Anima"    = "https://chat.deepseek.com/"
  "@Mary"     = "https://chat.deepseek.com/"
  "@Invoice"  = "https://console.groq.com/"
  "@Booking"  = "https://console.groq.com/"
  "@Maya"     = "https://console.groq.com/"
  "@Hedy"     = "https://console.groq.com/"
  "@Cassie"   = "https://chat.deepseek.com/"
  "@Jaime"    = "https://console.groq.com/"
  "@Corinne"  = "https://chat.deepseek.com/"
  "@Mira"     = "https://github.com/copilot"
  "@Mala"     = "https://github.com/copilot"
  "@Katherine"= "https://github.com/copilot"
  "@Gwynne"   = "https://github.com/copilot"
}
$toolName = @{
  "@Sofia"    = "Google AI Studio (Gemini 2.0 Flash)"
  "@Timnit"   = "Google AI Studio (Gemini 2.0 Flash)"
  "@Victoria" = "Google AI Studio (Gemini 2.0 Flash)"
  "@Annie"    = "Google AI Studio (Gemini 2.0 Flash)"
  "@Marissa"  = "Google AI Studio (Gemini 2.0 Flash)"
  "@Rachel"   = "Google AI Studio (Gemini 2.0 Flash)"
  "@Joelle"   = "Groq Console (Llama 3.1 70B)"
  "@Fei-Fei"  = "DeepSeek Chat (DeepSeek V3)"
  "@Anima"    = "DeepSeek Chat (DeepSeek V3)"
  "@Mary"     = "DeepSeek Chat (DeepSeek V3)"
  "@Invoice"  = "Groq Console (Llama 3.1 70B)"
  "@Booking"  = "Groq Console (Llama 3.1 70B)"
  "@Maya"     = "Groq Console (Llama 3.1 70B)"
  "@Hedy"     = "Groq Console (Llama 3.1 70B)"
  "@Cassie"   = "DeepSeek Chat (DeepSeek V3)"
  "@Jaime"    = "Groq Console (Llama 3.1 70B)"
  "@Corinne"  = "DeepSeek Chat (DeepSeek V3)"
  "@Mira"     = "Premium Implementation (GitHub Copilot)"
  "@Mala"     = "Premium Implementation (GitHub Copilot)"
  "@Katherine"= "Premium QA/Fix (GitHub Copilot)"
  "@Gwynne"   = "Premium DevOps (GitHub Copilot)"
}

# ------------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------------
function Get-CurrentSlotAgent {
  $min = (Get-Date).Minute
  $active = $slotList[0].Agent
  foreach ($s in $slotList) {
    if ($min -ge $s.Minute) { $active = $s.Agent }
  }
  return $active
}

function Get-MinutesUntilNextSlot {
  $min = (Get-Date).Minute
  foreach ($s in $slotList) {
    if ($s.Minute -gt $min) { return ($s.Minute - $min) }
  }
  return (60 - $min)  # wraps to next hour :00
}

function Get-NextSlotAgent {
  $min = (Get-Date).Minute
  foreach ($s in $slotList) {
    if ($s.Minute -gt $min) { return $s.Agent }
  }
  return $slotList[0].Agent  # wrap to :00 of next hour
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
      if ($dep.Count -eq 0) { continue }
      foreach ($k in $dep.Keys) {
        if (-not [string]::IsNullOrWhiteSpace([string]$k)) { $normalized += [string]$k }
      }
      continue
    }
    $s = [string]$dep
    if (-not [string]::IsNullOrWhiteSpace($s)) { $normalized += $s }
  }

  return @($normalized)
}

function Get-NextReadyInRotation {
  param([string]$preferredAgent)

  $slotAgents = @($slotList | ForEach-Object { $_.Agent })
  if ($slotAgents.Count -eq 0) { return $null }
  if (-not (Test-Path $qFile)) { return $null }

  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  $allTasks = @($q.tasks)

  $startIdx = [Array]::IndexOf($slotAgents, $preferredAgent)
  if ($startIdx -lt 0) { $startIdx = 0 }

  $ordered = @()
  for ($i = $startIdx; $i -lt $slotAgents.Count; $i++) { $ordered += $slotAgents[$i] }
  for ($i = 0; $i -lt $startIdx; $i++) { $ordered += $slotAgents[$i] }
  foreach ($aa in $anyAgents) {
    if ($ordered -notcontains $aa) { $ordered += $aa }
  }

  foreach ($ag in $ordered) {
    $candidate = Get-AgentNextReadyTask -agentName $ag -allTasks $allTasks
    if ($null -ne $candidate) {
      return @{ Agent = $ag; Task = $candidate }
    }
  }

  return $null
}

function Get-SmartNextReadyTask {
  param(
    [string]$LastPhase = "",
    [bool]$PhaseBalanceEnabled = $true,
    [int]$TargetImplementationSharePct = 35
  )

  if (-not (Test-Path $qFile)) { return $null }

  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  $allTasks = @($q.tasks)

  $readyTasks = @()
  foreach ($t in ($allTasks | Where-Object { $_.status -in @("queued","retrying") })) {
    $blocked = $false
    foreach ($dep in (Get-NormalizedDeps $t.dependsOn)) {
      $depTask = $allTasks | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") { $blocked = $true; break }
    }
    if (-not $blocked) { $readyTasks += $t }
  }

  if ($readyTasks.Count -eq 0) { return $null }

  $GetPhase = {
    param($Task)

    $phase = [string]$Task.phase
    if (-not [string]::IsNullOrWhiteSpace($phase)) { return $phase.ToLower() }

    $team = [string]$Task.team
    if ($team -match "implementation|premium") { return "implementation" }

    return "planning"
  }

  $readyPlanning = @($readyTasks | Where-Object { (& $GetPhase $_) -eq "planning" })
  $readyImplementation = @($readyTasks | Where-Object { (& $GetPhase $_) -eq "implementation" })

  $GetPriorityWeight = {
    param($Task)

    if ($null -ne $Task.priorityScore) {
      $parsed = 0
      if ([int]::TryParse([string]$Task.priorityScore, [ref]$parsed)) { return $parsed }
    }

    $priority = [string]$Task.priority
    if ([string]::IsNullOrWhiteSpace($priority)) { return 50 }
    switch ($priority.ToLower()) {
      "critical" { return 100 }
      "high" { return 80 }
      "medium" { return 60 }
      "low" { return 20 }
      default { return 50 }
    }
  }

  $priorityMax = -1
  foreach ($rt in $readyTasks) {
    $w = (& $GetPriorityWeight $rt)
    if ($w -gt $priorityMax) { $priorityMax = $w }
  }

  if ($priorityMax -gt 50) {
    $readyTasks = @($readyTasks | Where-Object { (& $GetPriorityWeight $_) -eq $priorityMax })
    $readyPlanning = @($readyTasks | Where-Object { (& $GetPhase $_) -eq "planning" })
    $readyImplementation = @($readyTasks | Where-Object { (& $GetPhase $_) -eq "implementation" })
  }

  $targetPhase = ""
  if ($readyPlanning.Count -gt 0 -and $readyImplementation.Count -gt 0) {
    if ($PhaseBalanceEnabled) {
      $donePlanning = @($allTasks | Where-Object { (& $GetPhase $_) -eq "planning" -and $_.status -eq "done" }).Count
      $doneImplementation = @($allTasks | Where-Object { (& $GetPhase $_) -eq "implementation" -and $_.status -eq "done" }).Count
      $doneTotal = $donePlanning + $doneImplementation

      $implShare = if ($doneTotal -gt 0) { [math]::Round((100.0 * $doneImplementation / $doneTotal), 1) } else { 0 }
      $implDeficit = [double]$TargetImplementationSharePct - [double]$implShare

      if ($implDeficit -gt 5) {
        $targetPhase = "implementation"
      } elseif ($implDeficit -lt -5) {
        $targetPhase = "planning"
      }
    }

    if ([string]::IsNullOrWhiteSpace($targetPhase)) {
      if ($LastPhase -eq "planning") {
        $targetPhase = "implementation"
      } elseif ($LastPhase -eq "implementation") {
        $targetPhase = "planning"
      } else {
      $allDonePlanning = @($allTasks | Where-Object {
        $p = [string]$_.phase
        if ([string]::IsNullOrWhiteSpace($p)) {
          $tm = [string]$_.team
          $p = if ($tm -match "implementation|premium") { "implementation" } else { "planning" }
        }
        $p.ToLower() -eq "planning" -and $_.status -eq "done"
      }).Count

      $allDoneImplementation = @($allTasks | Where-Object {
        $p = [string]$_.phase
        if ([string]::IsNullOrWhiteSpace($p)) {
          $tm = [string]$_.team
          $p = if ($tm -match "implementation|premium") { "implementation" } else { "planning" }
        }
        $p.ToLower() -eq "implementation" -and $_.status -eq "done"
      }).Count

      $targetPhase = if ($allDoneImplementation -le $allDonePlanning) { "implementation" } else { "planning" }
      }
    }
  } elseif ($readyPlanning.Count -gt 0) {
    $targetPhase = "planning"
  } elseif ($readyImplementation.Count -gt 0) {
    $targetPhase = "implementation"
  }

  $candidateReady = if ([string]::IsNullOrWhiteSpace($targetPhase)) {
    $readyTasks
  } else {
    @($readyTasks | Where-Object { (& $GetPhase $_) -eq $targetPhase })
  }

  if ($candidateReady.Count -eq 0) { $candidateReady = $readyTasks }

  $laneScores = @{}
  foreach ($lane in @("A","B","C","D")) {
    $laneTasks = @($allTasks | Where-Object { $_.lane -eq $lane })
    if ($laneTasks.Count -eq 0) { continue }

    $pending = @($laneTasks | Where-Object { $_.status -in @("queued","running","waiting_ack","retrying","failed","escalated") }).Count
    $waitingAck = @($laneTasks | Where-Object { $_.status -eq "waiting_ack" }).Count
    $blocked = @($laneTasks | Where-Object { $_.status -in @("failed","escalated") }).Count
    $retrying = @($laneTasks | Where-Object { $_.status -eq "retrying" }).Count
    $done = @($laneTasks | Where-Object { $_.status -eq "done" }).Count
    $completionPct = if ($laneTasks.Count -gt 0) { 100 * ($done / $laneTasks.Count) } else { 0 }
    $strength = [math]::Max(0, [math]::Min(100, ($completionPct - ($waitingAck * 6) - ($retrying * 8) - ($blocked * 18))))
    $attentionScore = [int]($pending * 10 + $blocked * 25 + $waitingAck * 8 + $retrying * 10 + (100 - $strength))

    $laneScores[$lane] = $attentionScore
  }

  $readyByLane = @($candidateReady | Group-Object lane)
  $bestLane = $null
  $bestScore = -1
  foreach ($g in $readyByLane) {
    $lane = [string]$g.Name
    $score = if ($laneScores.ContainsKey($lane)) { [int]$laneScores[$lane] } else { 0 }
    if ($score -gt $bestScore) {
      $bestScore = $score
      $bestLane = $lane
    }
  }

  if ([string]::IsNullOrWhiteSpace($bestLane)) {
    $fallbackTask = @($candidateReady | Sort-Object taskId | Select-Object -First 1)
    if ($fallbackTask.Count -gt 0) {
      $fallbackPhase = (& $GetPhase $fallbackTask[0])
      return @{ Agent = [string]$fallbackTask[0].agent; Task = $fallbackTask[0]; Phase = $fallbackPhase }
    }
    return $null
  }

  $selected = @($candidateReady | Where-Object { $_.lane -eq $bestLane } | Sort-Object taskId | Select-Object -First 1)
  if ($selected.Count -eq 0) { return $null }

  $selectedPhase = (& $GetPhase $selected[0])
  return @{ Agent = [string]$selected[0].agent; Task = $selected[0]; Phase = $selectedPhase }
}

function Get-AgentNextReadyTask {
  param(
    [string]$agentName,
    [array]$allTasks = $null
  )

  $all = $allTasks
  if ($null -eq $all) {
    if (-not (Test-Path $qFile)) { return $null }
    $q = Get-Content $qFile -Raw | ConvertFrom-Json
    $all = @($q.tasks)
  }

  $agentTasks = @($all | Where-Object { $_.agent -eq $agentName })
  foreach ($t in ($agentTasks | Sort-Object taskId)) {
    if ($t.status -notin @("queued","retrying")) { continue }
    $blocked = $false
    foreach ($dep in (Get-NormalizedDeps $t.dependsOn)) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") { $blocked = $true; break }
    }
    if (-not $blocked) { return $t }
  }
  return $null
}

function Get-QueueDoneCount {
  if (-not (Test-Path $qFile)) { return 0 }
  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  return @($q.tasks | Where-Object { $_.status -eq "done" }).Count
}

function Get-QueueTotalCount {
  if (-not (Test-Path $qFile)) { return 0 }
  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  return @($q.tasks).Count
}

function Get-TaskById {
  param([string]$taskId)
  if (-not (Test-Path $qFile)) { return $null }
  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  $all = @($q.tasks)
  return ($all | Where-Object { $_.taskId -eq $taskId } | Select-Object -First 1)
}

function Get-ReadyCount {
  if (-not (Test-Path $qFile)) { return 0 }
  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  $all = @($q.tasks)
  $ready = 0
  foreach ($t in ($all | Where-Object { $_.status -eq "queued" })) {
    $blocked = $false
    foreach ($dep in (Get-NormalizedDeps $t.dependsOn)) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") { $blocked = $true; break }
    }
    if (-not $blocked) { $ready++ }
  }
  return $ready
}

function Get-NextEvidencePendingTask {
  if (-not (Test-Path $qFile)) { return $null }
  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  $all = @($q.tasks)

  foreach ($t in ($all | Where-Object { $_.status -eq "evidence_pending" } | Sort-Object taskId)) {
    $blocked = $false
    foreach ($dep in (Get-NormalizedDeps $t.dependsOn)) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") { $blocked = $true; break }
    }
    if (-not $blocked) { return $t }
  }

  return $null
}

function Invoke-AegisPreflight {
  param()

  if (-not $effectiveNonInteractive) { return }
  if (-not $aegisPreflightEnabled) { return }

  Write-Host "  [AEGIS PREFLIGHT] Running quick integrity checks..." -ForegroundColor Cyan

  if (Test-Path $verifyPromptsScript) {
    & powershell -ExecutionPolicy Bypass -File "$verifyPromptsScript" 2>&1 | Out-String | Write-Host
  }

  if (Test-Path $queueHealthScript) {
    & powershell -ExecutionPolicy Bypass -File "$queueHealthScript" -Brief 2>&1 | Out-String | Write-Host
  }

  if (Test-Path $blockerReportScript) {
    & powershell -ExecutionPolicy Bypass -File "$blockerReportScript" -Brief -Top 5 2>&1 | Out-String | Write-Host
  }

  Write-Host "  [AEGIS PREFLIGHT] Completed." -ForegroundColor Green
  Write-Host ""
}

function Invoke-AegisUnblockSweep {
  param()

  $result = @{ Resolved = 0; Acked = 0; Completed = 0 }
  if (-not $aegisAutoUnblockSweepEnabled) { return $result }
  if (-not (Test-Path $qFile)) { return $result }
  if (-not (Test-Path $ackTaskScript) -or -not (Test-Path $completeTaskScript)) { return $result }

  try {
    $q = Get-Content $qFile -Raw | ConvertFrom-Json
    $all = @($q.tasks)
  } catch {
    return $result
  }

  $candidates = @($all | Where-Object { $_.status -in @("waiting_ack", "evidence_pending") } | Sort-Object taskId)
  foreach ($t in $candidates) {
    if ($t.status -eq "waiting_ack") {
      $ackBy = [string]$t.feedsAckBy
      if ([string]::IsNullOrWhiteSpace($ackBy)) { continue }

      $ackOut = & powershell -ExecutionPolicy Bypass -File "$ackTaskScript" `
        -TaskId $t.taskId `
        -AckBy $ackBy `
        -WorkspaceRoot $root 2>&1

      try {
        $ackJson = ($ackOut | Out-String).Trim() | ConvertFrom-Json
        if ($ackJson.ok) {
          $result.Resolved++
          $result.Acked++
        }
      } catch {}
      continue
    }

    if ($t.status -eq "evidence_pending") {
      $completeOut = & powershell -ExecutionPolicy Bypass -File "$completeTaskScript" `
        -TaskId $t.taskId `
        -WorkspaceRoot $root `
        -EvidenceNote "Autopilot unblock sweep resolution." `
        -ProducedRef "logs/orchestrator/agent-loop-autopilot.log" 2>&1

      try {
        $completeJson = ($completeOut | Out-String).Trim() | ConvertFrom-Json
        if ($completeJson.ok) {
          $result.Resolved++
          $result.Completed++

          if ($completeJson.newStatus -eq "waiting_ack" -and -not [string]::IsNullOrWhiteSpace([string]$completeJson.feedsAckBy)) {
            $ackOut = & powershell -ExecutionPolicy Bypass -File "$ackTaskScript" `
              -TaskId $t.taskId `
              -AckBy ([string]$completeJson.feedsAckBy) `
              -WorkspaceRoot $root 2>&1

            try {
              $ackJson = ($ackOut | Out-String).Trim() | ConvertFrom-Json
              if ($ackJson.ok) {
                $result.Resolved++
                $result.Acked++
              }
            } catch {}
          }
        }
      } catch {}
    }
  }

  return $result
}

function Invoke-AegisProblemScanner {
  param(
    [string]$Reason = "periodic"
  )

  $result = @{ Ran = $false; Ok = $true }
  if (-not $aegisProblemScannerEnabled) { return $result }
  if (-not (Test-Path $projectProblemScanScript)) { return $result }

  $result.Ran = $true
  Write-Host ""
  Write-Host ("  [AEGIS SCAN] Running project problem scan ({0})..." -f $Reason) -ForegroundColor Cyan

  $args = @(
    "-ExecutionPolicy", "Bypass",
    "-File", "$projectProblemScanScript",
    "-WorkspaceRoot", "$root",
    "-Brief"
  )
  if ($aegisProblemScannerAutoFixEnabled) {
    $args += "-AutoFix"
  }

  $scanOut = & powershell @args 2>&1
  $scanText = ($scanOut | Out-String).Trim()
  if (-not [string]::IsNullOrWhiteSpace($scanText)) {
    Write-Host $scanText
  }

  $result.Ok = ($LASTEXITCODE -eq 0)
  if ($result.Ok) {
    Write-Host "  [AEGIS SCAN] Project scan completed with no blocking issues." -ForegroundColor Green
  } else {
    Write-Host "  [AEGIS SCAN] Issues detected (or environment blocked); autopilot will continue and retry." -ForegroundColor DarkYellow
  }

  return $result
}

function Get-Prompt {
  param([string]$taskId)
  $val = $null
  if (Test-Path $pFile) {
    try {
      $p = Get-Content $pFile -Raw | ConvertFrom-Json
      $val = $p.PSObject.Properties | Where-Object { $_.Name -eq $taskId } | Select-Object -ExpandProperty Value
    } catch {
      $val = $null
    }
  }

  if (-not [string]::IsNullOrWhiteSpace([string]$val)) {
    return $val
  }

  # Fallback for Aegis-generated tasks when prompts.json is out of sync.
  if ($taskId -like "AGC*") {
    $task = Get-TaskById -taskId $taskId
    if ($null -ne $task) {
      $phase = [string]$task.phase
      if ([string]::IsNullOrWhiteSpace($phase)) {
        $team = [string]$task.team
        $phase = if ($team -match "implementation|premium") { "implementation" } else { "planning" }
      }

      if ($phase.ToLower() -eq "implementation") {
        return ("{0} -- IMPLEMENT+VERIFY: {1}. Deliver code-level execution, focused validation (typecheck/lint/build/tests), risk controls, rollback notes, and handoff artifacts." -f $task.agent, $task.title)
      }

      return ("{0} -- RESEARCH+PLAN: {1}. Include top issues/opportunities, root causes, API/data/UI impact, acceptance criteria, tests, risks (P0/P1/P2), and FEEDS/FEEDS_ACK handoffs." -f $task.agent, $task.title)
    }
  }

  return "(no prompt for $taskId -- add to prompts.json)"
}

function Write-Divider { param([string]$color="DarkGray"); Write-Host ("-" * $w) -ForegroundColor $color }
function Write-BigDivider { param([string]$color="Magenta"); Write-Host ("=" * $w) -ForegroundColor $color }

function Show-Prompt {
  param([string]$text)
  Write-Host "  +-- COPY PROMPT --+" -ForegroundColor Yellow
  Write-Host ""
  $words = $text -split " "
  $line  = "  | "
  foreach ($word in $words) {
    if (($line + $word).Length -gt 88) { Write-Host $line -ForegroundColor White; $line = "  | " }
    $line = $line + $word + " "
  }
  if ($line.Trim().Length -gt 2) { Write-Host $line -ForegroundColor White }
  Write-Host ""
  Write-Host "  +-----------------+" -ForegroundColor Yellow
}

# ------------------------------------------------------------------
# SHOW SCHEDULE (if -ShowSchedule flag)
# ------------------------------------------------------------------
if ($ShowSchedule) {
  Write-BigDivider -color Cyan
  Write-Host "  FREE-AGENT 60-MINUTE ROTATION SCHEDULE" -ForegroundColor Cyan
  Write-Host "  (Each slot = 5 minutes. Run agent-loop to auto-detect active slot.)" -ForegroundColor DarkGray
  Write-BigDivider -color Cyan
  Write-Host ""
  $cur = Get-CurrentSlotAgent
  $now = Get-Date -Format "HH:mm"
  Write-Host ("  Now: {0}  |  Active slot: {1}" -f $now, $cur) -ForegroundColor Green
  Write-Host ""
  Write-Host ("  {0,-6} {1,-14} {2,-40}" -f "Slot", "Agent", "Free Tool") -ForegroundColor White
  Write-Host ("  {0,-6} {1,-14} {2,-40}" -f "----", "-------------", "------------------------------------") -ForegroundColor DarkGray
  foreach ($s in $slotList) {
    $ag   = $s.Agent
    $tn   = if ($toolName.ContainsKey($ag)) { $toolName[$ag] } else { "N/A" }
    $mark = if ($ag -eq $cur) { " <<< ACTIVE NOW" } else { "" }
    $col  = if ($ag -eq $cur) { "Green" } else { "DarkGray" }
    Write-Host ("  :{0,-5} {1,-14} {2}{3}" -f "$($s.Minute)".PadLeft(2,"0"), $ag, $tn, $mark) -ForegroundColor $col
  }
  Write-Host ""
  Write-Host "  Any-slot agents (use -Agent to invoke):" -ForegroundColor DarkGray
  foreach ($aa in $anyAgents) {
    $tn = if ($toolName.ContainsKey($aa)) { $toolName[$aa] } else { "N/A" }
    Write-Host ("  Any    {0,-14} {1}" -f $aa, $tn) -ForegroundColor DarkGray
  }
  Write-Host ""
  Write-BigDivider -color Cyan
  exit 0
}

# ------------------------------------------------------------------
# MAIN LOOP
# ------------------------------------------------------------------
Write-BigDivider
Write-Host "  WHITE CAVES -- FREE-AGENT LOOP" -ForegroundColor Magenta
Write-Host ("  {0}" -f (Get-Date -Format "dddd, MMMM d, yyyy  HH:mm")) -ForegroundColor Magenta
Write-BigDivider
Write-Host ""

$loopCount = 0
$aegisRegenerations = 0
$aegisCompletedInRun = 0
$aegisLastSelectedPhase = ""
$aegisNoReadyLoopCounter = 0

Invoke-AegisPreflight

if (Test-Path $phaseStateFile) {
  try {
    $phaseState = Get-Content $phaseStateFile -Raw | ConvertFrom-Json
    if ($null -ne $phaseState.lastPhase -and -not [string]::IsNullOrWhiteSpace([string]$phaseState.lastPhase)) {
      $aegisLastSelectedPhase = ([string]$phaseState.lastPhase).ToLower()
    }
  } catch {
    $aegisLastSelectedPhase = ""
  }
}

:outerLoop while ($true) {
  $loopCount++

  # 1. DETERMINE ACTIVE AGENT
  if ($Agent -ne "") {
    $activeAgent = $Agent
    $slotLabel   = "manual"
    $task = Get-AgentNextReadyTask -agentName $activeAgent
  } elseif ($effectiveNonInteractive) {
    if ($aegisSmartSelection) {
      $nextReady = Get-SmartNextReadyTask `
        -LastPhase $aegisLastSelectedPhase `
        -PhaseBalanceEnabled $aegisPhaseBalanceEnabled `
        -TargetImplementationSharePct $aegisTargetImplementationSharePct
    } else {
      $preferred = Get-CurrentSlotAgent
      $nextReady = Get-NextReadyInRotation -preferredAgent $preferred
    }
    if ($null -ne $nextReady) {
      $activeAgent = [string]$nextReady.Agent
      $task        = $nextReady.Task
      $slotLabel   = "auto"
    } else {
      $activeAgent = Get-CurrentSlotAgent
      $task        = $null
      $slotLabel   = "auto"
    }
  } else {
    $activeAgent = Get-CurrentSlotAgent
    $min         = (Get-Date).Minute
    $slotLabel   = ":{0}" -f "$min".PadLeft(2,"0")
    $task = Get-AgentNextReadyTask -agentName $activeAgent
  }

  # 2. FIND NEXT READY TASK
  if ($null -eq $task) {
    $aegisNoReadyLoopCounter++
    Write-Host ("  [{0}] {1} -- no READY task found (all done or blocked)" -f $slotLabel, $activeAgent) -ForegroundColor DarkYellow
    Write-Host ""
    if ($Agent -ne "") {
      Write-Host "  All tasks done or blocked for $activeAgent." -ForegroundColor DarkGray
      Write-Host "  Tip: npm run orchestrator:blockers -- to see what is blocking" -ForegroundColor DarkGray
      break
    }
    if ($effectiveNonInteractive) {
      $sweepResult = Invoke-AegisUnblockSweep
      if ($sweepResult.Resolved -gt 0) {
        Write-Host ("  [AEGIS] Auto-unblock sweep resolved {0} task transition(s) (completed: {1}, acked: {2})." -f $sweepResult.Resolved, $sweepResult.Completed, $sweepResult.Acked) -ForegroundColor Green
        Write-Host ""
        continue
      }

      $queueFileLooksEmpty = $false
      if (Test-Path $qFile) {
        try {
          $queueFileLooksEmpty = ((Get-Item $qFile).Length -eq 0)
        } catch {
          $queueFileLooksEmpty = $false
        }
      }

      if (
        $queueFileLooksEmpty -and
        $aegisAutoRegenerate -and
        $aegisRegenerations -lt $aegisMaxRegenerationsPerRun -and
        (Test-Path $aegisScript)
      ) {
        Write-Host "  [AEGIS] Queue file is empty. Regenerating recovery cycle..." -ForegroundColor Yellow
        & "$aegisScript" -WorkspaceRoot $root -Reason "Autopilot queue-file empty recovery" -Force
        $aegisRegenerations++
        Write-Host "  [AEGIS] Recovery cycle generated from empty queue file. Continuing autopilot..." -ForegroundColor Green
        Write-Host ""
        continue
      }

      $pendingCandidate = Get-NextEvidencePendingTask
      if ($aegisAutopilotAutoResolveEvidencePending -and $null -ne $pendingCandidate) {
        Write-Host ("  [AEGIS] No READY tasks. Auto-resolving evidence_pending task: {0} ({1})" -f $pendingCandidate.taskId, $pendingCandidate.agent) -ForegroundColor Cyan

        $requiresAck = [bool]$pendingCandidate.requiresFeedsAck
        $ackBy = [string]$pendingCandidate.feedsAckBy

        if ($requiresAck -and -not [string]::IsNullOrWhiteSpace($ackBy) -and (Test-Path $ackTaskScript)) {
          & powershell -ExecutionPolicy Bypass -File "$ackTaskScript" `
            -TaskId $pendingCandidate.taskId `
            -AckBy $ackBy `
            -WorkspaceRoot $root 2>&1 | Out-String | Write-Host

          Write-Host ("  [AEGIS] ACK applied by {0} for {1}." -f $ackBy, $pendingCandidate.taskId) -ForegroundColor Green
          Write-Host ""
          continue
        }

        if ((Test-Path $completeTaskScript)) {
          & powershell -ExecutionPolicy Bypass -File "$completeTaskScript" `
            -TaskId $pendingCandidate.taskId `
            -WorkspaceRoot $root `
            -EvidenceNote "Autopilot completion for evidence-pending task." `
            -ProducedRef "logs/orchestrator/agent-loop-autopilot.log" 2>&1 | Out-String | Write-Host

          Write-Host "  [AEGIS] Evidence-pending task completed. Re-evaluating queue..." -ForegroundColor Green
          Write-Host ""
          continue
        }
      }

      if (-not $aegisAutopilotAutoResolveEvidencePending -and $null -ne $pendingCandidate) {
        Write-Host ("  [AEGIS] READY queue empty; waiting for evidence on task {0} ({1})." -f $pendingCandidate.taskId, $pendingCandidate.agent) -ForegroundColor DarkYellow
        Write-Host "  Autopilot auto-resolve is disabled by policy to prevent blind completions." -ForegroundColor DarkGray
      }

      $queueTotal = Get-QueueTotalCount
      $queueDone = Get-QueueDoneCount
      $isQueueComplete = ($queueTotal -eq 0) -or ($queueTotal -gt 0 -and $queueDone -ge $queueTotal)

      if (
        $isQueueComplete -and
        $aegisAutoRegenerate -and
        $aegisRegenerations -lt $aegisMaxRegenerationsPerRun -and
        (Test-Path $aegisScript)
      ) {
        Write-Host "  [AEGIS] Queue complete -- generating fresh research/planning tasks..." -ForegroundColor Cyan
        & "$aegisScript" -WorkspaceRoot $root -Reason "Autopilot queue completion"
        $aegisRegenerations++
        Write-Host "  [AEGIS] New cycle generated. Continuing autopilot..." -ForegroundColor Green
        Write-Host ""
        continue
      }

      $readyNow = Get-ReadyCount
      $runningNow = @()
      $waitingAckNow = @()
      $evidencePendingNow = @()
      if (Test-Path $qFile) {
        try {
          $qSnapshot = Get-Content $qFile -Raw | ConvertFrom-Json
          $allSnapshotTasks = @($qSnapshot.tasks)
          $runningNow = @($allSnapshotTasks | Where-Object { $_.status -eq "running" })
          $waitingAckNow = @($allSnapshotTasks | Where-Object { $_.status -eq "waiting_ack" })
          $evidencePendingNow = @($allSnapshotTasks | Where-Object { $_.status -eq "evidence_pending" })
        } catch {
          $runningNow = @()
          $waitingAckNow = @()
          $evidencePendingNow = @()
        }
      }

      $hasDeadlock = (
        $queueTotal -gt 0 -and
        $queueDone -lt $queueTotal -and
        $readyNow -eq 0 -and
        $runningNow.Count -eq 0 -and
        $waitingAckNow.Count -eq 0 -and
        $evidencePendingNow.Count -eq 0
      )
      if (
        $hasDeadlock -and
        $aegisDeadlockRecoveryEnabled -and
        $aegisAutoRegenerate -and
        $aegisRegenerations -lt $aegisMaxRegenerationsPerRun -and
        (Test-Path $aegisScript)
      ) {
        Write-Host "  [AEGIS] Deadlock detected (no READY tasks, queue not complete). Regenerating recovery cycle..." -ForegroundColor Yellow
        & "$aegisScript" -WorkspaceRoot $root -Reason "Autopilot deadlock recovery"
        $aegisRegenerations++
        Write-Host "  [AEGIS] Recovery cycle generated. Continuing autopilot..." -ForegroundColor Green
        Write-Host ""
        continue
      }

      if ($aegisAutopilotContinuous) {
        if (
          $aegisProblemScannerEnabled -and
          $aegisProblemScannerIdleEveryNLoops -ge 1 -and
          ($aegisNoReadyLoopCounter % $aegisProblemScannerIdleEveryNLoops -eq 0)
        ) {
          [void](Invoke-AegisProblemScanner -Reason "idle-no-ready")
        }
        Write-Host ("  [AEGIS] No READY tasks currently. Continuous autopilot sleeping {0}s and retrying..." -f $aegisIdleSleepSeconds) -ForegroundColor DarkGray
        Start-Sleep -Seconds $aegisIdleSleepSeconds
        Write-Host ""
        continue
      }

      Write-Host "  No READY tasks found across rotation. Autopilot exiting cleanly." -ForegroundColor DarkGray
      break
    }
    # Auto-mode: skip to next slot
    $skip = Get-NextSlotAgent
    Write-Host ("  Skipping to next slot agent: {0}" -f $skip) -ForegroundColor DarkGray
    $activeAgent = $skip
    $task = Get-AgentNextReadyTask -agentName $activeAgent
    if ($null -eq $task) {
      Write-Host "  Next slot also blocked. Run: npm run orchestrator:agent-loop -- -Agent @Name" -ForegroundColor DarkGray
      break
    }
  }

  $aegisNoReadyLoopCounter = 0

  $taskId  = $task.taskId
  $taskPhase = ""
  if ($null -ne $nextReady -and $nextReady.ContainsKey("Phase")) {
    $taskPhase = [string]$nextReady.Phase
  }
  if ([string]::IsNullOrWhiteSpace($taskPhase)) {
    $taskPhase = [string]$task.phase
  }
  if ([string]::IsNullOrWhiteSpace($taskPhase)) {
    $taskTeam = [string]$task.team
    $taskPhase = if ($taskTeam -match "implementation|premium") { "implementation" } else { "planning" }
  }
  $taskPhase = $taskPhase.ToLower()
  $taskPriority = [string]$task.priority
  if ([string]::IsNullOrWhiteSpace($taskPriority)) { $taskPriority = "normal" }
  $prompt  = Get-Prompt -taskId $taskId
  $url     = if ($toolUrl.ContainsKey($activeAgent))  { $toolUrl[$activeAgent]  } else { "https://aistudio.google.com/" }
  $toolStr = if ($toolName.ContainsKey($activeAgent)) { $toolName[$activeAgent] } else { "Free AI Tool" }
  $nextSlotMin = Get-MinutesUntilNextSlot
  $nextSlotAg  = Get-NextSlotAgent

  # 3. DISPLAY AGENT CARD
  Write-BigDivider -color Cyan
  Write-Host ("  SLOT {0}  |  {1}" -f $slotLabel, $activeAgent) -ForegroundColor Cyan
  Write-Host ("  Task    : {0}  -- {1}" -f $taskId, $task.title) -ForegroundColor White
  Write-Host ("  Phase   : {0}" -f $taskPhase.ToUpper()) -ForegroundColor DarkCyan
  Write-Host ("  Priority: {0}" -f $taskPriority.ToUpper()) -ForegroundColor DarkCyan
  Write-Host ("  Tool    : {0}" -f $toolStr) -ForegroundColor Green
  Write-Host ("  URL     : {0}" -f $url) -ForegroundColor DarkGray
  $queueTotal = Get-QueueTotalCount
  $queueDoneNow = Get-QueueDoneCount
  $donePct = if ($queueTotal -gt 0) { [math]::Round($queueDoneNow / $queueTotal * 100, 0) } else { 0 }
  $readyN  = Get-ReadyCount
  Write-Host ("  Queue   : {0}/{1} done ({2}%)  |  {3} READY now" -f $queueDoneNow, $queueTotal, $donePct, $readyN) -ForegroundColor DarkGray
  if ($Agent -eq "") {
    Write-Host ("  Next slot in ~{0} min -> {1}" -f $nextSlotMin, $nextSlotAg) -ForegroundColor DarkGray
  }
  Write-BigDivider -color Cyan
  Write-Host ""

  # 4. SHOW PROMPT
  Show-Prompt -text $prompt
  Write-Host ""

  # 5. OPEN BROWSER
  if (-not $NoBrowser) {
    try {
      Start-Process $url
      Write-Host ("  [OPENED] {0}" -f $url) -ForegroundColor Green
    } catch {
      Write-Host ("  [WARN] Could not open browser. Navigate manually to: {0}" -f $url) -ForegroundColor Yellow
    }
  } else {
    Write-Host ("  [NO-BROWSER] Navigate to: {0}" -f $url) -ForegroundColor DarkGray
  }
  Write-Host ""

  # 6. WAIT FOR PASTE CONFIRMATION
  Write-Host "  Steps:" -ForegroundColor White
  Write-Host "   1. Copy prompt above -> paste into $toolStr" -ForegroundColor DarkGray
  Write-Host "   2. Paste AI output into the target .md file" -ForegroundColor DarkGray
  Write-Host "   3. Press Enter below to mark task done" -ForegroundColor DarkGray
  Write-Host ""
  if (-not $effectiveNonInteractive) {
    Write-Host "  [Press Enter when paste is done, or type 'skip' to skip this task]" -ForegroundColor Yellow
    $confirm = Read-Host "  > "
    if ($confirm.Trim().ToLower() -eq "skip") {
      Write-Host "  [SKIP] Task $taskId skipped." -ForegroundColor DarkYellow
      Write-Host ""
      if ($Once) { break outerLoop }
      continue
    }
  } else {
    Write-Host "  [AUTO] Autopilot mode enabled -- auto-confirming task step." -ForegroundColor DarkGray
  }

  # 7. COLLECT EVIDENCE NOTE
  Write-Host ""
  Write-Host "  Evidence note (describe what was expanded, or press Enter to use default):" -ForegroundColor White
  if (-not $effectiveNonInteractive) {
    $evNote = Read-Host "  > "
  } else {
    $evNote = ""
  }
  if ([string]::IsNullOrWhiteSpace($evNote)) {
    $evNote = if ($effectiveNonInteractive) {
      "Auto-advanced via agent-loop non-interactive mode -- $taskId"
    } else {
      "Expanded via agent-loop paste session -- $taskId"
    }
  }

  # 8. MARK TASK DONE
  Write-Host ""
  $beforeDone  = Get-QueueDoneCount
  $beforeReady = Get-ReadyCount
  $caScript    = Join-Path $scripts "complete-and-advance.ps1"
  if (Test-Path $caScript) {
    if ($effectiveNonInteractive -and $aegisAutopilotRequireProducedRef) {
      $pendingProducedRef = "logs/orchestrator/evidence-pending/$taskId.md"
      Write-Host ("  [AEGIS] Autopilot evidence mode: marking {0} as evidence_pending (ProducedRef required)." -f $taskId) -ForegroundColor DarkYellow
      & powershell -ExecutionPolicy Bypass -File (Join-Path $scripts "complete-task.ps1") `
        -TaskId $taskId `
        -EvidenceNote $evNote `
        -ProducedRef $pendingProducedRef `
        -MarkEvidencePending `
        -AllowQueued `
        -WorkspaceRoot $root 2>&1 | Out-String | Write-Host
      Write-Host ("  [AEGIS] Task {0} now requires concrete evidence before completion." -f $taskId) -ForegroundColor DarkYellow
    }
    else {
      Write-Host ("  Marking {0} done for {1} ..." -f $taskId, $activeAgent) -ForegroundColor Cyan
      if ($effectiveNonInteractive) {
        & powershell -ExecutionPolicy Bypass -File "$caScript" `
          -TaskId $taskId `
          -AgentName $activeAgent `
          -EvidenceNote $evNote `
          -ProducedRef "logs/orchestrator/agent-loop-autopilot.log" `
          -WorkspaceRoot $root 2>&1 | Out-String | Write-Host
      }
      else {
        & powershell -ExecutionPolicy Bypass -File "$caScript" `
          -TaskId $taskId `
          -AgentName $activeAgent `
          -EvidenceNote $evNote `
          -WorkspaceRoot $root 2>&1 | Out-String | Write-Host
      }
    }

    if ($effectiveNonInteractive) {
      $postTask = Get-TaskById -taskId $taskId
      if (
        $null -ne $postTask -and
        $postTask.status -eq "waiting_ack" -and
        -not [string]::IsNullOrWhiteSpace([string]$postTask.feedsAckBy)
      ) {
        $ackBy = [string]$postTask.feedsAckBy
        $ackScript = Join-Path $scripts "ack-task.ps1"
        if (Test-Path $ackScript) {
          Write-Host ("  [AUTO-ACK] Autopilot acknowledging {0} by {1}" -f $taskId, $ackBy) -ForegroundColor Cyan
          & powershell -ExecutionPolicy Bypass -File "$ackScript" `
            -TaskId $taskId `
            -AckBy $ackBy 2>&1 | Out-String | Write-Host
        }
      }
    }
  } else {
    Write-Host "  [WARN] complete-and-advance.ps1 not found. Queue not updated." -ForegroundColor Yellow
  }

  if ($effectiveNonInteractive -and -not [string]::IsNullOrWhiteSpace($taskPhase)) {
    $aegisLastSelectedPhase = $taskPhase
    $phaseStatePayload = @{
      lastPhase = $aegisLastSelectedPhase
      updatedAt = (Get-Date).ToString("o")
      taskId = $taskId
      cycle = [string]$task.evidence.cycle
    }
    $phaseStatePayload | ConvertTo-Json -Depth 6 | Set-Content -Path $phaseStateFile -Encoding UTF8
  }

  # 9. SHOW UNLOCK DELTA
  $afterDone  = Get-QueueDoneCount
  $afterReady = Get-ReadyCount
  $newDone    = $afterDone  - $beforeDone
  $newReady   = $afterReady - $beforeReady
  Write-Host ""
  Write-Divider -color Green
  Write-Host "  RESULT" -ForegroundColor Green
  if ($newDone -gt 0) {
    $afterTotal = Get-QueueTotalCount
    Write-Host ("  [OK] +{0} task(s) done  (queue: {1}/{2})" -f $newDone, $afterDone, $afterTotal) -ForegroundColor Green
    if ($effectiveNonInteractive) {
      $aegisCompletedInRun += $newDone
        if (
          $aegisQueueHealthEveryNTasks -ge 1 -and
          ($aegisCompletedInRun % $aegisQueueHealthEveryNTasks -eq 0) -and
          (Test-Path $queueHealthScript)
        ) {
          Write-Host ""
          Write-Host ("  [AEGIS CHECK] Running periodic queue health gate (every {0} completed tasks)..." -f $aegisQueueHealthEveryNTasks) -ForegroundColor Cyan
          & powershell -ExecutionPolicy Bypass -File "$queueHealthScript" -Brief 2>&1 | Out-String | Write-Host
        }

        if (
          $aegisProblemScannerEnabled -and
          $aegisProblemScannerEveryNTasks -ge 1 -and
          ($aegisCompletedInRun % $aegisProblemScannerEveryNTasks -eq 0)
        ) {
          [void](Invoke-AegisProblemScanner -Reason "after-completion")
        }

      if (
        $aegisDevSmokeEnabled -and
        $aegisDevSmokeEveryNTasks -ge 1 -and
        ($aegisCompletedInRun % $aegisDevSmokeEveryNTasks -eq 0)
      ) {
        if (Test-Path $devSmokeScript) {
          $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
          if ($null -eq $nodeCmd) {
            Write-Host ""
            Write-Host "  [AEGIS CHECK] Skipping dev smoke: node runtime not found in this terminal session." -ForegroundColor DarkYellow
          } else {
            Write-Host "" 
            Write-Host ("  [AEGIS CHECK] Running periodic dev smoke (every {0} completed tasks)..." -f $aegisDevSmokeEveryNTasks) -ForegroundColor Cyan
            & powershell -ExecutionPolicy Bypass -File "$devSmokeScript" -WorkspaceRoot $root 2>&1 | Out-String | Write-Host
          }
        }
      }
    }
  } else {
    Write-Host "  [!!] Task may need FEEDS_ACK or file did not reach gate target." -ForegroundColor Yellow
    Write-Host "  Run: npm run orchestrator:health  to check queue state" -ForegroundColor DarkGray
  }
  if ($newReady -gt 0) {
    Write-Host ("  UNLOCKED: +{0} newly READY task(s) -- run cascade to see details" -f $newReady) -ForegroundColor Cyan
    Write-Host "  npm run orchestrator:cascade:all  -- see full downstream impact" -ForegroundColor DarkGray
  } elseif ($newDone -gt 0) {
    Write-Host "  (Cascade score 0 -- downstream tasks have additional deps)" -ForegroundColor DarkGray
  }
  Write-Divider -color Green
  Write-Host ""

  # 10. LOOP CONTROL
  if ($Once) { break outerLoop }

  if ($Agent -ne "") {
    # Agent forced -- loop to next ready task for same agent
    $nextT = Get-AgentNextReadyTask -agentName $activeAgent
    if ($null -eq $nextT) {
      Write-Host ("  [ALL DONE] No more READY tasks for {0}." -f $activeAgent) -ForegroundColor Green
      break outerLoop
    }
    Write-Host "  [CONTINUE] Next READY task ready. Starting next round..." -ForegroundColor Cyan
    Write-Host ""
  } else {
    # Auto-mode: show next slot info
    $nextSlotMin = Get-MinutesUntilNextSlot
    $nextSlotAg  = Get-NextSlotAgent
    Write-Host ("  Next slot: {0} ({1}) in ~{2} min" -f $nextSlotAg, ($toolName[$nextSlotAg]), $nextSlotMin) -ForegroundColor DarkGray
    if (-not $effectiveNonInteractive) {
      Write-Host "  [Press Enter to continue to the next agent, or Ctrl+C to exit]" -ForegroundColor DarkGray
      $null = Read-Host "  > "
    } else {
      Write-Host "  [AUTO] Advancing to next slot without prompt." -ForegroundColor DarkGray
    }
    Write-Host ""
  }
}

Write-Host ""
Write-BigDivider
Write-Host ("  LOOP COMPLETE -- {0} round(s) run" -f $loopCount) -ForegroundColor Magenta
Write-Host "  Run: npm run orchestrator:session:compact  -- to see full queue state" -ForegroundColor DarkGray
Write-BigDivider
Write-Host ""
