# gate-check.ps1 -- 1000% Depth Gate Validator
# Scans business_docs/ files and counts H2/H3 sections.
# Reports whether each file has reached its target depth.
# Prints an overall PASS / BLOCKED result for the coding gate.
param(
  [string]$WorkspaceRoot = ".",
  [switch]$FailedOnly,   # only show files that have not met target
  [switch]$Json          # output raw JSON for other scripts to consume
)

# Target section counts per file (from AGENTS.md quality gates)
$targets = @{
  "business_docs/05_requirements/compliance-requirements.md" = 12
  "business_docs/09_crm_features/tenancy-ejari.md"           = 14
  "business_docs/09_crm_features/landlord-portal.md"         = 13
  "business_docs/09_crm_features/financial-reporting.md"     = 11
  "business_docs/07_business_model/revenue-model.md"         = 13
  "business_docs/09_crm_features/analytics-dashboard.md"     = 22
  "business_docs/09_crm_features/agent-performance.md"       = 14
  "business_docs/03_ai_assistants/README.md"                 = 40
  "business_docs/09_crm_features/dld-integration.md"         = 12
  "business_docs/09_crm_features/legal-management.md"        = 12
  "business_docs/09_crm_features/audit-trail.md"             = 10
  "business_docs/09_crm_features/activity-feed.md"           = 8
  "business_docs/09_crm_features/follow-up-automation.md"    = 10
  "business_docs/09_crm_features/off-plan-projects.md"       = 14
  "business_docs/09_crm_features/handover-management.md"     = 10
  "business_docs/09_crm_features/scheduling-calendar.md"     = 12
  "business_docs/09_crm_features/viewings.md"                = 10
  "business_docs/09_crm_features/offers.md"                  = 12
  "business_docs/09_crm_features/whatsapp-integration.md"    = 14
  "business_docs/09_crm_features/property-valuation.md"      = 10
  "business_docs/09_crm_features/market-intelligence.md"     = 10
  "business_docs/09_crm_features/market-analytics.md"        = 10
  "business_docs/09_crm_features/currency-management.md"     = 8
  "business_docs/09_crm_features/secondary-sales.md"         = 10
  "business_docs/09_crm_features/sentinel-property.md"       = 12
  "business_docs/09_crm_features/investment-management.md"   = 10
  "business_docs/09_crm_features/prospecting-outbound.md"    = 10
  "business_docs/09_crm_features/ai-chat.md"                 = 12
  "business_docs/09_crm_features/maintenance.md"             = 10
  "business_docs/09_crm_features/tenant-portal.md"           = 14
  "business_docs/09_crm_features/document-generation.md"     = 10
  "business_docs/09_crm_features/email-automation.md"        = 8
  "business_docs/09_crm_features/seo-strategy.md"            = 16
  "business_docs/09_crm_features/marketing-campaigns.md"     = 12
  "business_docs/09_crm_features/luxury-segment.md"          = 10
  "business_docs/09_crm_features/community-management.md"    = 8
}

$results = @()
$passed  = 0
$blocked = 0
$missing = 0

foreach ($rel in ($targets.Keys | Sort-Object)) {
  $absPath = Join-Path $WorkspaceRoot $rel
  $target  = $targets[$rel]

  if (-not (Test-Path $absPath)) {
    $results += [PSCustomObject]@{
      file    = $rel
      target  = $target
      actual  = 0
      pct     = 0
      status  = "MISSING"
    }
    $missing++
    continue
  }

  $content  = Get-Content $absPath -Raw
  $lines    = $content -split "`n"
  # Count H2 (## ) and H3 (### ) headings
  $h2count  = @($lines | Where-Object { $_ -match "^##\s" }).Count
  $h3count  = @($lines | Where-Object { $_ -match "^###\s" }).Count
  $sections = $h2count + $h3count

  $pct      = if ($target -gt 0) { [math]::Round(($sections / $target) * 100) } else { 0 }
  $status   = if ($sections -ge $target) { "PASS" } else { "BLOCKED" }

  if ($status -eq "PASS") { $passed++ } else { $blocked++ }

  $results += [PSCustomObject]@{
    file    = $rel
    target  = $target
    actual  = $sections
    pct     = $pct
    status  = $status
  }
}

$totalFiles  = $results.Count
$overallPass = ($blocked -eq 0 -and $missing -eq 0)

if ($Json) {
  $out = @{
    timestamp   = (Get-Date).ToString("yyyy-MM-dd HH:mm")
    overall     = if ($overallPass) { "PASS" } else { "BLOCKED" }
    passed      = $passed
    blocked     = $blocked
    missing     = $missing
    total       = $totalFiles
    files       = $results
  }
  Write-Output ($out | ConvertTo-Json -Depth 4)
  exit 0
}

# -- Print report --------------------------------------------------------------
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- 1000% DEPTH GATE CHECK" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$statusColor = @{ "PASS"="Green"; "BLOCKED"="Red"; "MISSING"="Yellow" }

foreach ($r in $results) {
  if ($FailedOnly -and $r.status -eq "PASS") { continue }
  $bar   = ""
  $fill  = [math]::Min([math]::Floor($r.pct / 5), 20)
  for ($i=0;$i -lt $fill;$i++) { $bar += "#" }
  for ($i=$fill;$i -lt 20;$i++) { $bar += "." }
  $col   = if ($statusColor.ContainsKey($r.status)) { $statusColor[$r.status] } else { "White" }
  $label = "[$($r.status.PadRight(7))]"
  $pctStr = "$($r.pct)%".PadLeft(4)
  $fileShort = $r.file -replace "business_docs/","" -replace "09_crm_features/",""
  $fileShort = $fileShort.PadRight(40)
  Write-Host ("  {0} {1} [{2}] {3,3}/{4,3} sections" -f $label, $fileShort, $bar, $r.actual, $r.target) -ForegroundColor $col
}

Write-Host ""
Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray

$overallColor = if ($overallPass) { "Green" } else { "Red" }
$overallLabel = if ($overallPass) { "PASS -- All depth gates met. Coding phase may proceed." } else { "BLOCKED -- $blocked files below target, $missing missing. Route back to free agents." }
Write-Host "  $overallLabel" -ForegroundColor $overallColor
Write-Host "  Files: $totalFiles  |  PASS: $passed  |  BLOCKED: $blocked  |  MISSING: $missing" -ForegroundColor DarkGray
Write-Host ""

if (-not $overallPass) {
  Write-Host "  Next steps:" -ForegroundColor Yellow
  Write-Host "    npm run orchestrator:morning     (see READY agents)" -ForegroundColor Gray
  Write-Host "    npm run orchestrator:open-tool -- -AgentName `"@Sofia`"   (start with Lane A root)" -ForegroundColor Gray
  Write-Host ""
}

exit $(if ($overallPass) { 0 } else { 1 })