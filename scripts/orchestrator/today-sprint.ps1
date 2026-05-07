# today-sprint.ps1 -- Daily sprint sheet for free agents.
# Shows ALL ready tasks with paste-ready prompts, file targets, section gaps,
# and exact completion commands. One output covers the whole day's work.
#
# Usage:
#   npm run orchestrator:today-sprint
#   npm run orchestrator:today-sprint -- -Lane A          (filter to one lane)
#   npm run orchestrator:today-sprint -- -AgentName @Sofia  (single agent)
#   npm run orchestrator:today-sprint -- -ShowAll          (include blocked tasks too)
param(
  [string]$WorkspaceRoot = ".",
  [string]$Lane          = "",     # filter: A / B / C / D
  [string]$AgentName     = "",     # filter: e.g. "@Sofia"
  [switch]$ShowAll,                # also show blocked agents (greyed)
  [switch]$NoPrompt                # skip the paste-box (compact view)
)

$queueFile   = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$promptsFile = Join-Path $WorkspaceRoot "scripts\orchestrator\prompts.json"

if (-not (Test-Path $queueFile))   { Write-Host "[ERROR] Queue not found."   -ForegroundColor Red; exit 1 }
if (-not (Test-Path $promptsFile)) { Write-Host "[ERROR] Prompts not found." -ForegroundColor Red; exit 1 }

$queue   = Get-Content $queueFile   -Raw | ConvertFrom-Json
$prompts = Get-Content $promptsFile -Raw | ConvertFrom-Json
$tasks   = @($queue.tasks)

# -- Gate-check targets (mirrors gate-check.ps1) ------------------------------
$targets = @{
  "business_docs/05_requirements/compliance-requirements.md" = 12
  "business_docs/09_crm_features/tenancy-ejari.md"           = 14
  "business_docs/09_crm_features/landlord-portal.md"         = 13
  "business_docs/09_crm_features/financial-reporting.md"     = 11
  "business_docs/07_business_model/revenue-model.md"         = 13
  "business_docs/09_crm_features/analytics-dashboard.md"     = 22
  "business_docs/09_crm_features/agent-performance.md"       = 14
  "business_docs/03_ai_assistants/README.md"                 = 40
  "business_docs/09_crm_features/dld-integration.md"         = 12
  "business_docs/09_crm_features/legal-management.md"        = 12
  "business_docs/09_crm_features/audit-trail.md"             = 10
  "business_docs/09_crm_features/activity-feed.md"           = 8
  "business_docs/09_crm_features/follow-up-automation.md"    = 10
  "business_docs/09_crm_features/off-plan-projects.md"       = 14
  "business_docs/09_crm_features/handover-management.md"     = 10
  "business_docs/09_crm_features/scheduling-calendar.md"     = 12
  "business_docs/09_crm_features/viewings.md"                = 10
  "business_docs/09_crm_features/offers.md"                  = 12
  "business_docs/09_crm_features/whatsapp-integration.md"    = 14
  "business_docs/09_crm_features/property-valuation.md"      = 10
  "business_docs/09_crm_features/market-intelligence.md"     = 10
  "business_docs/09_crm_features/market-analytics.md"        = 10
  "business_docs/09_crm_features/currency-management.md"     = 8
  "business_docs/09_crm_features/secondary-sales.md"         = 10
  "business_docs/09_crm_features/sentinel-property.md"       = 12
  "business_docs/09_crm_features/investment-management.md"   = 10
  "business_docs/09_crm_features/prospecting-outbound.md"    = 10
  "business_docs/09_crm_features/ai-chat.md"                 = 12
  "business_docs/09_crm_features/maintenance.md"             = 10
  "business_docs/09_crm_features/tenant-portal.md"           = 14
  "business_docs/09_crm_features/document-generation.md"     = 10
  "business_docs/09_crm_features/email-automation.md"        = 8
  "business_docs/09_crm_features/seo-strategy.md"            = 16
  "business_docs/09_crm_features/marketing-campaigns.md"     = 12
  "business_docs/09_crm_features/luxury-segment.md"          = 10
  "business_docs/09_crm_features/community-management.md"    = 8
}

# agent -> free tool URL
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

# agent -> model label
$models = @{
  "@Sofia"    = "Gemini 2.0 Flash"
  "@Victoria" = "Gemini 2.0 Flash"
  "@Annie"    = "Gemini 2.0 Flash"
  "@Marissa"  = "Gemini 2.0 Flash"
  "@Rachel"   = "Gemini 2.0 Flash"
  "@Timnit"   = "Gemini 2.0 Flash"
  "@Invoice"  = "Llama 3.1 70B"
  "@Joelle"   = "Llama 3.1 70B"
  "@Hedy"     = "Llama 3.1 70B"
  "@Maya"     = "Llama 3.1 70B"
  "@Booking"  = "Llama 3.1 70B"
  "@Jaime"    = "Llama 3.1 70B"
  "@Fei-Fei"  = "DeepSeek V3"
  "@Anima"    = "DeepSeek V3"
  "@Mary"     = "DeepSeek V3"
  "@Cassie"   = "DeepSeek V3"
  "@Corinne"  = "DeepSeek V3"
}

function Test-DepsDone {
  param([array]$deps, $allTasks)
  if ($null -eq $deps -or $deps.Count -eq 0) { return $true }
  foreach ($d in $deps) {
    $dep = $allTasks | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
}

function Get-SectionCount {
  param([string]$relPath, [string]$root)
  $abs = Join-Path $root $relPath
  if (-not (Test-Path $abs)) { return 0 }
  $lines = Get-Content $abs
  $h2 = @($lines | Where-Object { $_ -match "^##\s" }).Count
  $h3 = @($lines | Where-Object { $_ -match "^###\s" }).Count
  return $h2 + $h3
}

function Get-TargetFile {
  param([string]$prompt)
  # Extract file path from prompt text -- looks for .md filename
  if ($prompt -match '(business_docs[/\\][^\s:,]+\.md)') { return $Matches[1] -replace '\\','/' }
  if ($prompt -match '\b([\w-]+\.md)\b') {
    # try to find it in targets
    $name = $Matches[1]
    foreach ($k in $targets.Keys) {
      if ($k.EndsWith("/$name") -or $k.EndsWith("\$name")) { return $k }
    }
    return $name
  }
  return ""
}

# -- Dependency check: which tasks are ready? ---------------------------------
$ready   = @($tasks | Where-Object {
  ($_.status -eq "queued" -or $_.status -eq "retrying") -and
  (Test-DepsDone -deps @($_.dependsOn) -allTasks $tasks)
})
$waiting = @($tasks | Where-Object { $_.status -eq "waiting_ack" })
$done    = @($tasks | Where-Object { $_.status -eq "done" })

# Apply filters
if ($Lane -ne "") {
  $ready = @($ready | Where-Object { $_.lane -eq $Lane })
}
if ($AgentName -ne "") {
  $ready = @($ready | Where-Object { $_.agent -eq $AgentName })
}

# -- Header -------------------------------------------------------------------
$date = (Get-Date).ToString("dddd, MMM d yyyy")
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- TODAY'S SPRINT SHEET  $date" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
$pct = if ($tasks.Count -gt 0) { [math]::Round(($done.Count / $tasks.Count) * 100) } else { 0 }
Write-Host ("  Overall progress: {0}/{1} tasks done ({2}%)" -f $done.Count, $tasks.Count, $pct) -ForegroundColor White
Write-Host ("  Ready: {0}   Waiting ACK: {1}   Done: {2}" -f $ready.Count, $waiting.Count, $done.Count) -ForegroundColor DarkGray
if ($Lane -ne "")      { Write-Host "  Filter: Lane $Lane" -ForegroundColor DarkYellow }
if ($AgentName -ne "") { Write-Host "  Filter: Agent $AgentName" -ForegroundColor DarkYellow }
Write-Host ""

if ($waiting.Count -gt 0) {
  Write-Host "  *** PENDING FEEDS_ACK (complete these first) ***" -ForegroundColor Yellow
  foreach ($w in $waiting) {
    $ackAgent = $w.feedsAckBy
    Write-Host ("  Task {0} ({1}) waiting for ACK from {2}" -f $w.taskId, $w.agent, $ackAgent) -ForegroundColor Yellow
    Write-Host ("  Run: npm run orchestrator:queue:ack -- -TaskId {0} -AckBy `"{1}`"" -f $w.taskId, $ackAgent) -ForegroundColor Gray
  }
  Write-Host ""
}

if ($ready.Count -eq 0) {
  Write-Host "  No ready tasks found (check filters or run npm run orchestrator:morning)." -ForegroundColor DarkGray
  exit 0
}

# -- Per-task sprint cards ----------------------------------------------------
$n = 0
foreach ($t in $ready) {
  $n++
  $agent   = $t.agent
  $taskId  = $t.taskId
  $tool    = if ($tools.ContainsKey($agent)) { $tools[$agent] } else { "https://aistudio.google.com/" }
  $model   = if ($models.ContainsKey($agent)) { $models[$agent] } else { "Gemini 2.0 Flash" }

  # Get prompt
  $promptKey = $taskId
  $promptText = ""
  $pProps = $prompts | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
  if ($pProps -contains $promptKey) {
    $promptText = $prompts.$promptKey
  } else {
    $promptText = $t.title
  }

  # Derive target file
  $targetFile = Get-TargetFile -prompt $promptText
  $targetSecs = 0
  $actualSecs = 0
  $gap        = 0
  if ($targetFile -ne "" -and $targets.ContainsKey($targetFile)) {
    $targetSecs = $targets[$targetFile]
    $actualSecs = Get-SectionCount -relPath $targetFile -root $WorkspaceRoot
    $gap        = [math]::Max(0, $targetSecs - $actualSecs)
  }

  # Progress bar for the target file
  $bar = ""
  if ($targetSecs -gt 0) {
    $filled = [math]::Round(($actualSecs / $targetSecs) * 20)
    $filled = [math]::Min($filled, 20)
    $bar = "[" + ("#" * $filled) + ("." * (20 - $filled)) + "]"
  }

  # Header card
  Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray
  Write-Host ("  [{0}/{1}]  {2}  --  Task {3}" -f $n, $ready.Count, $agent, $taskId) -ForegroundColor Green
  Write-Host ("  Model   : {0}" -f $model) -ForegroundColor White
  Write-Host ("  Tool    : {0}" -f $tool) -ForegroundColor White
  if ($targetFile -ne "") {
    $fileStatus = if ($gap -eq 0) { "PASS" } else { "BLOCKED -- needs $gap more sections" }
    $color = if ($gap -eq 0) { "Green" } else { "Yellow" }
    Write-Host ("  Target  : {0}" -f $targetFile) -ForegroundColor DarkGray
    Write-Host ("  Sections: {0}/{1}  {2}  {3}" -f $actualSecs, $targetSecs, $bar, $fileStatus) -ForegroundColor $color
  }
  Write-Host ""

  if (-not $NoPrompt) {
    Write-Host "  +--- PASTE INTO AI TOOL ---+" -ForegroundColor Cyan
    # Word-wrap prompt at ~90 chars
    $words = $promptText -split ' '
    $line  = "  | "
    foreach ($w in $words) {
      if (($line + $w).Length -gt 93) {
        Write-Host $line -ForegroundColor White
        $line = "  |   $w "
      } else {
        $line += "$w "
      }
    }
    if ($line.Trim() -ne "|") { Write-Host $line -ForegroundColor White }
    Write-Host "  +---------------------------+" -ForegroundColor Cyan
    Write-Host ""
  }

  # Completion command
  Write-Host "  After pasting AI output into the target file, run:" -ForegroundColor DarkGray
  Write-Host ("  npm run orchestrator:complete-advance -- -TaskId {0} -AgentName `"{1}`"" -f $taskId, $agent) -ForegroundColor Yellow
  Write-Host ""
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("  Sprint cards: {0} ready tasks shown above" -f $ready.Count) -ForegroundColor Cyan
Write-Host "  Gate-check  : npm run orchestrator:gate-check" -ForegroundColor DarkGray
Write-Host "  Morning brief: npm run orchestrator:morning" -ForegroundColor DarkGray
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""