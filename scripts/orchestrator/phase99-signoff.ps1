# phase99-signoff.ps1 -- Unified 99% completion signoff pipeline
# Runs policy gates, readiness packet generation, queue/milestone reports,
# build verification, and E2E verification to provide one-shot evidence.
param(
  [string]$WorkspaceRoot = ".",
  [switch]$SkipTests,
  [switch]$SkipBuild,
  [switch]$PrintOnly
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path $WorkspaceRoot

function Invoke-PhaseStep([string]$name, [string]$command) {
  Write-Host ""
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "[PHASE99] $name" -ForegroundColor Yellow
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "$command" -ForegroundColor DarkGray

  Push-Location $root
  try {
    & powershell -ExecutionPolicy Bypass -Command $command
    if ($LASTEXITCODE -ne 0) {
      throw "Step failed with exit code $LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }

  Write-Host "[OK] $name" -ForegroundColor Green
}

$results = [System.Collections.Generic.List[object]]::new()

function Add-Result([string]$step, [string]$status, [string]$notes) {
  $results.Add([PSCustomObject]@{
    Step = $step
    Status = $status
    Notes = $notes
  }) | Out-Null
}

try {
  Invoke-PhaseStep "Gate check (failed only)" "npm run orchestrator:gate-check:failed"
  Add-Result "Gate check" "PASS" "All failing gates resolved"

  Invoke-PhaseStep "Validate gates" "npm run orchestrator:validate-gates"
  Add-Result "Validate gates" "PASS" "Validation report refreshed"

  Invoke-PhaseStep "Readiness packet (force)" "npm run orchestrator:readiness-packet:force"
  Add-Result "Readiness packet" "PASS" "Wave readiness packet generated"

  Invoke-PhaseStep "Queue progress report" "npm run orchestrator:report:print"
  Add-Result "Queue report" "PASS" "Queue + tracker state printed"

  Invoke-PhaseStep "Milestone summary" "npm run orchestrator:milestone:summary"
  Add-Result "Milestone summary" "PASS" "Milestone readiness matrix refreshed"

  if (-not $SkipBuild) {
    Invoke-PhaseStep "Build verification" "npm run build"
    Add-Result "Build" "PASS" "Production build succeeded"
  }
  else {
    Add-Result "Build" "SKIPPED" "SkipBuild flag used"
  }

  if (-not $SkipTests) {
    Invoke-PhaseStep "E2E verification" "npx playwright test src/e2e"
    Add-Result "E2E verification" "PASS" "Stabilized Playwright src/e2e suite passed"
  }
  else {
    Add-Result "E2E verification" "SKIPPED" "SkipTests flag used"
  }

  Write-Host ""
  Write-Host "======================= PHASE 99 SUMMARY =======================" -ForegroundColor Green
  foreach ($r in $results) {
    $color = if ($r.Status -eq "PASS") { "Green" } elseif ($r.Status -eq "SKIPPED") { "Yellow" } else { "Red" }
    Write-Host ("{0,-22} {1,-8} {2}" -f $r.Step, $r.Status, $r.Notes) -ForegroundColor $color
  }
  Write-Host "===============================================================" -ForegroundColor Green

  if (-not $PrintOnly) {
    Write-Host ""
    Write-Host '@Ada - Context Ready (60% Readiness) - Coding Phase Approved' -ForegroundColor Magenta
    Write-Host "Phase 99 signoff pipeline completed." -ForegroundColor Magenta
  }

  exit 0
}
catch {
  Add-Result "Pipeline" "FAIL" "$_"

  Write-Host ""
  Write-Host "======================= PHASE 99 SUMMARY =======================" -ForegroundColor Red
  foreach ($r in $results) {
    $color = if ($r.Status -eq "PASS") { "Green" } elseif ($r.Status -eq "SKIPPED") { "Yellow" } else { "Red" }
    Write-Host ("{0,-22} {1,-8} {2}" -f $r.Step, $r.Status, $r.Notes) -ForegroundColor $color
  }
  Write-Host "===============================================================" -ForegroundColor Red

  Write-Host "[ERROR] Phase 99 signoff failed: $_" -ForegroundColor Red
  exit 1
}
