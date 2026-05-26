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
#   npm run orchestrator:agent-loop -- -Autopilot        -- continuous mode (no asks)
#   npm run orchestrator:agent-loop -- -Approval         -- ask before each advance
#   npm run orchestrator:agent-loop -- -Agent @Sofia -Once -NoBrowser

param(
  [string]$Agent         = "",
  [string]$WorkspaceRoot = ".",
  [switch]$Once,
  [switch]$NoBrowser,
  [switch]$ForceBrowserOpen,
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
$policyUtils = Join-Path $scripts "policy-utils.ps1"
$scanLogDir = Join-Path $root "logs\orchestrator"
$loopSyncScript = Join-Path $scripts "loop-start-sync.ps1"
$cycleSummaryScript = Join-Path $scripts "cycle-summary.ps1"
$autoEscalateScript = Join-Path $scripts "blocker-auto-escalate.ps1"
$blockerBriefScript = Join-Path $scripts "blocker-report.ps1"
$browserLaunchScript = Join-Path $scripts "browser-launch.ps1"

if (Test-Path $policyUtils) {
  . $policyUtils
}
if (Test-Path $browserLaunchScript) {
  . $browserLaunchScript
}

$trackingRemote = "origin"
$trackingBranch = "main"
if (Get-Command Get-OrchestratorPolicy -ErrorAction SilentlyContinue) {
  try {
    $policyForGit = Get-OrchestratorPolicy -WorkspaceRoot $root
    $gitPolicy = Get-OrchestratorGitPolicy -Policy $policyForGit
    $trackingRemote = [string]$gitPolicy.defaultRemote
    $trackingBranch = [string]$gitPolicy.integrationBranch
  } catch {}
}

# ------------------------------------------------------------------
# EXECUTION MODE (policy + switches)
# Default: approval mode (ask between tasks)
# ------------------------------------------------------------------
$policyDefaultMode = "approval"
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
  } catch {
    $policyDefaultMode = "approval"
  }
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

if ($effectiveNonInteractive -and -not $ForceBrowserOpen) {
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
    foreach ($dep in @($t.dependsOn)) {
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
    foreach ($dep in @($t.dependsOn)) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") { $blocked = $true; break }
    }
    if (-not $blocked) { $ready++ }
  }
  return $ready
}

function Get-BlockedCount {
  if (-not (Test-Path $qFile)) { return 0 }
  $q = Get-Content $qFile -Raw | ConvertFrom-Json
  $all = @($q.tasks)
  $blocked = 0
  foreach ($t in ($all | Where-Object { $_.status -eq "queued" })) {
    $isBlocked = $false
    foreach ($dep in @($t.dependsOn)) {
      $depTask = $all | Where-Object { $_.taskId -eq $dep } | Select-Object -First 1
      if ($null -eq $depTask -or $depTask.status -ne "done") { $isBlocked = $true; break }
    }
    if ($isBlocked) { $blocked++ }
  }
  return $blocked
}

function Get-PromptRecord {
  param([string]$taskId)
  if (-not (Test-Path $pFile)) { return $null }
  $p = Get-Content $pFile -Raw | ConvertFrom-Json
  $val = $p.PSObject.Properties | Where-Object { $_.Name -eq $taskId } | Select-Object -ExpandProperty Value
  if ($null -eq $val) { return $null }
  return $val
}

function Get-Prompt {
  param([string]$taskId)
  $val = Get-PromptRecord -taskId $taskId
  if ($null -eq $val) { return "(no prompt for $taskId -- add to prompts.json)" }
  if ($val -is [string]) { return $val }
  if ($val.PSObject.Properties.Name -contains "prompt") { return [string]$val.prompt }
  return [string]$val
}

function Get-PromptVersion {
  param([string]$taskId)
  $val = Get-PromptRecord -taskId $taskId
  if ($null -eq $val) { return 1 }
  if ($val -is [string]) { return 1 }
  if ($val.PSObject.Properties.Name -contains "v") { return [int]$val.v }
  return 1
}

function Get-LastScanStatus {
  if (-not (Test-Path $scanLogDir)) { return "UNKNOWN" }
  $latest = Get-ChildItem -Path $scanLogDir -Filter "error-scan-*.json" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($null -eq $latest) { return "UNKNOWN" }
  try {
    $scan = Get-Content $latest.FullName -Raw | ConvertFrom-Json
    if ($scan.passed) { return "PASS" }
    return "FAIL"
  } catch {
    return "UNKNOWN"
  }
}

function Get-MainDelta {
  $branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($branch)) { return "unknown" }
  $behind = (git rev-list --count "HEAD..$trackingRemote/$trackingBranch" 2>$null).Trim()
  if ([string]::IsNullOrWhiteSpace($behind)) { $behind = "0" }
  return ("{0} (+{1} behind {2})" -f $branch, $behind, $trackingBranch)
}

function Test-MiniTypecheck {
  param([string[]]$changedFiles)
  $codeFiles = @($changedFiles | Where-Object { $_ -match '\.(ts|tsx)$' })
  if ($codeFiles.Count -eq 0) { return $true }

  Write-Host ""
  Write-Host "  [MINI-SCAN] Running typecheck for changed TS files..." -ForegroundColor Cyan
  $out = npm run typecheck 2>&1 | Out-String
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  [MINI-SCAN] PASS" -ForegroundColor Green
    return $true
  }

  $hit = $false
  foreach ($f in $codeFiles) {
    $norm = $f.Replace("/", "\")
    if ($out -match [regex]::Escape($norm) -or $out -match [regex]::Escape($f)) {
      $hit = $true
      break
    }
  }

  if ($hit) {
    Write-Host "  [MINI-SCAN] Type errors found in changed files. Fix before marking done." -ForegroundColor Red
    Write-Host $out -ForegroundColor DarkGray
    Write-Host "  Suggested fix: npm run typecheck" -ForegroundColor Yellow
    return $false
  }

  Write-Host "  [MINI-SCAN] Typecheck failed, but not directly tied to changed files." -ForegroundColor Yellow
  return $true
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
$discoveryAttempts = 0

:outerLoop while ($true) {
  $loopCount++

  if ($Autopilot -and (Test-Path $loopSyncScript)) {
    Write-Host ""
    Write-Host ("  [AUTOPILOT] Syncing from main before cycle {0}..." -f $loopCount) -ForegroundColor Cyan
    & powershell -ExecutionPolicy Bypass -File "$loopSyncScript" -WorkspaceRoot $root
    if ($LASTEXITCODE -ne 0) {
      Write-Host "  [BLOCKED] loop-start-sync failed in autopilot mode." -ForegroundColor Red
      break outerLoop
    }
  }

  $doneNow = Get-QueueDoneCount
  $readyNow = Get-ReadyCount
  $blockedNow = Get-BlockedCount
  $branchDelta = Get-MainDelta
  $lastScan = Get-LastScanStatus
  Write-Host ("[CYCLE {0}] Queue: {1}/51 done | {2} READY | {3} BLOCKED | Branch: {4} | Last scan: {5}" -f $loopCount, $doneNow, $readyNow, $blockedNow, $branchDelta, $lastScan) -ForegroundColor DarkGray

  # 1. DETERMINE ACTIVE AGENT
  if ($Agent -ne "") {
    $activeAgent = $Agent
    $slotLabel   = "manual"
    $task = Get-AgentNextReadyTask -agentName $activeAgent
  } elseif ($effectiveNonInteractive) {
    $preferred = Get-CurrentSlotAgent
    $nextReady = Get-NextReadyInRotation -preferredAgent $preferred
    if ($null -ne $nextReady) {
      $activeAgent = [string]$nextReady.Agent
      $task        = $nextReady.Task
      $slotLabel   = "auto"
    } else {
      $activeAgent = $preferred
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
    Write-Host ("  [{0}] {1} -- no READY task found (all done or blocked)" -f $slotLabel, $activeAgent) -ForegroundColor DarkYellow
    Write-Host ""
    if ($Agent -ne "") {
      Write-Host "  All tasks done or blocked for $activeAgent." -ForegroundColor DarkGray
      Write-Host "  Tip: npm run orchestrator:blockers -- to see what is blocking" -ForegroundColor DarkGray
      break
    }
    if ($effectiveNonInteractive) {
      $discoverScript = Join-Path $scripts "discover-upgrade.js"
      if ($discoveryAttempts -lt 3 -and (Test-Path $discoverScript)) {
        $discoveryAttempts++
        Write-Host ("  [DISCOVERY] Attempt {0}/3 -- scanning repo and seeding a self-directed upgrade..." -f $discoveryAttempts) -ForegroundColor Cyan
        & node "$discoverScript" 2>&1 | Out-String | Write-Host
        if ($LASTEXITCODE -eq 0 -and (Get-ReadyCount) -gt 0) {
          Write-Host "  [DISCOVERY] New READY task discovered. Continuing loop." -ForegroundColor Green
          continue outerLoop
        }
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

  $taskId  = $task.taskId
  $discoveryAttempts = 0
  $prompt  = Get-Prompt -taskId $taskId
  $promptVersion = Get-PromptVersion -taskId $taskId
  $beforeCycleFiles = @(git diff --name-only HEAD 2>$null)
  $url     = if ($toolUrl.ContainsKey($activeAgent))  { $toolUrl[$activeAgent]  } else { "https://aistudio.google.com/" }
  $toolStr = if ($toolName.ContainsKey($activeAgent)) { $toolName[$activeAgent] } else { "Free AI Tool" }
  $nextSlotMin = Get-MinutesUntilNextSlot
  $nextSlotAg  = Get-NextSlotAgent

  # 3. DISPLAY AGENT CARD
  Write-BigDivider -color Cyan
  Write-Host ("  SLOT {0}  |  {1}" -f $slotLabel, $activeAgent) -ForegroundColor Cyan
  Write-Host ("  Task    : {0}  -- {1}" -f $taskId, $task.title) -ForegroundColor White
  Write-Host ("  Tool    : {0}" -f $toolStr) -ForegroundColor Green
  Write-Host ("  URL     : {0}" -f $url) -ForegroundColor DarkGray
  $donePct = [math]::Round((Get-QueueDoneCount) / 51 * 100, 0)
  $readyN  = Get-ReadyCount
  Write-Host ("  Queue   : {0}/51 done ({1}%)  |  {2} READY now" -f (Get-QueueDoneCount), $donePct, $readyN) -ForegroundColor DarkGray
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
      if (Get-Command Invoke-AegisBrowserLaunch -ErrorAction SilentlyContinue) {
        $launchResult = Invoke-AegisBrowserLaunch -Url $url -WorkspaceRoot $root -Force:$ForceBrowserOpen
        if ($launchResult.launched) {
          Write-Host ("  [OPENED] {0}" -f $url) -ForegroundColor Green
        } else {
          Write-Host ("  [SKIP] Browser launch skipped for {0} (already opened recently)." -f $url) -ForegroundColor Yellow
        }
      } else {
        Start-Process $url
        Write-Host ("  [OPENED] {0}" -f $url) -ForegroundColor Green
      }
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

  # 7.5 MINI TYPECHECK on files changed during this cycle
  $afterCycleFiles = @(git diff --name-only HEAD 2>$null)
  $changedThisCycle = @($afterCycleFiles | Where-Object { $beforeCycleFiles -notcontains $_ })
  $miniScanOk = Test-MiniTypecheck -changedFiles $changedThisCycle
  if (-not $miniScanOk) {
    if ($effectiveNonInteractive) {
      Write-Host "  [AUTO] Blocking cycle due to mini typecheck failure." -ForegroundColor Red
      break outerLoop
    }
    Write-Host "  Resolve type errors in changed files, then press Enter to continue or type 'skip'." -ForegroundColor Yellow
    $miniConfirm = Read-Host "  > "
    if ($miniConfirm.Trim().ToLower() -eq "skip") {
      Write-Host "  [SKIP] Task not marked done due to mini typecheck failure." -ForegroundColor Yellow
      continue
    }
  }

  # 8. MARK TASK DONE
  Write-Host ""
  Write-Host ("  Marking {0} done for {1} ..." -f $taskId, $activeAgent) -ForegroundColor Cyan
  $beforeDone  = Get-QueueDoneCount
  $beforeReady = Get-ReadyCount
  $caScript    = Join-Path $scripts "complete-and-advance.ps1"
  if (Test-Path $caScript) {
    & powershell -ExecutionPolicy Bypass -File "$caScript" `
      -TaskId $taskId `
      -AgentName $activeAgent `
      -EvidenceNote $evNote `
      -WorkspaceRoot $root 2>&1 | Out-String | Write-Host

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

  # 9. SHOW UNLOCK DELTA
  $afterDone  = Get-QueueDoneCount
  $afterReady = Get-ReadyCount
  $newDone    = $afterDone  - $beforeDone
  $newReady   = $afterReady - $beforeReady
  Write-Host ""
  Write-Divider -color Green
  Write-Host "  RESULT" -ForegroundColor Green
  if ($newDone -gt 0) {
    Write-Host ("  [OK] +{0} task(s) done  (queue: {1}/51)" -f $newDone, $afterDone) -ForegroundColor Green
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

  # 9.5 Cycle logging + blocker auto-escalation
  if (Test-Path $cycleSummaryScript) {
    & powershell -ExecutionPolicy Bypass -File "$cycleSummaryScript" `
      -WorkspaceRoot $root `
      -Record `
      -Cycle $loopCount `
      -Agent $activeAgent `
      -TaskId $taskId `
      -ErrorScanPassed ($miniScanOk) `
      -SyncedFromMain ($Autopilot) `
      -PushedToMain $false `
      -PromptVersion $promptVersion 2>&1 | Out-String | Write-Host
  }
  if ($effectiveNonInteractive -and (Test-Path $autoEscalateScript)) {
    & powershell -ExecutionPolicy Bypass -File "$autoEscalateScript" -WorkspaceRoot $root 2>&1 | Out-String | Write-Host
  }
  if ($effectiveNonInteractive -and (Test-Path $blockerBriefScript)) {
    & powershell -ExecutionPolicy Bypass -File "$blockerBriefScript" -WorkspaceRoot $root -Brief 2>&1 | Out-String | Write-Host
  }

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
