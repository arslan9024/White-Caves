# readiness-target90.ps1 -- Evaluate documentation readiness against 90% target
# Usage:
#   npm run orchestrator:readiness:target90
#   npm run orchestrator:readiness:target90:brief
#   npm run orchestrator:readiness:target90:strict

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Brief,
  [switch]$Strict
)

$ErrorActionPreference = "Continue"
$root = Resolve-Path $WorkspaceRoot
$policyFile = Join-Path $root "scripts\orchestrator\policy.json"
$w = 72

# Canonical gate targets (same family as verify-prompts)
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md" = 12
  "business_docs/05_requirements/risk-register.md" = 5
  "business_docs/05_requirements/non-functional-requirements.md" = 8
  "business_docs/09_crm_features/tenancy-ejari.md" = 14
  "business_docs/09_crm_features/landlord-portal.md" = 13
  "business_docs/09_crm_features/financial-reporting.md" = 11
  "business_docs/07_business_model/revenue-model.md" = 13
  "business_docs/09_crm_features/analytics-dashboard.md" = 22
  "business_docs/09_crm_features/agent-performance.md" = 14
  "business_docs/03_ai_assistants/README.md" = 40
  "business_docs/09_crm_features/dld-integration.md" = 12
  "business_docs/09_crm_features/legal-management.md" = 12
  "business_docs/09_crm_features/audit-trail.md" = 10
  "business_docs/09_crm_features/activity-feed.md" = 8
  "business_docs/09_crm_features/follow-up-automation.md" = 10
  "business_docs/09_crm_features/off-plan-projects.md" = 14
  "business_docs/09_crm_features/handover-management.md" = 10
  "business_docs/09_crm_features/scheduling-calendar.md" = 12
  "business_docs/09_crm_features/viewings.md" = 10
  "business_docs/09_crm_features/offers.md" = 12
  "business_docs/09_crm_features/whatsapp-integration.md" = 14
  "business_docs/09_crm_features/property-valuation.md" = 10
  "business_docs/09_crm_features/market-intelligence.md" = 10
  "business_docs/09_crm_features/market-analytics.md" = 10
  "business_docs/09_crm_features/currency-management.md" = 8
  "business_docs/09_crm_features/secondary-sales.md" = 10
  "business_docs/09_crm_features/sentinel-property.md" = 12
  "business_docs/09_crm_features/investment-management.md" = 10
  "business_docs/09_crm_features/prospecting-outbound.md" = 10
  "business_docs/09_crm_features/ai-chat.md" = 12
  "business_docs/09_crm_features/maintenance.md" = 10
  "business_docs/09_crm_features/tenant-portal.md" = 14
  "business_docs/09_crm_features/document-generation.md" = 10
  "business_docs/09_crm_features/email-automation.md" = 8
  "business_docs/09_crm_features/seo-strategy.md" = 16
  "business_docs/09_crm_features/marketing-campaigns.md" = 12
  "business_docs/09_crm_features/luxury-segment.md" = 10
  "business_docs/09_crm_features/community-management.md" = 8
  "business_docs/09_crm_features/careers.md" = 8
  "business_docs/09_crm_features/lead-tracking.md" = 12
  "business_docs/06_design_architecture/ui-ux-specification.md" = 20
  "business_docs/06_design_architecture/system-architecture.md" = 12
}

$targetPct = 90
if (Test-Path $policyFile) {
  try {
    $policy = Get-Content $policyFile -Raw | ConvertFrom-Json
    if ($policy.readinessTargetPct) { $targetPct = [int]$policy.readinessTargetPct }
  } catch {}
}

function Get-SectionCount([string]$absPath) {
  if (-not (Test-Path $absPath)) { return 0 }
  return @(Get-Content $absPath | Where-Object { $_ -match '^##\s|^###\s' }).Count
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- READINESS TARGET CHECK" -ForegroundColor Yellow
Write-Host ("  Target: {0}%" -f $targetPct) -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

$below = [System.Collections.Generic.List[string]]::new()
$missing = [System.Collections.Generic.List[string]]::new()
$passed = 0
$total = $gateTargets.Keys.Count
$sumPct = 0

foreach ($rel in ($gateTargets.Keys | Sort-Object)) {
  $goal = [int]$gateTargets[$rel]
  $abs = Join-Path $root $rel.Replace('/','\\')
  if (-not (Test-Path $abs)) {
    $missing.Add($rel)
    if (-not $Brief) {
      Write-Host ("  [MISS] {0}" -f $rel) -ForegroundColor Red
    }
    continue
  }

  $cur = Get-SectionCount $abs
  $pct = [math]::Round(([math]::Min($cur, $goal) / [double]$goal) * 100)
  $sumPct += $pct

  if ($pct -lt $targetPct) {
    $below.Add(("{0} ({1}% of target {2} sections; current={3})" -f $rel, $pct, $goal, $cur))
    if (-not $Brief) {
      Write-Host ("  [LOW ] {0} -> {1}%" -f $rel, $pct) -ForegroundColor DarkYellow
    }
  } else {
    $passed++
    if (-not $Brief) {
      Write-Host ("  [PASS] {0} -> {1}%" -f $rel, $pct) -ForegroundColor Green
    }
  }
}

$avg = if ($total -gt 0) { [math]::Round($sumPct / [double]$total) } else { 0 }

Write-Host ""
Write-Host ("  Summary: pass={0}/{1}  below={2}  missing={3}  avg={4}%" -f $passed, $total, $below.Count, $missing.Count, $avg) -ForegroundColor White

if ($below.Count -gt 0) {
  Write-Host ""
  Write-Host "  BELOW TARGET FILES:" -ForegroundColor Yellow
  foreach ($x in $below) { Write-Host ("  - {0}" -f $x) -ForegroundColor Yellow }
}

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "  MISSING FILES:" -ForegroundColor Red
  foreach ($m in $missing) { Write-Host ("  - {0}" -f $m) -ForegroundColor Red }
}

Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan

if ($Strict -and ($below.Count -gt 0 -or $missing.Count -gt 0)) { exit 1 }
exit 0
