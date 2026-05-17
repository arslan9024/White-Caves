# premium-efficiency-report.ps1 -- Weekly premium usage efficiency snapshot
# Usage:
#   npm run orchestrator:premium-efficiency
#   npm run orchestrator:premium-efficiency:brief

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Brief
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$progressFile = Join-Path $root "PROJECT_PROGRESS.md"
$w = 72

if (-not (Test-Path $progressFile)) {
  Write-Host "[ERROR] PROJECT_PROGRESS.md not found" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- PREMIUM EFFICIENCY REPORT" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

# Parse table rows in usage log (best-effort Markdown parsing)
$lines = Get-Content $progressFile
$usageRows = @($lines | Where-Object { $_ -match '^\|\s*May\s+\d{1,2}.*\|\s*\d+\s*\|\s*$' })

$totalRequests = 0
$rowsParsed = 0
$deliveryRows = 0
$verifiedRows = 0

foreach ($row in $usageRows) {
  $parts = $row.Split('|') | ForEach-Object { $_.Trim() }
  # expected rough shape: [", Date, Agent, Task, Requests Used, "]
  if ($parts.Count -ge 5) {
    $taskText = $parts[3]
    $reqText = $parts[4]
    $reqNum = 0
    if ([int]::TryParse($reqText, [ref]$reqNum)) {
      $totalRequests += $reqNum
      $rowsParsed++

      if ($taskText -match 'delivered|implemented|baseline|complete|kickoff') { $deliveryRows++ }
      if ($taskText -match '\d+/\d+\s*✅|tests?\s*✅|build pass|build verified') { $verifiedRows++ }
    }
  }
}

$deliveryPerRequest = if ($totalRequests -gt 0) { [math]::Round($deliveryRows / [double]$totalRequests, 2) } else { 0 }
$verifiedPerRequest = if ($totalRequests -gt 0) { [math]::Round($verifiedRows / [double]$totalRequests, 2) } else { 0 }

# Pull weekly quota headline if present
$weeklyLine = ($lines | Where-Object { $_ -match '^\|\s*Week of .*\|.*\|\s*\d+\s*\|' } | Select-Object -First 1)

Write-Host ("  Usage rows parsed: {0}" -f $rowsParsed) -ForegroundColor White
Write-Host ("  Total premium requests (parsed): {0}" -f $totalRequests) -ForegroundColor White
Write-Host ("  Delivery-tagged rows: {0}" -f $deliveryRows) -ForegroundColor White
Write-Host ("  Verified-tagged rows: {0}" -f $verifiedRows) -ForegroundColor White
Write-Host ("  Delivery per request: {0}" -f $deliveryPerRequest) -ForegroundColor Cyan
Write-Host ("  Verification per request: {0}" -f $verifiedPerRequest) -ForegroundColor Cyan

if (-not $Brief) {
  Write-Host ""
  if ($weeklyLine) {
    Write-Host "  Weekly quota row:" -ForegroundColor DarkGray
    Write-Host ("  {0}" -f $weeklyLine.Trim()) -ForegroundColor DarkGray
  }

  Write-Host ""
  Write-Host "  Recommendation:" -ForegroundColor Yellow
  Write-Host "  - Keep premium allocation tied to verified wave outputs (tests/build evidence)." -ForegroundColor Yellow
  Write-Host "  - Route all planning/research to free-model lanes first." -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
exit 0
