# tracker-sync-check.ps1 -- Detect drift between queue evidence and tracker docs
# Usage:
#   npm run orchestrator:tracker-sync
#   npm run orchestrator:tracker-sync:brief
#   npm run orchestrator:tracker-sync:strict

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Brief,
  [switch]$Strict
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"
$pendingFile = Join-Path $root "plans\PENDING_TASKS_ONLY.md"
$progressFile = Join-Path $root "PROJECT_PROGRESS.md"
$agentsFile = Join-Path $root "AGENTS.md"
$dailyFile = Join-Path $root "DAILY_MILESTONE_TRACKER.md"
$w = 72

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- TRACKER SYNC CHECK" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

$missingFiles = @()
foreach ($f in @($queueFile,$pendingFile,$progressFile,$agentsFile,$dailyFile)) {
  if (-not (Test-Path $f)) { $missingFiles += $f }
}

if ($missingFiles.Count -gt 0) {
  Write-Host "  [FAIL] Missing required tracker files:" -ForegroundColor Red
  foreach ($m in $missingFiles) { Write-Host ("  - {0}" -f $m) -ForegroundColor Red }
  exit 1
}

$q = Get-Content $queueFile -Raw | ConvertFrom-Json
$tasks = @($q.tasks)
$total = $tasks.Count
$done = @($tasks | Where-Object { $_.status -eq 'done' }).Count
$allDone = ($total -gt 0 -and $done -eq $total)

$pending = Get-Content $pendingFile -Raw
$progress = Get-Content $progressFile -Raw
$agents = Get-Content $agentsFile -Raw
$daily = Get-Content $dailyFile -Raw

$warnings = [System.Collections.Generic.List[string]]::new()
$passes = [System.Collections.Generic.List[string]]::new()

# Load policy to drive approval phrase check dynamically
$policyFile = Join-Path $root "scripts\orchestrator\policy.json"
$approvalPhrase = "@Ada - Context Ready (90% Readiness) - High-Fidelity Coding Phase Approved"
if (Test-Path $policyFile) {
  try {
    $pol = Get-Content $policyFile -Raw | ConvertFrom-Json
    if ($pol.approvalPhrase) { $approvalPhrase = [string]$pol.approvalPhrase }
  } catch { <# keep default #> }
}

# Aegis 150 linkage checks (replaces legacy Phase 27 specific checks)
$escapedPhrase = [regex]::Escape($approvalPhrase)
if ($pending -match $escapedPhrase) { $passes.Add('PENDING references Aegis approval phrase') } else { $warnings.Add('PENDING missing Aegis approval phrase reference') }
if ($progress -match '60% Readiness|daily_cap|readinessThresholdPct|Aegis') { $passes.Add('PROJECT_PROGRESS references readiness gate') } else { $warnings.Add('PROJECT_PROGRESS missing readiness gate evidence') }
if ($agents -match 'PHASE 27 ADDENDUM|Aegis|AEGIS') { $passes.Add('AGENTS includes Aegis or Phase 27 addendum') } else { $warnings.Add('AGENTS missing Aegis/Phase 27 addendum') }

# Approval phrase check in daily tracker (dynamic from policy)
if ($daily -match $escapedPhrase) {
  $passes.Add('DAILY tracker contains mandatory approval phrase')
} else {
  $warnings.Add('DAILY tracker missing mandatory approval phrase entry')
}

# Drift heuristic: queue fully done but pending still heavily not-started
$notStartedCount = ([regex]::Matches($pending, 'â¬œ\s+Not started')).Count
if ($allDone -and $notStartedCount -ge 3) {
  $warnings.Add("Queue is 100% done ($done/$total) but PENDING still has many Not started entries ($notStartedCount) -- sync recommended")
} else {
  $passes.Add('No major queue/pending drift detected by heuristic')
}

Write-Host ("  Queue summary: done={0}/{1}" -f $done, $total) -ForegroundColor White
Write-Host ("  PENDING 'Not started' markers: {0}" -f $notStartedCount) -ForegroundColor White

if (-not $Brief) {
  Write-Host ""
  Write-Host "  PASS CHECKS:" -ForegroundColor Green
  foreach ($p in $passes) { Write-Host ("  - {0}" -f $p) -ForegroundColor Green }

  if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "  WARNINGS:" -ForegroundColor Yellow
    foreach ($wmsg in $warnings) { Write-Host ("  - {0}" -f $wmsg) -ForegroundColor Yellow }
  }
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan

if ($Strict -and $warnings.Count -gt 0) { exit 1 }
exit 0
