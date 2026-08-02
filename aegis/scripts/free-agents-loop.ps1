# free-agents-loop.ps1 -- White Caves Free Planning Agent Loop (Phase 11 rewrite)
# Queue-aware: loads current task + prompt from orchestrator queue + prompts.json sidecar.
# ASCII-clean: no em-dashes, no box-drawing chars.
#
# Usage: .\scripts\free-agents-loop.ps1 [-NoBrowser] [-AgentName "@Sofia"]
param(
  [string]$AgentName  = "",
  [switch]$NoBrowser
)

$root       = Split-Path $PSScriptRoot -Parent
$queueFile  = Join-Path $root "logs\orchestrator\task-queue.json"
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"

# ---- Slot map (minute-of-hour -> agent) ----
# NOTE: Must be a regular @{} hashtable, NOT [ordered]@{}
# OrderedDictionary treats integer index as positional, not key-based.
$slots = @{
  0  = @{ Agent="@Annie";    Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash";   Domain="Tenant portal, docs, email automation" }
  5  = @{ Agent="@Rachel";   Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash";   Domain="SEO strategy, marketing, careers" }
  10 = @{ Agent="@Marissa";  Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash";   Domain="Luxury CRM, community, UX spec" }
  15 = @{ Agent="@Timnit";   Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash";   Domain="DLD integration, legal CRM, data privacy" }
  20 = @{ Agent="@Hedy";     Tool="Groq Console";     URL="https://console.groq.com/";    Model="Llama 3.1 70B";      Domain="Audit trail, activity feed, follow-ups" }
  25 = @{ Agent="@Maya";     Tool="Groq Console";     URL="https://console.groq.com/";    Model="Llama 3.1 70B";      Domain="Off-plan projects, handover" }
  30 = @{ Agent="@Booking";  Tool="Groq Console";     URL="https://console.groq.com/";    Model="Llama 3.1 70B";      Domain="Scheduling calendar, viewings" }
  35 = @{ Agent="@Jaime";    Tool="Groq Console";     URL="https://console.groq.com/";    Model="Llama 3.1 70B";      Domain="Offers workflow, WhatsApp" }
  40 = @{ Agent="@Fei-Fei";  Tool="DeepSeek Chat";    URL="https://chat.deepseek.com/";   Model="DeepSeek V3";        Domain="Property valuation, market intelligence" }
  45 = @{ Agent="@Anima";    Tool="DeepSeek Chat";    URL="https://chat.deepseek.com/";   Model="DeepSeek V3";        Domain="Currency, secondary sales, pipelines" }
  50 = @{ Agent="@Mary";     Tool="DeepSeek Chat";    URL="https://chat.deepseek.com/";   Model="DeepSeek V3";        Domain="Sentinel property, investment" }
  55 = @{ Agent="@Corinne";  Tool="DeepSeek Chat";    URL="https://chat.deepseek.com/";   Model="DeepSeek V3";        Domain="AI chat, maintenance, map search" }
}

# Always-on agents (not time-slotted)
$alwaysOn = @{
  "@Victoria" = @{ Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash";   Domain="Tenancy/Ejari, landlord portal, leasing" }
  "@Invoice"  = @{ Tool="Groq Console";     URL="https://console.groq.com/";    Model="Llama 3.1 70B";      Domain="Financial reporting, VAT, revenue model" }
  "@Sofia"    = @{ Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash";   Domain="Compliance, RERA/DLD regulations" }
  "@Cassie"   = @{ Tool="DeepSeek Chat";    URL="https://chat.deepseek.com/";   Model="DeepSeek V3";        Domain="Analytics dashboard, agent performance" }
  "@Joelle"   = @{ Tool="Groq Console";     URL="https://console.groq.com/";    Model="Llama 3.1 70B";      Domain="AI personas, integration map, lead scoring" }
    "@Nova"    = @{ Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash"; Domain="Backlog coordination, task triage" }
    "@Orion"   = @{ Tool="Groq Console"; URL="https://console.groq.com/"; Model="Llama 3.1 70B"; Domain="CI/CD automation, ops monitoring" }
    "@Pulse"   = @{ Tool="DeepSeek Chat"; URL="https://chat.deepseek.com/"; Model="DeepSeek V3"; Domain="Data pipelines, monitoring dashboards" }
    "@Quark"   = @{ Tool="Google AI Studio"; URL="https://aistudio.google.com/"; Model="Gemini 2.0 Flash"; Domain="Analytics export, CSV/Excel API" }
    "@Zara"    = @{ Tool="Groq Console"; URL="https://console.groq.com/"; Model="Llama 3.1 70B"; Domain="Security audits, compliance checks" }
}

# ---- Determine active agent ----
$minute = (Get-Date).Minute
$slotMin = [int]([math]::Floor($minute / 5) * 5)
if ($slotMin -gt 55) { $slotMin = 55 }

if ($AgentName -ne "") {
  # Override: find slot for named agent
  $matchSlot = $slots.Keys | Where-Object { $slots[$_].Agent -eq $AgentName } | Select-Object -First 1
  if ($null -ne $matchSlot) {
    $current  = $slots[$matchSlot]
    $activeSlot = $matchSlot
  } elseif ($alwaysOn.ContainsKey($AgentName)) {
    $current  = $alwaysOn[$AgentName]
    $current.Agent = $AgentName
    $activeSlot = -1
  } else {
    Write-Host "[ERROR] Unknown agent: $AgentName" -ForegroundColor Red; exit 1
  }
} else {
  $current    = $slots[$slotMin]
  $activeSlot = $slotMin
}

$now = Get-Date -Format "HH:mm"

# ---- Load queue ----
$qTasks   = @()
$prompts  = $null
if (Test-Path $queueFile) {
  try { $q = Get-Content $queueFile -Raw | ConvertFrom-Json; $qTasks = @($q.tasks) } catch {}
}
if (Test-Path $promptsFile) {
  try { $prompts = Get-Content $promptsFile -Raw | ConvertFrom-Json } catch {}
}

# Get next queued/retrying task for agent
function Get-NextTask([string]$agent, [object[]]$allTasks) {
  $active = @($allTasks | Where-Object { $_.agent -eq $agent -and ($_.status -eq "running" -or $_.status -eq "waiting_ack") })
  if ($active.Count -gt 0) { return $active[0] }
  $queued = @($allTasks | Where-Object { $_.agent -eq $agent -and ($_.status -eq "queued" -or $_.status -eq "retrying") })
  if ($queued.Count -eq 0) { return $null }
  # Find first with deps satisfied
  foreach ($t in $queued) {
    $depsOk = $true
    if ($null -ne $t.dependsOn -and $t.dependsOn.Count -gt 0) {
      foreach ($d in $t.dependsOn) {
        $dep = $allTasks | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
        if ($null -ne $dep -and $dep.status -ne "done") { $depsOk = $false; break }
      }
    }
    if ($depsOk) { return $t }
  }
  return $queued[0]  # Return first even if blocked (show why)
}

function Get-Prompt([string]$taskId, [object]$pmap) {
  if ($null -eq $pmap) { return "[prompts.json not found]" }
  $p = $pmap.$taskId
  if ($null -eq $p) { return "[No prompt for $taskId in prompts.json]" }
  return $p
}

function Get-AgentQueueSummary([string]$agent, [object[]]$allTasks) {
  $agTasks = @($allTasks | Where-Object { $_.agent -eq $agent })
  $done    = @($agTasks | Where-Object { $_.status -eq "done" }).Count
  return "$done/$($agTasks.Count)"
}

# ---- Banner ----
Write-Host ""
Write-Host "  WHITE CAVES -- Free Agent Loop" -ForegroundColor Yellow
Write-Host "  Time: $now  |  Slot: :$('{0:D2}' -f $activeSlot)  |  Date: $(Get-Date -Format 'yyyy-MM-dd')" -ForegroundColor DarkGray
Write-Host ""

# ---- Active Agent Card ----
$task = Get-NextTask $current.Agent $qTasks
$qSummary = Get-AgentQueueSummary $current.Agent $qTasks

Write-Host "  +---[ ACTIVE AGENT ]-----------------------------------------------+" -ForegroundColor Cyan
Write-Host ("  |  {0,-12}  {1,-22}  {2}" -f $current.Agent, $current.Tool, $current.Model) -ForegroundColor White
Write-Host ("  |  Domain: {0}" -f $current.Domain) -ForegroundColor Gray
Write-Host ("  |  Tool URL: {0}" -f $current.URL) -ForegroundColor DarkGray
Write-Host ("  |  Queue progress: {0}" -f $qSummary) -ForegroundColor DarkGray
Write-Host "  +------------------------------------------------------------------+" -ForegroundColor Cyan
Write-Host ""

# ---- Current Task ----
if ($null -ne $task) {
  $statusColor = switch ($task.status) {
    "done"        { "Green"   }
    "running"     { "Cyan"    }
    "waiting_ack" { "Yellow"  }
    "queued"      { "White"   }
    "retrying"    { "Magenta" }
    "failed"      { "Red"     }
    "escalated"   { "Red"     }
    default       { "Gray"    }
  }

  # Check if deps are blocking
  $blocked = $false
  $blockerIds = @()
  if ($null -ne $task.dependsOn -and $task.dependsOn.Count -gt 0) {
    foreach ($d in $task.dependsOn) {
      $dep = $qTasks | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
      if ($null -ne $dep -and $dep.status -ne "done") { $blocked = $true; $blockerIds += $d }
    }
  }

  Write-Host "  CURRENT TASK" -ForegroundColor Cyan
  Write-Host ("  Task ID : {0}  [{1}]" -f $task.taskId, $task.status) -ForegroundColor $statusColor
  Write-Host ("  Title   : {0}" -f $task.title) -ForegroundColor White
  Write-Host ("  Lane    : {0}" -f $task.lane) -ForegroundColor DarkGray

  if ($blocked) {
    Write-Host ""
    Write-Host ("  [BLOCKED] Waiting on: {0}" -f ($blockerIds -join ", ")) -ForegroundColor Red
    Write-Host "  Complete upstream tasks first, then return to this agent." -ForegroundColor DarkGray
  } else {
    Write-Host ""
    Write-Host "  STEP 1 -- Open the free tool:" -ForegroundColor Yellow
    Write-Host ("  {0}" -f $current.URL) -ForegroundColor White
    Write-Host ""
    Write-Host "  STEP 2 -- Paste this prompt:" -ForegroundColor Yellow
    Write-Host "  +-----------------------------------------------------------------+" -ForegroundColor DarkGray
    $promptText = Get-Prompt $task.taskId $prompts
    # Word-wrap at ~72 chars
    $words = $promptText -split " "
    $line  = "  | "
    foreach ($w in $words) {
      if (($line + $w + " ").Length -gt 75) {
        Write-Host ("{0,-76}|" -f $line) -ForegroundColor White
        $line = "  |   $w "
      } else { $line += "$w " }
    }
    if ($line.Trim() -ne "|") { Write-Host ("{0,-76}|" -f $line) -ForegroundColor White }
    Write-Host "  +-----------------------------------------------------------------+" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  STEP 3 -- Paste AI output into target file, then run:" -ForegroundColor Yellow

    $targetFile = if ($null -ne $task.targetFile) { $task.targetFile } else { "[see prompts.json for target file]" }
    Write-Host ("  Target  : {0}" -f $targetFile) -ForegroundColor Gray
    Write-Host ""
    Write-Host "  STEP 4 -- Mark complete:" -ForegroundColor Yellow
    Write-Host ("  npm run orchestrator:complete-advance -- -TaskId {0} -AgentName '{1}'" -f $task.taskId, $task.agent) -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  STEP 5 -- (Optional) log output to outputs/:" -ForegroundColor Yellow
    Write-Host ("  npm run orchestrator:output-log -- -TaskId {0} -AgentName '{1}' -OutputText 'paste here'" -f $task.taskId, $task.agent) -ForegroundColor DarkGray
  }
} else {
  Write-Host "  [QUEUE] No tasks assigned to $($current.Agent)." -ForegroundColor DarkGray
  Write-Host "  All tasks may be done or the queue has not been seeded." -ForegroundColor DarkGray
  Write-Host "  Run: npm run orchestrator:queue:init" -ForegroundColor Gray
}

Write-Host ""

# ---- All-agent queue summary ----
if ($qTasks.Count -gt 0) {
  $allAgents = @($qTasks | Select-Object -ExpandProperty agent | Sort-Object -Unique)
  Write-Host "  ALL AGENTS QUEUE SUMMARY" -ForegroundColor DarkCyan
  Write-Host ("  {0,-14} {1,-8} {2,-9} {3,-9} {4,-9} {5}" -f "Agent","Done","Running","Waiting","Queued","Blocked") -ForegroundColor DarkGray
  Write-Host ("  {0}" -f ("-" * 65)) -ForegroundColor DarkGray
  foreach ($ag in $allAgents) {
    $agT = @($qTasks | Where-Object { $_.agent -eq $ag })
    $d   = @($agT | Where-Object { $_.status -eq "done" }).Count
    $r   = @($agT | Where-Object { $_.status -eq "running" -or $_.status -eq "waiting_ack" }).Count
    $qu  = @($agT | Where-Object { $_.status -eq "queued" }).Count
    # Determine blocked count
    $bl  = 0
    foreach ($t in ($agT | Where-Object { $_.status -eq "queued" })) {
      if ($null -ne $t.dependsOn -and $t.dependsOn.Count -gt 0) {
        foreach ($dd in $t.dependsOn) {
          $depT = $qTasks | Where-Object { $_.taskId -eq $dd } | Select-Object -First 1
          if ($null -ne $depT -and $depT.status -ne "done") { $bl++; break }
        }
      }
    }
    $isActive = ($ag -eq $current.Agent)
    $col = if ($d -eq $agT.Count) { "Green" } elseif ($r -gt 0) { "Cyan" } elseif ($isActive) { "Yellow" } else { "Gray" }
    Write-Host ("  {0,-14} {1,-8} {2,-9} {3,-9} {4,-9} {5}" -f $ag, $d, $r, 0, $qu, $bl) -ForegroundColor $col
  }
  $totalDone = @($qTasks | Where-Object { $_.status -eq "done" }).Count
  $pct = if ($qTasks.Count -gt 0) { [int](($totalDone / $qTasks.Count) * 100) } else { 0 }
  Write-Host ""
  $bar = ("[" + ("=" * [int](($pct/100)*30)) + ("-" * (30 - [int](($pct/100)*30))) + "]")
  Write-Host ("  Overall: {0}  {1}%  ({2}/{3} tasks done)" -f $bar, $pct, $totalDone, $qTasks.Count) -ForegroundColor Cyan
}

Write-Host ""

# ---- Next slots preview ----
if ($activeSlot -ge 0 -and $AgentName -eq "") {
  $slotKeys   = @($slots.Keys | Sort-Object)
  $currentIdx = [array]::IndexOf($slotKeys, $activeSlot)
  $nextSlots  = for ($i = 1; $i -le 3; $i++) {
    $idx  = ($currentIdx + $i) % $slotKeys.Count
    $sKey = $slotKeys[$idx]
    ":$('{0:D2}' -f $sKey) $($slots[$sKey].Agent)"
  }
  Write-Host ("  Next slots: {0}" -f ($nextSlots -join "  >>  ")) -ForegroundColor DarkGray
}

# ---- Auto-open browser ----
if (-not $NoBrowser -and $null -ne $task -and -not $blocked) {
  try { Start-Process $current.URL } catch {}
}

Write-Host ""