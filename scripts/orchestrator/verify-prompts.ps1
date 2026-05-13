# verify-prompts.ps1 -- Audit every prompts.json key against fast-complete gateTargets
# Reports: missing targets, unresolved paths, short prompts, orphaned keys, coverage.
# Exit 0 = all OK. Exit 1 = issues found (use in CI pre-flight).
#
# Usage:
#   npm run orchestrator:verify-prompts        -- full report
#   npm run orchestrator:verify-prompts:strict -- exit 1 if any WARNING

param(
  [string]$WorkspaceRoot = ".",
  [switch]$Strict          # exit 1 on any WARNING (not just ERROR)
)

$ErrorActionPreference = "Continue"
$root        = Resolve-Path $WorkspaceRoot
$promptsFile = Join-Path $root "scripts\orchestrator\prompts.json"
$queueFile   = Join-Path $root "logs\orchestrator\task-queue.json"
$w           = 72

# ------------------------------------------------------------------
# 1. Gate targets (canonical list -- must stay in sync with fast-complete.ps1)
# ------------------------------------------------------------------
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"    = 12
  "business_docs/05_requirements/risk-register.md"              = 5
  "business_docs/05_requirements/non-functional-requirements.md"= 8
  "business_docs/09_crm_features/tenancy-ejari.md"              = 14
  "business_docs/09_crm_features/landlord-portal.md"            = 13
  "business_docs/09_crm_features/financial-reporting.md"        = 11
  "business_docs/07_business_model/revenue-model.md"            = 13
  "business_docs/09_crm_features/analytics-dashboard.md"        = 22
  "business_docs/09_crm_features/agent-performance.md"          = 14
  "business_docs/03_ai_assistants/README.md"                    = 40
  "business_docs/09_crm_features/dld-integration.md"            = 12
  "business_docs/09_crm_features/legal-management.md"           = 12
  "business_docs/09_crm_features/audit-trail.md"                = 10
  "business_docs/09_crm_features/activity-feed.md"              = 8
  "business_docs/09_crm_features/follow-up-automation.md"       = 10
  "business_docs/09_crm_features/off-plan-projects.md"          = 14
  "business_docs/09_crm_features/handover-management.md"        = 10
  "business_docs/09_crm_features/scheduling-calendar.md"        = 12
  "business_docs/09_crm_features/viewings.md"                   = 10
  "business_docs/09_crm_features/offers.md"                     = 12
  "business_docs/09_crm_features/whatsapp-integration.md"       = 14
  "business_docs/09_crm_features/property-valuation.md"         = 10
  "business_docs/09_crm_features/market-intelligence.md"        = 10
  "business_docs/09_crm_features/market-analytics.md"           = 10
  "business_docs/09_crm_features/currency-management.md"        = 8
  "business_docs/09_crm_features/secondary-sales.md"            = 10
  "business_docs/09_crm_features/sentinel-property.md"          = 12
  "business_docs/09_crm_features/investment-management.md"      = 10
  "business_docs/09_crm_features/prospecting-outbound.md"       = 10
  "business_docs/09_crm_features/ai-chat.md"                    = 12
  "business_docs/09_crm_features/maintenance.md"                = 10
  "business_docs/09_crm_features/tenant-portal.md"              = 14
  "business_docs/09_crm_features/document-generation.md"        = 10
  "business_docs/09_crm_features/email-automation.md"           = 8
  "business_docs/09_crm_features/seo-strategy.md"               = 16
  "business_docs/09_crm_features/marketing-campaigns.md"        = 12
  "business_docs/09_crm_features/luxury-segment.md"             = 10
  "business_docs/09_crm_features/community-management.md"       = 8
  "business_docs/09_crm_features/careers.md"                    = 8
  "business_docs/09_crm_features/lead-tracking.md"              = 12
  "business_docs/09_crm_features/ui-ux-specification.md"        = 20
  "business_docs/06_design_architecture/system-architecture.md" = 12
}

$FALLBACK_MIN = 5
$MIN_PROMPT_LEN = 40   # warn if prompt is shorter than this

# ------------------------------------------------------------------
# 2. Resolve target file from a prompt string (same logic as fast-complete)
# ------------------------------------------------------------------
function Get-TargetFile([string]$prompt) {
  if ($prompt -match "(business_docs/[\w/_-]+\.md)") { return $Matches[1] }
  if ($prompt -match "\b([\w-]+\.md)\b") {
    $name = $Matches[1]
    # Check gateTargets for a matching entry
    foreach ($k in $gateTargets.Keys) {
      if ($k.EndsWith("/$name")) { return $k }
    }
    # Fallback: assume crm_features
    return "business_docs/09_crm_features/$name"
  }
  return ""
}

# ------------------------------------------------------------------
# 3. Load data
# ------------------------------------------------------------------
if (-not (Test-Path $promptsFile)) { Write-Host "[ERROR] prompts.json not found" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $queueFile))   { Write-Host "[ERROR] task-queue.json not found" -ForegroundColor Red; exit 1 }

$promptsJson = Get-Content $promptsFile -Raw | ConvertFrom-Json
$q           = Get-Content $queueFile   -Raw | ConvertFrom-Json
$tasks       = @($q.tasks)

$issues   = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$ok       = 0
$total    = 0

# Expected task IDs from queue
$queueIds = @($tasks | ForEach-Object { $_.taskId })

# ------------------------------------------------------------------
# 4. Per-prompt checks
# ------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host "  WHITE CAVES -- VERIFY PROMPTS" -ForegroundColor Yellow
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

foreach ($prop in $promptsJson.PSObject.Properties) {
  $id     = $prop.Name
  $prompt = $prop.Value
  $total++

  $rowIssues   = @()
  $rowWarnings = @()

  # Check 1: task ID exists in queue
  if ($queueIds -notcontains $id) {
    $rowIssues += "ORPHAN: task ID '$id' not in queue"
  }

  # Check 2: prompt length
  if ($prompt.Length -lt $MIN_PROMPT_LEN) {
    $rowWarnings += "SHORT: prompt only $($prompt.Length) chars (min $MIN_PROMPT_LEN)"
  }

  # Check 3: target file resolution
  $target = Get-TargetFile $prompt
  if ($target -eq "") {
    $rowIssues += "NO_TARGET: could not extract .md filename from prompt"
  } else {
    $absTarget = Join-Path $root $target.Replace("/","\")

    # Check 3a: file exists on disk
    if (-not (Test-Path $absTarget)) {
      $rowWarnings += "MISSING_FILE: '$target' not on disk"
    }

    # Check 3b: path is registered in gateTargets
    if (-not $gateTargets.ContainsKey($target)) {
      $rowWarnings += "NOT_IN_GATE: '$target' not in gateTargets (fast-complete uses fallback min=$FALLBACK_MIN)"
    }

    # Check 3c: if prompt uses bare filename but resolves differently than fallback
    $bareMatch = ""
    if ($prompt -match "\b([\w-]+\.md)\b") { $bareMatch = $Matches[1] }
    if ($bareMatch -ne "" -and -not ($prompt -match "business_docs/[\w/_-]+\.md")) {
      $fallback = "business_docs/09_crm_features/$bareMatch"
      if ($target -ne $fallback) {
        # Good: gateTargets resolved to a non-default path (like 05_requirements/)
        $rowWarnings += "PATH_RESOLVED: bare '$bareMatch' -> '$target' (not default crm_features path -- OK)"
      }
    }
  }

  # Collect results
  if ($rowIssues.Count -gt 0 -or $rowWarnings.Count -gt 0) {
    $color = if ($rowIssues.Count -gt 0) { "Red" } else { "Yellow" }
    $icon  = if ($rowIssues.Count -gt 0) { "[ERR]" } else { "[WRN]" }
    Write-Host ("  $icon  {0,-7} -> {1}" -f $id, $target) -ForegroundColor $color
    foreach ($i in $rowIssues)   { Write-Host ("         ERROR:   $i") -ForegroundColor Red;    $issues.Add("${id}: $i") }
    foreach ($w2 in $rowWarnings){ Write-Host ("         WARNING: $w2") -ForegroundColor Yellow; $warnings.Add("${id}: $w2") }
  } else {
    $ok++
  }
}

# ------------------------------------------------------------------
# 5. Check for queue tasks missing prompts
# ------------------------------------------------------------------
foreach ($t in $tasks) {
  $hasPrompt = $promptsJson.PSObject.Properties | Where-Object { $_.Name -eq $t.taskId }
  if (-not $hasPrompt) {
    $issues.Add("$($t.taskId): queue task has NO prompt in prompts.json")
    Write-Host ("  [ERR]  {0,-7} -> NO PROMPT in prompts.json" -f $t.taskId) -ForegroundColor Red
  }
}

# ------------------------------------------------------------------
# 6. Summary
# ------------------------------------------------------------------
Write-Host ""
Write-Host ("-" * $w) -ForegroundColor DarkGray
Write-Host ("  Prompts checked : $total") -ForegroundColor White
Write-Host ("  OK              : $ok") -ForegroundColor Green
Write-Host ("  Warnings        : $($warnings.Count)") -ForegroundColor Yellow
Write-Host ("  Errors          : $($issues.Count)") -ForegroundColor $(if($issues.Count -gt 0){"Red"}else{"Green"})
Write-Host ""

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
  Write-Host "  All prompts valid. fast-complete will resolve targets correctly." -ForegroundColor Green
} elseif ($issues.Count -eq 0) {
  Write-Host "  No errors. Warnings above are advisory only." -ForegroundColor Yellow
  Write-Host "  Consider adding WARNING paths to gateTargets in fast-complete.ps1" -ForegroundColor DarkGray
} else {
  Write-Host "  Errors found. Fix before running fast-complete." -ForegroundColor Red
}
Write-Host ("=" * $w) -ForegroundColor Cyan
Write-Host ""

$exitCode = 0
if ($issues.Count -gt 0) { $exitCode = 1 }
if ($Strict -and $warnings.Count -gt 0) { $exitCode = 1 }
exit $exitCode
