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

# Phase 27 linkage checks
if ($pending -match 'PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS') { $passes.Add('PENDING links Phase 27 plan') } else { $warnings.Add('PENDING missing Phase 27 link') }
if ($progress -match 'MILESTONE-PHASE-27') { $passes.Add('PROJECT_PROGRESS has Phase 27 milestone') } else { $warnings.Add('PROJECT_PROGRESS missing Phase 27 milestone') }
if ($agents -match 'PHASE 27 ADDENDUM') { $passes.Add('AGENTS includes Phase 27 addendum') } else { $warnings.Add('AGENTS missing Phase 27 addendum') }

# Approval phrase check in daily tracker
if ($daily -match '@Ada\s+—\s+Context Ready \(60% Readiness\)\s+—\s+Coding Phase Approved') {
  $passes.Add('DAILY tracker contains mandatory approval phrase')
} else {
  $warnings.Add('DAILY tracker missing mandatory approval phrase entry')
}

# Drift heuristic: queue fully done but pending still heavily not-started
$notStartedCount = ([regex]::Matches($pending, '⬜\s+Not started')).Count
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
