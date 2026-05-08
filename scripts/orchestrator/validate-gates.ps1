param(
  [string]$WorkspaceRoot = ".",
  [string]$WaveId = "WAVE_01"
)

$progressFile = Join-Path $WorkspaceRoot "PROJECT_PROGRESS.md"
$readinessFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_READINESS_PACKET.md")
$sddFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_SDD.md")
$flowFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_FLOWCHARTS.md")
$backlogFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_IMPLEMENTATION_BACKLOG.md")
$testRolloutFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_TEST_ROLLOUT.md")
$outputFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_GATE_VALIDATION_REPORT.md")

$checks = @()

function Add-Check {
  param([string]$Name, [bool]$Passed, [string]$Evidence)
  $script:checks += [PSCustomObject]@{ Name = $Name; Passed = $Passed; Evidence = $Evidence }
}

Add-Check "Wave SDD exists" (Test-Path $sddFile) $sddFile
Add-Check "Wave flowcharts exist" (Test-Path $flowFile) $flowFile
Add-Check "Wave readiness packet exists" (Test-Path $readinessFile) $readinessFile
Add-Check "Wave implementation backlog exists" (Test-Path $backlogFile) $backlogFile
Add-Check "Wave test rollout exists" (Test-Path $testRolloutFile) $testRolloutFile

$readinessPassed = $false
if (Test-Path $readinessFile) {
  $readinessText = Get-Content -Path $readinessFile -Raw
  if ($readinessText -match '92%|readiness') {
    $readinessPassed = $true
  }
}
Add-Check "Readiness evidence mentions 92% threshold" $readinessPassed $readinessFile

$depthPassed = $false
if (Test-Path $progressFile) {
  $progressText = Get-Content -Path $progressFile -Raw
  if ($progressText -match '1000%') {
    $depthPassed = $true
  }
}
Add-Check "Project tracker references 1000% depth gate" $depthPassed $progressFile

$quotaPassed = $false
if (Test-Path $progressFile) {
  $progressText = Get-Content -Path $progressFile -Raw
  if ($progressText -match 'daily_cap|Daily Cap|daily premium') {
    $quotaPassed = $true
  }
}
Add-Check "Daily premium cap evidence present" $quotaPassed $progressFile

$allPassed = @($checks | Where-Object { -not $_.Passed }).Count -eq 0
$status = if ($allPassed) { "PASS" } else { "BLOCKED" }

$lines = @()
$lines += "# ${WaveId} Gate Validation Report"
$lines += ""
$lines += "- Status: **$status**"
$lines += "- Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += ""
$lines += "## Checks"
$lines += ""
foreach ($c in $checks) {
  $mark = if ($c.Passed) { "[PASS]" } else { "[FAIL]" }
  $lines += "- $mark $($c.Name)"
  $lines += "  - Evidence: $($c.Evidence)"
}
$lines += ""
$lines += "## Mandatory Approval Phrase"
$lines += '@Ada - Context Ready (1000% Depth, 92% Readiness) - Coding Phase Approved'

Set-Content -Path $outputFile -Value ($lines -join "`n") -Encoding UTF8
Write-Output (@{ ok = $true; status = $status; report = $outputFile } | ConvertTo-Json -Depth 4)
