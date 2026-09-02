# blocker-report.ps1 -- Blocker analysis for free agents
# For every BLOCKED task: shows exactly what's stopping it, how many more
# doc sections are needed, and the precise prompt to paste next.
#
# Usage:
#   npm run orchestrator:blockers           -- full report all lanes
#   npm run orchestrator:blockers -- -Lane A        -- single lane
#   npm run orchestrator:blockers -- -Agent @Timnit -- single agent
#   npm run orchestrator:blockers -- -Next          -- show only nearest unblock (1 section away)
#   npm run orchestrator:blockers -- -Top 5         -- show top N tasks closest to unblocking

param(
  [string]$WorkspaceRoot = ".",
  [string]$Lane          = "",    # filter by lane A/B/C/D
  [string]$Agent         = "",    # filter by agent name
  [switch]$Next,                  # show only tasks 1 section away from unblocking
  [int]$Top              = 0,     # show top N by proximity to unblocking (0=all)
  [switch]$Brief                  # compact one-line-per-task output
)

$ErrorActionPreference = "Continue"
$root        = Resolve-Path $WorkspaceRoot
$queueFile   = Join-Path $root "logs\orchestrator\task-queue.json"
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"
$promptsFallbackFile = Join-Path $root "aegis\scripts\orchestrator\prompts.json"
$w           = 72

if (-not (Test-Path $promptsFile) -and (Test-Path $promptsFallbackFile)) {
  $promptsFile = $promptsFallbackFile
}

if (-not (Test-Path $queueFile))   { Write-Host "[ERROR] queue not found"   -ForegroundColor Red; exit 1 }
if (-not (Test-Path $promptsFile)) { Write-Host "[ERROR] prompts not found" -ForegroundColor Red; exit 1 }

function Read-JsonFileSafe {
  param(
    [string]$Path,
    [long]$MaxBytes = 32MB,
    [switch]$TryTmpRecovery
  )

  if (-not (Test-Path $Path)) { return $null }

  $info = Get-Item -Path $Path -ErrorAction SilentlyContinue
  if ($null -eq $info) { return $null }

  function Try-Parse {
    param([string]$Candidate)
    try {
      $raw = Get-Content -Path $Candidate -Raw -ErrorAction Stop
      if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
      return ($raw | ConvertFrom-Json -ErrorAction Stop)
    }
    catch {
      return $null
    }
  }

  if ($info.Length -gt $MaxBytes) {
    if (-not $TryTmpRecovery) { return $null }

    $dir = Split-Path -Parent $Path
    $name = [System.IO.Path]::GetFileName($Path)
    $candidates = @(Get-ChildItem -Path $dir -Filter ("{0}.tmp.*" -f $name) -File -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTime -Descending)

    foreach ($candidate in $candidates) {
      if ($candidate.Length -gt $MaxBytes) { continue }
      $parsedCandidate = Try-Parse -Candidate $candidate.FullName
      if ($null -eq $parsedCandidate) { continue }
      try { Copy-Item -Path $candidate.FullName -Destination $Path -Force } catch {}
      return $parsedCandidate
    }

    return $null
  }

  return (Try-Parse -Candidate $Path)
}

$q = Read-JsonFileSafe -Path $queueFile -MaxBytes 32MB -TryTmpRecovery
if ($null -eq $q) {
  Write-Host "[ERROR] queue unreadable (possibly oversized/corrupt)" -ForegroundColor Red
  exit 1
}

$prompts = Read-JsonFileSafe -Path $promptsFile -MaxBytes 16MB
if ($null -eq $prompts) {
  Write-Host "[ERROR] prompts unreadable" -ForegroundColor Red
  exit 1
}

$tasks   = @($q.tasks)

# -- gate targets (sections needed to PASS each file) ------------------------
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"     = 12
  "business_docs/05_requirements/risk-register.md"               = 5
  "business_docs/05_requirements/non-functional-requirements.md" = 8
  "business_docs/07_business_model/revenue-model.md"             = 13
  "business_docs/03_ai_assistants/README.md"                     = 40
  "business_docs/06_design_architecture/system-architecture.md"  = 12
  "business_docs/06_design_architecture/ui-ux-specification.md"  = 20
  "business_docs/09_crm_features/tenancy-ejari.md"               = 14
  "business_docs/09_crm_features/landlord-portal.md"             = 13
  "business_docs/09_crm_features/financial-reporting.md"         = 11
  "business_docs/09_crm_features/analytics-dashboard.md"         = 22
  "business_docs/09_crm_features/agent-performance.md"           = 14
  "business_docs/09_crm_features/lead-tracking.md"               = 12
  "business_docs/09_crm_features/tenant-portal.md"               = 14
  "business_docs/09_crm_features/dld-integration.md"             = 12
  "business_docs/09_crm_features/legal-management.md"            = 12
  "business_docs/09_crm_features/audit-trail.md"                 = 10
  "business_docs/09_crm_features/activity-feed.md"               = 8
  "business_docs/09_crm_features/follow-up-automation.md"        = 10
  "business_docs/09_crm_features/off-plan-projects.md"           = 14
  "business_docs/09_crm_features/handover-management.md"         = 10
  "business_docs/09_crm_features/scheduling-calendar.md"         = 12
  "business_docs/09_crm_features/viewings.md"                    = 10
  "business_docs/09_crm_features/offers.md"                      = 12
  "business_docs/09_crm_features/whatsapp-integration.md"        = 14
  "business_docs/09_crm_features/property-valuation.md"          = 10
  "business_docs/09_crm_features/market-intelligence.md"         = 10
  "business_docs/09_crm_features/market-analytics.md"            = 10
  "business_docs/09_crm_features/currency-management.md"         = 8
  "business_docs/09_crm_features/secondary-sales.md"             = 10
  "business_docs/09_crm_features/sentinel-property.md"           = 12
  "business_docs/09_crm_features/investment-management.md"       = 10
  "business_docs/09_crm_features/prospecting-outbound.md"        = 10
  "business_docs/09_crm_features/ai-chat.md"                     = 12
  "business_docs/09_crm_features/maintenance.md"                 = 10
  "business_docs/09_crm_features/document-generation.md"         = 10
  "business_docs/09_crm_features/email-automation.md"            = 8
  "business_docs/09_crm_features/seo-strategy.md"                = 16
  "business_docs/09_crm_features/marketing-campaigns.md"         = 12
  "business_docs/09_crm_features/luxury-segment.md"              = 10
  "business_docs/09_crm_features/community-management.md"        = 8
  "business_docs/09_crm_features/careers.md"                     = 8
}

# free tool URLs per agent
$tools = @{
  "@Sofia"    = "https://aistudio.google.com/"
  "@Victoria" = "https://aistudio.google.com/"
  "@Annie"    = "https://aistudio.google.com/"
  "@Marissa"  = "https://aistudio.google.com/"
  "@Rachel"   = "https://aistudio.google.com/"
  "@Timnit"   = "https://aistudio.google.com/"
  "@Invoice"  = "https://console.groq.com/"
  "@Joelle"   = "https://console.groq.com/"
  "@Hedy"     = "https://console.groq.com/"
  "@Maya"     = "https://console.groq.com/"
  "@Booking"  = "https://console.groq.com/"
  "@Jaime"    = "https://console.groq.com/"
  "@Fei-Fei"  = "https://chat.deepseek.com/"
  "@Anima"    = "https://chat.deepseek.com/"
  "@Mary"     = "https://chat.deepseek.com/"
  "@Cassie"   = "https://chat.deepseek.com/"
  "@Corinne"  = "https://chat.deepseek.com/"
}

# -- helpers ------------------------------------------------------------------
function Get-Prompt([string]$id) {
  $keys = @($prompts | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name)
  if ($keys -contains $id) {
    $val = $prompts.$id
    if ($val -is [string]) { return $val }
    if ($null -ne $val -and $val.PSObject.Properties.Name -contains "prompt") { return [string]$val.prompt }
    return [string]$val
  }
  $t = @($tasks | Where-Object { $_.taskId -eq $id })[0]
  if ($null -ne $t) { return $t.title } else { return "(no prompt for $id)" }
}

function Get-TargetFile([string]$prompt) {
  # Try full relative path first
  if ($prompt -match "(business_docs/[\w/_.-]+\.md)") { return $Matches[1] }
  # Fall back to bare filename -> look up in gateTargets
  if ($prompt -match "\b([\w-]+\.md)\b") {
    $name = $Matches[1]
    foreach ($k in $gateTargets.Keys) {
      if ($k -like "*/$name") { return $k }
    }
    return "business_docs/09_crm_features/$name"
  }
  return ""
}

function Get-FileSections([string]$rel) {
  $abs = Join-Path $root $rel.Replace("/", "\")
  if (-not (Test-Path $abs)) { return 0 }
  return @(Get-Content $abs | Where-Object { $_ -match "^##\s|^###\s" }).Count
}

function Test-AllDepsDone([array]$deps) {
  if ($null -eq $deps -or $deps.Count -eq 0) { return $true }
  foreach ($d in $deps) {
    $dep = @($tasks | Where-Object { $_.taskId -eq $d })[0]
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
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

# For a blocked task, find the nearest upstream task that is NOT done
function Get-DirectBlocker([string]$taskId) {
  $t = @($tasks | Where-Object { $_.taskId -eq $taskId })[0]
  if ($null -eq $t) { return $null }
  $deps = @($t.dependsOn)
  foreach ($d in $deps) {
    $dep = @($tasks | Where-Object { $_.taskId -eq $d })[0]
    if ($null -ne $dep -and $dep.status -ne "done") { return $dep }
  }
  return $null
}

# Walk up the chain to find root READY blocker (the task user should run NOW)
function Get-RootBlocker([string]$taskId) {
  $visited = @()
  $cur = $taskId
  while ($true) {
    if ($visited -contains $cur) { return $cur }  # cycle guard
    $visited += $cur
    $blocker = Get-DirectBlocker $cur
    if ($null -eq $blocker) { return $cur }
    if ($blocker.status -eq "done") { return $cur }
    if (Test-AllDepsDone (Get-NormalizedDeps $blocker.dependsOn)) {
      return $blocker.taskId  # this one is ready to execute
    }
    $cur = $blocker.taskId
  }
}

# Progress bar (20 chars wide)
function Get-Bar([int]$cur, [int]$max) {
  if ($max -le 0) { return "[??????????????????]" }
  $filled = [math]::Min(20, [math]::Round($cur / $max * 20))
  $empty  = 20 - $filled
  return "[" + ("#" * $filled) + ("." * $empty) + "]"
}

# Estimate paste sessions needed (1 session = 3 sections added)
$SECS_PER_SESSION = 3
function Get-EtaSessions([int]$gap) {
  if ($gap -le 0) { return 0 }
  return [math]::Ceiling($gap / $SECS_PER_SESSION)
}

# ============================================================================
# BUILD BLOCKER DATA
# ============================================================================

# All queued tasks (both READY and BLOCKED)
$allQueued = @($tasks | Where-Object { $_.status -eq "queued" })

# Apply filters
if ($Lane  -ne "") { $allQueued = @($allQueued | Where-Object { $_.lane  -eq $Lane }) }
if ($Agent -ne "") { $allQueued = @($allQueued | Where-Object { $_.agent -eq $Agent }) }

# Separate READY vs BLOCKED
$readyTasks   = @($allQueued | Where-Object { Test-AllDepsDone (Get-NormalizedDeps $_.dependsOn) })
$blockedTasks = @($allQueued | Where-Object { -not (Test-AllDepsDone (Get-NormalizedDeps $_.dependsOn)) })

# For each blocked task, compute depth metrics
$blockerData = [System.Collections.Generic.List[hashtable]]::new()

foreach ($t in $blockedTasks) {
  $prompt   = Get-Prompt $t.taskId
  $tf       = Get-TargetFile $prompt
  $curSecs  = if ($tf -ne "") { Get-FileSections $tf } else { 0 }
  $needed   = if ($gateTargets.ContainsKey($tf)) { $gateTargets[$tf] } else { 0 }
  $gap      = [math]::Max(0, $needed - $curSecs)
  $eta      = Get-EtaSessions $gap
  $rootId   = Get-RootBlocker $t.taskId
  $rootTask = @($tasks | Where-Object { $_.taskId -eq $rootId })[0]
  $rootReady = ($null -ne $rootTask) -and (Test-AllDepsDone @($rootTask.dependsOn))

  $blockerData.Add(@{
    Task      = $t
    Prompt    = $prompt
    TargetFile= $tf
    CurSecs   = $curSecs
    Needed    = $needed
    Gap       = $gap
    EtaSess   = $eta
    RootId    = $rootId
    RootReady = $rootReady
  })
}

# Sort: tasks with smallest gap first (nearest to unblocking)
$sorted = @($blockerData | Sort-Object { $_.EtaSess }, { $_.Gap }, { $_.Task.taskId })

if ($Next)    { $sorted = @($sorted | Where-Object { $_.Gap -le $SECS_PER_SESSION }) }
if ($Top -gt 0) { $sorted = $sorted | Select-Object -First $Top }

# ============================================================================
# BANNER
# ============================================================================
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  WHITE CAVES -- BLOCKER REPORT" -ForegroundColor Magenta
$filterStr = @()
if ($Lane  -ne "") { $filterStr += "Lane $Lane" }
if ($Agent -ne "") { $filterStr += $Agent }
if ($Next)         { $filterStr += "1-session-away only" }
if ($Top   -gt 0)  { $filterStr += "Top $Top" }
$fStr = if ($filterStr.Count -gt 0) { "  Filter: " + ($filterStr -join " | ") } else { "  All lanes / all agents" }
Write-Host $fStr -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""

$doneCnt  = @($tasks | Where-Object { $_.status -eq "done" }).Count
$totalCnt = $tasks.Count
Write-Host ("  Queue: {0} done / {1} total  |  READY: {2}  |  BLOCKED: {3}" -f $doneCnt, $totalCnt, $readyTasks.Count, $blockedTasks.Count) -ForegroundColor White
Write-Host ""

if ($sorted.Count -eq 0) {
  if ($Next) {
    Write-Host "  No tasks are within 1 session of unblocking right now." -ForegroundColor DarkGray
    Write-Host "  Run without -Next to see the full blocker list." -ForegroundColor DarkGray
  } else {
    Write-Host "  No blocked tasks match the current filter." -ForegroundColor DarkGray
  }
  Write-Host ("=" * $w) -ForegroundColor Magenta
  exit 0
}

# ============================================================================
# OUTPUT BLOCKED TASKS
# ============================================================================

$laneColors = @{ "A" = "Cyan"; "B" = "Yellow"; "C" = "Green"; "D" = "Magenta" }
$prevLane   = ""

foreach ($bd in $sorted) {
  $t        = $bd.Task
  $lane     = $t.lane
  $laneCol  = if ($laneColors.ContainsKey($lane)) { $laneColors[$lane] } else { "White" }
  $tool     = if ($tools.ContainsKey($t.agent)) { $tools[$t.agent] } else { "https://aistudio.google.com/" }

  # Lane separator
  if ($lane -ne $prevLane -and -not $Brief) {
    Write-Host ("  -- Lane {0} -------------------------------------------------------" -f $lane) -ForegroundColor $laneCol
    $prevLane = $lane
  }

  # Progress metrics
  $bar      = Get-Bar $bd.CurSecs $bd.Needed
  $gapStr   = if ($bd.Gap -le 0)   { "PASS (ready to auto-complete)" } `
              elseif ($bd.Gap -eq 1) { "1 section needed" } `
              else                   { "$($bd.Gap) sections needed" }
  $etaStr   = if ($bd.EtaSess -le 0) { "0 sessions (PASS)" } `
              elseif ($bd.EtaSess -eq 1) { "~1 paste session" } `
              else { "~$($bd.EtaSess) paste sessions" }

  # Root blocker info
  $rootStr  = if ($bd.RootId -ne $t.taskId) {
    if ($bd.RootReady) { "Root blocker READY: $($bd.RootId) (run this first!)" }
    else               { "Root blocker: $($bd.RootId) (also blocked)" }
  } else {
    if ($bd.RootReady) { "Direct blocker READY -- execute this task now" }
    else               { "Direct blocker: waiting on upstream" }
  }

  if ($Brief) {
    $statusCol = if ($bd.Gap -le 0) { "Green" } elseif ($bd.EtaSess -le 1) { "Yellow" } else { "DarkGray" }
    Write-Host ("  {0,-6} {1,-10} {2,-45} gap={3,-3} {4}" -f $t.taskId, $t.agent, $bd.TargetFile.Split("/")[-1], $bd.Gap, $etaStr) -ForegroundColor $statusCol
    continue
  }

  # Full card
  $cardCol = if ($bd.Gap -le 0) { "Green" } elseif ($bd.EtaSess -le 1) { "Yellow" } else { "White" }
  Write-Host ("-" * $w) -ForegroundColor DarkGray
  Write-Host ("  {0}  ({1})  Lane {2}" -f $t.taskId, $t.agent, $lane) -ForegroundColor $cardCol
  if ($bd.TargetFile -ne "") {
    Write-Host ("  Target  : {0}" -f $bd.TargetFile) -ForegroundColor White
    Write-Host ("  Progress: {0}  {1}/{2} sections  |  {3}" -f $bar, $bd.CurSecs, $bd.Needed, $gapStr) -ForegroundColor $(if ($bd.Gap -le 0) { "Green" } elseif ($bd.EtaSess -le 1) { "Yellow" } else { "DarkGray" })
    Write-Host ("  ETA     : {0}" -f $etaStr) -ForegroundColor DarkGray
  } else {
    Write-Host "  Target  : (could not detect target file from prompt)" -ForegroundColor DarkGray
  }
  Write-Host ("  Blocker : {0}" -f $rootStr) -ForegroundColor $(if ($bd.RootReady) { "Cyan" } else { "DarkGray" })

  # Show deps chain compactly
  $depsChain = @($t.dependsOn) | ForEach-Object {
    $d = @($tasks | Where-Object { $_.taskId -eq $_ })[0]
    $st = if ($null -ne $d) { $d.status } else { "?" }
    "{0}[{1}]" -f $_, $st
  }
  Write-Host ("  Deps    : {0}" -f ($depsChain -join " -> ")) -ForegroundColor DarkGray

  # If root blocker is READY: show the prompt to paste
  if ($bd.RootReady -and $bd.RootId -ne $t.taskId) {
    $rootPrompt = Get-Prompt $bd.RootId
    $rootTool   = $tool  # same agent chain typically
    $rootT      = @($tasks | Where-Object { $_.taskId -eq $bd.RootId })[0]
    if ($null -ne $rootT) {
      $rootTool = if ($tools.ContainsKey($rootT.agent)) { $tools[$rootT.agent] } else { $tool }
    }
    Write-Host ""
    Write-Host ("  ACTION  : Paste this into {0}" -f $rootTool) -ForegroundColor Cyan
    # Word-wrap prompt
    $words = $rootPrompt -split ' '
    $line  = "  | "
    foreach ($wd in $words) {
      if (($line + $wd).Length -gt 90) {
        Write-Host $line -ForegroundColor White
        $line = "  |   $wd "
      } else { $line += "$wd " }
    }
    if ($line.Trim() -ne "|") { Write-Host $line -ForegroundColor White }
    Write-Host ("  | >> run: npm run orchestrator:complete-advance -- -TaskId {0} -AgentName `"{1}`"" -f $bd.RootId, $rootT.agent) -ForegroundColor Yellow
  } elseif ($bd.Gap -le $SECS_PER_SESSION -and $bd.TargetFile -ne "") {
    # Very close — show the task's own prompt as a hint
    Write-Host ""
    Write-Host "  NEXT PASTE (this task is almost unblocked):" -ForegroundColor Yellow
    $words = $bd.Prompt -split ' '
    $line  = "  | "
    foreach ($wd in $words) {
      if (($line + $wd).Length -gt 90) { Write-Host $line -ForegroundColor DarkGray; $line = "  |   $wd " }
      else { $line += "$wd " }
    }
    if ($line.Trim() -ne "|") { Write-Host $line -ForegroundColor DarkGray }
  }
  Write-Host ""
}

# ============================================================================
# SUMMARY TABLE
# ============================================================================
if (-not $Brief) {
  Write-Host ("=" * $w) -ForegroundColor Magenta
  Write-Host "  BLOCKER SUMMARY" -ForegroundColor Magenta
  Write-Host ("=" * $w) -ForegroundColor Magenta
  Write-Host ""

  # Group by lane and show counts
  $laneGroups = $sorted | Group-Object { $_.Task.lane } | Sort-Object Name
  foreach ($lg in $laneGroups) {
    $lc       = if ($laneColors.ContainsKey($lg.Name)) { $laneColors[$lg.Name] } else { "White" }
    $items    = @($lg.Group)
    $passable = @($items | Where-Object { $_.Gap -le 0 }).Count
    $close    = @($items | Where-Object { $_.EtaSess -eq 1 -and $_.Gap -gt 0 }).Count
    $further  = @($items | Where-Object { $_.EtaSess -gt 1 }).Count
    Write-Host ("  Lane {0}:  {1} blocked  ({2} passable now, {3} within 1 session, {4} further)" -f $lg.Name, $items.Count, $passable, $close, $further) -ForegroundColor $lc
  }

  Write-Host ""
  # Top 5 tasks nearest to unblocking
  $top5 = @($sorted | Where-Object { $_.Gap -gt 0 } | Select-Object -First 5)
  if ($top5.Count -gt 0) {
    Write-Host "  Top tasks nearest to unblocking:" -ForegroundColor White
    foreach ($bd in $top5) {
      $col = if ($bd.EtaSess -le 1) { "Yellow" } else { "DarkGray" }
      Write-Host ("    {0,-6} {1,-10}  gap={2,-3}  {3}" -f $bd.Task.taskId, $bd.Task.agent, $bd.Gap, $bd.TargetFile.Split("/")[-1]) -ForegroundColor $col
    }
  }

  Write-Host ""
  Write-Host ("  Showing {0} of {1} blocked tasks  |  READY tasks not shown: {2}" -f $sorted.Count, $blockedTasks.Count, $readyTasks.Count) -ForegroundColor DarkGray
  Write-Host ("  Run 'npm run orchestrator:next-agent:all' to see READY task prompts") -ForegroundColor DarkGray
  Write-Host ("=" * $w) -ForegroundColor Magenta
}

Write-Host ""
exit 0
