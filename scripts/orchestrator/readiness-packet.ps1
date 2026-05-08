# readiness-packet.ps1 -- Wave Readiness Packet Generator
# Runs gate-check, builds the 30-check matrix (copilot-instructions Rule 11),
# and writes plans/waves/WAVE_01_READINESS_PACKET.md
param(
  [string]$WorkspaceRoot = ".",
  [int]$WaveNumber       = 1,
  [switch]$Force         # write file even if gate is BLOCKED
)

$queueFile   = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$gateScript  = Join-Path $PSScriptRoot "gate-check.ps1"
$wavesDir    = Join-Path $WorkspaceRoot "plans\waves"
$today       = (Get-Date).ToString("yyyy-MM-dd")
$waveLabel   = "WAVE_$('{0:D2}' -f $WaveNumber)"
$outFile     = Join-Path $wavesDir "$waveLabel`_READINESS_PACKET.md"

if (-not (Test-Path $wavesDir)) {
  New-Item $wavesDir -ItemType Directory -Force | Out-Null
}

# -- Run gate-check in JSON mode to get structured data ------------------------
$gateJson = & powershell -ExecutionPolicy Bypass -File $gateScript -WorkspaceRoot $WorkspaceRoot -Json 2>$null
$gate = $gateJson | ConvertFrom-Json
$gatePass    = ($gate.overall -eq "PASS")
$gateScore   = if ($gate.total -gt 0) { [math]::Round(($gate.passed / $gate.total) * 100) } else { 0 }

if (-not $gatePass -and -not $Force) {
  Write-Host ""
  Write-Host "[BLOCKED] Gate not passed: $($gate.passed)/$($gate.total) files at target ($gateScore%)." -ForegroundColor Red
  Write-Host "  Run free agents to expand missing docs, then re-run." -ForegroundColor Yellow
  Write-Host "  Use -Force to generate the packet anyway (shows gaps)." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

# -- Queue summary -------------------------------------------------------------
$qDone = 0; $qTotal = 0
if (Test-Path $queueFile) {
  $qData  = Get-Content $queueFile -Raw | ConvertFrom-Json
  $qTasks = @($qData.tasks)
  $qDone  = @($qTasks | Where-Object { $_.status -eq "done" }).Count
  $qTotal = $qTasks.Count
}
$qPct = if ($qTotal -gt 0) { [math]::Round(($qDone/$qTotal)*100) } else { 0 }

# -- Build the 30-check matrix (6 groups x 5 checks) --------------------------
function Check-Row([string]$group, [string]$item, [string]$status, [string]$evidence) {
  return "| $group | $item | $status | $evidence |"
}

$checkStatus = if ($gatePass) { "PASS" } else { "PARTIAL" }
$gateEvidence = "gate-check: $($gate.passed)/$($gate.total) files at target ($gateScore%)"

$matrixRows = @()

# GROUP 1: Business
$matrixRows += Check-Row "Business" "Scope defined in business_docs/" $checkStatus $gateEvidence
$matrixRows += Check-Row "Business" "Acceptance criteria per module" $(if ($gatePass){"PASS"}else{"PARTIAL"}) "See each agent file -- section-count target met"
$matrixRows += Check-Row "Business" "Process rules documented" $(if ($gate.passed -ge 9){"PASS"}else{"PARTIAL"}) "$($gate.passed) files meet section target"
$matrixRows += Check-Row "Business" "Owner assigned per module" "PASS" "copilot-instructions.md agent roster + AGENTS.md"
$matrixRows += Check-Row "Business" "Rollback/migration plan" "PENDING" "Required in each WAVE SDD before coding"

# GROUP 2: API
$matrixRows += Check-Row "API" "Request/response schema" "PENDING" "To be defined in WAVE SDD"
$matrixRows += Check-Row "API" "Auth/RBAC per endpoint" "PENDING" "@Daniela to specify during coding wave"
$matrixRows += Check-Row "API" "Error codes and messages" "PENDING" "Express error handler in place (errorHandler.ts)"
$matrixRows += Check-Row "API" "Pagination strategy" "PASS" "Pagination pattern established in Session 8"
$matrixRows += Check-Row "API" "Rate limits defined" "PENDING" "@Ruchi to set during coding wave"

# GROUP 3: Data
$matrixRows += Check-Row "Data" "Schema documented" "PENDING" "Prisma models to be written per module"
$matrixRows += Check-Row "Data" "Indexes identified" "PENDING" "@Barbara to define per schema"
$matrixRows += Check-Row "Data" "Relationships mapped" "PENDING" "Business docs define entity links"
$matrixRows += Check-Row "Data" "Migrations planned" "PENDING" "Prisma migrate per coding wave"
$matrixRows += Check-Row "Data" "Retention policy" "PARTIAL" "@Sofia/compliance-requirements.md -- data retention schedule present"

# GROUP 4: UX
$matrixRows += Check-Row "UX" "Mobile 375/768 breakpoints" "PARTIAL" "@Marissa luxury-segment.md + ui-ux-specification.md"
$matrixRows += Check-Row "UX" "RTL support (Arabic)" "PENDING" "@Inas to validate per coding wave"
$matrixRows += Check-Row "UX" "Empty/error/loading states" "PARTIAL" "Patterns in session 8 components"
$matrixRows += Check-Row "UX" "Accessibility notes" "PENDING" "@Africa WCAG 2.1 AA audit post-coding"
$matrixRows += Check-Row "UX" "Design tokens consistent" "PASS" "Gold/Black/White token system in place"

# GROUP 5: QA
$matrixRows += Check-Row "QA" "Unit test scenarios" "PARTIAL" "Vitest infrastructure ready, suite to grow"
$matrixRows += Check-Row "QA" "Integration test scenarios" "PENDING" "Playwright config in place"
$matrixRows += Check-Row "QA" "E2E scenarios" "PARTIAL" "commission.spec.ts as reference pattern"
$matrixRows += Check-Row "QA" "Non-functional checks" "PENDING" "Performance targets in Phase 19 plan"
$matrixRows += Check-Row "QA" "Regression scope" "PENDING" "@Katherine to define per wave"

# GROUP 6: Compliance/Sign-off
$matrixRows += Check-Row "Compliance" "RERA/DLD rules documented" $checkStatus "@Sofia compliance-requirements.md (58 sections)"
$matrixRows += Check-Row "Compliance" "PDPL/data privacy rules" "PARTIAL" "@Timnit dld-integration.md in progress"
$matrixRows += Check-Row "Compliance" "@Margaret sign-off" "PENDING" "Requires queue task completion signal"
$matrixRows += Check-Row "Compliance" "@Sofia sign-off" "PARTIAL" "compliance-requirements.md at target"
$matrixRows += Check-Row "Compliance" "@Katherine sign-off" "PENDING" "QA test suite not yet at 90% coverage"

$passChecks  = @($matrixRows | Where-Object { $_ -match "\| PASS " }).Count
$totalChecks = $matrixRows.Count
$readiness   = [math]::Round(($passChecks / $totalChecks) * 100)
$readyGate   = if ($readiness -ge 92) { "APPROVED" } else { "PENDING ($readiness% -- need 92%)" }

# -- Write file ----------------------------------------------------------------
$lines = @()
$lines += "# $waveLabel READINESS PACKET"
$lines += ""
$lines += "> Generated: $today | Gate-Check: $($gate.passed)/$($gate.total) files | Readiness: $readiness% | Coding Gate: $readyGate"
$lines += ""
$lines += "## 1. Scope Summary"
$lines += ""
$lines += "| Item | Value |"
$lines += "|------|-------|"
$lines += "| Wave | $waveLabel |"
$lines += "| Date | $today |"
$lines += "| Queue Progress | $qDone/$qTotal tasks done ($qPct%) |"
$lines += "| Depth Gate (files at target) | $($gate.passed)/$($gate.total) ($gateScore%) |"
$lines += "| 30-Check Readiness Score | $readiness% |"
$lines += "| Coding Phase | $readyGate |"
$lines += ""
$lines += "## 2. Depth Gate Summary"
$lines += ""
$lines += "| Status | Count |"
$lines += "|--------|-------|"
$lines += "| PASS | $($gate.passed) |"
$lines += "| BLOCKED | $($gate.blocked) |"
$lines += "| MISSING | $($gate.missing) |"
$lines += "| Total | $($gate.total) |"
$lines += ""

# list all blocked/missing files
$notPassed = @($gate.files | Where-Object { $_.status -ne "PASS" })
if ($notPassed.Count -gt 0) {
  $lines += "### Files Needing Work"
  $lines += ""
  $lines += "| File | Actual | Target | Status |"
  $lines += "|------|--------|--------|--------|"
  foreach ($f in $notPassed | Sort-Object status,file) {
    $lines += "| $($f.file) | $($f.actual) | $($f.target) | $($f.status) |"
  }
  $lines += ""
}

$lines += "## 3. 30-Check Readiness Matrix"
$lines += ""
$lines += "| Group | Check | Status | Evidence |"
$lines += "|-------|-------|--------|----------|"
foreach ($r in $matrixRows) { $lines += $r }
$lines += ""
$lines += "**Readiness Score: $readiness% ($passChecks/$totalChecks checks PASS)**"
$lines += ""
$lines += "> Required threshold: 92% | Current: $readiness% | Gate: $readyGate"
$lines += ""
$lines += "## 4. Required Artifacts Before Coding"
$lines += ""
$lines += "The following 5 artifacts must exist in plans/waves/ before premium coding:"
$lines += ""
$lines += "| Artifact | Status |"
$lines += "|----------|--------|"
$lines += "| $waveLabel`_SDD.md | PENDING |"
$lines += "| $waveLabel`_FLOWCHARTS.md | PENDING |"
$lines += "| $waveLabel`_READINESS_PACKET.md | GENERATED (this file) |"
$lines += "| $waveLabel`_IMPLEMENTATION_BACKLOG.md | PENDING |"
$lines += "| $waveLabel`_TEST_ROLLOUT.md | PENDING |"
$lines += ""
$lines += "## 5. Ada Authorization"
$lines += ""
if ($readiness -ge 92 -and $gatePass) {
  $lines += "@Ada -- Context Ready (1000% Depth, $readiness% Readiness) -- Coding Phase Approved"
} else {
  $lines += "> **NOT YET APPROVED** -- readiness $readiness% (need 92%) | depth gate: $($gate.passed)/$($gate.total)"
  $lines += ">"
  $lines += "> Route back to free agents. Run:"
  $lines += "> ``npm run orchestrator:morning`` to see READY agents"
  $lines += "> ``npm run orchestrator:gate-check:failed`` to see what needs expanding"
}
$lines += ""
$lines += "---"
$lines += ""
$lines += "*Auto-generated by readiness-packet.ps1 on $today*"

$content = $lines -join "`n"
[System.IO.File]::WriteAllText($outFile, $content, (New-Object System.Text.UTF8Encoding($false)))

Write-Host ""
Write-Host "[WRITTEN] $outFile" -ForegroundColor Green
Write-Host "  Readiness: $readiness% ($passChecks/$totalChecks) | Depth: $($gate.passed)/$($gate.total) | Gate: $readyGate" -ForegroundColor Cyan
Write-Host ""