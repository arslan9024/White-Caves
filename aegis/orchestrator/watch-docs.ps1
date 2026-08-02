# watch-docs.ps1 -- Live watcher for business_docs/
# Fires on every file save: counts sections, compares to target, prints PASS/BLOCKED.
# Also updates gate-check summary and appends event to logs/orchestrator/watch-log.jsonl
param(
  [string]$WorkspaceRoot = ".",
  [int]$DebounceMs = 800   # ignore duplicate events within this window
)

$docsDir  = Join-Path $WorkspaceRoot "business_docs"
$logDir   = Join-Path $WorkspaceRoot "logs\orchestrator"
$watchLog = Join-Path $logDir "watch-log.jsonl"

if (-not (Test-Path $docsDir)) {
  Write-Host "[ERROR] business_docs/ not found at: $docsDir" -ForegroundColor Red; exit 1
}
if (-not (Test-Path $logDir)) { New-Item $logDir -ItemType Directory -Force | Out-Null }

# Target section counts (same as gate-check.ps1)
$targets = @{
  "compliance-requirements.md" = 12
  "tenancy-ejari.md"           = 14
  "landlord-portal.md"         = 13
  "financial-reporting.md"     = 11
  "revenue-model.md"           = 13
  "analytics-dashboard.md"     = 22
  "agent-performance.md"       = 14
  "README.md"                  = 40
  "dld-integration.md"         = 12
  "legal-management.md"        = 12
  "audit-trail.md"             = 10
  "activity-feed.md"           = 8
  "follow-up-automation.md"    = 10
  "off-plan-projects.md"       = 14
  "handover-management.md"     = 10
  "scheduling-calendar.md"     = 12
  "viewings.md"                = 10
  "offers.md"                  = 12
  "whatsapp-integration.md"    = 14
  "property-valuation.md"      = 10
  "market-intelligence.md"     = 10
  "market-analytics.md"        = 10
  "currency-management.md"     = 8
  "secondary-sales.md"         = 10
  "sentinel-property.md"       = 12
  "investment-management.md"   = 10
  "prospecting-outbound.md"    = 10
  "ai-chat.md"                 = 12
  "maintenance.md"             = 10
  "tenant-portal.md"           = 14
  "document-generation.md"     = 10
  "email-automation.md"        = 8
  "seo-strategy.md"            = 16
  "marketing-campaigns.md"     = 12
  "luxury-segment.md"          = 10
  "community-management.md"    = 8
}

function Get-SectionCount([string]$path) {
  if (-not (Test-Path $path)) { return 0 }
  $lines = Get-Content $path
  $h2 = @($lines | Where-Object { $_ -match "^##\s" }).Count
  $h3 = @($lines | Where-Object { $_ -match "^###\s" }).Count
  return $h2 + $h3
}

function Show-FileStatus([string]$filePath) {
  $name   = [System.IO.Path]::GetFileName($filePath)
  $target = if ($targets.ContainsKey($name)) { $targets[$name] } else { $null }
  $actual = Get-SectionCount $filePath
  $ts     = (Get-Date).ToString("HH:mm:ss")

  if ($null -eq $target) {
    Write-Host "  [$ts] ~ $name  ($actual sections -- no target defined)" -ForegroundColor DarkGray
    return
  }

  $pct    = [math]::Round(($actual / $target) * 100)
  $fill   = [math]::Min([math]::Floor($pct / 5), 20)
  $bar    = ("#" * $fill) + ("." * (20 - $fill))
  $status = if ($actual -ge $target) { "PASS" } else { "NEED" }
  $color  = if ($status -eq "PASS") { "Green" } else { "Yellow" }
  $arrow  = if ($status -eq "PASS") { "  OK" } else { "  --> need $($target - $actual) more sections to reach target $target" }

  Write-Host ("  [$ts] [{0}] {1,-38} [{2}] {3,3}/{4,3} {5}" -f $status, $name, $bar, $actual, $target, $arrow) -ForegroundColor $color

  # Append to watch log
  $entry = '{"ts":"' + (Get-Date -Format "yyyy-MM-ddTHH:mm:ss") + '","file":"' + $name + '","actual":' + $actual + ',"target":' + $target + ',"pct":' + $pct + ',"status":"' + $status + '"}'
  Add-Content -Path $watchLog -Value $entry -Encoding UTF8
}

# -- Set up FileSystemWatcher --------------------------------------------------
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path                  = $docsDir
$watcher.Filter                = "*.md"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter          = [System.IO.NotifyFilters]::LastWrite

$debounce = @{}

$action = {
  $filePath = $Event.SourceEventArgs.FullPath
  $now      = [datetime]::UtcNow
  $key      = $filePath.ToLower()
  if ($debounce.ContainsKey($key)) {
    $diff = ($now - $debounce[$key]).TotalMilliseconds
    if ($diff -lt $using:DebounceMs) { return }
  }
  $debounce[$key] = $now
  Show-FileStatus $filePath
}

$watcher.EnableRaisingEvents = $true
$job = Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- DOCS WATCHER  (watching business_docs/)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Watching: $docsDir" -ForegroundColor DarkGray
Write-Host "  Log:      $watchLog" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  [STATUS] [FILENAME                             ] [######..............] actual/target  note" -ForegroundColor DarkGray
Write-Host ""

try {
  while ($true) { Start-Sleep -Milliseconds 200 }
} finally {
  Unregister-Event -SourceIdentifier $job.Name -ErrorAction SilentlyContinue
  $watcher.EnableRaisingEvents = $false
  $watcher.Dispose()
  Write-Host "`n  [STOPPED] Watcher closed." -ForegroundColor DarkGray
}