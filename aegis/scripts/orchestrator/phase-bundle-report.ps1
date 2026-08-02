# phase-bundle-report.ps1 -- Print a concise dashboard from phase-bundle telemetry JSON
param(
  [string]$ReportPath = "logs/orchestrator/phase-bundle-latest.json",
  [switch]$Json
)

$ErrorActionPreference = "Stop"

$resolvedPath = if ([System.IO.Path]::IsPathRooted($ReportPath)) {
  $ReportPath
} else {
  Join-Path (Get-Location) $ReportPath
}

if (-not (Test-Path $resolvedPath)) {
  Write-Host "[ERROR] Report not found: $resolvedPath" -ForegroundColor Red
  exit 1
}

$report = Get-Content $resolvedPath -Raw | ConvertFrom-Json

if ($Json) {
  $report | ConvertTo-Json -Depth 8
  exit 0
}

$statusColor = if ($report.pipelineStatus -eq "PASS") { "Green" } else { "Red" }

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PHASE BUNDLE TELEMETRY REPORT" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "File: $resolvedPath" -ForegroundColor DarkGray
Write-Host "Generated: $($report.generatedAt)" -ForegroundColor DarkGray
Write-Host "Status: $($report.pipelineStatus)" -ForegroundColor $statusColor
Write-Host "Cycles: $($report.cycles) | PhaseCount: $($report.phaseCount)" -ForegroundColor White
Write-Host "Flags: skipBuild=$($report.skipBuild) skipTests=$($report.skipTests)" -ForegroundColor White
Write-Host ""
Write-Host ("Summary -> total: {0}, pass: {1}, skipped: {2}, fail: {3}" -f $report.summary.total, $report.summary.pass, $report.summary.skipped, $report.summary.fail) -ForegroundColor White

if ($report.error -and $report.error.Trim().Length -gt 0) {
  Write-Host "Error: $($report.error)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Top Steps:" -ForegroundColor Cyan
$top = @($report.results | Select-Object -First 10)
foreach ($r in $top) {
  $c = if ($r.Status -eq "PASS") { "Green" } elseif ($r.Status -eq "SKIPPED") { "Yellow" } else { "Red" }
  Write-Host ("- {0} | {1} | {2}" -f $r.Phase, $r.Step, $r.Status) -ForegroundColor $c
}

if (@($report.results).Count -gt 10) {
  Write-Host ("... and {0} more steps" -f (@($report.results).Count - 10)) -ForegroundColor DarkGray
}

Write-Host "============================================================" -ForegroundColor Cyan
