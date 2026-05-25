# fast-forward.ps1 -- One command: complete a task + auto-cascade all downstream.
#
# Shows the cascade preview, asks for confirmation, marks the root task done,
# then runs the fast-complete cascade to auto-finish every task whose target
# file already passes its gate.  Prints a live progress feed and a final diff.
#
# Usage:
#   npm run orchestrator:fast-forward -- -TaskId T002            -- full flow
#   npm run orchestrator:fast-forward -- -TaskId T002 -Force     -- skip confirmation
#   npm run orchestrator:fast-forward -- -TaskId T002 -DryRun    -- preview only
#   npm run orchestrator:fast-forward -- -TaskId T002 -NonInteractive  -- autonomous no-prompt
#   npm run orchestrator:fast-forward -- -TaskId T002 -Force -EvidenceNote "expanded dld-integration.md to 14 sections"

param(
  [Parameter(Mandatory = $true)]
  [string]$TaskId,
  [string]$WorkspaceRoot = ".",
  [string]$EvidenceNote  = "",
  [switch]$Force,
  [switch]$DryRun,
  [switch]$NonInteractive
)

$w        = 72
$root     = Resolve-Path $WorkspaceRoot
$scripts  = Join-Path $root "scripts\orchestrator"
$qFile    = Join-Path $root "logs\orchestrator\task-queue.json"
$pFile    = Join-Path $root "scripts\orchestrator\prompts.json"
$mutex    = New-Object System.Threading.Mutex($false, "Global\WhiteCaves_Orchestrator_Queue")
$FALLBACK = 5

# ------------------------------------------------------------------
# GATE TARGETS (canonical -- must match fast-complete.ps1)
# ------------------------------------------------------------------
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
  "business_docs/09_crm_features/analytics-dashboard.md"        = 22
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

# ------------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------------
function Read-Q {
  return (Get-Content $qFile -Raw | ConvertFrom-Json)
}

function Save-Q ($q) {
  $ok = $mutex.WaitOne(5000)
  try {
    $j = $q | ConvertTo-Json -Depth 12
    [System.IO.File]::WriteAllText($qFile, $j, (New-Object System.Text.UTF8Encoding($false)))
  } finally {
    if ($ok) { $mutex.ReleaseMutex() }
  }
}

function Get-SecCount ([string]$rel) {
  $abs = Join-Path $root $rel.Replace("/", "\")
  if (-not (Test-Path $abs)) { return 0 }
  return @(Get-Content $abs | Where-Object { $_ -match "^##\s|^###\s" }).Count
}

function Test-Pass ([string]$rel) {
  $c   = Get-SecCount $rel
  $tgt = if ($gateTargets.ContainsKey($rel)) { $gateTargets[$rel] } else { $FALLBACK }
  return ($c -ge $tgt)
}

function Get-TargetFile ([string]$pr) {
  if ($pr -match "(business_docs/[\w/_-]+\.md)") { return $Matches[1] }
  if ($pr -match "\b([\w-]+\.md)\b") {
    $n = $Matches[1]
    foreach ($k in $gateTargets.Keys) { if ($k.EndsWith("/$n")) { return $k } }
    return "business_docs/09_crm_features/$n"
  }
  return ""
}

function Test-DepsDone ([array]$deps, $all, $vDone) {
  if ($null -eq $deps -or $deps.Count -eq 0) { return $true }
  $vd = if ($null -ne $vDone -and $vDone -is [hashtable]) { $vDone } else { @{} }
  foreach ($d in $deps) {
    if ($vd.ContainsKey($d)) { continue }
    $dep = $all | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
    if ($null -eq $dep -or $dep.status -ne "done") { return $false }
  }
  return $true
}

function Get-DoneCount {
  $q = Read-Q
  return @($q.tasks | Where-Object { $_.status -eq "done" }).Count
}

function Get-ReadyCount ($all) {
  $c = 0
  foreach ($t in ($all | Where-Object { $_.status -eq "queued" })) {
    if (Test-DepsDone -deps @($t.dependsOn) -all $all -vDone @{}) { $c++ }
  }
  return $c
}

function Write-Div ([string]$col = "DarkGray") { Write-Host ("-" * $w) -ForegroundColor $col }
function Write-BigDiv ([string]$col = "Magenta") { Write-Host ("=" * $w) -ForegroundColor $col }

# ------------------------------------------------------------------
# VALIDATE INPUTS
# ------------------------------------------------------------------
if (-not (Test-Path $qFile)) {
  Write-Host "[ERROR] Queue not found: $qFile" -ForegroundColor Red; exit 1
}
if (-not (Test-Path $pFile)) {
  Write-Host "[ERROR] prompts.json not found: $pFile" -ForegroundColor Red; exit 1
}

$q0   = Read-Q
$all0 = @($q0.tasks)
$root0Task = $all0 | Where-Object { $_.taskId -eq $TaskId } | Select-Object -First 1

if ($null -eq $root0Task) {
  Write-Host ("[ERROR] Task not found: {0}" -f $TaskId) -ForegroundColor Red; exit 1
}
if ($root0Task.status -eq "done") {
  Write-Host ("[WARN] Task {0} is already done. Run fast-complete to pick up cascades." -f $TaskId) -ForegroundColor Yellow
  Write-Host "  npm run orchestrator:fast-complete" -ForegroundColor DarkGray; exit 0
}
if (-not (Test-DepsDone -deps @($root0Task.dependsOn) -all $all0 -vDone @{})) {
  Write-Host ("[ERROR] Task {0} is BLOCKED -- deps not all done:" -f $TaskId) -ForegroundColor Red
  foreach ($d in @($root0Task.dependsOn)) {
    $depTask = $all0 | Where-Object { $_.taskId -eq $d } | Select-Object -First 1
    $dStatus = if ($null -ne $depTask) { $depTask.status } else { "not_found" }
    Write-Host ("  dep {0}: {1}" -f $d, $dStatus) -ForegroundColor DarkGray
  }
  Write-Host "  Run: npm run orchestrator:blockers -- to see the full chain" -ForegroundColor DarkGray
  exit 1
}

$beforeDone  = Get-DoneCount
$beforeReady = Get-ReadyCount $all0

# ------------------------------------------------------------------
# HEADER
# ------------------------------------------------------------------
Write-BigDiv -col Cyan
Write-Host "  WHITE CAVES -- FAST-FORWARD" -ForegroundColor Cyan
Write-Host ("  {0}" -f (Get-Date -Format "dddd, MMMM d  HH:mm")) -ForegroundColor Cyan
if ($DryRun) { Write-Host "  MODE: DRY RUN (preview only -- no queue writes)" -ForegroundColor Yellow }
Write-BigDiv -col Cyan
Write-Host ""

# ------------------------------------------------------------------
# PRE-STATE
# ------------------------------------------------------------------
$prompt0  = ($q0.tasks | ForEach-Object {}) # placeholder
$prompts  = Get-Content $pFile -Raw | ConvertFrom-Json
$pr0      = $prompts.PSObject.Properties | Where-Object { $_.Name -eq $TaskId } | Select-Object -ExpandProperty Value
$pr0Text  = if ($pr0 -is [string]) { [string]$pr0 } elseif ($null -ne $pr0 -and $pr0.PSObject.Properties.Name -contains "prompt") { [string]$pr0.prompt } else { [string]$pr0 }
$tf0      = Get-TargetFile ($pr0Text -replace $null,"")
$secCount = if ($tf0 -ne "") { Get-SecCount $tf0 } else { 0 }
$tgtCount = if ($tf0 -ne "" -and $gateTargets.ContainsKey($tf0)) { $gateTargets[$tf0] } else { $FALLBACK }
$passes0  = if ($tf0 -ne "") { Test-Pass $tf0 } else { $false }

Write-Host ("  Root task : {0}  ({1})" -f $TaskId, $root0Task.agent) -ForegroundColor White
Write-Host ("  Title     : {0}" -f $root0Task.title) -ForegroundColor White
if ($tf0 -ne "") {
  $passStr = if ($passes0) { "[PASS]" } else { "[NEED $(($tgtCount - $secCount)) more sections]" }
  $passCol = if ($passes0) { "Green"  } else { "Yellow" }
  Write-Host ("  Gate file : {0}" -f (Split-Path $tf0 -Leaf)) -ForegroundColor DarkGray
  Write-Host ("  Gate      : {0}/{1} sections  {2}" -f $secCount, $tgtCount, $passStr) -ForegroundColor $passCol
}
Write-Host ""
Write-Host ("  Queue BEFORE : {0}/51 done  |  {1} READY" -f $beforeDone, $beforeReady) -ForegroundColor DarkGray
Write-Host ""

# ------------------------------------------------------------------
# CASCADE PREVIEW (call cascade-preview.ps1)
# ------------------------------------------------------------------
Write-Div
$cascadeScript = Join-Path $scripts "cascade-preview.ps1"
if (Test-Path $cascadeScript) {
  & powershell -ExecutionPolicy Bypass -File "$cascadeScript" -TaskId $TaskId -Brief -WorkspaceRoot $root 2>&1 | Write-Host
} else {
  Write-Host "  (cascade-preview.ps1 not found -- skipping preview)" -ForegroundColor DarkYellow
}
Write-Div
Write-Host ""

# ------------------------------------------------------------------
# CONFIRM
# ------------------------------------------------------------------
if ($DryRun) {
  Write-Host "  [DRY RUN] No changes made. Remove -DryRun to execute." -ForegroundColor Yellow
  Write-BigDiv -col Cyan
  exit 0
}

if (-not $Force -and -not $NonInteractive) {
  Write-Host "  Proceed? Mark {0} done and run cascade?  [y/N]" -f $TaskId -ForegroundColor Yellow
  $ans = Read-Host "  > "
  if ($ans.Trim().ToLower() -notin @("y","yes")) {
    Write-Host "  Cancelled." -ForegroundColor DarkGray; exit 0
  }
  Write-Host ""
} elseif ($NonInteractive -and -not $Force) {
  Write-Host "  [AUTO] Non-interactive mode enabled -- confirmation prompt skipped." -ForegroundColor DarkGray
  Write-Host ""
}

# ------------------------------------------------------------------
# STEP 1: Mark root task done directly in queue
# ------------------------------------------------------------------
Write-Host ("  [1/3] Marking {0} done ..." -f $TaskId) -ForegroundColor Cyan
$t0 = Get-Date
$q1 = Read-Q
$rootTask1 = @($q1.tasks) | Where-Object { $_.taskId -eq $TaskId } | Select-Object -First 1
if ($null -eq $rootTask1) {
  Write-Host "[ERROR] Could not re-read task from queue." -ForegroundColor Red; exit 1
}
$now = (Get-Date).ToString("o")
$ev  = if ([string]::IsNullOrWhiteSpace($EvidenceNote)) {
  if ($NonInteractive) {
    "Completed via fast-forward.ps1 non-interactive mode"
  } else {
    "Completed via fast-forward.ps1 -- manual paste session"
  }
} else {
  $EvidenceNote
}
$rootTask1 | Add-Member NoteProperty "status"       "done" -Force
$rootTask1 | Add-Member NoteProperty "startedAt"    $now   -Force
$rootTask1 | Add-Member NoteProperty "completedAt"  $now   -Force
$rootTask1 | Add-Member NoteProperty "evidenceNote" $ev    -Force
Save-Q $q1
Write-Host ("    [OK] {0} -> done" -f $TaskId) -ForegroundColor Green

# ------------------------------------------------------------------
# STEP 2: Run fast-complete cascade (picks up all now-auto-passable tasks)
# ------------------------------------------------------------------
Write-Host ""
Write-Host "  [2/3] Running fast-complete cascade ..." -ForegroundColor Cyan
Write-Host ""
$fcScript = Join-Path $scripts "fast-complete.ps1"
$autoCount = 0
if (Test-Path $fcScript) {
  $fcOut = & powershell -ExecutionPolicy Bypass -File "$fcScript" -WorkspaceRoot $root 2>&1 | Out-String
  # count DONE lines in output
  $autoCount = @($fcOut -split "`n" | Where-Object { $_ -match "^\s+DONE\s" }).Count
  # print filtered output (skip header/footer noise)
  $fcOut -split "`n" | Where-Object {
    $_ -match "DONE|SKIP|Cascade|Chain|Newly READY|newly" -and $_ -notmatch "^$"
  } | ForEach-Object { Write-Host ("    {0}" -f $_.Trim()) -ForegroundColor White }
} else {
  Write-Host "    [WARN] fast-complete.ps1 not found -- manual cascade required" -ForegroundColor Yellow
}

# ------------------------------------------------------------------
# STEP 3: Show post-state diff
# ------------------------------------------------------------------
Write-Host ""
Write-Host "  [3/3] Queue diff ..." -ForegroundColor Cyan
$q2 = Read-Q; $all2 = @($q2.tasks)
$afterDone  = Get-DoneCount
$afterReady = Get-ReadyCount $all2
$newDone    = $afterDone  - $beforeDone
$newReady   = $afterReady - $beforeReady
$elapsed    = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1)

Write-Host ""
Write-BigDiv -col Green
Write-Host "  FAST-FORWARD COMPLETE  ({0} s)" -f $elapsed -ForegroundColor Green

$donePct = [math]::Round($afterDone / 51 * 100, 0)
Write-Host ("  Queue AFTER  : {0}/51 done ({1}%)  |  {2} READY" -f $afterDone, $donePct, $afterReady) -ForegroundColor Green

if ($newDone -gt 0) {
  Write-Host ("  Done delta   : +{0} task(s)  ({1} -> {2})" -f $newDone, $beforeDone, $afterDone) -ForegroundColor Cyan
} else {
  Write-Host "  [WARN] No tasks were completed. Check gate files are at target section count." -ForegroundColor Yellow
  Write-Host "  Run: npm run orchestrator:health" -ForegroundColor DarkGray
}

if ($newReady -gt 0) {
  Write-Host ("  UNLOCKED     : +{0} newly READY task(s)" -f $newReady) -ForegroundColor Cyan
  $newlyReady = @($all2 | Where-Object { $_.status -eq "queued" } | Where-Object {
    $t2 = $_
    $was = @($q0.tasks | Where-Object { $_.taskId -eq $t2.taskId }) | Select-Object -First 1
    $wasReady = (Test-DepsDone -deps @($was.dependsOn) -all $all0 -vDone @{})
    $nowReady = (Test-DepsDone -deps @($t2.dependsOn)  -all $all2 -vDone @{})
    return (-not $wasReady -and $nowReady)
  })
  foreach ($nr in $newlyReady) {
    Write-Host ("    READY  {0,-8}  {1}" -f $nr.taskId, $nr.agent) -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "    npm run orchestrator:agent-loop       -- run next free-agent slot" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:cascade:all      -- see ranked impact of READY tasks" -ForegroundColor DarkGray
Write-Host "    npm run orchestrator:blockers:brief   -- see remaining gaps" -ForegroundColor DarkGray

$evShort = $ev -replace "'","''"
Write-Host ""
Write-Host "  Git commit hint:" -ForegroundColor DarkGray
Write-Host ("    git add -A ; git commit --no-verify -m ""docs(orchestrator): fast-forward {0} -- {1}""" -f $TaskId, ($ev -replace '"', "")) -ForegroundColor DarkGray

Write-BigDiv -col Green
Write-Host ""
