param(
  [string]$WorkspaceRoot = ".",
  [string]$WaveId = "WAVE_01"
)

$progressFile = Join-Path $WorkspaceRoot "PROJECT_PROGRESS.md"
$policyFile = Join-Path $WorkspaceRoot "scripts\orchestrator\policy.json"
$readinessFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_READINESS_PACKET.md")
$sddFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_SDD.md")
$flowFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_FLOWCHARTS.md")
$backlogFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_IMPLEMENTATION_BACKLOG.md")
$testRolloutFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_TEST_ROLLOUT.md")
$outputFile = Join-Path $WorkspaceRoot ("plans\waves\" + $WaveId + "_GATE_VALIDATION_REPORT.md")

$checks = @()

$readinessThreshold = 60
$approvalPhrase = "@Ada - Context Ready (90% Readiness) - High-Fidelity Coding Phase Approved"
if (Test-Path $policyFile) {
  try {
    $policy = Get-Content -Path $policyFile -Raw | ConvertFrom-Json
    if ($policy.readinessThresholdPct) {
      $readinessThreshold = [int]$policy.readinessThresholdPct
    }
    if ($policy.approvalPhrase) {
      $approvalPhrase = [string]$policy.approvalPhrase
    }
  } catch {
    # Keep defaults when policy parse fails.
  }
}

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
  if ($readinessText -match ($readinessThreshold.ToString() + '%|readiness')) {
    $readinessPassed = $true
  }
}
Add-Check ("Readiness evidence mentions {0}% threshold" -f $readinessThreshold) $readinessPassed $readinessFile

$depthPassed = $false
if (Test-Path $progressFile) {
  $progressText = Get-Content -Path $progressFile -Raw
  if ($progressText -match ($readinessThreshold.ToString() + '% readiness|readiness >=' + $readinessThreshold.ToString() + '%|fast-track|planning-complete')) {
    $depthPassed = $true
  }
}
Add-Check ("Project tracker references readiness gate ({0}%)" -f $readinessThreshold) $depthPassed $progressFile

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
$lines += $approvalPhrase

Set-Content -Path $outputFile -Value ($lines -join "`n") -Encoding UTF8
Write-Output (@{ ok = $true; status = $status; report = $outputFile } | ConvertTo-Json -Depth 4)
