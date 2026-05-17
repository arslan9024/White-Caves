# margaret-sync.ps1 -- @Margaret daily sync
# Reads queue state and rewrites the AGENTS.md sprint status table automatically
# Also appends a sign-off line to DAILY_MILESTONE_TRACKER.md
param(
  [string]$WorkspaceRoot = ".",
  [switch]$DryRun  # print changes, do not write files
)

$queueFile   = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$agentsFile  = Join-Path $WorkspaceRoot "AGENTS.md"
$trackerFile = Join-Path $WorkspaceRoot "DAILY_MILESTONE_TRACKER.md"
$today       = (Get-Date).ToString("MMM d, yyyy")
$now         = (Get-Date).ToString("HH:mm")

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue file not found: $queueFile" -ForegroundColor Red; exit 1
}
if (-not (Test-Path $agentsFile)) {
  Write-Host "[ERROR] AGENTS.md not found." -ForegroundColor Red; exit 1
}

$queue = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($queue.tasks)

# -- Build per-agent summary ---------------------------------------------------
$agentMap = @{}
foreach ($t in $tasks) {
  $a = $t.agent
  if (-not $agentMap.ContainsKey($a)) {
    $agentMap[$a] = @{ done=0; total=0; current=$null; status="queued"; model=""; taskId="" }
  }
  $agentMap[$a].total++
  if ($t.status -eq "done") { $agentMap[$a].done++ }
  if ($t.status -eq "running" -or $t.status -eq "waiting_ack") {
    $agentMap[$a].current = $t.title
    $agentMap[$a].status  = $t.status
    $agentMap[$a].taskId  = $t.taskId
  }
  if ($agentMap[$a].current -eq $null -and ($t.status -eq "queued" -or $t.status -eq "retrying")) {
    $agentMap[$a].current = $t.title
    $agentMap[$a].status  = $t.status
    $agentMap[$a].taskId  = $t.taskId
  }
}

# Model lookup
$modelMap = @{
  "@Sofia"    = "Gemini 2.0 Flash"
  "@Timnit"   = "Gemini 2.0 Flash"
  "@Victoria" = "Gemini 2.0 Flash"
  "@Annie"    = "Gemini 2.0 Flash"
  "@Marissa"  = "Gemini 2.0 Flash"
  "@Rachel"   = "Gemini 2.0 Flash"
  "@Joelle"   = "Llama 3.1 70B Groq"
  "@Fei-Fei"  = "DeepSeek V3"
  "@Anima"    = "DeepSeek V3"
  "@Mary"     = "DeepSeek V3"
  "@Invoice"  = "Llama 3.1 70B Groq"
  "@Booking"  = "Llama 3.1 70B Groq"
  "@Maya"     = "Llama 3.1 70B Groq"
  "@Hedy"     = "Llama 3.1 70B Groq"
  "@Cassie"   = "DeepSeek V3"
  "@Jaime"    = "Llama 3.1 70B Groq"
  "@Corinne"  = "DeepSeek V3"
}

$fileMap = @{
  "@Sofia"    = "business_docs/05_requirements/compliance-requirements.md"
  "@Timnit"   = "business_docs/09_crm_features/dld-integration.md"
  "@Victoria" = "business_docs/09_crm_features/tenancy-ejari.md"
  "@Annie"    = "business_docs/09_crm_features/tenant-portal.md"
  "@Marissa"  = "business_docs/09_crm_features/luxury-segment.md"
  "@Rachel"   = "business_docs/09_crm_features/seo-strategy.md"
  "@Joelle"   = "business_docs/03_ai_assistants/README.md"
  "@Fei-Fei"  = "business_docs/09_crm_features/property-valuation.md"
  "@Anima"    = "business_docs/09_crm_features/secondary-sales.md"
  "@Mary"     = "business_docs/09_crm_features/sentinel-property.md"
  "@Invoice"  = "business_docs/09_crm_features/financial-reporting.md"
  "@Booking"  = "business_docs/09_crm_features/viewings.md"
  "@Maya"     = "business_docs/09_crm_features/off-plan-projects.md"
  "@Hedy"     = "business_docs/09_crm_features/audit-trail.md"
  "@Cassie"   = "business_docs/09_crm_features/analytics-dashboard.md"
  "@Jaime"    = "business_docs/09_crm_features/offers.md"
  "@Corinne"  = "business_docs/09_crm_features/ai-chat.md"
}

# -- Build new table rows ------------------------------------------------------
$gateIcons = @{
  "done"        = "DONE"
  "running"     = "RUNNING"
  "waiting_ack" = "ACK"
  "queued"      = "IN PROGRESS"
  "retrying"    = "IN PROGRESS"
  "failed"      = "BLOCKED"
  "escalated"   = "BLOCKED"
}

$agentOrder = @("@Victoria","@Invoice","@Sofia","@Cassie","@Joelle")

$tableLines = @()
$tableLines += "| Agent | Model | Current Task | File | Sections | Gate Status | Last Updated |"
$tableLines += "| --- | --- | --- | --- | --- | --- | --- |"

foreach ($a in $agentOrder) {
  if (-not $agentMap.ContainsKey($a)) { continue }
  $info  = $agentMap[$a]
  $model = if ($modelMap.ContainsKey($a)) { $modelMap[$a] } else { "Free" }
  $file  = if ($fileMap.ContainsKey($a)) { $fileMap[$a] } else { "--" }
  $done  = $info.done
  $total = $info.total
  $pct   = if ($total -gt 0) { [math]::Round(($done/$total)*100) } else { 0 }
  $gate  = if ($gateIcons.ContainsKey($info.status)) { $gateIcons[$info.status] } else { "IN PROGRESS" }
  $gateIcon = if ($done -eq $total -and $total -gt 0) { "DONE" } else { "IN PROGRESS" }
  $taskLabel = if ($null -ne $info.current) { $info.current } else { "(waiting)" }
  # truncate task label
  if ($taskLabel.Length -gt 60) { $taskLabel = $taskLabel.Substring(0,57) + "..." }
  $tableLines += "| **$a** | $model | $taskLabel | ``$file`` | $done/$total ($pct%) | $gateIcon | $today |"
}

$newTable = $tableLines -join "`n"

# -- Rewrite AGENTS.md sprint status table ------------------------------------
$agentsContent = Get-Content $agentsFile -Raw

# Locate the table header line and the next blank line after the table
$headerPattern = "| Agent         | Model              | Current Task"
$headerIdx = $agentsContent.IndexOf($headerPattern)

if ($headerIdx -lt 0) {
  Write-Host "[WARN] Could not locate sprint status table header in AGENTS.md. Skipping rewrite." -ForegroundColor Yellow
} else {
  # Find the end of the table: two consecutive newlines after header
  $tableStart = $headerIdx
  $searchFrom = $tableStart + 100  # skip past the header itself
  # Find first double-newline after the table header
  $tableEnd = $agentsContent.IndexOf("`n`n", $searchFrom)
  if ($tableEnd -lt 0) { $tableEnd = $agentsContent.IndexOf("`r`n`r`n", $searchFrom) }
  if ($tableEnd -lt 0) {
    Write-Host "[WARN] Could not find end of sprint table. Skipping rewrite." -ForegroundColor Yellow
  } else {
    $before  = $agentsContent.Substring(0, $tableStart)
    $after   = $agentsContent.Substring($tableEnd)
    $updated = $before + $newTable + "`n" + $after

    if ($DryRun) {
      Write-Host "[DRY-RUN] Would rewrite sprint table in AGENTS.md:" -ForegroundColor Yellow
      Write-Host $newTable
    } else {
      [System.IO.File]::WriteAllText($agentsFile, $updated, (New-Object System.Text.UTF8Encoding($false)))
      Write-Host "[UPDATED] AGENTS.md sprint status table rewritten." -ForegroundColor Green
    }
  }
}

# -- Append @Margaret sign-off to tracker -------------------------------------
$signOff = "`n## @Margaret Midday Gate Review -- $today $now`n`n"
$signOff += "Sprint status table in AGENTS.md updated automatically from queue state.`n`n"
$signOff += "| Lane | Progress | Gate |`n"
$signOff += "|------|----------|------|`n"
foreach ($l in @("A","B","C","D")) {
  $laneTasks = @($tasks | Where-Object { $_.lane -eq $l })
  $laneDone  = @($laneTasks | Where-Object { $_.status -eq "done" }).Count
  $laneTotal = $laneTasks.Count
  $lanePct   = if ($laneTotal -gt 0) { [math]::Round(($laneDone/$laneTotal)*100) } else { 0 }
  $laneGate  = if ($lanePct -eq 100) { "READY" } elseif ($lanePct -gt 0) { "IN PROGRESS" } else { "PENDING" }
  $signOff += "| $l | $laneDone/$laneTotal ($lanePct%) | $laneGate |`n"
}
$nReady = @($tasks | Where-Object { $_.status -eq "queued" } | Select-Object -ExpandProperty agent -Unique).Count
$nDone  = @($tasks | Where-Object { $_.status -eq "done" }).Count
$signOff += "`nOverall: $nDone/51 tasks done. $nReady agents with work queued. Coding phase: PENDING (awaiting 60% fast-track readiness gate).`n"
$signOff += "`n---`n"

if ($DryRun) {
  Write-Host "[DRY-RUN] Would append to DAILY_MILESTONE_TRACKER.md:" -ForegroundColor Yellow
  Write-Host $signOff
} else {
  $tracker = if (Test-Path $trackerFile) { Get-Content $trackerFile -Raw } else { "# DAILY_MILESTONE_TRACKER`n" }
  [System.IO.File]::WriteAllText($trackerFile, $tracker + $signOff, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "[UPDATED] DAILY_MILESTONE_TRACKER.md sign-off appended." -ForegroundColor Green
}

Write-Host ""
Write-Host "  @Margaret sync complete -- $today $now" -ForegroundColor Cyan
Write-Host "  Queue: $nDone/51 done | Agents active: $nReady" -ForegroundColor DarkGray
Write-Host ""