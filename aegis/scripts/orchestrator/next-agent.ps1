# next-agent.ps1 -- Post-completion advisor: "who fires next?"
# After a free agent pastes AI output and runs complete-and-advance,
# run this to instantly see:
#   - Which downstream task(s) just became READY
#   - The full paste-ready prompt for each
#   - The exact free tool URL to open
#   - Whether the cascade also auto-completes PASS-target tasks
#
# Usage:
#   npm run orchestrator:next-agent -- -TaskId T002
#   npm run orchestrator:next-agent -- -TaskId T002 -OpenBrowser
#   npm run orchestrator:next-agent            (auto-detects most recent 'done' task)
#
# Also usable as a "what's next?" stand-alone advisor without specifying a task:
#   npm run orchestrator:next-agent -- -ShowAll   (list every READY task concisely)

param(
  [string]$TaskId        = "",   # completed task to dispatch from (optional)
  [string]$WorkspaceRoot = ".",
  [switch]$OpenBrowser,          # open free tool URL in default browser
  [switch]$ForceBrowserOpen,
  [switch]$ShowAll               # show all currently READY tasks (no TaskId needed)
)

$ErrorActionPreference = "Continue"
$root        = Resolve-Path $WorkspaceRoot
$queueFile   = Join-Path $root "logs\orchestrator\task-queue.json"
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"
$browserLaunchScript = Join-Path $root "scripts\orchestrator\browser-launch.ps1"
$w           = 72

if (-not (Test-Path $queueFile))   { Write-Host "[ERROR] queue not found"   -ForegroundColor Red; exit 1 }
if (-not (Test-Path $promptsFile)) { Write-Host "[ERROR] prompts not found" -ForegroundColor Red; exit 1 }
if (Test-Path $browserLaunchScript) { . $browserLaunchScript }

$q = $null
function Read-JsonFileSafe {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [long]$MaxBytes = 32MB,
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

$q       = Read-JsonFileSafe -Path $queueFile -MaxBytes 32MB -TryTmpRecovery
$prompts = Get-Content $promptsFile -Raw | ConvertFrom-Json
$tasks   = @($q.tasks)

# -- agent metadata -----------------------------------------------------------
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
$models = @{
  "@Sofia"    = "Gemini 2.0 Flash"
  "@Victoria" = "Gemini 2.0 Flash"
  "@Annie"    = "Gemini 2.0 Flash"
  "@Marissa"  = "Gemini 2.0 Flash"
  "@Rachel"   = "Gemini 2.0 Flash"
  "@Timnit"   = "Gemini 2.0 Flash"
  "@Invoice"  = "Llama 3.1 70B (Groq)"
  "@Joelle"   = "Llama 3.1 70B (Groq)"
  "@Hedy"     = "Llama 3.1 70B (Groq)"
  "@Maya"     = "Llama 3.1 70B (Groq)"
  "@Booking"  = "Llama 3.1 70B (Groq)"
  "@Jaime"    = "Llama 3.1 70B (Groq)"
  "@Fei-Fei"  = "DeepSeek V3"
  "@Anima"    = "DeepSeek V3"
  "@Mary"     = "DeepSeek V3"
  "@Cassie"   = "DeepSeek V3"
  "@Corinne"  = "DeepSeek V3"
}
# Lane names for display
$laneNames = @{ "A"="Lane A (Sofia->Timnit->Victoria->Annie->Marissa->Rachel->Joelle)"; "B"="Lane B (Fei-Fei->Anima->Mary->Invoice)"; "C"="Lane C (Booking->Maya->Hedy->Cassie)"; "D"="Lane D (Jaime->Corinne)" }

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
  if ($null -ne $t) { return $t.title } else { return "(no prompt)" }
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

# Returns tasks that become READY after $completedId moves to done
function Get-Unlocked([string]$completedId) {
  $donePlusThis = @(@($tasks | Where-Object { $_.status -eq "done" } | ForEach-Object { $_.taskId }) + @($completedId))
  return @($tasks | Where-Object {
    $t = $_
    if ($t.status -ne "queued") { return $false }
    if ($null -eq $t.dependsOn -or $t.dependsOn.Count -eq 0) { return $false }
    $hasThis = $false; $allOk = $true
    foreach ($d in $t.dependsOn) {
      if ($d -eq $completedId) { $hasThis = $true }
      if ($donePlusThis -notcontains $d) { $allOk = $false }
    }
    return $hasThis -and $allOk
  })
}

# Gate targets (for fast-complete detection)
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"    = 12
  "business_docs/05_requirements/risk-register.md"              = 5
  "business_docs/05_requirements/non-functional-requirements.md"= 8
  "business_docs/07_business_model/revenue-model.md"            = 13
  "business_docs/03_ai_assistants/README.md"                    = 40
  "business_docs/06_design_architecture/system-architecture.md" = 12
  "business_docs/09_crm_features/tenancy-ejari.md"              = 14
  "business_docs/09_crm_features/landlord-portal.md"            = 13
  "business_docs/09_crm_features/financial-reporting.md"        = 11
  "business_docs/09_crm_features/analytics-dashboard.md"        = 22
  "business_docs/09_crm_features/agent-performance.md"          = 14
  "business_docs/09_crm_features/lead-tracking.md"              = 12
  "business_docs/09_crm_features/tenant-portal.md"              = 14
  "business_docs/09_crm_features/dld-integration.md"            = 12
  "business_docs/09_crm_features/legal-management.md"           = 12
  "business_docs/09_crm_features/audit-trail.md"                = 10
  "business_docs/09_crm_features/activity-feed.md"              = 8
  "business_docs/09_crm_features/follow-up-automation.md"       = 10
  "business_docs/09_crm_features/off-plan-projects.md"          = 14
  "business_docs/09_crm_features/handover-management.md"        = 10
  "business_docs/09_crm_features/scheduling-calendar.md"        = 12
  "business_docs/09_crm_features/viewings.md"                   = 10
  "business_docs/09_crm_features/offers.md"                     = 12
  "business_docs/09_crm_features/whatsapp-integration.md"       = 14
  "business_docs/09_crm_features/property-valuation.md"         = 10
  "business_docs/09_crm_features/market-intelligence.md"        = 10
  "business_docs/09_crm_features/market-analytics.md"           = 10
  "business_docs/09_crm_features/currency-management.md"        = 8
  "business_docs/09_crm_features/secondary-sales.md"            = 10
  "business_docs/09_crm_features/sentinel-property.md"          = 12
  "business_docs/09_crm_features/investment-management.md"      = 10
  "business_docs/09_crm_features/prospecting-outbound.md"       = 10
  "business_docs/09_crm_features/ai-chat.md"                    = 12
  "business_docs/09_crm_features/maintenance.md"                = 10
  "business_docs/09_crm_features/document-generation.md"        = 10
  "business_docs/09_crm_features/email-automation.md"           = 8
  "business_docs/09_crm_features/seo-strategy.md"               = 16
  "business_docs/09_crm_features/marketing-campaigns.md"        = 12
  "business_docs/09_crm_features/luxury-segment.md"             = 10
  "business_docs/09_crm_features/community-management.md"       = 8
  "business_docs/09_crm_features/careers.md"                    = 8
  "business_docs/09_crm_features/ui-ux-specification.md"        = 20
}

function Get-TargetFile([string]$prompt) {
  if ($prompt -match "(business_docs/[\w/_-]+\.md)") { return $Matches[1] }
  if ($prompt -match "\b([\w-]+\.md)\b") {
    $name = $Matches[1]
    foreach ($k in $gateTargets.Keys) { if ($k.EndsWith("/$name")) { return $k } }
    return "business_docs/09_crm_features/$name"
  }
  return ""
}

function Test-FilePass([string]$rel) {
  if (-not $gateTargets.ContainsKey($rel)) { return $false }
  $abs = Join-Path $root $rel.Replace("/","\")
  if (-not (Test-Path $abs)) { return $false }
  $secs = @(Get-Content $abs | Where-Object { $_ -match "^##\s|^###\s" }).Count
  return $secs -ge $gateTargets[$rel]
}

# -- Print a full dispatch card for a task ------------------------------------
function Write-DispatchCard([object]$task, [int]$idx, [int]$total, [string]$triggeredBy) {
  $id      = $task.taskId
  $agent   = $task.agent
  $tool    = if ($tools.ContainsKey($agent)) { $tools[$agent] } else { "https://aistudio.google.com/" }
  $model   = if ($models.ContainsKey($agent)) { $models[$agent] } else { "Gemini 2.0 Flash" }
  $lane    = $task.lane
  $lname   = if ($laneNames.ContainsKey($lane)) { $laneNames[$lane] } else { "Lane $lane" }
  $prompt  = Get-Prompt $id
  $tf      = Get-TargetFile $prompt
  $pass    = if ($tf -ne "") { Test-FilePass $tf } else { $false }
  $passStr = if ($pass) { " [FILE ALREADY PASS -- may auto-complete!]" } else { "" }

  Write-Host ("-" * $w) -ForegroundColor DarkGray
  if ($idx -gt 0) {
    Write-Host ("  NEXT AGENT  [{0}/{1}]  triggered by: {2}" -f $idx, $total, $triggeredBy) -ForegroundColor Magenta
  }
  Write-Host ("  Task    : {0}  ({1})" -f $id, $agent) -ForegroundColor Green
  Write-Host ("  Lane    : $lname") -ForegroundColor White
  Write-Host ("  Model   : $model") -ForegroundColor White
  Write-Host ("  Tool    : $tool") -ForegroundColor White
  if ($tf -ne "") {
    Write-Host ("  Target  : {0}{1}" -f $tf, $passStr) -ForegroundColor $(if ($pass) { "Cyan" } else { "DarkGray" })
  }
  Write-Host ""
  Write-Host "  +--- PASTE INTO $model ---+" -ForegroundColor Cyan
  $words = $prompt -split ' '
  $line  = "  | "
  foreach ($wd in $words) {
    if (($line + $wd).Length -gt 93) { Write-Host $line -ForegroundColor White; $line = "  |   $wd " }
    else { $line += "$wd " }
  }
  if ($line.Trim() -ne "|") { Write-Host $line -ForegroundColor White }
  Write-Host "  +---------------------------------+" -ForegroundColor Cyan
  Write-Host ""
  Write-Host ("  After pasting output into {0}, run:" -f $tf) -ForegroundColor DarkGray
  Write-Host ("  npm run orchestrator:complete-advance -- -TaskId {0} -AgentName `"{1}`"" -f $id, $agent) -ForegroundColor Yellow
  if ($OpenBrowser) {
    Write-Host ("  [BROWSER] Opening {0} ..." -f $tool) -ForegroundColor Cyan
    if (Get-Command Invoke-AegisBrowserLaunch -ErrorAction SilentlyContinue) {
      $launchResult = Invoke-AegisBrowserLaunch -Url $tool -WorkspaceRoot $root -Force:$ForceBrowserOpen
      if (-not $launchResult.launched) {
        Write-Host "  [SKIP] Browser launch skipped (recently opened). Use -ForceBrowserOpen to reopen." -ForegroundColor Yellow
      }
    } else {
      Start-Process $tool
    }
  } else {
    Write-Host ("  [TIP] Add -OpenBrowser flag to auto-open tool in browser") -ForegroundColor DarkGray
  }
  Write-Host ""
}

# -- BANNER -------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  WHITE CAVES -- NEXT AGENT DISPATCH" -ForegroundColor Magenta
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""

# -- MODE: ShowAll (no TaskId, just list all READY tasks) ---------------------
if ($ShowAll -or ($TaskId -eq "" -and -not $ShowAll)) {
  $readyTasks = @($tasks | Where-Object {
    ($_.status -eq "queued" -or $_.status -eq "retrying") -and
    (Test-AllDepsDone (Get-NormalizedDeps $_.dependsOn))
  })
  if ($TaskId -eq "" -and -not $ShowAll) {
    # Auto-detect: find most recently done task
    $doneTasks = @($tasks | Where-Object { $_.status -eq "done" })
    if ($doneTasks.Count -eq 0) {
      Write-Host "  No completed tasks found. Queue has not started." -ForegroundColor DarkYellow
      Write-Host "  Run: npm run orchestrator:today-sprint" -ForegroundColor Gray
      exit 0
    }
    # Use last done task by taskId sort (T001c > T001b > T001)
    $lastDone = ($doneTasks | Sort-Object { $_.taskId } -Descending | Select-Object -First 1)
    $TaskId   = $lastDone.taskId
    Write-Host ("  Auto-detected most recent completed task: {0} ({1})" -f $TaskId, $lastDone.agent) -ForegroundColor DarkGray
    Write-Host ("  Use -TaskId to specify a different source task.") -ForegroundColor DarkGray
    Write-Host ""
  }

  if ($ShowAll) {
    Write-Host ("  All READY tasks ({0} total):" -f $readyTasks.Count) -ForegroundColor White
    Write-Host ""
    $i = 0
    foreach ($rt in ($readyTasks | Sort-Object { $_.lane, $_.taskId })) {
      $i++
      Write-DispatchCard -task $rt -idx $i -total $readyTasks.Count -triggeredBy "already ready"
    }
    if ($readyTasks.Count -eq 0) {
      Write-Host "  No READY tasks right now." -ForegroundColor DarkGray
      Write-Host "  Tip: run npm run orchestrator:today-sprint to see the full pipeline." -ForegroundColor DarkGray
    }
    Write-Host ("=" * $w) -ForegroundColor Magenta
    exit 0
  }
}

# -- MODE: TaskId-based dispatch ----------------------------------------------
$sourceTask = @($tasks | Where-Object { $_.taskId -eq $TaskId })[0]
if ($null -eq $sourceTask) {
  Write-Host "[ERROR] Task '$TaskId' not found in queue." -ForegroundColor Red
  exit 1
}

$sourceStatus = $sourceTask.status
$sourceAgent  = $sourceTask.agent

Write-Host ("  Source task : {0}  ({1})  [{2}]" -f $TaskId, $sourceAgent, $sourceStatus.ToUpper()) -ForegroundColor White
Write-Host ""

# Find what's unlocked by this task completing
$unlocked = Get-Unlocked -completedId $TaskId

# Also find currently READY tasks in same lane (in case user forgot to pass -TaskId after real completion)
$sameReady = @($tasks | Where-Object {
  ($_.status -eq "queued" -or $_.status -eq "retrying") -and
  $_.lane -eq $sourceTask.lane -and
  (Test-AllDepsDone (Get-NormalizedDeps $_.dependsOn))
})

if ($unlocked.Count -eq 0 -and $sameReady.Count -eq 0) {
  Write-Host ("  No tasks become READY after {0} completes." -f $TaskId) -ForegroundColor DarkGray
  Write-Host "  The chain may require more upstream tasks to finish first." -ForegroundColor DarkGray
  Write-Host ""
  Write-Host ("  Currently READY in all lanes:") -ForegroundColor White
  $allReady = @($tasks | Where-Object {
    ($_.status -eq "queued") -and (Test-AllDepsDone (Get-NormalizedDeps $_.dependsOn))
  })
  foreach ($rt in $allReady) {
    Write-Host ("    {0,-7} {1}" -f $rt.taskId, $rt.agent) -ForegroundColor DarkGray
  }
  Write-Host ("=" * $w) -ForegroundColor Magenta
  exit 0
}

# -- FAST-COMPLETE preview: tasks that auto-complete after this ---------------
$autoComplete = @($unlocked | Where-Object {
  $tf = Get-TargetFile (Get-Prompt $_.taskId)
  $tf -ne "" -and (Test-FilePass $tf)
})
if ($autoComplete.Count -gt 0) {
  Write-Host ("  AUTO-COMPLETE PREVIEW: {0} task(s) will cascade done immediately" -f $autoComplete.Count) -ForegroundColor Cyan
  foreach ($ac in $autoComplete) {
    $tf = Get-TargetFile (Get-Prompt $ac.taskId)
    Write-Host ("    {0} ({1}) -> {2} already PASS" -f $ac.taskId, $ac.agent, $tf) -ForegroundColor Cyan
  }
  Write-Host ""
  Write-Host "  Run fast-complete after marking done to cascade:" -ForegroundColor DarkGray
  Write-Host "  npm run orchestrator:fast-complete" -ForegroundColor Yellow
  Write-Host ""
}

# -- Dispatch cards for newly unlocked tasks ----------------------------------
$dispatchList = @(if ($unlocked.Count -gt 0) { $unlocked } else { $sameReady })
$total = $dispatchList.Count

if ($unlocked.Count -eq 0 -and $sameReady.Count -gt 0) {
  Write-Host ("  (Task {0} already done -- showing {1} currently READY in Lane {2})" -f $TaskId, $sameReady.Count, $sourceTask.lane) -ForegroundColor DarkYellow
  Write-Host ""
}

$i = 0
foreach ($next in ($dispatchList | Sort-Object { $_.taskId })) {
  $i++
  Write-DispatchCard -task $next -idx $i -total $total -triggeredBy $TaskId
}

# -- Summary ------------------------------------------------------------------
$nowDone   = @($tasks | Where-Object { $_.status -eq "done" }).Count
$nowQueued = @($tasks | Where-Object { $_.status -eq "queued" }).Count
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ("  Dispatched {0} agent(s)  |  Queue: {1} done / {2} remaining" -f $total, $nowDone, $nowQueued) -ForegroundColor Magenta
Write-Host ("  Full pipeline: npm run orchestrator:today-sprint") -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host ""
